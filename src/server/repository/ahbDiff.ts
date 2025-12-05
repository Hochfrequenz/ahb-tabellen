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
  id_path: string;
  sort_path: string;
  type: string | null;
  // Version A (new) columns
  segmentgroup_name_a: string | null;
  segmentgroup_ahb_status_a: string | null;
  segment_id_a: string | null;
  segment_name_a: string | null;
  segment_ahb_status_a: string | null;
  dataelementgroup_id_a: string | null;
  dataelementgroup_name_a: string | null;
  dataelement_id_a: string | null;
  dataelement_name_a: string | null;
  dataelement_ahb_status_a: string | null;
  code_value_a: string | null;
  code_name_a: string | null;
  code_ahb_status_a: string | null;
  // Version B (old) columns
  segmentgroup_name_b: string | null;
  segmentgroup_ahb_status_b: string | null;
  segment_id_b: string | null;
  segment_name_b: string | null;
  segment_ahb_status_b: string | null;
  dataelementgroup_id_b: string | null;
  dataelementgroup_name_b: string | null;
  dataelement_id_b: string | null;
  dataelement_name_b: string | null;
  dataelement_ahb_status_b: string | null;
  code_value_b: string | null;
  code_name_b: string | null;
  code_ahb_status_b: string | null;
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
    // format_version_a = new version, format_version_b = old version
    const query = `
      SELECT
        diff_status,
        id_path,
        sort_path,
        type,
        segmentgroup_name_a,
        segmentgroup_ahb_status_a,
        segment_id_a,
        segment_name_a,
        segment_ahb_status_a,
        dataelementgroup_id_a,
        dataelementgroup_name_a,
        dataelement_id_a,
        dataelement_name_a,
        dataelement_ahb_status_a,
        code_value_a,
        code_name_a,
        code_ahb_status_a,
        segmentgroup_name_b,
        segmentgroup_ahb_status_b,
        segment_id_b,
        segment_name_b,
        segment_ahb_status_b,
        dataelementgroup_id_b,
        dataelementgroup_name_b,
        dataelement_id_b,
        dataelement_name_b,
        dataelement_ahb_status_b,
        code_value_b,
        code_name_b,
        code_ahb_status_b
      FROM v_ahb_diff
      WHERE pruefidentifikator_a = ?
        AND pruefidentifikator_b = ?
        AND format_version_a = ?
        AND format_version_b = ?
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
        row.segmentgroup_name_b !== null ||
        row.segment_id_b !== null ||
        row.dataelement_id_b !== null ||
        row.code_value_b !== null;

      const hasNewData =
        row.segmentgroup_name_a !== null ||
        row.segment_id_a !== null ||
        row.dataelement_id_a !== null ||
        row.code_value_a !== null;

      return {
        diff_status: row.diff_status,
        id_path: row.id_path,
        sort_path: row.sort_path,
        old: hasOldData
          ? {
              segmentgroup_key: row.segmentgroup_name_b,
              segment_code: row.segment_id_b,
              data_element: row.dataelement_id_b,
              qualifier: row.code_value_b,
              line_ahb_status: this.getLineAhbStatus(row, 'b'),
              line_name: this.getLineName(row, 'b'),
              line_type: row.type,
              bedingung: null,
            }
          : null,
        new: hasNewData
          ? {
              segmentgroup_key: row.segmentgroup_name_a,
              segment_code: row.segment_id_a,
              data_element: row.dataelement_id_a,
              qualifier: row.code_value_a,
              line_ahb_status: this.getLineAhbStatus(row, 'a'),
              line_name: this.getLineName(row, 'a'),
              line_type: row.type,
              bedingung: null,
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

  /**
   * Get the appropriate AHB status based on the row type
   */
  private getLineAhbStatus(row: RawDiffRow, version: 'a' | 'b'): string | null {
    if (version === 'a') {
      return (
        row.code_ahb_status_a ??
        row.dataelement_ahb_status_a ??
        row.segment_ahb_status_a ??
        row.segmentgroup_ahb_status_a
      );
    }
    return (
      row.code_ahb_status_b ??
      row.dataelement_ahb_status_b ??
      row.segment_ahb_status_b ??
      row.segmentgroup_ahb_status_b
    );
  }

  /**
   * Get the appropriate name based on the row type
   */
  private getLineName(row: RawDiffRow, version: 'a' | 'b'): string | null {
    if (version === 'a') {
      return (
        row.code_name_a ??
        row.dataelement_name_a ??
        row.dataelementgroup_name_a ??
        row.segment_name_a ??
        row.segmentgroup_name_a
      );
    }
    return (
      row.code_name_b ??
      row.dataelement_name_b ??
      row.dataelementgroup_name_b ??
      row.segment_name_b ??
      row.segmentgroup_name_b
    );
  }
}
