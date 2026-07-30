import { Routes } from '@angular/router';

export const PRUEFI_COMPARISON_ROUTES: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (
        await import('./views/pruefi-comparison-landing-page/pruefi-comparison-landing-page.component')
      ).PruefiComparisonLandingPageComponent,
  },
  {
    path: ':pruefiOld/:pruefiNew',
    loadComponent: async () =>
      (await import('./views/pruefi-comparison-page/pruefi-comparison-page.component'))
        .PruefiComparisonPageComponent,
  },
];
