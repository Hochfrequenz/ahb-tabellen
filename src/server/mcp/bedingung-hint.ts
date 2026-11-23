import { ENV_VARS } from '../infrastructure/app-config';

/**
 * Bedingung (condition-expression) jump-off hint for MCP tools.
 *
 * AHB lines carry an `ahb_expression` (and diff sides carry a `line_ahb_status`) that may contain
 * a condition expression with bracketed conditions, e.g. `Muss [2] ∧ [3]`. Unlike the EBD
 * case there is no key to extract — the expression itself is already in the data — so this is
 * purely an affordance telling the LLM how to resolve/evaluate those conditions with AHBicht.
 */

/** Used when the deployment sets no Bedingungsbaum URL; matches `environment.prod.ts`. */
const DEFAULT_BEDINGUNGSBAUM_BASE_URL = 'https://bedingungsbaum.hochfrequenz.de';

/**
 * Build the hint against a deployment's Bedingungsbaum URL.
 *
 * The URL is read from the same `APP_BEDINGUNGSBAUM_BASE_URL` variable that feeds the browser's
 * `/config.js`, so the link an MCP client is told to follow and the link the web UI renders can
 * never drift apart. An unset or empty value keeps the compiled default, matching `readString`
 * in `app-config.ts`.
 */
export function buildBedingungJumpHint(env: NodeJS.ProcessEnv = process.env): string {
  const bedingungsbaumBaseUrl =
    env[ENV_VARS.bedingungsbaumBaseUrl] || DEFAULT_BEDINGUNGSBAUM_BASE_URL;

  return (
    `The "ahb_expression" field (and "line_ahb_status" on diff sides) may contain a condition ` +
    `expression with bracketed conditions, e.g. "Muss [2] ∧ [3]". To resolve or evaluate those ` +
    `conditions, use AHBicht: the Bedingungsbaum web UI (${bedingungsbaumBaseUrl}) ` +
    `for humans, or the read-only AHBicht MCP server (from Hochfrequenz/ahbicht-functions, ` +
    `mounted at /mcp) which parses modal marks and condition expressions.`
  );
}

/** Resolved once at startup, like the `/config.js` script the server renders in `server.ts`. */
export const BEDINGUNG_JUMP_HINT = buildBedingungJumpHint();
