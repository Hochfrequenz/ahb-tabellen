import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, inject } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { SearchFilters, SortRule } from '../../../../core/api/models';
import { SearchService } from '../../services/search.service';
import { SearchQueryResponse } from '../../../../core/api/models';
import { SearchTableComponent } from '../../components/search-table/search-table.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SearchTableComponent,
    SearchFiltersComponent,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: true,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private searchService = inject(SearchService);

  private destroy$ = new Subject<void>();

  searchResults: SearchQueryResponse | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.searchService.searchResults$.pipe(takeUntil(this.destroy$)).subscribe(results => {
      this.searchResults = results;
    });

    this.searchService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    this.searchService.error$.pipe(takeUntil(this.destroy$)).subscribe(error => {
      this.error = error;
    });

    // Trigger initial search
    this.searchService.updateQuery('');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.searchService.updatePage(event.pageIndex + 1);
  }

  onPageSizeChange(event: PageEvent): void {
    this.searchService.updatePageSize(event.pageSize);
  }

  onSortChange(event: Sort): void {
    const isSortableField = (value: string): value is SortRule['field'] => {
      const allowed: SortRule['field'][] = [
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
      return allowed.includes(value as SortRule['field']);
    };

    const sort: SortRule[] =
      event.direction && isSortableField(event.active)
        ? [{ field: event.active, direction: event.direction }]
        : [];
    this.searchService.updateSort(sort);
  }

  onQueryChange(query: string): void {
    this.searchService.updateQuery(query);
  }

  onFiltersChange(filters: SearchFilters): void {
    this.searchService.updateFilters(filters);
  }

  onClearFilters(): void {
    this.searchService.clearFilters();
  }
}
