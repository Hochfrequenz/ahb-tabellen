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
}

export interface AhbDiffLineJoined {
  diff_status: string;
  id_path: string;
  sort_path: string;
  old: AhbDiffSide | null;
  new: AhbDiffSide | null;
}

export interface AhbDiffResult {
  lines: AhbDiffLineJoined[];
  meta: {
    pruefidentifikator: string;
    format_version_a: string;
    format_version_b: string;
    description_a?: string;
    description_b?: string;
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
    formatVersionA: string,
    formatVersionB: string
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
      formatVersionA, // new version
      formatVersionB, // old version
    ]);
    const diffQueryMs = performance.now() - diffQueryStart;
    console.log(
      `[AhbDiff] Main diff query: ${diffQueryMs.toFixed(1)}ms, rows=${rawRows.length}, pruefi=${pruefi}, fvA=${formatVersionA}, fvB=${formatVersionB}`
    );

    if (rawRows.length === 0) {
      throw new NotFoundError(
        `No diff found for pruefi ${pruefi} between ${formatVersionA} and ${formatVersionB}`
      );
    }

    // Transform raw rows into the expected API structure
    // Map v_ahb_diff columns to the AhbDiffSide format expected by the frontend
    const lines: AhbDiffLineJoined[] = rawRows.map(row => {
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

      return {
        diff_status: row.diff_status,
        id_path: row.id_path,
        sort_path: row.sort_path,
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
    });

    // Fetch descriptions for both versions
    const descriptionQuery = `
      SELECT DISTINCT description, format_version
      FROM v_ahbtabellen
      WHERE pruefidentifikator = ?
        AND format_version IN (?, ?)
    `;
    const descQueryStart = performance.now();
    const descriptionRows: { description: string | null; format_version: string }[] =
      await AppDataSource.query(descriptionQuery, [pruefi, formatVersionA, formatVersionB]);
    const descQueryMs = performance.now() - descQueryStart;
    console.log(`[AhbDiff] Description query: ${descQueryMs.toFixed(1)}ms, pruefi=${pruefi}`);

    const descriptionA = descriptionRows.find(
      r => r.format_version === formatVersionA
    )?.description;
    const descriptionB = descriptionRows.find(
      r => r.format_version === formatVersionB
    )?.description;

    return {
      lines,
      meta: {
        pruefidentifikator: pruefi,
        format_version_a: formatVersionA,
        format_version_b: formatVersionB,
        description_a: descriptionA ?? undefined,
        description_b: descriptionB ?? undefined,
      },
    };
  }
}
