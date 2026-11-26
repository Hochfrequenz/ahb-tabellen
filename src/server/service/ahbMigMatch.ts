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
 * place (then: whose qualifiers, then names, agree best). Its lines are then placed inside that
 * variant only, so a group line and the lines below it always land in the same part of the MIG.
 *
 * A segment group that repeats without qualifier carries `#n` on its header only (`SG29>#1`,
 * `SG29>#2`; the rows inside are `SG29>LIN>…`). Each such repeat becomes a group of its own in
 * the AHB tree, with the rows that follow it (the same rule as the segment group brackets in
 * the AHB table), so each repeat finds its own MIG variant.
 */

export interface PathStep {
  key: string;
  qualifier: string | undefined;
  repetition: string | undefined;
}

export interface MatchNode<T> {
  step: PathStep;
  /** The element's name in the MIG; agreeing with the AHB line's name breaks ties. */
  name?: string;
  /** A segment group: fallbacks to other variants never leave the chosen one. */
  isGroup?: boolean;
  value: T;
  children: MatchNode<T>[];
}

export interface AhbLinePath {
  id: string;
  idPath: string | null;
  name?: string | null;
  isSegmentGroup?: boolean;
}

export interface LineMatch<T> {
  id: string;
  value: T;
  /** Child indexes from the MIG root, e.g. `6-0-1` (the MIG view's deep link). */
  indexPath: string;
  /**
   * False when AHB and MIG name a different qualifier or repetition on the way, or when a
   * segment group on the way could as well have gone into another variant.
   */
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
const NAME_WEIGHT = 2;
const REPETITION_WEIGHT = 1;

const normalizeName = (name: string | null | undefined): string | undefined =>
  name?.trim().toLowerCase().replace(/\s+/g, ' ') || undefined;

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
  /** Normalized names of those lines. */
  names: Set<string>;
  /** A segment group header ends here. */
  isGroup: boolean;
  children: AhbPrefix[];
}

/** A `SG29>#2` header's rows start with `SG29>`. */
const memberPrefix = (idPath: string): string => idPath.replace(/#\d+$/, '');

/** An open group that repeats without qualifier: its rows' paths start with `prefix`. */
interface RepeatGroup {
  prefix: string;
  /** Number of steps of `prefix`: the group's step is the one at index `depth - 1`. */
  depth: number;
  id: number;
}

function buildAhbTree(lines: AhbLinePath[]): AhbPrefix[] {
  const roots: AhbPrefix[] = [];
  const byPrefix = new Map<string, AhbPrefix>();
  const open: RepeatGroup[] = [];
  let nextRepeatId = 0;
  lines.forEach((line, lineIndex) => {
    const idPath = line.idPath;
    if (!idPath) return;
    const isRepeatHeader = !!line.isSegmentGroup && /#\d+$/.test(idPath);
    const top = () => open[open.length - 1];
    // A row leaves every repeat its path does not start with; a repeat header also closes
    // the previous repeat of the same group (SG29>#1 → SG29>#2).
    while (
      open.length > 0 &&
      (!idPath.startsWith(top().prefix) ||
        (isRepeatHeader && memberPrefix(idPath) === top().prefix))
    ) {
      open.pop();
    }
    let steps = parseIdPath(idPath);
    if (isRepeatHeader) {
      const prefix = memberPrefix(idPath);
      open.push({ prefix, depth: parseIdPath(prefix).length, id: nextRepeatId++ });
      // The #n numbers the repeat; the repeat's own prefix tells it apart from now on.
      steps = steps.map((step, i) =>
        i === steps.length - 1 ? { ...step, repetition: undefined } : step
      );
    }

    let siblings = roots;
    let key = '';
    steps.forEach((step, i) => {
      const repeat = open.find(g => g.depth === i + 1);
      key += `${step.key}+${step.qualifier ?? ''}#${step.repetition ?? ''}`;
      key += repeat ? `@${repeat.id}>` : '>';
      let prefix = byPrefix.get(key);
      if (!prefix) {
        prefix = { step, lines: [], names: new Set(), isGroup: false, children: [] };
        byPrefix.set(key, prefix);
        siblings.push(prefix);
      }
      if (i === steps.length - 1) {
        prefix.lines.push(lineIndex);
        const name = normalizeName(line.name);
        if (name) prefix.names.add(name);
        if (line.isSegmentGroup) prefix.isGroup = true;
      }
      siblings = prefix.children;
    });
  });
  return roots;
}

/** Step score plus a bonus when the MIG element bears the name of an AHB line ending here. */
function ownScore<T>(prefix: AhbPrefix, node: MatchNode<T>): number | undefined {
  const score = stepScore(prefix.step, node.step);
  if (score === undefined) return undefined;
  const name = normalizeName(node.name);
  return name && prefix.names.has(name) ? score + NAME_WEIGHT : score;
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
    const own = ownScore(prefix, node);
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
  /** Index path of the innermost MIG segment group the node's children lie in ('' = top). */
  childScope: string;
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
    exact: boolean,
    scope: string
  ): Candidate<T>[] => {
    const found: Candidate<T>[] = [];
    pool.forEach((node, index) => {
      const fit = placer.fit(prefix, node);
      if (fit) {
        const path = [...indexPath, index];
        found.push({
          node,
          indexPath: path,
          exact: exact && stepAgrees(prefix.step, node.step),
          fit,
          childScope: node.isGroup ? path.join('-') : scope,
        });
      }
    });
    found.sort((a, b) => (better(a.fit, b.fit) ? -1 : better(b.fit, a.fit) ? 1 : 0));
    // A segment group the AHB doesn't pin down (two variants fit equally well) is a guess.
    if (prefix.isGroup && found.length > 1 && !better(found[0].fit, found[1].fit)) {
      found[0] = { ...found[0], exact: false };
    }
    return found;
  };

  /**
   * Places `prefix` into the first of `candidates`. The others are the other variants of the
   * same element: a line below that has no place in the chosen variant may use one of them (the
   * AHB writes one STS segment where the MIG has several STS variants with different codes),
   * but only within the same segment group: a line never leaves the group chosen for it.
   */
  const place = (prefix: AhbPrefix, candidates: Candidate<T>[]): void => {
    const [chosen] = candidates;
    score += ownScore(prefix, chosen.node) ?? 0;
    for (const lineIndex of prefix.lines) {
      matches[lineIndex] = {
        id: lines[lineIndex].id,
        value: chosen.node.value,
        indexPath: chosen.indexPath.join('-'),
        exact: chosen.exact,
      };
    }
    for (const child of prefix.children) {
      const inChosen = ranked(
        child,
        chosen.node.children,
        chosen.indexPath,
        chosen.exact,
        chosen.childScope
      );
      const inOthers = candidates
        .slice(1)
        .filter(c => c.childScope === chosen.childScope)
        .flatMap(c => ranked(child, c.node.children, c.indexPath, c.exact, c.childScope));
      const childCandidates = [...inChosen, ...inOthers];
      if (childCandidates.length > 0) place(child, childCandidates);
    }
  };

  for (const prefix of buildAhbTree(lines)) {
    const candidates = ranked(prefix, roots, [], true, '');
    if (candidates.length > 0) place(prefix, candidates);
  }
  return { matches, matched: matches.filter(m => m !== null).length, score };
}
