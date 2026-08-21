import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonTableComponent } from './comparison-table.component';
import { AhbDiffLine } from '../../../../core/api';

function makeLine(overrides: Partial<AhbDiffLine> = {}): AhbDiffLine {
  return {
    id_path: 'row-1',
    sort_path: 'sort-1',
    diff_status: 'modified',
    changed_columns: ['bedingung'],
    old: { bedingung: 'alte Bedingung' },
    new: { bedingung: 'neue Bedingung' },
    ...overrides,
  };
}

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

  describe('conditions column', () => {
    it('always renders the conditions column and cell content for every row', () => {
      fixture.componentRef.setInput('lines', [makeLine()]);
      fixture.detectChanges();

      const subHeaders = Array.from(
        fixture.nativeElement.querySelectorAll('thead tr:nth-child(2) th')
      ) as HTMLElement[];
      const conditionHeaders = subHeaders.filter(th => th.textContent?.trim() === 'Beding.');
      expect(conditionHeaders.length).toBe(2);

      const text = fixture.nativeElement.textContent;
      expect(text).toContain('alte Bedingung');
      expect(text).toContain('neue Bedingung');
    });

    it('renders no chevron while nothing is truncated', () => {
      fixture.componentRef.setInput('lines', [makeLine()]);
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelectorAll('button').length).toBe(0);
    });

    it('renders a down chevron once a side is truncated', () => {
      const line = makeLine();
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.onConditionsTruncated(line, 'old', true);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('button');
      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.querySelector('i').classList).toContain('mdi-chevron-down');
    });

    it('emphasises and hops the chevron when the change is hidden below the clamp', () => {
      const line = makeLine({ changed_columns: ['bedingung'] });
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.onConditionsTruncated(line, 'old', true);
      component.onConditionsChangeHidden(line, 'old', true);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('button i');
      expect(icon.classList).toContain('text-xl');
      expect(icon.classList).toContain('arrow-hop');
      // The chevron inherits the row text colour; no dedicated accent colour.
      expect(icon.classList).not.toContain('text-hf-dunkel-rose');
      expect(component.conditionsToggleLabel(line, 'old')).toContain('enthält eine Änderung');
    });

    it('does not emphasise or hop the chevron when the change is still visible', () => {
      const line = makeLine();
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.onConditionsTruncated(line, 'old', true);
      component.onConditionsChangeHidden(line, 'old', false);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('button i');
      expect(icon).toBeTruthy();
      expect(icon.classList).toContain('text-base');
      expect(icon.classList).not.toContain('text-xl');
      expect(icon.classList).not.toContain('arrow-hop');
    });

    it('expands and collapses a row on chevron click', () => {
      const line = makeLine();
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.onConditionsTruncated(line, 'old', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelectorAll('.line-clamp-1').length).toBeGreaterThan(0);

      const button = fixture.nativeElement.querySelector('button');
      button.click();
      fixture.detectChanges();

      expect(component.isExpanded(line)).toBe(true);
      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.querySelector('i').classList).toContain('mdi-chevron-up');
      expect(fixture.nativeElement.querySelectorAll('.line-clamp-1').length).toBe(0);

      button.click();
      fixture.detectChanges();
      expect(component.isExpanded(line)).toBe(false);
    });

    it('expands only collapsible rows via expandAllCollapsible and clears via collapseAll', () => {
      const collapsible = makeLine({ id_path: 'collapsible' });
      const plain = makeLine({ id_path: 'plain' });
      fixture.componentRef.setInput('lines', [collapsible, plain]);
      fixture.detectChanges();

      component.onConditionsTruncated(collapsible, 'old', true);
      fixture.detectChanges();

      component.expandAllCollapsible();
      expect(component.isExpanded(collapsible)).toBe(true);
      expect(component.isExpanded(plain)).toBe(false);

      component.collapseAll();
      expect(component.isExpanded(collapsible)).toBe(false);
    });
  });

  describe('expansion state reset', () => {
    it('keeps expansion when only lines change (e.g. filtering)', () => {
      const line = makeLine();
      fixture.componentRef.setInput('pruefi', '55014');
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.toggleRow(line);
      expect(component.isExpanded(line)).toBe(true);

      // A filter toggle produces a new `lines` array but keeps the same comparison.
      fixture.componentRef.setInput('lines', [makeLine()]);
      fixture.detectChanges();

      expect(component.isExpanded(line)).toBe(true);
    });

    it('resets expansion when the comparison identity changes', () => {
      const line = makeLine();
      fixture.componentRef.setInput('pruefi', '55014');
      fixture.componentRef.setInput('lines', [line]);
      fixture.detectChanges();

      component.toggleRow(line);
      component.onConditionsTruncated(line, 'old', true);
      expect(component.isExpanded(line)).toBe(true);

      fixture.componentRef.setInput('pruefi', '55015');
      fixture.detectChanges();

      expect(component.isExpanded(line)).toBe(false);
      expect(component.isCollapsible(line)).toBe(false);
    });
  });
});
