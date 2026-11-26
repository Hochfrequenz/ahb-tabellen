import { EdifactFormat } from '@hochfrequenz/efoli';
import MigRepository, { MigHierarchyRow, MigInfo } from '../repository/mig';
import { NotFoundError, ValidationError } from '../infrastructure/errors';
import { assertPruefi, resolveFormatVersion } from './validation';
import { matchAhbLines, MatchNode, parseIdPath } from './ahbMigMatch';

const KNOWN_FORMATS = new Set<string>(Object.values(EdifactFormat));

export type MigNodeType = 'segment_group' | 'segment' | 'dataelementgroup' | 'dataelement' | 'code';

/** One node of a MIG tree. Optional fields are left out when the MIG has no value. */
export interface MigNode {
  type: MigNodeType;
  /** Segment group (`SG4`), segment (`RFF`), data element group (`C_C506`), data element (`D_1153`) or code value (`AAV`). */
  key: string;
  name: string;
  /** Status in the EDIFACT standard (M, C, R, D, O, N). */
  statusStd: string;
  /** Status in the BDEW specification (M, C, R, D, O, N). */
  statusSpecification: string;
  maxRepStd?: number;
  maxRepSpecification?: number;
  /** Segment number as printed in the MIG. */
  number?: string;
  /** Data element format in the standard and in the BDEW specification, e.g. `an..35`. */
  formatStd?: string;
  formatSpecification?: string;
  description?: string;
  example?: string;
  children: MigNode[];
}

export interface MigSummary {
  format: string;
  versionsnummer: string;
  gueltigVon: string | null;
  gueltigBis: string | null;
}

export interface MigTree {
  meta: MigSummary & { formatVersion: string };
  nodes: MigNode[];
}

/** A MIG node without its subtree. */
export type MigElement = Omit<MigNode, 'children'>;

/** The MIG element of one AHB line. */
export interface AhbMigLink {
  /** The AHB line's `guid`. */
  guid: string;
  /** Index path of the element in the MIG tree (the MIG view's `node` deep link). */
  node: string;
  /** False when AHB and MIG disagree on a qualifier on the way (another variant stands in). */
  exact: boolean;
  element: MigElement;
}

export interface AhbMigLinks {
  mig: MigTree['meta'];
  links: AhbMigLink[];
}

function toSummary(mig: MigInfo): MigSummary {
  return {
    format: mig.format,
    versionsnummer: mig.versionsnummer,
    gueltigVon: mig.gueltig_von,
    gueltigBis: mig.gueltig_bis,
  };
}

function nodeOf(row: MigHierarchyRow): MigNode {
  const node: MigNode = {
    type: row.type as MigNodeType,
    key: '',
    name: row.line_name ?? '',
    statusStd: row.line_status_std ?? '',
    statusSpecification: row.line_status_specification ?? '',
    children: [],
  };
  const set = <K extends keyof MigNode>(key: K, value: MigNode[K] | null | undefined): void => {
    if (value !== null && value !== undefined && value !== '') {
      node[key] = value;
    }
  };
  switch (row.type) {
    case 'segment_group':
      node.key = row.segmentgroup_id ?? '';
      set('maxRepStd', row.segmentgroup_max_rep_std);
      set('maxRepSpecification', row.segmentgroup_max_rep_specification);
      break;
    case 'segment':
      node.key = row.segment_id ?? '';
      set('maxRepStd', row.segment_max_rep_std);
      set('maxRepSpecification', row.segment_max_rep_specification);
      set('number', row.segment_number);
      set('description', row.segment_description);
      set('example', row.segment_example);
      break;
    case 'dataelementgroup':
      node.key = row.dataelementgroup_id ?? '';
      set('description', row.dataelementgroup_description);
      break;
    case 'dataelement':
      node.key = row.dataelement_id ?? '';
      set('formatStd', row.dataelement_format_std);
      set('formatSpecification', row.dataelement_format_specification);
      set('description', row.dataelement_description);
      break;
    case 'code':
      node.key = row.code_value ?? '';
      set('description', row.code_description);
      break;
  }
  return node;
}

/**
 * Build the MIG tree from its rows in pre-order (`sort_path`): each row hangs below the last
 * row one level up. Relies on `depth`, not on ids, so a node reused in several places of the
 * MIG still lands in each of them.
 */
export function buildMigTree(
  rows: MigHierarchyRow[],
  idPaths?: Map<MigNode, string | null>
): MigNode[] {
  const roots: MigNode[] = [];
  const stack: MigNode[] = []; // stack[d] = last node seen at depth d
  for (const row of rows) {
    if (row.depth > stack.length) {
      throw new Error(
        `MIG row ${row.sort_path} has depth ${row.depth}, but its parent level is missing.`
      );
    }
    const node = nodeOf(row);
    idPaths?.set(node, row.id_path);
    stack.length = row.depth;
    (row.depth === 0 ? roots : stack[row.depth - 1].children).push(node);
    stack.push(node);
  }
  return roots;
}

