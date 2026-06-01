import { EdifactFormat, getFormatOfPruefidentifikator } from '@hochfrequenz/efoli';

/**
 * Get the EDIFACT format for a given Prüfidentifikator.
 * @param pruefi - The 5-digit Prüfidentifikator (e.g., '11001', '55014')
 * @returns The EDIFACT format name (e.g., 'UTILMD', 'UTILMDS') or empty string if unknown
 */
export function getFormatFromPruefi(pruefi: string): string {
  try {
    return getFormatOfPruefidentifikator(pruefi);
  } catch {
    return '';
  }
}

/**
 * Get all known EDIFACT formats in alphabetical order.
 * Useful for grouping and sorting operations.
 */
export function getAllFormats(): string[] {
  return Object.values(EdifactFormat).sort();
}
