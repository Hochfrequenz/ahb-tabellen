import { SearchFiltersComponent } from './search-filters.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { FormatVersionCacheService } from '../../services/format-version-cache.service';
import { FormatCacheService } from '../../services/format-cache.service';
import { RichtungCacheService } from '../../services/richtung-cache.service';

describe('SearchFiltersComponent', () => {
  let component: SearchFiltersComponent;
  let mockFormatVersionCacheService: jest.Mocked<FormatVersionCacheService>;
  let mockFormatCacheService: jest.Mocked<FormatCacheService>;
  let mockRichtungCacheService: jest.Mocked<RichtungCacheService>;

  beforeEach(async () => {
    mockFormatVersionCacheService = {
      getFormatVersions: jest.fn(),
      getCurrentFormatVersion: jest.fn(),
    } as unknown as jest.Mocked<FormatVersionCacheService>;

    mockFormatCacheService = {
      getFormats: jest.fn(),
    } as unknown as jest.Mocked<FormatCacheService>;

    mockRichtungCacheService = {
      getRichtungValues: jest.fn(),
    } as unknown as jest.Mocked<RichtungCacheService>;

    await MockBuilder(SearchFiltersComponent)
      .provide({
        provide: FormatVersionCacheService,
        useValue: mockFormatVersionCacheService,
      })
      .provide({
        provide: FormatCacheService,
        useValue: mockFormatCacheService,
      })
      .provide({
        provide: RichtungCacheService,
        useValue: mockRichtungCacheService,
      })
      .provide(FormBuilder);
  });

  beforeEach(() => {
    mockFormatVersionCacheService.getFormatVersions.mockReturnValue(of([]));
    mockFormatVersionCacheService.getCurrentFormatVersion.mockReturnValue(null);
    mockFormatCacheService.getFormats.mockReturnValue(of([]));
    mockRichtungCacheService.getRichtungValues.mockReturnValue(
      of({ sender: ['LF', 'MSB', 'NB'], empfaenger: ['LF', 'MSB', 'NB'] })
    );

    const fixture = MockRender(SearchFiltersComponent);
    component = fixture.point.componentInstance;
  });

  describe('initialization', () => {
    it('should create component with all filter fields', () => {
      expect(component).toBeTruthy();
      expect(component.filterFields.length).toBeGreaterThan(0);
    });

    it('should include sender filter field with options loaded from API', () => {
      const senderField = component.filterFields.find(f => f.key === 'sender');
      expect(senderField).toBeDefined();
      expect(senderField?.type).toBe('select');
      expect(senderField?.multiple).toBe(true);
      // Options are loaded from RichtungCacheService
      expect(senderField?.options).toEqual(['LF', 'MSB', 'NB']);
    });

    it('should include empfaenger filter field with options loaded from API', () => {
      const empfaengerField = component.filterFields.find(f => f.key === 'empfaenger');
      expect(empfaengerField).toBeDefined();
      expect(empfaengerField?.type).toBe('select');
      expect(empfaengerField?.multiple).toBe(true);
      // Options are loaded from RichtungCacheService
      expect(empfaengerField?.options).toEqual(['LF', 'MSB', 'NB']);
    });

    it('should initialize form with all filter controls', () => {
      expect(component.searchForm).toBeDefined();
      expect(component.searchForm.get('sender')).toBeDefined();
      expect(component.searchForm.get('empfaenger')).toBeDefined();
      expect(component.searchForm.get('format_version')).toBeDefined();
      expect(component.searchForm.get('format')).toBeDefined();
    });

    it('should call RichtungCacheService on init', () => {
      expect(mockRichtungCacheService.getRichtungValues).toHaveBeenCalled();
    });
  });

  describe('sender and empfaenger filters', () => {
    it('should initialize sender as empty array', () => {
      const senderValue = component.searchForm.get('sender')?.value;
      expect(Array.isArray(senderValue)).toBe(true);
      expect(senderValue).toEqual([]);
    });

    it('should initialize empfaenger as empty array', () => {
      const empfaengerValue = component.searchForm.get('empfaenger')?.value;
      expect(Array.isArray(empfaengerValue)).toBe(true);
      expect(empfaengerValue).toEqual([]);
    });

    it('should emit filters when sender is selected', done => {
      component.filtersChange.subscribe(filters => {
        expect(filters.sender).toEqual({ in: ['LF', 'MSB'] });
        done();
      });

      component.searchForm.patchValue({ sender: ['LF', 'MSB'] });
    });

    it('should emit filters when empfaenger is selected', done => {
      component.filtersChange.subscribe(filters => {
        expect(filters.empfaenger).toEqual({ in: ['NB', 'ESA'] });
        done();
      });

      component.searchForm.patchValue({ empfaenger: ['NB', 'ESA'] });
    });

    it('should emit filters with both sender and empfaenger', done => {
      component.filtersChange.subscribe(filters => {
        expect(filters.sender).toEqual({ in: ['LF'] });
        expect(filters.empfaenger).toEqual({ in: ['MSB'] });
        done();
      });

      component.searchForm.patchValue({
        sender: ['LF'],
        empfaenger: ['MSB'],
      });
    });

    it('should not emit sender filter when empty array', done => {
      // First set a value
      component.searchForm.patchValue({ sender: ['LF'] }, { emitEvent: false });

      // Then clear it and check emission
      component.filtersChange.subscribe(filters => {
        expect(filters.sender).toBeUndefined();
        done();
      });

      component.searchForm.patchValue({ sender: [] });
    });
  });

  describe('clearFilters', () => {
    it('should reset sender and empfaenger to empty arrays', () => {
      component.searchForm.patchValue({
        sender: ['LF', 'MSB'],
        empfaenger: ['NB'],
      });

      component.clearFilters();

      expect(component.searchForm.get('sender')?.value).toEqual([]);
      expect(component.searchForm.get('empfaenger')?.value).toEqual([]);
    });

    it('should clear all filter fields', () => {
      component.searchForm.patchValue({
        q: 'test query',
        sender: ['LF'],
        empfaenger: ['MSB'],
        format_version: ['FV2510'],
      });

      component.clearFilters();

      expect(component.searchForm.get('q')?.value).toBe('');
      expect(component.searchForm.get('sender')?.value).toEqual([]);
      expect(component.searchForm.get('empfaenger')?.value).toEqual([]);
      expect(component.searchForm.get('format_version')?.value).toEqual([]);
    });
  });

  describe('getActiveFilterCount', () => {
    it('should count sender filter when active', () => {
      component.searchForm.patchValue({ sender: ['LF'] }, { emitEvent: false });
      expect(component.getActiveFilterCount()).toBeGreaterThan(0);
    });

    it('should count empfaenger filter when active', () => {
      component.searchForm.patchValue({ empfaenger: ['MSB'] }, { emitEvent: false });
      expect(component.getActiveFilterCount()).toBeGreaterThan(0);
    });

    it('should count both sender and empfaenger when active', () => {
      component.searchForm.patchValue(
        {
          sender: ['LF'],
          empfaenger: ['MSB'],
        },
        { emitEvent: false }
      );
      const count = component.getActiveFilterCount();
      expect(count).toBeGreaterThanOrEqual(2);
    });

    it('should not count empty arrays', () => {
      component.searchForm.patchValue(
        {
          sender: [],
          empfaenger: [],
        },
        { emitEvent: false }
      );
      expect(component.getActiveFilterCount()).toBe(0);
    });
  });

  describe('wildcard info popover', () => {
    it('should initialize wildcardInfoOpen as false', () => {
      expect(component.wildcardInfoOpen).toBe(false);
    });

    it('should have wildcard info positions defined', () => {
      expect(component.wildcardInfoPositions).toBeDefined();
      expect(component.wildcardInfoPositions.length).toBeGreaterThan(0);
    });

    it('should close popover when Escape key is pressed', () => {
      component.wildcardInfoOpen = true;

      component.onEscapeKey();

      expect(component.wildcardInfoOpen).toBe(false);
    });

    it('should not change state when Escape is pressed and popover is already closed', () => {
      component.wildcardInfoOpen = false;

      component.onEscapeKey();

      expect(component.wildcardInfoOpen).toBe(false);
    });
  });

  describe('format loading', () => {
    it('should handle format version loading error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockFormatVersionCacheService.getFormatVersions.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      expect(() => component.ngOnInit()).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load format versions:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle format loading error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockFormatCacheService.getFormats.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      expect(() => component.ngOnInit()).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load formats:', expect.any(Error));

      consoleErrorSpy.mockRestore();
    });

    it('should handle richtung values loading error gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockRichtungCacheService.getRichtungValues.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      expect(() => component.ngOnInit()).not.toThrow();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to load richtung values:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });
});
