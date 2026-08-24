import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';

import { diffWords, Change } from 'diff';
import { AhbDiffLine, AhbDiffSide } from '../../../../core/api';
import { IconLinkComponent } from '../../../../shared/components/icon-link/icon-link.component';
import { TruncationObserverDirective } from '../../../../shared/directives/truncation-observer.directive';
import { environment } from '../../../../environments/environment';
import { getFormatFromPruefi } from '../../../../shared/utils/pruefi-format.utils';

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [IconLinkComponent, TruncationObserverDirective],
  templateUrl: './comparison-table.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './comparison-table.component.scss',
})
export class ComparisonTableComponent implements OnChanges {
  @Input() lines: AhbDiffLine[] = [];
  @Input() formatVersionOld = '';
  @Input() formatVersionNew = '';
  /** Pruefi shown on both sides (format-version comparison). Ignored if pruefiOld/pruefiNew are set. */
  @Input() pruefi = '';
  /** Pruefi shown on the old side (Pruefi-vs-Pruefi comparison). Falls back to `pruefi`. */
  @Input() pruefiOld = '';
  /** Pruefi shown on the new side (Pruefi-vs-Pruefi comparison). Falls back to `pruefi`. */
  @Input() pruefiNew = '';

  /** id_paths of rows whose conditions are expanded (clamp removed). Single source of truth. */
  private readonly expandedRows = signal<ReadonlySet<string>>(new Set());

  /**
   * Per row+side truncation state, measured while the cell is clamped and latched
   * here so it survives while the row is expanded (an expanded cell never overflows).
   */
  private readonly truncatedSides = signal<ReadonlyMap<string, { old: boolean; new: boolean }>>(
    new Map()
  );

  /**
   * Per row+side "the highlighted change lives entirely in the clipped-away text" state,
   * measured while clamped and latched here. Drives the size emphasis and the attention hop.
   */
  private readonly hiddenChangeSides = signal<ReadonlyMap<string, { old: boolean; new: boolean }>>(
    new Map()
  );

  /** Inputs that identify the current comparison; a change to any means "new comparison". */
  private static readonly IDENTITY_INPUTS = [
    'pruefi',
    'pruefiOld',
    'pruefiNew',
    'formatVersionOld',
    'formatVersionNew',
  ];

  /**
   * Reset the expand/truncation state only when a genuinely new comparison is
   * loaded — not when `lines` merely changes because a filter toggled (that would
   * collapse every row on each filter click).
   */
  ngOnChanges(changes: SimpleChanges): void {
    const isNewComparison = ComparisonTableComponent.IDENTITY_INPUTS.some(key => {
      const change = changes[key];
      return !!change && !change.firstChange && change.previousValue !== change.currentValue;
    });
    if (isNewComparison) {
      this.expandedRows.set(new Set());
      this.truncatedSides.set(new Map());
      this.hiddenChangeSides.set(new Map());
    }
  }

  /** True when comparing two different Pruefis (rather than the same Pruefi across format versions). */
  private get isPruefiComparison(): boolean {
    return !!this.pruefiOld && !!this.pruefiNew && this.pruefiOld !== this.pruefiNew;
  }

  /**
   * Header label for the old/left side: "Prüfi X" for a Pruefi comparison (the format version is
   * the same on both sides there, so it wouldn't distinguish the columns), "Alte Version (FV)" otherwise.
   */
  get headerLabelOld(): string {
    return this.isPruefiComparison
      ? `Prüfi ${this.pruefiOld}`
      : `Alte Version (${this.formatVersionOld})`;
  }

  /** Header label for the new/right side: "Prüfi Y" for a Pruefi comparison, "Neue Version (FV)" otherwise. */
  get headerLabelNew(): string {
    return this.isPruefiComparison
      ? `Prüfi ${this.pruefiNew}`
      : `Neue Version (${this.formatVersionNew})`;
  }

  getRowClass(line: AhbDiffLine): string {
    switch (line.diff_status) {
      case 'added':
        return 'bg-hf-positive-light text-hf-positive-dark font-bold';
      case 'deleted':
        return 'bg-hf-negative-light text-hf-negative-dark font-bold';
      case 'modified':
        return 'bg-hf-neutral-light text-hf-neutral-dark';
      default:
        return 'bg-white text-hf-text-color';
    }
  }

