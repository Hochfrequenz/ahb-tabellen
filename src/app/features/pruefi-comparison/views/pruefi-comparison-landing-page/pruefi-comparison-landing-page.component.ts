import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getCurrentEdifactFormatVersion } from '@hochfrequenz/efoli';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { PruefiComparisonSearchFormHeaderComponent } from '../../components/pruefi-comparison-search-form-header/pruefi-comparison-search-form-header.component';
import { PruefiSelectionOverviewComponent } from '../../components/pruefi-selection-overview/pruefi-selection-overview.component';

@Component({
  selector: 'app-pruefi-comparison-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
    PruefiComparisonSearchFormHeaderComponent,
    PruefiSelectionOverviewComponent,
  ],
  templateUrl: './pruefi-comparison-landing-page.component.html',
})
export class PruefiComparisonLandingPageComponent implements OnInit {
  private readonly title = inject(Title);
  private readonly router = inject(Router);

  pruefiOldControl = new FormControl<string>('');
  pruefiNewControl = new FormControl<string>('');
  formatVersion = signal<string>(getCurrentEdifactFormatVersion());
  validationError = signal<string | null>(null);

  ngOnInit(): void {
    this.title.setTitle('AHB Prüfi-Vergleich - Zwei Prüfidentifikatoren vergleichen');
  }

  onValidationError(error: string | null): void {
    this.validationError.set(error);
  }

  onSelectPruefiOld(pruefi: string): void {
    this.pruefiOldControl.setValue(pruefi);
    this.maybeNavigate(pruefi, this.pruefiNewControl.value);
  }

  onSelectPruefiNew(pruefi: string): void {
    this.pruefiNewControl.setValue(pruefi);
    this.maybeNavigate(this.pruefiOldControl.value, pruefi);
  }

  private maybeNavigate(pruefiOld: string | null, pruefiNew: string | null): void {
    if (pruefiOld && pruefiNew && pruefiOld !== pruefiNew) {
      this.router.navigate(['/compare-pruefis', pruefiOld, pruefiNew], {
        queryParams: { 'format-version': this.formatVersion() },
      });
    }
  }
}
