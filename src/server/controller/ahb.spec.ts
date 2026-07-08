import { EdifactFormatVersion } from '@hochfrequenz/efoli';
import { Request, Response, NextFunction } from 'express';
import AHBController from './ahb';
import AhbService from '../service/ahb.service';
import { FileType } from '../repository/ahb';

jest.mock('../service/ahb.service');

describe('AHBController', () => {
  let controller: AHBController;
  let mockService: jest.Mocked<AhbService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: jest.MockedFunction<NextFunction>;
  let mockJson: jest.Mock;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSetHeader: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockSend = jest.fn();
    mockSetHeader = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ setHeader: mockSetHeader });

    mockReq = { params: {}, query: {} };
    mockRes = { status: mockStatus, setHeader: mockSetHeader, json: mockJson, send: mockSend };
    mockNext = jest.fn();

    mockService = { getAhb: jest.fn() } as unknown as jest.Mocked<AhbService>;

    controller = new AHBController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('defaults to json and serializes via res.json with the JSON content type', async () => {
    const ahb = { meta: {}, lines: [] } as never;
    mockService.getAhb.mockResolvedValue({
      fileType: FileType.JSON,
      formatVersion: EdifactFormatVersion.FV2410,
      content: ahb,
    });
    mockReq.params = { pruefi: '11001', formatVersion: 'FV2410' };

    await controller.get(mockReq as Request, mockRes as Response, mockNext);

    expect(mockService.getAhb).toHaveBeenCalledWith('11001', 'FV2410', 'json');
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=AHB_FV2410_11001.json'
    );
    expect(mockJson).toHaveBeenCalledWith(ahb);
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('serializes binary formats via res.send with the matching content type and filename', async () => {
    const buffer = Buffer.from('xlsx');
    mockService.getAhb.mockResolvedValue({
      fileType: FileType.XLSX,
      formatVersion: EdifactFormatVersion.FV2410,
      content: buffer,
    });
    mockReq.params = { pruefi: '11001', formatVersion: 'FV2410' };
    mockReq.query = { format: 'xlsx' };

    await controller.get(mockReq as Request, mockRes as Response, mockNext);

    expect(mockService.getAhb).toHaveBeenCalledWith('11001', 'FV2410', 'xlsx');
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=AHB_FV2410_11001.xlsx'
    );
    expect(mockSend).toHaveBeenCalledWith(buffer);
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('uses the resolved format version (not the raw date/keyword) in the download filename', async () => {
    const ahb = { meta: {}, lines: [] } as never;
    mockService.getAhb.mockResolvedValue({
      fileType: FileType.JSON,
      formatVersion: EdifactFormatVersion.FV2404,
      content: ahb,
    });
    mockReq.params = { pruefi: '11001', formatVersion: '2024-06-01' };

    await controller.get(mockReq as Request, mockRes as Response, mockNext);

    expect(mockService.getAhb).toHaveBeenCalledWith('11001', '2024-06-01', 'json');
    expect(mockSetHeader).toHaveBeenCalledWith(
      'Content-Disposition',
      'attachment; filename=AHB_FV2404_11001.json'
    );
  });

  it('forwards service errors to next()', async () => {
    const error = new Error('boom');
    mockService.getAhb.mockRejectedValue(error);
    mockReq.params = { pruefi: '11001', formatVersion: 'FV2410' };

    await controller.get(mockReq as Request, mockRes as Response, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
    expect(mockStatus).not.toHaveBeenCalled();
  });

  it('creates its own service instance when none is provided', () => {
    expect(new AHBController()).toBeInstanceOf(AHBController);
  });
});
