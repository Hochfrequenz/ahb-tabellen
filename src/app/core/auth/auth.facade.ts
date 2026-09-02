import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AUTH_IS_DEVELOPMENT, MSAL_CLIENT } from './msal.tokens';

export type AuthProviderId = 'auth0' | 'microsoft';

export interface AuthUser {
  email?: string;
  name?: string;
  sub?: string;
  provider: AuthProviderId | 'dev';
}

const ACTIVE_PROVIDER_KEY = 'ahb.activeAuthProvider';

const DEV_USER: AuthUser = {
  email: 'local@development.com',
  name: 'Local Development User',
  sub: 'local-development',
  provider: 'dev',
};

/**
 * Single seam over the two independent identity providers (Auth0 and Microsoft Entra ID via
 * MSAL). Guards and components depend on this facade, never on a specific SDK, so a user may be
 * signed in through either provider. In development it short-circuits to a stub user, exactly as
 * the previous inline `isDevelopment` checks did.
 */
@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly auth0 = inject(Auth0Service);
  private readonly msal = inject(MSAL_CLIENT);
  private readonly isDevelopment = inject(AUTH_IS_DEVELOPMENT);

  /** MSAL has no reactive auth state, so we track it ourselves and refresh it on init/login. */
  private readonly msalAuthenticated$ = new BehaviorSubject<boolean>(false);

  readonly isAuthenticated$: Observable<boolean>;
  readonly isLoading$: Observable<boolean>;
  readonly user$: Observable<AuthUser | null>;

  constructor() {
    if (this.isDevelopment) {
      this.isAuthenticated$ = of(true);
      this.isLoading$ = of(false);
      this.user$ = of(DEV_USER);
      return;
    }

    // Do NOT read msal.getAllAccounts() here: MSAL throws if queried before initialize().
    // The state starts false and is set in initializeMsal(), run by the app initializer.
    this.isAuthenticated$ = combineLatest([
      this.auth0.isAuthenticated$,
      this.msalAuthenticated$,
    ]).pipe(map(([auth0Authed, msalAuthed]) => auth0Authed || msalAuthed));

    this.isLoading$ = this.auth0.isLoading$;

    this.user$ = combineLatest([this.auth0.user$, this.msalAuthenticated$]).pipe(
      map(([auth0User, msalAuthed]) => this.resolveUser(auth0User, msalAuthed))
    );
  }

  login(provider: AuthProviderId): void {
    localStorage.setItem(ACTIVE_PROVIDER_KEY, provider);
    if (provider === 'auth0') {
      this.auth0.loginWithRedirect();
    } else {
      void this.msal.loginRedirect({ scopes: environment.entraScopes });
    }
  }

  logout(): void {
    const active = localStorage.getItem(ACTIVE_PROVIDER_KEY);
    localStorage.removeItem(ACTIVE_PROVIDER_KEY);
    if (active === 'microsoft') {
      void this.msal.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
    } else {
      this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    }
  }

  /**
   * Initialize MSAL and process any pending redirect response. Called once at app startup (and
   * again on the dedicated MSAL callback route). No-op under the development stub.
   */
  async initializeMsal(): Promise<void> {
    if (this.isDevelopment) {
      return;
    }
    await this.msal.initialize();
    const result = await this.msal.handleRedirectPromise();
    if (result?.account) {
      this.msal.setActiveAccount(result.account);
    }
    this.msalAuthenticated$.next(this.msal.getAllAccounts().length > 0);
  }

  private resolveUser(
    auth0User:
      { email?: string | null; name?: string | null; sub?: string | null } | null | undefined,
    msalAuthed: boolean
  ): AuthUser | null {
    if (localStorage.getItem(ACTIVE_PROVIDER_KEY) === 'microsoft' && msalAuthed) {
      const account = this.msal.getActiveAccount() ?? this.msal.getAllAccounts()[0];
      return account
        ? {
            email: account.username,
            name: account.name,
            sub: account.localAccountId,
            provider: 'microsoft',
          }
        : null;
    }
    return auth0User
      ? {
          email: auth0User.email ?? undefined,
          name: auth0User.name ?? undefined,
          sub: auth0User.sub ?? undefined,
          provider: 'auth0',
        }
      : null;
  }
}
