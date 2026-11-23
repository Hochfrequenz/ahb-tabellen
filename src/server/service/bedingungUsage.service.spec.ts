import BedingungUsageService, { normalizeBedingung } from './bedingungUsage.service';
import BedingungUsageRepository, { BedingungUsageRow } from '../repository/bedingungUsage';
import { ValidationError } from '../infrastructure/errors';

function row(over: Partial<BedingungUsageRow>): BedingungUsageRow {
  return {
    pruefidentifikator: '11001',
    description: 'Anmeldung',
    sort_path: '0001',
    segmentgroup_key: 'SG4',
    segment_code: 'STS',
    data_element: '9013',
    qualifier: null,
    line_name: 'Name',
    line_ahb_status: 'Muss [931]',
    via: null,
    ...over,
  };
}

describe('normalizeBedingung', () => {
  it.each([
    ['931', '931'],
    ['[931]', '931'],
    [' [ 931 ] ', '931'],
    ['ub1', 'UB1'],
    ['[ub1]', 'UB1'],
    ['2p', '2P'],
  ])('normalizes %j to %j', (input, expected) => {
    expect(normalizeBedingung(input)).toBe(expected);
  });

  it.each(['', '  ', '[]', ' [ ] '])('rejects %j as empty', input => {
    expect(() => normalizeBedingung(input)).toThrow(ValidationError);
  });
});

describe('BedingungUsageService', () => {
  let repository: jest.Mocked<BedingungUsageRepository>;
  let service: BedingungUsageService;

  beforeEach(() => {
    repository = { findUsages: jest.fn() } as unknown as jest.Mocked<BedingungUsageRepository>;
    service = new BedingungUsageService(repository);
  });

  it('normalizes input and applies the default limit', async () => {
    repository.findUsages.mockResolvedValue({ totalLines: 0, rows: [] });
    const result = await service.searchBedingungUsage({
      formatVersion: 'FV2610',
      bedingung: ' [ ub1 ] ',
      format: 'utilmd',
    });
    expect(repository.findUsages).toHaveBeenCalledWith({
      formatVersion: 'FV2610',
      conditionKey: 'UB1',
      format: 'UTILMD',
      pruefi: undefined,
      limit: 200,
    });
    expect(result).toEqual({
      formatVersion: 'FV2610',
      bedingung: 'UB1',
      totalLines: 0,
      returnedLines: 0,
      truncated: false,
      pruefis: [],
    });
  });

  it('rejects invalid format version, pruefi and limit', async () => {
    await expect(
      service.searchBedingungUsage({ formatVersion: 'FV9999', bedingung: '1' })
    ).rejects.toThrow(ValidationError);
    await expect(
      service.searchBedingungUsage({ formatVersion: 'FV2610', bedingung: '1', pruefi: '12' })
    ).rejects.toThrow(ValidationError);
    await expect(
      service.searchBedingungUsage({ formatVersion: 'FV2610', bedingung: '1', limit: 0 })
    ).rejects.toThrow(ValidationError);
    await expect(
      service.searchBedingungUsage({ formatVersion: 'FV2610', bedingung: '[]' })
    ).rejects.toThrow(ValidationError);
    expect(repository.findUsages).not.toHaveBeenCalled();
  });

  it('merges direct and via rows of one line, null first, and groups by pruefi', async () => {
    repository.findUsages.mockResolvedValue({
      totalLines: 3,
      rows: [
        row({ sort_path: '0001', via: 'UB1' }),
        row({ sort_path: '0001', via: null }),
        row({ sort_path: '0002', via: '2P' }),
        row({ pruefidentifikator: '11002', description: 'B', sort_path: '0001', via: null }),
      ],
    });
    const result = await service.searchBedingungUsage({
      formatVersion: 'FV2610',
      bedingung: '931',
    });
    expect(result.totalLines).toBe(3);
    expect(result.returnedLines).toBe(3);
    expect(result.truncated).toBe(false);
    expect(result.pruefis).toHaveLength(2);
    expect(result.pruefis[0].pruefidentifikator).toBe('11001');
    expect(result.pruefis[0].lines).toEqual([
      {
        segmentgroupKey: 'SG4',
        segmentCode: 'STS',
        dataElement: '9013',
        qualifier: null,
        lineName: 'Name',
        lineAhbStatus: 'Muss [931]',
        via: [null, 'UB1'],
      },
      expect.objectContaining({ via: ['2P'] }),
    ]);
    expect(result.pruefis[1].lines).toHaveLength(1);
  });

  it('reports truncation when the total exceeds the returned lines', async () => {
    repository.findUsages.mockResolvedValue({
      totalLines: 5,
      rows: [row({ sort_path: '1' }), row({ sort_path: '2' })],
    });
    const result = await service.searchBedingungUsage({
      formatVersion: 'FV2610',
      bedingung: '931',
      limit: 2,
    });
    expect(result).toMatchObject({ totalLines: 5, returnedLines: 2, truncated: true });
  });
});
