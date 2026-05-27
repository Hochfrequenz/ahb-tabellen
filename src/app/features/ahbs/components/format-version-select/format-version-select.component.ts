import { Component, OnInit, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormatVersionsService } from '../../../../core/api';
import { Observable, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  getCurrentEdifactFormatVersion,
  getEdifactFormatVersionLabel,
  EdifactFormatVersion,
} from '@hochfrequenz/efoli';

@Component({
  selector: 'app-format-version-select',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './format-version-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormatVersionSelectComponent),
      multi: true,
    },
  ],
})
export class FormatVersionSelectComponent implements ControlValueAccessor, OnInit {
  control = new FormControl<string>('');

  formatVersions$!: Observable<{ value: string; label: string }[]>;

  public onChange?: (formatVersion: string | null) => void;

  constructor(private readonly formatVersionsService: FormatVersionsService) {}

  ngOnInit(): void {
    this.control.disable();
    this.formatVersions$ = this.formatVersionsService.getFormatVersions().pipe(
      map(versions =>
        versions.map(v => ({
          value: v,
          label: this.getFormatVersionLabel(v),
        }))
      ),
      tap(() => {
        if (!this.control.value) {
          const defaultVersion = getCurrentEdifactFormatVersion();
          this.control.setValue(defaultVersion);
          if (this.onChange) {
            this.onChange(defaultVersion);
          }
        }
        this.control.enable();
      })
    );

    // Subscribe to value changes
    this.control.valueChanges.subscribe(value => {
      if (this.onChange) {
        this.onChange(value);
      }
    });
  }

  writeValue(formatVersion: string): void {
    this.control.setValue(formatVersion);
  }

  registerOnChange(fn: (formatVersion: string | null) => void): void {
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

  private getFormatVersionLabel(formatVersion: string): string {
    try {
      return getEdifactFormatVersionLabel(formatVersion as EdifactFormatVersion);
    } catch {
      return formatVersion;
    }
  }
}
