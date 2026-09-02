import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade, AuthProviderId } from '../../core/auth/auth.facade';

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
    const target = this.route.snapshot.queryParamMap.get('target');
    if (target) {
      sessionStorage.setItem(POST_LOGIN_TARGET_KEY, target);
    }
    this.facade.login(provider);
  }
}
