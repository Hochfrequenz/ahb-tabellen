import AHBRepository from './ahb';
import { AppDataSource } from '../infrastructure/database';
import { AhbLine } from '../entities/ahb-line.entity';
import { SelectQueryBuilder } from 'typeorm';

// Mock the database
jest.mock('../infrastructure/database', () => ({
  AppDataSource: {
    isInitialized: true,
    initialize: jest.fn(),
    getRepository: jest.fn(),
  },
}));

// Mock XlsxGeneratorService
jest.mock('../infrastructure/xlsx-generator.service');

// Mock RichtungRepository to avoid database calls for richtung values
jest.mock('./richtung', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      getDistinctValues: jest.fn().mockResolvedValue({
        sender: ['LF', 'MSB', 'MSBN', 'MSBA', 'NB', 'LFA', 'LFN', 'ESA'],
        empfaenger: ['LF', 'MSB', 'MSBN', 'MSBA', 'NB', 'LFA', 'LFN', 'ESA'],
      }),
    })),
  };
});

describe('AHBRepository - Sender and Empfaenger Filters', () => {
  let repository: AHBRepository;
  let mockQueryBuilder: jest.Mocked<SelectQueryBuilder<AhbLine>>;
  let mockRepository: { createQueryBuilder: jest.Mock };

  beforeEach(() => {
    // Create mock query builder
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      offset: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([]),
      getCount: jest.fn().mockResolvedValue(0),
      getOne: jest.fn().mockResolvedValue(null),
      setParameter: jest.fn().mockReturnThis(),
      createQueryBuilder: jest.fn().mockReturnThis(),
      clone: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<SelectQueryBuilder<AhbLine>>;

    // Create mock repository
    mockRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    // Mock AppDataSource.getRepository to return our mock repository
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);

    repository = new AHBRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('searchAhbLines with sender filter', () => {
    it('should apply sender filter with single value', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['LF'] },
        },
      });

      // Check that setParameter was called with the correct sender pattern
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_0', '%"sender": "LF"%');

      // Check that andWhere was called with the LIKE condition
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('al.direction LIKE :sender_0')
      );
    });

    it('should apply sender filter with multiple values', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['LF', 'MSB', 'NB'] },
        },
      });

      // Check that setParameter was called for each sender
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_0', '%"sender": "LF"%');
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_1', '%"sender": "MSB"%');
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_2', '%"sender": "NB"%');

      // Check that andWhere was called with OR conditions
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('al.direction LIKE :sender_0 OR')
      );
    });

    it('should handle empty sender array', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: [] },
        },
      });

      // Should not add any sender-specific parameters
      const senderCalls = mockQueryBuilder.setParameter.mock.calls.filter(call =>
        call[0].toString().startsWith('sender_')
      );
      expect(senderCalls.length).toBe(0);
    });
  });

  describe('searchAhbLines with empfaenger filter', () => {
    it('should apply empfaenger filter with single value', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          empfaenger: { in: ['MSB'] },
        },
      });

      // Check that setParameter was called with the correct empfaenger pattern
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_0',
        '%"empfaenger": "MSB"%'
      );

      // Check that andWhere was called with the LIKE condition
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('al.direction LIKE :empfaenger_0')
      );
    });

    it('should apply empfaenger filter with multiple values', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          empfaenger: { in: ['MSB', 'NB', 'ESA'] },
        },
      });

      // Check that setParameter was called for each empfaenger
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_0',
        '%"empfaenger": "MSB"%'
      );
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_1',
        '%"empfaenger": "NB"%'
      );
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_2',
        '%"empfaenger": "ESA"%'
      );

      // Check that andWhere was called with OR conditions
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('al.direction LIKE :empfaenger_0 OR')
      );
    });
  });

  describe('searchAhbLines with both sender and empfaenger filters', () => {
    it('should apply both filters simultaneously', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['LF'] },
          empfaenger: { in: ['MSB'] },
        },
      });

      // Check sender filter
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_0', '%"sender": "LF"%');

      // Check empfaenger filter
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_0',
        '%"empfaenger": "MSB"%'
      );

      // Both should use andWhere (AND logic between filters)
      const andWhereCalls = mockQueryBuilder.andWhere.mock.calls;
      const hasSenderCondition = andWhereCalls.some(call =>
        call[0].toString().includes('sender_0')
      );
      const hasEmpfaengerCondition = andWhereCalls.some(call =>
        call[0].toString().includes('empfaenger_0')
      );

      expect(hasSenderCondition).toBe(true);
      expect(hasEmpfaengerCondition).toBe(true);
    });

    it('should apply sender/empfaenger filters with other filters', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          format_version: { in: ['FV2510'] },
          sender: { in: ['LF'] },
          empfaenger: { in: ['MSB'] },
          segment_code: { contains: 'NAD' },
        },
      });

      // Check all filters are applied
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_0', '%"sender": "LF"%');
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith(
        'empfaenger_0',
        '%"empfaenger": "MSB"%'
      );

      // Check standard filters are also applied
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('format_version'),
        expect.any(Object)
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        expect.stringContaining('segment_code'),
        expect.any(Object)
      );
    });
  });

  describe('searchAhbLines with invalid values', () => {
    // Values not in allowlist should be filtered out (SQL injection protection)
    it('should filter out invalid sender values', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['INVALID_VALUE', 'LF"--'] },
        },
      });

      // Invalid values should not create any parameters
      const senderCalls = mockQueryBuilder.setParameter.mock.calls.filter(call =>
        call[0].toString().startsWith('sender_')
      );
      expect(senderCalls.length).toBe(0);
    });

    it('should filter out invalid empfaenger values', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          empfaenger: { in: ['INVALID', 'NB"; DROP TABLE'] },
        },
      });

      // Invalid values should not create any parameters
      const empfaengerCalls = mockQueryBuilder.setParameter.mock.calls.filter(call =>
        call[0].toString().startsWith('empfaenger_')
      );
      expect(empfaengerCalls.length).toBe(0);
    });

    it('should keep valid values while filtering out invalid ones', async () => {
      await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['LF', 'INVALID', 'MSB'] },
        },
      });

      // Only valid values should create parameters (called twice: main query + count query)
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_0', '%"sender": "LF"%');
      expect(mockQueryBuilder.setParameter).toHaveBeenCalledWith('sender_1', '%"sender": "MSB"%');

      // Should have 4 sender calls (2 valid values × 2 queries), not 6 (if invalid was included)
      const senderCalls = mockQueryBuilder.setParameter.mock.calls.filter(call =>
        call[0].toString().startsWith('sender_')
      );
      expect(senderCalls.length).toBe(4);
    });
  });

  describe('searchAhbLines returns correct structure', () => {
    it('should return items with direction field', async () => {
      const mockData = [
        {
          format_version: 'FV2510',
          format: 'UTILMD',
          pruefidentifikator: '11001',
          description: 'Test',
          segmentgroup_key: 'SG2',
          segment_code: 'NAD',
          data_element: '3035',
          qualifier: 'MR',
          line_ahb_status: 'Muss',
          line_name: 'Test Line',
          bedingung: null,
          direction: '[{"sender": "LF", "empfaenger": "MSB"}]',
          sort_path: '001',
        },
      ];

      mockQueryBuilder.getRawMany.mockResolvedValue(mockData);
      mockQueryBuilder.getCount.mockResolvedValue(1);

      const result = await repository.searchAhbLines({
        page: 1,
        pageSize: 25,
        sort: [],
        q: '',
        filters: {
          sender: { in: ['LF'] },
        },
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].direction).toBe('[{"sender": "LF", "empfaenger": "MSB"}]');
      expect(result.total).toBe(1);
    });
  });
});
