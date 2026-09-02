import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthFacade } from '../core/auth/auth.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private facade = inject(AuthFacade);
  private router = inject(Router);

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // The facade unifies Auth0 + Microsoft and already short-circuits to `true` in development.
    return this.facade.isAuthenticated$.pipe(
      take(1),
      map(loggedIn => {
        if (!loggedIn) {
          // Send the user to the provider chooser, preserving where they were headed.
          this.router.navigate(['/login'], { queryParams: { target: state.url } });
          return false;
        }
        return true;
      })
    );
  }
}
