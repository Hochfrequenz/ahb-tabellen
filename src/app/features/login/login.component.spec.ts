import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { LoginComponent, POST_LOGIN_TARGET_KEY } from './login.component';
import { AuthFacade } from '../../core/auth/auth.facade';

describe('LoginComponent', () => {
  let facade: { login: jest.Mock };

  function setup(target?: string): LoginComponent {
    facade = { login: jest.fn() };
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthFacade, useValue: facade },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap(target ? { target } : {}) },
          },
        },
      ],
    });
    return TestBed.createComponent(LoginComponent).componentInstance;
  }

  afterEach(() => {
    sessionStorage.clear();
    TestBed.resetTestingModule();
  });

  it('signs in with the chosen provider, forwarding the target', () => {
    const component = setup('/search');
    component.signIn('microsoft');
    expect(facade.login).toHaveBeenCalledWith('microsoft', '/search');
  });

  it('stores the target for the MSAL callback when signing in with Microsoft', () => {
    const component = setup('/ahb/UTILMD');
    component.signIn('microsoft');
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBe('/ahb/UTILMD');
  });

  it('does not leave a stored target for a later MSAL login when signing in with Auth0', () => {
    sessionStorage.setItem(POST_LOGIN_TARGET_KEY, '/stale');
    const component = setup('/ahb/UTILMD');
    component.signIn('auth0');
    // Auth0 restores its target via the SDK's appState (passed through the facade), not the
    // MSAL-only sessionStorage key — which must be cleared so it can't leak into a later MSAL login.
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
    expect(facade.login).toHaveBeenCalledWith('auth0', '/ahb/UTILMD');
  });

  it('stores nothing when no target was provided', () => {
    const component = setup();
    component.signIn('microsoft');
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
  });
});
