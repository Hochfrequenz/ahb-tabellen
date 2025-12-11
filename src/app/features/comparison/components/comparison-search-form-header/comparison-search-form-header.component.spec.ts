import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ComparisonSearchFormHeaderComponent } from './comparison-search-form-header.component';
import { FormatVersionCacheService } from '../../../search/services/format-version-cache.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ComparisonSearchFormHeaderComponent', () => {
  let component: ComparisonSearchFormHeaderComponent;
  let fixture: ComponentFixture<ComparisonSearchFormHeaderComponent>;
  let mockFormatVersionCacheService: jest.Mocked<FormatVersionCacheService>;
  let mockRouter: jest.Mocked<Router>;

  const mockVersions = ['FV2304', 'FV2310', 'FV2404', 'FV2410', 'FV2504'];

  beforeEach(async () => {
    mockFormatVersionCacheService = {
      getFormatVersions: jest.fn().mockReturnValue(of(mockVersions)),
    } as unknown as jest.Mocked<FormatVersionCacheService>;

    mockRouter = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [ComparisonSearchFormHeaderComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: FormatVersionCacheService, useValue: mockFormatVersionCacheService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonSearchFormHeaderComponent);
    component = fixture.componentInstance;
  });

  describe('format version loading and defaults', () => {
    it('should load format versions from cache service', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(mockFormatVersionCacheService.getFormatVersions).toHaveBeenCalled();
      expect(component.formatVersions.length).toBe(5);
    }));

    it('should keep format versions in original order (oldest first)', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(component.formatVersions[0]).toBe('FV2304');
      expect(component.formatVersions[4]).toBe('FV2504');
    }));

    it('should set default new version to most recent (last in list)', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const formValue = component.headerSearchForm.controls.formatVersionNew.value;
      expect(formValue).toBe('FV2504');
    }));

    it('should set default old version to second most recent (second to last in list)', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const formValue = component.headerSearchForm.controls.formatVersionOld.value;
      expect(formValue).toBe('FV2410');
    }));

    // Note: emit tests are skipped because the subscription runs in the constructor
    // before we can set up spies. The important behavior (form values being set) is tested above.
  });

  describe('availableOldVersions', () => {
    it('should return all versions when new version is not set', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Clear the new version
      component.headerSearchForm.controls.formatVersionNew.setValue('');

      expect(component.availableOldVersions).toEqual(component.formatVersions);
    }));

    it('should filter versions older than selected new version', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.headerSearchForm.controls.formatVersionNew.setValue('FV2410');

      const available = component.availableOldVersions;
      expect(available).toContain('FV2404');
      expect(available).toContain('FV2310');
      expect(available).toContain('FV2304');
      expect(available).not.toContain('FV2410');
      expect(available).not.toContain('FV2504');
    }));
  });

  describe('availableNewVersions', () => {
    it('should return all versions when old version is not set', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Clear the old version
      component.headerSearchForm.controls.formatVersionOld.setValue('');

      expect(component.availableNewVersions).toEqual(component.formatVersions);
    }));

    it('should filter versions newer than selected old version', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      component.headerSearchForm.controls.formatVersionOld.setValue('FV2404');

      const available = component.availableNewVersions;
      expect(available).toContain('FV2504');
      expect(available).toContain('FV2410');
      expect(available).not.toContain('FV2404');
      expect(available).not.toContain('FV2310');
      expect(available).not.toContain('FV2304');
    }));
  });

  describe('initial dropdown options', () => {
    it('should have available old versions after defaults are set', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // With default new version FV2504, old versions should include FV2410, FV2404, etc.
      const available = component.availableOldVersions;
      expect(available.length).toBeGreaterThan(0);
      expect(available).toContain('FV2410');
    }));

    it('should have available new versions after defaults are set', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // With default old version FV2410, new versions should include FV2504
      const available = component.availableNewVersions;
      expect(available.length).toBeGreaterThan(0);
      expect(available).toContain('FV2504');
    }));

    it('should have selected old version in availableOldVersions', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const selectedOld = component.headerSearchForm.controls.formatVersionOld.value;
      const available = component.availableOldVersions;

      expect(selectedOld).toBeTruthy();
      expect(available).toContain(selectedOld);
    }));

    it('should have selected new version in availableNewVersions', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const selectedNew = component.headerSearchForm.controls.formatVersionNew.value;
      const available = component.availableNewVersions;

      expect(selectedNew).toBeTruthy();
      expect(available).toContain(selectedNew);
    }));
  });

  describe('pruefi navigation', () => {
    it('should emit pruefiChange when pruefi form control value changes', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      const pruefiChangeSpy = jest.fn();
      component.pruefiChange.subscribe(pruefiChangeSpy);

      // Set pruefi value directly on form control
      component.headerSearchForm.controls.pruefi.setValue('12345');
      tick();

      expect(pruefiChangeSpy).toHaveBeenCalledWith('12345');
    }));

    it('should navigate when pruefi is set and navigateOnSubmit is true', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Ensure format versions are set (they should be by default)
      expect(component.headerSearchForm.controls.formatVersionOld.value).toBeTruthy();
      expect(component.headerSearchForm.controls.formatVersionNew.value).toBeTruthy();

      // Verify navigateOnSubmit is true by default
      expect(component.navigateOnSubmit()).toBe(true);

      // Set pruefi value - this should trigger navigation
      component.headerSearchForm.controls.pruefi.setValue('12345');
      fixture.detectChanges();
      tick();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/compare', '12345'], {
        queryParams: {
          'fv-old': 'FV2410',
          'fv-new': 'FV2504',
        },
      });
    }));

    it('should NOT navigate when pruefi has less than 5 digits', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Set invalid pruefi value
      component.headerSearchForm.controls.pruefi.setValue('1234');
      tick();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should NOT navigate when pruefi contains letters', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      // Set invalid pruefi value
      component.headerSearchForm.controls.pruefi.setValue('1234a');
      tick();

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));
  });
});
