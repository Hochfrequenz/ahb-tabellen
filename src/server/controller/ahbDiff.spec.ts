import { Request, Response, NextFunction } from 'express';
import AhbDiffController from './ahbDiff';
import AhbDiffService from '../service/ahbDiff.service';

jest.mock('../service/ahbDiff.service');

describe('AhbDiffController', () => {
  let controller: AhbDiffController;
  let mockService: jest.Mocked<AhbDiffService>;
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

    mockReq = { params: {}, query: {} };
    mockRes = { status: mockStatus, json: mockJson, setHeader: mockSetHeader };
    mockNext = jest.fn();

    mockService = {
      getDiff: jest.fn(),
      getSummary: jest.fn(),
      getPruefiDiff: jest.fn(),
    } as unknown as jest.Mocked<AhbDiffService>;

    controller = new AhbDiffController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('delegates to the service and serializes the diff result', async () => {
      const mockResult = {
        lines: [],
        meta: {
          pruefidentifikator: '11042',
          format_version_new: 'FV2504',
          format_version_old: 'FV2410',
        },
      };
      mockService.getDiff.mockResolvedValue(mockResult);

      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-new': 'FV2504', 'format-version-old': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.getDiff).toHaveBeenCalledWith('11042', 'FV2504', 'FV2410');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockJson).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('forwards service errors to next()', async () => {
      const error = new Error('boom');
      mockService.getDiff.mockRejectedValue(error);

      mockReq.params = { pruefi: '11042' };
      mockReq.query = { 'format-version-new': 'FV2504', 'format-version-old': 'FV2410' };

      await controller.get(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getSummary', () => {
    it('delegates to the service and serializes the summary', async () => {
      const summary = { '11042': { added: 1, deleted: 0, modified: 2 } };
      mockService.getSummary.mockResolvedValue(summary);

      mockReq.query = { 'format-version-new': 'FV2504', 'format-version-old': 'FV2410' };

      await controller.getSummary(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.getSummary).toHaveBeenCalledWith('FV2504', 'FV2410');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(summary);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('forwards service errors to next()', async () => {
      const error = new Error('boom');
      mockService.getSummary.mockRejectedValue(error);

      mockReq.query = { 'format-version-new': 'FV2504', 'format-version-old': 'FV2410' };

      await controller.getSummary(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getPruefiDiff', () => {
    it('delegates to the service and serializes the diff result', async () => {
      const mockResult = {
        lines: [],
        meta: {
          format_version: 'FV2410',
          pruefidentifikator_old: '13002',
          pruefidentifikator_new: '13003',
        },
      };
      mockService.getPruefiDiff.mockResolvedValue(mockResult);

      mockReq.params = { pruefiOld: '13002', pruefiNew: '13003' };
      mockReq.query = { 'format-version': 'FV2410' };

      await controller.getPruefiDiff(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.getPruefiDiff).toHaveBeenCalledWith('FV2410', '13002', '13003');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
      expect(mockJson).toHaveBeenCalledWith(mockResult);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('forwards service errors to next()', async () => {
      const error = new Error('boom');
      mockService.getPruefiDiff.mockRejectedValue(error);

      mockReq.params = { pruefiOld: '13002', pruefiNew: '13003' };
      mockReq.query = { 'format-version': 'FV2410' };

      await controller.getPruefiDiff(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  it('creates its own service instance when none is provided', () => {
    expect(new AhbDiffController()).toBeInstanceOf(AhbDiffController);
  });
});
