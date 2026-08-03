/**
 * AHB Diff Repository
 *
 * Uses the v_ahb_formatversion_diff view which pre-computes diff status and joins both versions.
 * The view compares AHB status fields to determine added/modified/deleted/unchanged status.
 *
 * The raw SQL uses parameterized queries to prevent SQL injection.
 */
import { NotFoundError } from '../infrastructure/errors';
import { AppDataSource } from '../infrastructure/database';

export interface AhbDiffSide {
  segmentgroup_key?: string | null;
  segment_code?: string | null;
  data_element?: string | null;
  qualifier?: string | null;
  line_ahb_status?: string | null;
  line_name?: string | null;
  line_type?: string | null;
  bedingung?: string | null;
  ebd_key?: string | null;
}

export interface AhbDiffLineJoined {
  diff_status: string;
  id_path: string;
  sort_path: string;
  changed_columns: string[];
  old: AhbDiffSide | null;
  new: AhbDiffSide | null;
}

export interface AhbDiffResult {
  lines: AhbDiffLineJoined[];
  meta: {
    pruefidentifikator: string;
    format_version_new: string;
    format_version_old: string;
    description_new?: string;
    description_old?: string;
  };
}

export interface AhbDiffStats {
  added: number;
  deleted: number;
  modified: number;
}

export type AhbDiffSummary = Record<string, AhbDiffStats>;

export interface PruefiDiffResult {
  lines: AhbDiffLineJoined[];
  meta: {
    format_version: string;
    pruefidentifikator_old: string;
    pruefidentifikator_new: string;
    description_new?: string;
    description_old?: string;
  };
}

interface RawDiffRow {
  diff_status: string;
  changed_columns: string | null;
  id_path: string;
  sort_path: string;
  path: string | null;
  line_type: string | null;
  // Old version columns
  old_format_version: string | null;
  old_pruefidentifikator: string | null;
  old_segmentgroup_key: string | null;
  old_segment_code: string | null;
  old_data_element: string | null;
  old_qualifier: string | null;
  old_line_ahb_status: string | null;
  old_line_name: string | null;
  old_bedingung: string | null;
  old_bedingungsfehler: string | null;
  // New version columns
  new_format_version: string | null;
  new_pruefidentifikator: string | null;
  new_segmentgroup_key: string | null;
  new_segment_code: string | null;
  new_data_element: string | null;
  new_qualifier: string | null;
  new_line_ahb_status: string | null;
  new_line_name: string | null;
  new_bedingung: string | null;
  new_bedingungsfehler: string | null;
}

export default class AhbDiffRepository {
  public async getDiff(
    pruefi: string,
    formatVersionNew: string,
    formatVersionOld: string
  ): Promise<AhbDiffResult> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Query the v_ahb_formatversion_diff view directly - it already has the diff logic built-in
    // new_format_version = new version, old_format_version = old version
    const query = `
      SELECT
        diff_status,
        changed_columns,
        id_path,
        sort_path,
        path,
        line_type,
        old_format_version,
        old_pruefidentifikator,
        old_segmentgroup_key,
        old_segment_code,
        old_data_element,
        old_qualifier,
        old_line_ahb_status,
        old_line_name,
        old_bedingung,
        old_bedingungsfehler,
        new_format_version,
        new_pruefidentifikator,
        new_segmentgroup_key,
        new_segment_code,
        new_data_element,
        new_qualifier,
        new_line_ahb_status,
        new_line_name,
        new_bedingung,
        new_bedingungsfehler
      FROM v_ahb_formatversion_diff
      WHERE new_pruefidentifikator = ?
        AND old_pruefidentifikator = ?
        AND new_format_version = ?
        AND old_format_version = ?
      ORDER BY sort_path ASC
    `;

    const diffQueryStart = performance.now();
    const rawRows: RawDiffRow[] = await AppDataSource.query(query, [
      pruefi,
      pruefi,
      formatVersionNew,
      formatVersionOld,
    ]);
    const diffQueryMs = performance.now() - diffQueryStart;
    console.log(
      `[AhbDiff] Main diff query: ${diffQueryMs.toFixed(1)}ms, rows=${rawRows.length}, pruefi=${pruefi}, fvNew=${formatVersionNew}, fvOld=${formatVersionOld}`
    );

    if (rawRows.length === 0) {
      throw new NotFoundError(
        `No diff found for pruefi ${pruefi} between ${formatVersionNew} and ${formatVersionOld}`
      );
    }

    // Transform raw rows into the expected API structure
    // Map v_ahb_formatversion_diff columns to the AhbDiffSide format expected by the frontend
    const lines: AhbDiffLineJoined[] = rawRows.map(row => this.mapRawRowToLine(row));

