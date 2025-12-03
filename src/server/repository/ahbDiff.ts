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

    // Optimized query using CTEs to materialize old/new versions once
    // Then uses FULL OUTER JOIN logic (LEFT JOIN + UNION for deleted)
    // to compute diff_status based on presence and content comparison
    //
    // Parameters: pruefi, formatVersionB (old), pruefi, formatVersionA (new)
    const query = `
      WITH old_version AS (
        SELECT * FROM v_ahbtabellen
        WHERE pruefidentifikator = ? AND format_version = ?
      ),
      new_version AS (
        SELECT * FROM v_ahbtabellen
        WHERE pruefidentifikator = ? AND format_version = ?
      )
      SELECT * FROM (
        -- Main join: added, modified, unchanged (new LEFT JOIN old)
        SELECT
          CASE
            WHEN old_tbl.id_path IS NULL THEN 'added'
            WHEN old_tbl.line_ahb_status != new_tbl.line_ahb_status
              OR old_tbl.bedingung != new_tbl.bedingung
              OR old_tbl.line_name != new_tbl.line_name
            THEN 'modified'
            ELSE 'unchanged'
          END AS diff_status,
          COALESCE(new_tbl.id_path, old_tbl.id_path) AS id_path,
          COALESCE(new_tbl.sort_path, old_tbl.sort_path) AS sort_path,
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
        FROM new_version new_tbl
        LEFT JOIN old_version old_tbl ON new_tbl.id_path = old_tbl.id_path

        UNION ALL

        -- Deleted rows (in old but not in new)
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
        FROM old_version old_tbl
        LEFT JOIN new_version new_tbl ON old_tbl.id_path = new_tbl.id_path
        WHERE new_tbl.id_path IS NULL
      ) combined
      ORDER BY combined.sort_path ASC
    `;

    const diffQueryStart = performance.now();
    const rawRows: RawDiffRow[] = await AppDataSource.query(query, [
      // CTE parameters
      pruefi,
      formatVersionB, // old version
      pruefi,
      formatVersionA, // new version
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
