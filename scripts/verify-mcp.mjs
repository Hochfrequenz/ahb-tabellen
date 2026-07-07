#!/usr/bin/env node
/**
 * verify-mcp — external smoke test for the AHB-Tabellen MCP server over HTTP.
 *
 * ┌─ SCOPE ────────────────────────────────────────────────────────────────────┐
 * │ Verifies ONLY the *unauthenticated* MCP transport + tools:                   │
 * │   • Streamable HTTP reachability and the JSON-RPC / SSE round-trip through    │
 * │     the deployed reverse proxy (Azure App Service)                            │
 * │   • the `initialize` handshake                                                │
 * │   • `tools/list` returns exactly the expected read-only tool set              │
 * │   • a few `tools/call` return real data from the live database                │
 * │   • a domain error surfaces as an `isError` tool result (not a crash)         │
 * │                                                                               │
 * │ OUT OF SCOPE — NOT tested here: Auth0 / OAuth.                                 │
 * │   This script sends NO bearer token. Against an auth-protected endpoint every │
 * │   call returns 401 and this script will (correctly) fail. Token acquisition   │
 * │   (DCR + PKCE + interactive login) and the RFC 8707 `resource`→`audience`     │
 * │   mapping can only be verified with a real MCP client (e.g. a Claude Custom   │
 * │   Connector) once the Auth0 API is configured — see the Auth0 checklist on    │
 * │   PR #836. Enabling auth is a deliberate, separate milestone.                 │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Usage:  node scripts/verify-mcp.mjs [url]
 *         MCP_URL=https://host/mcp node scripts/verify-mcp.mjs
 * Default target: the stage endpoint. Exit code 0 = all checks passed, 1 = failure.
 *
 * No dependencies (Node >= 18 global fetch). Not part of the Jest suite — this hits a
 * live, deployed server, whereas the Jest specs cover the same behavior in-process.
 */

const DEFAULT_URL = 'https://ahb-tabellen.stage.hochfrequenz.de/mcp';
const url = process.argv[2] || process.env.MCP_URL || DEFAULT_URL;

const EXPECTED_TOOLS = [
  'get_ahb',
  'search_ahb_lines',
  'get_ahb_diff',
  'get_ahb_diff_summary',
  'list_format_versions',
  'list_formate',
  'list_directions',
  'get_datenstand',
  'list_pruefis_by_format_version',
].sort();

let rpcId = 0;

/** Send one JSON-RPC request and return its `result` (throws on transport/RPC error). */
async function rpc(method, params = {}) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${method}${res.status === 401 ? ' (auth is enabled — this script is unauthenticated; see SCOPE)' : ''}`);
  }
  const contentType = res.headers.get('content-type') ?? '';
  let message;
  if (contentType.includes('application/json')) {
    message = JSON.parse(text);
  } else {
    // Streamable HTTP returns the JSON-RPC response as an SSE `data:` line.
    const line = text.split('\n').find(l => l.startsWith('data:'));
    if (!line) throw new Error(`No JSON/SSE payload for ${method}: ${text.slice(0, 200)}`);
    message = JSON.parse(line.slice('data:'.length).trim());
  }
  if (message.error) throw new Error(`JSON-RPC error for ${method}: ${JSON.stringify(message.error)}`);
  return message.result;
}

const results = [];
async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    results.push({ name, ok: false, err });
    console.log(`  ✗ ${name}\n      ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

/** The text payload of a tool result (tools return JSON-in-text content). */
function toolText(result) {
  return result?.content?.[0]?.text ?? '';
}

async function main() {
  console.log(`verify-mcp → ${url}\n(unauthenticated transport + tools smoke test — see SCOPE in this file)\n`);

  await check('initialize handshake', async () => {
    const result = await rpc('initialize', {
      protocolVersion: '2025-06-18',
      capabilities: {},
      clientInfo: { name: 'verify-mcp', version: '1.0.0' },
    });
    assert(result?.serverInfo?.name === 'ahb-tabellen', `unexpected serverInfo: ${JSON.stringify(result?.serverInfo)}`);
  });

  await check('tools/list returns the expected read-only tool set', async () => {
    const result = await rpc('tools/list');
    const names = (result?.tools ?? []).map(t => t.name).sort();
    assert(
      JSON.stringify(names) === JSON.stringify(EXPECTED_TOOLS),
      `tool set mismatch.\n      expected: ${EXPECTED_TOOLS.join(', ')}\n      got:      ${names.join(', ')}`
    );
    for (const tool of result.tools) {
      assert(tool.annotations?.readOnlyHint === true, `tool ${tool.name} is not annotated readOnlyHint`);
    }
  });

  await check('tools/call get_datenstand returns data', async () => {
    const result = await rpc('tools/call', { name: 'get_datenstand', arguments: {} });
    assert(!result.isError, `tool reported an error: ${toolText(result)}`);
    assert(toolText(result).length > 0, 'empty result content');
  });

  await check('tools/call list_format_versions returns a non-empty array', async () => {
    const result = await rpc('tools/call', { name: 'list_format_versions', arguments: {} });
    assert(!result.isError, `tool reported an error: ${toolText(result)}`);
    const versions = JSON.parse(toolText(result));
    assert(Array.isArray(versions) && versions.length > 0, `expected a non-empty array, got: ${toolText(result).slice(0, 120)}`);
  });

  await check('invalid input surfaces as an isError tool result (not a crash)', async () => {
    const result = await rpc('tools/call', {
      name: 'get_ahb',
      arguments: { formatVersion: 'FV2504', pruefi: 'not-a-pruefi' },
    });
    assert(result.isError === true, 'expected isError:true for an invalid Prüfidentifikator');
    assert(/VALIDATION_ERROR/.test(toolText(result)), `expected a validation error message, got: ${toolText(result).slice(0, 120)}`);
  });

  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${failed === 0 ? '✓ all' : `✗ ${failed} of ${results.length}`} checks ${failed === 0 ? 'passed' : 'failed'}.`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error(`\nverify-mcp aborted: ${err.message}`);
  process.exit(1);
});
