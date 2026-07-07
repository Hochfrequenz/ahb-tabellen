import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpServices } from './services';
import { toToolResult } from './result';
import { EBD_JUMP_HINT } from './ebd-hint';
import { SearchPayload } from '../repository/ahb';

/**
 * All AHB tools are read-only queries over a fixed data set.
 * `as const` so the literal boolean values are preserved for the SDK's `ToolAnnotations`.
 */
const READ_ONLY = { readOnlyHint: true, openWorldHint: false } as const;

const FORMAT_VERSION_DESC = 'EDIFACT format version, pattern FVYYYY (e.g. "FV2410").';
const PRUEFI_DESC = 'Prüfidentifikator: exactly 5 digits (e.g. "11001").';

/** Names of all registered MCP tools, in registration order (used by tests). */
export const MCP_TOOL_NAMES = [
  'get_ahb',
  'search_ahb_lines',
  'get_ahb_diff',
  'get_ahb_diff_summary',
  'list_format_versions',
  'list_formate',
  'list_directions',
  'get_datenstand',
  'list_pruefis_by_format_version',
] as const;

const searchFilterCondition = z.object({
  eq: z.string().optional(),
  neq: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  in: z.array(z.string()).optional(),
  isNull: z.boolean().optional(),
  isNotNull: z.boolean().optional(),
});

const searchFilters = z
  .object({
    format_version: searchFilterCondition,
    format: searchFilterCondition,
    pruefidentifikator: searchFilterCondition,
    description: searchFilterCondition,
    segmentgroup_key: searchFilterCondition,
    segment_code: searchFilterCondition,
    data_element: searchFilterCondition,
    qualifier: searchFilterCondition,
    line_ahb_status: searchFilterCondition,
    line_name: searchFilterCondition,
    bedingung: searchFilterCondition,
    sender: searchFilterCondition,
    empfaenger: searchFilterCondition,
  })
  .partial();

/**
 * Register all AHB tools on an `McpServer`. Handlers are registered inline so the SDK
 * infers each handler's argument types directly from its zod `inputSchema` — args are
 * fully typed (e.g. `pruefi: string`), with no stringly-typed access and no casts.
 */
export function registerAhbTools(server: McpServer, services: McpServices): void {
  server.registerTool(
    'get_ahb',
    {
      title: 'Get AHB',
      description:
        'Retrieve a single Anwendungshandbuch (AHB) as JSON for a Prüfidentifikator in a ' +
        'given format version. ' +
        EBD_JUMP_HINT,
      inputSchema: {
        formatVersion: z.string().describe(FORMAT_VERSION_DESC),
        pruefi: z.string().describe(PRUEFI_DESC),
      },
      annotations: { ...READ_ONLY, title: 'Get AHB' },
    },
    async ({ formatVersion, pruefi }) =>
      toToolResult(async () => (await services.ahb.getAhb(pruefi, formatVersion, 'json')).content)
  );

  server.registerTool(
    'search_ahb_lines',
    {
      title: 'Search AHB lines',
      description:
        'Full-text and filtered search across AHB lines of all format versions. Supports ' +
        'pagination, sorting, and per-field filters (eq/neq/contains/startsWith/endsWith/in/' +
        'isNull/isNotNull), including the virtual sender/empfaenger direction fields.',
      inputSchema: {
        q: z.string().describe('Full-text query; use an empty string to match all lines.'),
        page: z.number().int().min(1).describe('1-based page number.'),
        pageSize: z.number().int().min(1).max(500).describe('Results per page (1–500).'),
        sort: z
          .array(z.object({ field: z.string(), direction: z.enum(['asc', 'desc']).optional() }))
          .describe('Sort order; may be an empty array.'),
        filters: searchFilters.optional().describe('Optional per-field filter conditions.'),
      },
      annotations: { ...READ_ONLY, title: 'Search AHB lines' },
    },
    async ({ q, page, pageSize, sort, filters }) =>
      toToolResult(() => {
        const payload: SearchPayload = { q, page, pageSize, sort, filters };
        return services.ahb.searchAhbLines(payload);
      })
  );

  server.registerTool(
    'get_ahb_diff',
    {
      title: 'Get AHB diff',
      description:
        'Line-level diff of one Prüfidentifikator between two format versions (added / ' +
        'deleted / modified / unchanged lines with old and new values). ' +
        EBD_JUMP_HINT,
      inputSchema: {
        pruefi: z.string().describe(PRUEFI_DESC),
        formatVersionNew: z.string().describe('Newer ' + FORMAT_VERSION_DESC),
        formatVersionOld: z.string().describe('Older ' + FORMAT_VERSION_DESC),
      },
      annotations: { ...READ_ONLY, title: 'Get AHB diff' },
    },
    async ({ pruefi, formatVersionNew, formatVersionOld }) =>
      toToolResult(() => services.ahbDiff.getDiff(pruefi, formatVersionNew, formatVersionOld))
  );

  server.registerTool(
    'get_ahb_diff_summary',
    {
      title: 'Get AHB diff summary',
      description:
        'Per-Prüfidentifikator change counts (added / deleted / modified) between two ' +
        'format versions.',
      inputSchema: {
        formatVersionNew: z.string().describe('Newer ' + FORMAT_VERSION_DESC),
        formatVersionOld: z.string().describe('Older ' + FORMAT_VERSION_DESC),
      },
      annotations: { ...READ_ONLY, title: 'Get AHB diff summary' },
    },
    async ({ formatVersionNew, formatVersionOld }) =>
      toToolResult(() => services.ahbDiff.getSummary(formatVersionNew, formatVersionOld))
  );

  server.registerTool(
    'list_format_versions',
    {
      title: 'List format versions',
      description: 'List all available EDIFACT format versions (e.g. FV2410).',
      annotations: { ...READ_ONLY, title: 'List format versions' },
    },
    async () => toToolResult(() => services.metadata.listFormatVersions())
  );

  server.registerTool(
    'list_formate',
    {
      title: 'List formats',
      description: 'List all available EDIFACT formats (e.g. UTILMD, MSCONS).',
      annotations: { ...READ_ONLY, title: 'List formats' },
    },
    async () => toToolResult(() => services.metadata.listFormate())
  );

  server.registerTool(
    'list_directions',
    {
      title: 'List direction values',
      description: 'List the distinct sender and empfaenger (recipient) direction values.',
      annotations: { ...READ_ONLY, title: 'List direction values' },
    },
    async () => toToolResult(() => services.metadata.listDirections())
  );

  server.registerTool(
    'get_datenstand',
    {
      title: 'Get Datenstand',
      description: 'Get the latest Veröffentlichungsdatum (publication date) of the data set.',
      annotations: { ...READ_ONLY, title: 'Get Datenstand' },
    },
    async () => toToolResult(() => services.metadata.getDatenstand())
  );

  server.registerTool(
    'list_pruefis_by_format_version',
    {
      title: 'List Prüfidentifikatoren by format version',
      description:
        'List all Prüfidentifikatoren (with descriptions) available in a given format version.',
      inputSchema: {
        formatVersion: z.string().describe(FORMAT_VERSION_DESC),
      },
      annotations: { ...READ_ONLY, title: 'List Prüfidentifikatoren by format version' },
    },
    async ({ formatVersion }) =>
      toToolResult(() => services.metadata.listPruefisByFormatVersion(formatVersion))
  );
}
