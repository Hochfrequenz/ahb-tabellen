/**
 * @jest-environment node
 *
 * End-to-end test of the HTTP mounting over the wire: a real Express app (with the global
 * JSON body parser, as in server.ts) driven with raw MCP JSON-RPC via `fetch`. Exercises
 * what http.spec.ts cannot — body handoff to the transport, the request cast, the
 * per-request server/transport lifecycle, and real initialize / tools/list / tools/call
 * responses.
 *
 * Uses raw fetch rather than the SDK's StreamableHTTPClientTransport because that client
 * module pulls in an ESM-only dependency the jest runtime cannot load.
 */
import express from 'express';
import type { AddressInfo } from 'net';
import type { Server } from 'http';
import { mountMcp } from './http';
import { McpServices } from './services';

interface RpcResponse {
  status: number;
  json: { result?: { tools?: { name: string }[]; content?: { text: string }[] }; error?: unknown };
}

describe('MCP over real HTTP (raw JSON-RPC)', () => {
  let server: Server;
  let url: string;
  let warnSpy: jest.SpyInstance;
  const services = {
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

  beforeAll(done => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const app = express();
    app.use(express.json());
    mountMcp(app, { services: services as unknown as McpServices, authConfig: null });
    server = app.listen(0, () => {
      url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/mcp`;
      done();
    });
  });

  afterAll(done => {
    warnSpy.mockRestore();
    server.close(() => done());
  });

  afterEach(() => jest.clearAllMocks());

  async function rpc(body: Record<string, unknown>): Promise<RpcResponse> {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
      },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    const contentType = res.headers.get('content-type') ?? '';
    let json: RpcResponse['json'] = {};
    if (contentType.includes('application/json')) {
      json = JSON.parse(text);
    } else {
      // Streamable HTTP returns the JSON-RPC response as an SSE `data:` line.
      const dataLine = text.split('\n').find(line => line.startsWith('data:'));
      if (dataLine) {
        json = JSON.parse(dataLine.slice('data:'.length).trim());
      }
    }
    return { status: res.status, json };
  }

  const initialize = (): Promise<RpcResponse> =>
    rpc({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'e2e', version: '1' },
      },
    });

  it('handles initialize over HTTP', async () => {
    const res = await initialize();
    expect(res.status).toBe(200);
    expect(res.json.result).toBeDefined();
  });

  it('lists all tools (stateless: fresh server per request, no prior init)', async () => {
    const res = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    expect(res.status).toBe(200);
    expect(res.json.result?.tools).toHaveLength(9);
  });

  it('invokes a tool end-to-end, forwarding the parsed body to the service', async () => {
    services.metadata.listFormatVersions.mockResolvedValue(['FV2410', 'FV2504']);

    const res = await rpc({
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: { name: 'list_format_versions', arguments: {} },
    });

    expect(res.status).toBe(200);
    expect(services.metadata.listFormatVersions).toHaveBeenCalledTimes(1);
    expect(JSON.parse(res.json.result!.content![0].text)).toEqual(['FV2410', 'FV2504']);
  });
});
