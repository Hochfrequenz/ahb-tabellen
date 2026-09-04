import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthFacade, AuthProviderId } from '../../../core/auth/auth.facade';

@Component({
  selector: 'app-login-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-button.component.html',
})
export class LoginButtonComponent {
  private facade = inject(AuthFacade);
  private router = inject(Router);

  authState$: Observable<{ isAuthenticated: boolean; isLoading: boolean }> = combineLatest([
    this.facade.isAuthenticated$,
    this.facade.isLoading$,
  ]).pipe(map(([isAuthenticated, isLoading]) => ({ isAuthenticated, isLoading })));

  loginWith(provider: AuthProviderId): void {
    // Pass the current URL so signing in from a deep page returns the user there instead of
    // dumping them on the landing page. The facade sanitizes it before use.
    this.facade.login(provider, this.router.url);
  }

  logout(): void {
    this.facade.logout();
  }
}
