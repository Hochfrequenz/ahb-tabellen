import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AppError } from '../infrastructure/errors';

/**
 * MCP tool result alias. Typed as the SDK's `CallToolResult` via a type-only import (erased
 * at runtime, so this module stays free of runtime SDK loading and is unit-testable).
 */
export type ToolResult = CallToolResult;

/** Wrap data as a JSON text result. */
export function jsonResult(data: unknown): ToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

/** An error result the model can see and react to (`isError: true`). */
export function errorResult(message: string): ToolResult {
  return { content: [{ type: 'text', text: message }], isError: true };
}

/**
 * Run a service call and map the outcome to a tool result.
 *
 * - Success → JSON text result.
 * - Expected domain errors (`AppError`: validation / not-found / ...) → `isError` result
 *   carrying the curated `errorCode: message`, mirroring `httpErrorHandler`.
 * - Unexpected errors → generic `isError` result (details logged, not leaked to the client).
 *
 * Domain/unexpected errors are returned as tool results (not thrown) so the model sees
 * them; only transport-level auth failures are surfaced as protocol errors upstream.
 */
export async function toToolResult(fn: () => Promise<unknown>): Promise<ToolResult> {
  try {
    return jsonResult(await fn());
  } catch (error) {
    if (error instanceof AppError) {
      return errorResult(`${error.errorCode}: ${error.message}`);
    }
    console.error('Unexpected error in MCP tool handler:', error);
    return errorResult('INTERNAL_ERROR: An unexpected error occurred');
  }
}
