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
  imports: [CommonModule],
  templateUrl: './feature-switcher.component.html',
  styleUrls: ['./feature-switcher.component.scss'],
})
export class FeatureSwitcherComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  isDropdownOpen = false;

  readonly features: FeatureOption[] = [
    { value: 'ahb', label: 'AHB-Tabellen', route: '/ahb' },
    { value: 'search', label: 'Globale Suche', route: '/search' },
  ];

  constructor(private router: Router) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFeature(feature: FeatureOption): void {
    this.isDropdownOpen = false;
    const currentUrl = this.router.url;
    if (!currentUrl.startsWith(feature.route)) {
      this.router.navigate([feature.route]);
    }
  }

  getCurrentFeatureLabel(): string {
    const currentUrl = this.router.url;
    if (currentUrl.startsWith('/search')) {
      return 'Globale Suche';
    } else if (currentUrl.startsWith('/ahb')) {
      return 'AHB-Tabellen';
    }
    return 'AHB-Tabellen'; // default
  }

  isFeatureSelected(feature: FeatureOption): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith(feature.route);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.feature-switcher')) {
      this.isDropdownOpen = false;
    }
  }
}
