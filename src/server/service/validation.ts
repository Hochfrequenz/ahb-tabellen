import { ValidationError } from '../infrastructure/errors';
import { FileType } from '../repository/ahb';

const PRUEFI_PATTERN = /^\d{5}$/;
const FORMAT_VERSION_PATTERN = /^FV\d{4}$/;

/**
 * Assert that a value is a valid Prüfidentifikator (exactly 5 digits).
 * Transport-agnostic: throws {@link ValidationError} so every adapter (HTTP, MCP, ...)
 * maps it to the same error contract.
 */
export function assertPruefi(value: string): void {
  if (!PRUEFI_PATTERN.test(value)) {
    throw new ValidationError(`Invalid Prüfidentifikator format: ${value}. Expected 5 digits.`);
  }
}

/**
 * Assert that a value is a valid EDIFACT format version (e.g. FV2310).
 * @param fieldName label used in the error message so callers with multiple format
 *   versions (e.g. diff endpoints) can identify which one was invalid.
 */
export function assertFormatVersion(value: string, fieldName = 'format version'): void {
  if (!FORMAT_VERSION_PATTERN.test(value)) {
    throw new ValidationError(
      `Invalid ${fieldName}: ${value}. Expected pattern: FV followed by 4 digits.`
    );
  }
}

/**
 * Resolve a user-supplied format string to a {@link FileType}.
 * Throws {@link ValidationError} for unsupported values.
 */
export function parseFileType(format: string): FileType {
  switch (format.toLowerCase()) {
    case 'xlsx':
      return FileType.XLSX;
    case 'csv':
      return FileType.CSV;
    case 'json':
      return FileType.JSON;
    default:
      throw new ValidationError(
        `Invalid format: ${format}. Supported formats are: json, xlsx, csv`
      );
  }
}
