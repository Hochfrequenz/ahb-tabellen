import { Request, Response } from 'express';
import FormateController from './formate';
import MetadataService from '../service/metadata.service';

jest.mock('../service/metadata.service');

describe('FormateController', () => {
  let formateController: FormateController;
  let mockService: jest.Mocked<MetadataService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockSend: jest.Mock;
  let mockStatus: jest.Mock;
  let mockSetHeader: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockSetHeader = jest.fn().mockReturnThis();

    mockReq = {};
    mockRes = {
      status: mockStatus,
      send: mockSend,
      setHeader: mockSetHeader,
    };

    mockService = {
      listFormate: jest.fn(),
    } as unknown as jest.Mocked<MetadataService>;

    formateController = new FormateController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of unique formats', async () => {
    const mockFormats = ['CONTRL', 'MSCONS', 'ORDERS', 'UTILMD'];
    mockService.listFormate.mockResolvedValue(mockFormats);

    await formateController.list(mockReq as Request, mockRes as Response);

    expect(mockService.listFormate).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockSend).toHaveBeenCalledWith(mockFormats);
  });

  it('should handle empty format list', async () => {
    mockService.listFormate.mockResolvedValue([]);

    await formateController.list(mockReq as Request, mockRes as Response);

    expect(mockService.listFormate).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockSend).toHaveBeenCalledWith([]);
  });

  it('should propagate service errors', async () => {
    const error = new Error('Database connection failed');
    mockService.listFormate.mockRejectedValue(error);

    await expect(formateController.list(mockReq as Request, mockRes as Response)).rejects.toThrow(
      'Database connection failed'
    );

    expect(mockService.listFormate).toHaveBeenCalledTimes(1);
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('should create its own service instance when none is provided', () => {
    expect(new FormateController()).toBeInstanceOf(FormateController);
  });
});
