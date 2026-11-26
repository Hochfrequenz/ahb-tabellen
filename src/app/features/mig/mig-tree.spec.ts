import { MigNode } from '../../core/api';
import { expandableNodes, indexMigTree, nodeAtPath, sampleMessage } from './mig-tree';

function node(
  key: string,
  name: string,
  children: MigNode[] = [],
  type: MigNode['type'] = 'segment',
  example?: string
): MigNode {
  return {
    type,
    key,
    name,
    statusStd: 'M',
    statusSpecification: 'M',
    children,
    ...(example ? { example } : {}),
  };
}

const tree: MigNode[] = [
  node(
    'UNH',
    'Nachrichten-Kopfsegment',
    [node('D_0062', 'Referenz', [], 'dataelement')],
    'segment',
    "UNH+1'"
  ),
  node(
    'SG4',
    'Vorgang',
    [
      node(
        'IDE',
        'Vorgang',
        [node('D_7495', 'Objekttyp', [node('24', 'Vorgang', [], 'code')], 'dataelement')],
        'segment',
        "IDE+24+X'"
      ),
      node('DTM', 'Datum', [], 'segment'),
    ],
    'segment_group'
  ),
];

describe('expandableNodes', () => {
  it('lists every node with children, depth first', () => {
    expect(expandableNodes(tree).map(n => n.key)).toEqual(['UNH', 'SG4', 'IDE', 'D_7495']);
  });
});

describe('indexMigTree', () => {
  it('gives every node its index path and its ancestors', () => {
    const index = indexMigTree(tree);
    const code = tree[1].children[0].children[0].children[0];
    expect(index.get(code)).toEqual({
      path: '1-0-0-0',
      ancestors: [tree[1], tree[1].children[0], tree[1].children[0].children[0]],
    });
    expect(index.get(tree[0])).toEqual({ path: '0', ancestors: [] });
  });
});

describe('nodeAtPath', () => {
  it('finds the node of an index path', () => {
    expect(nodeAtPath(tree, '1-0-0')?.key).toBe('D_7495');
  });

  it.each(['', '9', '1-7', 'x', '1--0'])('returns undefined for %j', path => {
    expect(nodeAtPath(tree, path)).toBeUndefined();
  });
});

describe('sampleMessage', () => {
  it('lists the segment examples in message order with their segment group depth', () => {
    expect(sampleMessage(tree)).toEqual([
      { node: tree[0], example: "UNH+1'", level: 0 },
      { node: tree[1].children[0], example: "IDE+24+X'", level: 1 },
    ]);
  });
});
