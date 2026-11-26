/**
 * Segment group brackets for the AHB table: each segment group gets a thin vertical line from
 * its header row to its last row, one level further in per nesting. Neighbouring groups (two
 * SG8) are separate brackets on the same level; a group inside another (SG10 in SG8) is a
 * bracket further in. Segments, data elements and codes draw no lines of their own.
 *
 * A group is identified by its header's `id_path`, which carries the qualifier that makes it a
 * group of its own: `SG4>SG8+Z79>` and `SG4>SG8+ZH0>` are two SG8. A row belongs to the
 * innermost open group whose path its own `id_path` starts with (`SG4>SG8+Z79>SEQ>…`).
 * A group that repeats without a qualifier has `#n` on its header only (`SG29>#1`, `SG29>#2`;
 * the rows inside are `SG29>LIN>…`), so the `#n` is ignored for membership, and a new header
 * with the same path closes the previous group.
 */

/** How a row meets the bracket of one enclosing segment group. */
export type BracketPart = 'start' | 'middle' | 'end' | 'single';

export interface RowGuide {
  /** One per enclosing segment group (the row's own, if it is one, included), outermost first. */
  brackets: BracketPart[];
  /** For a segment group's header row: the index of the group's last row. */
  lastRow?: number;
}

export interface GuideLine {
  /** The line's `id_path`; null/undefined if it has none. */
  idPath: string | null | undefined;
  isSegmentGroup: boolean;
}

/** `SG29>#2` → `SG29>`: the prefix the rows of a group start with. */
const memberPrefix = (idPath: string): string => idPath.replace(/#\d+$/, '');

/** The brackets each row draws, in row order; null for a row without `id_path`. */
export function treeGuides(lines: GuideLine[]): (RowGuide | null)[] {
  const enclosing: number[][] = lines.map(() => []); // per row: the group rows it lies in
  const lastRow = new Map<number, number>(); // group row → its last row
  const prefixOf = (row: number): string => memberPrefix(lines[row].idPath as string);

  const stack: number[] = []; // open group rows, outermost first
  lines.forEach((line, row) => {
    const path = line.idPath;
    if (!path) return;
    const top = () => stack[stack.length - 1];
    if (line.isSegmentGroup) {
      // A header closes every group it is not inside, and a same-path sibling (SG29>#1 → #2).
      const own = memberPrefix(path);
      while (stack.length > 0 && (!path.startsWith(prefixOf(top())) || own === prefixOf(top()))) {
        stack.pop();
      }
      stack.push(row);
    } else {
      while (stack.length > 0 && !path.startsWith(prefixOf(top()))) stack.pop();
    }
    enclosing[row] = [...stack];
    for (const group of stack) lastRow.set(group, row);
  });

  return lines.map((line, row) => {
    if (!line.idPath) return null;
    return {
      ...(line.isSegmentGroup ? { lastRow: lastRow.get(row) } : {}),
      brackets: enclosing[row].map(group => {
        const starts = group === row;
        const ends = lastRow.get(group) === row;
        return starts && ends ? 'single' : starts ? 'start' : ends ? 'end' : 'middle';
      }),
    };
  });
}

/**
 * The rows hidden by collapsed groups: all rows of a group but its header. Groups are collapsed
 * by header row, so of several neighbouring SG8 only the collapsed one hides its rows.
 */
export function hiddenRows(guides: (RowGuide | null)[], collapsed: Set<number>): Set<number> {
  const hidden = new Set<number>();
  for (const row of collapsed) {
    const last = guides[row]?.lastRow;
    if (last === undefined) continue;
    for (let r = row + 1; r <= last; r++) hidden.add(r);
  }
  return hidden;
}
