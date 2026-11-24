import { resolveAuthIsDevelopment, resolveEntraIsConfigured } from './msal.tokens';

describe('resolveAuthIsDevelopment', () => {
  it('is false in production (real providers)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: true,
        hostname: 'ahb-tabellen.hochfrequenz.de',
        realauthOverride: false,
      })
    ).toBe(false);
  });

  it('is true on localhost by default (dev stub)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: false,
        hostname: 'localhost',
        realauthOverride: false,
      })
    ).toBe(true);
  });

  it('is false on localhost when the realauth override is set (exercise the real flow locally)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: false,
        hostname: 'localhost',
        realauthOverride: true,
      })
    ).toBe(false);
  });

  it('stays false in production even if the override is set', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: true,
        hostname: 'ahb-tabellen.hochfrequenz.de',
        realauthOverride: true,
      })
    ).toBe(false);
  });
});

describe('resolveEntraIsConfigured', () => {
  const REAL = {
    entraClientId: 'e8418ff3-641e-4ef6-b407-30e36b867b9c',
    entraAuthority: 'https://login.microsoftonline.com/fb2b0361-fa12-48a5-bade-533bf89760d9',
  };
  const PLACEHOLDER = '00000000-0000-0000-0000-000000000000';

  it('is configured when both the client id and the authority name a real registration', () => {
    expect(resolveEntraIsConfigured(REAL)).toBe(true);
  });

  it('is unconfigured for the placeholder client id environment.prod.ts ships', () => {
    expect(resolveEntraIsConfigured({ ...REAL, entraClientId: PLACEHOLDER })).toBe(false);
  });

  it('is unconfigured when only the tenant is a placeholder, with a real client id', () => {
    // The authority embeds the tenant, so half a configuration is still no configuration — and
    // this is exactly the shape environment.prod.ts has.
    expect(
      resolveEntraIsConfigured({
        ...REAL,
        entraAuthority: `https://login.microsoftonline.com/${PLACEHOLDER}`,
      })
    ).toBe(false);
  });

  it.each([
    ['client id', { ...REAL, entraClientId: '' }],
    ['authority', { ...REAL, entraAuthority: '' }],
  ])('treats an empty %s as unconfigured, matching readString in app-config.ts', (_label, env) => {
    expect(resolveEntraIsConfigured(env)).toBe(false);
  });

  it('treats whitespace as empty rather than as a value', () => {
    expect(resolveEntraIsConfigured({ ...REAL, entraClientId: '   ' })).toBe(false);
  });
});
