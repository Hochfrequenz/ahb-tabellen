import { LandingPageComponent } from './landing-page.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { AuthFacade } from '../../../../core/auth/auth.facade';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

type MockFacade = { isAuthenticated$: Observable<boolean>; login: jest.Mock };

describe('LandingPageComponent', () => {
  let mockMeta: { addTags: jest.Mock };
  let facade: MockFacade;
  let router: { navigateByUrl: jest.Mock };

  /**
   * @param isAuthenticated whether a session already exists
   * @param target raw value of the `?target=` query param the AuthGuard would have attached
   */
  function setup(isAuthenticated = false, target: string | null = null) {
    mockMeta = { addTags: jest.fn() };
    facade = { isAuthenticated$: of(isAuthenticated), login: jest.fn() };
    router = { navigateByUrl: jest.fn() };

    return (
      MockBuilder(LandingPageComponent)
        .provide({ provide: Meta, useValue: mockMeta })
        // The component depends on the AuthFacade, not on either SDK directly.
        .provide({ provide: AuthFacade, useValue: facade })
        .provide({ provide: Router, useValue: router })
        .provide({
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap(target ? { target } : {}) } },
        })
    );
  }

  function buttonsOf(fixture: { nativeElement: HTMLElement }): HTMLButtonElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button'));
  }

  /** Click by visible label, so the assertions cover the template wiring and not just the method. */
  function clickButton(fixture: { nativeElement: HTMLElement }, label: string): void {
    const button = buttonsOf(fixture).find(candidate => candidate.textContent?.includes(label));
    if (!button) {
      throw new Error(`no button labelled "${label}"`);
    }
    button.click();
  }

  describe('meta tags', () => {
    beforeEach(() => setup());

    it('should render', () => {
      const fixture = MockRender(LandingPageComponent);
      expect(ngMocks.formatHtml(fixture)).toContain('Anwendungshandbücher für Menschen');
    });

    it('should set robots meta tag to noindex, nofollow when allowSearchIndexing is false', () => {
      const original = environment.allowSearchIndexing;
      environment.allowSearchIndexing = false;
      try {
        MockRender(LandingPageComponent);
        expect(mockMeta.addTags).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ name: 'robots', content: 'noindex, nofollow' }),
          ])
        );
      } finally {
        environment.allowSearchIndexing = original;
      }
    });

    it('should set robots meta tag to index, follow when allowSearchIndexing is true', () => {
      const original = environment.allowSearchIndexing;
      environment.allowSearchIndexing = true;
      try {
        MockRender(LandingPageComponent);
        expect(mockMeta.addTags).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({ name: 'robots', content: 'index, follow' }),
          ])
        );
      } finally {
        environment.allowSearchIndexing = original;
      }
    });
  });

  describe('signed out', () => {
    it('offers both sign-in paths', async () => {
      await setup(false);
      const fixture = MockRender(LandingPageComponent);
      const labels = buttonsOf(fixture).map(button => button.textContent?.trim());
      expect(labels).toHaveLength(2);
      expect(labels[0]).toContain('Jetzt öffnen');
      expect(labels[1]).toContain('Mit Microsoft anmelden');
    });

    it('names the audience of the Microsoft path rather than the vendor of the other', async () => {
      await setup(false);
      const fixture = MockRender(LandingPageComponent);
      const html = fixture.nativeElement.innerHTML;
      expect(html).toContain('Für Hochfrequenz-Mitarbeitende');
      // External users have no idea what Auth0 is; the primary CTA must never name it.
      expect(html).not.toContain('Auth0');
    });

    it('signs in with Auth0 from the primary call to action', async () => {
      await setup(false);
      const fixture = MockRender(LandingPageComponent);
      clickButton(fixture, 'Jetzt öffnen');
      expect(facade.login).toHaveBeenCalledWith('auth0', '/features');
    });

    it('signs in with Microsoft from the secondary call to action', async () => {
      await setup(false);
      const fixture = MockRender(LandingPageComponent);
      clickButton(fixture, 'Mit Microsoft anmelden');
      expect(facade.login).toHaveBeenCalledWith('microsoft', '/features');
    });

    it('forwards the target the guard attached, through either provider', async () => {
      await setup(false, '/ahb/UTILMD');
      const fixture = MockRender(LandingPageComponent);
      clickButton(fixture, 'Jetzt öffnen');
      clickButton(fixture, 'Mit Microsoft anmelden');
      expect(facade.login).toHaveBeenNthCalledWith(1, 'auth0', '/ahb/UTILMD');
      expect(facade.login).toHaveBeenNthCalledWith(2, 'microsoft', '/ahb/UTILMD');
    });

    it('falls back to the feature picker when the target is off-site', async () => {
      await setup(false, 'https://evil.example/phish');
      const fixture = MockRender(LandingPageComponent);
      clickButton(fixture, 'Jetzt öffnen');
      expect(facade.login).toHaveBeenCalledWith('auth0', '/features');
    });
  });

  describe('signed in', () => {
    it('shows a single call to action, with no provider choice', async () => {
      await setup(true);
      const fixture = MockRender(LandingPageComponent);
      const buttons = buttonsOf(fixture);
      expect(buttons).toHaveLength(1);
      expect(buttons[0].textContent).toContain('Jetzt öffnen');
    });

    it('navigates instead of signing in again', async () => {
      await setup(true, '/search');
      const fixture = MockRender(LandingPageComponent);
      clickButton(fixture, 'Jetzt öffnen');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/search');
      expect(facade.login).not.toHaveBeenCalled();
    });
  });
});
