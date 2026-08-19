import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

interface VersionInfo {
  version: string;
  commitHash: string;
  buildDate: string;
}

@Component({
  selector: 'app-version-display',
  standalone: true,
  imports: [],
  templateUrl: './version-display.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./version-display.component.css'],
})
export class VersionDisplayComponent {
  version: string | null = null;
  commitHash: string | null = null;
  buildDate: string | null = null;
  private http = inject(HttpClient);

  constructor() {
    this.http
      .get('/version', { responseType: 'text' }) // we don't know the build date at compile time
      .pipe(
        map((response: string) => {
          try {
            const parsedData: VersionInfo = JSON.parse(response);
            if (parsedData.version && parsedData.commitHash && parsedData.buildDate) {
              return parsedData;
            }
            throw new Error('Invalid JSON structure');
          } catch (error) {
            console.warn(
              'Response to /version endpoint is not valid JSON. This happens on localhost',
              error
            );
            return { version: 'v0.0.0', commitHash: '0000000', buildDate: 'Unknown' };
          }
        }),
        catchError(error => {
          console.error('Failed to load version info:', error);
          return of({ version: 'Error', commitHash: 'Unknown', buildDate: 'Unknown' });
        })
      )
      .subscribe(data => {
        this.version = data.version;
        this.commitHash = data.commitHash;
        this.buildDate = data.buildDate;
      });
  }
}
