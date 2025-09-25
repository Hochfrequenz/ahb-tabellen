import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { SearchFilters } from '../../../../core/api/models';
import { SearchService } from '../../services/search.service';
import { SearchQueryResponse } from '../../../../core/api/models';
import { SearchTableComponent } from '../../components/search-table/search-table.component';
import { SearchFiltersComponent } from '../../components/search-filters/search-filters.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    SearchTableComponent,
    SearchFiltersComponent,
  ],
  standalone: true,
})
export class SearchPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  searchResults: SearchQueryResponse | null = null;
  loading = false;
  error: string | null = null;

  constructor(private searchService: SearchService) {}

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
    const sort = event.direction ? [{ field: event.active, direction: event.direction }] : [];
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
