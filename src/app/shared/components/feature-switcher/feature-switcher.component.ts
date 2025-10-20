import { Component, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

interface FeatureOption {
  value: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-feature-switcher',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './feature-switcher.component.html',
  styleUrls: ['./feature-switcher.component.scss'],
})
export class FeatureSwitcherComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  readonly features: FeatureOption[] = [
    { value: 'ahb', label: 'AHB-Tabellen', route: '/ahb' },
    { value: 'search', label: 'Globale Suche', route: '/search' },
  ];

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFeatureChange(selectedValue: string): void {
    const selectedFeature = this.features.find(f => f.value === selectedValue);
    if (selectedFeature) {
      // Only navigate if we're not already on the target route
      const currentUrl = this.router.url;
      if (!currentUrl.startsWith(selectedFeature.route)) {
        this.router.navigate([selectedFeature.route]);
      }
    }
  }

  getCurrentFeatureValue(): string {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/search')) {
      return 'search';
    } else if (currentUrl.startsWith('/ahb')) {
      return 'ahb';
    }
    return 'ahb'; // default
  }
}
