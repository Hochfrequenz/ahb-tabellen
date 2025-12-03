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

describe('AhbDiffRepository', () => {
  let repository: AhbDiffRepository;

  beforeEach(() => {
    repository = new AhbDiffRepository();
    jest.clearAllMocks();
  });

  describe('getDiff', () => {
    it('should return diff result with transformed lines', async () => {
      const mockRawRows = [
        {
          diff_status: 'unchanged',
          id_path: 'path/1',
          sort_path: '001',
          old_segmentgroup_key: 'SG1',
          old_segment_code: 'SEG',
          old_data_element: 'DE1',
          old_qualifier: 'Q1',
          old_line_ahb_status: 'M',
          old_line_name: 'Name1',
          old_line_type: 'type1',
          old_bedingung: 'B1',
          new_segmentgroup_key: 'SG1',
          new_segment_code: 'SEG',
          new_data_element: 'DE1',
          new_qualifier: 'Q1',
          new_line_ahb_status: 'M',
          new_line_name: 'Name1',
          new_line_type: 'type1',
          new_bedingung: 'B1',
        },
      ];
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
        {
          diff_status: 'added',
          id_path: 'path/new',
          sort_path: '002',
          old_segmentgroup_key: null,
          old_segment_code: null,
          old_data_element: null,
          old_qualifier: null,
          old_line_ahb_status: null,
          old_line_name: null,
          old_line_type: null,
          old_bedingung: null,
          new_segmentgroup_key: 'SG2',
          new_segment_code: 'SEG2',
          new_data_element: 'DE2',
          new_qualifier: 'Q2',
          new_line_ahb_status: 'M',
          new_line_name: 'New Name',
          new_line_type: 'type2',
          new_bedingung: 'B2',
        },
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
        {
          diff_status: 'deleted',
          id_path: 'path/old',
          sort_path: '003',
          old_segmentgroup_key: 'SG3',
          old_segment_code: 'SEG3',
          old_data_element: 'DE3',
          old_qualifier: 'Q3',
          old_line_ahb_status: 'M',
          old_line_name: 'Old Name',
          old_line_type: 'type3',
          old_bedingung: 'B3',
          new_segmentgroup_key: null,
          new_segment_code: null,
          new_data_element: null,
          new_qualifier: null,
          new_line_ahb_status: null,
          new_line_name: null,
          new_line_type: null,
          new_bedingung: null,
        },
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
      const mockRawRows = [
        {
          diff_status: 'unchanged',
          id_path: 'path/1',
          sort_path: '001',
          old_segmentgroup_key: 'SG1',
          old_segment_code: null,
          old_data_element: null,
          old_qualifier: null,
          old_line_ahb_status: null,
          old_line_name: null,
          old_line_type: null,
          old_bedingung: null,
          new_segmentgroup_key: 'SG1',
          new_segment_code: null,
          new_data_element: null,
          new_qualifier: null,
          new_line_ahb_status: null,
          new_line_name: null,
          new_line_type: null,
          new_bedingung: null,
        },
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      await repository.getDiff('11042', 'FV2504', 'FV2410');

      // First call is the main diff query
      expect(AppDataSource.query).toHaveBeenCalledTimes(2);
      const firstCallArgs = (AppDataSource.query as jest.Mock).mock.calls[0];
      expect(firstCallArgs[1]).toEqual(['11042', 'FV2410', '11042', 'FV2504']);

      // Second call is the description query
      const secondCallArgs = (AppDataSource.query as jest.Mock).mock.calls[1];
      expect(secondCallArgs[1]).toEqual(['11042', 'FV2504', 'FV2410']);
    });

    it('should handle missing descriptions gracefully', async () => {
      const mockRawRows = [
        {
          diff_status: 'unchanged',
          id_path: 'path/1',
          sort_path: '001',
          old_segmentgroup_key: 'SG1',
          old_segment_code: null,
          old_data_element: null,
          old_qualifier: null,
          old_line_ahb_status: null,
          old_line_name: null,
          old_line_type: null,
          old_bedingung: null,
          new_segmentgroup_key: 'SG1',
          new_segment_code: null,
          new_data_element: null,
          new_qualifier: null,
          new_line_ahb_status: null,
          new_line_name: null,
          new_line_type: null,
          new_bedingung: null,
        },
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]); // No descriptions

      const result = await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(result.meta.description_a).toBeUndefined();
      expect(result.meta.description_b).toBeUndefined();
    });

    it('should initialize database if not initialized', async () => {
      (AppDataSource as { isInitialized: boolean }).isInitialized = false;

      const mockRawRows = [
        {
          diff_status: 'unchanged',
          id_path: 'path/1',
          sort_path: '001',
          old_segmentgroup_key: 'SG1',
          old_segment_code: null,
          old_data_element: null,
          old_qualifier: null,
          old_line_ahb_status: null,
          old_line_name: null,
          old_line_type: null,
          old_bedingung: null,
          new_segmentgroup_key: 'SG1',
          new_segment_code: null,
          new_data_element: null,
          new_qualifier: null,
          new_line_ahb_status: null,
          new_line_name: null,
          new_line_type: null,
          new_bedingung: null,
        },
      ];

      (AppDataSource.query as jest.Mock)
        .mockResolvedValueOnce(mockRawRows)
        .mockResolvedValueOnce([]);

      await repository.getDiff('11042', 'FV2504', 'FV2410');

      expect(AppDataSource.initialize).toHaveBeenCalled();

      // Reset for other tests
      (AppDataSource as { isInitialized: boolean }).isInitialized = true;
    });
  });
});
