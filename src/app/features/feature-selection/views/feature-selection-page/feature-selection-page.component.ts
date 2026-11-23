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

  // Keep the card row balanced: a full row of 4 when the Prüfi-Vergleich card
  // is shown, or 3 when it is hidden (otherwise 3 cards leave an empty column).
  readonly cardGridColumnsClass = this.showPruefiComparison ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

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

  onMcpClick() {
    this.router.navigate(['/mcp-integration']);
  }
}
