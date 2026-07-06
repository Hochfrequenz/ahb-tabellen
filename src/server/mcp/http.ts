import { Application, Request, RequestHandler, Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { buildMcpServer } from './server';
import { createMcpServices, McpServices } from './services';
import {
  MCP_PATH,
  McpAuthConfig,
  loadMcpAuthConfig,
  protectedResourceMetadata,
  requireBearer,
} from './auth';

export interface MountMcpOptions {
  services?: McpServices;
  /** Auth config; when omitted it is read from the environment. `null` forces no auth. */
  authConfig?: McpAuthConfig | null;
  version?: string;
}

/**
 * Mount the MCP server on an Express app at `/mcp` using the Streamable HTTP transport in
 * stateless mode (fresh server + transport per request — appropriate for a read-only query
 * server behind a load balancer).
 *
 * MUST be called before the static/catch-all routes in `server.ts` so `/mcp` and the
 * `.well-known` metadata route are not shadowed by the SPA fallback.
 */
export function mountMcp(app: Application, options: MountMcpOptions = {}): void {
  const services = options.services ?? createMcpServices();
  const authConfig =
    options.authConfig === null ? undefined : (options.authConfig ?? loadMcpAuthConfig());
  const version = options.version ?? process.env['VERSION'] ?? '0.0.0';

  if (authConfig) {
    const metadata = protectedResourceMetadata(authConfig);
    const serveMetadata: RequestHandler = (_req, res) => {
      res.status(200).json(metadata);
    };
    // RFC 9728 path-inserted location (primary) plus the root path (fallback).
    app.get('/.well-known/oauth-protected-resource/mcp', serveMetadata);
    app.get('/.well-known/oauth-protected-resource', serveMetadata);
  }

  const guards: RequestHandler[] = authConfig ? [requireBearer(authConfig)] : [];

  app.post(MCP_PATH, ...guards, async (req: Request, res: Response) => {
    // Stateless: a new server + transport per request (no session reuse).
    const server = buildMcpServer(services, version);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      void transport.close();
      void server.close();
    });
    try {
      await server.connect(transport);
      // Global express.json() already parsed the body — pass it explicitly so the
      // transport does not try to re-read the consumed stream. `req` is cast to the
      // transport's expected node request type (express-oauth2-jwt-bearer augments
      // Express's `Request.auth` differently from the SDK's `AuthInfo`).
      await transport.handleRequest(
        req as unknown as Parameters<typeof transport.handleRequest>[0],
        res,
        req.body
      );
    } catch (error) {
      console.error('MCP request handling error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'internal_error' });
      }
    }
  });

  const methodNotAllowed: RequestHandler = (_req, res) => {
    res.status(405).json({ error: 'method_not_allowed', message: 'Use POST for MCP requests' });
  };
  app.get(MCP_PATH, ...guards, methodNotAllowed);
  app.delete(MCP_PATH, ...guards, methodNotAllowed);
}
