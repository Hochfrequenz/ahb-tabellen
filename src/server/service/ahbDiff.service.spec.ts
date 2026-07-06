import AhbDiffService from './ahbDiff.service';
import AhbDiffRepository from '../repository/ahbDiff';
import { ValidationError } from '../infrastructure/errors';

describe('AhbDiffService', () => {
  let service: AhbDiffService;
  let mockRepository: jest.Mocked<AhbDiffRepository>;

  beforeEach(() => {
    mockRepository = {
      getDiff: jest.fn(),
      getSummary: jest.fn(),
    } as unknown as jest.Mocked<AhbDiffRepository>;

    service = new AhbDiffService(mockRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDiff', () => {
    it('delegates valid parameters to the repository', async () => {
      const result = {
        lines: [],
        meta: {
          pruefidentifikator: '11042',
          format_version_new: 'FV2504',
          format_version_old: 'FV2410',
        },
      };
      mockRepository.getDiff.mockResolvedValue(result);

      await expect(service.getDiff('11042', 'FV2504', 'FV2410')).resolves.toBe(result);
      expect(mockRepository.getDiff).toHaveBeenCalledWith('11042', 'FV2504', 'FV2410');
    });

    it.each(['1234', 'abcde'])('rejects invalid pruefi %p', async invalid => {
      await expect(service.getDiff(invalid, 'FV2504', 'FV2410')).rejects.toThrow(
        'Invalid Prüfidentifikator format'
      );
      expect(mockRepository.getDiff).not.toHaveBeenCalled();
    });

    it('rejects a missing/invalid format-version-new with a field-specific message', async () => {
      await expect(service.getDiff('11042', undefined as never, 'FV2410')).rejects.toThrow(
        'format-version-new'
      );
      expect(mockRepository.getDiff).not.toHaveBeenCalled();
    });

    it('rejects a missing/invalid format-version-old with a field-specific message', async () => {
      await expect(service.getDiff('11042', 'FV2504', '2410')).rejects.toThrow(
        'format-version-old'
      );
      expect(mockRepository.getDiff).not.toHaveBeenCalled();
    });
  });

  describe('getSummary', () => {
    it('delegates valid parameters to the repository', async () => {
      const summary = { '11042': { added: 1, deleted: 0, modified: 2 } };
      mockRepository.getSummary.mockResolvedValue(summary);

      await expect(service.getSummary('FV2504', 'FV2410')).resolves.toBe(summary);
      expect(mockRepository.getSummary).toHaveBeenCalledWith('FV2504', 'FV2410');
    });

    it('rejects invalid format versions with ValidationError', async () => {
      await expect(service.getSummary('invalid', 'FV2410')).rejects.toThrow(ValidationError);
      await expect(service.getSummary('FV2504', 'invalid')).rejects.toThrow('format-version-old');
      expect(mockRepository.getSummary).not.toHaveBeenCalled();
    });
  });

  it('creates its own repository when none is provided', () => {
    expect(new AhbDiffService()).toBeInstanceOf(AhbDiffService);
  });
});
