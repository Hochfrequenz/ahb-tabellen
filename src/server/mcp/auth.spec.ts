import { Request, Response } from 'express';

// The real express-oauth2-jwt-bearer pulls in jose, whose ESM "browser" build the jsdom
// test environment cannot parse. We never exercise real JWT validation here (only the
// missing/malformed-token branch, which does not call auth()), so mock it away.
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import {
  loadMcpAuthConfig,
  protectedResourceMetadata,
  resourceMetadataUrl,
  wwwAuthenticateHeader,
  requireBearer,
  McpAuthConfig,
} from './auth';

const config: McpAuthConfig = {
  issuerBaseURL: 'https://auth.hochfrequenz.de/',
  audience: 'https://ahb-tabellen.stage.hochfrequenz.de/mcp',
  resource: 'https://ahb-tabellen.stage.hochfrequenz.de/mcp',
};

describe('mcp/auth', () => {
  describe('loadMcpAuthConfig', () => {
    it('returns undefined when required env vars are missing (auth disabled)', () => {
      expect(loadMcpAuthConfig({})).toBeUndefined();
      expect(loadMcpAuthConfig({ MCP_AUTH0_ISSUER_BASE_URL: 'x' })).toBeUndefined();
      expect(loadMcpAuthConfig({ MCP_AUTH0_AUDIENCE: 'x' })).toBeUndefined();
    });

    it('builds config and defaults resource to audience', () => {
      expect(
        loadMcpAuthConfig({
          MCP_AUTH0_ISSUER_BASE_URL: 'https://auth.hochfrequenz.de/',
          MCP_AUTH0_AUDIENCE: 'https://host/mcp',
        })
      ).toEqual({
        issuerBaseURL: 'https://auth.hochfrequenz.de/',
        audience: 'https://host/mcp',
        resource: 'https://host/mcp',
      });
    });

    it('honors an explicit MCP_RESOURCE override', () => {
      expect(
        loadMcpAuthConfig({
          MCP_AUTH0_ISSUER_BASE_URL: 'https://auth.hochfrequenz.de/',
          MCP_AUTH0_AUDIENCE: 'api-id',
          MCP_RESOURCE: 'https://host/mcp',
        })?.resource
      ).toBe('https://host/mcp');
    });
  });

  describe('protectedResourceMetadata', () => {
    it('produces an RFC 9728 document pointing at the authorization server', () => {
      expect(protectedResourceMetadata(config)).toEqual({
        resource: config.resource,
        authorization_servers: ['https://auth.hochfrequenz.de/'],
        bearer_methods_supported: ['header'],
      });
    });
  });

  describe('resourceMetadataUrl', () => {
    it('inserts the well-known segment before the resource path (RFC 9728 §3.1)', () => {
      expect(resourceMetadataUrl(config)).toBe(
        'https://ahb-tabellen.stage.hochfrequenz.de/.well-known/oauth-protected-resource/mcp'
      );
    });

    it('handles a resource with no path', () => {
      expect(resourceMetadataUrl({ ...config, resource: 'https://host' })).toBe(
        'https://host/.well-known/oauth-protected-resource'
      );
    });
  });

  describe('wwwAuthenticateHeader', () => {
    it('includes the resource_metadata pointer', () => {
      expect(wwwAuthenticateHeader(config)).toBe(
        'Bearer resource_metadata="https://ahb-tabellen.stage.hochfrequenz.de/.well-known/oauth-protected-resource/mcp"'
      );
    });

    it('appends an error code when given', () => {
      expect(wwwAuthenticateHeader(config, 'invalid_token')).toContain('error="invalid_token"');
    });
  });

  describe('requireBearer (missing/malformed token)', () => {
    let setHeader: jest.Mock;
    let status: jest.Mock;
    let json: jest.Mock;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
      json = jest.fn();
      status = jest.fn().mockReturnValue({ json });
      setHeader = jest.fn();
      res = { setHeader, status } as unknown as Partial<Response>;
      next = jest.fn();
    });

    it('returns 401 with WWW-Authenticate when no Authorization header is present', () => {
      const req = { headers: {} } as unknown as Request;
      requireBearer(config)(req, res as Response, next);

      expect(setHeader).toHaveBeenCalledWith('WWW-Authenticate', wwwAuthenticateHeader(config));
      expect(status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when the Authorization header is not a Bearer token', () => {
      const req = { headers: { authorization: 'Basic abc' } } as unknown as Request;
      requireBearer(config)(req, res as Response, next);

      expect(status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
