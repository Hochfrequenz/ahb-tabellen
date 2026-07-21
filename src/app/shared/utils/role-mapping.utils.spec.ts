import {
  getBaseRoleKey,
  getRolesForPruefi,
  getAllRoleKeys,
  getRoleLabel,
} from './role-mapping.utils';

describe('role-mapping.utils', () => {
  describe('getBaseRoleKey', () => {
    it('should map base codes to themselves', () => {
      expect(getBaseRoleKey('LF')).toBe('LF');
      expect(getBaseRoleKey('NB')).toBe('NB');
      expect(getBaseRoleKey('MSB')).toBe('MSB');
      expect(getBaseRoleKey('ESA')).toBe('ESA');
      expect(getBaseRoleKey('ÜNB')).toBe('ÜNB');
    });

    it('should map variant codes to their base role', () => {
      expect(getBaseRoleKey('LFA')).toBe('LF');
      expect(getBaseRoleKey('LFN')).toBe('LF');
      expect(getBaseRoleKey('MSBA')).toBe('MSB');
      expect(getBaseRoleKey('MSBN')).toBe('MSB');
      expect(getBaseRoleKey('ÜNB (Strom)')).toBe('ÜNB');
    });

    it('should return null for unknown codes', () => {
      expect(getBaseRoleKey('UNKNOWN')).toBeNull();
      expect(getBaseRoleKey('')).toBeNull();
    });
  });

  describe('getRolesForPruefi', () => {
    it('should return distinct base roles for a list of codes', () => {
      expect(getRolesForPruefi(['LF', 'NB'])).toEqual(['LF', 'NB']);
    });

    it('should dedupe variant codes into their base role', () => {
      const roles = getRolesForPruefi(['LF', 'LFA', 'LFN']);
      expect(roles).toEqual(['LF']);
    });

    it('should silently drop unmapped codes', () => {
      expect(getRolesForPruefi(['LF', 'UNKNOWN'])).toEqual(['LF']);
      expect(getRolesForPruefi(['UNKNOWN'])).toEqual([]);
    });

    it('should return an empty array for an empty input', () => {
      expect(getRolesForPruefi([])).toEqual([]);
    });
  });

  describe('getAllRoleKeys', () => {
    it('should return all known base role keys', () => {
      expect(getAllRoleKeys()).toEqual(['LF', 'NB', 'MSB', 'ESA', 'ÜNB']);
    });
  });

  describe('getRoleLabel', () => {
    it('should return the human-readable label for a known role', () => {
      expect(getRoleLabel('LF')).toBe('Lieferant');
      expect(getRoleLabel('MSB')).toBe('Messstellenbetreiber');
    });

    it('should fall back to the key itself for an unknown role', () => {
      expect(getRoleLabel('UNKNOWN')).toBe('UNKNOWN');
    });
  });
});
