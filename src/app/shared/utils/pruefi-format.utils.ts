/**
 * Mapping from Prüfidentifikator prefix (first 2 digits) to EDIFACT format.
 * Each Prüfidentifikator starts with a 2-digit prefix that identifies the format.
 */
const PRUEFI_PREFIX_TO_FORMAT: Record<string, string> = {
  '11': 'UTILMD',
  '13': 'MSCONS',
  '15': 'QUOTES',
  '17': 'ORDERS',
  '19': 'ORDRSP',
  '21': 'IFTSTA',
  '23': 'INSRPT',
  '25': 'UTILTS',
  '27': 'PRICAT',
  '29': 'COMDIS',
  '31': 'INVOIC',
  '33': 'REMADV',
  '35': 'REQOTE',
  '37': 'PARTIN',
  '39': 'ORDCHG',
  '44': 'UTILMDG',
  '55': 'UTILMDS',
  '91': 'CONTRL',
  '92': 'APERAK',
  '99': 'APERAK',
};

/**
 * Get the EDIFACT format for a given Prüfidentifikator.
 * @param pruefi - The 5-digit Prüfidentifikator (e.g., '11001', '55014')
 * @returns The EDIFACT format name (e.g., 'UTILMD', 'UTILMDS') or empty string if unknown
 */
export function getFormatFromPruefi(pruefi: string): string {
  const prefix = pruefi.substring(0, 2);
  return PRUEFI_PREFIX_TO_FORMAT[prefix] || '';
}

/**
 * Get all known EDIFACT formats in alphabetical order.
 * Useful for grouping and sorting operations.
 */
export function getAllFormats(): string[] {
  const formats = new Set(Object.values(PRUEFI_PREFIX_TO_FORMAT));
  return Array.from(formats).sort();
}
