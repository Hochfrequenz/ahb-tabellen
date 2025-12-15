import { Component, DestroyRef, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrufidentifikatorenService } from '../../../../core/api';
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
})
export class PruefiOverviewComponent implements OnChanges {
  private readonly destroyRef = inject(DestroyRef);

  @Input() formatVersionOld = '';
  @Input() formatVersionNew = '';

  isLoading = false;
  errorMessage: string | null = null;
  formatGroups: FormatGroup[] = [];

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
        },
        error: () => {
          this.errorMessage = 'Fehler beim Laden der Prüfidentifikatoren.';
          this.isLoading = false;
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

    // Group by format
    const formatMap = new Map<string, PruefiComparison[]>();
    comparisons.forEach(comp => {
      const format = getFormatFromPruefi(comp.pruefidentifikator);
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

    // Add any formats not in the known list (shouldn't happen, but just in case)
    formatMap.forEach((pruefis, format) => {
      if (!allFormats.includes(format)) {
        this.formatGroups.push({
          format: format || 'Unbekannt',
          pruefis,
          addedCount: pruefis.filter(p => p.status === 'added').length,
          removedCount: pruefis.filter(p => p.status === 'removed').length,
        });
      }
    });
  }

  getRowClass(status: 'added' | 'removed' | 'unchanged'): string {
    switch (status) {
      case 'added':
        return 'bg-green-50';
      case 'removed':
        return 'bg-red-50';
      default:
        return '';
    }
  }

  getChangeBadge(group: FormatGroup): string {
    const parts: string[] = [];
    if (group.addedCount > 0) {
      parts.push(`+${group.addedCount}`);
    }
    if (group.removedCount > 0) {
      parts.push(`-${group.removedCount}`);
    }
    return parts.length > 0 ? `(${parts.join(', ')})` : '';
  }

  hasChanges(group: FormatGroup): boolean {
    return group.addedCount > 0 || group.removedCount > 0;
  }
}
