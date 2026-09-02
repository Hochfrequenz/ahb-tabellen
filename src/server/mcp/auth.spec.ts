import { Request, Response } from 'express';

// The real express-oauth2-jwt-bearer pulls in jose, whose ESM "browser" build the jsdom
// test environment cannot parse. `buildValidators` (used by requireBearer's default) calls
// auth() per provider, so mock it away — we never exercise real JWT validation here.
jest.mock('express-oauth2-jwt-bearer', () => ({
  auth: () => (_req: unknown, _res: unknown, next: () => void) => next(),
}));

import {
  loadMcpAuthConfig,
  protectedResourceMetadata,
  resourceMetadataUrl,
  wwwAuthenticateHeader,
  requireBearer,
  unverifiedIssuer,
  McpAuthConfig,
} from './auth';

const AUTH0_ISSUER = 'https://auth.hochfrequenz.de/';
const ENTRA_ISSUER = 'https://login.microsoftonline.com/tenant-guid/v2.0';

const auth0Config: McpAuthConfig = {
  resource: 'https://ahb-tabellen.stage.hochfrequenz.de/mcp',
  providers: [
    {
      kind: 'auth0',
      issuer: AUTH0_ISSUER,
      issuerBaseURL: AUTH0_ISSUER,
      audience: 'https://ahb-tabellen.stage.hochfrequenz.de/mcp',
    },
  ],
};

const dualConfig: McpAuthConfig = {
  resource: 'https://ahb-tabellen.stage.hochfrequenz.de/mcp',
  providers: [
    ...auth0Config.providers,
    { kind: 'entra', issuer: ENTRA_ISSUER, issuerBaseURL: ENTRA_ISSUER, audience: 'api://ahb-mcp' },
  ],
};

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

/** Build a syntactically valid (unsigned) JWT with the given `iss` for dispatch tests. */
function tokenWithIssuer(iss: string): string {
  const header = base64url(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iss, sub: 'user-1' }));
  return `${header}.${payload}.`;
}

