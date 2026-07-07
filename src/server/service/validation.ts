import {
  EdifactFormatVersion,
  getEdifactFormatVersion,
  getCurrentEdifactFormatVersion,
  type CalendarDate,
} from '@hochfrequenz/efoli';
import { ValidationError } from '../infrastructure/errors';
import { FileType } from '../repository/ahb';

const PRUEFI_PATTERN = /^\d{5}$/;
const FORMAT_VERSION_PATTERN = /^FV\d{4}$/;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** All EDIFACT format versions efoli knows about (used to reject unknown FVxxxx codes). */
const KNOWN_FORMAT_VERSIONS = new Set<string>(Object.values(EdifactFormatVersion));

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
 * Assert that a value is a known EDIFACT format version code (e.g. FV2410) and return it.
 * Rejects both malformed codes and syntactically valid but unknown ones (e.g. FV9999).
 */
function assertKnownFormatVersion(value: string, fieldName: string): EdifactFormatVersion {
  if (!FORMAT_VERSION_PATTERN.test(value) || !KNOWN_FORMAT_VERSIONS.has(value)) {
    throw new ValidationError(
      `Invalid ${fieldName}: ${value}. Expected a known FVxxxx code or an ISO date (YYYY-MM-DD).`
    );
  }
  return value as EdifactFormatVersion;
}

/**
 * Parse an ISO date (already matched by {@link ISO_DATE_PATTERN}) into a {@link CalendarDate},
 * rejecting impossible dates like 2025-13-40 via a UTC round-trip.
 */
function toCalendarDate(match: RegExpExecArray, value: string, fieldName: string): CalendarDate {
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const probe = new Date(Date.UTC(year, month - 1, day));
  if (
    probe.getUTCFullYear() !== year ||
    probe.getUTCMonth() !== month - 1 ||
    probe.getUTCDate() !== day
  ) {
    throw new ValidationError(`Invalid ${fieldName}: ${value} is not a valid calendar date.`);
  }

  return { year, month, day } satisfies CalendarDate;
}

/**
 * Resolve a caller-supplied format version to a canonical {@link EdifactFormatVersion}.
 *
 * Accepts a known `FVxxxx` code, the keyword `current` (case-insensitive → the format version
 * valid right now), or an ISO date (`YYYY-MM-DD`); a date is resolved via efoli to the format
 * version valid on that day (treated as midnight Europe/Berlin). This is the single choke point
 * shared by every transport (HTTP, MCP), so overloading the string here lets a date or `current`
 * be used anywhere a format version is accepted without touching each surface.
 *
 * @param fieldName label used in the error message so callers with multiple format versions
 *   (e.g. diff endpoints) can identify which one was invalid.
 * @throws {@link ValidationError} for malformed input, unknown FV codes, or impossible dates.
 */
export function resolveFormatVersion(
  value: string,
  fieldName = 'format version'
): EdifactFormatVersion {
  if (value.toLowerCase() === 'current') {
    return getCurrentEdifactFormatVersion();
  }
  const isoMatch = ISO_DATE_PATTERN.exec(value);
  if (isoMatch) {
    return getEdifactFormatVersion(toCalendarDate(isoMatch, value, fieldName));
  }
  return assertKnownFormatVersion(value, fieldName);
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