    // Fetch descriptions for both versions
    const descriptionQuery = `
      SELECT DISTINCT description, format_version
      FROM v_ahbtabellen
      WHERE pruefidentifikator = ?
        AND format_version IN (?, ?)
    `;
    const descQueryStart = performance.now();
    const descriptionRows: { description: string | null; format_version: string }[] =
      await AppDataSource.query(descriptionQuery, [pruefi, formatVersionNew, formatVersionOld]);
    const descQueryMs = performance.now() - descQueryStart;
    console.log(`[AhbDiff] Description query: ${descQueryMs.toFixed(1)}ms, pruefi=${pruefi}`);

    const descriptionNew = descriptionRows.find(
      r => r.format_version === formatVersionNew
    )?.description;
    const descriptionOld = descriptionRows.find(
      r => r.format_version === formatVersionOld
    )?.description;

    return {
      lines,
      meta: {
        pruefidentifikator: pruefi,
        format_version_new: formatVersionNew,
        format_version_old: formatVersionOld,
        description_new: descriptionNew ?? undefined,
        description_old: descriptionOld ?? undefined,
      },
    };
  }

  /**
   * Diff two different Pruefidentifikatoren within the same format version.
   *
   * Uses the precomputed `v_ahb_pruefi_diff` view (the counterpart to `v_ahb_formatversion_diff`
   * for same-format-version, different-Pruefi pairs). The view only stores each unordered pair once,
   * keyed by `old_pruefidentifikator < new_pruefidentifikator`, so callers requesting the reverse
   * order are normalized before querying and the result sides are swapped back afterwards.
   */
  public async getPruefiDiff(
    formatVersion: string,
    pruefiOld: string,
    pruefiNew: string
  ): Promise<PruefiDiffResult> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    // Check existence up front (also doubles as the description lookup below): unlike getDiff,
    // this query doesn't go through the precomputed v_ahb_formatversion_diff view (which only ever generates
    // pairs for Pruefis that exist in both requested versions), so a missing Pruefi here would
    // otherwise silently produce a diff where every line looks "added"/"deleted" instead of 404.
    const descriptionQuery = `
      SELECT DISTINCT description, pruefidentifikator
      FROM v_ahbtabellen
      WHERE format_version = ?
        AND pruefidentifikator IN (?, ?)
    `;
    const descQueryStart = performance.now();
    const descriptionRows: { description: string | null; pruefidentifikator: string }[] =
      await AppDataSource.query(descriptionQuery, [formatVersion, pruefiOld, pruefiNew]);
    const descQueryMs = performance.now() - descQueryStart;
    console.log(
      `[AhbDiff] Pruefi description query: ${descQueryMs.toFixed(1)}ms, formatVersion=${formatVersion}`
    );

    const oldRow = descriptionRows.find(r => r.pruefidentifikator === pruefiOld);
    const newRow = descriptionRows.find(r => r.pruefidentifikator === pruefiNew);

    if (!oldRow && !newRow) {
      throw new NotFoundError(
        `Neither Prüfidentifikator ${pruefiOld} nor ${pruefiNew} were found in format version ${formatVersion}`
      );
    }
    if (!oldRow) {
      throw new NotFoundError(
        `Prüfidentifikator ${pruefiOld} was not found in format version ${formatVersion}`
      );
    }
    if (!newRow) {
      throw new NotFoundError(
        `Prüfidentifikator ${pruefiNew} was not found in format version ${formatVersion}`
      );
    }

    // v_ahb_pruefi_diff only stores each unordered pair once, keyed by
    // old_pruefidentifikator < new_pruefidentifikator (lexicographically) - it's generated from a
    // JOIN across every Pruefi pair per format version, so storing both orderings would double an
    // already large view for no benefit. The caller's pruefiOld/pruefiNew have no inherent
    // "old/new" meaning (unlike format versions), so we query using the normalized (min, max) order
    // and swap the old/new sides back afterwards if the caller asked for the reverse order.
    const [queryOld, queryNew] =
      pruefiOld < pruefiNew ? [pruefiOld, pruefiNew] : [pruefiNew, pruefiOld];
    const needsSwap = queryOld !== pruefiOld;

    const query = `
      SELECT
        diff_status,
        changed_columns,
        id_path,
        sort_path,
        path,
        line_type,
        old_format_version,
        old_pruefidentifikator,
        old_segmentgroup_key,
        old_segment_code,
        old_data_element,
        old_qualifier,
        old_line_ahb_status,
        old_line_name,
        old_bedingung,
        old_bedingungsfehler,
        new_format_version,
        new_pruefidentifikator,
        new_segmentgroup_key,
        new_segment_code,
        new_data_element,
        new_qualifier,
        new_line_ahb_status,
        new_line_name,
        new_bedingung,
        new_bedingungsfehler
      FROM v_ahb_pruefi_diff
      WHERE old_format_version = ?
        AND old_pruefidentifikator = ?
        AND new_pruefidentifikator = ?
      ORDER BY sort_path ASC
    `;

    const diffQueryStart = performance.now();
    const rawRows: RawDiffRow[] = await AppDataSource.query(query, [
      formatVersion,
      queryOld,
      queryNew,
    ]);
    const diffQueryMs = performance.now() - diffQueryStart;
    console.log(
      `[AhbDiff] Pruefi diff query: ${diffQueryMs.toFixed(1)}ms, rows=${rawRows.length}, formatVersion=${formatVersion}, pruefiOld=${pruefiOld}, pruefiNew=${pruefiNew}`
    );

    const lines: AhbDiffLineJoined[] = rawRows.map(row => {
      const line = this.mapRawRowToLine(row);
      return needsSwap ? this.swapDiffSides(line) : line;
    });

    return {
      lines,
      meta: {
        format_version: formatVersion,
        pruefidentifikator_old: pruefiOld,
        pruefidentifikator_new: pruefiNew,
        description_old: oldRow?.description ?? undefined,
        description_new: newRow?.description ?? undefined,
      },
    };
  }

  /** Shared row-shaping logic between {@link getDiff} and {@link getPruefiDiff}. */
  private mapRawRowToLine(row: RawDiffRow): AhbDiffLineJoined {
    const hasOldData =
      row.old_segmentgroup_key !== null ||
      row.old_segment_code !== null ||
      row.old_data_element !== null ||
      row.old_qualifier !== null;

    const hasNewData =
      row.new_segmentgroup_key !== null ||
      row.new_segment_code !== null ||
      row.new_data_element !== null ||
      row.new_qualifier !== null;

    const changedColumns = row.changed_columns
      ? row.changed_columns
          .split(',')
          .map(c => c.trim())
          .filter(c => c.length > 0)
      : [];

    return {
      diff_status: row.diff_status,
      id_path: row.id_path,
      sort_path: row.sort_path,
      changed_columns: changedColumns,
      old: hasOldData
        ? {
            segmentgroup_key: row.old_segmentgroup_key,
            segment_code: row.old_segment_code,
            data_element: row.old_data_element,
            qualifier: row.old_qualifier,
            line_ahb_status: row.old_line_ahb_status,
            line_name: row.old_line_name,
            line_type: row.line_type,
            bedingung: row.old_bedingung,
          }
        : null,
      new: hasNewData
        ? {
            segmentgroup_key: row.new_segmentgroup_key,
            segment_code: row.new_segment_code,
            data_element: row.new_data_element,
            qualifier: row.new_qualifier,
            line_ahb_status: row.new_line_ahb_status,
            line_name: row.new_line_name,
            line_type: row.line_type,
            bedingung: row.new_bedingung,
          }
        : null,
    };
  }

  /**
   * Swap the old/new sides of a {@link getPruefiDiff} line, flipping added/deleted accordingly.
   * Used when the caller's pruefiOld is lexicographically greater than pruefiNew, since
   * v_ahb_pruefi_diff only stores each pair in ascending order.
   */
  private swapDiffSides(line: AhbDiffLineJoined): AhbDiffLineJoined {
    const diffStatus =
      line.diff_status === 'added'
        ? 'deleted'
        : line.diff_status === 'deleted'
          ? 'added'
          : line.diff_status;
    return {
      ...line,
      diff_status: diffStatus,
      old: line.new,
      new: line.old,
    };
  }

  public async getSummary(
    formatVersionNew: string,
    formatVersionOld: string
  ): Promise<AhbDiffSummary> {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const query = `
      SELECT
        COALESCE(new_pruefidentifikator, old_pruefidentifikator) as pruefi,
        SUM(CASE WHEN diff_status = 'added' THEN 1 ELSE 0 END) as added,
        SUM(CASE WHEN diff_status = 'deleted' THEN 1 ELSE 0 END) as deleted,
        SUM(CASE WHEN diff_status = 'modified' THEN 1 ELSE 0 END) as modified
      FROM v_ahb_formatversion_diff
      WHERE new_format_version = ? AND old_format_version = ?
      GROUP BY COALESCE(new_pruefidentifikator, old_pruefidentifikator)
    `;

    const queryStart = performance.now();
    const rows: { pruefi: string; added: number; deleted: number; modified: number }[] =
      await AppDataSource.query(query, [formatVersionNew, formatVersionOld]);
    const queryMs = performance.now() - queryStart;
    console.log(
      `[AhbDiff] Summary query: ${queryMs.toFixed(1)}ms, rows=${rows.length}, fvNew=${formatVersionNew}, fvOld=${formatVersionOld}`
    );

    const result: AhbDiffSummary = {};
    for (const row of rows) {
      result[row.pruefi] = {
        added: row.added,
        deleted: row.deleted,
        modified: row.modified,
      };
    }
    return result;
  }
}
