/**
 * Information about a DVGW Prüfidentifikator that is published exclusively as a PDF
 * document by the DVGW and therefore cannot be displayed as a machine-readable AHB table.
 */
export interface DvgwPruefiInfo {
  /** Message type (Nachrichtentyp) the Prüfidentifikator belongs to, e.g. 'TSIMSG' or 'SSQNOT'. */
  nachrichtentyp: string;
  /** URL of the DVGW PDF document that publishes this Prüfidentifikator. */
  dokumentUrl: string;
  /** Human-readable name of the document incl. version, used as the link text (e.g. 'TSIMSG 5.11'). */
  linkText: string;
}

/**
 * Registry of DVGW Prüfidentifikatoren that the DVGW only publishes as PDF documents.
 *
 * These are intentionally hidden from the regular AHB table view (see issue #814 / #606):
 * for TSIMSG we would otherwise show outdated data, and for SSQNOT there is no
 * machine-readable source at all. Each entry points at the current DVGW PDF instead.
 *
 * IMPORTANT: this must be an explicit allow-list keyed by the exact Prüfidentifikator.
 * `getFormatOfPruefidentifikator('44096')` and `('44097')` both resolve to `UTILMDG`,
 * identical to regular UTILMD-Gas Prüfis (e.g. '44001'), so the TSIMSG Prüfis are NOT
 * detectable via their EDIFACT format. Never hide all '44…' Prüfis wholesale.
 */
export const DVGW_PRUEFIS: Record<string, DvgwPruefiInfo> = {
  // TSIMSG – Zeitreihen-Stammdaten-Informations-Meldung (currently only available as PDF)
  '44096': {
    nachrichtentyp: 'TSIMSG',
    dokumentUrl:
      'https://www.dvgw-sc.de/medien/Dokumente_Datenaustausch/Nachrichtentypen/TSIMSG_5.11_Stand_2026_04_01.pdf',
    linkText: 'TSIMSG 5.11',
  },
  '44097': {
    nachrichtentyp: 'TSIMSG',
    dokumentUrl:
      'https://www.dvgw-sc.de/medien/Dokumente_Datenaustausch/Nachrichtentypen/TSIMSG_5.11_Stand_2026_04_01.pdf',
    linkText: 'TSIMSG 5.11',
  },
  // SSQNOT – Speicher-Standard-Qualitäts-Notification (no machine-readable source available)
  '70095': {
    nachrichtentyp: 'SSQNOT',
    dokumentUrl:
      'https://www.dvgw-sc.de/medien/Dokumente_Datenaustausch/Nachrichtentypen/SSQNOT_5.7_Stand_2021-10-31_Fehlerkorrektur.pdf',
    linkText: 'SSQNOT 5.7',
  },
  '70096': {
    nachrichtentyp: 'SSQNOT',
    dokumentUrl:
      'https://www.dvgw-sc.de/medien/Dokumente_Datenaustausch/Nachrichtentypen/SSQNOT_5.7_Stand_2021-10-31_Fehlerkorrektur.pdf',
    linkText: 'SSQNOT 5.7',
  },
};

/**
 * Whether the given Prüfidentifikator is a DVGW Prüfidentifikator that should be hidden
 * from the regular AHB table view and pointed to a DVGW PDF instead.
 */
export function isDvgwPruefi(pruefi: string): boolean {
  return Object.prototype.hasOwnProperty.call(DVGW_PRUEFIS, pruefi);
}

/**
 * Get the DVGW document info for a Prüfidentifikator, or `undefined` if it is not a
 * DVGW Prüfidentifikator.
 */
export function getDvgwPruefiInfo(pruefi: string): DvgwPruefiInfo | undefined {
  return DVGW_PRUEFIS[pruefi];
}
