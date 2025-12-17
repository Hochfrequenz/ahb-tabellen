import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, of, combineLatest, forkJoin } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BreakpointObserver } from '@angular/cdk/layout';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { ComparisonTableComponent } from '../../components/comparison-table/comparison-table.component';
import { ComparisonSearchFormHeaderComponent } from '../../components/comparison-search-form-header/comparison-search-form-header.component';
import { AhbService, AhbDiff, AhbDiffLine, PrufidentifikatorenService } from '../../../../core/api';
import { FormatVersionCacheService } from '../../../search/services/format-version-cache.service';

export interface DiffStats {
  added: number;
  deleted: number;
  modified: number;
  unchanged: number;
  total: number;
}

export interface DiffDescription {
  descriptionOld?: string | null;
  descriptionNew?: string | null;
}

@Component({
  selector: 'app-comparison-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
    ComparisonTableComponent,
    ComparisonSearchFormHeaderComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comparison-page.component.html',
})
export class ComparisonPageComponent implements OnInit, OnDestroy {
  pruefi = signal<string>('');
  formatVersionOld = signal<string>('');
  formatVersionNew = signal<string>('');

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
  private readonly diffData = signal<AhbDiff | null>(null);

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
    pruefi: string;
    fvNew: string;
    fvOld: string;
    existsInOld: boolean;
    existsInNew: boolean;
  } | null>(null);

  /** Entertaining loading messages that rotate while waiting */
  readonly loadingMessages = [
    'Lade Vergleich...',
    'Durchforste die AHB-Zeilen...',
    'Vergleiche Formatversionen...',
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
    private readonly formatVersionCacheService: FormatVersionCacheService,
    private readonly title: Title,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.loadFormatVersions();
    this.initBreakpointObserver();

    // Combine params and queryParams to avoid race condition
    combineLatest([this.route.params, this.route.queryParams])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([params, queryParams]) => {
        const pruefi = params['pruefi'];
        const fvOld = queryParams['fv-old'];
        const fvNew = queryParams['fv-new'];

        if (pruefi) this.pruefi.set(pruefi);
        if (fvOld) this.formatVersionOld.set(fvOld);
        if (fvNew) this.formatVersionNew.set(fvNew);

        this.updateTitle();

        if (this.pruefi() && this.formatVersionOld() && this.formatVersionNew()) {
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

  private loadFormatVersions(): void {
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: versions => {
          if (!this.formatVersionNew() && versions.length >= 2) {
            this.formatVersionNew.set(versions[versions.length - 1]);
            this.formatVersionOld.set(versions[versions.length - 2]);
          }
        },
      });
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

  onVersionOldChange(version: string): void {
    this.navigateToComparison(this.pruefi(), version, this.formatVersionNew());
  }

  onVersionNewChange(version: string): void {
    this.navigateToComparison(this.pruefi(), this.formatVersionOld(), version);
  }

  onPruefiChange(pruefi: string): void {
    this.navigateToComparison(pruefi, this.formatVersionOld(), this.formatVersionNew());
  }

  private navigateToComparison(pruefi: string, fvOld: string, fvNew: string): void {
    if (pruefi && fvOld && fvNew) {
      this.router.navigate(['/compare', pruefi], {
        queryParams: {
          'fv-old': fvOld,
          'fv-new': fvNew,
        },
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
      .getAhbDiff({
        pruefi: this.pruefi(),
        'format-version-new': this.formatVersionNew(),
        'format-version-old': this.formatVersionOld(),
      })
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          this.errorOccurred = true;
          if (error.status === 404) {
            // Check which version(s) contain the pruefi to provide accurate error message
            return this.checkPruefiExistence().pipe(
              switchMap(({ existsInOld, existsInNew }) => {
                this.errorDetails.set({
                  pruefi: this.pruefi(),
                  fvNew: this.formatVersionNew(),
                  fvOld: this.formatVersionOld(),
                  existsInOld,
                  existsInNew,
                });
                this.errorMessage = '';
                return of(null);
              })
            );
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
    const pruefi = this.pruefi();
    return forkJoin({
      existsInOld: this.prufidentifikatorenService
        .getPruefis({ 'format-version': this.formatVersionOld() })
        .pipe(
          catchError(() => of([])),
          switchMap(pruefis => of(pruefis.some(p => p.pruefidentifikator === pruefi)))
        ),
      existsInNew: this.prufidentifikatorenService
        .getPruefis({ 'format-version': this.formatVersionNew() })
        .pipe(
          catchError(() => of([])),
          switchMap(pruefis => of(pruefis.some(p => p.pruefidentifikator === pruefi)))
        ),
    });
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
    const parts = ['AHB Vergleich', this.pruefi()];
    if (this.formatVersionOld() && this.formatVersionNew()) {
      parts.push(`${this.formatVersionOld()} → ${this.formatVersionNew()}`);
    }
    this.title.setTitle(parts.filter(Boolean).join(' | '));
  }
}
