import { GuideLine, hiddenRows, treeGuides } from './ahb-tree-guides';

const sg = (idPath: string): GuideLine => ({ idPath, isSegmentGroup: true });
const row = (idPath: string | null): GuideLine => ({ idPath, isSegmentGroup: false });

describe('treeGuides', () => {
  const lines = [
    row('UNH>'), //                       0
    sg('SG4>'), //                        1
    row('SG4>IDE>'), //                   2
    sg('SG4>SG8+Z79>'), //                3  first SG8
    row('SG4>SG8+Z79>SEQ>'), //           4
    sg('SG4>SG8+Z79>SG10+Z66>'), //       5  its SG10
    row('SG4>SG8+Z79>SG10+Z66>CCI>D_7059>Z66>'), // 6
    sg('SG4>SG8+ZH0>'), //                7  second SG8, same level
    row('SG4>SG8+ZH0>SEQ>'), //           8
    row('UNT>'), //                       9
  ];

  it('draws no brackets outside segment groups', () => {
    const guides = treeGuides(lines);
    expect(guides[0]?.brackets).toEqual([]);
    expect(guides[9]?.brackets).toEqual([]);
  });

  it('tells neighbouring groups of one number apart by their qualifier', () => {
    const guides = treeGuides(lines);
    expect(guides[3]?.brackets).toEqual(['middle', 'start']); // SG8+Z79 starts
    expect(guides[6]?.brackets).toEqual(['middle', 'end', 'end']); // its last row
    expect(guides[7]?.brackets).toEqual(['middle', 'start']); // SG8+ZH0, same level
    expect(guides[8]?.brackets).toEqual(['end', 'end']); // last row of SG4 and SG8+ZH0
  });

  it('nests a group inside another one level further in', () => {
    expect(treeGuides(lines)[5]?.brackets).toEqual(['middle', 'middle', 'start']);
  });

  it('separates a group that repeats without qualifier by its #n header', () => {
    const guides = treeGuides([
      sg('SG29>#1'),
      row('SG29>LIN>'),
      sg('SG29>#2'),
      row('SG29>LIN>'),
      row('UNT>'),
    ]);
    expect(guides.map(g => g?.brackets)).toEqual([['start'], ['end'], ['start'], ['end'], []]);
    expect(guides.map(g => g?.lastRow)).toEqual([1, undefined, 3, undefined, undefined]);
  });

  it('marks a group with only its header row as single', () => {
    expect(treeGuides([sg('SG1>'), row('UNT>')])[0]?.brackets).toEqual(['single']);
  });

  it('leaves rows without id_path out', () => {
    const guides = treeGuides([sg('SG1>'), row(null), row('SG1>RFF>')]);
    expect(guides[1]).toBeNull();
    expect(guides[2]?.brackets).toEqual(['end']);
  });

  it('knows the last row of each group', () => {
    expect(treeGuides(lines).map(g => g?.lastRow)).toEqual([
      undefined,
      8,
      undefined,
      6,
      undefined,
      6,
      undefined,
      8,
      undefined,
      undefined,
    ]);
  });

  it('hides only the rows of the collapsed group, not those of its same-numbered neighbour', () => {
    const guides = treeGuides(lines);
    expect([...hiddenRows(guides, new Set([3]))]).toEqual([4, 5, 6]); // SG8+Z79 only
    expect([...hiddenRows(guides, new Set([7]))]).toEqual([8]); // SG8+ZH0 only
    expect([...hiddenRows(guides, new Set([1]))]).toEqual([2, 3, 4, 5, 6, 7, 8]); // SG4
    expect(hiddenRows(guides, new Set([0])).size).toBe(0); // not a group
  });
});
