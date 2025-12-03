import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SearchService } from '../../../core/api/services/search.service';
import { RichtungValues } from '../../../core/api/models/richtung-values';

interface CachedRichtungValues {
  data: RichtungValues;
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class RichtungCacheService {
  private readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly CACHE_KEY = 'richtung_values_cache';

  private richtungValuesSubject = new BehaviorSubject<RichtungValues>({
    sender: [],
    empfaenger: [],
  });
  public richtungValues$ = this.richtungValuesSubject.asObservable();

  constructor(private searchService: SearchService) {
    this.loadFromCache();
  }

  getRichtungValues(): Observable<RichtungValues> {
    const cached = this.getCachedData();

    if (cached && this.isCacheValid(cached)) {
      this.richtungValuesSubject.next(cached.data);
      return of(cached.data);
    }

    return this.fetchFromApi();
  }

  refreshRichtungValues(): Observable<RichtungValues> {
    return this.fetchFromApi();
  }

  private getCachedData(): CachedRichtungValues | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private isCacheValid(cached: CachedRichtungValues): boolean {
    return Date.now() < cached.expiresAt;
  }

  private loadFromCache(): void {
    const cached = this.getCachedData();
    if (cached && this.isCacheValid(cached)) {
      this.richtungValuesSubject.next(cached.data);
    }
  }

  private fetchFromApi(): Observable<RichtungValues> {
    return this.searchService.getRichtungValues().pipe(
      tap((richtungValues: RichtungValues) => {
        this.cacheData(richtungValues);
        this.richtungValuesSubject.next(richtungValues);
      }),
      catchError(error => {
        console.error('Failed to fetch richtung values:', error);
        const cached = this.getCachedData();
        if (cached) {
          this.richtungValuesSubject.next(cached.data);
          return of(cached.data);
        }
        return throwError(() => error);
      })
    );
  }

  private cacheData(data: RichtungValues): void {
    const now = Date.now();
    const cacheData: CachedRichtungValues = {
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
