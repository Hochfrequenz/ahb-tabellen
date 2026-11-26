/**
 * Matching AHB lines to MIG elements.
 *
 * There is no link table between the two; both carry an `id_path` though, e.g.
 * `SG4+24>SG6+Z13>RFF>C_C506>D_1153>Z13>` (key, `+qualifier`, `#repetition` for a repeated
 * data element). The paths differ in three ways the matcher has to bridge:
 * - the AHB table leaves out levels (a code line without its data element group line), so a
 *   line is resolved from the root of the MIG, step by step, not from its parent line;
 * - either side may lack a qualifier the other has (AHB `SG1+ACW` vs MIG `SG1`, or AHB `SG27`
 *   vs MIG `SG27+Z01`/`SG27+Z64`); then the variant that fits the AHB lines below it wins;
 * - the MIG does not list every qualifier variant (UTILMD S2.2 has no `SG6+Z51`); then another
 *   variant with the same structure stands in, and the match is marked as not exact.
 *
 * So the matcher does not place lines one by one: it builds the AHB's paths into a tree and
 * places each AHB group once, into the MIG variant under which the most of its lines find a
 * place (then: whose qualifiers agree best). Its lines are then placed inside that variant
 * only, so a group line and the lines below it always land in the same part of the MIG.
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
  /** False when AHB and MIG name a different qualifier or repetition on the way. */
  exact: boolean;
}

export interface MatchResult<T> {
  /** One per AHB line, in the order of the lines; null where the MIG has no counterpart. */
  matches: (LineMatch<T> | null)[];
  /** Number of lines matched. */
  matched: number;
  /** Sum of qualifier/repetition agreement over all placed steps; higher fits better. */
  score: number;
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
 * with each qualifier/repetition both name and agree on, and falls with each they disagree on.
 * A qualifier or repetition only one side names neither adds nor subtracts.
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

function stepAgrees(ahb: PathStep, mig: PathStep): boolean {
  const differs = (a: string | undefined, m: string | undefined) => !!a && !!m && a !== m;
  return !differs(ahb.qualifier, mig.qualifier) && !differs(ahb.repetition, mig.repetition);
}

/** One AHB path prefix; `lines` are the indexes of the lines whose path ends here. */
interface AhbPrefix {
  step: PathStep;
  lines: number[];
  children: AhbPrefix[];
}

function buildAhbTree(lines: AhbLinePath[]): AhbPrefix[] {
  const roots: AhbPrefix[] = [];
  const byPrefix = new Map<string, AhbPrefix>();
  lines.forEach((line, lineIndex) => {
    const steps = parseIdPath(line.idPath);
    let siblings = roots;
    let key = '';
    steps.forEach((step, i) => {
      key += `${step.key}+${step.qualifier ?? ''}#${step.repetition ?? ''}>`;
      let prefix = byPrefix.get(key);
      if (!prefix) {
        prefix = { step, lines: [], children: [] };
        byPrefix.set(key, prefix);
        siblings.push(prefix);
      }
      if (i === steps.length - 1) prefix.lines.push(lineIndex);
      siblings = prefix.children;
    });
  });
  return roots;
}

interface Fit {
  /** AHB lines placed in this subtree. */
  matched: number;
  score: number;
}

const better = (a: Fit, b: Fit): boolean =>
  a.matched !== b.matched ? a.matched > b.matched : a.score > b.score;

/**
 * Places AHB prefixes into MIG nodes. `fit` is memoized per (prefix, node) pair, so each pair is
 * evaluated once however the paths overlap.
 */
class Placer<T> {
  private readonly memo = new Map<AhbPrefix, Map<MatchNode<T>, Fit | undefined>>();

  /** How well `prefix` and everything below it fits into `node`; undefined if keys differ. */
  fit(prefix: AhbPrefix, node: MatchNode<T>): Fit | undefined {
    let perNode = this.memo.get(prefix);
    if (!perNode) {
      perNode = new Map();
      this.memo.set(prefix, perNode);
    }
    if (perNode.has(node)) return perNode.get(node);
    const own = stepScore(prefix.step, node.step);
    let result: Fit | undefined;
    if (own !== undefined) {
      result = { matched: prefix.lines.length, score: own };
      for (const child of prefix.children) {
        const best = this.best(child, node.children);
        if (best) {
          result.matched += best.fit.matched;
          result.score += best.fit.score;
        }
      }
    }
    perNode.set(node, result);
    return result;
  }

  /** The best fit of `prefix` among the nodes of `pool`. */
  private best(prefix: AhbPrefix, pool: MatchNode<T>[]): { fit: Fit } | undefined {
    let best: { fit: Fit } | undefined;
    for (const node of pool) {
      const fit = this.fit(prefix, node);
      if (fit && (!best || better(fit, best.fit))) best = { fit };
    }
    return best;
  }
}

interface Candidate<T> {
  node: MatchNode<T>;
  indexPath: number[];
  exact: boolean;
  fit: Fit;
}

/** The MIG node of each AHB line, placed group by group (see the module comment). */
export function matchAhbLines<T>(roots: MatchNode<T>[], lines: AhbLinePath[]): MatchResult<T> {
  const matches: (LineMatch<T> | null)[] = lines.map(() => null);
  const placer = new Placer<T>();
  let score = 0;

  /** The nodes of `pool` that fit `prefix`, best first (stable, so the first wins a tie). */
  const ranked = (
    prefix: AhbPrefix,
    pool: MatchNode<T>[],
    indexPath: number[],
    exact: boolean
  ): Candidate<T>[] => {
    const found: Candidate<T>[] = [];
    pool.forEach((node, index) => {
      const fit = placer.fit(prefix, node);
      if (fit) {
        found.push({
          node,
          indexPath: [...indexPath, index],
          exact: exact && stepAgrees(prefix.step, node.step),
          fit,
        });
      }
    });
    return found.sort((a, b) => (better(a.fit, b.fit) ? -1 : better(b.fit, a.fit) ? 1 : 0));
  };

  /**
   * Places `prefix` into the first of `candidates`. The others are the other variants of the
   * same group: a line below that has no place in the chosen variant may use one of them (the
   * AHB writes one STS group where the MIG has several STS variants with different codes).
   */
  const place = (prefix: AhbPrefix, candidates: Candidate<T>[]): void => {
    const [chosen] = candidates;
    score += stepScore(prefix.step, chosen.node.step) ?? 0;
    for (const lineIndex of prefix.lines) {
      matches[lineIndex] = {
        id: lines[lineIndex].id,
        value: chosen.node.value,
        indexPath: chosen.indexPath.join('-'),
        exact: chosen.exact,
      };
    }
    for (const child of prefix.children) {
      const inChosen = ranked(child, chosen.node.children, chosen.indexPath, chosen.exact);
      const inOthers = candidates
        .slice(1)
        .flatMap(c => ranked(child, c.node.children, c.indexPath, c.exact));
      const childCandidates = [...inChosen, ...inOthers];
      if (childCandidates.length > 0) place(child, childCandidates);
    }
  };

  for (const prefix of buildAhbTree(lines)) {
    const candidates = ranked(prefix, roots, [], true);
    if (candidates.length > 0) place(prefix, candidates);
  }
  return { matches, matched: matches.filter(m => m !== null).length, score };
}
