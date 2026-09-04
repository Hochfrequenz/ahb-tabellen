import { RequestHandler } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';

/** MCP HTTP endpoint path. */
export const MCP_PATH = '/mcp';

/** Identity providers whose access tokens the MCP endpoint accepts. */
export type McpProviderKind = 'auth0' | 'entra';

/**
 * One OAuth 2.0 authorization server the MCP resource server trusts. Tokens are dispatched
 * to the matching provider by their (unverified) `iss` claim, then fully validated by that
 * provider's `express-oauth2-jwt-bearer` middleware (signature via JWKS, `iss`, `aud`, `exp`).
 */
export interface McpAuthProvider {
  kind: McpProviderKind;
  /** Exact `iss` claim value used to dispatch a token to this provider. */
  issuer: string;
  /** Value handed to `express-oauth2-jwt-bearer` (`issuerBaseURL`); usually === `issuer`. */
  issuerBaseURL: string;
  /** Expected token audience (the API identifier for this provider). */
  audience: string;
}

/**
 * Auth config for the MCP endpoint. When absent (no provider env set), the MCP endpoint runs
 * unauthenticated (local dev / spike). One or more providers may be configured; a token is
 * accepted if it is valid for any one of them.
 */
export interface McpAuthConfig {
  /** RFC 9728 `resource` value (canonical MCP URI). Defaults to the first provider's audience. */
  resource: string;
  /** Trusted authorization servers, in advertisement order (Auth0 first for back-compat). */
  providers: McpAuthProvider[];
}

/**
 * Read MCP auth config from the environment. Providers are independent and may be combined:
 *
 * - Auth0: `MCP_AUTH0_ISSUER_BASE_URL` + `MCP_AUTH0_AUDIENCE`.
 * - Entra: `MCP_ENTRA_TENANT_ID` (→ `https://login.microsoftonline.com/{tenant}/v2.0`) or an
 *   explicit `MCP_ENTRA_ISSUER` override, plus `MCP_ENTRA_AUDIENCE`.
 *
 * For each provider, setting exactly one of its vars throws: a partial config almost certainly
 * means a misconfigured deployment, and silently exposing the endpoint would be worse. When no
 * provider is configured, returns `undefined` (auth intentionally disabled).
 */
export function loadMcpAuthConfig(env: NodeJS.ProcessEnv = process.env): McpAuthConfig | undefined {
  const providers: McpAuthProvider[] = [];

  // --- Auth0 ---
  const auth0Issuer = env['MCP_AUTH0_ISSUER_BASE_URL'];
  const auth0Audience = env['MCP_AUTH0_AUDIENCE'];
  if (auth0Issuer || auth0Audience) {
    if (!auth0Issuer || !auth0Audience) {
      throw new Error(
        'MCP Auth0 auth is partially configured: set BOTH MCP_AUTH0_ISSUER_BASE_URL and ' +
          'MCP_AUTH0_AUDIENCE (or neither).'
      );
    }
    providers.push({
      kind: 'auth0',
      issuer: auth0Issuer,
      issuerBaseURL: auth0Issuer,
      audience: auth0Audience,
    });
  }

  // --- Microsoft Entra ID ---
  const entraTenant = env['MCP_ENTRA_TENANT_ID'];
  const entraAudience = env['MCP_ENTRA_AUDIENCE'];
  const entraIssuer =
    env['MCP_ENTRA_ISSUER'] ??
    (entraTenant ? `https://login.microsoftonline.com/${entraTenant}/v2.0` : undefined);
  if (entraIssuer || entraAudience || entraTenant) {
    if (!entraIssuer || !entraAudience) {
      throw new Error(
        'MCP Entra auth is partially configured: set MCP_ENTRA_TENANT_ID (or MCP_ENTRA_ISSUER) ' +
          'AND MCP_ENTRA_AUDIENCE (or none).'
      );
    }
    providers.push({
      kind: 'entra',
      issuer: entraIssuer,
      issuerBaseURL: entraIssuer,
      audience: entraAudience,
    });
  }

  if (providers.length === 0) {
    return undefined;
  }

  // The RFC 9728 `resource` must be the endpoint's canonical http(s) URL (it drives the
  // `.well-known/oauth-protected-resource` and `WWW-Authenticate` pointers). An Auth0 audience
  // already is that URL, but an Entra audience is an `api://…` Application ID URI, which is not
  // fetchable — so default to the first provider whose audience is an http(s) URL, and require
  // an explicit MCP_RESOURCE when none is (e.g. an Entra-only deployment).
  const resource =
    env['MCP_RESOURCE'] ?? providers.find(p => /^https?:\/\//i.test(p.audience))?.audience;
  if (!resource) {
    throw new Error(
      'MCP_RESOURCE must be set to the canonical https URL of the MCP endpoint when no ' +
        'configured provider audience is an http(s) URL (e.g. an Entra-only deployment whose ' +
        'audience is an api:// Application ID URI).'
    );
  }

  return { resource, providers };
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
    authorization_servers: config.providers.map(p => p.issuerBaseURL),
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
 * Decode — WITHOUT verifying — the `iss` claim of a JWT so the guard can pick the matching
 * provider's validator. The chosen validator still performs full signature/`aud`/`exp`
 * verification, so trusting this value for routing only is safe. Returns `undefined` when the
 * token is not a well-formed JWT or carries no string `iss`.
 */
export function unverifiedIssuer(token: string): string | undefined {
  const parts = token.split('.');
  if (parts.length < 2) {
    return undefined;
  }
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return typeof payload?.iss === 'string' ? payload.iss : undefined;
  } catch {
    return undefined;
  }
}

/** Build one `express-oauth2-jwt-bearer` validator per provider, keyed by exact `iss`. */
export function buildValidators(config: McpAuthConfig): Map<string, RequestHandler> {
  return new Map(
    config.providers.map(p => [
      p.issuer,
      auth({ issuerBaseURL: p.issuerBaseURL, audience: p.audience }),
    ])
  );
}

/**
 * TEMP diagnostic (remove after debugging the Copilot/Entra 401): decode a JWT's key claims
 * WITHOUT verifying, purely to log which `aud`/`iss` a rejected token actually carries.
 */
function unverifiedClaims(token: string): Record<string, unknown> {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1] ?? '', 'base64url').toString('utf8')
    ) as Record<string, unknown>;
    return {
      aud: payload.aud,
      iss: payload.iss,
      appid: payload.appid,
      azp: payload.azp,
      tid: payload.tid,
      scp: payload.scp,
    };
  } catch {
    return { decodeError: true };
  }
}

