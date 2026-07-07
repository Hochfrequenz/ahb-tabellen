/**
 * EBD (Entscheidungsbaumdiagramm) detection — single source of truth.
 *
 * Some AHB lines reference a decision-tree diagram via an EBD key like `E_0401`
 * (historically detected in the `value_pool_entry` / `qualifier` field). This used to be
 * done with a regex in the Angular frontend (duplicated across the AHB and comparison
 * tables); it now lives in the business-logic layer so every transport (REST/frontend,
 * MCP, ...) gets the same detection.
 */
const EBD_KEY_PATTERN = /\bE_\d+\b/g;

/**
 * Extract the EBD key (e.g. `E_0401`) from a field value, or `null` if none is present.
 *
 * If several keys are present, the **last** one wins — matching the behaviour of the old
 * frontend regex (`/^.*\b(E_\d+)\b.*$/`, whose greedy prefix backtracked to the last match),
 * so this refactor is behaviour-preserving. In practice a value_pool_entry / qualifier holds
 * at most one EBD key.
 */
export function extractEbdKey(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }
  const matches = value.match(EBD_KEY_PATTERN);
  return matches ? matches[matches.length - 1] : null;
}
