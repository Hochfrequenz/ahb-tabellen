import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormatVersionCacheService } from '../../services/format-version-cache.service';

@Component({
  selector: 'app-search-filters',
  templateUrl: './search-filters.component.html',
  styleUrls: ['./search-filters.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  standalone: true,
})
export class SearchFiltersComponent implements OnInit, OnDestroy {
  @Output() queryChange = new EventEmitter<string>();
  @Output() filtersChange = new EventEmitter<Record<string, any>>();

  private destroy$ = new Subject<void>();
  searchForm: FormGroup;

  filterFields: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: string[];
  }> = [
    {
      key: 'format_version',
      label: 'Format Version',
      type: 'select',
      options: [], // Will be populated from API
    },
    { key: 'format', label: 'Format', type: 'text' },
    { key: 'pruefidentifikator', label: 'Prüfidentifikator', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'segmentgroup_key', label: 'Segment Group', type: 'text' },
    { key: 'segment_code', label: 'Segment Code', type: 'text' },
    { key: 'data_element', label: 'Data Element', type: 'text' },
    { key: 'qualifier', label: 'Qualifier', type: 'text' },
    { key: 'line_ahb_status', label: 'AHB Status', type: 'text' },
    { key: 'line_name', label: 'Line Name', type: 'text' },
    { key: 'bedingung', label: 'Bedingung', type: 'text' },
  ];

  constructor(
    private fb: FormBuilder,
    private formatVersionCacheService: FormatVersionCacheService
  ) {
    this.searchForm = this.fb.group({
      q: [''],
      ...this.filterFields.reduce(
        (acc, field) => {
          acc[field.key] = new FormControl('');
          return acc;
        },
        {} as Record<string, FormControl>
      ),
    });
  }

  ngOnInit(): void {
    // Load format versions from cache/API
    this.loadFormatVersions();

    // Global search query
    this.searchForm
      .get('q')
      ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(value => {
        this.queryChange.emit(value || '');
      });

    // Individual filters
    this.filterFields.forEach(field => {
      this.searchForm
        .get(field.key)
        ?.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
        .subscribe(() => {
          this.emitFilters();
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadFormatVersions(): void {
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: formatVersions => {
          // Update the format_version field options
          const formatVersionField = this.filterFields.find(
            field => field.key === 'format_version'
          );
          if (formatVersionField) {
            formatVersionField.options = formatVersions;
          }
        },
        error: error => {
          console.error('Failed to load format versions:', error);
          // Keep empty options array if loading fails
        },
      });
  }

  private emitFilters(): void {
    const filters: Record<string, any> = {};

    this.filterFields.forEach(field => {
      const value = this.searchForm.get(field.key)?.value;
      if (value && value.trim()) {
        // Use 'eq' for select fields, 'contains' for text fields
        const operator = field.type === 'select' ? 'eq' : 'contains';
        filters[field.key] = { [operator]: value.trim() };
      }
    });

    this.filtersChange.emit(filters);
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      q: '',
      ...this.filterFields.reduce(
        (acc, field) => {
          acc[field.key] = '';
          return acc;
        },
        {} as Record<string, string>
      ),
    });
  }

  getActiveFilterCount(): number {
    return this.filterFields.filter(field => {
      const value = this.searchForm.get(field.key)?.value;
      return value && value.trim();
    }).length;
  }
}
