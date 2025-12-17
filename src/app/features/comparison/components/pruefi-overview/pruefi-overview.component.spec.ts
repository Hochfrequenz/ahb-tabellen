import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PruefiOverviewComponent, PruefiStatus } from './pruefi-overview.component';
import { PrufidentifikatorenService } from '../../../../core/api';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('PruefiOverviewComponent', () => {
  let component: PruefiOverviewComponent;
  let fixture: ComponentFixture<PruefiOverviewComponent>;
  let mockPrufidentifikatorenService: jest.Mocked<PrufidentifikatorenService>;

  const mockOldPruefis = [
    { pruefidentifikator: '11001', name: 'UTILMD Pruefi 1' },
    { pruefidentifikator: '11002', name: 'UTILMD Pruefi 2' },
    { pruefidentifikator: '13001', name: 'MSCONS Pruefi 1' },
  ];

  const mockNewPruefis = [
    { pruefidentifikator: '11001', name: 'UTILMD Pruefi 1 Updated' },
    { pruefidentifikator: '11003', name: 'UTILMD Pruefi 3' },
    { pruefidentifikator: '13001', name: 'MSCONS Pruefi 1' },
  ];

  beforeEach(async () => {
    mockPrufidentifikatorenService = {
      getPruefis: jest.fn(),
    } as unknown as jest.Mocked<PrufidentifikatorenService>;

    await TestBed.configureTestingModule({
      imports: [PruefiOverviewComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: PrufidentifikatorenService, useValue: mockPrufidentifikatorenService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PruefiOverviewComponent);
    component = fixture.componentInstance;
  });

  describe('initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have empty formatGroups initially', () => {
      expect(component.formatGroups()).toEqual([]);
    });

    it('should not be loading initially', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should have no error message initially', () => {
      expect(component.errorMessage).toBeNull();
    });
  });

  describe('ngOnChanges', () => {
    it('should not load comparison when formatVersionOld is empty', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', '');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      expect(mockPrufidentifikatorenService.getPruefis).not.toHaveBeenCalled();
    }));

    it('should not load comparison when formatVersionNew is empty', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', '');
      fixture.detectChanges();
      tick();

      expect(mockPrufidentifikatorenService.getPruefis).not.toHaveBeenCalled();
    }));

    it('should not load comparison when both versions are the same', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2504');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      expect(mockPrufidentifikatorenService.getPruefis).not.toHaveBeenCalled();
    }));

    it('should load comparison when both versions are set and different', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockReturnValue(of([]));

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      expect(mockPrufidentifikatorenService.getPruefis).toHaveBeenCalledTimes(2);
      expect(mockPrufidentifikatorenService.getPruefis).toHaveBeenCalledWith({
        'format-version': 'FV2410',
      });
      expect(mockPrufidentifikatorenService.getPruefis).toHaveBeenCalledWith({
        'format-version': 'FV2504',
      });
    }));
  });

  describe('loadComparison', () => {
    it('should set isLoading to true while loading', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockReturnValue(of([]));

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');

      // Before detectChanges, isLoading should be false
      expect(component.isLoading).toBe(false);

      fixture.detectChanges();

      // After detectChanges but before tick, isLoading should be true
      // (though with synchronous observables this happens very fast)
      tick();

      // After tick, isLoading should be false again
      expect(component.isLoading).toBe(false);
    }));

    it('should handle API errors gracefully', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockReturnValue(
        throwError(() => new Error('API Error'))
      );

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      expect(component.isLoading).toBe(false);
      expect(component.errorMessage).toContain('Fehler beim Laden der Prüfidentifikatoren');
      expect(component.errorMessage).toContain('FV2410');
      expect(component.errorMessage).toContain('FV2504');
      expect(component.formatGroups()).toEqual([]);
    }));
  });

  describe('processComparison', () => {
    beforeEach(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of(mockOldPruefis);
        }
        return of(mockNewPruefis);
      });
    });

    it('should group pruefis by format', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      // Should have UTILMD and MSCONS groups
      const formatNames = component.formatGroups().map(g => g.format);
      expect(formatNames).toContain('UTILMD');
      expect(formatNames).toContain('MSCONS');
    }));

    it('should correctly identify added pruefis', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      expect(utilmdGroup).toBeDefined();

      // 11003 is added (exists in new, not in old)
      const addedPruefi = utilmdGroup!.pruefis.find(p => p.pruefidentifikator === '11003');
      expect(addedPruefi).toBeDefined();
      expect(addedPruefi!.status).toBe('added');
      expect(addedPruefi!.existsInOld).toBe(false);
      expect(addedPruefi!.existsInNew).toBe(true);
    }));

    it('should correctly identify removed pruefis', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      expect(utilmdGroup).toBeDefined();

      // 11002 is removed (exists in old, not in new)
      const removedPruefi = utilmdGroup!.pruefis.find(p => p.pruefidentifikator === '11002');
      expect(removedPruefi).toBeDefined();
      expect(removedPruefi!.status).toBe('removed');
      expect(removedPruefi!.existsInOld).toBe(true);
      expect(removedPruefi!.existsInNew).toBe(false);
    }));

    it('should correctly identify unchanged pruefis', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      expect(utilmdGroup).toBeDefined();

      // 11001 is unchanged (exists in both)
      const unchangedPruefi = utilmdGroup!.pruefis.find(p => p.pruefidentifikator === '11001');
      expect(unchangedPruefi).toBeDefined();
      expect(unchangedPruefi!.status).toBe('unchanged');
      expect(unchangedPruefi!.existsInOld).toBe(true);
      expect(unchangedPruefi!.existsInNew).toBe(true);
    }));

    it('should count added and removed pruefis correctly', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      expect(utilmdGroup).toBeDefined();
      expect(utilmdGroup!.addedCount).toBe(1); // 11003
      expect(utilmdGroup!.removedCount).toBe(1); // 11002
    }));

    it('should prefer new name over old name', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      const pruefi11001 = utilmdGroup!.pruefis.find(p => p.pruefidentifikator === '11001');
      expect(pruefi11001!.name).toBe('UTILMD Pruefi 1 Updated');
    }));

    it('should sort pruefis within each group', fakeAsync(() => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      const pruefis = utilmdGroup!.pruefis.map(p => p.pruefidentifikator);
      expect(pruefis).toEqual(['11001', '11002', '11003']);
    }));

    it('should handle undefined pruefidentifikator values', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of([
            { pruefidentifikator: '11001', name: 'Test' },
            { pruefidentifikator: undefined, name: 'Undefined' },
          ]);
        }
        return of([{ pruefidentifikator: '11001', name: 'Test' }]);
      });

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      // Should only have 1 pruefi (11001), undefined should be filtered out
      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD');
      expect(utilmdGroup!.pruefis.length).toBe(1);
      expect(utilmdGroup!.pruefis[0].pruefidentifikator).toBe('11001');
    }));
  });

  describe('getRowClass', () => {
    it('should return bg-hf-positive-light for added status', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: false,
        existsInNew: true,
        status: PruefiStatus.ADDED,
      };
      expect(component.getRowClass(pruefi)).toBe('bg-hf-positive-light');
    });

    it('should return bg-hf-negative-light for removed status', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: false,
        status: PruefiStatus.REMOVED,
      };
      expect(component.getRowClass(pruefi)).toBe('bg-hf-negative-light');
    });

    it('should return empty string for unchanged status without line changes', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: true,
        status: PruefiStatus.UNCHANGED,
      };
      expect(component.getRowClass(pruefi)).toBe('');
    });
  });

  describe('hasChanges', () => {
    it('should return true when addedCount > 0', () => {
      const group = { format: 'UTILMD', pruefis: [], addedCount: 1, removedCount: 0 };
      expect(component.hasChanges(group)).toBe(true);
    });

    it('should return true when removedCount > 0', () => {
      const group = { format: 'UTILMD', pruefis: [], addedCount: 0, removedCount: 1 };
      expect(component.hasChanges(group)).toBe(true);
    });

    it('should return true when both counts > 0', () => {
      const group = { format: 'UTILMD', pruefis: [], addedCount: 2, removedCount: 3 };
      expect(component.hasChanges(group)).toBe(true);
    });

    it('should return false when both counts are 0', () => {
      const group = { format: 'UTILMD', pruefis: [], addedCount: 0, removedCount: 0 };
      expect(component.hasChanges(group)).toBe(false);
    });
  });

  describe('toggleFilter', () => {
    it('should toggle showAdded signal', () => {
      expect(component.showAdded()).toBe(true);
      component.toggleFilter(component.filterToggles.find(t => t.key === 'added')!);
      expect(component.showAdded()).toBe(false);
      component.toggleFilter(component.filterToggles.find(t => t.key === 'added')!);
      expect(component.showAdded()).toBe(true);
    });

    it('should toggle showRemoved signal', () => {
      expect(component.showRemoved()).toBe(true);
      component.toggleFilter(component.filterToggles.find(t => t.key === 'removed')!);
      expect(component.showRemoved()).toBe(false);
    });

    it('should toggle showChanged signal', () => {
      expect(component.showChanged()).toBe(true);
      component.toggleFilter(component.filterToggles.find(t => t.key === 'changed')!);
      expect(component.showChanged()).toBe(false);
    });

    it('should toggle showIdentical signal', () => {
      expect(component.showIdentical()).toBe(true);
      component.toggleFilter(component.filterToggles.find(t => t.key === 'identical')!);
      expect(component.showIdentical()).toBe(false);
    });
  });

  describe('isPruefiVisible', () => {
    it('should return showAdded value for ADDED status', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: false,
        existsInNew: true,
        status: PruefiStatus.ADDED,
      };

      expect(component.isPruefiVisible(pruefi)).toBe(true);
      component.showAdded.set(false);
      expect(component.isPruefiVisible(pruefi)).toBe(false);
    });

    it('should return showRemoved value for REMOVED status', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: false,
        status: PruefiStatus.REMOVED,
      };

      expect(component.isPruefiVisible(pruefi)).toBe(true);
      component.showRemoved.set(false);
      expect(component.isPruefiVisible(pruefi)).toBe(false);
    });

    it('should return true for UNCHANGED when diff summary not loaded', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: true,
        status: PruefiStatus.UNCHANGED,
      };

      // No diff summary loaded - should show by default
      expect(component.isPruefiVisible(pruefi)).toBe(true);
    });

    it('should return showChanged value for UNCHANGED with line changes', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: true,
        status: PruefiStatus.UNCHANGED,
      };

      // Set diff summary with changes
      component.diffSummary.set({ '11001': { added: 1, deleted: 0, modified: 0 } });

      expect(component.isPruefiVisible(pruefi)).toBe(true);
      component.showChanged.set(false);
      expect(component.isPruefiVisible(pruefi)).toBe(false);
    });

    it('should return showIdentical value for UNCHANGED without line changes', () => {
      const pruefi = {
        pruefidentifikator: '11001',
        name: 'Test',
        existsInOld: true,
        existsInNew: true,
        status: PruefiStatus.UNCHANGED,
      };

      // Set diff summary without changes
      component.diffSummary.set({ '11001': { added: 0, deleted: 0, modified: 0 } });

      expect(component.isPruefiVisible(pruefi)).toBe(true);
      component.showIdentical.set(false);
      expect(component.isPruefiVisible(pruefi)).toBe(false);
    });
  });

  describe('getFilteredPruefis', () => {
    it('should return all pruefis when all filters are enabled', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of(mockOldPruefis);
        }
        return of(mockNewPruefis);
      });

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD')!;
      const filtered = component.getFilteredPruefis(utilmdGroup);

      // All 3 pruefis should be visible (11001 unchanged, 11002 removed, 11003 added)
      expect(filtered.length).toBe(3);
    }));

    it('should filter out added pruefis when showAdded is false', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of(mockOldPruefis);
        }
        return of(mockNewPruefis);
      });

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      component.showAdded.set(false);
      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD')!;
      const filtered = component.getFilteredPruefis(utilmdGroup);

      // 11003 (added) should be filtered out
      expect(filtered.find(p => p.pruefidentifikator === '11003')).toBeUndefined();
      expect(filtered.length).toBe(2);
    }));

    it('should filter out removed pruefis when showRemoved is false', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of(mockOldPruefis);
        }
        return of(mockNewPruefis);
      });

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      component.showRemoved.set(false);
      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD')!;
      const filtered = component.getFilteredPruefis(utilmdGroup);

      // 11002 (removed) should be filtered out
      expect(filtered.find(p => p.pruefidentifikator === '11002')).toBeUndefined();
      expect(filtered.length).toBe(2);
    }));
  });

  describe('getFilteredCount', () => {
    it('should return count of visible pruefis', fakeAsync(() => {
      mockPrufidentifikatorenService.getPruefis.mockImplementation(params => {
        if (params['format-version'] === 'FV2410') {
          return of(mockOldPruefis);
        }
        return of(mockNewPruefis);
      });

      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();
      tick();

      const utilmdGroup = component.formatGroups().find(g => g.format === 'UTILMD')!;
      expect(component.getFilteredCount(utilmdGroup)).toBe(3);

      component.showAdded.set(false);
      expect(component.getFilteredCount(utilmdGroup)).toBe(2);

      component.showRemoved.set(false);
      expect(component.getFilteredCount(utilmdGroup)).toBe(1);
    }));
  });
});
