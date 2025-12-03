import { NotFoundError } from '../infrastructure/errors';
import { AppDataSource } from '../infrastructure/database';
import { logger } from '../infrastructure/logger';

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
  old_segmentgroup_key: string | null;
  old_segment_code: string | null;
  old_data_element: string | null;
  old_qualifier: string | null;
  old_line_ahb_status: string | null;
  old_line_name: string | null;
  old_line_type: string | null;
  old_bedingung: string | null;
  new_segmentgroup_key: string | null;
  new_segment_code: string | null;
  new_data_element: string | null;
  new_qualifier: string | null;
  new_line_ahb_status: string | null;
  new_line_name: string | null;
  new_line_type: string | null;
  new_bedingung: string | null;
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

    // Three-part query using UNION ALL:
    // 1. Modified/Unchanged: from v_ahb_diff joined with v_ahbtabellen on both sides
    // 2. Deleted: rows in old version but NOT in new version
    // 3. Added: rows in new version but NOT in old version
    //
    // Parameters order: formatVersionA, formatVersionB, pruefi, pruefi (for part 1)
    //                   pruefi, formatVersionB, pruefi, formatVersionA (for part 2 - deleted)
    //                   pruefi, formatVersionA, pruefi, formatVersionB (for part 3 - added)
    const query = `
      SELECT * FROM (
        -- Part 1: Modified/Unchanged from v_ahb_diff
        SELECT
          d.diff_status,
          d.id_path,
          d.sort_path,
          old_tbl.segmentgroup_key AS old_segmentgroup_key,
          old_tbl.segment_code AS old_segment_code,
          old_tbl.data_element AS old_data_element,
          old_tbl.qualifier AS old_qualifier,
          old_tbl.line_ahb_status AS old_line_ahb_status,
          old_tbl.line_name AS old_line_name,
          old_tbl.line_type AS old_line_type,
          old_tbl.bedingung AS old_bedingung,
          new_tbl.segmentgroup_key AS new_segmentgroup_key,
          new_tbl.segment_code AS new_segment_code,
          new_tbl.data_element AS new_data_element,
          new_tbl.qualifier AS new_qualifier,
          new_tbl.line_ahb_status AS new_line_ahb_status,
          new_tbl.line_name AS new_line_name,
          new_tbl.line_type AS new_line_type,
          new_tbl.bedingung AS new_bedingung
        FROM v_ahb_diff d
        LEFT JOIN v_ahbtabellen old_tbl
          ON d.id_path = old_tbl.id_path
          AND d.pruefidentifikator_b = old_tbl.pruefidentifikator
          AND d.format_version_b = old_tbl.format_version
        LEFT JOIN v_ahbtabellen new_tbl
          ON d.id_path = new_tbl.id_path
          AND d.pruefidentifikator_a = new_tbl.pruefidentifikator
          AND d.format_version_a = new_tbl.format_version
        WHERE d.format_version_a = ?
          AND d.format_version_b = ?
          AND d.pruefidentifikator_a = ?
          AND d.pruefidentifikator_b = ?

        UNION ALL

        -- Part 2: Deleted - rows in old version (B) but NOT in new version (A)
        SELECT
          'deleted' AS diff_status,
          old_tbl.id_path,
          old_tbl.sort_path,
          old_tbl.segmentgroup_key AS old_segmentgroup_key,
          old_tbl.segment_code AS old_segment_code,
          old_tbl.data_element AS old_data_element,
          old_tbl.qualifier AS old_qualifier,
          old_tbl.line_ahb_status AS old_line_ahb_status,
          old_tbl.line_name AS old_line_name,
          old_tbl.line_type AS old_line_type,
          old_tbl.bedingung AS old_bedingung,
          NULL AS new_segmentgroup_key,
          NULL AS new_segment_code,
          NULL AS new_data_element,
          NULL AS new_qualifier,
          NULL AS new_line_ahb_status,
          NULL AS new_line_name,
          NULL AS new_line_type,
          NULL AS new_bedingung
        FROM v_ahbtabellen old_tbl
        LEFT JOIN v_ahbtabellen new_tbl
          ON old_tbl.id_path = new_tbl.id_path
          AND new_tbl.pruefidentifikator = ?
          AND new_tbl.format_version = ?
        WHERE old_tbl.pruefidentifikator = ?
          AND old_tbl.format_version = ?
          AND new_tbl.id_path IS NULL

        UNION ALL

        -- Part 3: Added - rows in new version (A) but NOT in old version (B)
        SELECT
          'added' AS diff_status,
          new_tbl.id_path,
          new_tbl.sort_path,
          NULL AS old_segmentgroup_key,
          NULL AS old_segment_code,
          NULL AS old_data_element,
          NULL AS old_qualifier,
          NULL AS old_line_ahb_status,
          NULL AS old_line_name,
          NULL AS old_line_type,
          NULL AS old_bedingung,
          new_tbl.segmentgroup_key AS new_segmentgroup_key,
          new_tbl.segment_code AS new_segment_code,
          new_tbl.data_element AS new_data_element,
          new_tbl.qualifier AS new_qualifier,
          new_tbl.line_ahb_status AS new_line_ahb_status,
          new_tbl.line_name AS new_line_name,
          new_tbl.line_type AS new_line_type,
          new_tbl.bedingung AS new_bedingung
        FROM v_ahbtabellen new_tbl
        LEFT JOIN v_ahbtabellen old_tbl
          ON new_tbl.id_path = old_tbl.id_path
          AND old_tbl.pruefidentifikator = ?
          AND old_tbl.format_version = ?
        WHERE new_tbl.pruefidentifikator = ?
          AND new_tbl.format_version = ?
          AND old_tbl.id_path IS NULL
      ) combined
      ORDER BY combined.sort_path ASC
    `;

    const diffQueryStart = performance.now();
    const rawRows: RawDiffRow[] = await AppDataSource.query(query, [
      // Part 1: v_ahb_diff
      formatVersionA,
      formatVersionB,
      pruefi,
      pruefi,
      // Part 2: Deleted (old exists, new doesn't)
      pruefi,
      formatVersionA,
      pruefi,
      formatVersionB,
      // Part 3: Added (new exists, old doesn't)
      pruefi,
      formatVersionB,
      pruefi,
      formatVersionA,
    ]);
    const diffQueryMs = performance.now() - diffQueryStart;
    logger.info(
      `[AhbDiff] Main diff query: ${diffQueryMs.toFixed(1)}ms, rows=${rawRows.length}, pruefi=${pruefi}, fvA=${formatVersionA}, fvB=${formatVersionB}`
    );

    if (rawRows.length === 0) {
      throw new NotFoundError(
        `No diff found for pruefi ${pruefi} between ${formatVersionA} and ${formatVersionB}`
      );
    }

    // Transform raw rows into the expected structure
    const lines: AhbDiffLineJoined[] = rawRows.map(row => {
      const hasOldData =
        row.old_segmentgroup_key !== null ||
        row.old_segment_code !== null ||
        row.old_data_element !== null ||
        row.old_qualifier !== null ||
        row.old_line_ahb_status !== null ||
        row.old_line_name !== null;

      const hasNewData =
        row.new_segmentgroup_key !== null ||
        row.new_segment_code !== null ||
        row.new_data_element !== null ||
        row.new_qualifier !== null ||
        row.new_line_ahb_status !== null ||
        row.new_line_name !== null;

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
              line_type: row.old_line_type,
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
              line_type: row.new_line_type,
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
    logger.info(`[AhbDiff] Description query: ${descQueryMs.toFixed(1)}ms, pruefi=${pruefi}`);

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
