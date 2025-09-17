import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { SearchItem } from '../../../../core/api/models';

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  standalone: true,
})
export class SearchTableComponent {
  @Input() data: SearchItem[] = [];
  @Input() totalItems = 0;
  @Input() page = 1;
  @Input() pageSize = 25;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() pageSizeChange = new EventEmitter<PageEvent>();
  @Output() sortChange = new EventEmitter<Sort>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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
    this.pageChange.emit(event);
  }

  onSortChange(event: Sort): void {
    this.sortChange.emit(event);
  }

  getColumnDisplayName(column: string): string {
    const displayNames: Record<string, string> = {
      format_version: 'Format Version',
      format: 'Format',
      pruefidentifikator: 'Prüfidentifikator',
      description: 'Description',
      segmentgroup_key: 'Segment Group',
      segment_code: 'Segment Code',
      data_element: 'Data Element',
      qualifier: 'Qualifier',
      line_ahb_status: 'AHB Status',
      line_name: 'Line Name',
      bedingung: 'Bedingung',
      direction: 'Direction',
    };
    return displayNames[column] || column;
  }

  formatCellValue(value: any): string {
    if (value === null || value === undefined) {
      return '-';
    }
    return String(value);
  }
}
