import { Injectable, inject } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AUTH_IS_DEVELOPMENT, MSAL_CLIENT } from './msal.tokens';
import { safeStorageGet, safeStorageRemove, safeStorageSet } from './safe-storage';
import { safeInternalTarget } from './safe-target';

export type AuthProviderId = 'auth0' | 'microsoft';

export interface AuthUser {
  email?: string;
  name?: string;
  sub?: string;
  provider: AuthProviderId | 'dev';
}

const ACTIVE_PROVIDER_KEY = 'ahb.activeAuthProvider';

/** sessionStorage key holding the route the user was heading to before being asked to sign in. */
export const POST_LOGIN_TARGET_KEY = 'ahb.postLoginTarget';

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

  /** In-flight MSAL initialization, shared across callers so init/redirect handling runs once. */
  private initialization?: Promise<void>;

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

  /**
   * Start a sign-in with the chosen provider, optionally returning the user to `target` afterwards.
   *
   * Every caller passes a user-influenced value here (`?target=…` from the guard, `router.url` from
   * the header), so the target is sanitized once, in this one place, rather than at each call site
   * where the checks could drift apart or be forgotten. A hostile target is dropped, but the
   * sign-in itself still proceeds — the user asked to log in, and only their destination was bad.
   */
  login(provider: AuthProviderId, target?: string): void {
    // In the dev stub the user is already "signed in"; never fire a real provider redirect
    // (keeps the "stub unless ?realauth=1" contract).
    if (this.isDevelopment) {
      return;
    }
    safeStorageSet(localStorage, ACTIVE_PROVIDER_KEY, provider);

    // safeInternalTarget collapses anything unsafe (and anything absent) to '/', which is also
    // the app root — i.e. "no particular destination", so there is nothing worth carrying.
    const safe = safeInternalTarget(target);
    const resolved = safe === '/' ? undefined : safe;

    if (provider === 'auth0') {
      // Auth0 restores its own target from appState. Clear the Microsoft key so a target stashed
      // by an abandoned Microsoft attempt can't leak into this session's callback.
      safeStorageRemove(sessionStorage, POST_LOGIN_TARGET_KEY);
      this.auth0.loginWithRedirect(resolved ? { appState: { target: resolved } } : undefined);
    } else {
      // MSAL's redirect response carries no app-level state, so the target rides in sessionStorage
      // and is re-validated by the callback route before it navigates.
      if (resolved) {
        safeStorageSet(sessionStorage, POST_LOGIN_TARGET_KEY, resolved);
      } else {
        safeStorageRemove(sessionStorage, POST_LOGIN_TARGET_KEY);
      }
      void this.msal.loginRedirect({ scopes: environment.entraScopes });
    }
  }

  logout(): void {
    if (this.isDevelopment) {
      return;
    }
    safeStorageRemove(localStorage, ACTIVE_PROVIDER_KEY);
    // Derive the effective provider from the live MSAL session rather than the persisted hint:
    // a cached Microsoft account keeps `isAuthenticated$` true, so it must drive logout even when
    // the key is missing or stale (otherwise the user gets stuck in a "can't log out" loop).
    if (this.msalAuthenticated$.value) {
      void this.msal.logoutRedirect({ postLogoutRedirectUri: window.location.origin });
    } else {
      this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
    }
  }

  /**
   * Initialize MSAL and process any pending redirect response. Both the app initializer and the
   * MSAL callback route call this on the redirect round-trip, so it is idempotent: the in-flight
   * promise is cached and reused (and cleared on failure so a later call can retry). No-op under
   * the development stub.
   */
  initializeMsal(): Promise<void> {
    if (this.isDevelopment) {
      return Promise.resolve();
    }
    if (!this.initialization) {
      this.initialization = this.doInitializeMsal().catch(error => {
        this.initialization = undefined;
        throw error;
      });
    }
    return this.initialization;
  }

  private async doInitializeMsal(): Promise<void> {
    await this.msal.initialize();
    // navigateToLoginRequestUrl: false — we own post-login routing (MsalCallbackComponent). Left
    // at the default (true), MSAL navigates back to the URL where loginRedirect was called from
    // (the /login chooser), bouncing the just-signed-in user straight back to the login page.
    const result = await this.msal.handleRedirectPromise({ navigateToLoginRequestUrl: false });
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
    // Resolve from the actual sessions present, not the persisted hint: a live MSAL account must
    // surface a user even if the active-provider key was cleared or never written.
    const account = msalAuthed
      ? (this.msal.getActiveAccount() ?? this.msal.getAllAccounts()[0])
      : null;
    const microsoftUser: AuthUser | null = account
      ? {
          email: account.username,
          name: account.name ?? undefined,
          sub: account.localAccountId,
          provider: 'microsoft',
        }
      : null;
    const auth0Resolved: AuthUser | null = auth0User
      ? {
          email: auth0User.email ?? undefined,
          name: auth0User.name ?? undefined,
          sub: auth0User.sub ?? undefined,
          provider: 'auth0',
        }
      : null;

    if (microsoftUser && auth0Resolved) {
      // Both signed in (unusual): let the persisted hint break the tie, defaulting to Microsoft.
      return safeStorageGet(localStorage, ACTIVE_PROVIDER_KEY) === 'auth0'
        ? auth0Resolved
        : microsoftUser;
    }
    return microsoftUser ?? auth0Resolved;
  }
}
