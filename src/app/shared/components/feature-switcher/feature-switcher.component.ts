import {
  Component,
  HostListener,
  ElementRef,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';

import { Router } from '@angular/router';

interface FeatureOption {
  value: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-feature-switcher',
  standalone: true,
  imports: [],
  templateUrl: './feature-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./feature-switcher.component.scss'],
})
export class FeatureSwitcherComponent {
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isDropdownOpen = false;

  readonly features: FeatureOption[] = [
    { value: 'ahb', label: 'AHB-Tabellen', route: '/ahb' },
    { value: 'search', label: 'Globale Suche', route: '/search' },
    { value: 'comparison', label: 'AHB Vergleich', route: '/compare' },
  ];

  toggleDropdown(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFeature(feature: FeatureOption, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isDropdownOpen = false;
    const currentUrl = this.router.url;
    if (!this.isRouteMatch(currentUrl, feature.route)) {
      this.router.navigate([feature.route]);
    }
  }

  getCurrentFeatureLabel(): string {
    const currentUrl = this.router.url;
    return (
      this.features.find(f => this.isRouteMatch(currentUrl, f.route))?.label ??
      this.features[0]?.label ??
      'Unknown Feature'
    );
  }

  isFeatureSelected(feature: FeatureOption): boolean {
    const currentUrl = this.router.url;
    return this.isRouteMatch(currentUrl, feature.route);
  }

  private isRouteMatch(currentUrl: string, featureRoute: string): boolean {
    // Normalize URLs by removing query parameters and fragments
    const normalizedCurrent = currentUrl.split('?')[0].split('#')[0];
    const normalizedFeature = featureRoute.split('?')[0].split('#')[0];

    // Check for exact match first
    if (normalizedCurrent === normalizedFeature) {
      return true;
    }

    // Check if current URL starts with feature route followed by a path separator
    // This prevents false positives like '/ahb-extra' matching '/ahb'
    return normalizedCurrent.startsWith(normalizedFeature + '/');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isDropdownOpen = false;
    }
  }

  @HostListener('keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      this.isDropdownOpen = false;
      event.preventDefault();
    }
  }

  @HostListener('keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      event.preventDefault();
      this.focusNextOption();
    } else {
      // Open dropdown and focus first option
      this.toggleDropdown();
      setTimeout(() => this.focusFirstOption(), 0);
    }
  }

  @HostListener('keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      event.preventDefault();
      this.focusPreviousOption();
    }
  }

  @HostListener('keydown.home', ['$event'])
  onHomeKey(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      event.preventDefault();
      this.focusFirstOption();
    }
  }

  @HostListener('keydown.end', ['$event'])
  onEndKey(event: KeyboardEvent): void {
    if (this.isDropdownOpen) {
      event.preventDefault();
      this.focusLastOption();
    }
  }

  private focusFirstOption(): void {
    const firstOption = this.elementRef.nativeElement.querySelector('.dropdown-option');
    if (firstOption) {
      (firstOption as HTMLElement).focus();
    }
  }

  private focusLastOption(): void {
    const options = this.elementRef.nativeElement.querySelectorAll('.dropdown-option');
    if (options.length > 0) {
      (options[options.length - 1] as HTMLElement).focus();
    }
  }

  private focusNextOption(): void {
    const options = this.elementRef.nativeElement.querySelectorAll('.dropdown-option');
    const currentFocused = document.activeElement as HTMLElement;
    const currentIndex = Array.from(options).indexOf(currentFocused);

    if (currentIndex === -1) {
      // No option focused, focus first
      this.focusFirstOption();
    } else if (currentIndex < options.length - 1) {
      // Focus next option
      (options[currentIndex + 1] as HTMLElement).focus();
    } else {
      // Already at last option, focus first (wrap around)
      this.focusFirstOption();
    }
  }

  private focusPreviousOption(): void {
    const options = this.elementRef.nativeElement.querySelectorAll('.dropdown-option');
    const currentFocused = document.activeElement as HTMLElement;
    const currentIndex = Array.from(options).indexOf(currentFocused);

    if (currentIndex === -1) {
      // No option focused, focus last
      this.focusLastOption();
    } else if (currentIndex > 0) {
      // Focus previous option
      (options[currentIndex - 1] as HTMLElement).focus();
    } else {
      // Already at first option, focus last (wrap around)
      this.focusLastOption();
    }
  }
}
