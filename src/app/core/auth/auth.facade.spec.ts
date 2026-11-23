import { TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom, Observable, Subject, of } from 'rxjs';
import { AuthFacade, POST_LOGIN_TARGET_KEY } from './auth.facade';
import { AUTH_IS_DEVELOPMENT, MSAL_CLIENT } from './msal.tokens';

type MockAuth0 = {
  isAuthenticated$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  user$: Observable<{ email?: string; name?: string; sub?: string } | null>;
  loginWithRedirect: jest.Mock;
  logout: jest.Mock;
};

type MockMsal = {
  getAllAccounts: jest.Mock;
  getActiveAccount: jest.Mock;
  setActiveAccount: jest.Mock;
  initialize: jest.Mock;
  handleRedirectPromise: jest.Mock;
  loginRedirect: jest.Mock;
  logoutRedirect: jest.Mock;
};

function makeAuth0(overrides: Partial<MockAuth0> = {}): MockAuth0 {
  return {
    isAuthenticated$: of(false),
    isLoading$: of(false),
    user$: of(null),
    loginWithRedirect: jest.fn(),
    logout: jest.fn(),
    ...overrides,
  };
}

function makeMsal(overrides: Partial<MockMsal> = {}): MockMsal {
  return {
    getAllAccounts: jest.fn().mockReturnValue([]),
    getActiveAccount: jest.fn().mockReturnValue(null),
    setActiveAccount: jest.fn(),
    initialize: jest.fn().mockResolvedValue(undefined),
    handleRedirectPromise: jest.fn().mockResolvedValue(null),
    loginRedirect: jest.fn().mockResolvedValue(undefined),
    logoutRedirect: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

function createFacade(
  isDevelopment: boolean,
  auth0: MockAuth0 = makeAuth0(),
  msal: MockMsal = makeMsal()
): { facade: AuthFacade; auth0: MockAuth0; msal: MockMsal } {
  TestBed.configureTestingModule({
    providers: [
      AuthFacade,
      { provide: AuthService, useValue: auth0 },
      { provide: MSAL_CLIENT, useValue: msal },
      { provide: AUTH_IS_DEVELOPMENT, useValue: isDevelopment },
    ],
  });
  return { facade: TestBed.inject(AuthFacade), auth0, msal };
}

describe('AuthFacade', () => {
  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  describe('development stub', () => {
    it('reports authenticated without touching either SDK', async () => {
      const msal = makeMsal();
      const { facade } = createFacade(true, makeAuth0(), msal);

      await expect(firstValueFrom(facade.isAuthenticated$)).resolves.toBe(true);
      await expect(firstValueFrom(facade.isLoading$)).resolves.toBe(false);
      expect(msal.getAllAccounts).not.toHaveBeenCalled();
    });

    it('emits the local development user', async () => {
      const { facade } = createFacade(true);
      const user = await firstValueFrom(facade.user$);
      expect(user).toMatchObject({ email: 'local@development.com', provider: 'dev' });
    });

    it('initializeMsal is a no-op in development', async () => {
      const msal = makeMsal();
      const { facade } = createFacade(true, makeAuth0(), msal);
      await facade.initializeMsal();
      expect(msal.initialize).not.toHaveBeenCalled();
    });

    it('login() does not trigger a real provider redirect', () => {
      const { facade, auth0, msal } = createFacade(true);
      facade.login('microsoft');
      facade.login('auth0');
      expect(msal.loginRedirect).not.toHaveBeenCalled();
      expect(auth0.loginWithRedirect).not.toHaveBeenCalled();
    });

    it('logout() does not trigger a real provider redirect', () => {
      const { facade, auth0, msal } = createFacade(true);
      facade.logout();
      expect(auth0.logout).not.toHaveBeenCalled();
      expect(msal.logoutRedirect).not.toHaveBeenCalled();
    });
  });

  describe('authentication state (production)', () => {
    it('is false when neither provider has a session', async () => {
      const { facade } = createFacade(false);
      await expect(firstValueFrom(facade.isAuthenticated$)).resolves.toBe(false);
    });

    it('is true when Auth0 reports a session', async () => {
      const { facade } = createFacade(false, makeAuth0({ isAuthenticated$: of(true) }));
      await expect(firstValueFrom(facade.isAuthenticated$)).resolves.toBe(true);
    });

    it('is true when MSAL has an account (even if Auth0 does not), after init', async () => {
      const msal = makeMsal({
        getAllAccounts: jest.fn().mockReturnValue([{ username: 'a@b.de' }]),
      });
      const { facade } = createFacade(false, makeAuth0({ isAuthenticated$: of(false) }), msal);
      // MSAL state is only read after initialize(); before init it must not be queried.
      await facade.initializeMsal();
      await expect(firstValueFrom(facade.isAuthenticated$)).resolves.toBe(true);
    });
  });

  describe('recognising a session', () => {
    it('reports authenticated from MSAL without waiting for Auth0 to answer', async () => {
      // Auth0's isAuthenticated$ is gated behind its own loading check and emits NOTHING until
      // that resolves. A cached Microsoft account must not be held hostage to it.
      const auth0Pending = new Subject<boolean>();
      const msal = makeMsal({
        getAllAccounts: jest.fn().mockReturnValue([{ username: 'e@hf.de' }]),
      });
      const { facade } = createFacade(
        false,
        makeAuth0({ isAuthenticated$: auth0Pending.asObservable() }),
        msal
      );

      const seen: boolean[] = [];
      const sub = facade.isAuthenticated$.subscribe(value => seen.push(value));
      await facade.initializeMsal();

      expect(seen).toEqual([true]);
      sub.unsubscribe();
    });

    it('still reports anonymous only once both providers have answered', async () => {
      const auth0Pending = new Subject<boolean>();
      const { facade } = createFacade(
        false,
        makeAuth0({ isAuthenticated$: auth0Pending.asObservable() })
      );

      const seen: boolean[] = [];
      const sub = facade.isAuthenticated$.subscribe(value => seen.push(value));
      // Neither has said yes; nothing may be reported yet, or the guard would bounce a user whose
      // session check simply has not finished.
      expect(seen).toEqual([]);

      auth0Pending.next(false);
      expect(seen).toEqual([false]);
      sub.unsubscribe();
    });
  });

  describe('login', () => {
    it('routes login("auth0") to Auth0 and records the active provider', () => {
      const { facade, auth0 } = createFacade(false);
      facade.login('auth0');
      expect(auth0.loginWithRedirect).toHaveBeenCalledTimes(1);
      expect(localStorage.getItem('ahb.activeAuthProvider')).toBe('auth0');
    });

    it('passes the target to Auth0 as appState when provided', () => {
      const { facade, auth0 } = createFacade(false);
      facade.login('auth0', '/search');
      expect(auth0.loginWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({ appState: { target: '/search' } })
      );
    });

    it('routes login("microsoft") to MSAL with the configured scopes', () => {
      const { facade, msal } = createFacade(false);
      facade.login('microsoft');
      expect(msal.loginRedirect).toHaveBeenCalledTimes(1);
      expect(msal.loginRedirect).toHaveBeenCalledWith(
        expect.objectContaining({ scopes: ['openid', 'profile', 'email'] })
      );
      expect(localStorage.getItem('ahb.activeAuthProvider')).toBe('microsoft');
    });

    it('stashes the target for Microsoft so the callback can restore it', () => {
      const { facade } = createFacade(false);
      facade.login('microsoft', '/ahb/UTILMD');
      expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBe('/ahb/UTILMD');
    });

    it('clears a stale Microsoft target when signing in with Auth0', () => {
      sessionStorage.setItem(POST_LOGIN_TARGET_KEY, '/stale');
      const { facade, auth0 } = createFacade(false);
      facade.login('auth0', '/search');
      expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
      expect(auth0.loginWithRedirect).toHaveBeenCalledWith(
        expect.objectContaining({ appState: { target: '/search' } })
      );
    });

    it('clears a stale Microsoft target when no new target is given', () => {
      sessionStorage.setItem(POST_LOGIN_TARGET_KEY, '/stale');
      const { facade } = createFacade(false);
      facade.login('microsoft');
      expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
    });

    it('refuses an off-site target rather than stashing it for Microsoft', () => {
      const { facade, msal } = createFacade(false);
      facade.login('microsoft', 'https://evil.example/phish');
      expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
      // The sign-in still proceeds; only the hostile destination is dropped.
      expect(msal.loginRedirect).toHaveBeenCalledTimes(1);
    });

    it('refuses an off-site target rather than handing it to Auth0', () => {
      const { facade, auth0 } = createFacade(false);
      facade.login('auth0', '//evil.example');
      expect(auth0.loginWithRedirect).toHaveBeenCalledWith(undefined);
    });

    it('treats a bare "/" target as no target at all', () => {
      const { facade, auth0 } = createFacade(false);
      facade.login('auth0', '/');
      expect(auth0.loginWithRedirect).toHaveBeenCalledWith(undefined);
    });
  });

  describe('logout', () => {
    it('logs out via MSAL when an MSAL account exists (independent of the persisted key)', async () => {
      const msal = makeMsal({
        getAllAccounts: jest.fn().mockReturnValue([{ username: 'e@hf.de' }]),
      });
      const { facade, auth0 } = createFacade(false, makeAuth0(), msal);
      await facade.initializeMsal();
      // No ACTIVE_PROVIDER_KEY set on purpose — the live MSAL session must still drive logout.
      facade.logout();
      expect(msal.logoutRedirect).toHaveBeenCalledTimes(1);
      expect(auth0.logout).not.toHaveBeenCalled();
    });

    it('logs out via Auth0 when there is no MSAL account', () => {
      const { facade, msal, auth0 } = createFacade(false);
      localStorage.setItem('ahb.activeAuthProvider', 'microsoft'); // stale key must not mislead
      facade.logout();
      expect(auth0.logout).toHaveBeenCalledTimes(1);
      expect(msal.logoutRedirect).not.toHaveBeenCalled();
    });
  });

  describe('user resolution', () => {
    it('emits the Microsoft user when MSAL has an account, even without the active-provider key', async () => {
      const account = { username: 'e@hf.de', name: 'E', localAccountId: 'id' };
      const msal = makeMsal({
        getAllAccounts: jest.fn().mockReturnValue([account]),
        getActiveAccount: jest.fn().mockReturnValue(account),
      });
      const { facade } = createFacade(false, makeAuth0(), msal);
      await facade.initializeMsal();
      const user = await firstValueFrom(facade.user$);
      expect(user).toMatchObject({ email: 'e@hf.de', provider: 'microsoft' });
    });

    it('emits the Auth0 user when only Auth0 has a session', async () => {
      const { facade } = createFacade(
        false,
        makeAuth0({ user$: of({ email: 'x@y.de', name: 'X', sub: 'auth0|1' }) })
      );
      const user = await firstValueFrom(facade.user$);
      expect(user).toMatchObject({ email: 'x@y.de', provider: 'auth0' });
    });
  });

  describe('initializeMsal (production)', () => {
    it('is idempotent: repeated calls initialize MSAL and process the redirect only once', async () => {
      const msal = makeMsal();
      const { facade } = createFacade(false, makeAuth0(), msal);
      await Promise.all([facade.initializeMsal(), facade.initializeMsal()]);
      await facade.initializeMsal();
      expect(msal.initialize).toHaveBeenCalledTimes(1);
      expect(msal.handleRedirectPromise).toHaveBeenCalledTimes(1);
    });

    it('initializes MSAL, processes the redirect, and flips the auth state', async () => {
      const account = {
        username: 'employee@hochfrequenz.de',
        name: 'Employee',
        localAccountId: 'x',
      };
      const accounts: unknown[] = [];
      const msal = makeMsal({
        handleRedirectPromise: jest.fn().mockResolvedValue({ account }),
        getAllAccounts: jest.fn(() => accounts),
      });
      const { facade } = createFacade(false, makeAuth0(), msal);

      // Simulate MSAL registering the account after a successful redirect.
      (msal.setActiveAccount as jest.Mock).mockImplementation(() => accounts.push(account));

      await facade.initializeMsal();

      expect(msal.initialize).toHaveBeenCalledTimes(1);
      expect(msal.handleRedirectPromise).toHaveBeenCalledTimes(1);
      // Must suppress MSAL's navigate-back so our callback route owns post-login routing.
      expect(msal.handleRedirectPromise).toHaveBeenCalledWith({ navigateToLoginRequestUrl: false });
      expect(msal.setActiveAccount).toHaveBeenCalledWith(account);
      await expect(firstValueFrom(facade.isAuthenticated$)).resolves.toBe(true);
    });
  });
});
