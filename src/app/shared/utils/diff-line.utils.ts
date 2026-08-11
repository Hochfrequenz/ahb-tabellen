import { AhbDiffLine } from '../../core/api';

/**
 * Columns that are always visible in the comparison table, regardless of the
 * "Bedingungen" column toggle (`showConditionsColumn`).
 *
 * The `bedingung` column is deliberately excluded: it is hidden by default and only
 * revealed via the toggle, which is exactly why a change confined to it can be invisible.
 */
export const VISIBLE_DIFF_COLUMNS = [
  'segmentgroup_key',
  'segment_code',
  'data_element',
  'qualifier',
  'line_name',
  'line_ahb_status',
] as const;

/**
 * True when a row is flagged `modified` but the change sits exclusively in the
 * (by default hidden) `bedingung` column — i.e. none of the always-visible columns changed.
 *
 * These rows appear highlighted as "changed" while looking identical on both sides in the
 * default view, which confuses users (see issue #895). Callers use this to surface a hint.
 */
export function isHiddenBedingungChange(line: AhbDiffLine): boolean {
  if (line.diff_status !== 'modified') {
    return false;
  }
  const changed = line.changed_columns ?? [];
  return (
    changed.includes('bedingung') && !VISIBLE_DIFF_COLUMNS.some(column => changed.includes(column))
  );
}
