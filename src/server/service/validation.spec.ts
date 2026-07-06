import { assertPruefi, assertFormatVersion, parseFileType } from './validation';
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

  describe('assertFormatVersion', () => {
    it('accepts FV followed by 4 digits', () => {
      expect(() => assertFormatVersion('FV2310')).not.toThrow();
    });

    it.each(['FV231', 'FV23100', '2310', 'fv2310', 'FVabcd', ''])('rejects %p', invalid => {
      expect(() => assertFormatVersion(invalid)).toThrow(ValidationError);
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
