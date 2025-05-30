import { Request, Response } from 'express';
import { AppDataSource } from '../infrastructure/database';
import HealthController from './health';
import { AppError } from '../infrastructure/errors';

jest.mock('../infrastructure/database');

describe('HealthController', () => {
  let healthController: HealthController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    process.env['OH_DEAR_HEALTH_CHECK_SECRET'] = 'test-secret';
    process.env['AHB_CONTAINER_NAME'] = 'test-container';

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockReq = {
      header: jest.fn().mockReturnValue('test-secret'),
    };
    mockRes = {
      status: mockStatus,
      json: mockJson,
    };

    healthController = new HealthController();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env['OH_DEAR_HEALTH_CHECK_SECRET'];
    delete process.env['AHB_CONTAINER_NAME'];
  });

  it('should return 401 if health check secret is invalid', async () => {
    (mockReq.header as jest.Mock).mockReturnValue('wrong-secret');

    await healthController.check(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid health check secret' });
  });

  it('should throw error if OH_DEAR_HEALTH_CHECK_SECRET is not set', async () => {
    delete process.env['OH_DEAR_HEALTH_CHECK_SECRET'];

    await expect(healthController.check(mockReq as Request, mockRes as Response)).rejects.toThrow(
      'OH_DEAR_HEALTH_CHECK_SECRET environment variable is not set'
    );

    await expect(healthController.check(mockReq as Request, mockRes as Response)).rejects.toThrow(
      AppError
    );
  });

  it('should return 200 when all checks pass', async () => {
    // Mock database checks
    Object.defineProperty(AppDataSource, 'isInitialized', { get: () => true });
    (AppDataSource.query as jest.Mock) = jest
      .fn()
      .mockResolvedValueOnce([{ count: 1 }]) // First query mock
      .mockResolvedValueOnce([{ count: 10 }]) // Second query mock
      .mockResolvedValueOnce([{ count: 20 }]); // Third query mock

    await healthController.check(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        checkResults: expect.arrayContaining([
          expect.objectContaining({
            name: 'SQLiteConnection',
            status: 'ok',
          }),
        ]),
      })
    );
  });

  it('should return 500 when database check fails', async () => {
    // Mock database failure
    Object.defineProperty(AppDataSource, 'isInitialized', { get: () => true });
    (AppDataSource.query as jest.Mock) = jest.fn().mockRejectedValue(new Error('DB Error'));

    await healthController.check(mockReq as Request, mockRes as Response);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith(
      expect.objectContaining({
        checkResults: expect.arrayContaining([
          expect.objectContaining({
            name: 'SQLiteConnection',
            status: 'failed',
          }),
        ]),
      })
    );
  });
});
