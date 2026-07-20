import { AppDataSource } from '../infrastructure/database';
import { NotFoundError } from '../infrastructure/errors';
import FormatVersionRepository from './formatVersion';

jest.mock('../infrastructure/database');

describe('FormatVersionRepository', () => {
  let formatVersionRepository: FormatVersionRepository;
  let mockQueryBuilder: {
    select: jest.Mock;
    where: jest.Mock;
    orderBy: jest.Mock;
    getRawMany: jest.Mock;
  };
  let mockRepository: {
    createQueryBuilder: jest.Mock;
  };

  beforeEach(() => {
    formatVersionRepository = new FormatVersionRepository();

    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn(),
    };

    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    (AppDataSource.getRepository as jest.Mock) = jest.fn().mockReturnValue(mockRepository);
    (AppDataSource.query as jest.Mock) = jest.fn().mockResolvedValue([]);
    Object.defineProperty(AppDataSource, 'isInitialized', { get: () => true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listPruefisByFormatVersion', () => {
    it('should aggregate distinct roles per pruefi from json_each rows', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { pruefidentifikator: '11001', description: 'Anmeldung' },
        { pruefidentifikator: '11002', description: 'Abmeldung' },
      ]);
      (AppDataSource.query as jest.Mock).mockResolvedValue([
        { pruefidentifikator: '11001', sender: 'LF', empfaenger: 'NB' },
        { pruefidentifikator: '11001', sender: 'NB', empfaenger: 'LF' },
        { pruefidentifikator: '11002', sender: 'MSB', empfaenger: 'NB' },
      ]);

      const result = await formatVersionRepository.listPruefisByFormatVersion('FV2410');

      expect(result).toEqual([
        { pruefidentifikator: '11001', name: 'Anmeldung', roles: ['LF', 'NB'] },
        { pruefidentifikator: '11002', name: 'Abmeldung', roles: ['MSB', 'NB'] },
      ]);
    });

    it('should return an empty roles array for a pruefi with no direction data', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { pruefidentifikator: '11001', description: 'Anmeldung' },
      ]);
      (AppDataSource.query as jest.Mock).mockResolvedValue([]);

      const result = await formatVersionRepository.listPruefisByFormatVersion('FV2410');

      expect(result).toEqual([{ pruefidentifikator: '11001', name: 'Anmeldung', roles: [] }]);
    });

    it('should pass the format version to the roles query', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { pruefidentifikator: '11001', description: 'Anmeldung' },
      ]);

      await formatVersionRepository.listPruefisByFormatVersion('FV2410');

      expect(AppDataSource.query).toHaveBeenCalledWith(expect.any(String), ['FV2410']);
    });

    it('should throw NotFoundError when no pruefis exist for the format version', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      await expect(
        formatVersionRepository.listPruefisByFormatVersion('FV9999')
      ).rejects.toThrow(NotFoundError);
    });

    it('should initialize database if not already initialized', async () => {
      Object.defineProperty(AppDataSource, 'isInitialized', { get: () => false });
      (AppDataSource.initialize as jest.Mock) = jest.fn().mockResolvedValue(undefined);
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { pruefidentifikator: '11001', description: 'Anmeldung' },
      ]);

      await formatVersionRepository.listPruefisByFormatVersion('FV2410');

      expect(AppDataSource.initialize).toHaveBeenCalled();
    });
  });
});
