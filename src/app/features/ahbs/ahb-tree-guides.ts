/**
 * Tree guide lines for the AHB table: which vertical lines and elbows each row draws so the
 * table shows its nesting, like the indent guides of a code editor.
 *
 * The nesting comes from each line's position in the MIG (an index path such as `10-3-0`):
 * a row hangs below the nearest row above it whose MIG node contains its own.
 */

export interface RowGuide {
  /** Number of ancestor rows. */
  depth: number;
  /** No later sibling: the elbow ends here (└) instead of passing on (├). */
  last: boolean;
  /** Per level left of the elbow: whether an ancestor's line passes this row (│). */
  through: boolean[];
  /** Per level, for a row inserted below this one: the lines that pass it. */
  below: boolean[];
}

const contains = (ancestor: string, path: string): boolean => path.startsWith(`${ancestor}-`);

/** The guide of each row, in row order; null for a row without a MIG position. */
export function treeGuides(paths: (string | undefined)[]): (RowGuide | null)[] {
  const parent: number[] = paths.map(() => -1);
  const ancestors: number[][] = paths.map(() => []);
  const lastChild = new Map<number, number>(); // parent row (-1: top) → its last child row
  const hasChildren = new Set<number>();

  const stack: number[] = [];
  paths.forEach((path, row) => {
    if (path === undefined) return;
    while (stack.length > 0 && !contains(paths[stack[stack.length - 1]] as string, path)) {
      stack.pop();
    }
    parent[row] = stack.length > 0 ? stack[stack.length - 1] : -1;
    ancestors[row] = [...stack];
    lastChild.set(parent[row], row);
    if (parent[row] >= 0) hasChildren.add(parent[row]);
    stack.push(row);
  });

  const isLast = (row: number): boolean => lastChild.get(parent[row]) === row;
  return paths.map((path, row) => {
    if (path === undefined) return null;
    const through = ancestors[row].map(a => !isLast(a));
    const last = isLast(row);
    return {
      depth: ancestors[row].length,
      last,
      through,
      below: [...through, !last, hasChildren.has(row)],
    };
  });
}
