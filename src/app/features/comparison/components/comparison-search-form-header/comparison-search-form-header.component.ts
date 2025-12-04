import { Component, input, output, effect, computed } from '@angular/core';
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

@Component({
  selector: 'app-comparison-search-form-header',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PruefiInputComponent],
  templateUrl: './comparison-search-form-header.component.html',
})
export class ComparisonSearchFormHeaderComponent {
  formatVersionOld = input<string>('');
  formatVersionNew = input<string>('');
  pruefi = input<string>('');
  navigateOnSubmit = input<boolean>(true);

  formatVersionOldChange = output<string>();
  formatVersionNewChange = output<string>();
  pruefiChange = output<string>();

  formatVersions: string[] = [];

  headerSearchForm = new FormGroup({
    formatVersionOld: new FormControl('', Validators.required),
    formatVersionNew: new FormControl('', Validators.required),
    pruefi: new FormControl('', Validators.required),
  });

  /** Versions available for "old" selection (must be older than selected new version) */
  get availableOldVersions(): string[] {
    const newVersion = this.headerSearchForm.controls.formatVersionNew.value;
    if (!newVersion) return this.formatVersions;
    return this.formatVersions.filter(v => v < newVersion);
  }

  /** Versions available for "new" selection (must be newer than selected old version) */
  get availableNewVersions(): string[] {
    const oldVersion = this.headerSearchForm.controls.formatVersionOld.value;
    if (!oldVersion) return this.formatVersions;
    return this.formatVersions.filter(v => v > oldVersion);
  }

  /** Format version to use for pruefi suggestions (use the new version) */
  formatVersionForPruefi = computed(() => this.formatVersionNew());

  constructor(
    private readonly router: Router,
    private readonly formatVersionCacheService: FormatVersionCacheService
  ) {
    // Load format versions
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntilDestroyed())
      .subscribe(versions => {
        this.formatVersions = versions;
        // Set default values if not provided via inputs
        if (versions.length >= 2 && !this.formatVersionOld()) {
          const defaultOld = versions[versions.length - 2];
          this.headerSearchForm.patchValue({ formatVersionOld: defaultOld }, { emitEvent: false });
          this.formatVersionOldChange.emit(defaultOld);
        }
        if (versions.length >= 1 && !this.formatVersionNew()) {
          const defaultNew = versions[versions.length - 1];
          this.headerSearchForm.patchValue({ formatVersionNew: defaultNew }, { emitEvent: false });
          this.formatVersionNewChange.emit(defaultNew);
        }
      });

    // Update form when inputs change
    effect(() => {
      const newFormatVersionOld = this.formatVersionOld();
      if (newFormatVersionOld !== this.headerSearchForm.get('formatVersionOld')?.value) {
        this.headerSearchForm.patchValue(
          { formatVersionOld: newFormatVersionOld },
          { emitEvent: false }
        );
      }
    });

    effect(() => {
      const newFormatVersionNew = this.formatVersionNew();
      if (newFormatVersionNew !== this.headerSearchForm.get('formatVersionNew')?.value) {
        this.headerSearchForm.patchValue(
          { formatVersionNew: newFormatVersionNew },
          { emitEvent: false }
        );
      }
    });

    effect(() => {
      const newPruefi = this.pruefi();
      if (newPruefi !== this.headerSearchForm.get('pruefi')?.value) {
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
          this.navigateToComparison();
        }
      }
    });
  }

  private navigateToComparison() {
    if (this.headerSearchForm.valid) {
      this.router.navigate(['/comparison', this.headerSearchForm.value.pruefi], {
        queryParams: {
          'fv-old': this.headerSearchForm.value.formatVersionOld,
          'fv-new': this.headerSearchForm.value.formatVersionNew,
        },
      });
    }
  }
}
