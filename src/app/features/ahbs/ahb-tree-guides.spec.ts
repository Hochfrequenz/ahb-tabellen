import { treeGuides } from './ahb-tree-guides';

describe('treeGuides', () => {
  // UNH            0
  // SG4            1
  //   IDE          1-0
  //     24         1-0-0-0   (the AHB skips the data element level)
  //   SG6          1-2
  //     RFF        1-2-0
  // UNT            5
  const paths = ['0', '1', '1-0', '1-0-0-0', '1-2', '1-2-0', '5'];

  it('nests rows by their MIG position and marks the last child', () => {
    const guides = treeGuides(paths);
    expect(guides.map(g => g?.depth)).toEqual([0, 0, 1, 2, 1, 2, 0]);
    expect(guides.map(g => g?.last)).toEqual([false, false, false, true, true, true, true]);
  });

  it('passes an ancestor line only while the ancestor has later siblings', () => {
    const guides = treeGuides(paths);
    // "24": SG4's line continues (UNT follows), and so does IDE's (its sibling SG6 follows).
    expect(guides[3]?.through).toEqual([true, true]);
    // "RFF": SG4 continues (UNT), SG6 is the last child of SG4.
    expect(guides[5]?.through).toEqual([true, false]);
  });

  it('tells a row inserted below which lines pass it', () => {
    const guides = treeGuides(paths);
    // Below SG4: its own line continues to UNT, and its children start.
    expect(guides[1]?.below).toEqual([true, true]);
    // Below UNT: nothing.
    expect(guides[6]?.below).toEqual([false, false]);
  });

  it('leaves rows without MIG position out of the tree', () => {
    const guides = treeGuides(['0', undefined, '0-0']);
    expect(guides[1]).toBeNull();
    expect(guides[2]).toMatchObject({ depth: 1, last: true });
  });
});
