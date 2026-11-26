import { Routes } from '@angular/router';

const page = async () => (await import('./views/mig-page/mig-page.component')).MigPageComponent;

export const MIG_ROUTES: Routes = [
  { path: '', loadComponent: page },
  // Format version chosen, MIG not yet: the page picks the first MIG of that version.
  { path: ':formatVersion', loadComponent: page },
  { path: ':formatVersion/:format', loadComponent: page },
];
