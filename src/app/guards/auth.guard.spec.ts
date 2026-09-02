import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthFacade } from '../core/auth/auth.facade';

describe('AuthGuard', () => {
  let router: { navigate: jest.Mock };

  function setup(isAuthenticated: boolean): AuthGuard {
    router = { navigate: jest.fn() };
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
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('blocks and redirects to /login (carrying the target url) when unauthenticated', async () => {
    const guard = setup(false);
    await expect(firstValueFrom(guard.canActivate(route, state))).resolves.toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { target: '/ahb/UTILMD' },
    });
  });
});
