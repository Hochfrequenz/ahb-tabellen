import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthFacade } from '../core/auth/auth.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private facade = inject(AuthFacade);
  private router = inject(Router);

  canActivate(
    _: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    // The facade unifies Auth0 + Microsoft and already short-circuits to `true` in development.
    // Return a UrlTree to the landing page, which offers both sign-in paths (keeping `map` pure)
    // rather than navigating as a side effect; the target is preserved so the user lands where
    // they were headed.
    return this.facade.isAuthenticated$.pipe(
      take(1),
      map(loggedIn =>
        loggedIn ? true : this.router.createUrlTree(['/'], { queryParams: { target: state.url } })
      )
    );
  }
}
