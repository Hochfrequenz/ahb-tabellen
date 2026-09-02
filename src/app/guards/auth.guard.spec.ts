import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthFacade } from '../core/auth/auth.facade';

describe('AuthGuard', () => {
  const LOGIN_URL_TREE = {} as UrlTree;
  let router: { createUrlTree: jest.Mock };

  function setup(isAuthenticated: boolean): AuthGuard {
    router = { createUrlTree: jest.fn().mockReturnValue(LOGIN_URL_TREE) };
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthFacade, useValue: { isAuthenticated$: of(isAuthenticated) } },
        { provide: Router, useValue: router },
      ],
    });
    return TestBed.inject(AuthGuard);
  }

  afterEach(() => TestBed.resetTestingModule());

  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/ahb/UTILMD' } as RouterStateSnapshot;

  it('allows activation when a session exists', async () => {
    const guard = setup(true);
    await expect(firstValueFrom(guard.canActivate(route, state))).resolves.toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects to /login (as a UrlTree carrying the target) when unauthenticated', async () => {
    const guard = setup(false);
    await expect(firstValueFrom(guard.canActivate(route, state))).resolves.toBe(LOGIN_URL_TREE);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { target: '/ahb/UTILMD' },
    });
  });
});
