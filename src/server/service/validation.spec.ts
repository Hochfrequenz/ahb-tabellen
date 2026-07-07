import { getCurrentEdifactFormatVersion } from '@hochfrequenz/efoli';
import { assertPruefi, resolveFormatVersion, parseFileType } from './validation';
import { ValidationError } from '../infrastructure/errors';
import { FileType } from '../repository/ahb';

describe('validation', () => {
  describe('assertPruefi', () => {
    it('accepts exactly 5 digits', () => {
      expect(() => assertPruefi('11001')).not.toThrow();
    });

    it.each(['1234', '123456', 'abcde', '', '1100a'])('rejects %p', invalid => {
      expect(() => assertPruefi(invalid)).toThrow(ValidationError);
    });
  });

  describe('resolveFormatVersion', () => {
    it.each(['FV2310', 'FV2410', 'FV2504'])('passes through the known FV code %p', fv => {
      expect(resolveFormatVersion(fv)).toBe(fv);
    });

    it.each([
      ['2024-06-01', 'FV2404'],
      ['2024-11-01', 'FV2410'],
      ['2025-06-01', 'FV2410'],
    ])('resolves the ISO date %p to %p', (date, expected) => {
      expect(resolveFormatVersion(date)).toBe(expected);
    });

    it.each(['current', 'CURRENT', 'Current'])(
      'resolves the keyword %p to the currently valid format version',
      keyword => {
        expect(resolveFormatVersion(keyword)).toBe(getCurrentEdifactFormatVersion());
      }
    );

    it.each(['FV231', 'FV23100', '2310', 'fv2310', 'FVabcd', ''])(
      'rejects the malformed value %p',
      invalid => {
        expect(() => resolveFormatVersion(invalid)).toThrow(ValidationError);
      }
    );

    it('rejects a syntactically valid but unknown FV code', () => {
      expect(() => resolveFormatVersion('FV9999')).toThrow(ValidationError);
    });

    it.each(['2025-13-40', '2025-02-30', '2025-00-10', '2025-01-32'])(
      'rejects the impossible date %p',
      invalid => {
        expect(() => resolveFormatVersion(invalid)).toThrow(ValidationError);
      }
    );

    it('includes the field name in the error message', () => {
      expect(() => resolveFormatVersion('nonsense', 'format-version-new')).toThrow(
        /format-version-new/
      );
    });
  });

  describe('parseFileType', () => {
    it.each([
      ['json', FileType.JSON],
      ['JSON', FileType.JSON],
      ['xlsx', FileType.XLSX],
      ['XLSX', FileType.XLSX],
      ['csv', FileType.CSV],
      ['CSV', FileType.CSV],
    ])('maps %p to the expected FileType', (input, expected) => {
      expect(parseFileType(input)).toBe(expected);
    });

    it.each(['pdf', 'txt', ''])('rejects unsupported format %p', invalid => {
      expect(() => parseFileType(invalid)).toThrow(ValidationError);
    });
  });
});
