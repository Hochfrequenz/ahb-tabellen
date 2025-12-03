import { Routes } from '@angular/router';

export const COMPARISON_ROUTES: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (await import('./views/comparison-landing-page/comparison-landing-page.component'))
        .ComparisonLandingPageComponent,
  },
  {
    path: ':pruefi',
    loadComponent: async () =>
      (await import('./views/comparison-page/comparison-page.component')).ComparisonPageComponent,
  },
];
