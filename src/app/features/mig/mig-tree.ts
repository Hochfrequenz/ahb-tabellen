import { MigNode } from '../../core/api';

/** Meaning of the status codes in BDEW MIGs. */
export const STATUS_LABELS: Record<string, string> = {
  M: 'Muss',
  R: 'Erforderlich',
  D: 'Abhängig',
  O: 'Optional',
  N: 'Nicht benutzt',
  C: 'Konditional',
};

export const TYPE_NAMES: Record<MigNode['type'], string> = {
  segment_group: 'Segmentgruppe',
  segment: 'Segment',
  dataelementgroup: 'Datenelementgruppe',
  dataelement: 'Datenelement',
  code: 'Code',
};

/** Every node that has children, depth first (for "expand all"). */
export function expandableNodes(nodes: MigNode[]): MigNode[] {
  const result: MigNode[] = [];
  const visit = (list: MigNode[]): void => {
    for (const node of list) {
      if (node.children.length > 0) {
        result.push(node);
        visit(node.children);
      }
    }
  };
  visit(nodes);
  return result;
}

export interface MigNodeLocation {
  /** Child indexes from the root, e.g. `6-0-1`; identifies the node within its MIG for deep links. */
  path: string;
  /** From the root down to the parent. */
  ancestors: MigNode[];
}

/** Location of every node. Keys repeat within a MIG (e.g. several SG2), hence index paths. */
export function indexMigTree(nodes: MigNode[]): Map<MigNode, MigNodeLocation> {
  const index = new Map<MigNode, MigNodeLocation>();
  const visit = (list: MigNode[], prefix: string, ancestors: MigNode[]): void => {
    list.forEach((node, i) => {
      const path = prefix === '' ? String(i) : `${prefix}-${i}`;
      index.set(node, { path, ancestors });
      visit(node.children, path, [...ancestors, node]);
    });
  };
  visit(nodes, '', []);
  return index;
}

/** The node at an index path from {@link indexMigTree}; undefined if the path doesn't exist. */
export function nodeAtPath(nodes: MigNode[], path: string): MigNode | undefined {
  if (!/^\d+(-\d+)*$/.test(path)) return undefined;
  let list = nodes;
  let node: MigNode | undefined;
  for (const part of path.split('-')) {
    node = list[Number(part)];
    if (!node) return undefined;
    list = node.children;
  }
  return node;
}

export interface SampleLine {
  node: MigNode;
  example: string;
  /** Number of enclosing segment groups, for indentation. */
  level: number;
}

/** The MIG's segment examples in message order: a readable skeleton of a message. */
export function sampleMessage(nodes: MigNode[]): SampleLine[] {
  const lines: SampleLine[] = [];
  const visit = (list: MigNode[], level: number): void => {
    for (const node of list) {
      if (node.type === 'segment') {
        if (node.example) lines.push({ node, example: node.example, level });
      } else if (node.type === 'segment_group') {
        visit(node.children, level + 1);
      }
    }
  };
  visit(nodes, 0);
  return lines;
}
