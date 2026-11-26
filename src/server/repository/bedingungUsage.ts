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

    // The view's `format` column is the plain format; a detailed format (UTILMDS/G/W) is
    // narrowed down in TypeScript after the query, by the Prüfidentifikator.
    const detailedFormat =
      query.format !== undefined &&
      Object.prototype.hasOwnProperty.call(DETAILED_FORMAT_TO_PLAIN, query.format);
    if (query.format) {
      where.push('format = ?');
      params.push(detailedFormat ? DETAILED_FORMAT_TO_PLAIN[query.format] : query.format);
    }
    if (query.pruefi) {
      where.push('pruefidentifikator = ?');
      params.push(query.pruefi);
    }

    // Exactly one query: the view is expensive, so count and limit are applied in TypeScript.
    let rows: BedingungUsageRow[] = await AppDataSource.query(
      `SELECT pruefidentifikator, description, sort_path, segmentgroup_key, segment_code,
              data_element, qualifier, line_name, line_ahb_status, via
         FROM v_ahb_condition_usages
        WHERE ${where.join(' AND ')}
        ORDER BY pruefidentifikator, sort_path`,
      params
    );
    if (detailedFormat) {
      rows = rows.filter(r => formatOfPruefiOrUndefined(r.pruefidentifikator) === query.format);
    }

    // A line (Prüfidentifikator + sort_path) can have several rows, one per `via`; rows of one
    // line are adjacent because of the ORDER BY.
    const lineKey = (r: BedingungUsageRow): string => `${r.pruefidentifikator}\u0000${r.sort_path}`;
    let totalLines = 0;
    let lastKey: string | undefined;
    let keep = 0; // number of leading rows that belong to the first `limit` lines
    for (const [i, r] of rows.entries()) {
      const key = lineKey(r);
      if (key !== lastKey) {
        totalLines++;
        lastKey = key;
      }
      if (totalLines <= query.limit) {
        keep = i + 1;
      }
    }
    return { totalLines, rows: rows.slice(0, keep) };
  }
}
