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
    expect(ngMocks.findAll('td[aria-hidden="true"]')).toHaveLength(0);
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
    expect(ngMocks.findAll('td[aria-hidden="true"]')).toHaveLength(1);
    expect(ngMocks.findAll('td[aria-hidden="true"] span')).toHaveLength(0);
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
});
