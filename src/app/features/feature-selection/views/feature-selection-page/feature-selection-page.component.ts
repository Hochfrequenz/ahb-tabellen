import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';

@Component({
  selector: 'app-feature-selection-page',
  standalone: true,
  imports: [FooterComponent],
  templateUrl: './feature-selection-page.component.html',
})
export class FeatureSelectionPageComponent {
  constructor(private router: Router) {}

  onAhbClick() {
    this.router.navigate(['/ahb']);
  }

  onSearchClick() {
    this.router.navigate(['/search']);
  }

  onComparisonClick() {
    this.router.navigate(['/comparison']);
  }
}
