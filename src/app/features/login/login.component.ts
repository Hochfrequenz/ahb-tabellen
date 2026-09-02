import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade, AuthProviderId } from '../../core/auth/auth.facade';
import { safeInternalTarget } from './safe-target';
import { safeStorageRemove, safeStorageSet } from '../../core/auth/safe-storage';

/** sessionStorage key holding the route the user was heading to before being asked to sign in. */
export const POST_LOGIN_TARGET_KEY = 'ahb.postLoginTarget';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private facade = inject(AuthFacade);
  private route = inject(ActivatedRoute);

  signIn(provider: AuthProviderId): void {
    // The target is user-controlled (?target=…); sanitize it to a safe internal path so it can't
    // drive an open redirect. safeInternalTarget returns '/' for anything unsafe.
    const safe = safeInternalTarget(this.route.snapshot.queryParamMap.get('target'));
    const target = safe === '/' ? undefined : safe;
    // Only the MSAL callback consumes this key; store it for Microsoft, and clear it for Auth0 so
    // a stale target can't leak into a later Microsoft login. Auth0 restores its target via the
    // SDK's appState (passed through the facade).
    if (provider === 'microsoft' && target) {
      safeStorageSet(sessionStorage, POST_LOGIN_TARGET_KEY, target);
    } else {
      safeStorageRemove(sessionStorage, POST_LOGIN_TARGET_KEY);
    }
    this.facade.login(provider, target);
  }
}
