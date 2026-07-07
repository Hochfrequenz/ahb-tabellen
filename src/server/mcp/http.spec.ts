/**
 * @jest-environment node
 *
 * The Streamable HTTP transport relies on Node stream/web globals absent in jsdom, so this
 * suite runs in the node environment.
 */
import type { Application } from 'express';

// See auth.spec.ts — mock the JWT lib so jsdom does not try to parse jose's ESM build.
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import { mountMcp } from './http';
import { McpAuthConfig } from './auth';

interface RouteRecord {
  method: string;
  path: string;
}

/** Minimal fake Express app that records route registrations. */
function fakeApp(): { app: Application; routes: RouteRecord[] } {
  const routes: RouteRecord[] = [];
  const record =
    (method: string) =>
    (path: string, ...handlers: unknown[]) => {
      routes.push({ method, path });
      return handlers;
    };
  const app = { get: record('get'), post: record('post'), delete: record('delete') };
  return { app: app as unknown as Application, routes };
}

const authConfig: McpAuthConfig = {
  issuerBaseURL: 'https://auth.hochfrequenz.de/',
  audience: 'https://host/mcp',
  resource: 'https://host/mcp',
};

describe('mountMcp', () => {
  it('registers the MCP endpoint for POST and rejects GET/DELETE (stateless)', () => {
    const { app, routes } = fakeApp();
    mountMcp(app, { authConfig: null });

    expect(routes).toContainEqual({ method: 'post', path: '/mcp' });
    expect(routes).toContainEqual({ method: 'get', path: '/mcp' });
    expect(routes).toContainEqual({ method: 'delete', path: '/mcp' });
  });

  it('does not register OAuth metadata when auth is disabled', () => {
    const { app, routes } = fakeApp();
    mountMcp(app, { authConfig: null });

    expect(routes.some(r => r.path.startsWith('/.well-known'))).toBe(false);
  });

  it('registers the RFC 9728 metadata routes (path-inserted + root) when auth is configured', () => {
    const { app, routes } = fakeApp();
    mountMcp(app, { authConfig });

    expect(routes).toContainEqual({
      method: 'get',
      path: '/.well-known/oauth-protected-resource/mcp',
    });
    expect(routes).toContainEqual({
      method: 'get',
      path: '/.well-known/oauth-protected-resource',
    });
  });
});
