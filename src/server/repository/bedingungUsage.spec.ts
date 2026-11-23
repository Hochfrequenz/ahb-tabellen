import BedingungUsageRepository, { BedingungUsageRow } from './bedingungUsage';
import { AppDataSource } from '../infrastructure/database';

jest.mock('../infrastructure/database', () => ({
  AppDataSource: { isInitialized: true, initialize: jest.fn(), query: jest.fn() },
}));

function row(pruefi: string, sortPath: string, via: string | null = null): BedingungUsageRow {
  return {
    pruefidentifikator: pruefi,
    description: 'd',
    sort_path: sortPath,
    segmentgroup_key: null,
    segment_code: null,
    data_element: null,
    qualifier: null,
    line_name: null,
    line_ahb_status: null,
    via,
  };
}

describe('BedingungUsageRepository', () => {
  const query = AppDataSource.query as jest.Mock;
  let repository: BedingungUsageRepository;

  beforeEach(() => {
    query.mockReset();
    repository = new BedingungUsageRepository();
  });

  it('issues exactly one query against the view', async () => {
    query.mockResolvedValueOnce([row('11001', 'a')]);

    const result = await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      limit: 10,
    });

    expect(query).toHaveBeenCalledTimes(1);
    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain('FROM v_ahb_condition_usages');
    expect(sql).toContain('format_version = ?');
    expect(sql).toContain('condition_key = ?');
    expect(sql).toContain('ORDER BY pruefidentifikator, sort_path');
    expect(sql).not.toMatch(/COUNT|LIMIT|IN \(|v_ahbtabellen/);
    expect(params).toEqual(['FV2610', '931']);
    expect(result).toEqual({ totalLines: 1, rows: [row('11001', 'a')] });
  });

  it('filters by plain format and pruefi in the same single query', async () => {
    query.mockResolvedValue([]);
    await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'MSCONS',
      pruefi: '13002',
      limit: 5,
    });
    expect(query).toHaveBeenCalledTimes(1);
    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain('AND format = ?');
    expect(sql).toContain('AND pruefidentifikator = ?');
    expect(params).toEqual(['FV2610', '931', 'MSCONS', '13002']);
  });

  it('filters a detailed format by the plain format in SQL and by efoli in TypeScript, before counting and limiting', async () => {
    // 55001 is UTILMDS and 44001 is UTILMDG according to efoli's getFormatOfPruefidentifikator; 11001 is plain UTILMD
    query.mockResolvedValueOnce([
      row('11001', 'a'),
      row('44001', 'a'),
      row('55001', 'a', 'UB1'),
      row('55001', 'a', null),
      row('55001', 'b'),
      row('55001', 'c'),
    ]);

    const result = await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'UTILMDS',
      limit: 2,
    });

    expect(query).toHaveBeenCalledTimes(1);
    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain('AND format = ?');
    expect(params).toEqual(['FV2610', '931', 'UTILMD']);
    // 3 distinct UTILMDS lines (a, b, c); limit 2 keeps lines a (both rows) and b
    expect(result.totalLines).toBe(3);
    expect(result.rows).toEqual([
      row('55001', 'a', 'UB1'),
      row('55001', 'a', null),
      row('55001', 'b'),
    ]);
  });

  it('applies limit on distinct lines (not view rows) and reports the full total', async () => {
    query.mockResolvedValueOnce([
      row('11001', 'a', null),
      row('11001', 'a', 'UB1'),
      row('11001', 'b'),
      row('11002', 'a'),
    ]);
    const result = await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      limit: 2,
    });
    expect(result.totalLines).toBe(3);
    expect(result.rows).toHaveLength(3);
    expect(result.rows.map(r => `${r.pruefidentifikator}/${r.sort_path}`)).toEqual([
      '11001/a',
      '11001/a',
      '11001/b',
    ]);
  });

  it('treats an inherited property name like toString as a plain format filter', async () => {
    query.mockResolvedValueOnce([]);
    await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'toString',
      limit: 10,
    });
    expect(query.mock.calls[0][1]).toEqual(['FV2610', '931', 'toString']);
  });

  it('returns an empty result when no row survives the detailed-format filter', async () => {
    query.mockResolvedValueOnce([row('11001', 'a')]);
    const result = await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'UTILMDG',
      limit: 10,
    });
    expect(result).toEqual({ totalLines: 0, rows: [] });
    expect(query).toHaveBeenCalledTimes(1);
  });
});
