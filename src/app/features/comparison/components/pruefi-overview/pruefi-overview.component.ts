import {
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  signal,
  SimpleChanges,
  WritableSignal,
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

export const PruefiStatus = {
  ADDED: 'added',
  REMOVED: 'removed',
  UNCHANGED: 'unchanged',
} as const;

export type PruefiStatusType = (typeof PruefiStatus)[keyof typeof PruefiStatus];

interface PruefiComparison {
  pruefidentifikator: string;
  name: string;
  existsInOld: boolean;
  existsInNew: boolean;
  status: PruefiStatusType;
}

interface FormatGroup {
  format: string;
  pruefis: PruefiComparison[];
  addedCount: number;
  removedCount: number;
}

type FilterKey = 'added' | 'removed' | 'changed' | 'identical';

interface FilterToggle {
  key: FilterKey;
  signal: WritableSignal<boolean>;
  symbol: string;
  title: string;
  colorClasses: string;
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

  // Expose status constants to template
  readonly PruefiStatus = PruefiStatus;

  @Input() formatVersionOld = '';
  @Input() formatVersionNew = '';

  isLoading = false;
  errorMessage: string | null = null;
  formatGroups = signal<FormatGroup[]>([]);
  diffSummary = signal<AhbDiffSummary>({});

  // Filter visibility states
  showAdded = signal(true);
  showRemoved = signal(true);
  showChanged = signal(true);
  showIdentical = signal(true);

  readonly filterToggles: FilterToggle[] = [
    {
      key: 'identical',
      signal: this.showIdentical,
      symbol: '=',
      title: 'Identische Prüfidentifikatoren anzeigen',
      colorClasses: 'bg-gray-100 text-gray-600 border-gray-400',
    },
    {
      key: 'added',
      signal: this.showAdded,
      symbol: '+',
      title: 'Neue Prüfidentifikatoren anzeigen',
      colorClasses: 'bg-hf-positive-light text-hf-positive-dark border-hf-positive',
    },
    {
      key: 'removed',
      signal: this.showRemoved,
      symbol: '−',
      title: 'Entfernte Prüfidentifikatoren anzeigen',
      colorClasses: 'bg-hf-negative-light text-hf-negative-dark border-hf-negative',
    },
    {
      key: 'changed',
      signal: this.showChanged,
      symbol: '~',
      title: 'Geänderte Prüfidentifikatoren anzeigen',
      colorClasses: 'bg-hf-neutral-light text-hf-neutral-dark border-hf-neutral',
    },
  ];

  // Computed stats for filter counts - reacts to both formatGroups and diffSummary changes
  readonly stats = computed(() => {
    const groups = this.formatGroups();
    const diffSummary = this.diffSummary();
    let added = 0;
    let removed = 0;
    let changed = 0;
    let identical = 0;

    for (const group of groups) {
      for (const pruefi of group.pruefis) {
        if (pruefi.status === PruefiStatus.ADDED) {
          added++;
        } else if (pruefi.status === PruefiStatus.REMOVED) {
          removed++;
        } else {
          // Check line changes using diffSummary directly for proper reactivity
          const stats = diffSummary[pruefi.pruefidentifikator];
          if (stats) {
            if (stats.added > 0 || stats.deleted > 0 || stats.modified > 0) {
              changed++;
            } else {
              identical++;
            }
          }
        }
      }
    }

    return { added, removed, changed, identical };
  });

  // Cached filtered pruefis - computed once when signals change, used in template
  readonly filteredPruefisCache = computed(() => {
    const groups = this.formatGroups();
    const diffSummary = this.diffSummary();
    const showAdded = this.showAdded();
    const showRemoved = this.showRemoved();
    const showChanged = this.showChanged();
    const showIdentical = this.showIdentical();

    const cache = new Map<string, PruefiComparison[]>();

    for (const group of groups) {
      const filtered = group.pruefis.filter(pruefi => {
        if (pruefi.status === PruefiStatus.ADDED) {
          return showAdded;
        }
        if (pruefi.status === PruefiStatus.REMOVED) {
          return showRemoved;
        }
        // For unchanged status, check line changes
        const stats = diffSummary[pruefi.pruefidentifikator];
        if (stats) {
          if (stats.added > 0 || stats.deleted > 0 || stats.modified > 0) {
            return showChanged;
          }
          return showIdentical;
        }
        // If diff summary not loaded yet, show by default
        return true;
      });
      cache.set(group.format, filtered);
    }

    return cache;
  });

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

      let status: PruefiStatusType;
      if (existsInOld && existsInNew) {
        status = PruefiStatus.UNCHANGED;
      } else if (existsInNew) {
        status = PruefiStatus.ADDED;
      } else {
        status = PruefiStatus.REMOVED;
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
    const groups: FormatGroup[] = allFormats
      .filter(format => formatMap.has(format))
      .map(format => {
        const pruefis = formatMap.get(format)!;
        return {
          format,
          pruefis,
          addedCount: pruefis.filter(p => p.status === PruefiStatus.ADDED).length,
          removedCount: pruefis.filter(p => p.status === PruefiStatus.REMOVED).length,
        };
      });

    // Add any formats not in the known list (e.g., 'Unbekannt' for unknown prefixes)
    formatMap.forEach((pruefis, format) => {
      if (!allFormats.includes(format)) {
        groups.push({
          format,
          pruefis,
          addedCount: pruefis.filter(p => p.status === PruefiStatus.ADDED).length,
          removedCount: pruefis.filter(p => p.status === PruefiStatus.REMOVED).length,
        });
      }
    });

    this.formatGroups.set(groups);
  }

  getRowClass(pruefi: PruefiComparison): string {
    switch (pruefi.status) {
      case PruefiStatus.ADDED:
        return 'bg-hf-positive-light';
      case PruefiStatus.REMOVED:
        return 'bg-hf-negative-light';
      case PruefiStatus.UNCHANGED:
        if (this.hasLineChanges(pruefi.pruefidentifikator)) {
          return 'bg-hf-neutral-light';
        }
        return '';
    }
  }

  hasChanges(group: FormatGroup): boolean {
    return group.addedCount > 0 || group.removedCount > 0 || this.getChangedCount(group) > 0;
  }

  getChangedCount(group: FormatGroup): number {
    return group.pruefis.filter(
      p => p.status === PruefiStatus.UNCHANGED && this.hasLineChanges(p.pruefidentifikator)
    ).length;
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

  toggleFilter(toggle: FilterToggle): void {
    toggle.signal.update(v => !v);
  }

  getFilterCount(key: FilterKey): number {
    return this.stats()[key];
  }

  isPruefiVisible(pruefi: PruefiComparison): boolean {
    if (pruefi.status === PruefiStatus.ADDED) {
      return this.showAdded();
    }
    if (pruefi.status === PruefiStatus.REMOVED) {
      return this.showRemoved();
    }
    // For unchanged status, check if it has line changes
    if (this.hasLineChanges(pruefi.pruefidentifikator)) {
      return this.showChanged();
    }
    if (this.hasNoLineChanges(pruefi.pruefidentifikator)) {
      return this.showIdentical();
    }
    // If diff summary not loaded yet, show by default
    return true;
  }

  getFilteredPruefis(group: FormatGroup): PruefiComparison[] {
    return this.filteredPruefisCache().get(group.format) ?? [];
  }

  getFilteredCount(group: FormatGroup): number {
    return this.filteredPruefisCache().get(group.format)?.length ?? 0;
  }
}
