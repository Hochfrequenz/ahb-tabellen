import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-feature-selection-page',
  standalone: true,
  imports: [FooterComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './feature-selection-page.component.html',
})
export class FeatureSelectionPageComponent {
  private router = inject(Router);

  onAhbClick() {
    this.router.navigate(['/ahb']);
  }

  onSearchClick() {
    this.router.navigate(['/search']);
  }

  onComparisonClick() {
    this.router.navigate(['/compare']);
  }

  onMcpClick() {
    this.router.navigate(['/mcp-integration']);
  }
}
