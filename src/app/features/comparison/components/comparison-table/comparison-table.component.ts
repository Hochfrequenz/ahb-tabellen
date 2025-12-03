import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AhbDiffLine, AhbDiffSide } from '../../../../core/api';

@Component({
  selector: 'app-comparison-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparison-table.component.html',
})
export class ComparisonTableComponent {
  @Input() lines: AhbDiffLine[] = [];

  getRowClass(line: AhbDiffLine): string {
    const baseClass = 'border-b border-gray-200';
    switch (line.diff_status) {
      case 'added':
        return `${baseClass} bg-green-50`;
      case 'deleted':
        return `${baseClass} bg-red-50`;
      case 'modified':
        return `${baseClass} bg-yellow-50`;
      default:
        return `${baseClass} bg-white`;
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
        return 'text-green-600 font-bold';
      case 'deleted':
        return 'text-red-600 font-bold';
      case 'modified':
        return 'text-yellow-600 font-bold';
      default:
        return 'text-gray-400';
    }
  }

  isSegmentGroup(line: AhbDiffLine): boolean {
    const side = line.old ?? line.new;
    return side?.line_type === 'segmentgroup';
  }

  getCellDiffClass(oldVal: string | null | undefined, newVal: string | null | undefined): string {
    if ((oldVal ?? '') !== (newVal ?? '')) {
      return 'font-semibold text-yellow-700';
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
}
