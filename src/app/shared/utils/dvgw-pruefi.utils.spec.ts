import { DVGW_PRUEFIS, getDvgwPruefiInfo, isDvgwPruefi } from './dvgw-pruefi.utils';

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
    it('should map the TSIMSG Prüfis to the TSIMSG document', () => {
      for (const pruefi of ['44096', '44097']) {
        const info = getDvgwPruefiInfo(pruefi);
        expect(info?.nachrichtentyp).toBe('TSIMSG');
        expect(info?.linkText).toBe('TSIMSG 5.11');
        expect(info?.dokumentUrl).toContain('TSIMSG_5.11');
      }
    });

    it('should map the SSQNOT Prüfis to the SSQNOT document', () => {
      for (const pruefi of ['70095', '70096']) {
        const info = getDvgwPruefiInfo(pruefi);
        expect(info?.nachrichtentyp).toBe('SSQNOT');
        expect(info?.linkText).toBe('SSQNOT 5.7');
        expect(info?.dokumentUrl).toContain('SSQNOT_5.7');
      }
    });

    it('should return undefined for a non-DVGW Prüfidentifikator', () => {
      expect(getDvgwPruefiInfo('44001')).toBeUndefined();
    });
  });

  describe('DVGW_PRUEFIS registry', () => {
    it('should point every entry at an https DVGW PDF', () => {
      for (const info of Object.values(DVGW_PRUEFIS)) {
        expect(info.dokumentUrl).toMatch(/^https:\/\/www\.dvgw-sc\.de\/.+\.pdf$/);
      }
    });
  });
});