function toMatchTree(nodes: MigNode[], idPaths: Map<MigNode, string | null>): MatchNode<MigNode>[] {
  return nodes.map(node => {
    const steps = parseIdPath(idPaths.get(node));
    return {
      // A node without id_path (a few empty code rows) gets a step nothing matches.
      step: steps[steps.length - 1] ?? { key: '', qualifier: undefined, repetition: undefined },
      value: node,
      children: toMatchTree(node.children, idPaths),
    };
  });
}

function elementOf(node: MigNode): MigElement {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...element } = node;
  return element;
}

export default class MigService {
  private repository: MigRepository;

  constructor(repository?: MigRepository) {
    this.repository = repository ?? new MigRepository();
  }

  public async listMigs(formatVersion: string): Promise<MigSummary[]> {
    const resolved = resolveFormatVersion(formatVersion);
    return (await this.repository.listMigs(resolved)).map(toSummary);
  }

  /**
   * The MIG tree of a format. `version` (the MIG's Versionsnummer, e.g. `S2.2`) is needed only
   * when the format has several MIGs in that format version, as UTILMD has.
   */
  public async getMigTree(
    formatVersion: string,
    format: string,
    version?: string
  ): Promise<MigTree> {
    const resolved = resolveFormatVersion(formatVersion);
    const normalizedFormat = format.trim().toUpperCase();
    if (!KNOWN_FORMATS.has(normalizedFormat)) {
      throw new ValidationError(
        `Invalid format: ${format}. Expected an EDIFACT format such as "MSCONS".`
      );
    }

    const migs = await this.repository.findMigs(resolved, normalizedFormat);
    if (migs.length === 0) {
      throw new NotFoundError(
        `No MIG for ${normalizedFormat} in ${resolved}. The database may not contain MIG data.`
      );
    }
    const wanted = version?.trim().toUpperCase() || undefined;
    let mig;
    if (wanted !== undefined) {
      mig = migs.find(m => m.versionsnummer.toUpperCase() === wanted);
      if (!mig) {
        throw new NotFoundError(
          `No MIG ${normalizedFormat} ${version} in ${resolved}. Available: ${migs.map(m => m.versionsnummer).join(', ')}.`
        );
      }
    } else if (migs.length > 1) {
      throw new ValidationError(
        `${normalizedFormat} has several MIGs in ${resolved}; choose one with "version": ${migs.map(m => m.versionsnummer).join(', ')}.`
      );
    } else {
      mig = migs[0];
    }

    const rows = await this.repository.getHierarchy(mig.primary_key);
    return {
      meta: { formatVersion: resolved, ...toSummary(mig) },
      nodes: buildMigTree(rows),
    };
  }

  /**
   * The MIG element of each line of a Prüfidentifikator's AHB. Where a format has several MIGs
   * (UTILMD: Strom and Gas), the one that matches the most lines is used.
   */
  public async getAhbMigLinks(formatVersion: string, pruefi: string): Promise<AhbMigLinks> {
    const resolved = resolveFormatVersion(formatVersion);
    assertPruefi(pruefi);
    const lines = await this.repository.getAhbLinePaths(resolved, pruefi);
    if (lines.length === 0) {
      throw new NotFoundError(`No AHB for ${pruefi} in ${resolved}.`);
    }
    const migs = await this.repository.findMigs(resolved, lines[0].format);
    if (migs.length === 0) {
      throw new NotFoundError(
        `No MIG for ${lines[0].format} in ${resolved}. The database may not contain MIG data.`
      );
    }
    const linePaths = lines.map(l => ({ id: l.id, idPath: l.id_path }));

    const candidates: AhbMigLinks[] = [];
    for (const mig of migs) {
      const idPaths = new Map<MigNode, string | null>();
      const nodes = buildMigTree(await this.repository.getHierarchy(mig.primary_key), idPaths);
      const links = matchAhbLines(toMatchTree(nodes, idPaths), linePaths)
        .filter(m => m !== null)
        .map(m => ({
          guid: m.id,
          node: m.indexPath,
          exact: m.exact,
          element: elementOf(m.value),
        }));
      candidates.push({ mig: { formatVersion: resolved, ...toSummary(mig) }, links });
    }
    // The first one wins a tie.
    return candidates.reduce((best, c) => (c.links.length > best.links.length ? c : best));
  }
}
