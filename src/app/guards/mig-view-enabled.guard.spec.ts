import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { migViewEnabledGuard } from './mig-view-enabled.guard';
import { environment } from '../environments/environment';

describe('migViewEnabledGuard', () => {
  const dummyUrlTree = {} as UrlTree;
  let mockRouter: { createUrlTree: jest.Mock };

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      migViewEnabledGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    mockRouter = { createUrlTree: jest.fn().mockReturnValue(dummyUrlTree) };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('allows activation when the feature is enabled', () => {
    const original = environment.enableMigView;
    environment.enableMigView = true;
    try {
      expect(runGuard()).toBe(true);
      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    } finally {
      environment.enableMigView = original;
    }
  });

  it('redirects to /features when the feature is disabled', () => {
    const original = environment.enableMigView;
    environment.enableMigView = false;
    try {
      expect(runGuard()).toBe(dummyUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/features']);
    } finally {
      environment.enableMigView = original;
    }
  });
});
