import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { of } from 'rxjs';
import { routes } from './app.routes';
import { AuthFacade } from './core/auth/auth.facade';

describe('app routes', () => {
  function createRouter(isAuthenticated = true): Router {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideLocationMocks(),
        // Guards resolve through the facade, so this decides whether they let a route through.
        { provide: AuthFacade, useValue: { isAuthenticated$: of(isAuthenticated) } },
      ],
    });
    return TestBed.inject(Router);
  }

  afterEach(() => TestBed.resetTestingModule());

  describe('the retired /login chooser', () => {
    it('redirects to the landing page', async () => {
      const router = createRouter();
      await router.navigateByUrl('/login');
      expect(router.url).toBe('/');
    });

    it('carries ?target= across the redirect, so an old bookmark still lands the user right', async () => {
      const router = createRouter();
      await router.navigateByUrl('/login?target=%2Fahb%2FUTILMD');
      expect(router.url).toBe('/?target=%2Fahb%2FUTILMD');
    });

    it('no longer loads a component of its own', () => {
      const login = routes.find(route => route.path === 'login');
      expect(login).toMatchObject({ redirectTo: '', pathMatch: 'full' });
      expect(login?.loadComponent).toBeUndefined();
    });
  });

  describe('a guarded deep link, while signed out', () => {
    it('lands on the landing page carrying the original route as ?target=', async () => {
      const router = createRouter(false);
      await router.navigateByUrl('/ahb/FV2504/11042');
      // The landing CTAs read this back, so losing it here would silently strip deep links.
      expect(router.url).toBe('/?target=%2Fahb%2FFV2504%2F11042');
    });

    it('keeps the query string of the original route inside the target', async () => {
      const router = createRouter(false);
      await router.navigateByUrl('/search?q=UTILMD');
      expect(router.url).toBe('/?target=%2Fsearch%3Fq%3DUTILMD');
    });
  });
});
