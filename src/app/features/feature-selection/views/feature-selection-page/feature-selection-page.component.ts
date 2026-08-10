import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feature-selection-page',
  standalone: true,
  imports: [FooterComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './feature-selection-page.component.html',
})
export class FeatureSelectionPageComponent {
  private router = inject(Router);

  readonly showPruefiComparison = environment.enablePruefiComparison;

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
