/**
 * Bedingung (condition-expression) jump-off hint for MCP tools.
 *
 * AHB lines carry an `ahb_expression` (and diff sides carry a `line_ahb_status`) that may contain
 * a condition expression with bracketed conditions, e.g. `Muss [2] ∧ [3]`. Unlike the EBD
 * case there is no key to extract — the expression itself is already in the data — so this is
 * purely an affordance telling the LLM how to resolve/evaluate those conditions with AHBicht.
 */
export const BEDINGUNG_JUMP_HINT =
  `The "ahb_expression" field (and "line_ahb_status" on diff sides) may contain a condition ` +
  `expression with bracketed conditions, e.g. "Muss [2] ∧ [3]". To resolve or evaluate those ` +
  `conditions, use AHBicht: the Bedingungsbaum web UI (https://bedingungsbaum.hochfrequenz.de) ` +
  `for humans, or the read-only AHBicht MCP server (from Hochfrequenz/ahbicht-functions, ` +
  `mounted at /mcp) which parses modal marks and condition expressions.`;
