import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { diffWords } from 'diff';
import { AhbDiffLine, AhbDiffSide } from '../../../../core/api';
import { IconLinkComponent } from '../../../../shared/components/icon-link/icon-link.component';
import { environment } from '../../../../environments/environment';
import { getFormatFromPruefi } from '../../../../shared/utils/pruefi-format.utils';

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [CommonModule, IconLinkComponent],
  templateUrl: './comparison-table.component.html',
})
export class ComparisonTableComponent {
  @Input() lines: AhbDiffLine[] = [];
  @Input() formatVersionOld = '';
  @Input() formatVersionNew = '';
  @Input() pruefi = '';

  /** Whether to show the conditions/hints/formats column */
  @Input() showConditionsColumn = false;

  getRowClass(line: AhbDiffLine): string {
    switch (line.diff_status) {
      case 'added':
        return 'bg-hf-positive text-hf-positive-dark font-bold';
      case 'deleted':
        return 'bg-hf-negative text-hf-negative-dark font-bold';
      case 'modified':
        return 'bg-hf-neutral text-hf-neutral-dark';
      default:
        return 'bg-white';
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
    return this.getSide(line, side)?.data_element ?? '';
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
      .map(change => {
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
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  generateBedingungsbaumDeepLink(expression: string, formatVersion: string): string | null {
    if (!expression || !expression.includes('[')) {
      return null;
    }
    const encodedExpression = encodeURIComponent(expression);
    return `${environment.bedingungsbaumBaseUrl}/tree/?format=${getFormatFromPruefi(this.pruefi)}&format_version=${formatVersion}&expression=${encodedExpression}`;
  }

  generateEbdDeepLink(qualifier: string | null | undefined, formatVersion: string): string | null {
    if (!qualifier || qualifier.trim().length === 0) {
      return null;
    }
    const regex = /^.*\b(?<ebd_key>E_\d+)\b.*$/;
    const match = qualifier.match(regex);
    if (!match?.groups) {
      return null;
    }
    const ebdKey = match.groups['ebd_key']!;
    return `${environment.ebdBaseUrl}/ebd/?formatversion=${formatVersion}&ebd=${ebdKey}`;
  }
}
