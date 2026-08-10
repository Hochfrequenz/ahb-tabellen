import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { pruefiComparisonEnabledGuard } from './pruefi-comparison-enabled.guard';
import { environment } from '../environments/environment';

describe('pruefiComparisonEnabledGuard', () => {
  const dummyUrlTree = {} as UrlTree;
  let mockRouter: { createUrlTree: jest.Mock };

  const runGuard = () =>
    TestBed.runInInjectionContext(() =>
      pruefiComparisonEnabledGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    mockRouter = { createUrlTree: jest.fn().mockReturnValue(dummyUrlTree) };
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: mockRouter }],
    });
  });

  it('allows activation when the feature is enabled', () => {
    const original = environment.enablePruefiComparison;
    environment.enablePruefiComparison = true;
    try {
      expect(runGuard()).toBe(true);
      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    } finally {
      environment.enablePruefiComparison = original;
    }
  });

  it('redirects to /features when the feature is disabled', () => {
    const original = environment.enablePruefiComparison;
    environment.enablePruefiComparison = false;
    try {
      expect(runGuard()).toBe(dummyUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/features']);
    } finally {
      environment.enablePruefiComparison = original;
    }
  });
});
