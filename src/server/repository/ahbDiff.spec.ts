import AhbDiffRepository from './ahbDiff';
import { AppDataSource } from '../infrastructure/database';
import { AppError } from '../infrastructure/errors';

jest.mock('../infrastructure/database', () => ({
  AppDataSource: {
    isInitialized: true,
    initialize: jest.fn(),
    query: jest.fn(),
  },
}));

// Mock row structure matching the new v_ahb_diff view
interface MockDiffRow {
  diff_status: string;
  id_path: string;
  sort_path: string;
  type: string | null;
  segmentgroup_name_a: string | null;
  segmentgroup_ahb_status_a: string | null;
  segment_id_a: string | null;
  segment_name_a: string | null;
  segment_ahb_status_a: string | null;
  dataelementgroup_id_a: string | null;
  dataelementgroup_name_a: string | null;
  dataelement_id_a: string | null;
  dataelement_name_a: string | null;
  dataelement_ahb_status_a: string | null;
  code_value_a: string | null;
  code_name_a: string | null;
  code_ahb_status_a: string | null;
  segmentgroup_name_b: string | null;
  segmentgroup_ahb_status_b: string | null;
  segment_id_b: string | null;
  segment_name_b: string | null;
  segment_ahb_status_b: string | null;
  dataelementgroup_id_b: string | null;
  dataelementgroup_name_b: string | null;
  dataelement_id_b: string | null;
  dataelement_name_b: string | null;
  dataelement_ahb_status_b: string | null;
  code_value_b: string | null;
  code_name_b: string | null;
  code_ahb_status_b: string | null;
}

// Helper to create a mock row matching the new v_ahb_diff structure
function createMockRow(overrides: Partial<MockDiffRow> = {}): MockDiffRow {
  return {
    diff_status: 'unchanged',
    id_path: 'path/1',
    sort_path: '001',
    type: 'segment',
    // Version A (new) columns
    segmentgroup_name_a: 'SG1',
    segmentgroup_ahb_status_a: null,
    segment_id_a: 'SEG',
    segment_name_a: 'Segment Name',
    segment_ahb_status_a: 'M',
    dataelementgroup_id_a: null,
    dataelementgroup_name_a: null,
    dataelement_id_a: null,
    dataelement_name_a: null,
    dataelement_ahb_status_a: null,
    code_value_a: null,
    code_name_a: null,
    code_ahb_status_a: null,
    // Version B (old) columns
    segmentgroup_name_b: 'SG1',
    segmentgroup_ahb_status_b: null,
    segment_id_b: 'SEG',
    segment_name_b: 'Segment Name',
    segment_ahb_status_b: 'M',
    dataelementgroup_id_b: null,
    dataelementgroup_name_b: null,
    dataelement_id_b: null,
    dataelement_name_b: null,
    dataelement_ahb_status_b: null,
    code_value_b: null,
    code_name_b: null,
    code_ahb_status_b: null,
    ...overrides,
  };
}

