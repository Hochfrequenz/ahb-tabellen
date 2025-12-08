import { Request, Response, NextFunction } from 'express';
import AhbDiffController from './ahbDiff';
import AhbDiffRepository from '../repository/ahbDiff';
import { ValidationError } from '../infrastructure/errors';

jest.mock('../infrastructure/database');
jest.mock('../repository/ahbDiff');

describe('AhbDiffController', () => {
  let controller: AhbDiffController;
  let mockRepository: jest.Mocked<AhbDiffRepository>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSetHeader: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockSetHeader = jest.fn().mockReturnThis();

    mockReq = {
      params: {},
      query: {},
    };
    mockRes = {
      status: mockStatus,
      json: mockJson,
      setHeader: mockSetHeader,
    };
    mockNext = jest.fn();

    mockRepository = {
      getDiff: jest.fn(),
    } as unknown as jest.Mocked<AhbDiffRepository>;

    controller = new AhbDiffController(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('input validation', () => {
    it('should reject invalid pruefi format (not 5 digits)', async () => {
      mockReq.params = { pruefi: '1234' };
      mockReq.query = { 'format-version-a': 'FV2504', 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('Invalid Prüfidentifikator format');
    });

    it('should reject invalid pruefi format (letters)', async () => {
      mockReq.params = { pruefi: 'abcde' };
      mockReq.query = { 'format-version-a': 'FV2504', 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
    });

    it('should reject missing format-version-a', async () => {
      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('format-version-a');
    });

    it('should reject missing format-version-b', async () => {
      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-a': 'FV2504' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('format-version-b');
    });

    it('should reject invalid format-version-a pattern', async () => {
      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-a': 'invalid', 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('format-version-a');
    });

    it('should reject invalid format-version-b pattern', async () => {
      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-a': 'FV2504', 'format-version-b': '2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
      const error = mockNext.mock.calls[0][0] as unknown as ValidationError;
      expect(error.name).toBe('ValidationError');
      expect(error.message).toContain('format-version-b');
    });
  });

  describe('successful requests', () => {
    it('should return diff result with valid parameters', async () => {
      const mockResult = {
        lines: [
          {
            diff_status: 'unchanged',
            id_path: 'path/1',
            sort_path: '001',
            changed_columns: [],
            old: { segmentgroup_key: 'SG1' },
            new: { segmentgroup_key: 'SG1' },
          },
        ],
        meta: {
          pruefidentifikator: '11042',
          format_version_a: 'FV2504',
          format_version_b: 'FV2410',
        },
      };
      mockRepository.getDiff.mockResolvedValue(mockResult);

      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-a': 'FV2504', 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRepository.getDiff).toHaveBeenCalledWith('11042', 'FV2504', 'FV2410');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockJson).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should pass repository errors to next middleware', async () => {
      const error = new Error('Database error');
      mockRepository.getDiff.mockRejectedValue(error);

      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-a': 'FV2504', 'format-version-b': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  it('should create its own repository instance when none is provided', () => {
    const controllerWithDefaultRepo = new AhbDiffController();
    expect(controllerWithDefaultRepo).toBeInstanceOf(AhbDiffController);
  });
});
