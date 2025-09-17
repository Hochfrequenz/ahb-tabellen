import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { SearchService as ApiSearchService } from '../../../core/api/services/search.service';
import {
  SearchQueryRequest,
  SearchQueryResponse,
  SearchItem,
  SortRule,
} from '../../../core/api/models';

export interface SearchState {
  page: number;
  pageSize: number;
  sort: SortRule[];
  q: string;
  filters: Partial<Record<string, any>>;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly initialState: SearchState = {
    page: 1,
    pageSize: 25,
    sort: [{ field: 'format_version', direction: 'asc' }],
    q: '',
    filters: {},
  };

  private readonly stateSubject = new BehaviorSubject<SearchState>(this.initialState);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  public readonly state$ = this.stateSubject.asObservable();
  public readonly loading$ = this.loadingSubject.asObservable();
  public readonly error$ = this.errorSubject.asObservable();

  public readonly searchResults$: Observable<SearchQueryResponse> = combineLatest([
    this.state$.pipe(debounceTime(300), distinctUntilChanged()),
  ]).pipe(
    tap(() => this.loadingSubject.next(true)),
    switchMap(([state]) => this.performSearch(state)),
    tap(() => this.loadingSubject.next(false)),
    tap({
      error: error => {
        this.loadingSubject.next(false);
        this.errorSubject.next(error.message || 'Search failed');
      },
    })
  );

  constructor(private apiSearchService: ApiSearchService) {}

  updatePage(page: number): void {
    this.updateState({ page });
  }

  updatePageSize(pageSize: number): void {
    this.updateState({ pageSize, page: 1 });
  }

  updateSort(sort: SortRule[]): void {
    this.updateState({ sort, page: 1 });
  }

  updateQuery(q: string): void {
    this.updateState({ q, page: 1 });
  }

  updateFilters(filters: Partial<Record<string, any>>): void {
    this.updateState({ filters, page: 1 });
  }

  clearFilters(): void {
    this.updateState({ filters: {}, page: 1 });
  }

  private updateState(updates: Partial<SearchState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
  }

  private performSearch(state: SearchState): Observable<SearchQueryResponse> {
    const request: SearchQueryRequest = {
      page: state.page,
      pageSize: state.pageSize,
      sort: state.sort,
      q: state.q,
      filters: state.filters,
    };

    return this.apiSearchService.searchAhbLines({ body: request });
  }
}
