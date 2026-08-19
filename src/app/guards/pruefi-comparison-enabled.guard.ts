import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { environment } from '../environments/environment';

/**
 * Gates the "AHB Prüfi-Vergleich" route behind the `enablePruefiComparison`
 * environment flag. When the feature is disabled (production), a visit to
 * `/compare-pruefis` is redirected to the feature-selection page (`/features`).
 *
 * Note: the route also declares `AuthGuard`, which runs first. In production an
 * unauthenticated direct visit therefore triggers the Auth0 login redirect
 * before this guard runs; the redirect to `/features` happens once the user is
 * authenticated.
 */
export const pruefiComparisonEnabledGuard: CanActivateFn = (): boolean | UrlTree => {
  if (environment.enablePruefiComparison) {
    return true;
  }
  return inject(Router).createUrlTree(['/features']);
};
