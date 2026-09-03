import {
  DVGW_ARCHIVE_URL,
  DVGW_PRUEFIS,
  getDvgwPruefiInfo,
  isDvgwPruefi,
} from './dvgw-pruefi.utils';

describe('dvgw-pruefi.utils', () => {
  describe('isDvgwPruefi', () => {
    it('should return true for the TSIMSG Prüfidentifikatoren', () => {
      expect(isDvgwPruefi('44096')).toBe(true);
      expect(isDvgwPruefi('44097')).toBe(true);
    });

    it('should return true for the SSQNOT Prüfidentifikatoren', () => {
      expect(isDvgwPruefi('70095')).toBe(true);
      expect(isDvgwPruefi('70096')).toBe(true);
    });

    it('should return false for a regular UTILMD-Gas Prüfidentifikator', () => {
      // 44001 resolves to UTILMDG just like 44096/44097 - it must NOT be hidden.
      expect(isDvgwPruefi('44001')).toBe(false);
    });

    it('should return false for other regular Prüfidentifikatoren and empty input', () => {
      expect(isDvgwPruefi('11001')).toBe(false);
      expect(isDvgwPruefi('55014')).toBe(false);
      expect(isDvgwPruefi('')).toBe(false);
    });

    it('should not be fooled by object prototype members', () => {
      expect(isDvgwPruefi('toString')).toBe(false);
      expect(isDvgwPruefi('constructor')).toBe(false);
    });
  });

  describe('getDvgwPruefiInfo', () => {
    it('should map the TSIMSG Prüfis to the TSIMSG Nachrichtentyp', () => {
      expect(getDvgwPruefiInfo('44096')?.nachrichtentyp).toBe('TSIMSG');
      expect(getDvgwPruefiInfo('44097')?.nachrichtentyp).toBe('TSIMSG');
    });

    it('should map the SSQNOT Prüfis to the SSQNOT Nachrichtentyp', () => {
      expect(getDvgwPruefiInfo('70095')?.nachrichtentyp).toBe('SSQNOT');
      expect(getDvgwPruefiInfo('70096')?.nachrichtentyp).toBe('SSQNOT');
    });

    it('should return undefined for a non-DVGW Prüfidentifikator', () => {
      expect(getDvgwPruefiInfo('44001')).toBeUndefined();
    });
  });

  describe('DVGW_ARCHIVE_URL', () => {
    it('should be the https DVGW document archive URL', () => {
      expect(DVGW_ARCHIVE_URL).toMatch(/^https:\/\/www\.dvgw-sc\.de\/.+\/dokumentenarchiv$/);
    });
  });

  describe('DVGW_PRUEFIS registry', () => {
    it('should only contain known Nachrichtentypen', () => {
      for (const info of Object.values(DVGW_PRUEFIS)) {
        expect(['TSIMSG', 'SSQNOT']).toContain(info.nachrichtentyp);
      }
    });
  });
});
