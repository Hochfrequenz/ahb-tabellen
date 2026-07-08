import AhbService from './ahb.service';
import AHBRepository, { FileType } from '../repository/ahb';
import { ValidationError } from '../infrastructure/errors';

describe('AhbService', () => {
  let service: AhbService;
  let mockRepository: jest.Mocked<AHBRepository>;

  beforeEach(() => {
    mockRepository = {
      get: jest.fn(),
      searchAhbLines: jest.fn(),
    } as unknown as jest.Mocked<AHBRepository>;

    service = new AhbService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAhb', () => {
    it('resolves the file type and returns the repository content', async () => {
      const ahb = { meta: {}, lines: [] } as never;
      mockRepository.get.mockResolvedValue(ahb);

      const result = await service.getAhb('11001', 'FV2410', 'json');

      expect(mockRepository.get).toHaveBeenCalledWith('11001', 'FV2410', FileType.JSON);
      expect(result).toEqual({ fileType: FileType.JSON, formatVersion: 'FV2410', content: ahb });
    });

    it('enriches JSON lines with the detected EBD key', async () => {
      const ahb = {
        meta: {},
        lines: [
          { value_pool_entry: 'E_0004' },
          { value_pool_entry: 'Prüfschritt E_0500 gemäß EBD' },
          { value_pool_entry: 'no key here' },
        ],
      } as never;
      mockRepository.get.mockResolvedValue(ahb);

      const { content } = await service.getAhb('11001', 'FV2410', 'json');
      const lines = (content as { lines: { ebd_key: string | null }[] }).lines;
      expect(lines.map(l => l.ebd_key)).toEqual(['E_0004', 'E_0500', null]);
    });

    it('resolves an ISO date to the applicable format version before hitting the repository', async () => {
      const ahb = { meta: {}, lines: [] } as never;
      mockRepository.get.mockResolvedValue(ahb);

      const result = await service.getAhb('11001', '2024-06-01', 'json');

      expect(mockRepository.get).toHaveBeenCalledWith('11001', 'FV2404', FileType.JSON);
      // the resolved FV is surfaced so callers (e.g. the download filename) don't echo the raw date
      expect(result.formatVersion).toBe('FV2404');
    });

    it('maps xlsx to the XLSX file type', async () => {
      const buffer = Buffer.from('xlsx');
      mockRepository.get.mockResolvedValue(buffer);

      const result = await service.getAhb('11001', 'FV2410', 'xlsx');

      expect(mockRepository.get).toHaveBeenCalledWith('11001', 'FV2410', FileType.XLSX);
      expect(result).toEqual({ fileType: FileType.XLSX, formatVersion: 'FV2410', content: buffer });
    });

    it.each(['1234', 'abcde', ''])('rejects invalid pruefi %p', async invalid => {
      await expect(service.getAhb(invalid, 'FV2410', 'json')).rejects.toThrow(ValidationError);
      expect(mockRepository.get).not.toHaveBeenCalled();
    });

    it.each(['FV241', '2410', 'fv2410'])('rejects invalid format version %p', async invalid => {
      await expect(service.getAhb('11001', invalid, 'json')).rejects.toThrow(ValidationError);
      expect(mockRepository.get).not.toHaveBeenCalled();
    });

    it('rejects an unsupported format', async () => {
      await expect(service.getAhb('11001', 'FV2410', 'pdf')).rejects.toThrow(ValidationError);
      expect(mockRepository.get).not.toHaveBeenCalled();
    });
  });

  describe('searchAhbLines', () => {
    const validPayload = {
      page: 1,
      pageSize: 25,
      sort: [{ field: 'format_version', direction: 'asc' as const }],
      q: '',
      filters: {},
    };

    it('delegates a valid payload to the repository', async () => {
      const results = { items: [], total: 0, page: 1, pageSize: 25 };
      mockRepository.searchAhbLines.mockResolvedValue(results);

      await expect(service.searchAhbLines(validPayload)).resolves.toBe(results);
      expect(mockRepository.searchAhbLines).toHaveBeenCalledWith(validPayload);
    });

    it.each([
      [{}, 'page must be a positive integer'],
      [{ ...validPayload, page: 'x' }, 'page must be a positive integer'],
      [{ ...validPayload, page: 0 }, 'page must be a positive integer'],
      [{ ...validPayload, pageSize: 'x' }, 'pageSize must be a positive integer'],
      [{ ...validPayload, pageSize: 0 }, 'pageSize must be a positive integer'],
      [{ ...validPayload, sort: 'x' }, 'sort must be an array'],
      [{ ...validPayload, q: 123 }, 'q must be a string'],
    ])('rejects invalid payload %#', async (payload, message) => {
      await expect(service.searchAhbLines(payload as never)).rejects.toThrow(message);
      expect(mockRepository.searchAhbLines).not.toHaveBeenCalled();
    });

    it('passes sender/empfaenger filters through unchanged', async () => {
      const payload = {
        ...validPayload,
        filters: { sender: { in: ['LF'] }, empfaenger: { in: ['MSB', 'NB'] } },
      };
      mockRepository.searchAhbLines.mockResolvedValue({
        items: [],
        total: 0,
        page: 1,
        pageSize: 25,
      });

      await service.searchAhbLines(payload);

      expect(mockRepository.searchAhbLines).toHaveBeenCalledWith(payload);
    });
  });

  it('creates its own repository when none is provided', () => {
    expect(new AhbService()).toBeInstanceOf(AhbService);
  });
});
