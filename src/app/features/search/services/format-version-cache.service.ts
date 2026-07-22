import { Injectable, inject } from '@angular/core';
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
  private formatVersionsService = inject(FormatVersionsService);

  private readonly CACHE_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  private readonly CACHE_KEY = 'format_versions_cache';

  private formatVersionsSubject = new BehaviorSubject<string[]>([]);
  public formatVersions$ = this.formatVersionsSubject.asObservable();

  constructor() {
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
   * Get the current stable format version (second-to-last in the list)
   * The last format version is typically a development/preview version,
   * so the current stable version is the second-to-last one.
   *
   * @returns The current stable format version, or null if not available
   */
  getCurrentFormatVersion(): string | null {
    const formatVersions = this.formatVersionsSubject.value;
    if (Array.isArray(formatVersions) && formatVersions.length >= 2) {
      return formatVersions[formatVersions.length - 2];
    }
    return null;
  }

  /**
   * Get the latest format version (last in the list)
   * This is typically a development/preview version.
   *
   * @returns The latest format version, or null if not available
   */
  getLatestFormatVersion(): string | null {
    const formatVersions = this.formatVersionsSubject.value;
    if (Array.isArray(formatVersions) && formatVersions.length > 0) {
      return formatVersions[formatVersions.length - 1];
    }
    return null;
  }

  /**
   * Check if a format version is the current stable version
   *
   * @param formatVersion The format version to check
   * @returns True if the format version is the current stable version
   */
  isCurrentFormatVersion(formatVersion: string): boolean {
    return this.getCurrentFormatVersion() === formatVersion;
  }

  /**
   * Check if a format version is the latest version (development/preview)
   *
   * @param formatVersion The format version to check
   * @returns True if the format version is the latest version
   */
  isLatestFormatVersion(formatVersion: string): boolean {
    return this.getLatestFormatVersion() === formatVersion;
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
