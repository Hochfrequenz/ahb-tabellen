import { NgClass } from '@angular/common';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feature-selection-page',
  standalone: true,
  imports: [FooterComponent, NgClass],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './feature-selection-page.component.html',
})
export class FeatureSelectionPageComponent {
  private router = inject(Router);

  readonly showPruefiComparison = environment.enablePruefiComparison;
  readonly showMigView = environment.enableMigView;

  // Keep the card row balanced: one row with as many columns as cards (3 to 5). Tailwind only
  // generates classes it finds literally in the source, hence the lookup instead of a template.
  readonly cardGridColumnsClass = (
    { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5' } as Record<number, string>
  )[3 + Number(this.showPruefiComparison) + Number(this.showMigView)];

  onAhbClick() {
    this.router.navigate(['/ahb']);
  }

  onSearchClick() {
    this.router.navigate(['/search']);
  }

  onComparisonClick() {
    this.router.navigate(['/compare']);
  }

  onPruefiComparisonClick() {
    this.router.navigate(['/compare-pruefis']);
  }

  onMigClick() {
    this.router.navigate(['/mig']);
  }

  onMcpClick() {
    this.router.navigate(['/mcp-integration']);
  }
}
