import { matchAhbLines, MatchNode, parseIdPath } from './ahbMigMatch';

const only = <T>(r: ReturnType<typeof matchAhbLines<T>>) => r.matches;

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
    const [m] = only(matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+TN>RFF>C_C506>D_1153>TN>' }]));
    expect(m).toEqual({ id: 'a', value: 'TN', indexPath: '2-0-0-0-0', exact: true });
  });

  it('prefers the variant whose qualifier matches', () => {
    const [m] = only(matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+Z13>' }]));
    expect(m).toMatchObject({ value: 'SG6+Z13', exact: true });
  });

  it('matches an unqualified AHB step to the variant that leads to its codes', () => {
    const [m] = only(matchAhbLines(mig, [{ id: 'a', idPath: 'SG6>RFF>C_C506>D_1153>TN>' }]));
    expect(m).toMatchObject({ value: 'TN', indexPath: '2-0-0-0-0', exact: true });
  });

  it('falls back to another qualifier variant and marks the match as not exact', () => {
    const [m] = only(matchAhbLines(mig, [{ id: 'a', idPath: 'SG6+Z51>RFF>' }]));
    expect(m).toMatchObject({ value: 'RFF', exact: false });
  });

  it('uses the repetition to tell repeated data elements apart', () => {
    const [m] = only(matchAhbLines(mig, [{ id: 'a', idPath: 'FTX>C_C108>D_4440>#2' }]));
    expect(m).toMatchObject({ value: 'D_4440#2', indexPath: '3-0-1', exact: true });
  });

  it('returns null for a line without a MIG counterpart', () => {
    expect(only(matchAhbLines(mig, [{ id: 'a', idPath: 'BGM>' }]))).toEqual([null]);
    expect(only(matchAhbLines(mig, [{ id: 'b', idPath: null }]))).toEqual([null]);
  });

  it('puts a group line into the variant its lines below fit, not the first one', () => {
    // UTILMD S2.2: SG4+Z01 (list) comes before SG4+24 (transaction); the AHB writes plain SG4.
    const utilmd = [
      n('SG4+Z01', [n('IDE', [n('C_C206', [n('D_7402')])])]),
      n('SG4+24', [n('IDE', [n('D_7495', [n('24')]), n('C_C206', [n('D_7402')])])]),
    ];
    const { matches } = matchAhbLines(utilmd, [
      { id: 'sg', idPath: 'SG4>' },
      { id: 'ide', idPath: 'SG4>IDE>' },
      { id: 'nr', idPath: 'SG4>IDE>C_C206>D_7402>' },
      { id: 'code', idPath: 'SG4>IDE>D_7495>24>' },
    ]);
    expect(matches.map(m => m?.indexPath)).toEqual(['1', '1-0', '1-0-1-0', '1-0-0-0']);
    expect(matches.every(m => m?.exact)).toBe(true);
  });

  it('keeps a line inside the variant chosen for its group', () => {
    // The AHB's SG8+ZA3 is missing in the MIG; it must stay below the SG4 the other lines chose.
    const utilmd = [
      n('SG4+Z01', [n('SG8', [n('SEQ')])]),
      n('SG4+24', [n('IDE'), n('SG8+Z03', [n('SEQ')])]),
    ];
    const { matches } = matchAhbLines(utilmd, [
      { id: 'ide', idPath: 'SG4>IDE>' },
      { id: 'sg8', idPath: 'SG4>SG8+ZA3>' },
      { id: 'seq', idPath: 'SG4>SG8+ZA3>SEQ>' },
    ]);
    expect(matches.map(m => m?.indexPath)).toEqual(['1-0', '1-1', '1-1-0']);
    expect(matches.map(m => m?.exact)).toEqual([true, false, false]);
  });

  it('scores the whole AHB so the better fitting of two MIGs can be chosen', () => {
    const lines = [{ id: 'a', idPath: 'SG6+TN>RFF>' }];
    const good = matchAhbLines(mig, lines);
    const poor = matchAhbLines([n('SG6+Z13', [n('RFF')])], lines);
    expect(good.matched).toBe(1);
    expect(poor.matched).toBe(1);
    expect(good.score).toBeGreaterThan(poor.score);
  });

  it('places a line the chosen variant lacks into another variant of the same group', () => {
    // The AHB has one STS group; the MIG splits its codes over two STS variants.
    const mig = [n('SG4', [n('STS+7', [n('E01'), n('E02')]), n('STS+E01', [n('E03')])])];
    const { matches } = matchAhbLines(mig, [
      { id: 'sts', idPath: 'SG4>STS>' },
      { id: 'e01', idPath: 'SG4>STS>E01>' },
      { id: 'e02', idPath: 'SG4>STS>E02>' },
      { id: 'e03', idPath: 'SG4>STS>E03>' },
    ]);
    expect(matches.map(m => m?.indexPath)).toEqual(['0-0', '0-0-0', '0-0-1', '0-1-0']);
  });

  it('gives each repeat of an unqualified group its own MIG variant (SG29>#1, #2, #3)', () => {
    // ORDERS: three SG29 variants told apart only by their names and contents.
    const named = (id: string, name: string, children: MatchNode<string>[] = []) => ({
      ...n(id, children),
      name,
    });
    const orders = [
      named('SG29', 'Positionsteil', [n('LIN')]),
      named('SG29', 'Erforderliches Produkt der Marktlokation', [n('LIN'), n('PIA')]),
      named('SG29', 'Erforderliches Produkt der Tranche', [n('LIN'), n('PIA')]),
    ];
    const group = (id: string, idPath: string, name: string) => ({
      id,
      idPath,
      name,
      isSegmentGroup: true,
    });
    const { matches } = matchAhbLines(orders, [
      group('h1', 'SG29>#1', 'Positionsteil'),
      { id: 'lin1', idPath: 'SG29>LIN>' },
      group('h2', 'SG29>#2', 'Erforderliches Produkt der Marktlokation'),
      { id: 'lin2', idPath: 'SG29>LIN>' },
      { id: 'pia2', idPath: 'SG29>PIA>' },
      group('h3', 'SG29>#3', 'Erforderliches Produkt der Tranche'),
      { id: 'lin3', idPath: 'SG29>LIN>' },
      { id: 'pia3', idPath: 'SG29>PIA>' },
      { id: 'unt', idPath: 'UNT>' },
    ]);
    expect(matches.map(m => m?.indexPath ?? null)).toEqual([
      '0',
      '0-0',
      '1',
      '1-0',
      '1-1',
      '2',
      '2-0',
      '2-1',
      null,
    ]);
    expect(matches.slice(0, 8).every(m => m?.exact)).toBe(true);
  });

  it('breaks a tie between unqualified variants by name, and marks an unbroken tie', () => {
    const named = (name: string) => ({ ...n('SG5', [n('LOC')]), name });
    const mig = [named('Netzlokation'), named('Marktlokation')];
    const sg5 = (name: string) => [
      { id: 'sg', idPath: 'SG5>', name, isSegmentGroup: true },
      { id: 'loc', idPath: 'SG5>LOC>' },
    ];
    const byName = matchAhbLines(mig, sg5('Marktlokation')).matches;
    expect(byName.map(m => m?.indexPath)).toEqual(['1', '1-0']);
    expect(byName[0]?.exact).toBe(true);

    const guess = matchAhbLines(mig, sg5('Technische Ressource')).matches;
    expect(guess.map(m => m?.exact)).toEqual([false, false]);
  });
});
