import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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

  async function setup(isAuthenticated: boolean, url = '/ahb/UTILMD'): Promise<void> {
    facade = {
      isAuthenticated$: of(isAuthenticated),
      isLoading$: of(false),
      login: jest.fn(),
      logout: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [LoginButtonComponent],
      providers: [
        { provide: AuthFacade, useValue: facade },
        { provide: Router, useValue: { url } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => TestBed.resetTestingModule());

  it('routes the Auth0 sign-in to the facade, keeping the current page as the target', async () => {
    await setup(false);
    component.loginWith('auth0');
    expect(facade.login).toHaveBeenCalledWith('auth0', '/ahb/UTILMD');
  });

  it('routes the Microsoft sign-in to the facade, keeping the current page as the target', async () => {
    await setup(false);
    component.loginWith('microsoft');
    expect(facade.login).toHaveBeenCalledWith('microsoft', '/ahb/UTILMD');
  });

  it('signs in from the buttons themselves, not only via the method', async () => {
    await setup(false, '/search');
    const host = fixture.nativeElement as HTMLElement;
    host.querySelectorAll<HTMLButtonElement>('button').forEach(button => button.click());
    expect(facade.login).toHaveBeenNthCalledWith(1, 'auth0', '/search');
    expect(facade.login).toHaveBeenNthCalledWith(2, 'microsoft', '/search');
  });

  it('keeps the audience hint out of the Microsoft button’s accessible name', async () => {
    await setup(false);
    const host = fixture.nativeElement as HTMLElement;
    const microsoft = Array.from(host.querySelectorAll<HTMLButtonElement>('button')).find(button =>
      button.textContent?.includes('Mit Microsoft anmelden')
    );
    // An aria-label here would override the visible text and desync voice control from what the
    // user can read. The hint is described instead, matching the landing page.
    expect(microsoft?.getAttribute('aria-label')).toBeNull();
    expect(microsoft?.textContent?.trim()).toBe('Mit Microsoft anmelden');
    const describedBy = microsoft?.getAttribute('aria-describedby');
    expect(host.querySelector(`#${describedBy}`)?.textContent).toContain(
      'Für Hochfrequenz-Mitarbeitende'
    );
  });

  it('gives each instance a unique hint id', async () => {
    // The header renders <app-login-button/> twice (desktop + the always-present mobile menu), so
    // a hardcoded id would appear twice in the document and both buttons would describe the first.
    await setup(false);
    const first = fixture.componentInstance.microsoftHintId;
    TestBed.resetTestingModule();
    await setup(false);
    expect(fixture.componentInstance.microsoftHintId).not.toBe(first);
  });

  it('labels the sign-in paths by audience, never by vendor', async () => {
    await setup(false);
    const html = (fixture.nativeElement as HTMLElement).innerHTML;
    expect(html).toContain('Anmelden');
    expect(html).toContain('Mit Microsoft anmelden');
    expect(html).not.toContain('Auth0');
  });

  it('routes logout to the facade', async () => {
    await setup(true);
    component.logout();
    expect(facade.logout).toHaveBeenCalledTimes(1);
  });

  it('shows two sign-in buttons when logged out', async () => {
    await setup(false);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('shows a single logout button when logged in', async () => {
    await setup(true);
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });
});
