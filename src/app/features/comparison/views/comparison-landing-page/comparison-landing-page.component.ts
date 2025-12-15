import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { ComparisonSearchFormHeaderComponent } from '../../components/comparison-search-form-header/comparison-search-form-header.component';
import { InputSearchEnhancedComponent } from '../../../../shared/components/input-search-enhanced/input-search-enhanced.component';
import { PruefiOverviewComponent } from '../../components/pruefi-overview/pruefi-overview.component';

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
    ComparisonSearchFormHeaderComponent,
    InputSearchEnhancedComponent,
    PruefiOverviewComponent,
  ],
  templateUrl: './comparison-landing-page.component.html',
})
export class ComparisonLandingPageComponent implements OnInit {
  pruefiControl = new FormControl<string>('');
  formatVersionOld = signal<string>('');
  formatVersionNew = signal<string>('');
  validationError = signal<string | null>(null);

  constructor(private readonly title: Title) {}

  ngOnInit(): void {
    this.title.setTitle('AHB Vergleich - Formatversionen vergleichen');
  }

  onValidationError(error: string | null): void {
    this.validationError.set(error);
  }
}
