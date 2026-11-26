/**
 * Segment group brackets for the AHB table: each segment group gets a thin vertical line from
 * its header row to its last row, one level further in per nesting. Neighbouring groups (two
 * SG8) are separate brackets on the same level; a group inside another (SG10 in SG8) is a
 * bracket further in. Segments, data elements and codes draw no lines of their own.
 *
 * Which rows a group spans comes from each line's position in the MIG (an index path such as
 * `10-48-2`): a row belongs to a group if the group's MIG node contains its own.
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
  /** The line's MIG index path; undefined if it has none. */
  path: string | undefined;
  isSegmentGroup: boolean;
}

const within = (group: string, path: string): boolean =>
  path === group || path.startsWith(`${group}-`);

/** The brackets each row draws, in row order; null for a row without a MIG position. */
export function treeGuides(lines: GuideLine[]): (RowGuide | null)[] {
  const enclosing: number[][] = lines.map(() => []); // per row: the group rows it lies in
  const lastRow = new Map<number, number>(); // group row → its last row

  const stack: number[] = []; // open group rows, outermost first
  lines.forEach((line, row) => {
    const path = line.path;
    if (path === undefined) return;
    while (stack.length > 0 && !within(lines[stack[stack.length - 1]].path as string, path)) {
      stack.pop();
    }
    if (line.isSegmentGroup) stack.push(row);
    enclosing[row] = [...stack];
    for (const group of stack) lastRow.set(group, row);
  });

  return lines.map((line, row) => {
    if (line.path === undefined) return null;
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
