/**
 * AHB Diff Repository
 *
 * Uses the v_ahb_diff view which pre-computes diff status and joins both versions.
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

    // Query the v_ahb_diff view directly - it already has the diff logic built-in
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
      FROM v_ahb_diff
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
    // Map v_ahb_diff columns to the AhbDiffSide format expected by the frontend
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
   * Unlike {@link getDiff}, this cannot use the precomputed `v_ahb_diff` view: that view's
   * `version_pairs` CTE is restricted to `old.pruefidentifikator = new.pruefidentifikator` (see the
   * view definition), so it has no rows for a "different Prüfi, same format version" pair. Instead
   * this replicates the view's modified/unchanged/added/deleted logic directly against
   * `v_ahbtabellen`, scoped to the one explicit pair requested (rather than cross-joining every
   * Prüfi combination, which the view avoids for performance/generation-time reasons).
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
    // this query doesn't go through the precomputed v_ahb_diff view (which only ever generates
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

    const query = `
      -- Modified and unchanged rows (id_path exists for both Pruefis in this format version)
      SELECT
        CASE
          WHEN IFNULL(old_tbl.line_ahb_status, '') != IFNULL(new_tbl.line_ahb_status, '')
              OR IFNULL(old_tbl.bedingung, '') != IFNULL(new_tbl.bedingung, '')
              OR IFNULL(old_tbl.line_name, '') != IFNULL(new_tbl.line_name, '')
              THEN 'modified'
          ELSE 'unchanged'
        END AS diff_status,
        CASE
          WHEN IFNULL(old_tbl.line_ahb_status, '') != IFNULL(new_tbl.line_ahb_status, '')
              OR IFNULL(old_tbl.bedingung, '') != IFNULL(new_tbl.bedingung, '')
              OR IFNULL(old_tbl.line_name, '') != IFNULL(new_tbl.line_name, '')
              THEN
              TRIM(
                      CASE
                          WHEN IFNULL(old_tbl.line_ahb_status, '') != IFNULL(new_tbl.line_ahb_status, '')
                              THEN 'line_ahb_status, '
                          ELSE '' END ||
                      CASE
                          WHEN IFNULL(old_tbl.bedingung, '') != IFNULL(new_tbl.bedingung, '')
                              THEN 'bedingung, '
                          ELSE '' END ||
                      CASE
                          WHEN IFNULL(old_tbl.line_name, '') != IFNULL(new_tbl.line_name, '')
                              THEN 'line_name'
                          ELSE '' END
                  , ', ')
          ELSE NULL
        END AS changed_columns,
        new_tbl.id_path AS id_path,
        new_tbl.sort_path AS sort_path,
        new_tbl.path AS path,
        new_tbl.line_type AS line_type,
        old_tbl.format_version AS old_format_version,
        old_tbl.pruefidentifikator AS old_pruefidentifikator,
        old_tbl.segmentgroup_key AS old_segmentgroup_key,
        old_tbl.segment_code AS old_segment_code,
        old_tbl.data_element AS old_data_element,
        old_tbl.qualifier AS old_qualifier,
        old_tbl.line_ahb_status AS old_line_ahb_status,
        old_tbl.line_name AS old_line_name,
        old_tbl.bedingung AS old_bedingung,
        old_tbl.bedingungsfehler AS old_bedingungsfehler,
        new_tbl.format_version AS new_format_version,
        new_tbl.pruefidentifikator AS new_pruefidentifikator,
        new_tbl.segmentgroup_key AS new_segmentgroup_key,
        new_tbl.segment_code AS new_segment_code,
        new_tbl.data_element AS new_data_element,
        new_tbl.qualifier AS new_qualifier,
        new_tbl.line_ahb_status AS new_line_ahb_status,
        new_tbl.line_name AS new_line_name,
        new_tbl.bedingung AS new_bedingung,
        new_tbl.bedingungsfehler AS new_bedingungsfehler
      FROM v_ahbtabellen new_tbl
      JOIN v_ahbtabellen old_tbl
        ON old_tbl.id_path = new_tbl.id_path
        AND old_tbl.format_version = ?
        AND old_tbl.pruefidentifikator = ?
      WHERE new_tbl.format_version = ?
        AND new_tbl.pruefidentifikator = ?

      UNION ALL

      -- Added rows (exist for the new Pruefi but not for the old one)
      SELECT
        'added' AS diff_status,
        NULL AS changed_columns,
        new_tbl.id_path,
        new_tbl.sort_path,
        new_tbl.path,
        new_tbl.line_type,
        ? AS old_format_version,
        ? AS old_pruefidentifikator,
        NULL AS old_segmentgroup_key,
        NULL AS old_segment_code,
        NULL AS old_data_element,
        NULL AS old_qualifier,
        NULL AS old_line_ahb_status,
        NULL AS old_line_name,
        NULL AS old_bedingung,
        NULL AS old_bedingungsfehler,
        new_tbl.format_version AS new_format_version,
        new_tbl.pruefidentifikator AS new_pruefidentifikator,
        new_tbl.segmentgroup_key AS new_segmentgroup_key,
        new_tbl.segment_code AS new_segment_code,
        new_tbl.data_element AS new_data_element,
        new_tbl.qualifier AS new_qualifier,
        new_tbl.line_ahb_status AS new_line_ahb_status,
        new_tbl.line_name AS new_line_name,
        new_tbl.bedingung AS new_bedingung,
        new_tbl.bedingungsfehler AS new_bedingungsfehler
      FROM v_ahbtabellen new_tbl
      WHERE new_tbl.format_version = ?
        AND new_tbl.pruefidentifikator = ?
        AND NOT EXISTS (
          SELECT 1 FROM v_ahbtabellen old_tbl
          WHERE old_tbl.format_version = ?
            AND old_tbl.pruefidentifikator = ?
            AND old_tbl.id_path = new_tbl.id_path
        )

      UNION ALL

      -- Deleted rows (exist for the old Pruefi but not for the new one)
      SELECT
        'deleted' AS diff_status,
        NULL AS changed_columns,
        old_tbl.id_path,
        old_tbl.sort_path,
        old_tbl.path,
        old_tbl.line_type,
        old_tbl.format_version AS old_format_version,
        old_tbl.pruefidentifikator AS old_pruefidentifikator,
        old_tbl.segmentgroup_key AS old_segmentgroup_key,
        old_tbl.segment_code AS old_segment_code,
        old_tbl.data_element AS old_data_element,
        old_tbl.qualifier AS old_qualifier,
        old_tbl.line_ahb_status AS old_line_ahb_status,
        old_tbl.line_name AS old_line_name,
        old_tbl.bedingung AS old_bedingung,
        old_tbl.bedingungsfehler AS old_bedingungsfehler,
        ? AS new_format_version,
        ? AS new_pruefidentifikator,
        NULL AS new_segmentgroup_key,
        NULL AS new_segment_code,
        NULL AS new_data_element,
        NULL AS new_qualifier,
        NULL AS new_line_ahb_status,
        NULL AS new_line_name,
        NULL AS new_bedingung,
        NULL AS new_bedingungsfehler
      FROM v_ahbtabellen old_tbl
      WHERE old_tbl.format_version = ?
        AND old_tbl.pruefidentifikator = ?
        AND NOT EXISTS (
          SELECT 1 FROM v_ahbtabellen new_tbl
          WHERE new_tbl.format_version = ?
            AND new_tbl.pruefidentifikator = ?
            AND new_tbl.id_path = old_tbl.id_path
        )

      ORDER BY sort_path ASC
    `;

    const diffQueryStart = performance.now();
    const rawRows: RawDiffRow[] = await AppDataSource.query(query, [
      formatVersion,
      pruefiOld,
      formatVersion,
      pruefiNew,
      formatVersion,
      pruefiOld,
      formatVersion,
      pruefiNew,
      formatVersion,
      pruefiOld,
      formatVersion,
      pruefiNew,
      formatVersion,
      pruefiOld,
      formatVersion,
      pruefiNew,
    ]);
    const diffQueryMs = performance.now() - diffQueryStart;
    console.log(
      `[AhbDiff] Pruefi diff query: ${diffQueryMs.toFixed(1)}ms, rows=${rawRows.length}, formatVersion=${formatVersion}, pruefiOld=${pruefiOld}, pruefiNew=${pruefiNew}`
    );

    const lines: AhbDiffLineJoined[] = rawRows.map(row => this.mapRawRowToLine(row));

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
      FROM v_ahb_diff
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