describe('AhbDiffRepository', () => {
  let repository: AhbDiffRepository;

  beforeEach(() => {
    repository = new AhbDiffRepository();
    jest.clearAllMocks();
  });

  describe('getDiff', () => {
    it('should return diff result with transformed lines', async () => {
      const mockRawRows = [createMockRow()];
      const mockDescriptionRows = [
        { description: 'Desc A', format_version: 'FV2504' },
        { description: 'Desc B', format_version: 'FV2410' },
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce(mockDescriptionRows);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines).toHaveLength(1);
      expect(result.lines[0].diff_status).toBe('unchanged');
      expect(result.lines[0].old).not.toBeNull();
      expect(result.lines[0].new).not.toBeNull();
      expect(result.meta.pruefidentifikator).toBe('11042');
      expect(result.meta.format_version_a).toBe('FV2504');
      expect(result.meta.format_version_b).toBe('FV2410');
      expect(result.meta.description_a).toBe('Desc A');
      expect(result.meta.description_b).toBe('Desc B');
    });

    it('should handle added rows (no old data)', async () => {
      const mockRawRows = [
        createMockRow({
          diff_status: 'added',
          id_path: 'path/new',
          sort_path: '002',
          // Old side is null
          segmentgroup_name_b: null,
          segment_id_b: null,
          segment_name_b: null,
          segment_ahb_status_b: null,
          // New side has data
          segmentgroup_name_a: 'SG2',
          segment_id_a: 'SEG2',
          segment_name_a: 'New Segment',
          segment_ahb_status_a: 'M',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].diff_status).toBe('added');
      expect(result.lines[0].old).toBeNull();
      expect(result.lines[0].new).not.toBeNull();
      expect(result.lines[0].new?.segmentgroup_key).toBe('SG2');
    });

    it('should handle deleted rows (no new data)', async () => {
      const mockRawRows = [
        createMockRow({
          diff_status: 'deleted',
          id_path: 'path/old',
          sort_path: '003',
          // New side is null
          segmentgroup_name_a: null,
          segment_id_a: null,
          segment_name_a: null,
          segment_ahb_status_a: null,
          // Old side has data
          segmentgroup_name_b: 'SG3',
          segment_id_b: 'SEG3',
          segment_name_b: 'Old Segment',
          segment_ahb_status_b: 'M',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].diff_status).toBe('deleted');
      expect(result.lines[0].old).not.toBeNull();
      expect(result.lines[0].old?.segmentgroup_key).toBe('SG3');
      expect(result.lines[0].new).toBeNull();
    });

    it('should throw NotFoundError when no rows returned', async () => {
      (AppDataSource.query as jest.Mock).mockResolvedValue([]);

      await expect(repository.getDiff('99999', 'FV2504', 'FV2410')).rejects.toThrow(AppError);
      await expect(repository.getDiff('99999', 'FV2504', 'FV2410')).rejects.toThrow(
        /No diff found for pruefi 99999/
      );
    });

    it('should pass correct parameters to the query', async () => {
      const mockRawRows = [createMockRow()];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      await repository.getDiff('11042', 'FV2504', 'FV2410');

      // First call is the main diff query
      expect(AppDataSource.query).toHaveBeenCalledTimes(2);
      const firstCallArgs = (AppDataSource.query as jest.Mock).mock.calls[0];
      // New query params: pruefi_a, pruefi_b, format_version_a, format_version_b
      expect(firstCallArgs[1]).toEqual(['11042', '11042', 'FV2504', 'FV2410']);

      // Second call is the description query
      const secondCallArgs = (AppDataSource.query as jest.Mock).mock.calls[1];
      expect(secondCallArgs[1]).toEqual(['11042', 'FV2504', 'FV2410']);
    });

    it('should handle missing descriptions gracefully', async () => {
      const mockRawRows = [createMockRow()];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]); // No descriptions

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.meta.description_a).toBeUndefined();
      expect(result.meta.description_b).toBeUndefined();
    });

    it('should initialize database if not initialized', async () => {
      (AppDataSource as { isInitialized: boolean }).isInitialized = false;

      const mockRawRows = [createMockRow()];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(AppDataSource.initialize).toHaveBeenCalled();

      // Reset for other tests
      (AppDataSource as { isInitialized: boolean }).isInitialized = true;
    });

    it('should map line_ahb_status from the appropriate field based on type', async () => {
      const mockRawRows = [
        createMockRow({
          type: 'code',
          code_ahb_status_a: 'X',
          code_ahb_status_b: 'M',
          code_value_a: 'E01',
          code_value_b: 'E01',
          code_name_a: 'Code Name',
          code_name_b: 'Code Name',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].new?.line_ahb_status).toBe('X');
      expect(result.lines[0].old?.line_ahb_status).toBe('M');
    });
  });
});
