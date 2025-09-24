import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormatVersionsService } from '../../../core/api/services/format-versions.service';

interface CachedFormatVersions {
  data: string[];
  timestamp: number;
  expiresAt: number;
}

@Injectable({
  providedIn: 'root',
})
export class FormatVersionCacheService {
  private readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  private readonly CACHE_KEY = 'format_versions_cache';

  private formatVersionsSubject = new BehaviorSubject<string[]>([]);
  public formatVersions$ = this.formatVersionsSubject.asObservable();

  constructor(private formatVersionsService: FormatVersionsService) {
    this.loadFromCache();
  }

  /**
   * Get format versions, either from cache or API
   */
  getFormatVersions(): Observable<string[]> {
    const cached = this.getCachedData();

    if (cached && this.isCacheValid(cached)) {
      this.formatVersionsSubject.next(cached.data);
      return of(cached.data);
    }

    return this.fetchFromApi();
  }

  /**
   * Force refresh from API
   */
  refreshFormatVersions(): Observable<string[]> {
    return this.fetchFromApi();
  }

  /**
   * Get cached data from localStorage
   */
  private getCachedData(): CachedFormatVersions | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to parse cached format versions:', error);
      return null;
    }
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cached: CachedFormatVersions): boolean {
    return Date.now() < cached.expiresAt;
  }

  /**
   * Load format versions from cache on service initialization
   */
  private loadFromCache(): void {
    const cached = this.getCachedData();
    if (cached && this.isCacheValid(cached)) {
      this.formatVersionsSubject.next(cached.data);
    }
  }

  /**
   * Fetch format versions from API and cache them
   */
  private fetchFromApi(): Observable<string[]> {
    return this.formatVersionsService.getFormatVersions().pipe(
      tap((formatVersions: string[]) => {
        this.cacheData(formatVersions);
        this.formatVersionsSubject.next(formatVersions);
      }),
      catchError(error => {
        console.error('Failed to fetch format versions:', error);
        // Return cached data if available, even if expired
        const cached = this.getCachedData();
        if (cached) {
          this.formatVersionsSubject.next(cached.data);
          return of(cached.data);
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Cache the format versions data
   */
  private cacheData(data: string[]): void {
    const now = Date.now();
    const cacheData: CachedFormatVersions = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION_MS,
    };

    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache format versions:', error);
    }
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    this.formatVersionsSubject.next([]);
  }

  /**
   * Get cache info for debugging
   */
  getCacheInfo(): { isCached: boolean; isExpired: boolean; expiresAt?: number; dataCount: number } {
    const cached = this.getCachedData();
    return {
      isCached: !!cached,
      isExpired: cached ? !this.isCacheValid(cached) : true,
      expiresAt: cached?.expiresAt,
      dataCount: cached?.data.length || 0,
    };
  }
}
