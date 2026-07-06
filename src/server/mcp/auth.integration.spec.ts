/**
 * @jest-environment node
 *
 * Real token-validation integration test for the MCP bearer guard, following Auth0's
 * resource-server testing guidance: drive the actual `express-oauth2-jwt-bearer` middleware
 * over HTTP with signed tokens and assert accept/reject on audience, expiry, and signature.
 *
 * Uses HS256 with a shared secret so no JWKS server is needed — the audience/issuer/expiry
 * validation code path is identical to the RS256 path used in production.
 */
import crypto from 'crypto';
import express from 'express';
import type { AddressInfo } from 'net';
import type { Server } from 'http';
import { auth } from 'express-oauth2-jwt-bearer';
import { requireBearer, McpAuthConfig } from './auth';

const SECRET = 'test-shared-secret';
const ISSUER = 'https://issuer.example.com/';
const AUDIENCE = 'https://host/mcp';

const config: McpAuthConfig = {
  issuerBaseURL: ISSUER,
  audience: AUDIENCE,
  resource: AUDIENCE,
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

describe('MCP bearer auth (real middleware, HTTP)', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(done => {
    const validate = auth({
      issuer: ISSUER,
      audience: AUDIENCE,
      secret: SECRET,
      tokenSigningAlg: 'HS256',
    });

    const app = express();
    app.get('/mcp', requireBearer(config, validate), (_req, res) => {
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

  it('accepts a valid token', async () => {
    const token = signHs256({
      iss: ISSUER,
      aud: AUDIENCE,
      sub: 'user-1',
      iat: nowSeconds(),
      exp: nowSeconds() + 3600,
    });
    const res = await call(token);
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

  it('rejects a token issued for a different audience', async () => {
    const token = signHs256({
      iss: ISSUER,
      aud: 'https://some-other-api/',
      sub: 'user-1',
      iat: nowSeconds(),
      exp: nowSeconds() + 3600,
    });
    const res = await call(token);
    expect(res.status).toBe(401);
  });

  it('rejects an expired token', async () => {
    const token = signHs256({
      iss: ISSUER,
      aud: AUDIENCE,
      sub: 'user-1',
      iat: nowSeconds() - 7200,
      exp: nowSeconds() - 3600,
    });
    const res = await call(token);
    expect(res.status).toBe(401);
  });

  it('rejects a token with a tampered signature', async () => {
    const valid = signHs256({
      iss: ISSUER,
      aud: AUDIENCE,
      sub: 'user-1',
      iat: nowSeconds(),
      exp: nowSeconds() + 3600,
    });
    const tampered = valid.slice(0, -3) + 'xxx';
    const res = await call(tampered);
    expect(res.status).toBe(401);
  });
});
