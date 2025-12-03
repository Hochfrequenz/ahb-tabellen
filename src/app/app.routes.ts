import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'features',
    loadChildren: async () =>
      (await import('./features/feature-selection/feature-selection.routes'))
        .FEATURE_SELECTION_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'ahb',
    loadChildren: async () => (await import('./features/ahbs/ahb.routes')).AHB_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: 'comparison',
    loadChildren: async () =>
      (await import('./features/comparison/comparison.routes')).COMPARISON_ROUTES,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: async () =>
      (await import('./features/landingpage/landingpage.routes')).LANDINGPAGE_ROUTES,
  },
  {
    path: 'search',
    loadChildren: async () => (await import('./features/search/search.routes')).SEARCH_ROUTES,
    canActivate: [AuthGuard],
  },
];
