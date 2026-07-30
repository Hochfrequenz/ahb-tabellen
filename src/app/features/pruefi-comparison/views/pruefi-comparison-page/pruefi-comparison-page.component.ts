import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, of, combineLatest } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver } from '@angular/cdk/layout';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { ComparisonTableComponent } from '../../../comparison/components/comparison-table/comparison-table.component';
import { PruefiComparisonSearchFormHeaderComponent } from '../../components/pruefi-comparison-search-form-header/pruefi-comparison-search-form-header.component';
import {
  AhbService,
  AhbPruefiDiff,
  AhbDiffLine,
  PrufidentifikatorenService,
} from '../../../../core/api';
import { getCurrentEdifactFormatVersion } from '@hochfrequenz/efoli';
import { DiffStats } from '../../../comparison/views/comparison-page/comparison-page.component';

@Component({
  selector: 'app-pruefi-comparison-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
    ComparisonTableComponent,
    PruefiComparisonSearchFormHeaderComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './pruefi-comparison-page.component.html',
})
export class PruefiComparisonPageComponent implements OnInit, OnDestroy {
  pruefiOld = signal<string>('');
  pruefiNew = signal<string>('');
  formatVersion = signal<string>('');

  /** Whether the viewport is at least medium (768px) - Tailwind's md breakpoint */
  isDesktop = signal<boolean>(false);

  /** Filter visibility states (all visible by default) */
  showUnchanged = signal(true);
  showAdded = signal(true);
  showDeleted = signal(true);
  showModified = signal(true);

  /** Column visibility: conditions/hints/formats column (hidden by default) */
  showConditionsColumn = signal(false);

  /** Filter toggle button configurations */
  readonly filterToggles = [
    {
      key: 'unchanged' as const,
      signal: this.showUnchanged,
      symbol: '=',
      title: 'Unveränderte Zeilen ein-/ausblenden',
      colorClasses: 'bg-white text-hf-text-color focus:ring-gray-400 hover:ring-gray-400',
    },
    {
      key: 'added' as const,
      signal: this.showAdded,
      symbol: '+',
      title: 'Hinzugefügte Zeilen ein-/ausblenden',
      colorClasses:
        'bg-hf-positive-light text-hf-positive-dark focus:ring-hf-positive-dark hover:ring-hf-positive-dark',
    },
    {
      key: 'deleted' as const,
      signal: this.showDeleted,
      symbol: '-',
      title: 'Gelöschte Zeilen ein-/ausblenden',
      colorClasses:
        'bg-hf-negative-light text-hf-negative-dark focus:ring-hf-negative-dark hover:ring-hf-negative-dark',
    },
    {
      key: 'modified' as const,
      signal: this.showModified,
      symbol: '~',
      title: 'Geänderte Zeilen ein-/ausblenden',
      colorClasses:
        'bg-hf-neutral-light text-hf-neutral-dark focus:ring-hf-neutral-dark hover:ring-hf-neutral-dark',
    },
  ];

  /** Current diff data as a signal for reactive filtering */
  private readonly diffData = signal<AhbPruefiDiff | null>(null);

  /** Computed filtered lines based on filter toggle states - automatically updates when filters or diff data change */
  readonly filteredLines = computed(() => {
    const diff = this.diffData();
    if (!diff?.lines) return [];

    return diff.lines.filter(line => {
      switch (line.diff_status) {
        case 'unchanged':
          return this.showUnchanged();
        case 'added':
          return this.showAdded();
        case 'deleted':
          return this.showDeleted();
        case 'modified':
          return this.showModified();
        default:
          return true;
      }
    });
  });

  /** Computed statistics from diff data */
  readonly stats = computed(() => {
    const diff = this.diffData();
    return diff?.lines ? this.computeStats(diff.lines) : null;
  });

  /** Computed description from diff data */
  readonly description = computed(() => {
    const diff = this.diffData();
    return diff?.meta
      ? {
          descriptionOld: diff.meta.description_old,
          descriptionNew: diff.meta.description_new,
        }
      : null;
  });

  isLoading = signal(false);
  errorOccurred = false;
  errorMessage = '';
  errorDetails = signal<{
    pruefiOld: string;
    pruefiNew: string;
    formatVersion: string;
    existsOld: boolean;
    existsNew: boolean;
  } | null>(null);

  /** Entertaining loading messages that rotate while waiting */
  readonly loadingMessages = [
    'Lade Vergleich...',
    'Durchforste die AHB-Zeilen...',
    'Vergleiche Prüfidentifikatoren...',
    'Suche nach Unterschieden...',
    'Analysiere Änderungen...',
    'Fast geschafft...',
    'Die Bits werden sortiert...',
    'Kaffee wäre jetzt gut...',
    'Geduld ist eine Tugend...',
    'EDIFACT wird entschlüsselt...',
  ];
  currentMessageIndex = signal(0);
  private messageInterval?: ReturnType<typeof setInterval>;
  readonly currentLoadingMessage = computed(() => this.loadingMessages[this.currentMessageIndex()]);

