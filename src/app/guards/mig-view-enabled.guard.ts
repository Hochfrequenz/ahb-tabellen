import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { environment } from '../environments/environment';

/**
 * Gates the MIG structure view behind the `enableMigView` flag. It is off in production, whose
 * database has no MIG data; a direct visit to `/mig` is then redirected to `/features`.
 */
export const migViewEnabledGuard: CanActivateFn = (): boolean | UrlTree => {
  if (environment.enableMigView) {
    return true;
  }
  return inject(Router).createUrlTree(['/features']);
};