  /**
   * Get CSS class for links based on row diff status.
   * Unchanged rows use the original link colors, changed rows inherit row color.
   */
  getLinkClass(line: AhbDiffLine, linkType: 'ebd' | 'bedingung'): string {
    const baseClass = 'hover:underline flex flex-row gap-1 items-center';
    if (
      line.diff_status === 'added' ||
      line.diff_status === 'deleted' ||
      line.diff_status === 'modified'
    ) {
      return `${baseClass} text-inherit`;
    }
    // Unchanged rows use original colors
    return linkType === 'ebd'
      ? `${baseClass} text-hf-dunkel-blau`
      : `${baseClass} text-hf-dunkel-gelb`;
  }

  getDiffStatusLabel(status: string | undefined): string {
    switch (status) {
      case 'added':
        return '+';
      case 'deleted':
        return '-';
      case 'modified':
        return '~';
      default:
        return '';
    }
  }

  getDiffStatusClass(status: string | undefined): string {
    switch (status) {
      case 'added':
        return 'text-hf-positive-dark font-bold';
      case 'deleted':
        return 'text-hf-negative-dark font-bold';
      case 'modified':
        return 'text-hf-neutral-dark font-bold';
      default:
        return 'text-gray-400';
    }
  }

  isSegmentGroup(line: AhbDiffLine): boolean {
    const side = line.old ?? line.new;
    return side?.line_type === 'segmentgroup';
  }

  /**
   * Check if a column is in the changed_columns list
   * @param line The diff line containing changed_columns
   * @param column The column name to check (e.g., 'segmentgroup_key', 'segment_code')
   */
  isColumnChanged(line: AhbDiffLine, column: string): boolean {
    return line.changed_columns?.includes(column) ?? false;
  }

  /**
   * Get CSS class for a cell based on whether its column changed
   * @param columns Can be a single column name or an array of column names to check
   */
  getChangedColumnClass(line: AhbDiffLine, columns: string | string[]): string {
    const columnsToCheck = Array.isArray(columns) ? columns : [columns];
    const hasChange = columnsToCheck.some(col => this.isColumnChanged(line, col));
    if (hasChange) {
      return 'font-bold';
    }
    return '';
  }

  private getSide(line: AhbDiffLine, side: 'old' | 'new'): AhbDiffSide | undefined {
    return side === 'old' ? line.old : line.new;
  }

  getSegmentGroupKey(line: AhbDiffLine, side: 'old' | 'new'): string {
    return this.getSide(line, side)?.segmentgroup_key ?? '';
  }

  getSegmentCode(line: AhbDiffLine, side: 'old' | 'new'): string {
    return this.getSide(line, side)?.segment_code ?? '';
  }

  getDataElement(line: AhbDiffLine, side: 'old' | 'new'): string {
    const value = this.getSide(line, side)?.data_element ?? '';
    // Remove "D_" prefix if present
    if (value.startsWith('D_')) {
      return value.substring(2);
    }
    return value;
  }

  getQualifier(line: AhbDiffLine, side: 'old' | 'new'): string {
    return this.getSide(line, side)?.qualifier ?? '';
  }

  getName(line: AhbDiffLine, side: 'old' | 'new'): string {
    return this.getSide(line, side)?.line_name ?? '';
  }

  getAhbStatus(line: AhbDiffLine, side: 'old' | 'new'): string {
    return this.getSide(line, side)?.line_ahb_status ?? '';
  }

