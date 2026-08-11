import { AhbDiffLine } from '../../core/api';
import { isHiddenBedingungChange, VISIBLE_DIFF_COLUMNS } from './diff-line.utils';

function makeLine(overrides: Partial<AhbDiffLine>): AhbDiffLine {
  return {
    diff_status: 'modified',
    id_path: 'id',
    sort_path: 'sort',
    changed_columns: [],
    ...overrides,
  };
}

describe('diff-line.utils', () => {
  describe('isHiddenBedingungChange', () => {
    it('is true when only the bedingung changed on a modified row', () => {
      const line = makeLine({ changed_columns: ['bedingung'] });
      expect(isHiddenBedingungChange(line)).toBe(true);
    });

    it('is false when a visible column changed alongside the bedingung', () => {
      const line = makeLine({ changed_columns: ['line_ahb_status', 'bedingung'] });
      expect(isHiddenBedingungChange(line)).toBe(false);
    });

    it('is false for every individual visible column change', () => {
      for (const column of VISIBLE_DIFF_COLUMNS) {
        const line = makeLine({ changed_columns: [column] });
        expect(isHiddenBedingungChange(line)).toBe(false);
      }
    });

    it('is false when the row is not modified, even if bedingung is listed', () => {
      for (const status of ['added', 'deleted', 'unchanged'] as const) {
        const line = makeLine({ diff_status: status, changed_columns: ['bedingung'] });
        expect(isHiddenBedingungChange(line)).toBe(false);
      }
    });

    it('is false when changed_columns is empty or missing', () => {
      expect(isHiddenBedingungChange(makeLine({ changed_columns: [] }))).toBe(false);
      expect(isHiddenBedingungChange(makeLine({ changed_columns: undefined }))).toBe(false);
    });
  });
});
