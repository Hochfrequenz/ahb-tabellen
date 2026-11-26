import { AhbTableComponent } from './ahb-table.component';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { Ahb, AhbMigLinks } from '../../../../core/api';
import { MigElementDetailsComponent } from '../../../mig/components/mig-element-details/mig-element-details.component';

const line: Ahb['lines'][number] = {
  ahb_expression: 'Muss',
  conditions: '',
  data_element: '',
  guid: 'g1',
  index: 0,
  name: '',
  section_name: 'Nachrichten-Kopfsegment',
  segment_code: 'UNH',
  segment_group_key: '',
  value_pool_entry: '',
  line_type: 'segment',
};

const migLinks: AhbMigLinks = {
  mig: {
    formatVersion: 'FV2610',
    format: 'MSCONS',
    versionsnummer: '2.5',
    gueltigVon: null,
    gueltigBis: null,
  },
  links: [
    {
      guid: 'g1',
      node: '2',
      exact: true,
      element: {
        type: 'segment',
        key: 'UNH',
        name: 'Nachrichten-Kopfsegment',
        statusStd: 'M',
        statusSpecification: 'M',
      },
    },
  ],
};

describe('AhbTableComponent', () => {
  beforeEach(async () => MockBuilder(AhbTableComponent));

  it('should render', () => {
    const fixture = MockRender(AhbTableComponent, {
      lines: [],
    });
    ngMocks.formatHtml(fixture);
  });

  it('has no MIG column without MIG links', () => {
    MockRender(AhbTableComponent, { lines: [line], formatVersion: 'FV2610', pruefi: '13002' });
    expect(ngMocks.findAll('th').map(th => ngMocks.formatText(th))).not.toContain('MIG');
    expect(ngMocks.findAll('td[data-guide]')).toHaveLength(0);
  });

  it('opens and closes the MIG details of a line', () => {
    const fixture = MockRender(AhbTableComponent, {
      lines: [line],
      formatVersion: 'FV2610',
      pruefi: '13002',
      migLinks,
    });
    expect(ngMocks.findAll('th').map(th => ngMocks.formatText(th))).toContain('MIG');
    // The segment group gutter: one cell per line; a top-level segment draws no bracket.
    expect(ngMocks.findAll('td[data-guide]')).toHaveLength(1);
    expect(ngMocks.findAll('td[data-guide] span')).toHaveLength(0);
    const button = ngMocks.find('button[aria-expanded]');
    expect(ngMocks.formatText(button)).toContain('UNH');
    expect(ngMocks.findAll(MigElementDetailsComponent)).toHaveLength(0);

    ngMocks.click(button);
    fixture.detectChanges();
    const details = ngMocks.find(MigElementDetailsComponent);
    expect(details.componentInstance.link()).toBe(migLinks.links[0]);

    ngMocks.click(button);
    fixture.detectChanges();
    expect(ngMocks.findAll(MigElementDetailsComponent)).toHaveLength(0);
  });

  it('collapses only the clicked one of two neighbouring SG8', () => {
    const rows: [string, string, string, string][] = [
      // guid, segment group, segment, MIG node
      ['sg8a', 'SG8', '', '10-48'],
      ['seqa', 'SG8', 'SEQ', '10-48-0'],
      ['sg8b', 'SG8', '', '10-49'],
      ['seqb', 'SG8', 'SEQ', '10-49-0'],
    ];
    const lines = rows.map(([guid, sg, seg], index) => ({
      ...line,
      guid,
      index,
      segment_group_key: sg,
      segment_code: seg,
      line_type: seg ? 'segment' : 'segment_group',
    }));
    const links: AhbMigLinks = {
      ...migLinks,
      links: rows.map(([guid, , , node]) => ({
        ...migLinks.links[0],
        guid,
        node,
        element: { ...migLinks.links[0].element, key: guid },
      })),
    };
    const fixture = MockRender(AhbTableComponent, {
      lines,
      formatVersion: 'FV2610',
      pruefi: '55001',
      migLinks: links,
    });
    // The MIG button of each visible row shows its line's guid.
    const visible = () =>
      ngMocks
        .findAll('tbody button[aria-expanded][title^="MIG"]')
        .map(b => ngMocks.formatText(b).replace(' ▾', ''));
    expect(visible()).toEqual(['sg8a', 'seqa', 'sg8b', 'seqb']);

    const toggles = ngMocks.findAll('button[aria-label^="Einklappen"]');
    expect(toggles).toHaveLength(2);
    ngMocks.click(toggles[0]);
    fixture.detectChanges();
    expect(visible()).toEqual(['sg8a', 'sg8b', 'seqb']); // first SG8 folded, second untouched

    ngMocks.click(ngMocks.find('button[aria-label^="Ausklappen"]'));
    fixture.detectChanges();
    expect(visible()).toEqual(['sg8a', 'seqa', 'sg8b', 'seqb']);
  });
});
