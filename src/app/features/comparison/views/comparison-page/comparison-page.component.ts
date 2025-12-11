import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Observable, of, combineLatest } from 'rxjs';
import { takeUntil, catchError, shareReplay, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { ComparisonTableComponent } from '../../components/comparison-table/comparison-table.component';
import { ComparisonSearchFormHeaderComponent } from '../../components/comparison-search-form-header/comparison-search-form-header.component';
import { AhbService, AhbDiff, AhbDiffLine } from '../../../../core/api';
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
  ],
  templateUrl: './comparison-page.component.html',
})
export class ComparisonPageComponent implements OnInit, OnDestroy {
  pruefi = signal<string>('');
  formatVersionOld = signal<string>('');
  formatVersionNew = signal<string>('');

  diff$?: Observable<AhbDiff>;
  stats$?: Observable<DiffStats>;
  description$?: Observable<DiffDescription>;
  errorOccurred = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ahbService: AhbService,
    private readonly formatVersionCacheService: FormatVersionCacheService,
    private readonly title: Title
  ) {}

  ngOnInit(): void {
    this.loadFormatVersions();

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
    this.destroy$.next();
    this.destroy$.complete();
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
    this.updateTitle();

    this.diff$ = this.ahbService
      .getAhbDiff({
        pruefi: this.pruefi(),
        'format-version-a': this.formatVersionNew(),
        'format-version-b': this.formatVersionOld(),
      })
      .pipe(
        shareReplay(1),
        catchError(error => {
          this.errorOccurred = true;
          this.errorMessage =
            error.status === 404
              ? `Prüfidentifikator ${this.pruefi()} nicht in beiden Formatversionen gefunden.`
              : 'Ein Fehler ist aufgetreten.';
          return of({} as AhbDiff);
        })
      );

    this.stats$ = this.diff$.pipe(map(diff => this.computeStats(diff.lines || [])));
    this.description$ = this.diff$.pipe(
      map(diff => ({
        descriptionOld: diff.meta?.description_b,
        descriptionNew: diff.meta?.description_a,
      }))
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
    const parts = ['AHB Vergleich', this.pruefi()];
    if (this.formatVersionOld() && this.formatVersionNew()) {
      parts.push(`${this.formatVersionOld()} → ${this.formatVersionNew()}`);
    }
    this.title.setTitle(parts.filter(Boolean).join(' | '));
  }
}
