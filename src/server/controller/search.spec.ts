import { Request, Response, NextFunction } from 'express';
import SearchController from './search';
import AhbService from '../service/ahb.service';

jest.mock('../service/ahb.service');

describe('SearchController', () => {
  let searchController: SearchController;
  let mockService: jest.Mocked<AhbService>;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  const searchBody = {
    page: 1,
    pageSize: 25,
    sort: [{ field: 'format_version', direction: 'asc' as const }],
    q: '',
    filters: {},
  };

  beforeEach(() => {
    mockService = {
      searchAhbLines: jest.fn(),
    } as unknown as jest.Mocked<AhbService>;

    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockNext = jest.fn();

    mockReq = { body: { ...searchBody } };
    mockRes = { status: mockStatus, json: mockJson };

    searchController = new SearchController(mockService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('query', () => {
    it('delegates the request body to the service and serializes the result', async () => {
      const mockSearchResults = {
        items: [
          {
            format_version: 'FV2410',
            format: 'UTILMD',
            pruefidentifikator: '25007',
            description: 'Test description',
            direction: 'inbound',
          },
        ],
        total: 1,
        page: 1,
        pageSize: 25,
      };

      mockService.searchAhbLines.mockResolvedValue(mockSearchResults);

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.searchAhbLines).toHaveBeenCalledWith(searchBody);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockSearchResults);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('passes an empty object to the service when the body is missing', async () => {
      mockReq.body = undefined;
      mockService.searchAhbLines.mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 25 });

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.searchAhbLines).toHaveBeenCalledWith({});
    });

    it('forwards service errors to next()', async () => {
      const error = new Error('Database error');
      mockService.searchAhbLines.mockRejectedValue(error);

      await searchController.query(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    it('creates its own service instance when none is provided', () => {
      expect(new SearchController()).toBeInstanceOf(SearchController);
    });
  });
});
