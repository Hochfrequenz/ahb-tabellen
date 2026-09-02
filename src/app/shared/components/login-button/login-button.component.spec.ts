import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { LoginButtonComponent } from './login-button.component';
import { AuthFacade } from '../../../core/auth/auth.facade';

type MockFacade = {
  isAuthenticated$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  login: jest.Mock;
  logout: jest.Mock;
};

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;
  let facade: MockFacade;

  function setup(isAuthenticated: boolean): void {
    facade = {
      isAuthenticated$: of(isAuthenticated),
      isLoading$: of(false),
      login: jest.fn(),
      logout: jest.fn(),
    };
    TestBed.configureTestingModule({
      imports: [LoginButtonComponent],
      providers: [{ provide: AuthFacade, useValue: facade }],
    });
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => TestBed.resetTestingModule());

  it('routes the Auth0 sign-in to the facade', () => {
    setup(false);
    component.loginWith('auth0');
    expect(facade.login).toHaveBeenCalledWith('auth0');
  });

  it('routes the Microsoft sign-in to the facade', () => {
    setup(false);
    component.loginWith('microsoft');
    expect(facade.login).toHaveBeenCalledWith('microsoft');
  });

  it('routes logout to the facade', () => {
    setup(true);
    component.logout();
    expect(facade.logout).toHaveBeenCalledTimes(1);
  });

  it('shows two sign-in buttons when logged out', () => {
    setup(false);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('shows a single logout button when logged in', () => {
    setup(true);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });
});
