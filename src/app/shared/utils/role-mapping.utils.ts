export interface RoleGroup {
  label: string;
  codes: string[];
}

/**
 * Maps raw sender/empfaenger role codes (as stored in Kommunikationsrichtung) to
 * human-readable base market roles. Variant codes (e.g. LFA/LFN for old/new supplier
 * during a switch) are grouped under their base role.
 */
export const ROLE_GROUPS: Record<string, RoleGroup> = {
  LF: { label: 'Lieferant', codes: ['LF', 'LFA', 'LFN'] },
  NB: { label: 'Netzbetreiber', codes: ['NB'] },
  MSB: { label: 'Messstellenbetreiber', codes: ['MSB', 'MSBA', 'MSBN'] },
  ESA: { label: 'Energieserviceanbieter', codes: ['ESA'] },
  ÜNB: { label: 'Übertragungsnetzbetreiber', codes: ['ÜNB', 'ÜNB (Strom)'] },
};

/**
 * Get the base role key (e.g. 'LF') for a raw role code (e.g. 'LFA').
 * Returns null for codes that don't belong to any known role group.
 */
export function getBaseRoleKey(code: string): string | null {
  for (const [key, group] of Object.entries(ROLE_GROUPS)) {
    if (group.codes.includes(code)) {
      return key;
    }
  }
  return null;
}

/**
 * Get the distinct base role keys (e.g. ['LF', 'MSB']) present in a Pruefi's raw role codes.
 * Unmapped codes are silently dropped.
 */
export function getRolesForPruefi(codes: string[]): string[] {
  const roles = new Set<string>();
  for (const code of codes) {
    const key = getBaseRoleKey(code);
    if (key) {
      roles.add(key);
    }
  }
  return Array.from(roles);
}

/**
 * Get all known base role keys in the order they should be displayed.
 */
export function getAllRoleKeys(): string[] {
  return Object.keys(ROLE_GROUPS);
}

/**
 * Get the human-readable label for a base role key.
 */
export function getRoleLabel(key: string): string {
  return ROLE_GROUPS[key]?.label ?? key;
}
