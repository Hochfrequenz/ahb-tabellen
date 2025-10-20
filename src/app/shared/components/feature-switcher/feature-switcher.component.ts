import { Component, HostListener, ElementRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
export class FeatureSwitcherComponent {
  isDropdownOpen = false;

  readonly features: FeatureOption[] = [
    { value: 'ahb', label: 'AHB-Tabellen', route: '/ahb' },
    { value: 'search', label: 'Globale Suche', route: '/search' },
  ];

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

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
    return this.features.find(f => currentUrl.startsWith(f.route))?.label ?? this.features[0].label;
  }

  isFeatureSelected(feature: FeatureOption): boolean {
    const currentUrl = this.router.url;
    return currentUrl.startsWith(feature.route);
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
      // Focus first option if none is focused
      const firstOption = this.elementRef.nativeElement.querySelector('.dropdown-option');
      if (firstOption) {
        (firstOption as HTMLElement).focus();
      }
    }
  }
}
