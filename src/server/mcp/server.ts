import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpServices, createMcpServices } from './services';
import { registerAhbTools } from './tools';

export const MCP_SERVER_NAME = 'ahb-tabellen';

/**
 * Build an `McpServer` with all AHB tools registered against the given services.
 * A fresh instance is cheap; the HTTP layer builds one per request in stateless mode.
 */
export function buildMcpServer(
  services: McpServices = createMcpServices(),
  version = '1.0.0'
): McpServer {
  const server = new McpServer({ name: MCP_SERVER_NAME, version });
  registerAhbTools(server, services);
  return server;
}
