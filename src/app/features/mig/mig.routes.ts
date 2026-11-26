import { Routes } from '@angular/router';

const page = async () => (await import('./views/mig-page/mig-page.component')).MigPageComponent;

export const MIG_ROUTES: Routes = [
  { path: '', loadComponent: page },
  { path: ':formatVersion/:format', loadComponent: page },
];
