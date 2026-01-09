import { Component, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchItem } from '../../../../core/api/models';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
  ],
  standalone: true,
})
export class SearchTableComponent implements OnChanges {
  @Input() data: SearchItem[] = [];
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 25;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() pageSizeChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router) {}

  dataSource = new MatTableDataSource<SearchItem>([]);
  displayedColumns: string[] = [
    'format_version',
    'format',
    'pruefidentifikator',
    'description',
    'segmentgroup_key',
    'segment_code',
    'data_element',
    'qualifier',
    'line_ahb_status',
    'line_name',
    'bedingung',
    'direction',
  ];

  ngOnChanges(): void {
    this.dataSource.data = this.data;
  }

  onPageChange(event: PageEvent): void {
    if (event.pageSize !== this.pageSize) {
      this.pageSizeChange.emit(event);
    } else {
      this.pageChange.emit(event);
    }
  }

  onSortChange(event: Sort): void {
    this.sortChange.emit(event);
  }

  getColumnDisplayName(column: string): string {
    const displayNames: Record<string, string> = {
      format_version: 'Formatversion',
      format: 'Format',
      pruefidentifikator: 'Prüfidentifikator',
      description: 'Beschreibung',
      segmentgroup_key: 'Segmentgruppe',
      segment_code: 'Segmentcode',
      data_element: 'Datenelement',
      qualifier: 'Qualifier',
      line_ahb_status: 'AHB-Status',
      line_name: 'Zeilenname',
      bedingung: 'Bedingung',
      direction: 'Richtung',
    };
    return displayNames[column] || column;
  }

  formatCellValue(value: string | number | boolean | null | undefined): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  }

  formatDataElement(value: string | null | undefined): string {
    if (value === null || value === undefined) {
      return '-';
    }
    // Remove "D_" prefix if present
    if (value.startsWith('D_')) {
      return value.substring(2);
    }
    return value;
  }

  formatDirection(
    direction: string | { sender: string; empfaenger: string }[] | null | undefined
  ): string[] {
    if (!direction) return ['-'];
    try {
      const directions = typeof direction === 'string' ? JSON.parse(direction) : direction;
      if (!Array.isArray(directions) || directions.length === 0) return ['-'];
      return directions.map(
        (d: { sender: string; empfaenger: string }) => `${d.sender} → ${d.empfaenger}`
      );
    } catch {
      return [String(direction)];
    }
  }

  onPruefidentifikatorClick(item: SearchItem): void {
    if (item.format_version && item.pruefidentifikator) {
      const url = this.router
        .createUrlTree(['/ahb', item.format_version, item.pruefidentifikator])
        .toString();
      window.open(url, '_blank');
    }
  }
}
