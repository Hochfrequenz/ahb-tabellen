import { extractEbdKey } from './ebd';

describe('extractEbdKey', () => {
  it('returns the key when the value is exactly an EBD key', () => {
    expect(extractEbdKey('E_0401')).toBe('E_0401');
  });

  it('extracts an embedded EBD key', () => {
    expect(extractEbdKey('Prüfschritt E_0004 gemäß EBD')).toBe('E_0004');
  });

  it('returns the last key when several are present (parity with the old frontend regex)', () => {
    expect(extractEbdKey('E_0401 / E_0500')).toBe('E_0500');
  });

  it.each([null, undefined, '', '   '])('returns null for %p', value => {
    expect(extractEbdKey(value)).toBeNull();
  });

  it.each(['foo', 'MP-ID', 'E_', 'E_04a', 'XE_0401'])(
    'returns null when there is no bounded EBD key (%p)',
    value => {
      expect(extractEbdKey(value)).toBeNull();
    }
  );
});
