import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AhbDiffLine, AhbDiffSide } from '../../../../core/api';
import { IconLinkComponent } from '../../../../shared/components/icon-link/icon-link.component';
import { environment } from '../../../../environments/environment';

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

  generateBedingungsbaumDeepLink(expression: string, formatVersion: string): string | null {
    if (!expression || !expression.includes('[')) {
      return null;
    }
    const encodedExpression = encodeURIComponent(expression);
    return `${environment.bedingungsbaumBaseUrl}/tree/?format=${this.getFormat(this.pruefi)}&format_version=${formatVersion}&expression=${encodedExpression}`;
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

  private getFormat(pruefi: string): string {
    const mapping: { [key: string]: string } = {
      '99': 'APERAK',
      '29': 'COMDIS',
      '21': 'IFTSTA',
      '23': 'INSRPT',
      '31': 'INVOIC',
      '13': 'MSCONS',
      '39': 'ORDCHG',
      '17': 'ORDERS',
      '19': 'ORDRSP',
      '27': 'PRICAT',
      '15': 'QUOTES',
      '33': 'REMADV',
      '35': 'REQOTE',
      '37': 'PARTIN',
      '11': 'UTILMD',
      '25': 'UTILTS',
      '91': 'CONTRL',
      '92': 'APERAK',
      '44': 'UTILMDG',
      '55': 'UTILMDS',
    };

    const key = pruefi.substring(0, 2);
    return mapping[key] || '';
  }
}