/**
 * Bearer-token guard for the MCP endpoint. Missing/malformed `Authorization` headers get an
 * immediate 401 with the RFC 9728 `WWW-Authenticate` pointer. Present tokens are dispatched by
 * their unverified `iss` to the matching provider's validator (signature via JWKS, `iss`,
 * `aud`, `exp`); an unknown issuer or a validation error yields 401 `invalid_token` — also with
 * the metadata pointer.
 *
 * @param validators issuer → validation middleware. Defaults to one Auth0/Entra `auth()` per
 *   configured provider; injectable so tests can drive real validation with local keys.
 */
export function requireBearer(
  config: McpAuthConfig,
  validators: Map<string, RequestHandler> = buildValidators(config)
): RequestHandler {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !/^Bearer\s+\S/i.test(header)) {
      console.warn('[MCP-AUTH-DEBUG] 401 missing/malformed Authorization header', {
        hasHeader: Boolean(header),
      });
      res.setHeader('WWW-Authenticate', wwwAuthenticateHeader(config));
      res.status(401).json({ error: 'unauthorized', message: 'Missing bearer token' });
      return;
    }
    const token = header.replace(/^Bearer\s+/i, '').trim();
    const validate = validators.get(unverifiedIssuer(token) ?? '');
    if (!validate) {
      console.warn('[MCP-AUTH-DEBUG] 401 no validator matched token issuer', {
        unverified: unverifiedClaims(token),
        knownIssuers: [...validators.keys()],
      });
      res.setHeader('WWW-Authenticate', wwwAuthenticateHeader(config, 'invalid_token'));
      res.status(401).json({ error: 'invalid_token', message: 'Invalid or expired token' });
      return;
    }
    validate(req, res, (err?: unknown) => {
      if (err) {
        console.warn('[MCP-AUTH-DEBUG] 401 token failed validation', {
          error: err instanceof Error ? err.message : String(err),
          unverified: unverifiedClaims(token),
          expectedAudiences: config.providers.map(p => p.audience),
        });
        res.setHeader('WWW-Authenticate', wwwAuthenticateHeader(config, 'invalid_token'));
        res.status(401).json({ error: 'invalid_token', message: 'Invalid or expired token' });
        return;
      }
      next();
    });
  };
}
