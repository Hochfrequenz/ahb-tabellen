import MigService, { buildMigTree } from './mig.service';
import MigRepository, { MigHierarchyRow, MigInfo } from '../repository/mig';
import { NotFoundError, ValidationError } from '../infrastructure/errors';

function row(over: Partial<MigHierarchyRow>): MigHierarchyRow {
  return {
    type: 'segment',
    depth: 0,
    sort_path: '00000-',
    id_path: null,
    line_name: 'Name',
    line_status_std: 'M',
    line_status_specification: 'M',
    segmentgroup_id: null,
    segmentgroup_max_rep_std: null,
    segmentgroup_max_rep_specification: null,
    segment_id: null,
    segment_number: null,
    segment_max_rep_std: null,
    segment_max_rep_specification: null,
    segment_description: null,
    segment_example: null,
    dataelementgroup_id: null,
    dataelementgroup_description: null,
    dataelement_id: null,
    dataelement_description: null,
    dataelement_format_std: null,
    dataelement_format_specification: null,
    code_value: null,
    code_description: null,
    ...over,
  };
}

const UTILMD_S: MigInfo = {
  format: 'UTILMD',
  versionsnummer: 'S2.2',
  gueltig_von: '2026-10-01',
  gueltig_bis: null,
};
const UTILMD_G: MigInfo = { ...UTILMD_S, versionsnummer: 'G1.2' };

describe('buildMigTree', () => {
  it('nests rows by depth in sort_path order and maps per-type fields', () => {
    const tree = buildMigTree([
      row({
        type: 'segment',
        depth: 0,
        sort_path: '00000-',
        segment_id: 'UNH',
        segment_number: '00001',
        segment_max_rep_std: 1,
        segment_max_rep_specification: 1,
        segment_example: "UNH+1'",
      }),
      row({
        type: 'segment_group',
        depth: 0,
        sort_path: '00001-',
        line_name: 'Referenz',
        line_status_std: 'C',
        line_status_specification: 'R',
        segmentgroup_id: 'SG1',
        segmentgroup_max_rep_std: 9,
        segmentgroup_max_rep_specification: 1,
      }),
      row({ type: 'segment', depth: 1, sort_path: '00001-00000-', segment_id: 'RFF' }),
      row({
        type: 'dataelementgroup',
        depth: 2,
        sort_path: '00001-00000-00000-',
        dataelementgroup_id: 'C_C506',
      }),
      row({
        type: 'dataelement',
        depth: 3,
        sort_path: '00001-00000-00000-00000-',
        dataelement_id: 'D_1153',
        dataelement_format_std: 'an..3',
        dataelement_format_specification: 'an..3',
      }),
      row({
        type: 'code',
        depth: 4,
        sort_path: '00001-00000-00000-00000-00000-',
        line_name: 'Nummer der Anfrage',
        code_value: 'AAV',
      }),
      row({ type: 'segment', depth: 0, sort_path: '00002-', segment_id: 'UNT' }),
    ]);

    expect(tree.map(n => n.key)).toEqual(['UNH', 'SG1', 'UNT']);
    expect(tree[0]).toEqual({
      type: 'segment',
      key: 'UNH',
      name: 'Name',
      statusStd: 'M',
      statusSpecification: 'M',
      maxRepStd: 1,
      maxRepSpecification: 1,
      number: '00001',
      example: "UNH+1'",
      children: [],
    });
    const sg1 = tree[1];
    expect(sg1).toMatchObject({
      type: 'segment_group',
      key: 'SG1',
      name: 'Referenz',
      statusStd: 'C',
      statusSpecification: 'R',
      maxRepStd: 9,
      maxRepSpecification: 1,
    });
    const de = sg1.children[0].children[0].children[0];
    expect(de).toMatchObject({ type: 'dataelement', key: 'D_1153', formatStd: 'an..3' });
    expect(de.children).toEqual([
      expect.objectContaining({ type: 'code', key: 'AAV', name: 'Nummer der Anfrage' }),
    ]);
  });

  it('omits empty optional fields', () => {
    const [code] = buildMigTree([row({ type: 'code', depth: 0, code_value: 'Z01' })]);
    expect(Object.keys(code).sort()).toEqual(
      ['children', 'key', 'name', 'statusSpecification', 'statusStd', 'type'].sort()
    );
  });

  it('rejects a row whose depth skips a level', () => {
    expect(() =>
      buildMigTree([row({ depth: 0 }), row({ depth: 2, sort_path: '00000-00000-00000-' })])
    ).toThrow(/depth/);
  });
});

