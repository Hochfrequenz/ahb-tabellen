import {
  Component,
  computed,
  DestroyRef,
  inject,
  Input,
  OnChanges,
  output,
  signal,
  SimpleChanges,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PrufidentifikatorenService } from '../../../../core/api';
import { getFormatFromPruefi, getAllFormats } from '../../../../shared/utils/pruefi-format.utils';
import {
  getAllRoleKeys,
  getRoleLabel,
  getRolesForPruefi,
} from '../../../../shared/utils/role-mapping.utils';

interface PruefiEntry {
  pruefidentifikator: string;
  name: string;
  roles: string[];
}

interface FormatGroup {
  format: string;
  pruefis: PruefiEntry[];
}

interface RoleToggle {
  key: string;
  signal: WritableSignal<boolean>;
  label: string;
}

@Component({
  selector: 'app-pruefi-selection-overview',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, MatProgressSpinnerModule],
  templateUrl: './pruefi-selection-overview.component.html',
})
export class PruefiSelectionOverviewComponent implements OnChanges {
  private readonly prufidentifikatorenService = inject(PrufidentifikatorenService);

  private readonly destroyRef = inject(DestroyRef);

  @Input() formatVersion = '';
  @Input() pruefiOld = '';
  @Input() pruefiNew = '';

  selectPruefiOld = output<string>();
  selectPruefiNew = output<string>();

  isLoading = false;
  errorMessage: string | null = null;
  formatGroups = signal<FormatGroup[]>([]);

  readonly roleToggles: RoleToggle[] = getAllRoleKeys().map(key => ({
    key,
    signal: signal(true),
    label: getRoleLabel(key),
  }));

  readonly filteredPruefisCache = computed(() => {
    const groups = this.formatGroups();
    const enabledRoleKeys = new Set(
      this.roleToggles.filter(toggle => toggle.signal()).map(toggle => toggle.key)
    );

    const cache = new Map<string, PruefiEntry[]>();
    for (const group of groups) {
      const filtered = group.pruefis.filter(pruefi => this.isRoleVisible(pruefi, enabledRoleKeys));
      cache.set(group.format, filtered);
    }
    return cache;
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formatVersion'] && this.formatVersion) {
      this.loadPruefis();
    }
  }

  private loadPruefis(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.prufidentifikatorenService
      .getPruefis({ 'format-version': this.formatVersion })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: pruefis => {
          this.processPruefis(pruefis);
          this.isLoading = false;
        },
        error: error => {
          const statusText = error?.status ? ` (Status: ${error.status})` : '';
          this.errorMessage = `Fehler beim Laden der Prüfidentifikatoren für ${this.formatVersion}${statusText}. Bitte versuchen Sie es später erneut.`;
          this.isLoading = false;
        },
      });
  }

  private processPruefis(
    pruefis: Array<{ pruefidentifikator?: string; name?: string; roles?: string[] }>
  ): void {
    const entries: PruefiEntry[] = pruefis
      .filter((p): p is { pruefidentifikator: string; name?: string; roles?: string[] } =>
        Boolean(p.pruefidentifikator)
      )
      .map(p => ({
        pruefidentifikator: p.pruefidentifikator,
        name: p.name || '',
        roles: p.roles ?? [],
      }));

    entries.sort((a, b) => a.pruefidentifikator.localeCompare(b.pruefidentifikator));

    const formatMap = new Map<string, PruefiEntry[]>();
    entries.forEach(entry => {
      const format = getFormatFromPruefi(entry.pruefidentifikator) || 'Unbekannt';
      if (!formatMap.has(format)) {
        formatMap.set(format, []);
      }
      formatMap.get(format)!.push(entry);
    });

    const allFormats = getAllFormats();
    const groups: FormatGroup[] = allFormats
      .filter(format => formatMap.has(format))
      .map(format => ({ format, pruefis: formatMap.get(format)! }));

    formatMap.forEach((pruefisForFormat, format) => {
      if (!allFormats.includes(format)) {
        groups.push({ format, pruefis: pruefisForFormat });
      }
    });

    this.formatGroups.set(groups);
  }

  private isRoleVisible(pruefi: PruefiEntry, enabledRoleKeys: Set<string>): boolean {
    const pruefiRoles = getRolesForPruefi(pruefi.roles);
    // Pruefis with no mappable role data are always shown - we can't classify them
    if (pruefiRoles.length === 0) {
      return true;
    }
    return pruefiRoles.some(role => enabledRoleKeys.has(role));
  }

  toggleRoleFilter(toggle: RoleToggle): void {
    toggle.signal.update(v => !v);
  }

  getFilteredPruefis(group: FormatGroup): PruefiEntry[] {
    return this.filteredPruefisCache().get(group.format) ?? [];
  }

  getFilteredCount(group: FormatGroup): number {
    return this.filteredPruefisCache().get(group.format)?.length ?? 0;
  }

  isSelectedAsOld(pruefi: PruefiEntry): boolean {
    return !!this.pruefiOld && pruefi.pruefidentifikator === this.pruefiOld;
  }

  isSelectedAsNew(pruefi: PruefiEntry): boolean {
    return !!this.pruefiNew && pruefi.pruefidentifikator === this.pruefiNew;
  }

  getRowClass(pruefi: PruefiEntry): string {
    if (this.isSelectedAsOld(pruefi) || this.isSelectedAsNew(pruefi)) {
      return 'bg-hf-neutral-light';
    }
    return '';
  }
}
