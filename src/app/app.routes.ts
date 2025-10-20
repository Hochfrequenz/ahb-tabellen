import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SearchPageComponent } from './features/search/views/search-page/search-page.component';

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
    path: '',
    loadChildren: async () =>
      (await import('./features/landingpage/landingpage.routes')).LANDINGPAGE_ROUTES,
  },
  {
    path: 'search',
    component: SearchPageComponent,
    canActivate: [AuthGuard],
  },
];
