/**
 * MIG (Message Implementation Guide) repository.
 *
 * Reads `messageimplementationguide` and the flattened tree in `mig_hierarchy_materialized`
 * (both built by xml-fundamend-python). The AHB-only database ships these tables empty; only
 * the combined AHB+MIG database (`ahb_mig_<hash>.db` in xml-migs-and-ahbs) fills them.
 *
 * All SQL is parameterized.
 */
import { AppDataSource } from '../infrastructure/database';

export interface MigInfo {
  format: string;
  versionsnummer: string;
  gueltig_von: string | null;
  gueltig_bis: string | null;
}

export interface MigInfoWithKey extends MigInfo {
  primary_key: string;
}

/** One node of the MIG tree, as stored (only the columns the tree needs). */
export interface MigHierarchyRow {
  type: string;
  depth: number;
  sort_path: string;
  /** e.g. `SG4+24>DTM+137>`; null for a few empty code rows. */
  id_path: string | null;
  line_name: string | null;
  line_status_std: string | null;
  line_status_specification: string | null;
  segmentgroup_id: string | null;
  segmentgroup_max_rep_std: number | null;
  segmentgroup_max_rep_specification: number | null;
  segment_id: string | null;
  segment_number: string | null;
  segment_max_rep_std: number | null;
  segment_max_rep_specification: number | null;
  segment_description: string | null;
  segment_example: string | null;
  dataelementgroup_id: string | null;
  dataelementgroup_description: string | null;
  dataelement_id: string | null;
  dataelement_description: string | null;
  dataelement_format_std: string | null;
  dataelement_format_specification: string | null;
  code_value: string | null;
  code_description: string | null;
}

export interface AhbLinePathRow {
  id: string;
  id_path: string | null;
  format: string;
  line_name?: string | null;
  line_type?: string | null;
}

async function ensureInitialized(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
}

export default class MigRepository {
  /** All MIGs of a format version, by format and version. */
  public async listMigs(formatVersion: string): Promise<MigInfo[]> {
    await ensureInitialized();
    return AppDataSource.query(
      `SELECT format, versionsnummer, gueltig_von, gueltig_bis
         FROM messageimplementationguide
        WHERE edifact_format_version = ?
        ORDER BY format, versionsnummer`,
      [formatVersion]
    );
  }

  /** The MIGs of one format in a format version (UTILMD has one per sector, e.g. S2.2 and G1.2). */
  public async findMigs(formatVersion: string, format: string): Promise<MigInfoWithKey[]> {
    await ensureInitialized();
    return AppDataSource.query(
      `SELECT primary_key, format, versionsnummer, gueltig_von, gueltig_bis
         FROM messageimplementationguide
        WHERE edifact_format_version = ? AND format = ?
        ORDER BY versionsnummer`,
      [formatVersion, format]
    );
  }

  /** All nodes of one MIG in pre-order (`sort_path`), served by idx_mig_hierarchy_mig_pk_sort. */
  public async getHierarchy(migPrimaryKey: string): Promise<MigHierarchyRow[]> {
    await ensureInitialized();
    return AppDataSource.query(
      `SELECT type, depth, sort_path, id_path, line_name, line_status_std, line_status_specification,
              segmentgroup_id, segmentgroup_max_rep_std, segmentgroup_max_rep_specification,
              segment_id, segment_number, segment_max_rep_std, segment_max_rep_specification,
              segment_description, segment_example,
              dataelementgroup_id, dataelementgroup_description,
              dataelement_id, dataelement_description,
              dataelement_format_std, dataelement_format_specification,
              code_value, code_description
         FROM mig_hierarchy_materialized
        WHERE mig_pk = ?
        ORDER BY sort_path`,
      [migPrimaryKey]
    );
  }

  /** The id_paths of a Prüfidentifikator's AHB lines, in table order. */
  public async getAhbLinePaths(formatVersion: string, pruefi: string): Promise<AhbLinePathRow[]> {
    await ensureInitialized();
    return AppDataSource.query(
      `SELECT id, id_path, format, line_name, line_type
         FROM v_ahbtabellen
        WHERE format_version = ? AND pruefidentifikator = ?
        ORDER BY sort_path`,
      [formatVersion, pruefi]
    );
  }
}
