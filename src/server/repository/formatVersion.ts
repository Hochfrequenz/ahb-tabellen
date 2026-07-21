import { NotFoundError } from '../infrastructure/errors';
import { AppDataSource } from '../infrastructure/database';
import { AhbLine, Anwendungshandbuch } from '../entities/ahb-line.entity';

interface FormatVersionsWithPruefis {
  [formatVersion: string]: Set<string>;
}

export interface PruefiWithName {
  pruefidentifikator: string;
  name: string;
  roles: string[];
}

// The FormatVersionRepository class is responsible for retrieving the format versions and their related pruefis.
export default class FormatVersionRepository {
  constructor() {}

  // Return a list of all unique format versions from the database
  public async list(): Promise<string[]> {
    // Initialize the database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const formatVersions = await AppDataSource.getRepository(Anwendungshandbuch)
      .createQueryBuilder('ahb')
      .select('DISTINCT ahb.edifact_format_version', 'formatVersion')
      .orderBy('ahb.edifact_format_version')
      .getRawMany();

    return formatVersions.map(result => result.formatVersion);
  }

  // Return a list of all pruefis for a specific format version by looking at the json files
  // in the flatahb directory of the format version
  public async listPruefisByFormatVersion(formatVersion: string): Promise<PruefiWithName[]> {
    // Initialize the database connection if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const pruefis = await AppDataSource.getRepository(AhbLine)
      .createQueryBuilder('ahb')
      .select('DISTINCT ahb.pruefidentifikator, ahb.description')
      .where('ahb.format_version = :formatVersion', { formatVersion })
      .orderBy('ahb.pruefidentifikator')
      .getRawMany();

    if (pruefis.length === 0) {
      throw new NotFoundError(`Format version ${formatVersion} does not exist`);
    }

    const rolesByPruefi = await this.getRolesByPruefi(formatVersion);

    return pruefis.map(pruefi => ({
      pruefidentifikator: pruefi.pruefidentifikator,
      name: pruefi.description || '',
      roles: rolesByPruefi.get(pruefi.pruefidentifikator) ?? [],
    }));
  }

  // Return the set of sender/empfaenger role codes that appear anywhere in a
  // Pruefidentifikator's AHB lines, grouped by pruefidentifikator, for a format version.
  private async getRolesByPruefi(formatVersion: string): Promise<Map<string, string[]>> {
    const rows: Array<{
      pruefidentifikator: string;
      sender: string | null;
      empfaenger: string | null;
    }> = await AppDataSource.query(
      `
      SELECT DISTINCT pruefidentifikator,
        json_extract(je.value, '$.sender') as sender,
        json_extract(je.value, '$.empfaenger') as empfaenger
      FROM v_ahbtabellen, json_each(v_ahbtabellen.direction) as je
      WHERE format_version = ? AND direction IS NOT NULL
      `,
      [formatVersion]
    );

    const rolesByPruefi = new Map<string, Set<string>>();
    for (const row of rows) {
      const roles = rolesByPruefi.get(row.pruefidentifikator) ?? new Set<string>();
      if (row.sender) roles.add(row.sender);
      if (row.empfaenger) roles.add(row.empfaenger);
      rolesByPruefi.set(row.pruefidentifikator, roles);
    }

    const result = new Map<string, string[]>();
    rolesByPruefi.forEach((roles, pruefi) => result.set(pruefi, Array.from(roles).sort()));
    return result;
  }

  private async getFormatVersionsContainerClient(): Promise<void> {
    throw new Error('Blob storage functionality has been removed');
  }

  private async createFormatVersionContainer(): Promise<void> {
    throw new Error('Blob storage functionality has been removed');
  }

  private async buildFormatVersionsWithPruefis(): Promise<FormatVersionsWithPruefis> {
    throw new Error('Blob storage functionality has been removed');
  }
}
