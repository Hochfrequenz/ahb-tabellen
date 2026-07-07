import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildMcpServer } from './server';
import { MCP_TOOL_NAMES } from './tools';
import { McpServices } from './services';
import { ValidationError } from '../infrastructure/errors';

interface CallResult {
  isError?: boolean;
  content: { type: string; text: string }[];
}

function parse(result: CallResult): unknown {
  return JSON.parse(result.content[0].text);
}

describe('MCP server (in-memory integration)', () => {
  let services: {
    ahb: { getAhb: jest.Mock; searchAhbLines: jest.Mock };
    ahbDiff: { getDiff: jest.Mock; getSummary: jest.Mock };
    metadata: {
      listFormatVersions: jest.Mock;
      listFormate: jest.Mock;
      listDirections: jest.Mock;
      getDatenstand: jest.Mock;
      listPruefisByFormatVersion: jest.Mock;
    };
  };
  let client: Client;

  beforeEach(async () => {
    services = {
      ahb: { getAhb: jest.fn(), searchAhbLines: jest.fn() },
      ahbDiff: { getDiff: jest.fn(), getSummary: jest.fn() },
      metadata: {
        listFormatVersions: jest.fn(),
        listFormate: jest.fn(),
        listDirections: jest.fn(),
        getDatenstand: jest.fn(),
        listPruefisByFormatVersion: jest.fn(),
      },
    };

    const server = buildMcpServer(services as unknown as McpServices, 'test');
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: 'test-client', version: '1.0.0' });
    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
  });

  describe('listTools', () => {
    it('exposes exactly the AHB tools, all annotated read-only', async () => {
      const { tools } = await client.listTools();
      expect(tools.map(t => t.name).sort()).toEqual([...MCP_TOOL_NAMES].sort());
      for (const tool of tools) {
        expect(tool.annotations?.readOnlyHint).toBe(true);
        expect(tool.description).toBeTruthy();
      }
    });
  });

  describe('tool calls delegate to the services', () => {
    it('get_ahb returns the JSON AHB content', async () => {
      const ahb = { meta: { pruefidentifikator: '11001' }, lines: [] };
      services.ahb.getAhb.mockResolvedValue({ fileType: 'json', content: ahb });

      const result = (await client.callTool({
        name: 'get_ahb',
        arguments: { formatVersion: 'FV2410', pruefi: '11001' },
      })) as CallResult;

      expect(services.ahb.getAhb).toHaveBeenCalledWith('11001', 'FV2410', 'json');
      expect(result.isError).toBeFalsy();
      expect(parse(result)).toEqual(ahb);
    });

    it('search_ahb_lines forwards the validated payload', async () => {
      const searchResult = { items: [], total: 0, page: 1, pageSize: 25 };
      services.ahb.searchAhbLines.mockResolvedValue(searchResult);

      const result = (await client.callTool({
        name: 'search_ahb_lines',
        arguments: {
          q: 'test',
          page: 1,
          pageSize: 25,
          sort: [{ field: 'format_version', direction: 'asc' }],
          filters: { format: { eq: 'UTILMD' }, sender: { in: ['LF'] } },
        },
      })) as CallResult;

      expect(services.ahb.searchAhbLines).toHaveBeenCalledWith({
        q: 'test',
        page: 1,
        pageSize: 25,
        sort: [{ field: 'format_version', direction: 'asc' }],
        filters: { format: { eq: 'UTILMD' }, sender: { in: ['LF'] } },
      });
      expect(parse(result)).toEqual(searchResult);
    });

    it('get_ahb_diff_summary returns the summary', async () => {
      const summary = { '11001': { added: 1, deleted: 0, modified: 2 } };
      services.ahbDiff.getSummary.mockResolvedValue(summary);

      const result = (await client.callTool({
        name: 'get_ahb_diff_summary',
        arguments: { formatVersionNew: 'FV2504', formatVersionOld: 'FV2410' },
      })) as CallResult;

      expect(services.ahbDiff.getSummary).toHaveBeenCalledWith('FV2504', 'FV2410');
      expect(parse(result)).toEqual(summary);
    });

    it('list_format_versions takes no arguments', async () => {
      services.metadata.listFormatVersions.mockResolvedValue(['FV2410', 'FV2504']);

      const result = (await client.callTool({
        name: 'list_format_versions',
        arguments: {},
      })) as CallResult;

      expect(parse(result)).toEqual(['FV2410', 'FV2504']);
    });

    it('list_pruefis_by_format_version passes the format version', async () => {
      services.metadata.listPruefisByFormatVersion.mockResolvedValue([
        { pruefidentifikator: '11001', name: 'x' },
      ]);

      await client.callTool({
        name: 'list_pruefis_by_format_version',
        arguments: { formatVersion: 'FV2410' },
      });

      expect(services.metadata.listPruefisByFormatVersion).toHaveBeenCalledWith('FV2410');
    });
  });

  describe('error handling', () => {
    it('maps a service ValidationError to an isError tool result', async () => {
      services.ahb.getAhb.mockRejectedValue(new ValidationError('Invalid Prüfidentifikator'));

      const result = (await client.callTool({
        name: 'get_ahb',
        arguments: { formatVersion: 'FV2410', pruefi: '99999' },
      })) as CallResult;

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('VALIDATION_ERROR: Invalid Prüfidentifikator');
    });

    it('returns a schema-validation error without invoking the service', async () => {
      const result = (await client.callTool({
        name: 'get_ahb',
        arguments: { formatVersion: 'FV2410' },
      })) as CallResult;

      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('validation');
      expect(services.ahb.getAhb).not.toHaveBeenCalled();
    });
  });
});