describe('mcp/auth', () => {
  describe('loadMcpAuthConfig', () => {
    it('returns undefined when no auth env vars are set (auth intentionally disabled)', () => {
      expect(loadMcpAuthConfig({})).toBeUndefined();
    });

    it('throws on partial Auth0 configuration (exactly one var set) instead of failing open', () => {
      expect(() => loadMcpAuthConfig({ MCP_AUTH0_ISSUER_BASE_URL: 'x' })).toThrow(
        /partially configured/
      );
      expect(() => loadMcpAuthConfig({ MCP_AUTH0_AUDIENCE: 'x' })).toThrow(/partially configured/);
    });

    it('throws on partial Entra configuration (tenant/issuer without audience or vice versa)', () => {
      expect(() => loadMcpAuthConfig({ MCP_ENTRA_TENANT_ID: 'tenant-guid' })).toThrow(
        /Entra.*partially configured/
      );
      expect(() => loadMcpAuthConfig({ MCP_ENTRA_ISSUER: ENTRA_ISSUER })).toThrow(
        /Entra.*partially configured/
      );
      expect(() => loadMcpAuthConfig({ MCP_ENTRA_AUDIENCE: 'api://x' })).toThrow(
        /Entra.*partially configured/
      );
    });

    it('builds an Auth0-only config and defaults resource to the audience', () => {
      expect(
        loadMcpAuthConfig({
          MCP_AUTH0_ISSUER_BASE_URL: AUTH0_ISSUER,
          MCP_AUTH0_AUDIENCE: 'https://host/mcp',
        })
      ).toEqual({
        resource: 'https://host/mcp',
        providers: [
          {
            kind: 'auth0',
            issuer: AUTH0_ISSUER,
            issuerBaseURL: AUTH0_ISSUER,
            audience: 'https://host/mcp',
          },
        ],
      });
    });

    it('builds an Entra-only config, deriving the v2.0 issuer from the tenant id', () => {
      expect(
        loadMcpAuthConfig({
          MCP_ENTRA_TENANT_ID: 'tenant-guid',
          MCP_ENTRA_AUDIENCE: 'api://ahb-mcp',
          MCP_RESOURCE: 'https://host/mcp',
        })
      ).toEqual({
        resource: 'https://host/mcp',
        providers: [
          {
            kind: 'entra',
            issuer: ENTRA_ISSUER,
            issuerBaseURL: ENTRA_ISSUER,
            audience: 'api://ahb-mcp',
          },
        ],
      });
    });

    it('throws for an Entra-only config without MCP_RESOURCE (api:// audience is not a fetchable resource URL)', () => {
      expect(() =>
        loadMcpAuthConfig({
          MCP_ENTRA_TENANT_ID: 'tenant-guid',
          MCP_ENTRA_AUDIENCE: 'api://ahb-mcp',
        })
      ).toThrow(/MCP_RESOURCE/);
    });

    it('defaults resource to the first http(s) provider audience (Auth0) in a dual config', () => {
      // Even without MCP_RESOURCE, the RFC 9728 resource must be a fetchable https URL,
      // not the Entra api:// audience.
      expect(
        loadMcpAuthConfig({
          MCP_AUTH0_ISSUER_BASE_URL: AUTH0_ISSUER,
          MCP_AUTH0_AUDIENCE: 'https://host/mcp',
          MCP_ENTRA_TENANT_ID: 'tenant-guid',
          MCP_ENTRA_AUDIENCE: 'api://ahb-mcp',
        })?.resource
      ).toBe('https://host/mcp');
    });

    it('honors an explicit MCP_ENTRA_ISSUER override instead of deriving from the tenant', () => {
      const custom = 'https://login.microsoftonline.com/other/v2.0';
      const cfg = loadMcpAuthConfig({
        MCP_ENTRA_TENANT_ID: 'tenant-guid',
        MCP_ENTRA_ISSUER: custom,
        MCP_ENTRA_AUDIENCE: 'api://ahb-mcp',
        MCP_RESOURCE: 'https://host/mcp',
      });
      expect(cfg?.providers[0].issuer).toBe(custom);
      expect(cfg?.providers[0].issuerBaseURL).toBe(custom);
    });

    it('builds a dual-issuer config with Auth0 first, Entra second', () => {
      const cfg = loadMcpAuthConfig({
        MCP_AUTH0_ISSUER_BASE_URL: AUTH0_ISSUER,
        MCP_AUTH0_AUDIENCE: 'https://host/mcp',
        MCP_ENTRA_TENANT_ID: 'tenant-guid',
        MCP_ENTRA_AUDIENCE: 'api://ahb-mcp',
      });
      expect(cfg?.providers.map(p => p.kind)).toEqual(['auth0', 'entra']);
      expect(cfg?.resource).toBe('https://host/mcp');
    });

    it('honors an explicit MCP_RESOURCE override', () => {
      expect(
        loadMcpAuthConfig({
          MCP_AUTH0_ISSUER_BASE_URL: AUTH0_ISSUER,
          MCP_AUTH0_AUDIENCE: 'api-id',
          MCP_RESOURCE: 'https://host/mcp',
        })?.resource
      ).toBe('https://host/mcp');
    });
  });

  describe('protectedResourceMetadata', () => {
    it('lists the single authorization server for an Auth0-only config', () => {
      expect(protectedResourceMetadata(auth0Config)).toEqual({
        resource: auth0Config.resource,
        authorization_servers: [AUTH0_ISSUER],
        bearer_methods_supported: ['header'],
      });
    });

    it('lists both authorization servers (Auth0 first) for a dual config', () => {
      expect(protectedResourceMetadata(dualConfig).authorization_servers).toEqual([
        AUTH0_ISSUER,
        ENTRA_ISSUER,
      ]);
    });
  });

  describe('resourceMetadataUrl', () => {
    it('inserts the well-known segment before the resource path (RFC 9728 §3.1)', () => {
      expect(resourceMetadataUrl(auth0Config)).toBe(
        'https://ahb-tabellen.stage.hochfrequenz.de/.well-known/oauth-protected-resource/mcp'
      );
    });

    it('handles a resource with no path', () => {
      expect(resourceMetadataUrl({ ...auth0Config, resource: 'https://host' })).toBe(
        'https://host/.well-known/oauth-protected-resource'
      );
    });
  });

  describe('wwwAuthenticateHeader', () => {
    it('includes the resource_metadata pointer', () => {
      expect(wwwAuthenticateHeader(auth0Config)).toBe(
        'Bearer resource_metadata="https://ahb-tabellen.stage.hochfrequenz.de/.well-known/oauth-protected-resource/mcp"'
      );
    });

    it('appends an error code when given', () => {
      expect(wwwAuthenticateHeader(auth0Config, 'invalid_token')).toContain(
        'error="invalid_token"'
      );
    });
  });

  describe('unverifiedIssuer', () => {
    it('extracts the iss claim from a well-formed JWT payload', () => {
      expect(unverifiedIssuer(tokenWithIssuer(ENTRA_ISSUER))).toBe(ENTRA_ISSUER);
    });

    it('returns undefined for a string with too few segments', () => {
      expect(unverifiedIssuer('not-a-jwt')).toBeUndefined();
    });

    it('returns undefined when the payload is not valid JSON', () => {
      expect(unverifiedIssuer('aaa.!!!.bbb')).toBeUndefined();
    });

    it('returns undefined when the payload has no iss claim', () => {
      const token = `x.${base64url(JSON.stringify({ sub: 'user-1' }))}.y`;
      expect(unverifiedIssuer(token)).toBeUndefined();
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
      requireBearer(auth0Config)(req, res as Response, next);

      expect(setHeader).toHaveBeenCalledWith(
        'WWW-Authenticate',
        wwwAuthenticateHeader(auth0Config)
      );
      expect(status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 when the Authorization header is not a Bearer token', () => {
      const req = { headers: { authorization: 'Basic abc' } } as unknown as Request;
      requireBearer(auth0Config)(req, res as Response, next);

      expect(status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('requireBearer (issuer dispatch)', () => {
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

    function validatorsWith(
      auth0Validate: jest.Mock,
      entraValidate: jest.Mock
    ): Map<string, (req: Request, res: Response, next: (err?: unknown) => void) => void> {
      return new Map([
        [AUTH0_ISSUER, auth0Validate as never],
        [ENTRA_ISSUER, entraValidate as never],
      ]);
    }

    it('routes an Auth0-issued token to the Auth0 validator', () => {
      const auth0Validate = jest.fn((_req, _res, n: () => void) => n());
      const entraValidate = jest.fn((_req, _res, n: () => void) => n());
      const req = {
        headers: { authorization: `Bearer ${tokenWithIssuer(AUTH0_ISSUER)}` },
      } as unknown as Request;

      requireBearer(dualConfig, validatorsWith(auth0Validate, entraValidate))(
        req,
        res as Response,
        next
      );

      expect(auth0Validate).toHaveBeenCalledTimes(1);
      expect(entraValidate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('routes an Entra-issued token to the Entra validator', () => {
      const auth0Validate = jest.fn((_req, _res, n: () => void) => n());
      const entraValidate = jest.fn((_req, _res, n: () => void) => n());
      const req = {
        headers: { authorization: `Bearer ${tokenWithIssuer(ENTRA_ISSUER)}` },
      } as unknown as Request;

      requireBearer(dualConfig, validatorsWith(auth0Validate, entraValidate))(
        req,
        res as Response,
        next
      );

      expect(entraValidate).toHaveBeenCalledTimes(1);
      expect(auth0Validate).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('returns 401 invalid_token for a token whose issuer matches no provider', () => {
      const auth0Validate = jest.fn((_req, _res, n: () => void) => n());
      const entraValidate = jest.fn((_req, _res, n: () => void) => n());
      const req = {
        headers: { authorization: `Bearer ${tokenWithIssuer('https://evil.example.com/')}` },
      } as unknown as Request;

      requireBearer(dualConfig, validatorsWith(auth0Validate, entraValidate))(
        req,
        res as Response,
        next
      );

      expect(setHeader).toHaveBeenCalledWith(
        'WWW-Authenticate',
        wwwAuthenticateHeader(dualConfig, 'invalid_token')
      );
      expect(status).toHaveBeenCalledWith(401);
      expect(auth0Validate).not.toHaveBeenCalled();
      expect(entraValidate).not.toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('returns 401 invalid_token when the matched validator rejects the token', () => {
      const auth0Validate = jest.fn((_req, _res, n: (err?: unknown) => void) =>
        n(new Error('bad'))
      );
      const entraValidate = jest.fn((_req, _res, n: () => void) => n());
      const req = {
        headers: { authorization: `Bearer ${tokenWithIssuer(AUTH0_ISSUER)}` },
      } as unknown as Request;

      requireBearer(dualConfig, validatorsWith(auth0Validate, entraValidate))(
        req,
        res as Response,
        next
      );

      expect(status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
