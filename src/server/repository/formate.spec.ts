import { AppDataSource } from '../infrastructure/database';
import FormateRepository from './formate';

jest.mock('../infrastructure/database');

describe('FormateRepository', () => {
  let formateRepository: FormateRepository;
  let mockQueryBuilder: {
    select: jest.Mock;
    orderBy: jest.Mock;
    getRawMany: jest.Mock;
  };
  let mockRepository: {
    createQueryBuilder: jest.Mock;
  };

  beforeEach(() => {
    formateRepository = new FormateRepository();

    // Mock the query builder chain
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    // Mock the repository
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    // Mock AppDataSource
    (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockRepository);
    Object.defineProperty(AppDataSource, 'isInitialized', { get: () => true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of unique formats', async () => {
    const mockFormats = [
      { format: 'CONTRL' },
      { format: 'MSCONS' },
      { format: 'ORDERS' },
      { format: 'UTILMD' },
    ];
    mockQueryBuilder.getRawMany.mockResolvedValue(mockFormats);

    const result = await formateRepository.list();

    expect(AppDataSource.getRepository).toHaveBeenCalled();
    expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('ahb');
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('DISTINCT ahb.format', 'format');
    expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('ahb.format');
    expect(mockQueryBuilder.getRawMany).toHaveBeenCalled();
    expect(result).toEqual(['CONTRL', 'MSCONS', 'ORDERS', 'UTILMD']);
  });

  it('should handle empty result set', async () => {
    mockQueryBuilder.getRawMany.mockResolvedValue([]);

    const result = await formateRepository.list();

    expect(result).toEqual([]);
  });

  it('should initialize database if not already initialized', async () => {
    Object.defineProperty(AppDataSource, 'isInitialized', { get: () => false });
    (AppDataSource.initialize as jest.Mock) = jest.fn().mockResolvedValue(undefined);
    mockQueryBuilder.getRawMany.mockResolvedValue([{ format: 'UTILMD' }]);

    await formateRepository.list();

    expect(AppDataSource.initialize).toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const error = new Error('Database connection failed');
    mockQueryBuilder.getRawMany.mockRejectedValue(error);

    await expect(formateRepository.list()).rejects.toThrow('Database connection failed');
  });
});
