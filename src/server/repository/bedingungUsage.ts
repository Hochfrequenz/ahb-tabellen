import { EdifactFormat, getFormatOfPruefidentifikator } from '@hochfrequenz/efoli';
import { AppDataSource } from '../infrastructure/database';

/** One row of the `v_ahb_condition_usages` view (only the columns the tool needs). */
export interface BedingungUsageRow {
  pruefidentifikator: string;
  description: string | null;
  sort_path: string;
  segmentgroup_key: string | null;
  segment_code: string | null;
  data_element: string | null;
  qualifier: string | null;
  line_name: string | null;
  line_ahb_status: string | null;
  /** `null` = the condition is used directly; otherwise the package/UB key it is reached through. */
  via: string | null;
}

export interface BedingungUsageQuery {
  formatVersion: string;
  /** Condition key without brackets, normalized (e.g. `931`, `UB1`). */
  conditionKey: string;
  /** Plain (`UTILMD`) or detailed (`UTILMDS`) format. */
  format?: string;
  pruefi?: string;
  /** Maximum number of distinct lines (not view rows). */
  limit: number;
}

export interface BedingungUsageResult {
  /** Distinct lines (Prüfidentifikator + sort_path) matching the filters, before `limit`. */
  totalLines: number;
  rows: BedingungUsageRow[];
}

/**
 * Detailed formats whose value differs from the plain `format` column of the views
 * (`v_ahbtabellen.format` holds `UTILMD` for UTILMDS/UTILMDG/UTILMDW).
 */
const DETAILED_FORMAT_TO_PLAIN: Readonly<Record<string, string>> = {
  [EdifactFormat.UTILMDS]: EdifactFormat.UTILMD,
  [EdifactFormat.UTILMDG]: EdifactFormat.UTILMD,
  [EdifactFormat.UTILMDW]: EdifactFormat.UTILMD,
};

function formatOfPruefiOrUndefined(pruefi: string): string | undefined {
  try {
    return getFormatOfPruefidentifikator(pruefi);
  } catch {
    return undefined;
  }
}

/** Queries the `v_ahb_condition_usages` view (built by xml-fundamend-python). */
export default class BedingungUsageRepository {
  public async findUsages(query: BedingungUsageQuery): Promise<BedingungUsageResult> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const where: string[] = ['format_version = ?', 'condition_key = ?'];
    const params: unknown[] = [query.formatVersion, query.conditionKey];

    if (query.format) {
      const plain = DETAILED_FORMAT_TO_PLAIN[query.format];
      if (plain === undefined) {
        where.push('format = ?');
        params.push(query.format);
      } else {
        // Filter by the Prüfidentifikator list in SQL (not afterwards), so total and limit stay correct.
        const candidates: { pruefidentifikator: string }[] = await AppDataSource.query(
          `SELECT DISTINCT pruefidentifikator FROM v_ahbtabellen WHERE format_version = ? AND format = ?`,
          [query.formatVersion, plain]
        );
        const pruefis = candidates
          .map(c => c.pruefidentifikator)
          .filter(p => formatOfPruefiOrUndefined(p) === query.format);
        if (pruefis.length === 0) {
          return { totalLines: 0, rows: [] };
        }
        where.push(`pruefidentifikator IN (${pruefis.map(() => '?').join(', ')})`);
        params.push(...pruefis);
      }
    }
    if (query.pruefi) {
      where.push('pruefidentifikator = ?');
      params.push(query.pruefi);
    }
    const whereSql = where.join(' AND ');

    const countRows: { total: number }[] = await AppDataSource.query(
      `SELECT COUNT(*) AS total FROM (
         SELECT DISTINCT pruefidentifikator, sort_path FROM v_ahb_condition_usages WHERE ${whereSql}
       )`,
      params
    );
    const totalLines = Number(countRows[0]?.total ?? 0);

    // A line can have several view rows (one per `via`), so limit on distinct lines in a subquery.
    const rows: BedingungUsageRow[] = await AppDataSource.query(
      `SELECT pruefidentifikator, description, sort_path, segmentgroup_key, segment_code,
              data_element, qualifier, line_name, line_ahb_status, via
         FROM v_ahb_condition_usages
        WHERE ${whereSql}
          AND (pruefidentifikator, sort_path) IN (
            SELECT DISTINCT pruefidentifikator, sort_path
              FROM v_ahb_condition_usages
             WHERE ${whereSql}
             ORDER BY pruefidentifikator ASC, sort_path ASC
             LIMIT ?
          )
        ORDER BY pruefidentifikator ASC, sort_path ASC`,
      [...params, ...params, query.limit]
    );
    return { totalLines, rows };
  }
}
