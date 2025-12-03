import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { PruefiInputComponent } from '../../../ahbs/components/pruefi-input/pruefi-input.component';
import { FormatVersionCacheService } from '../../../search/services/format-version-cache.service';

@Component({
  selector: 'app-comparison-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
    PruefiInputComponent,
  ],
  templateUrl: './comparison-landing-page.component.html',
})
export class ComparisonLandingPageComponent implements OnInit {
  pruefiControl = new FormControl<string>('');
  formatVersionOld = signal<string>('');
  formatVersionNew = signal<string>('');
  formatVersions = signal<string[]>([]);

  constructor(
    private readonly router: Router,
    private readonly title: Title,
    private readonly formatVersionCacheService: FormatVersionCacheService
  ) {
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntilDestroyed())
      .subscribe(versions => {
        this.formatVersions.set(versions);
        if (versions.length >= 2) {
          this.formatVersionNew.set(versions[versions.length - 1]);
          this.formatVersionOld.set(versions[versions.length - 2]);
        }
      });

    this.pruefiControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(pruefi => {
      if (pruefi?.match(/^\d{5}$/)) {
        this.navigateToComparison();
      }
    });
  }

  ngOnInit(): void {
    this.title.setTitle('AHB Vergleich - Formatversionen vergleichen');
  }

  onVersionOldChange(version: string): void {
    if (version >= this.formatVersionNew()) {
      // Swap: user selected old >= new, so swap them
      const previousNew = this.formatVersionNew();
      this.formatVersionNew.set(version);
      this.formatVersionOld.set(previousNew);
    } else {
      this.formatVersionOld.set(version);
    }
  }

  onVersionNewChange(version: string): void {
    if (version <= this.formatVersionOld()) {
      // Swap: user selected new <= old, so swap them
      const previousOld = this.formatVersionOld();
      this.formatVersionOld.set(version);
      this.formatVersionNew.set(previousOld);
    } else {
      this.formatVersionNew.set(version);
    }
  }

  navigateToComparison(): void {
    const pruefi = this.pruefiControl.value;
    if (pruefi?.match(/^\d{5}$/) && this.formatVersionOld() && this.formatVersionNew()) {
      this.router.navigate(['/comparison', pruefi], {
        queryParams: {
          'fv-old': this.formatVersionOld(),
          'fv-new': this.formatVersionNew(),
        },
      });
    }
  }
}
