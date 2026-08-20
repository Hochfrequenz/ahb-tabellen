import { PruefiInputComponent } from './pruefi-input.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';

describe('PruefiInputComponent', () => {
  beforeEach(() => MockBuilder(PruefiInputComponent));

  it('should render', () => {
    const fixture = MockRender(PruefiInputComponent, {
      formatVersion: null,
    });
    const html = ngMocks.formatHtml(fixture);
    expect(html).toContain('id="pruefi-list"');
  });

  describe('onInputChange', () => {
    it('filters suggestions with * as a case-insensitive wildcard', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;
      const suggestions: string[][] = [];
      const subscription = component.pruefis$.subscribe(values => suggestions.push(values));

      component['allPruefis$'].next([
        { pruefidentifikator: '11001', name: 'Änderung der Stammdaten TR Hinweis' },
        { pruefidentifikator: '11002', name: 'Änderung ohne Ergebnis' },
        { pruefidentifikator: '11003', name: 'Keine Änderung der TR-Stammdaten' },
      ]);
      component.onInputChange({ target: { value: 'änderung*tr' } } as unknown as Event);

      expect(suggestions.at(-1)).toEqual(['11001 - Änderung der Stammdaten TR Hinweis']);
      subscription.unsubscribe();
    });

    it('treats regex metacharacters in a wildcard term as literals (no injection)', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;
      const suggestions: string[][] = [];
      const subscription = component.pruefis$.subscribe(values => suggestions.push(values));

      component['allPruefis$'].next([
        { pruefidentifikator: '11001', name: 'A.C item' },
        { pruefidentifikator: '11002', name: 'AXC item' },
      ]);
      // The '.' between the wildcard segments must match a literal dot, not any char.
      component.onInputChange({ target: { value: 'a.c*item' } } as unknown as Event);

      expect(suggestions.at(-1)).toEqual(['11001 - A.C item']);
      subscription.unsubscribe();
    });

    it('matches all suggestions when the term is a lone wildcard', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;
      const suggestions: string[][] = [];
      const subscription = component.pruefis$.subscribe(values => suggestions.push(values));

      component['allPruefis$'].next([
        { pruefidentifikator: '11001', name: 'Alpha' },
        { pruefidentifikator: '11002', name: 'Beta' },
      ]);
      component.onInputChange({ target: { value: '*' } } as unknown as Event);

      expect(suggestions.at(-1)).toEqual(['11001 - Alpha', '11002 - Beta']);
      subscription.unsubscribe();
    });

    it('uses substring matching (not anchored) when no wildcard is present', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;
      const suggestions: string[][] = [];
      const subscription = component.pruefis$.subscribe(values => suggestions.push(values));

      component['allPruefis$'].next([
        { pruefidentifikator: '11001', name: 'Keine Änderung der TR-Stammdaten' },
        { pruefidentifikator: '11002', name: 'Nur Ergebnis' },
      ]);
      component.onInputChange({ target: { value: 'änderung' } } as unknown as Event);

      expect(suggestions.at(-1)).toEqual(['11001 - Keine Änderung der TR-Stammdaten']);
      subscription.unsubscribe();
    });

    it('should call onChange with 5-digit input', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;

      // Register the onChange callback (mimics ControlValueAccessor registration)
      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      // Simulate typing "12345"
      const mockEvent = {
        target: { value: '12345' },
      } as unknown as Event;

      component.onInputChange(mockEvent);

      expect(onChangeSpy).toHaveBeenCalledWith('12345');
    });

    it('should call onChange when selecting from dropdown (format with name)', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;

      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      // Simulate selecting from dropdown: "12345 - Some Description"
      const mockEvent = {
        target: { value: '12345 - Some Description' },
      } as unknown as Event;

      component.onInputChange(mockEvent);

      expect(onChangeSpy).toHaveBeenCalledWith('12345');
    });

    it('should NOT call onChange with less than 5 digits', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;

      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      // Simulate typing "1234" (4 digits)
      const mockEvent = {
        target: { value: '1234' },
      } as unknown as Event;

      component.onInputChange(mockEvent);

      // Should be called with null for invalid input
      expect(onChangeSpy).toHaveBeenCalledWith(null);
    });

    it('should call onChange with first 5 digits when more than 5 digits entered', () => {
      const fixture = MockRender(PruefiInputComponent, {
        formatVersion: null,
      });
      const component = fixture.point.componentInstance;

      const onChangeSpy = jest.fn();
      component.registerOnChange(onChangeSpy);

      // Simulate typing "123456" (6 digits)
      const mockEvent = {
        target: { value: '123456' },
      } as unknown as Event;

      component.onInputChange(mockEvent);

      expect(onChangeSpy).toHaveBeenCalledWith('12345');
    });
  });
});
