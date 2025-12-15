import { getFormatFromPruefi, getAllFormats } from './pruefi-format.utils';

describe('pruefi-format.utils', () => {
  describe('getFormatFromPruefi', () => {
    it('should return UTILMD for pruefi starting with 11', () => {
      expect(getFormatFromPruefi('11001')).toBe('UTILMD');
      expect(getFormatFromPruefi('11042')).toBe('UTILMD');
    });

    it('should return MSCONS for pruefi starting with 13', () => {
      expect(getFormatFromPruefi('13001')).toBe('MSCONS');
    });

    it('should return PARTIN for pruefi starting with 37', () => {
      expect(getFormatFromPruefi('37005')).toBe('PARTIN');
    });

    it('should return UTILMDS for pruefi starting with 55', () => {
      expect(getFormatFromPruefi('55014')).toBe('UTILMDS');
    });

    it('should return APERAK for pruefi starting with 99 or 92', () => {
      expect(getFormatFromPruefi('99001')).toBe('APERAK');
      expect(getFormatFromPruefi('92001')).toBe('APERAK');
    });

    it('should return empty string for unknown prefix', () => {
      expect(getFormatFromPruefi('00001')).toBe('');
      expect(getFormatFromPruefi('12345')).toBe('');
    });

    it('should handle short strings gracefully', () => {
      expect(getFormatFromPruefi('1')).toBe('');
      expect(getFormatFromPruefi('')).toBe('');
    });
  });

  describe('getAllFormats', () => {
    it('should return all unique formats sorted alphabetically', () => {
      const formats = getAllFormats();

      expect(formats).toContain('UTILMD');
      expect(formats).toContain('MSCONS');
      expect(formats).toContain('PARTIN');
      expect(formats).toContain('APERAK');

      // Check alphabetical order
      const sortedFormats = [...formats].sort();
      expect(formats).toEqual(sortedFormats);
    });

    it('should not contain duplicates', () => {
      const formats = getAllFormats();
      const uniqueFormats = new Set(formats);
      expect(formats.length).toBe(uniqueFormats.size);
    });
  });
});
