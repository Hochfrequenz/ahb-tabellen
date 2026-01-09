import { SearchTableComponent } from './search-table.component';
import { MockBuilder, MockRender } from 'ng-mocks';
import { Router } from '@angular/router';
import { SearchItem } from '../../../../core/api/models';

describe('SearchTableComponent', () => {
  let component: SearchTableComponent;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(async () => {
    mockRouter = {
      createUrlTree: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await MockBuilder(SearchTableComponent);
  });

  beforeEach(() => {
    const fixture = MockRender(SearchTableComponent, {
      data: [],
      totalItems: 0,
      page: 1,
      pageSize: 25,
    });
    component = fixture.point.componentInstance;
    component['router'] = mockRouter;
  });

  describe('formatDirection', () => {
    it('should return "-" for null or undefined direction', () => {
      expect(component.formatDirection(null)).toEqual(['-']);
      expect(component.formatDirection(undefined)).toEqual(['-']);
    });

    it('should return "-" for empty array', () => {
      expect(component.formatDirection([])).toEqual(['-']);
    });

    it('should format single direction pair correctly', () => {
      const direction = [{ sender: 'MSB', empfaenger: 'ESA' }];
      const result = component.formatDirection(direction);
      expect(result).toEqual(['MSB → ESA']);
    });

    it('should format multiple direction pairs correctly', () => {
      const direction = [
        { sender: 'LF', empfaenger: 'MSB (Strom)' },
        { sender: 'LF', empfaenger: 'NB (Gas)' },
        { sender: 'NB', empfaenger: 'MSB (Gas)' },
      ];
      const result = component.formatDirection(direction);
      expect(result).toEqual(['LF → MSB (Strom)', 'LF → NB (Gas)', 'NB → MSB (Gas)']);
    });

    it('should parse JSON string direction', () => {
      const direction = '[{"sender":"LF","empfaenger":"MSB"}]';
      const result = component.formatDirection(direction);
      expect(result).toEqual(['LF → MSB']);
    });

    it('should parse JSON string with spaces', () => {
      const direction = '[{"sender": "LF", "empfaenger": "MSB"}]';
      const result = component.formatDirection(direction);
      expect(result).toEqual(['LF → MSB']);
    });

    it('should handle empty empfaenger', () => {
      const direction = [{ sender: 'LF', empfaenger: '' }];
      const result = component.formatDirection(direction);
      expect(result).toEqual(['LF → ']);
    });

    it('should handle invalid JSON string', () => {
      const direction = 'invalid json';
      const result = component.formatDirection(direction);
      expect(result).toEqual(['invalid json']);
    });

    it('should handle complex direction with multiple market roles', () => {
      const direction = [
        { sender: 'LF', empfaenger: 'MSB (Strom)' },
        { sender: 'LF', empfaenger: '' },
        { sender: 'LF', empfaenger: 'NB (Gas)' },
        { sender: 'LF', empfaenger: '' },
        { sender: 'NB', empfaenger: 'MSB (Gas)' },
      ];
      const result = component.formatDirection(direction);
      expect(result).toEqual([
        'LF → MSB (Strom)',
        'LF → ',
        'LF → NB (Gas)',
        'LF → ',
        'NB → MSB (Gas)',
      ]);
    });
  });

  describe('formatCellValue', () => {
    it('should return "-" for null or undefined', () => {
      expect(component.formatCellValue(null)).toBe('-');
      expect(component.formatCellValue(undefined)).toBe('-');
    });

    it('should convert values to string', () => {
      expect(component.formatCellValue('test')).toBe('test');
      expect(component.formatCellValue(123)).toBe('123');
      expect(component.formatCellValue(true)).toBe('true');
    });
  });

  describe('formatDataElement', () => {
    it('should return "-" for null or undefined', () => {
      expect(component.formatDataElement(null)).toBe('-');
      expect(component.formatDataElement(undefined)).toBe('-');
    });

    it('should remove "D_" prefix if present', () => {
      expect(component.formatDataElement('D_3035')).toBe('3035');
      expect(component.formatDataElement('D_1234')).toBe('1234');
    });

    it('should return value as-is if no "D_" prefix', () => {
      expect(component.formatDataElement('3035')).toBe('3035');
      expect(component.formatDataElement('test')).toBe('test');
    });
  });

  describe('onPageChange', () => {
    it('should emit pageChange when only page index changes', () => {
      const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
      const pageSizeChangeSpy = jest.spyOn(component.pageSizeChange, 'emit');

      const event = { pageIndex: 2, pageSize: 25, length: 100 };
      component.onPageChange(event);

      expect(pageChangeSpy).toHaveBeenCalledWith(event);
      expect(pageSizeChangeSpy).not.toHaveBeenCalled();
    });

    it('should emit pageSizeChange when pageSize changes', () => {
      const pageChangeSpy = jest.spyOn(component.pageChange, 'emit');
      const pageSizeChangeSpy = jest.spyOn(component.pageSizeChange, 'emit');

      const event = { pageIndex: 0, pageSize: 50, length: 100 };
      component.onPageChange(event);

      expect(pageSizeChangeSpy).toHaveBeenCalledWith(event);
      expect(pageChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('onPruefidentifikatorClick', () => {
    let windowOpenSpy: jest.SpyInstance;

    beforeEach(() => {
      windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    });

    afterEach(() => {
      windowOpenSpy.mockRestore();
    });

    it('should open new tab with correct URL', () => {
      const item: SearchItem = {
        format_version: 'FV2510',
        pruefidentifikator: '11001',
      };
      const mockUrl = '/ahb/FV2510/11001';
      mockRouter.createUrlTree.mockReturnValue({ toString: () => mockUrl } as ReturnType<
        Router['createUrlTree']
      >);

      component.onPruefidentifikatorClick(item);

      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/ahb', 'FV2510', '11001']);
      expect(windowOpenSpy).toHaveBeenCalledWith(mockUrl, '_blank');
    });

    it('should not open tab if format_version is missing', () => {
      const item: SearchItem = {
        format_version: '',
        pruefidentifikator: '11001',
      };

      component.onPruefidentifikatorClick(item);

      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });

    it('should not open tab if pruefidentifikator is missing', () => {
      const item: SearchItem = {
        format_version: 'FV2510',
        pruefidentifikator: '',
      };

      component.onPruefidentifikatorClick(item);

      expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
      expect(windowOpenSpy).not.toHaveBeenCalled();
    });
  });
});
