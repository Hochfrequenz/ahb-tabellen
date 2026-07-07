/**
 * EBD jump-off hint for MCP tools.
 *
 * AHB lines carry an `ebd_key` (e.g. `E_0401`) detected in the business-logic layer
 * (see `service/ebd.ts`). We do NOT fetch EBD data ourselves or emit fixed file URLs —
 * not every EBD provides every file type, so we hand the LLM the stable raw base + the
 * repo's own access contract (`llms.txt`) and let it discover what exists.
 */
export const EBD_REPO_RAW_BASE =
  'https://raw.githubusercontent.com/Hochfrequenz/machine-readable_entscheidungsbaumdiagramme/main';

export const EBD_JUMP_HINT =
  `Some lines carry an "ebd_key" (e.g. E_0401) that references an EDI@Energy decision tree ` +
  `(Entscheidungsbaumdiagramm). To reason about it, fetch the machine-readable data from ` +
  `${EBD_REPO_RAW_BASE}/<formatVersion>/<ebd_key>.json (structured JSON — reason over this; a ` +
  `<ebd_key>.puml graph may also exist). Not every EBD provides every file type — prefer .json ` +
  `and consult the access contract at ${EBD_REPO_RAW_BASE}/llms.txt (and the per-version ` +
  `index.json) if a file is missing.`;
