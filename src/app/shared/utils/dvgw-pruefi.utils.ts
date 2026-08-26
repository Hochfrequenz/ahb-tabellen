/**
 * Stable URL of the DVGW document archive ("Dokumentenarchiv"). It is grouped by
 * Nachrichtentyp and always lists the current release alongside the history, so we link
 * here generically instead of at a specific document version (which would go stale as soon
 * as the DVGW publishes a new version - see issue #814, where TSIMSG 5.10c was already
 * superseded by 5.11). The user picks the current version for the given Nachrichtentyp.
 */
export const DVGW_ARCHIVE_URL =
  'https://www.dvgw-sc.de/leistungen/it-dienstleistungen/datenaustausch-gas/dokumentenarchiv';

/**
 * Information about a DVGW Prüfidentifikator that is published exclusively as a PDF
 * document by the DVGW and therefore cannot be displayed as a machine-readable AHB table.
 */
export interface DvgwPruefiInfo {
  /** Message type (Nachrichtentyp) the Prüfidentifikator belongs to, e.g. 'TSIMSG' or 'SSQNOT'. */
  nachrichtentyp: string;
}

/**
 * Registry of DVGW Prüfidentifikatoren that the DVGW only publishes as PDF documents.
 *
 * These are intentionally hidden from the regular AHB table view (see issue #814 / #606):
 * for TSIMSG we would otherwise show outdated data, and for SSQNOT there is no
 * machine-readable source at all. The DVGW fallback page points at the DVGW document
 * archive ({@link DVGW_ARCHIVE_URL}) and names the Nachrichtentyp instead.
 *
 * IMPORTANT: this must be an explicit allow-list keyed by the exact Prüfidentifikator.
 * `getFormatOfPruefidentifikator('44096')` and `('44097')` both resolve to `UTILMDG`,
 * identical to regular UTILMD-Gas Prüfis (e.g. '44001'), so the TSIMSG Prüfis are NOT
 * detectable via their EDIFACT format. Never hide all '44…' Prüfis wholesale.
 */
export const DVGW_PRUEFIS: Record<string, DvgwPruefiInfo> = {
  // TSIMSG – Zeitreihen-Stammdaten-Informations-Meldung (currently only available as PDF)
  '44096': { nachrichtentyp: 'TSIMSG' },
  '44097': { nachrichtentyp: 'TSIMSG' },
  // SSQNOT – Speicher-Standard-Qualitäts-Notification (no machine-readable source available)
  '70095': { nachrichtentyp: 'SSQNOT' },
  '70096': { nachrichtentyp: 'SSQNOT' },
};

/**
 * Whether the given Prüfidentifikator is a DVGW Prüfidentifikator that should be hidden
 * from the regular AHB table view and pointed to the DVGW document archive instead.
 */
export function isDvgwPruefi(pruefi: string): boolean {
  return Object.prototype.hasOwnProperty.call(DVGW_PRUEFIS, pruefi);
}

/**
 * Get the DVGW info (Nachrichtentyp) for a Prüfidentifikator, or `undefined` if it is not
 * a DVGW Prüfidentifikator.
 */
export function getDvgwPruefiInfo(pruefi: string): DvgwPruefiInfo | undefined {
  return DVGW_PRUEFIS[pruefi];
}
