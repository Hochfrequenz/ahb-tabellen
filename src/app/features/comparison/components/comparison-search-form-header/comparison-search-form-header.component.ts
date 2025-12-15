import { Component, DestroyRef, inject, input, output, effect, signal } from '@angular/core';
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
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-comparison-search-form-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PruefiInputComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './comparison-search-form-header.component.html',
})
export class ComparisonSearchFormHeaderComponent {
  private readonly destroyRef = inject(DestroyRef);

  formatVersionOld = input<string>('');
  formatVersionNew = input<string>('');
  pruefi = input<string>('');
  navigateOnSubmit = input<boolean>(true);

  formatVersionOldChange = output<string>();
  formatVersionNewChange = output<string>();
  pruefiChange = output<string>();
  validationErrorChange = output<string | null>();

  formatVersions: string[] = [];
  validationError = signal<string | null>(null);
  isValidating = signal<boolean>(false);

  headerSearchForm = new FormGroup({
    formatVersionOld: new FormControl('', Validators.required),
    formatVersionNew: new FormControl('', Validators.required),
    pruefi: new FormControl('', Validators.required),
  });

  /** Versions available for "old" selection (must be older than selected new version) */
  get availableOldVersions(): string[] {
    const newVersion = this.headerSearchForm.controls.formatVersionNew.value;
    if (!newVersion) return this.formatVersions;
    // Versions sorted asc (oldest first), so old versions are those less than new version
    return this.formatVersions.filter(v => v < newVersion);
  }

  /** Versions available for "new" selection (must be newer than selected old version) */
  get availableNewVersions(): string[] {
    const oldVersion = this.headerSearchForm.controls.formatVersionOld.value;
    if (!oldVersion) return this.formatVersions;
    // Versions sorted asc (oldest first), so new versions are those greater than old version
    return this.formatVersions.filter(v => v > oldVersion);
  }

  /** Format version to use for pruefi suggestions (use the new version from form) */
  get formatVersionForPruefi(): string | null {
    return this.headerSearchForm.controls.formatVersionNew.value;
  }

  constructor(
    private readonly router: Router,
    private readonly formatVersionCacheService: FormatVersionCacheService,
    private readonly prufidentifikatorenService: PrufidentifikatorenService
  ) {
    // Load format versions
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntilDestroyed())
      .subscribe(versions => {
        // Keep original order (oldest first, newest last)
        this.formatVersions = versions;

        // Set default values if not provided via inputs
        // Most recent (last in list) as new, second most recent (second to last) as old
        if (this.formatVersions.length >= 1 && !this.formatVersionNew()) {
          const defaultNew = this.formatVersions[this.formatVersions.length - 1];
          this.headerSearchForm.patchValue({ formatVersionNew: defaultNew }, { emitEvent: false });
          this.formatVersionNewChange.emit(defaultNew);
        }
        if (this.formatVersions.length >= 2 && !this.formatVersionOld()) {
          const defaultOld = this.formatVersions[this.formatVersions.length - 2];
          this.headerSearchForm.patchValue({ formatVersionOld: defaultOld }, { emitEvent: false });
          this.formatVersionOldChange.emit(defaultOld);
        }
      });

    // Update form when inputs change (only if input has a value)
    effect(() => {
      const newFormatVersionOld = this.formatVersionOld();
      // Only update form if input has a value (don't overwrite defaults with empty string)
      if (
        newFormatVersionOld &&
        newFormatVersionOld !== this.headerSearchForm.get('formatVersionOld')?.value
      ) {
        this.headerSearchForm.patchValue(
          { formatVersionOld: newFormatVersionOld },
          { emitEvent: false }
        );
      }
    });

    effect(() => {
      const newFormatVersionNew = this.formatVersionNew();
      // Only update form if input has a value (don't overwrite defaults with empty string)
      if (
        newFormatVersionNew &&
        newFormatVersionNew !== this.headerSearchForm.get('formatVersionNew')?.value
      ) {
        this.headerSearchForm.patchValue(
          { formatVersionNew: newFormatVersionNew },
          { emitEvent: false }
        );
      }
    });

    effect(() => {
      const newPruefi = this.pruefi();
      if (newPruefi && newPruefi !== this.headerSearchForm.get('pruefi')?.value) {
        this.headerSearchForm.patchValue({ pruefi: newPruefi }, { emitEvent: false });
      }
    });

    // Handle form control changes
    this.headerSearchForm.get('formatVersionOld')?.valueChanges.subscribe(value => {
      if (value) {
        this.formatVersionOldChange.emit(value);
      }
    });

    this.headerSearchForm.get('formatVersionNew')?.valueChanges.subscribe(value => {
      if (value) {
        this.formatVersionNewChange.emit(value);
      }
    });

    this.headerSearchForm.get('pruefi')?.valueChanges.subscribe(value => {
      if (value) {
        this.pruefiChange.emit(value);
        if (this.navigateOnSubmit()) {
          this.navigateToComparison(value);
        }
      }
    });
  }

  private navigateToComparison(pruefi: string) {
    const fvOld = this.headerSearchForm.value.formatVersionOld;
    const fvNew = this.headerSearchForm.value.formatVersionNew;

    // Navigate if we have all required values (pruefi must be 5 digits)
    if (pruefi?.match(/^\d{5}$/) && fvOld && fvNew) {
      this.validateAndNavigate(pruefi, fvOld, fvNew);
    }
  }

  private validateAndNavigate(pruefi: string, fvOld: string, fvNew: string): void {
    this.setValidationError(null);
    this.isValidating.set(true);

    // Check if pruefi exists in both format versions.
    // Note: We fetch the full pruefi lists rather than using a dedicated existsPruefi() endpoint
    // because no such endpoint currently exists in the API. The pruefi lists are relatively small
    // (~200-300 entries per format version) and are likely already cached by the browser from
    // the pruefi-input autocomplete, so the performance impact is minimal.
    forkJoin({
      oldVersionPruefis: this.prufidentifikatorenService
        .getPruefis({ 'format-version': fvOld })
        .pipe(map(pruefis => pruefis.map(p => p.pruefidentifikator))),
      newVersionPruefis: this.prufidentifikatorenService
        .getPruefis({ 'format-version': fvNew })
        .pipe(map(pruefis => pruefis.map(p => p.pruefidentifikator))),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ oldVersionPruefis, newVersionPruefis }) => {
          this.isValidating.set(false);

          const existsInOld = oldVersionPruefis.includes(pruefi);
          const existsInNew = newVersionPruefis.includes(pruefi);

          if (!existsInOld && !existsInNew) {
            this.setValidationError(
              `Der Prüfidentifikator ${pruefi} ist weder in der Formatversion ${fvOld} noch in der ${fvNew} vorhanden.`
            );
            return;
          }

          if (!existsInOld) {
            this.setValidationError(
              `Der Prüfidentifikator ${pruefi} konnte nicht in der Formatversion ${fvOld} gefunden werden.`
            );
            return;
          }

          if (!existsInNew) {
            this.setValidationError(
              `Der Prüfidentifikator ${pruefi} konnte nicht in der Formatversion ${fvNew} gefunden werden.`
            );
            return;
          }

          // Both versions have the pruefi, navigate
          this.router.navigate(['/compare', pruefi], {
            queryParams: {
              'fv-old': fvOld,
              'fv-new': fvNew,
            },
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