  /**
   * Compare two bedingung strings using proper diff algorithm.
   * Highlights added words (in new) or removed words (in old) with <strong> tags.
   */
  getHighlightedBedingung(line: AhbDiffLine, side: 'old' | 'new'): string {
    const oldText = line.old?.bedingung ?? '';
    const newText = line.new?.bedingung ?? '';
    const currentText = side === 'old' ? oldText : newText;

    if (!this.isColumnChanged(line, 'bedingung') || !currentText) {
      return this.escapeHtml(currentText) || '-';
    }

    // diffWords returns an array of change objects with added/removed flags
    const changes = diffWords(oldText, newText);

    // Build the highlighted output for the requested side
    return changes
      .map((change: Change) => {
        const escaped = this.escapeHtml(change.value);

        if (side === 'old' && change.removed) {
          // Word was removed (exists only in old)
          return `<strong>${escaped}</strong>`;
        }
        if (side === 'new' && change.added) {
          // Word was added (exists only in new)
          return `<strong>${escaped}</strong>`;
        }
        if (!change.added && !change.removed) {
          // Unchanged text - show on both sides
          return escaped;
        }
        // Skip: added words when showing old side, removed words when showing new side
        return '';
      })
      .join('');
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /** Whether the given row's conditions are currently expanded. */
  isExpanded(line: AhbDiffLine): boolean {
    return this.expandedRows().has(line.id_path);
  }

  /** Whether the given side's condition text overflows its clamp (measured while clamped). */
  isSideTruncated(line: AhbDiffLine, side: 'old' | 'new'): boolean {
    return this.truncatedSides().get(line.id_path)?.[side] ?? false;
  }

  /** A row is collapsible when at least one side's condition text is truncated. */
  isCollapsible(line: AhbDiffLine): boolean {
    return this.isSideTruncated(line, 'old') || this.isSideTruncated(line, 'new');
  }

  /** Whether to render an expand/collapse chevron for this side. */
  hasConditionsToggle(line: AhbDiffLine, side: 'old' | 'new'): boolean {
    return this.isSideTruncated(line, side);
  }

  /**
   * Flag the chevron (and bounce it) when a change is genuinely hidden: the row is
   * collapsed and the highlighted change lives entirely in the clipped-away text.
   * Measured per side by the truncation observer, so it excludes changes still visible
   * in the shown line(s).
   */
  isHiddenChange(line: AhbDiffLine, side: 'old' | 'new'): boolean {
    return !this.isExpanded(line) && (this.hiddenChangeSides().get(line.id_path)?.[side] ?? false);
  }

  /**
   * Row-level hidden-change flag: true if either side has a change hidden below the
   * clamp. Used to bounce both arrows of a row together, not just the affected side.
   */
  isRowHiddenChange(line: AhbDiffLine): boolean {
    return this.isHiddenChange(line, 'old') || this.isHiddenChange(line, 'new');
  }

  /** Accessible label for the chevron button, flagging hidden changes for screen readers. */
  conditionsToggleLabel(line: AhbDiffLine, side: 'old' | 'new'): string {
    if (this.isExpanded(line)) {
      return 'Bedingungen einklappen';
    }
    return this.isHiddenChange(line, side)
      ? 'Bedingungen ausklappen – enthält eine Änderung'
      : 'Bedingungen ausklappen';
  }

  /** Toggle the expanded state of a single row (both sides expand together). */
  toggleRow(line: AhbDiffLine): void {
    const id = line.id_path;
    this.expandedRows.update(current => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  /** Expand every collapsible row — driven by the "Bedingungen" toggle in the page. */
  expandAllCollapsible(): void {
    const ids = this.lines.filter(line => this.isCollapsible(line)).map(line => line.id_path);
    this.expandedRows.set(new Set(ids));
  }

  /** Collapse every row — driven by the "Bedingungen" toggle in the page. */
  collapseAll(): void {
    this.expandedRows.set(new Set());
  }

  /** Store the latest (clamped) truncation measurement for a row+side. */
  onConditionsTruncated(line: AhbDiffLine, side: 'old' | 'new', truncated: boolean): void {
    const id = line.id_path;
    this.truncatedSides.update(current => {
      const existing = current.get(id) ?? { old: false, new: false };
      if (existing[side] === truncated) {
        return current;
      }
      const next = new Map(current);
      next.set(id, { ...existing, [side]: truncated });
      return next;
    });
  }

  /** Store the latest (clamped) "change hidden below the clamp" measurement for a row+side. */
  onConditionsChangeHidden(line: AhbDiffLine, side: 'old' | 'new', hidden: boolean): void {
    const id = line.id_path;
    this.hiddenChangeSides.update(current => {
      const existing = current.get(id) ?? { old: false, new: false };
      if (existing[side] === hidden) {
        return current;
      }
      const next = new Map(current);
      next.set(id, { ...existing, [side]: hidden });
      return next;
    });
  }

  generateBedingungsbaumDeepLink(
    expression: string,
    formatVersion: string,
    side: 'old' | 'new' = 'old'
  ): string | null {
    if (!expression || !expression.includes('[')) {
      return null;
    }
    const pruefiForSide = (side === 'old' ? this.pruefiOld : this.pruefiNew) || this.pruefi;
    const encodedExpression = encodeURIComponent(expression);
    return `${environment.bedingungsbaumBaseUrl}/tree/?format=${getFormatFromPruefi(pruefiForSide)}&format_version=${formatVersion}&expression=${encodedExpression}`;
  }

  generateEbdDeepLink(ebdKey: string | null | undefined, formatVersion: string): string | null {
    if (!ebdKey) {
      return null;
    }
    // EBD detection now happens in the backend (side.ebd_key); we only build the link.
    return `${environment.ebdBaseUrl}/ebd/?formatversion=${formatVersion}&ebd=${ebdKey}`;
  }
}
