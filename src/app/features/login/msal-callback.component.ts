import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFacade } from '../../core/auth/auth.facade';
import { POST_LOGIN_TARGET_KEY } from './login.component';

/**
 * Landing route for the Microsoft (MSAL) redirect. The app initializer already processes the
 * redirect response before routing; this component just restores the pre-login target. It lives
 * on a dedicated path so it never collides with Auth0's callback (which uses the origin).
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
    const target = sessionStorage.getItem(POST_LOGIN_TARGET_KEY) ?? '/';
    sessionStorage.removeItem(POST_LOGIN_TARGET_KEY);
    await this.router.navigateByUrl(target);
  }
}
