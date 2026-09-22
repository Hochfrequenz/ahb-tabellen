import { AhbSearchFormHeaderComponent } from './ahb-search-form-header.component';
import { MockBuilder, MockRender } from 'ng-mocks';

describe('AhbSearchFormHeaderComponent', () => {
  beforeEach(() => MockBuilder(AhbSearchFormHeaderComponent));

  it('should render', () => {
    MockRender(AhbSearchFormHeaderComponent, {
      formatVersion: 'FV123',
      pruefi: '123',
    });
  });

  // Regression test for https://github.com/Hochfrequenz/ahb-tabellen/issues/941
  // While a pruefi is displayed, changing to a *different* one (e.g. pasting) must emit the
  // NEW pruefi, so the hosting page navigates to it. The previous implementation additionally
  // navigated from here by re-reading `headerSearchForm.value`, which still held the old pruefi
  // at that point (the FormGroup aggregate lags the child control's `valueChanges`), sending the
  // user back to the currently shown pruefi.
  it('emits pruefiChange with the newly entered pruefi, not the previously shown one (#941)', () => {
    const fixture = MockRender(AhbSearchFormHeaderComponent, {
      formatVersion: 'FV2504',
      pruefi: '55001',
    });
    const component = fixture.point.componentInstance;

    const emitted: string[] = [];
    component.pruefiChange.subscribe((value: string) => emitted.push(value));

    // Simulate the value accessor propagating a different pruefi while 55001 is shown.
    component.headerSearchForm.get('pruefi')?.setValue('44043');

    expect(emitted.at(-1)).toBe('44043');
    expect(emitted).not.toContain('55001');
  });
});
