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
import { FormatCacheService } from '../../services/format-cache.service';

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
    multiple?: boolean;
  }> = [
    {
      key: 'format_version',
      label: 'Format Version',
      type: 'select',
      options: [], // Will be populated from API
      multiple: true,
    },
    {
      key: 'format',
      label: 'Format',
      type: 'select',
      options: [], // Will be populated from API
      multiple: true,
    },
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
    private formatVersionCacheService: FormatVersionCacheService,
    private formatCacheService: FormatCacheService
  ) {
    this.searchForm = this.fb.group({
      q: [''],
      ...this.filterFields.reduce(
        (acc, field) => {
          // Multi-select holds an array of strings, single select/text holds a string
          acc[field.key] = new FormControl(field.multiple ? ([] as string[]) : '');
          return acc;
        },
        {} as Record<string, FormControl>
      ),
    });
  }

  ngOnInit(): void {
    // Load format versions from cache/API
    this.loadFormatVersions();
    // Load formats from cache/API
    this.loadFormats();

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
            // Set default selection to second last entry if available
            if (Array.isArray(formatVersions) && formatVersions.length >= 2) {
              const secondLast = formatVersions[formatVersions.length - 2];
              // Avoid double emissions: set value without emitting, then emit once explicitly
              this.searchForm.get('format_version')?.setValue([secondLast], { emitEvent: false });
              this.emitFilters();
            }
          }
        },
        error: error => {
          console.error('Failed to load format versions:', error);
          // Keep empty options array if loading fails
        },
      });
  }

  private loadFormats(): void {
    this.formatCacheService
      .getFormats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: formats => {
          const formatField = this.filterFields.find(field => field.key === 'format');
          if (formatField) {
            formatField.options = formats;
          }
        },
        error: error => {
          console.error('Failed to load formats:', error);
        },
      });
  }

  private emitFilters(): void {
    const filters: Record<string, any> = {};

    this.filterFields.forEach(field => {
      const value = this.searchForm.get(field.key)?.value;
      if (field.type === 'select' && field.multiple) {
        const values: string[] = Array.isArray(value)
          ? value.filter(v => !!v && typeof v === 'string')
          : [];
        if (values.length > 0) {
          // For multi-select use 'in' operator with array of values
          filters[field.key] = { in: values };
        }
      } else if (field.type === 'select') {
        if (typeof value === 'string' && value.trim()) {
          filters[field.key] = { eq: value.trim() };
        }
      } else {
        if (typeof value === 'string' && value.trim()) {
          filters[field.key] = { contains: value.trim() };
        }
      }
    });

    this.filtersChange.emit(filters);
  }

  clearFilters(): void {
    this.searchForm.patchValue({
      q: '',
      ...this.filterFields.reduce(
        (acc, field) => {
          acc[field.key] = field.multiple ? [] : '';
          return acc;
        },
        {} as Record<string, any>
      ),
    });
  }

  getActiveFilterCount(): number {
    return this.filterFields.filter(field => {
      const value = this.searchForm.get(field.key)?.value;
      if (field.type === 'select' && field.multiple) {
        return Array.isArray(value) && value.length > 0;
      }
      return typeof value === 'string' && value.trim();
    }).length;
  }
}
