import { GuideLine, treeGuides } from './ahb-tree-guides';

const sg = (path: string): GuideLine => ({ path, isSegmentGroup: true });
const row = (path: string | undefined): GuideLine => ({ path, isSegmentGroup: false });

describe('treeGuides', () => {
  // UNH                       2
  // SG4                       10
  //   IDE                     10-0
  //   SG8 (first)             10-48
  //     SEQ                   10-48-0
  //     SG10                  10-48-2
  //       CCI code            10-48-2-0-0   (the AHB skips levels)
  //   SG8 (second)            10-49
  //     SEQ                   10-49-0
  // UNT                       11
  const lines = [
    row('2'),
    sg('10'),
    row('10-0'),
    sg('10-48'),
    row('10-48-0'),
    sg('10-48-2'),
    row('10-48-2-0-0'),
    sg('10-49'),
    row('10-49-0'),
    row('11'),
  ];

  it('draws no brackets outside segment groups', () => {
    const guides = treeGuides(lines);
    expect(guides[0]?.brackets).toEqual([]);
    expect(guides[9]?.brackets).toEqual([]);
  });

  it('brackets neighbouring groups separately on the same level', () => {
    const guides = treeGuides(lines);
    expect(guides[3]?.brackets).toEqual(['middle', 'start']); // first SG8 starts
    expect(guides[6]?.brackets).toEqual(['middle', 'end', 'end']); // its last row
    expect(guides[7]?.brackets).toEqual(['middle', 'start']); // second SG8, same level
    expect(guides[8]?.brackets).toEqual(['end', 'end']); // last row of SG4 and SG8
  });

  it('nests a group inside another one level further in', () => {
    const guides = treeGuides(lines);
    expect(guides[5]?.brackets).toEqual(['middle', 'middle', 'start']);
  });

  it('marks a group with only its header row as single', () => {
    expect(treeGuides([sg('1'), row('2')])[0]?.brackets).toEqual(['single']);
  });

  it('leaves rows without MIG position out', () => {
    const guides = treeGuides([sg('1'), row(undefined), row('1-0')]);
    expect(guides[1]).toBeNull();
    expect(guides[2]?.brackets).toEqual(['end']);
  });
});
