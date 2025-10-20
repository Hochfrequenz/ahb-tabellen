import { Routes } from '@angular/router';

export const FEATURE_SELECTION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: async () =>
      (await import('./views/feature-selection-page/feature-selection-page.component'))
        .FeatureSelectionPageComponent,
  },
];
