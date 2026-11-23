import BedingungUsageRepository from './bedingungUsage';
import { AppDataSource } from '../infrastructure/database';

jest.mock('../infrastructure/database', () => ({
  AppDataSource: { isInitialized: true, initialize: jest.fn(), query: jest.fn() },
}));

describe('BedingungUsageRepository', () => {
  const query = AppDataSource.query as jest.Mock;
  let repository: BedingungUsageRepository;

  beforeEach(() => {
    query.mockReset();
    repository = new BedingungUsageRepository();
  });

  it('counts lines and fetches the rows of the first `limit` lines from the view', async () => {
    query.mockResolvedValueOnce([{ total: 3 }]).mockResolvedValueOnce([{ sort_path: 'a' }]);

    const result = await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      limit: 2,
    });

    expect(result).toEqual({ totalLines: 3, rows: [{ sort_path: 'a' }] });
    const [countSql, countParams] = query.mock.calls[0];
    expect(countSql).toContain('FROM v_ahb_condition_usages');
    expect(countSql).toContain('COUNT(*)');
    expect(countParams).toEqual(['FV2610', '931']);
    const [rowsSql, rowsParams] = query.mock.calls[1];
    expect(rowsSql).toContain('LIMIT ?');
    expect(rowsSql).toContain('ORDER BY pruefidentifikator ASC, sort_path ASC');
    expect(rowsParams).toEqual(['FV2610', '931', 'FV2610', '931', 2]);
  });

  it('filters by plain format and pruefi directly in SQL', async () => {
    query.mockResolvedValue([{ total: 0 }]);
    await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'MSCONS',
      pruefi: '13002',
      limit: 5,
    });
    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain('format = ?');
    expect(sql).toContain('pruefidentifikator = ?');
    expect(params).toEqual(['FV2610', '931', 'MSCONS', '13002']);
  });

  it('resolves a detailed format to an IN list of pruefis so limit and total stay correct', async () => {
    query
      .mockResolvedValueOnce([
        { pruefidentifikator: '11001' }, // UTILMD (plain)
        { pruefidentifikator: '55001' }, // UTILMDS? resolved below via efoli
        { pruefidentifikator: '44001' },
      ])
      .mockResolvedValueOnce([{ total: 0 }])
      .mockResolvedValueOnce([]);

    await repository.findUsages({
      formatVersion: 'FV2610',
      conditionKey: '931',
      format: 'UTILMDS',
      limit: 10,
    });

    const [pruefiSql, pruefiParams] = query.mock.calls[0];
    expect(pruefiSql).toContain('SELECT DISTINCT pruefidentifikator');
    expect(pruefiSql).toContain('FROM v_ahbtabellen');
    expect(pruefiParams).toEqual(['FV2610', 'UTILMD']);
    const [countSql, countParams] = query.mock.calls[1];
    expect(countSql).toMatch(/pruefidentifikator IN \((\?, )*\?\)/);
    expect(countSql).not.toContain('format = ?');
    expect(countParams.slice(0, 2)).toEqual(['FV2610', '931']);
    // only pruefis that efoli maps to UTILMDS are kept
    const inParams = countParams.slice(2);
    expect(inParams).toEqual(['55001']);
  });

  it('returns an empty result without querying the view when no pruefi has the detailed format', async () => {
    query.mockResolvedValueOnce([{ pruefidentifikator: '11001' }]);
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
