import { AhbPageComponent } from './ahb-page.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { AhbService } from '../../../../core/api';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AhbTableComponent } from '../../components/ahb-table/ahb-table.component';
import { signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

describe('AhbPageComponent', () => {
  let mockRouter: { navigate: jest.Mock };
  let mockAhbService: { getAhb$Json: jest.Mock };

  beforeEach(() => {
    mockRouter = { navigate: jest.fn() };
    mockAhbService = {
      getAhb$Json: jest.fn(params =>
        of({
          meta: {
            pruefidentifikator: params.pruefi,
            description: '',
            direction: '',
            maus_version: '',
          },
          lines: [],
        })
      ),
    };

    return MockBuilder(AhbPageComponent)
      .keep(AhbTableComponent)
      .provide({
        provide: AhbTableComponent,
        useValue: {
          markIndex: signal(0),
          markElements: computed(() => [] as HTMLElement[]),
          nextResult: () => {},
          previousResult: () => {},
          resetMarkIndex: () => {},
        },
      })
      .provide({
        provide: AhbService,
        useValue: mockAhbService,
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({}),
          params: of({ formatVersion: 'FV123', pruefi: '123' }),
        },
      })
      .provide({
        provide: Router,
        useValue: mockRouter,
      })
      .provide({
        provide: HttpClient,
        useValue: {
          get: jest.fn(() => of('')),
        },
      });
  });

  // Reconfigures the testing module so the route resolves to the given Prüfidentifikator.
  const buildWithPruefi = (pruefi: string) =>
    MockBuilder(AhbPageComponent)
      .keep(AhbTableComponent)
      .provide({
        provide: AhbTableComponent,
        useValue: {
          markIndex: signal(0),
          markElements: computed(() => [] as HTMLElement[]),
          nextResult: () => {},
          previousResult: () => {},
          resetMarkIndex: () => {},
        },
      })
      .provide({
        provide: AhbService,
        useValue: mockAhbService,
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({}),
          params: of({ formatVersion: 'FV2504', pruefi }),
        },
      })
      .provide({
        provide: Router,
        useValue: mockRouter,
      })
      .provide({
        provide: HttpClient,
        useValue: {
          get: jest.fn(() => of('')),
        },
      });

  it('should render', () => {
    const fixture = MockRender(AhbPageComponent, {
      formatVersion: 'FV123',
      pruefi: '123',
    });
    const html = ngMocks.formatHtml(fixture);
    expect(html).toContain('<app-header');
    expect(html).toContain('Anwendungshandbuch 123');
  });

  it('should refresh table and redirect URL upon formatversion change', () => {
    const fixture = MockRender(AhbPageComponent, {
      formatVersion: 'FV2304',
      pruefi: '123',
    });
    const component = fixture.point.componentInstance;
    const router = ngMocks.findInstance(Router);

    const navigateSpy = jest.spyOn(router, 'navigate');

    component.onFormatVersionChange('FV2410');

    expect(navigateSpy).toHaveBeenCalledWith(['/ahb', 'FV2410', '123']);
  });

  it('should resolve "current" format version and preserve pruefi in URL', () => {
    // Override the ActivatedRoute to simulate navigating with 'current'
    MockBuilder(AhbPageComponent)
      .keep(AhbTableComponent)
      .provide({
        provide: AhbTableComponent,
        useValue: {
          markIndex: signal(0),
          markElements: computed(() => [] as HTMLElement[]),
          nextResult: () => {},
          previousResult: () => {},
          resetMarkIndex: () => {},
        },
      })
      .provide({
        provide: AhbService,
        useValue: mockAhbService,
      })
      .provide({
        provide: ActivatedRoute,
        useValue: {
          queryParams: of({}),
          params: of({ formatVersion: 'current', pruefi: '55001' }),
        },
      })
      .provide({
        provide: Router,
        useValue: mockRouter,
      })
      .provide({
        provide: HttpClient,
        useValue: {
          get: jest.fn(() => of('')),
        },
      })
      .then(() => {
        const fixture = MockRender(AhbPageComponent);
        const component = fixture.point.componentInstance;

        // Should have navigated with resolved format version AND pruefi
        expect(mockRouter.navigate).toHaveBeenCalledWith(
          ['/ahb', expect.stringMatching(/^FV\d{4}$/), '55001'],
          { replaceUrl: true }
        );

        // Signals should be set so that race conditions with child components don't lose pruefi
        expect(component.pruefi()).toBe('55001');
        expect(component.formatVersion()).toMatch(/^FV\d{4}$/);
      });
  });

  it.each(['44096', '44097'])(
    'should show the DVGW fallback for TSIMSG Prüfidentifikator %s without fetching AHB data',
    pruefi => {
      return buildWithPruefi(pruefi).then(() => {
        const fixture = MockRender(AhbPageComponent);
        const component = fixture.point.componentInstance;

        expect(component.isDvgwPruefi()).toBe(true);
        expect(component.errorOccurred).toBe(true);
        expect(mockAhbService.getAhb$Json).not.toHaveBeenCalled();

        const html = ngMocks.formatHtml(fixture);
        expect(html).toContain('app-dvgw-fallback-page');
      });
    }
  );

  it('should render a regular Gas Prüfidentifikator (44001) normally instead of the DVGW fallback', () => {
    return buildWithPruefi('44001').then(() => {
      const fixture = MockRender(AhbPageComponent);
      const component = fixture.point.componentInstance;

      expect(component.isDvgwPruefi()).toBe(false);
      expect(component.errorOccurred).toBe(false);
      expect(mockAhbService.getAhb$Json).toHaveBeenCalledWith({
        'format-version': 'FV2504',
        pruefi: '44001',
      });

      const html = ngMocks.formatHtml(fixture);
      expect(html).not.toContain('app-dvgw-fallback-page');
    });
  });
});
