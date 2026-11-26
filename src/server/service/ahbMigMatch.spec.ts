import { matchAhbLines, MatchNode, parseIdPath } from './ahbMigMatch';

function n(id: string, children: MatchNode<string>[] = []): MatchNode<string> {
  return { step: parseIdPath(id)[0], value: id, children };
}

describe('parseIdPath', () => {
  it('splits an id_path into steps with qualifier and repetition', () => {
    expect(parseIdPath('SG4+24>DTM+137>C_C507>D_2005>#2')).toEqual([
      { key: 'SG4', qualifier: '24', repetition: undefined },
      { key: 'DTM', qualifier: '137', repetition: undefined },
      { key: 'C_C507', qualifier: undefined, repetition: undefined },
      { key: 'D_2005', qualifier: undefined, repetition: '2' },
    ]);
  });

  it('returns no steps for an empty path', () => {
    expect(parseIdPath(null)).toEqual([]);
    expect(parseIdPath('')).toEqual([]);
  });
});

describe('matchAhbLines', () => {
  // A MIG with two qualified variants of SG6 and an unqualified UNH.
  const mig = [
    n('UNH', [n('D_0062')]),
    n('SG6+Z13', [n('RFF', [n('C_C506', [n('D_1153', [n('Z13')])])])]),
    n('SG6+TN', [n('RFF', [n('C_C506', [n('D_1153', [n('TN')])])])]),
    n('FTX', [n('C_C108', [n('D_4440#1'), n('D_4440#2')])]),
  ];

  it('follows the path through levels the AHB leaves out', () => {
    const [m] = matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+TN>RFF>C_C506>D_1153>TN>' }]);
    expect(m).toEqual({ id: 'a', value: 'TN', indexPath: '2-0-0-0-0', exact: true });
  });

  it('prefers the variant whose qualifier matches', () => {
    const [m] = matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+Z13>' }]);
    expect(m).toMatchObject({ value: 'SG6+Z13', exact: true });
  });

  it('matches an unqualified AHB step to the variant that leads to its codes', () => {
    const [m] = matchAhbLines(mig, [{ id: 'a', idPath: 'SG6>RFF>C_C506>D_1153>TN>' }]);
    expect(m).toMatchObject({ value: 'TN', indexPath: '2-0-0-0-0', exact: true });
  });

  it('falls back to another qualifier variant and marks the match as not exact', () => {
    const [m] = matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+Z51>RFF>' }]);
    expect(m).toMatchObject({ value: 'RFF', exact: false });
  });

  it('uses the repetition to tell repeated data elements apart', () => {
    const [m] = matchAhbLines(mig, [{ id: 'a', idPath: 'FTX>C_C108>D_4440>#2' }]);
    expect(m).toMatchObject({ value: 'D_4440#2', indexPath: '3-0-1', exact: true });
  });

  it('returns null for a line without a MIG counterpart', () => {
    expect(matchAhbLines(mig, [{ id: 'a', idPath: 'BGM>' }])).toEqual([null]);
    expect(matchAhbLines(mig, [{ id: 'b', idPath: null }])).toEqual([null]);
  });
});
