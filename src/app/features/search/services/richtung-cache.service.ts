import { Injectable, inject } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SearchService } from '../../../core/api/services/search.service';
import { DirectionValues } from '../../../core/api/models/direction-values';

interface CachedDirectionValues {
  data: DirectionValues;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class RichtungCacheService {
  private searchService = inject(SearchService);

  private readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly CACHE_KEY = 'richtung_values_cache';

  private richtungValuesSubject = new BehaviorSubject<DirectionValues>({
    sender: [],
    empfaenger: [],
  });
  public richtungValues$ = this.richtungValuesSubject.asObservable();

  constructor() {
    this.loadFromCache();
  }

  getRichtungValues(): Observable<DirectionValues> {
    const cached = this.getCachedData();

    if (cached && this.isCacheValid(cached)) {
      this.richtungValuesSubject.next(cached.data);
      return of(cached.data);
    }

    return this.fetchFromApi();
  }

  refreshRichtungValues(): Observable<DirectionValues> {
    return this.fetchFromApi();
  }

  private getCachedData(): CachedDirectionValues | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private isCacheValid(cached: CachedDirectionValues): boolean {
    return Date.now() < cached.expiresAt;
  }

  private loadFromCache(): void {
    const cached = this.getCachedData();
    if (cached && this.isCacheValid(cached)) {
      this.richtungValuesSubject.next(cached.data);
    }
  }

  private fetchFromApi(): Observable<DirectionValues> {
    return this.searchService.getDirectionValues().pipe(
      tap((directionValues: DirectionValues) => {
        this.cacheData(directionValues);
        this.richtungValuesSubject.next(directionValues);
      }),
      catchError(error => {
        console.error('Failed to fetch direction values:', error);
        const cached = this.getCachedData();
        if (cached) {
          this.richtungValuesSubject.next(cached.data);
          return of(cached.data);
        }
        return throwError(() => error);
      })
    );
  }

  private cacheData(data: DirectionValues): void {
    const now = Date.now();
    const cacheData: CachedDirectionValues = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION_MS,
    };

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch {
      // localStorage might be full or disabled
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    this.richtungValuesSubject.next({ sender: [], empfaenger: [] });
  }
}
