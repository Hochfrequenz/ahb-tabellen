import { RequestHandler } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

/** MCP HTTP endpoint path. */
export const MCP_PATH = '/mcp';

/**
 * Auth0 resource-server configuration for the MCP endpoint. When absent (env not set),
 * the MCP endpoint runs unauthenticated (local dev / spike).
 */
export interface McpAuthConfig {
  /** Auth0 issuer base URL, e.g. `https://auth.hochfrequenz.de/`. */
  issuerBaseURL: string;
  /** Expected token audience — the Auth0 API identifier (the canonical MCP URI). */
  audience: string;
  /** RFC 9728 `resource` value (canonical MCP URI). Defaults to `audience`. */
  resource: string;
}

/**
 * Read MCP auth config from the environment.
 *
 * - Both `MCP_AUTH0_ISSUER_BASE_URL` and `MCP_AUTH0_AUDIENCE` set → returns config.
 * - Neither set → returns `undefined` (auth intentionally disabled, e.g. local dev).
 * - Exactly one set → throws: a partial config almost certainly means a misconfigured
 *   deployment, and silently exposing the endpoint unauthenticated would be worse.
 */
export function loadMcpAuthConfig(env: NodeJS.ProcessEnv = process.env): McpAuthConfig | undefined {
  const issuerBaseURL = env['MCP_AUTH0_ISSUER_BASE_URL'];
  const audience = env['MCP_AUTH0_AUDIENCE'];
  if (!issuerBaseURL && !audience) {
    return undefined;
  }
  if (!issuerBaseURL || !audience) {
    throw new Error(
      'MCP auth is partially configured: set BOTH MCP_AUTH0_ISSUER_BASE_URL and ' +
        'MCP_AUTH0_AUDIENCE (or neither, to run /mcp unauthenticated).'
    );
  }
  return { issuerBaseURL, audience, resource: env['MCP_RESOURCE'] ?? audience };
}

/** RFC 9728 Protected Resource Metadata document. */
export interface ProtectedResourceMetadata {
  resource: string;
  authorization_servers: string[];
  bearer_methods_supported: string[];
}

export function protectedResourceMetadata(config: McpAuthConfig): ProtectedResourceMetadata {
  return {
    resource: config.resource,
    authorization_servers: [config.issuerBaseURL],
    bearer_methods_supported: ['header'],
  };
}

/**
 * RFC 9728 §3.1 metadata URL: the well-known segment is inserted between the origin and
 * the resource's path, e.g. `https://host/mcp` → `https://host/.well-known/oauth-protected-resource/mcp`.
 */
export function resourceMetadataUrl(config: McpAuthConfig): string {
  const url = new URL(config.resource);
  const path = url.pathname === '/' ? '' : url.pathname;
  return `${url.origin}/.well-known/oauth-protected-resource${path}`;
}

/** RFC 9728 §5.1 `WWW-Authenticate` value pointing clients at the resource metadata. */
export function wwwAuthenticateHeader(config: McpAuthConfig, error?: string): string {
  const parts = [`Bearer resource_metadata="${resourceMetadataUrl(config)}"`];
  if (error) {
    parts.push(`error="${error}"`);
  }
  return parts.join(', ');
}

/**
 * Bearer-token guard for the MCP endpoint. Missing/malformed `Authorization` headers get
 * an immediate 401 with the RFC 9728 `WWW-Authenticate` pointer; present tokens are
 * validated by Auth0's `express-oauth2-jwt-bearer` (signature via JWKS, `iss`, `aud`,
 * `exp`), which yields 401 on failure — also with the metadata pointer.
 *
 * @param validate the token-validation middleware. Defaults to Auth0's `auth()` built
 *   from `config`; injectable so tests can drive real validation with a local key.
 */
export function requireBearer(
  config: McpAuthConfig,
  validate: RequestHandler = auth({
    issuerBaseURL: config.issuerBaseURL,
    audience: config.audience,
  })
): RequestHandler {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !/^Bearer\s+\S/i.test(header)) {
      res.setHeader('WWW-Authenticate', wwwAuthenticateHeader(config));
      res.status(401).json({ error: 'unauthorized', message: 'Missing bearer token' });
      return;
    }
    validate(req, res, (err?: unknown) => {
      if (err) {
        res.setHeader('WWW-Authenticate', wwwAuthenticateHeader(config, 'invalid_token'));
        res.status(401).json({ error: 'invalid_token', message: 'Invalid or expired token' });
        return;
      }
      next();
    });
  };
}
