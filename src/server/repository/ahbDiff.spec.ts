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

// Mock row structure matching the new v_ahb_diff view with old_/new_ prefixes
interface MockDiffRow {
  diff_status: string;
  changed_columns: string | null;
  id_path: string;
  sort_path: string;
  path: string | null;
  line_type: string | null;
  // Old version columns
  old_format_version: string | null;
  old_pruefidentifikator: string | null;
  old_segmentgroup_key: string | null;
  old_segment_code: string | null;
  old_data_element: string | null;
  old_qualifier: string | null;
  old_line_ahb_status: string | null;
  old_line_name: string | null;
  old_bedingung: string | null;
  old_bedingungsfehler: string | null;
  // New version columns
  new_format_version: string | null;
  new_pruefidentifikator: string | null;
  new_segmentgroup_key: string | null;
  new_segment_code: string | null;
  new_data_element: string | null;
  new_qualifier: string | null;
  new_line_ahb_status: string | null;
  new_line_name: string | null;
  new_bedingung: string | null;
  new_bedingungsfehler: string | null;
}

// Helper to create a mock row matching the new v_ahb_diff structure
function createMockRow(overrides: Partial<MockDiffRow> = {}): MockDiffRow {
  return {
    diff_status: 'unchanged',
    changed_columns: null,
    id_path: 'path/1',
    sort_path: '001',
    path: 'SG1/SEG',
    line_type: 'segment',
    // Old version columns
    old_format_version: 'FV2410',
    old_pruefidentifikator: '11042',
    old_segmentgroup_key: 'SG1',
    old_segment_code: 'SEG',
    old_data_element: null,
    old_qualifier: null,
    old_line_ahb_status: 'M',
    old_line_name: 'Segment Name',
    old_bedingung: null,
    old_bedingungsfehler: null,
    // New version columns
    new_format_version: 'FV2504',
    new_pruefidentifikator: '11042',
    new_segmentgroup_key: 'SG1',
    new_segment_code: 'SEG',
    new_data_element: null,
    new_qualifier: null,
    new_line_ahb_status: 'M',
    new_line_name: 'Segment Name',
    new_bedingung: null,
    new_bedingungsfehler: null,
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
          old_segmentgroup_key: null,
          old_segment_code: null,
          old_data_element: null,
          old_qualifier: null,
          old_line_ahb_status: null,
          old_line_name: null,
          // New side has data
          new_segmentgroup_key: 'SG2',
          new_segment_code: 'SEG2',
          new_line_ahb_status: 'M',
          new_line_name: 'New Segment',
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
          new_segmentgroup_key: null,
          new_segment_code: null,
          new_data_element: null,
          new_qualifier: null,
          new_line_ahb_status: null,
          new_line_name: null,
          // Old side has data
          old_segmentgroup_key: 'SG3',
          old_segment_code: 'SEG3',
          old_line_ahb_status: 'M',
          old_line_name: 'Old Segment',
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
      // Query params: new_pruefidentifikator, old_pruefidentifikator, new_format_version, old_format_version
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

    it('should map line_ahb_status directly from the view columns', async () => {
      const mockRawRows = [
        createMockRow({
          line_type: 'code',
          new_line_ahb_status: 'X',
          old_line_ahb_status: 'M',
          new_qualifier: 'E01',
          old_qualifier: 'E01',
          new_line_name: 'Code Name',
          old_line_name: 'Code Name',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].new?.line_ahb_status).toBe('X');
      expect(result.lines[0].old?.line_ahb_status).toBe('M');
    });

    it('should parse changed_columns from comma-separated string', async () => {
      const mockRawRows = [
        createMockRow({
          changed_columns: 'line_ahb_status, line_name',
          diff_status: 'modified',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].changed_columns).toEqual(['line_ahb_status', 'line_name']);
    });

    it('should return empty array when changed_columns is null', async () => {
      const mockRawRows = [
        createMockRow({
          changed_columns: null,
          diff_status: 'unchanged',
        }),
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.lines[0].changed_columns).toEqual([]);
    });
  });
});
