import DatenstandRepository, { DatenstandResult } from '../repository/datenstand';
import FormatVersionRepository, { PruefiWithName } from '../repository/formatVersion';
import FormateRepository from '../repository/formate';
import RichtungRepository, { DirectionValues } from '../repository/richtung';
import { resolveFormatVersion } from './validation';

/**
 * Transport-agnostic application logic for reference/metadata lookups
 * (format versions, formats, directions, Datenstand). Thin delegators plus input
 * validation where the input is user-supplied.
 */
export default class MetadataService {
  private datenstandRepository: DatenstandRepository;
  private formatVersionRepository: FormatVersionRepository;
  private formateRepository: FormateRepository;
  private richtungRepository: RichtungRepository;

  constructor(repositories?: {
    datenstand?: DatenstandRepository;
    formatVersion?: FormatVersionRepository;
    formate?: FormateRepository;
    richtung?: RichtungRepository;
  }) {
    this.datenstandRepository = repositories?.datenstand ?? new DatenstandRepository();
    this.formatVersionRepository = repositories?.formatVersion ?? new FormatVersionRepository();
    this.formateRepository = repositories?.formate ?? new FormateRepository();
    this.richtungRepository = repositories?.richtung ?? new RichtungRepository();
  }

  public listFormatVersions(): Promise<string[]> {
    return this.formatVersionRepository.list();
  }

  public listFormate(): Promise<string[]> {
    return this.formateRepository.list();
  }

  public listDirections(): Promise<DirectionValues> {
    return this.richtungRepository.getDistinctValues();
  }

  public getDatenstand(): Promise<DatenstandResult> {
    return this.datenstandRepository.getLatestVeroeffentlichungsdatum();
  }

  public async listPruefisByFormatVersion(formatVersion: string): Promise<PruefiWithName[]> {
    const resolvedFormatVersion = resolveFormatVersion(formatVersion);
    return this.formatVersionRepository.listPruefisByFormatVersion(resolvedFormatVersion);
  }
}