  private destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ahbService: AhbService,
    private readonly prufidentifikatorenService: PrufidentifikatorenService,
    private readonly title: Title,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.initBreakpointObserver();

    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        const pruefiOld = params['pruefiOld'];
        const pruefiNew = params['pruefiNew'];
        const formatVersionParam = queryParams['format-version'];

        const resolvedFormatVersion =
          formatVersionParam?.toLowerCase() === 'current'
            ? getCurrentEdifactFormatVersion()
            : formatVersionParam;

        if (formatVersionParam?.toLowerCase() === 'current' && resolvedFormatVersion) {
          this.navigateToComparison(pruefiOld, pruefiNew, resolvedFormatVersion, true);
          return;
        }

        if (pruefiOld) this.pruefiOld.set(pruefiOld);
        if (pruefiNew) this.pruefiNew.set(pruefiNew);
        if (resolvedFormatVersion) this.formatVersion.set(resolvedFormatVersion);

        this.updateTitle();

        if (this.pruefiOld() && this.pruefiNew() && this.formatVersion()) {
          this.loadDiff();
        }
      });
  }

  ngOnDestroy(): void {
    this.stopMessageRotation();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startMessageRotation(): void {
    this.currentMessageIndex.set(0);
    this.messageInterval = setInterval(() => {
      this.currentMessageIndex.update(i => (i + 1) % this.loadingMessages.length);
    }, 2500);
  }

  private stopMessageRotation(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = undefined;
    }
  }

  private initBreakpointObserver(): void {
    // Tailwind's md breakpoint is 768px
    this.breakpointObserver
      .observe(['(min-width: 768px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.isDesktop.set(result.matches);
      });
  }

  onFormatVersionChange(formatVersion: string): void {
    this.navigateToComparison(this.pruefiOld(), this.pruefiNew(), formatVersion);
  }

  onPruefiOldChange(pruefiOld: string): void {
    this.navigateToComparison(pruefiOld, this.pruefiNew(), this.formatVersion());
  }

  onPruefiNewChange(pruefiNew: string): void {
    this.navigateToComparison(this.pruefiOld(), pruefiNew, this.formatVersion());
  }

  private navigateToComparison(
    pruefiOld: string,
    pruefiNew: string,
    formatVersion: string,
    replaceUrl = false
  ): void {
    if (pruefiOld && pruefiNew && formatVersion) {
      this.router.navigate(['/compare-pruefis', pruefiOld, pruefiNew], {
        queryParams: {
          'format-version': formatVersion,
        },
        replaceUrl,
      });
    }
  }

  private loadDiff(): void {
    this.errorOccurred = false;
    this.errorMessage = '';
    this.errorDetails.set(null);
    this.isLoading.set(true);
    this.startMessageRotation();
    this.diffData.set(null);
    this.updateTitle();

    this.ahbService
      .getPruefiDiff({
        pruefiOld: this.pruefiOld(),
        pruefiNew: this.pruefiNew(),
        'format-version': this.formatVersion(),
      })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.errorOccurred = true;
          if (error.status === 404) {
            return this.checkPruefiExistence().pipe(
              switchMap(({ existsOld, existsNew }) => {
                this.errorDetails.set({
                  pruefiOld: this.pruefiOld(),
                  pruefiNew: this.pruefiNew(),
                  formatVersion: this.formatVersion(),
                  existsOld,
                  existsNew,
                });
                this.errorMessage = '';
                return of(null);
              })
            );
          } else if (error.status === 400) {
            this.errorDetails.set(null);
            this.errorMessage =
              error.error?.message ?? 'Die beiden Prüfidentifikatoren müssen unterschiedlich sein.';
            return of(null);
          } else {
            this.errorDetails.set(null);
            this.errorMessage = 'Ein Fehler ist aufgetreten.';
            return of(null);
          }
        })
      )
      .subscribe(diff => {
        this.stopMessageRotation();
        this.diffData.set(diff);
        this.isLoading.set(false);
      });
  }

  private checkPruefiExistence() {
    const formatVersion = this.formatVersion();
    return this.prufidentifikatorenService.getPruefis({ 'format-version': formatVersion }).pipe(
      catchError(() => of([])),
      switchMap(pruefis => {
        const ids = pruefis.map(p => p.pruefidentifikator);
        return of({
          existsOld: ids.includes(this.pruefiOld()),
          existsNew: ids.includes(this.pruefiNew()),
        });
      })
    );
  }

  private computeStats(lines: AhbDiffLine[]): DiffStats {
    const stats: DiffStats = { added: 0, deleted: 0, modified: 0, unchanged: 0, total: 0 };
    for (const line of lines) {
      stats.total++;
      switch (line.diff_status) {
        case 'added':
          stats.added++;
          break;
        case 'deleted':
          stats.deleted++;
          break;
        case 'modified':
          stats.modified++;
          break;
        default:
          stats.unchanged++;
      }
    }
    return stats;
  }

  private updateTitle(): void {
    const parts = ['AHB Prüfi-Vergleich', this.pruefiOld(), this.pruefiNew()];
    if (this.formatVersion()) {
      parts.push(this.formatVersion());
    }
    this.title.setTitle(parts.filter(Boolean).join(' | '));
  }
}
