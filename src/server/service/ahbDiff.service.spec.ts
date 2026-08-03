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
      getPruefiDiff: jest.fn(),
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

    it('detects the EBD key per side from the qualifier', async () => {
      const result = {
        lines: [
          { old: { qualifier: 'E_0401' }, new: { qualifier: 'foo' } },
          { old: null, new: { qualifier: 'siehe E_0500' } },
        ],
        meta: {
          pruefidentifikator: '11042',
          format_version_new: 'FV2504',
          format_version_old: 'FV2410',
        },
      } as never;
      mockRepository.getDiff.mockResolvedValue(result);

      const diff = await service.getDiff('11042', 'FV2504', 'FV2410');
      expect(diff.lines[0].old?.ebd_key).toBe('E_0401');
      expect(diff.lines[0].new?.ebd_key).toBeNull();
      expect(diff.lines[1].old).toBeNull();
      expect(diff.lines[1].new?.ebd_key).toBe('E_0500');
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

  describe('getPruefiDiff', () => {
    it('delegates valid parameters to the repository', async () => {
      const result = {
        lines: [],
        meta: {
          format_version: 'FV2410',
          pruefidentifikator_old: '13002',
          pruefidentifikator_new: '13003',
        },
      };
      mockRepository.getPruefiDiff.mockResolvedValue(result);

      await expect(service.getPruefiDiff('FV2410', '13002', '13003')).resolves.toBe(result);
      expect(mockRepository.getPruefiDiff).toHaveBeenCalledWith('FV2410', '13002', '13003');
    });

    it('detects the EBD key per side from the qualifier', async () => {
      const result = {
        lines: [
          { old: { qualifier: 'E_0401' }, new: { qualifier: 'foo' } },
          { old: null, new: { qualifier: 'siehe E_0500' } },
        ],
        meta: {
          format_version: 'FV2410',
          pruefidentifikator_old: '13002',
          pruefidentifikator_new: '13003',
        },
      } as never;
      mockRepository.getPruefiDiff.mockResolvedValue(result);

      const diff = await service.getPruefiDiff('FV2410', '13002', '13003');
      expect(diff.lines[0].old?.ebd_key).toBe('E_0401');
      expect(diff.lines[0].new?.ebd_key).toBeNull();
      expect(diff.lines[1].old).toBeNull();
      expect(diff.lines[1].new?.ebd_key).toBe('E_0500');
    });

    it.each(['1234', 'abcde'])('rejects invalid pruefiOld %p', async invalid => {
      await expect(service.getPruefiDiff('FV2410', invalid, '13003')).rejects.toThrow(
        'Invalid Prüfidentifikator format'
      );
      expect(mockRepository.getPruefiDiff).not.toHaveBeenCalled();
    });

    it.each(['1234', 'abcde'])('rejects invalid pruefiNew %p', async invalid => {
      await expect(service.getPruefiDiff('FV2410', '13002', invalid)).rejects.toThrow(
        'Invalid Prüfidentifikator format'
      );
      expect(mockRepository.getPruefiDiff).not.toHaveBeenCalled();
    });

    it('rejects comparing a Pruefi with itself', async () => {
      await expect(service.getPruefiDiff('FV2410', '13002', '13002')).rejects.toThrow(
        ValidationError
      );
      expect(mockRepository.getPruefiDiff).not.toHaveBeenCalled();
    });

    it('rejects a missing/invalid format-version with a field-specific message', async () => {
      await expect(service.getPruefiDiff('invalid', '13002', '13003')).rejects.toThrow(
        'format-version'
      );
      expect(mockRepository.getPruefiDiff).not.toHaveBeenCalled();
    });
  });

  it('creates its own repository when none is provided', () => {
    expect(new AhbDiffService()).toBeInstanceOf(AhbDiffService);
  });
});
