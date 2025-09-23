import { Request, Response } from 'express';
import { AppDataSource } from '../infrastructure/database';
import FormateController from './formate';
import FormateRepository from '../repository/formate';

jest.mock('../infrastructure/database');
jest.mock('../repository/formate');

describe('FormateController', () => {
  let formateController: FormateController;
  let mockFormateRepository: jest.Mocked<FormateRepository>;
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

    // Create a mock repository
    mockFormateRepository = {
      list: jest.fn(),
    } as any;

    formateController = new FormateController(mockFormateRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of unique formats', async () => {
    const mockFormats = ['CONTRL', 'MSCONS', 'ORDERS', 'UTILMD'];
    mockFormateRepository.list.mockResolvedValue(mockFormats);

    await formateController.list(mockReq as Request, mockRes as Response);

    expect(mockFormateRepository.list).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockSend).toHaveBeenCalledWith(mockFormats);
  });

  it('should handle empty format list', async () => {
    const mockFormats: string[] = [];
    mockFormateRepository.list.mockResolvedValue(mockFormats);

    await formateController.list(mockReq as Request, mockRes as Response);

    expect(mockFormateRepository.list).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockSetHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(mockSend).toHaveBeenCalledWith([]);
  });

  it('should handle repository errors', async () => {
    const error = new Error('Database connection failed');
    mockFormateRepository.list.mockRejectedValue(error);

    await expect(formateController.list(mockReq as Request, mockRes as Response)).rejects.toThrow(
      'Database connection failed'
    );

    expect(mockFormateRepository.list).toHaveBeenCalledTimes(1);
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('should create its own repository instance when none is provided', () => {
    const controller = new FormateController();
    expect(controller).toBeInstanceOf(FormateController);
  });
});
