import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Title } from '@angular/platform-browser';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { SolutionsFooterComponent } from '../../../../shared/components/solutions-footer/solutions-footer.component';
import { ComparisonSearchFormHeaderComponent } from '../../components/comparison-search-form-header/comparison-search-form-header.component';
import { InputSearchEnhancedComponent } from '../../../../shared/components/input-search-enhanced/input-search-enhanced.component';
import { PruefiOverviewComponent } from '../../components/pruefi-overview/pruefi-overview.component';
import { FormatVersionCacheService } from '../../../search/services/format-version-cache.service';

@Component({
  selector: 'app-comparison-landing-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    SolutionsFooterComponent,
    ComparisonSearchFormHeaderComponent,
    InputSearchEnhancedComponent,
    PruefiOverviewComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './comparison-landing-page.component.html',
})
export class ComparisonLandingPageComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  pruefiControl = new FormControl<string>('');
  formatVersionOld = signal<string>('');
  formatVersionNew = signal<string>('');
  validationError = signal<string | null>(null);

  constructor(
    private readonly title: Title,
    private readonly formatVersionCacheService: FormatVersionCacheService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('AHB Vergleich - Formatversionen vergleichen');

    // Load default format versions once at the landing page level
    // to avoid race conditions from multiple search-form-header instances.
    // Note: This view component follows the project pattern of not having a dedicated
    // test file, as testing is focused on reusable components. The subscription logic
    // is straightforward and the FormatVersionCacheService is tested separately.
    this.formatVersionCacheService
      .getFormatVersions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(versions => {
        if (versions.length >= 2 && !this.formatVersionOld()) {
          this.formatVersionOld.set(versions[versions.length - 2]);
        }
        if (versions.length >= 1 && !this.formatVersionNew()) {
          this.formatVersionNew.set(versions[versions.length - 1]);
        }
      });
  }

  onValidationError(error: string | null): void {
    this.validationError.set(error);
  }
}
