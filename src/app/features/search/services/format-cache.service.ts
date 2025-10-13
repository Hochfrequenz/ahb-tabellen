import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { FormateService } from '../../../core/api/services/formate.service';

interface CachedFormats {
  data: string[];
  timestamp: number;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class FormatCacheService {
  private readonly CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly CACHE_KEY = 'formats_cache';

  private formatsSubject = new BehaviorSubject<string[]>([]);
  public formats$ = this.formatsSubject.asObservable();

  constructor(private formateService: FormateService) {
    this.loadFromCache();
  }

  getFormats(): Observable<string[]> {
    const cached = this.getCachedData();
    if (cached && this.isCacheValid(cached)) {
      this.formatsSubject.next(cached.data);
      return of(cached.data);
    }
    return this.fetchFromApi();
  }

  refreshFormats(): Observable<string[]> {
    return this.fetchFromApi();
  }

  private getCachedData(): CachedFormats | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to parse cached formats:', error);
      return null;
    }
  }

  private isCacheValid(cached: CachedFormats): boolean {
    return Date.now() < cached.expiresAt;
  }

  private loadFromCache(): void {
    const cached = this.getCachedData();
    if (cached && this.isCacheValid(cached)) {
      this.formatsSubject.next(cached.data);
    }
  }

  private fetchFromApi(): Observable<string[]> {
    return this.formateService.getFormate().pipe(
      tap((formats: string[]) => {
        this.cacheData(formats);
        this.formatsSubject.next(formats);
      }),
      catchError(error => {
        console.error('Failed to fetch formats:', error);
        const cached = this.getCachedData();
        if (cached) {
          this.formatsSubject.next(cached.data);
          return of(cached.data);
        }
        return throwError(() => error);
      })
    );
  }

  private cacheData(data: string[]): void {
    const now = Date.now();
    const cacheData: CachedFormats = {
      data,
      timestamp: now,
      expiresAt: now + this.CACHE_DURATION_MS,
    };
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache formats:', error);
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    this.formatsSubject.next([]);
  }

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
