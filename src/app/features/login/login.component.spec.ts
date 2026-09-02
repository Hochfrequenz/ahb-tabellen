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

  it('signs in with the chosen provider', () => {
    const component = setup('/search');
    component.signIn('microsoft');
    expect(facade.login).toHaveBeenCalledWith('microsoft');
  });

  it('remembers the post-login target so it can be restored after the redirect', () => {
    const component = setup('/ahb/UTILMD');
    component.signIn('auth0');
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBe('/ahb/UTILMD');
  });

  it('does not store a target when none was provided', () => {
    const component = setup();
    component.signIn('auth0');
    expect(sessionStorage.getItem(POST_LOGIN_TARGET_KEY)).toBeNull();
  });
});
