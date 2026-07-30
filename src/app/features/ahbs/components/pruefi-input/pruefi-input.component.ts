import {
  Component,
  effect,
  forwardRef,
  input,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { PrufidentifikatorenService } from '../../../../core/api';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Observable, combineLatest, finalize, map } from 'rxjs';

interface PruefiOption {
  pruefidentifikator: string;
  name: string;
}

@Component({
  selector: 'app-pruefi-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pruefi-input.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PruefiInputComponent),
      multi: true,
    },
  ],
})
export class PruefiInputComponent implements ControlValueAccessor {
  private readonly prufidentifikatorenService = inject(PrufidentifikatorenService);

  formatVersion = input.required<string | null>();

  control = new FormControl<string>('');
  private searchTerm$ = new BehaviorSubject<string>('');
  private allPruefis$ = new BehaviorSubject<PruefiOption[]>([]);

  pruefis$: Observable<string[]> = combineLatest([this.searchTerm$, this.allPruefis$]).pipe(
    map(([searchTerm, pruefis]) => {
      const term = searchTerm.toLowerCase();
      return pruefis
        .filter(
          p =>
            !term || // show all when no search term
            p.pruefidentifikator.toLowerCase().includes(term) ||
            p.name.toLowerCase().includes(term)
        )
        .map(p => `${p.pruefidentifikator} - ${p.name}`);
    })
  );

  public onChange?: (pruefi: string | null) => void;

  constructor() {
    effect(() => {
      const formatVersion = this.formatVersion();
      if (!formatVersion) {
        this.allPruefis$.next([]);
        this.control.enable();
        return;
      }
      this.control.disable();
      this.prufidentifikatorenService
        .getPruefis({
          'format-version': formatVersion,
        })
        .pipe(finalize(() => this.control.enable()))
        .subscribe({
          next: pruefis => {
            this.allPruefis$.next(
              pruefis.map(p => ({
                pruefidentifikator: p.pruefidentifikator || '',
                name: p.name || '',
              }))
            );
          },
          error: () => {
            this.allPruefis$.next([]);
          },
        });
    });
  }

  writeValue(pruefi: string): void {
    this.control.setValue(pruefi);
  }

  registerOnChange(fn: (pruefi: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(): void {
    // do nothing
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;

    // Update the search term for filtering suggestions
    this.searchTerm$.next(inputValue);

    let pruefidentifikator: string | null = null;

    // Handle empty or whitespace-only input
    if (!inputValue || !inputValue.trim()) {
      if (this.onChange) {
        this.onChange(null);
      }
      return;
    }

    const regexPattern = /^(?<pruefi>\d{5})\b(?:\s*-\s*(?<n>.+)\s*)?$/;
    const digitOnlyPattern = /^\d+$/;

    if (regexPattern.test(inputValue)) {
      // Full format with optional name (e.g., "12345 - Some Name" or just "12345")
      const match = inputValue.match(regexPattern);
      pruefidentifikator = match?.groups?.['pruefi'] ?? null;
      // Update the form control with just the pruefidentifikator
      if (pruefidentifikator) {
        this.control.setValue(pruefidentifikator, { emitEvent: false });
        // Emit changes immediately for dropdown selection
        if (this.onChange) {
          this.onChange(pruefidentifikator);
        }
      }
    } else if (digitOnlyPattern.test(inputValue)) {
      // Handle numeric input
      if (inputValue.length === 5) {
        // Exactly 5 digits - trigger immediate load
        pruefidentifikator = inputValue;
        // Update the form control with the 5 digits
        this.control.setValue(pruefidentifikator, { emitEvent: false });
        // Emit changes immediately for 5-digit input
        if (this.onChange) {
          this.onChange(pruefidentifikator);
        }
      } else if (inputValue.length > 5) {
        // More than 5 digits - take first 5
        pruefidentifikator = inputValue.slice(0, 5);
        // Update the form control with just the first 5 digits
        this.control.setValue(pruefidentifikator, { emitEvent: false });
        // Emit changes immediately
        if (this.onChange) {
          this.onChange(pruefidentifikator);
        }
      }
      // Less than 5 digits - treat as invalid (pruefidentifikator remains null)
    }
    // Any other format is considered invalid (pruefidentifikator remains null)

    // Emit null for invalid input
    if (!pruefidentifikator && this.onChange) {
      this.onChange(null);
    }
  }
}
