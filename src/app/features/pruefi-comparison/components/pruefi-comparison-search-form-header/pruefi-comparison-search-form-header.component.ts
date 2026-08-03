import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  effect,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { PruefiInputComponent } from '../../../ahbs/components/pruefi-input/pruefi-input.component';
import { FormatVersionCacheService } from '../../../search/services/format-version-cache.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PrufidentifikatorenService } from '../../../../core/api';
import { map } from 'rxjs';

@Component({
  selector: 'app-pruefi-comparison-search-form-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PruefiInputComponent,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './pruefi-comparison-search-form-header.component.html',
})
export class PruefiComparisonSearchFormHeaderComponent {
  private readonly router = inject(Router);
  private readonly formatVersionCacheService = inject(FormatVersionCacheService);
  private readonly prufidentifikatorenService = inject(PrufidentifikatorenService);

  private readonly destroyRef = inject(DestroyRef);

  formatVersion = input<string>('');
  pruefiOld = input<string>('');
  pruefiNew = input<string>('');
  navigateOnSubmit = input<boolean>(true);

  formatVersionChange = output<string>();
  pruefiOldChange = output<string>();
  pruefiNewChange = output<string>();
  validationErrorChange = output<string | null>();

  formatVersions: string[] = [];
  validationError = signal<string | null>(null);
  isValidating = signal<boolean>(false);

  headerSearchForm = new FormGroup({
    formatVersion: new FormControl('', Validators.required),
    pruefiOld: new FormControl('', Validators.required),
    pruefiNew: new FormControl('', Validators.required),
  });

  constructor() {
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntilDestroyed())
      .subscribe(versions => {
        this.formatVersions = versions;
        // Note: Default value is set by the parent component to avoid race conditions
        // when multiple instances of this component exist (desktop + mobile)
      });

    effect(() => {
      const newFormatVersion = this.formatVersion();
      if (
        newFormatVersion &&
        newFormatVersion !== this.headerSearchForm.get('formatVersion')?.value
      ) {
        this.headerSearchForm.patchValue({ formatVersion: newFormatVersion }, { emitEvent: false });
      }
    });

    effect(() => {
      const newPruefiOld = this.pruefiOld();
      if (newPruefiOld && newPruefiOld !== this.headerSearchForm.get('pruefiOld')?.value) {
        this.headerSearchForm.patchValue({ pruefiOld: newPruefiOld }, { emitEvent: false });
      }
    });

    effect(() => {
      const newPruefiNew = this.pruefiNew();
      if (newPruefiNew && newPruefiNew !== this.headerSearchForm.get('pruefiNew')?.value) {
        this.headerSearchForm.patchValue({ pruefiNew: newPruefiNew }, { emitEvent: false });
      }
    });

    this.headerSearchForm.get('formatVersion')?.valueChanges.subscribe(value => {
      if (value) {
        this.formatVersionChange.emit(value);
        this.tryNavigate();
      }
    });

    this.headerSearchForm.get('pruefiOld')?.valueChanges.subscribe(value => {
      if (value) {
        this.pruefiOldChange.emit(value);
        this.tryNavigate();
      }
    });

    this.headerSearchForm.get('pruefiNew')?.valueChanges.subscribe(value => {
      if (value) {
        this.pruefiNewChange.emit(value);
        this.tryNavigate();
      }
    });
  }

  private tryNavigate(): void {
    const { formatVersion, pruefiOld, pruefiNew } = this.headerSearchForm.value;

    if (!formatVersion || !pruefiOld?.match(/^\d{5}$/) || !pruefiNew?.match(/^\d{5}$/)) {
      return;
    }

    if (pruefiOld === pruefiNew) {
      this.setValidationError(
        `Bitte wählen Sie zwei unterschiedliche Prüfidentifikatoren aus (${pruefiOld} wurde zweimal angegeben).`
      );
      return;
    }

    this.validateAndNavigate(formatVersion, pruefiOld, pruefiNew);
  }

  private validateAndNavigate(formatVersion: string, pruefiOld: string, pruefiNew: string): void {
    this.setValidationError(null);
    this.isValidating.set(true);

    // Check if both Pruefis exist in the selected format version. We fetch the full Pruefi list
    // rather than using a dedicated existsPruefi() endpoint because no such endpoint currently
    // exists in the API; it's likely already cached by the browser from the pruefi-input
    // autocomplete, so the performance impact is minimal.
    this.prufidentifikatorenService
      .getPruefis({ 'format-version': formatVersion })
      .pipe(
        map(pruefis => pruefis.map(p => p.pruefidentifikator)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: allPruefis => {
          this.isValidating.set(false);

          const existsOld = allPruefis.includes(pruefiOld);
          const existsNew = allPruefis.includes(pruefiNew);

          if (!existsOld && !existsNew) {
            this.setValidationError(
              `Weder Prüfidentifikator ${pruefiOld} noch ${pruefiNew} sind in der Formatversion ${formatVersion} vorhanden.`
            );
            return;
          }

          if (!existsOld) {
            this.setValidationError(
              `Der Prüfidentifikator ${pruefiOld} konnte nicht in der Formatversion ${formatVersion} gefunden werden.`
            );
            return;
          }

          if (!existsNew) {
            this.setValidationError(
              `Der Prüfidentifikator ${pruefiNew} konnte nicht in der Formatversion ${formatVersion} gefunden werden.`
            );
            return;
          }

          if (!this.navigateOnSubmit()) {
            return;
          }

          this.router.navigate(['/compare-pruefis', pruefiOld, pruefiNew], {
            queryParams: { 'format-version': formatVersion },
          });
        },
        error: () => {
          this.isValidating.set(false);
          this.setValidationError('Ein Fehler ist bei der Validierung aufgetreten.');
        },
      });
  }

  private setValidationError(error: string | null): void {
    this.validationError.set(error);
    this.validationErrorChange.emit(error);
  }
}
