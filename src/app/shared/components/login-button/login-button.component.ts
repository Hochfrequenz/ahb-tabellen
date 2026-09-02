import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  authState$: Observable<{ isAuthenticated: boolean; isLoading: boolean }> = combineLatest([
    this.facade.isAuthenticated$,
    this.facade.isLoading$,
  ]).pipe(map(([isAuthenticated, isLoading]) => ({ isAuthenticated, isLoading })));

  loginWith(provider: AuthProviderId): void {
    this.facade.login(provider);
  }

  logout(): void {
    this.facade.logout();
  }
}
