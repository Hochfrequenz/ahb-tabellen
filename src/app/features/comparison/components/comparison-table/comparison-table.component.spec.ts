import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonTableComponent } from './comparison-table.component';

describe('ComparisonTableComponent', () => {
  let fixture: ComponentFixture<ComparisonTableComponent>;
  let component: ComparisonTableComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparisonTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonTableComponent);
    component = fixture.componentInstance;
  });

  describe('header labels', () => {
    it('shows "Alte/Neue Version" for a format-version comparison (no pruefiOld/pruefiNew)', () => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.detectChanges();

      expect(component.headerLabelOld).toBe('Alte Version (FV2410)');
      expect(component.headerLabelNew).toBe('Neue Version (FV2504)');
    });

    it('shows "Alte/Neue Version" when pruefiOld and pruefiNew are the same Pruefi', () => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2410');
      fixture.componentRef.setInput('formatVersionNew', 'FV2504');
      fixture.componentRef.setInput('pruefiOld', '55014');
      fixture.componentRef.setInput('pruefiNew', '55014');
      fixture.detectChanges();

      expect(component.headerLabelOld).toBe('Alte Version (FV2410)');
      expect(component.headerLabelNew).toBe('Neue Version (FV2504)');
    });

    it('shows "Prüfi X" without the format version for a Pruefi-vs-Pruefi comparison', () => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2604');
      fixture.componentRef.setInput('formatVersionNew', 'FV2604');
      fixture.componentRef.setInput('pruefiOld', '55002');
      fixture.componentRef.setInput('pruefiNew', '55003');
      fixture.detectChanges();

      expect(component.headerLabelOld).toBe('Prüfi 55002');
      expect(component.headerLabelNew).toBe('Prüfi 55003');
    });

    it('renders the Pruefi labels in the table header', () => {
      fixture.componentRef.setInput('formatVersionOld', 'FV2604');
      fixture.componentRef.setInput('formatVersionNew', 'FV2604');
      fixture.componentRef.setInput('pruefiOld', '55002');
      fixture.componentRef.setInput('pruefiNew', '55003');
      fixture.detectChanges();

      const headerCells = fixture.nativeElement.querySelectorAll('thead tr:first-child th');
      expect(headerCells[0].textContent.trim()).toBe('Prüfi 55002');
      expect(headerCells[2].textContent.trim()).toBe('Prüfi 55003');
    });
  });
});
