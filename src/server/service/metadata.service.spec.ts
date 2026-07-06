import MetadataService from './metadata.service';
import DatenstandRepository from '../repository/datenstand';
import FormatVersionRepository from '../repository/formatVersion';
import FormateRepository from '../repository/formate';
import RichtungRepository from '../repository/richtung';
import { ValidationError } from '../infrastructure/errors';

describe('MetadataService', () => {
  let service: MetadataService;
  let datenstand: jest.Mocked<DatenstandRepository>;
  let formatVersion: jest.Mocked<FormatVersionRepository>;
  let formate: jest.Mocked<FormateRepository>;
  let richtung: jest.Mocked<RichtungRepository>;

  beforeEach(() => {
    datenstand = {
      getLatestVeroeffentlichungsdatum: jest.fn(),
    } as unknown as jest.Mocked<DatenstandRepository>;
    formatVersion = {
      list: jest.fn(),
      listPruefisByFormatVersion: jest.fn(),
    } as unknown as jest.Mocked<FormatVersionRepository>;
    formate = { list: jest.fn() } as unknown as jest.Mocked<FormateRepository>;
    richtung = {
      getDistinctValues: jest.fn(),
    } as unknown as jest.Mocked<RichtungRepository>;

    service = new MetadataService({ datenstand, formatVersion, formate, richtung });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('delegates listFormatVersions', async () => {
    formatVersion.list.mockResolvedValue(['FV2410', 'FV2504']);
    await expect(service.listFormatVersions()).resolves.toEqual(['FV2410', 'FV2504']);
  });

  it('delegates listFormate', async () => {
    formate.list.mockResolvedValue(['UTILMD']);
    await expect(service.listFormate()).resolves.toEqual(['UTILMD']);
  });

  it('delegates listDirections', async () => {
    const values = { sender: ['LF'], empfaenger: ['MSB'] };
    richtung.getDistinctValues.mockResolvedValue(values);
    await expect(service.listDirections()).resolves.toBe(values);
  });

  it('delegates getDatenstand', async () => {
    const result = { veroeffentlichungsdatum: '2025-01-01' } as never;
    datenstand.getLatestVeroeffentlichungsdatum.mockResolvedValue(result);
    await expect(service.getDatenstand()).resolves.toBe(result);
  });

  describe('listPruefisByFormatVersion', () => {
    it('validates the format version before delegating', async () => {
      formatVersion.listPruefisByFormatVersion.mockResolvedValue([
        { pruefidentifikator: '11001', name: 'x' },
      ]);

      await service.listPruefisByFormatVersion('FV2410');

      expect(formatVersion.listPruefisByFormatVersion).toHaveBeenCalledWith('FV2410');
    });

    // Intentional behavior change: this endpoint previously accepted any string.
    it('rejects an invalid format version (previously accepted)', async () => {
      await expect(service.listPruefisByFormatVersion('nonsense')).rejects.toThrow(ValidationError);
      expect(formatVersion.listPruefisByFormatVersion).not.toHaveBeenCalled();
    });
  });

  it('creates its own repositories when none are provided', () => {
    expect(new MetadataService()).toBeInstanceOf(MetadataService);
  });
});
