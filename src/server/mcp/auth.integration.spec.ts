/**
 * @jest-environment node
 *
 * Real token-validation integration test for the MCP bearer guard, following Auth0's
 * resource-server testing guidance: drive the actual `express-oauth2-jwt-bearer` middleware
 * over HTTP with signed tokens and assert accept/reject on issuer dispatch, audience, expiry,
 * and signature.
 *
 * Uses HS256 with a shared secret so no JWKS server is needed — the audience/issuer/expiry
 * validation code path is identical to the RS256 path used in production. Two providers are
 * configured (an Auth0-like and an Entra-like issuer) to exercise dual-issuer dispatch.
 */
import crypto from 'crypto';
import express from 'express';
import type { AddressInfo } from 'net';
import type { Server } from 'http';
import type { RequestHandler } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import { requireBearer, McpAuthConfig } from './auth';

const SECRET = 'test-shared-secret';

const AUTH0_ISSUER = 'https://issuer-a.example.com/';
const AUTH0_AUDIENCE = 'https://host/mcp';
const ENTRA_ISSUER = 'https://issuer-b.example.com/v2.0';
const ENTRA_AUDIENCE = 'api://ahb-mcp';

const config: McpAuthConfig = {
  resource: AUTH0_AUDIENCE,
  providers: [
    { kind: 'auth0', issuer: AUTH0_ISSUER, issuerBaseURL: AUTH0_ISSUER, audience: AUTH0_AUDIENCE },
    { kind: 'entra', issuer: ENTRA_ISSUER, issuerBaseURL: ENTRA_ISSUER, audience: ENTRA_AUDIENCE },
  ],
};

function base64url(input: string): string {
  return Buffer.from(input).toString('base64url');
}

function signHs256(payload: Record<string, unknown>): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(payload));
  const data = `${header}.${body}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

const nowSeconds = (): number => Math.floor(Date.now() / 1000);

const validClaims = (iss: string, aud: string): Record<string, unknown> => ({
  iss,
  aud,
  sub: 'user-1',
  iat: nowSeconds(),
  exp: nowSeconds() + 3600,
});

describe('MCP bearer auth (real middleware, dual issuer, HTTP)', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(done => {
    const validators: Map<string, RequestHandler> = new Map([
      [
        AUTH0_ISSUER,
        auth({
          issuer: AUTH0_ISSUER,
          audience: AUTH0_AUDIENCE,
          secret: SECRET,
          tokenSigningAlg: 'HS256',
        }),
      ],
      [
        ENTRA_ISSUER,
        auth({
          issuer: ENTRA_ISSUER,
          audience: ENTRA_AUDIENCE,
          secret: SECRET,
          tokenSigningAlg: 'HS256',
        }),
      ],
    ]);

    const app = express();
    app.get('/mcp', requireBearer(config, validators), (_req, res) => {
      res.status(200).json({ ok: true });
    });

    server = app.listen(0, () => {
      const { port } = server.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${port}`;
      done();
    });
  });

  afterAll(done => {
    server.close(() => done());
  });

  const call = (token?: string): Promise<Response> =>
    fetch(`${baseUrl}/mcp`, token ? { headers: { authorization: `Bearer ${token}` } } : undefined);

  it('accepts a valid Auth0-issued token', async () => {
    const res = await call(signHs256(validClaims(AUTH0_ISSUER, AUTH0_AUDIENCE)));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it('accepts a valid Entra-issued token', async () => {
    const res = await call(signHs256(validClaims(ENTRA_ISSUER, ENTRA_AUDIENCE)));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it('rejects a request with no token (401 + WWW-Authenticate pointer)', async () => {
    const res = await call();
    expect(res.status).toBe(401);
    expect(res.headers.get('www-authenticate')).toContain(
      '/.well-known/oauth-protected-resource/mcp'
    );
  });

  it('rejects a token whose issuer matches no configured provider', async () => {
    const res = await call(signHs256(validClaims('https://evil.example.com/', AUTH0_AUDIENCE)));
    expect(res.status).toBe(401);
  });

  it('rejects a token routed to a provider but carrying the other provider’s audience', async () => {
    // iss dispatches to Auth0's validator, but aud is Entra's → audience mismatch.
    const res = await call(signHs256(validClaims(AUTH0_ISSUER, ENTRA_AUDIENCE)));
    expect(res.status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const res = await call(
      signHs256({
        iss: AUTH0_ISSUER,
        aud: AUTH0_AUDIENCE,
        sub: 'user-1',
        iat: nowSeconds() - 7200,
        exp: nowSeconds() - 3600,
      })
    );
    expect(res.status).toBe(401);
  });

  it('rejects a token with a tampered signature', async () => {
    const valid = signHs256(validClaims(AUTH0_ISSUER, AUTH0_AUDIENCE));
    const tampered = valid.slice(0, -3) + 'xxx';
    const res = await call(tampered);
    expect(res.status).toBe(401);
  });
});
