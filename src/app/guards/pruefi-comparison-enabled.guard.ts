import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { environment } from '../environments/environment';

/**
 * Gates the "AHB Prüfi-Vergleich" route behind the `enablePruefiComparison`
 * environment flag. When the feature is disabled (production), a direct visit to
 * `/compare-pruefis` is redirected to the feature-selection page.
 */
export const pruefiComparisonEnabledGuard: CanActivateFn = (): boolean | UrlTree => {
  if (environment.enablePruefiComparison) {
    return true;
  }
  return inject(Router).createUrlTree(['/features']);
};
