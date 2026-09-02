import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { POST_LOGIN_TARGET_KEY } from './login.component';
import { safeInternalTarget } from './safe-target';

/**
 * Landing route for the Microsoft (MSAL) redirect. It awaits MSAL initialization — shared and
 * idempotent with the app initializer, so the redirect response is processed exactly once — and
 * then restores the pre-login target. It lives on a dedicated path so it never collides with
 * Auth0's callback (which uses the origin).
 */
@Component({
  selector: 'app-msal-callback',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p class="p-8 text-center text-hf-weiches-schwarz/70">
    Anmeldung wird abgeschlossen…
  </p>`,
})
export class MsalCallbackComponent implements OnInit {
  private facade = inject(AuthFacade);
  private router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.facade.initializeMsal();
    // sessionStorage is mutable, so re-validate the target here (not only where it was stored)
    // before navigating, to avoid an open-redirect/invalid-route navigation.
    const target = safeInternalTarget(sessionStorage.getItem(POST_LOGIN_TARGET_KEY));
    sessionStorage.removeItem(POST_LOGIN_TARGET_KEY);
    await this.router.navigateByUrl(target);
  }
}
