import { buildRuntimeConfig, renderConfigScript } from './app-config';

describe('buildRuntimeConfig', () => {
  it('returns an empty config when nothing is set, so the bundle keeps its compiled values', () => {
    expect(buildRuntimeConfig({})).toEqual({});
  });

  it('ignores empty variables, which compose emits for an unfilled .env entry', () => {
    expect(buildRuntimeConfig({ APP_API_URL: '', APP_AUTH0_DOMAIN: '' })).toEqual({});
  });

  it('maps every APP_* variable onto its environment key', () => {
    const config = buildRuntimeConfig({
      APP_API_URL: 'https://ahb-tabellen.hochfrequenz.app',
      APP_BASE_URL: 'https://ahb-tabellen.hochfrequenz.app',
      APP_BEDINGUNGSBAUM_BASE_URL: 'https://bedingungsbaum.hochfrequenz.app',
      APP_EBD_BASE_URL: 'https://ebd.hochfrequenz.app',
      APP_FRISTENKALENDER_BASE_URL: 'https://fristenkalender.hochfrequenz.app',
      APP_AUTH0_DOMAIN: 'auth.hochfrequenz.de',
      APP_AUTH0_CLIENT_ID: 'client-id',
      APP_ENTRA_CLIENT_ID: 'entra-client-id',
      APP_ENTRA_AUTHORITY: 'https://login.microsoftonline.com/tenant',
      APP_ENTRA_SCOPES: 'openid, profile ,email',
      APP_WARMUP_URL: 'https://ahbicht.example/warmup',
      APP_ALLOW_SEARCH_INDEXING: 'false',
      APP_ENABLE_PRUEFI_COMPARISON: 'true',
    });

    expect(config).toEqual({
      apiUrl: 'https://ahb-tabellen.hochfrequenz.app',
      baseUrl: 'https://ahb-tabellen.hochfrequenz.app',
      bedingungsbaumBaseUrl: 'https://bedingungsbaum.hochfrequenz.app',
      ebdBaseUrl: 'https://ebd.hochfrequenz.app',
      fristenkalenderBaseUrl: 'https://fristenkalender.hochfrequenz.app',
      auth0Domain: 'auth.hochfrequenz.de',
      auth0ClientId: 'client-id',
      entraClientId: 'entra-client-id',
      entraAuthority: 'https://login.microsoftonline.com/tenant',
      entraScopes: ['openid', 'profile', 'email'],
      warmupUrl: 'https://ahbicht.example/warmup',
      allowSearchIndexing: false,
      enablePruefiComparison: true,
    });
  });

  it('rejects a boolean that is neither "true" nor "false" instead of silently reading it as false', () => {
    expect(() => buildRuntimeConfig({ APP_ALLOW_SEARCH_INDEXING: 'yes' })).toThrow(
      /APP_ALLOW_SEARCH_INDEXING must be "true" or "false"/
    );
  });

  it('never overrides isProduction, which gates the dummy-user login', () => {
    const config = buildRuntimeConfig({
      APP_IS_PRODUCTION: 'false',
      IS_PRODUCTION: 'false',
    });
    expect(config).not.toHaveProperty('isProduction');
  });
});

describe('renderConfigScript', () => {
  it('assigns the config to the global the bundle reads', () => {
    expect(renderConfigScript({ auth0ClientId: 'abc' })).toBe(
      'window.__APP_CONFIG__ = {"auth0ClientId":"abc"};\n'
    );
  });

  it('escapes "<" so the script stays safe if it is ever inlined into HTML', () => {
    expect(renderConfigScript({ apiUrl: '</script><img src=x>' })).not.toContain('</script>');
  });
});