describe('MigService', () => {
  let repository: jest.Mocked<MigRepository>;
  let service: MigService;

  beforeEach(() => {
    repository = {
      listMigs: jest.fn(),
      findMigs: jest.fn(),
      getHierarchy: jest.fn(),
      getAhbLinePaths: jest.fn(),
    } as unknown as jest.Mocked<MigRepository>;
    service = new MigService(repository);
  });

  describe('listMigs', () => {
    it('resolves the format version and maps the MIGs', async () => {
      repository.listMigs.mockResolvedValue([UTILMD_G, UTILMD_S]);
      await expect(service.listMigs('FV2610')).resolves.toEqual([
        { format: 'UTILMD', versionsnummer: 'G1.2', gueltigVon: '2026-10-01', gueltigBis: null },
        { format: 'UTILMD', versionsnummer: 'S2.2', gueltigVon: '2026-10-01', gueltigBis: null },
      ]);
      expect(repository.listMigs).toHaveBeenCalledWith('FV2610');
    });

    it('rejects an unknown format version', async () => {
      await expect(service.listMigs('FV9999')).rejects.toThrow(ValidationError);
    });
  });

  describe('getMigTree', () => {
    it('returns the tree of the only MIG of a format', async () => {
      repository.findMigs.mockResolvedValue([
        { ...UTILMD_S, format: 'MSCONS', versionsnummer: '2.5', primary_key: 'pk' },
      ]);
      repository.getHierarchy.mockResolvedValue([row({ segment_id: 'UNH' })]);
      const result = await service.getMigTree('FV2610', 'mscons');
      expect(repository.findMigs).toHaveBeenCalledWith('FV2610', 'MSCONS');
      expect(repository.getHierarchy).toHaveBeenCalledWith('pk');
      expect(result.meta).toEqual({
        formatVersion: 'FV2610',
        format: 'MSCONS',
        versionsnummer: '2.5',
        gueltigVon: '2026-10-01',
        gueltigBis: null,
      });
      expect(result.nodes.map(n => n.key)).toEqual(['UNH']);
    });

    it('picks the MIG by version when a format has several', async () => {
      repository.findMigs.mockResolvedValue([
        { ...UTILMD_G, primary_key: 'g' },
        { ...UTILMD_S, primary_key: 's' },
      ]);
      repository.getHierarchy.mockResolvedValue([row({ segment_id: 'UNH' })]);
      await service.getMigTree('FV2610', 'UTILMD', 's2.2');
      expect(repository.getHierarchy).toHaveBeenCalledWith('s');
    });

    it('reports a MIG without structure data as not found', async () => {
      repository.findMigs.mockResolvedValue([{ ...UTILMD_S, primary_key: 's' }]);
      repository.getHierarchy.mockResolvedValue([]);
      await expect(service.getMigTree('FV2610', 'UTILMD', 'S2.2')).rejects.toThrow(NotFoundError);
    });

    it('asks for a version when a format has several MIGs', async () => {
      repository.findMigs.mockResolvedValue([
        { ...UTILMD_G, primary_key: 'g' },
        { ...UTILMD_S, primary_key: 's' },
      ]);
      await expect(service.getMigTree('FV2610', 'UTILMD')).rejects.toThrow(/G1\.2, S2\.2/);
      expect(repository.getHierarchy).not.toHaveBeenCalled();
    });

    it('reports a missing MIG or version as not found', async () => {
      repository.findMigs.mockResolvedValue([]);
      await expect(service.getMigTree('FV2610', 'MSCONS')).rejects.toThrow(NotFoundError);
      repository.findMigs.mockResolvedValue([{ ...UTILMD_S, primary_key: 's' }]);
      await expect(service.getMigTree('FV2610', 'UTILMD', 'X9')).rejects.toThrow(NotFoundError);
    });

    it('rejects an unknown format', async () => {
      await expect(service.getMigTree('FV2610', 'toString')).rejects.toThrow(ValidationError);
      expect(repository.findMigs).not.toHaveBeenCalled();
    });
  });

  describe('getAhbMigLinks', () => {
    // Strom MIG: SG4+24 > IDE; Gas MIG: SG4 > IDE and SG4 > DTM.
    const strom = [
      row({ type: 'segment_group', depth: 0, id_path: 'SG4+24>', segmentgroup_id: 'SG4' }),
      row({ type: 'segment', depth: 1, id_path: 'SG4+24>IDE>', segment_id: 'IDE' }),
    ];
    const gas = [
      row({ type: 'segment_group', depth: 0, id_path: 'SG4>', segmentgroup_id: 'SG4' }),
      row({ type: 'segment', depth: 1, id_path: 'SG4>IDE>', segment_id: 'IDE' }),
      row({
        type: 'segment',
        depth: 1,
        id_path: 'SG4>DTM+92>',
        segment_id: 'DTM',
        segment_max_rep_specification: 1,
      }),
    ];

    beforeEach(() => {
      repository.findMigs.mockResolvedValue([
        { ...UTILMD_G, primary_key: 'g' },
        { ...UTILMD_S, primary_key: 's' },
      ]);
      repository.getHierarchy.mockImplementation(async pk => (pk === 'g' ? gas : strom));
    });

    it('links each AHB line to its element in the MIG that matches best', async () => {
      repository.getAhbLinePaths.mockResolvedValue([
        { id: 'l1', id_path: 'SG4>', format: 'UTILMD' },
        { id: 'l2', id_path: 'SG4>DTM+92>', format: 'UTILMD' },
        { id: 'l3', id_path: null, format: 'UTILMD' },
      ]);
      const result = await service.getAhbMigLinks('FV2610', '44001');
      expect(repository.getAhbLinePaths).toHaveBeenCalledWith('FV2610', '44001');
      expect(repository.findMigs).toHaveBeenCalledWith('FV2610', 'UTILMD');
      expect(result.mig).toMatchObject({ formatVersion: 'FV2610', versionsnummer: 'G1.2' });
      expect(result.links).toEqual([
        expect.objectContaining({ guid: 'l1', node: '0', exact: true }),
        {
          guid: 'l2',
          node: '0-1',
          exact: true,
          element: expect.objectContaining({ type: 'segment', key: 'DTM', maxRepSpecification: 1 }),
        },
      ]);
      expect(result.links[1].element).not.toHaveProperty('children');
    });

    it('chooses the MIG whose qualifiers agree when both place every line', async () => {
      // Both MIGs have an SG4; only the Strom MIG names the AHB's qualifier 24.
      repository.getAhbLinePaths.mockResolvedValue([
        { id: 'l1', id_path: 'SG4+24>IDE>', format: 'UTILMD' },
      ]);
      const result = await service.getAhbMigLinks('FV2610', '55001');
      expect(result.mig.versionsnummer).toBe('S2.2');
    });

    it('builds each MIG tree once across requests', async () => {
      repository.getAhbLinePaths.mockResolvedValue([
        { id: 'l1', id_path: 'SG4>', format: 'UTILMD' },
      ]);
      await service.getAhbMigLinks('FV2610', '44001');
      await service.getAhbMigLinks('FV2610', '44002');
      expect(repository.getHierarchy).toHaveBeenCalledTimes(2); // g and s, once each
    });

    it('skips a MIG without structure data, and reports none left as not found', async () => {
      repository.getAhbLinePaths.mockResolvedValue([
        { id: 'l1', id_path: 'SG4>', format: 'UTILMD' },
      ]);
      repository.getHierarchy.mockImplementation(async pk => (pk === 'g' ? [] : strom));
      const result = await service.getAhbMigLinks('FV2610', '55001');
      expect(result.mig.versionsnummer).toBe('S2.2');

      repository.getHierarchy.mockResolvedValue([]);
      await expect(new MigService(repository).getAhbMigLinks('FV2610', '55001')).rejects.toThrow(
        NotFoundError
      );
    });

    it('rejects an invalid Prüfidentifikator', async () => {
      await expect(service.getAhbMigLinks('FV2610', '1')).rejects.toThrow(ValidationError);
    });

    it('reports an unknown Prüfidentifikator or a missing MIG as not found', async () => {
      repository.getAhbLinePaths.mockResolvedValue([]);
      await expect(service.getAhbMigLinks('FV2610', '44001')).rejects.toThrow(NotFoundError);
      repository.getAhbLinePaths.mockResolvedValue([{ id: 'l', id_path: 'X>', format: 'UTILMD' }]);
      repository.findMigs.mockResolvedValue([]);
      await expect(service.getAhbMigLinks('FV2610', '44001')).rejects.toThrow(/No MIG/);
    });
  });
});
