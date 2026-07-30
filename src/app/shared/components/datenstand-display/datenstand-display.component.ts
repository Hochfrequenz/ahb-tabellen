import { Component, inject, ChangeDetectionStrategy } from '@angular/core';

import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaintenanceService } from '../../../core/api/services/maintenance.service';

@Component({
  selector: 'app-datenstand-display',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './datenstand-display.component.html',
})
export class DatenstandDisplayComponent {
  datenstand: string | null = null;
  private maintenanceService = inject(MaintenanceService);

  constructor() {
    this.maintenanceService
      .getDatenstand()
      .pipe(
        catchError(error => {
          console.error('Failed to load datenstand:', error);
          return of(null);
        })
      )
      .subscribe(data => {
        this.datenstand = data?.veroeffentlichungsdatum ?? null;
      });
  }
}
