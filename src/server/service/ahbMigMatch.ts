/**
 * Matching AHB lines to MIG elements.
 *
 * There is no link table between the two; both carry an `id_path` though, e.g.
 * `SG4+24>SG6+Z13>RFF>C_C506>D_1153>Z13>` (key, `+qualifier`, `#repetition` for a repeated
 * data element). The paths differ in three ways the matcher has to bridge:
 * - the AHB table leaves out levels (a code line without its data element group line), so a
 *   line is resolved from the root of the MIG, step by step, not from its parent line;
 * - either side may lack a qualifier the other has (AHB `SG1+ACW` vs MIG `SG1`, or AHB `SG27`
 *   vs MIG `SG27+Z01`/`SG27+Z64`); then the variant that leads on to the rest of the path wins;
 * - the MIG does not list every qualifier variant (UTILMD S2.2 has no `SG6+Z51`); then another
 *   variant with the same structure stands in, and the match is marked as not exact.
 */

export interface PathStep {
  key: string;
  qualifier: string | undefined;
  repetition: string | undefined;
}

export interface MatchNode<T> {
  step: PathStep;
  value: T;
  children: MatchNode<T>[];
}

export interface AhbLinePath {
  id: string;
  idPath: string | null;
}

export interface LineMatch<T> {
  id: string;
  value: T;
  /** Child indexes from the MIG root, e.g. `6-0-1` (the MIG view's deep link). */
  indexPath: string;
  /** False when a qualifier on the way differs between AHB and MIG. */
  exact: boolean;
}

const STEP = /^([^+#]+)(?:\+([^#]*))?(?:#(\d+))?$/;

/** `SG4+24>DTM+137>C_C507>D_2005>#2` → its steps; the `#n` belongs to the step before it. */
export function parseIdPath(idPath: string | null | undefined): PathStep[] {
  if (!idPath) return [];
  return idPath
    .replace(/>#(\d+)$/, '#$1>')
    .split('>')
    .filter(part => part !== '')
    .map(part => {
      const m = STEP.exec(part);
      return m
        ? { key: m[1], qualifier: m[2] || undefined, repetition: m[3] }
        : { key: part, qualifier: undefined, repetition: undefined };
    });
}

const QUALIFIER_WEIGHT = 4;
const REPETITION_WEIGHT = 1;

/**
 * How well a MIG step fits an AHB step: undefined if the keys differ, else a score that rises
 * with each qualifier/repetition both have and agree on and falls with each they disagree on.
 */
function stepScore(ahb: PathStep, mig: PathStep): number | undefined {
  if (ahb.key !== mig.key) return undefined;
  let score = 0;
  if (ahb.qualifier && mig.qualifier) {
    score += ahb.qualifier === mig.qualifier ? QUALIFIER_WEIGHT : -QUALIFIER_WEIGHT;
  }
  if (ahb.repetition && mig.repetition) {
    score += ahb.repetition === mig.repetition ? REPETITION_WEIGHT : -REPETITION_WEIGHT;
  }
  return score;
}

interface Best<T> {
  node: MatchNode<T>;
  indexPath: number[];
  score: number;
  exact: boolean;
}

/** The best-scoring MIG node for `steps[i..]` below `pool`; the first wins a tie. */
function bestMatch<T>(pool: MatchNode<T>[], steps: PathStep[], i: number): Best<T> | undefined {
  let best: Best<T> | undefined;
  pool.forEach((node, index) => {
    const score = stepScore(steps[i], node.step);
    if (score === undefined) return;
    const exact = score >= 0;
    let candidate: Best<T> | undefined;
    if (i === steps.length - 1) {
      candidate = { node, indexPath: [index], score, exact };
    } else {
      const rest = bestMatch(node.children, steps, i + 1);
      if (rest) {
        candidate = {
          node: rest.node,
          indexPath: [index, ...rest.indexPath],
          score: score + rest.score,
          exact: exact && rest.exact,
        };
      }
    }
    if (candidate && (!best || candidate.score > best.score)) {
      best = candidate;
    }
  });
  return best;
}

/** The MIG node of each AHB line (null where the MIG has none), in the order of `lines`. */
export function matchAhbLines<T>(
  roots: MatchNode<T>[],
  lines: AhbLinePath[]
): (LineMatch<T> | null)[] {
  return lines.map(line => {
    const steps = parseIdPath(line.idPath);
    if (steps.length === 0) return null;
    const best = bestMatch(roots, steps, 0);
    if (!best) return null;
    return {
      id: line.id,
      value: best.node.value,
      indexPath: best.indexPath.join('-'),
      exact: best.exact,
    };
  });
}
