import { Request, Response, NextFunction } from 'express';
import SearchController from './search';
import AHBRepository from '../repository/ahb';

// Mock the repository
jest.mock('../repository/ahb');
const MockedAHBRepository = AHBRepository as jest.MockedClass<typeof AHBRepository>;

describe('SearchController', () => {
  let searchController: SearchController;
  let mockRepository: jest.Mocked<AHBRepository>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockRepository = {
      searchAhbLines: jest.fn(),
    } as any;

    MockedAHBRepository.mockImplementation(() => mockRepository);

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockReq = {
      body: {
        page: 1,
        pageSize: 25,
        sort: [{ field: 'format_version', direction: 'asc' }],
        q: '',
        filters: {},
      },
    };

    mockRes = {
      status: mockStatus,
      json: mockJson,
    };

    searchController = new SearchController(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('query', () => {
    it('should return search results successfully', async () => {
      const mockSearchResults = {
        items: [
          {
            format_version: 'FV2410',
            format: 'UTILMD',
            pruefidentifikator: '25007',
            description: 'Test description',
            segmentgroup_key: 'SG6',
            segment_code: 'NAD',
            data_element: 'D_3035',
            qualifier: 'test',
            line_ahb_status: 'Muss',
            line_name: 'Test line',
            bedingung: 'Test condition',
            direction: 'inbound',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 25,
      };

      mockRepository.searchAhbLines.mockResolvedValue(mockSearchResults);

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRepository.searchAhbLines).toHaveBeenCalledWith({
        page: 1,
        pageSize: 25,
        sort: [{ field: 'format_version', direction: 'asc' }],
        q: '',
        filters: {},
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockSearchResults);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle empty request body', async () => {
      mockReq.body = {};

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('page must be a positive integer'),
        })
      );
    });

    it('should validate required fields', async () => {
      const testCases = [
        { page: 'invalid', pageSize: 25, sort: [], q: '' },
        { page: 1, pageSize: 'invalid', sort: [], q: '' },
        { page: 1, pageSize: 25, sort: 'invalid', q: '' },
        { page: 1, pageSize: 25, sort: [], q: 123 },
        { page: 0, pageSize: 25, sort: [], q: '' },
        { page: 1, pageSize: 0, sort: [], q: '' },
      ];

      for (const testCase of testCases) {
        mockReq.body = testCase;
        await searchController.query(mockReq as Request, mockRes as Response, mockNext);
        expect(mockNext).toHaveBeenCalledWith(
          expect.objectContaining({
            message: expect.any(String),
          })
        );
        (mockNext as jest.Mock).mockClear();
      }
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.searchAhbLines.mockRejectedValue(error);

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    it('should handle complex search parameters', async () => {
      const complexRequest = {
        page: 2,
        pageSize: 50,
        sort: [
          { field: 'format_version', direction: 'asc' },
          { field: 'pruefidentifikator', direction: 'desc' },
        ],
        q: 'test search',
        filters: {
          format_version: { eq: 'FV2410' },
          format: { contains: 'UTIL' },
          segment_code: { in: ['NAD', 'DTM'] },
          line_ahb_status: { contains: 'Muss' },
        },
      };

      mockReq.body = complexRequest;
      mockRepository.searchAhbLines.mockResolvedValue({
        items: [],
        total: 0,
        page: 2,
        pageSize: 50,
      });

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRepository.searchAhbLines).toHaveBeenCalledWith({
        page: 2,
        pageSize: 50,
        sort: [
          { field: 'format_version', direction: 'asc' },
          { field: 'pruefidentifikator', direction: 'desc' },
        ],
        q: 'test search',
        filters: {
          format_version: { eq: 'FV2410' },
          format: { contains: 'UTIL' },
          segment_code: { in: ['NAD', 'DTM'] },
          line_ahb_status: { contains: 'Muss' },
        },
      });
    });
  });
});
