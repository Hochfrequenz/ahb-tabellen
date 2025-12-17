import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AhbService, PrufidentifikatorenService } from '../../../../core/api';
import { AhbDiffSummary } from '../../../../core/api/models';
import { getFormatFromPruefi, getAllFormats } from '../../../../shared/utils/pruefi-format.utils';

interface PruefiComparison {
  pruefidentifikator: string;
  name: string;
  existsInOld: boolean;
  existsInNew: boolean;
  status: 'added' | 'removed' | 'unchanged';
}

interface FormatGroup {
  format: string;
  pruefis: PruefiComparison[];
  addedCount: number;
  removedCount: number;
}

@Component({
  selector: 'app-pruefi-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MatExpansionModule, MatProgressSpinnerModule],
  templateUrl: './pruefi-overview.component.html',
  styleUrl: './pruefi-overview.component.scss',
})
export class PruefiOverviewComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);
  private readonly ahbService = inject(AhbService);

  @Input() formatVersionOld = '';
  @Input() formatVersionNew = '';

  isLoading = false;
  errorMessage: string | null = null;
  formatGroups: FormatGroup[] = [];
  diffSummary = signal<AhbDiffSummary>({});

  constructor(private readonly prufidentifikatorenService: PrufidentifikatorenService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes['formatVersionOld'] || changes['formatVersionNew']) &&
      this.formatVersionOld &&
      this.formatVersionNew &&
      this.formatVersionOld !== this.formatVersionNew
    ) {
      this.loadComparison();
    }
  }

  private loadComparison(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.diffSummary.set({});

    // Load prüfi lists first (required for display)
    forkJoin({
      oldPruefis: this.prufidentifikatorenService.getPruefis({
        'format-version': this.formatVersionOld,
      }),
      newPruefis: this.prufidentifikatorenService.getPruefis({
        'format-version': this.formatVersionNew,
      }),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ oldPruefis, newPruefis }) => {
          this.processComparison(oldPruefis, newPruefis);
          this.isLoading = false;

          // Load diff summary lazily in the background (for "=" badges)
          this.loadDiffSummary();
        },
        error: error => {
          const statusText = error?.status ? ` (Status: ${error.status})` : '';
          this.errorMessage = `Fehler beim Laden der Prüfidentifikatoren für ${this.formatVersionOld} und ${this.formatVersionNew}${statusText}. Bitte versuchen Sie es später erneut.`;
          this.isLoading = false;
        },
      });
  }

  private loadDiffSummary(): void {
    this.ahbService
      .getAhbDiffSummary({
        'format-version-new': this.formatVersionNew,
        'format-version-old': this.formatVersionOld,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: diffSummary => this.diffSummary.set(diffSummary),
        error: () => {
          // Silently fail - badges are optional enhancement
        },
      });
  }

  private processComparison(
    oldPruefis: Array<{ pruefidentifikator?: string; name?: string }>,
    newPruefis: Array<{ pruefidentifikator?: string; name?: string }>
  ): void {
    // Filter out undefined values to ensure type safety in Set operations
    const oldSet = new Set(
      oldPruefis.map(p => p.pruefidentifikator).filter((id): id is string => id !== undefined)
    );
    const newSet = new Set(
      newPruefis.map(p => p.pruefidentifikator).filter((id): id is string => id !== undefined)
    );

    // Create a map for names (prefer new name, fallback to old)
    const nameMap = new Map<string, string>();
    oldPruefis.forEach(p => {
      if (p.pruefidentifikator) {
        nameMap.set(p.pruefidentifikator, p.name || '');
      }
    });
    newPruefis.forEach(p => {
      if (p.pruefidentifikator) {
        nameMap.set(p.pruefidentifikator, p.name || '');
      }
    });

    // Get all unique pruefis
    const allPruefis = new Set([...oldSet, ...newSet]);

    // Build comparison list (allPruefis is guaranteed to contain only strings)
    const comparisons: PruefiComparison[] = [];
    allPruefis.forEach(pruefi => {
      const existsInOld = oldSet.has(pruefi);
      const existsInNew = newSet.has(pruefi);

      let status: 'added' | 'removed' | 'unchanged';
      if (existsInOld && existsInNew) {
        status = 'unchanged';
      } else if (existsInNew) {
        status = 'added';
      } else {
        status = 'removed';
      }

      comparisons.push({
        pruefidentifikator: pruefi,
        name: nameMap.get(pruefi) || '',
        existsInOld,
        existsInNew,
        status,
      });
    });

    // Group by format (use 'Unbekannt' for unknown prefixes that return empty string)
    const formatMap = new Map<string, PruefiComparison[]>();
    comparisons.forEach(comp => {
      const format = getFormatFromPruefi(comp.pruefidentifikator) || 'Unbekannt';
      if (!formatMap.has(format)) {
        formatMap.set(format, []);
      }
      formatMap.get(format)!.push(comp);
    });

    // Sort pruefis within each group
    formatMap.forEach(pruefis => {
      pruefis.sort((a, b) => a.pruefidentifikator.localeCompare(b.pruefidentifikator));
    });

    // Build format groups sorted by format name
    // Note: Using two separate filter() calls for addedCount/removedCount rather than a single
    // reduce() pass. While this iterates twice, the arrays are small (~10-50 items per format)
    // and the declarative filter approach is more readable. The performance difference is negligible.
    const allFormats = getAllFormats();
    this.formatGroups = allFormats
      .filter(format => formatMap.has(format))
      .map(format => {
        const pruefis = formatMap.get(format)!;
        return {
          format,
          pruefis,
          addedCount: pruefis.filter(p => p.status === 'added').length,
          removedCount: pruefis.filter(p => p.status === 'removed').length,
        };
      });

    // Add any formats not in the known list (e.g., 'Unbekannt' for unknown prefixes)
    formatMap.forEach((pruefis, format) => {
      if (!allFormats.includes(format)) {
        this.formatGroups.push({
          format,
          pruefis,
          addedCount: pruefis.filter(p => p.status === 'added').length,
          removedCount: pruefis.filter(p => p.status === 'removed').length,
        });
      }
    });
  }

  getRowClass(pruefi: PruefiComparison): string {
    switch (pruefi.status) {
      case 'added':
        return 'bg-hf-positive-light';
      case 'removed':
        return 'bg-hf-negative-light';
      case 'unchanged':
        if (this.hasLineChanges(pruefi.pruefidentifikator)) {
          return 'bg-hf-neutral-light';
        }
        return '';
    }
  }

  hasChanges(group: FormatGroup): boolean {
    return group.addedCount > 0 || group.removedCount > 0;
  }

  hasNoLineChanges(pruefi: string): boolean {
    const stats = this.diffSummary()[pruefi];
    if (!stats) return false;
    return stats.added === 0 && stats.deleted === 0 && stats.modified === 0;
  }

  hasLineChanges(pruefi: string): boolean {
    const stats = this.diffSummary()[pruefi];
    if (!stats) return false;
    return stats.added > 0 || stats.deleted > 0 || stats.modified > 0;
  }
}
