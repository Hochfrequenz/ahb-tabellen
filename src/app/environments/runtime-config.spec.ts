import { EnvironmentInterface } from './environment.interface';
import { withRuntimeConfig } from './runtime-config';

const defaults: EnvironmentInterface = {
  isProduction: true,
  apiUrl: 'https://compiled.example',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.compiled.example',
  ebdBaseUrl: 'https://ebd.compiled.example',
  fristenkalenderBaseUrl: 'https://fristenkalender.compiled.example',
  auth0Domain: 'auth.compiled.example',
  auth0ClientId: 'compiled-client-id',
  entraClientId: 'compiled-entra-client-id',
  entraAuthority: 'https://login.microsoftonline.com/compiled',
  entraScopes: ['openid'],
  baseUrl: 'https://compiled.example',
  allowSearchIndexing: true,
  enablePruefiComparison: false,
};

describe('withRuntimeConfig', () => {
  afterEach(() => {
    delete window.__APP_CONFIG__;
  });

  it('keeps the compiled values when the server served no config', () => {
    expect(withRuntimeConfig(defaults)).toEqual(defaults);
  });

  it('overrides only the keys the deployment set', () => {
    window.__APP_CONFIG__ = { apiUrl: 'https://runtime.example', allowSearchIndexing: false };

    const environment = withRuntimeConfig(defaults);

    expect(environment.apiUrl).toBe('https://runtime.example');
    expect(environment.allowSearchIndexing).toBe(false);
    expect(environment.auth0ClientId).toBe('compiled-client-id');
  });

  it('does not let a deployment switch off isProduction, which gates the dummy-user login', () => {
    // `isProduction` is excluded from RuntimeConfig at the type level; this asserts the runtime
    // behaviour too, since the config arrives as untyped JSON from the server.
    window.__APP_CONFIG__ = { isProduction: false } as never;

    expect(withRuntimeConfig(defaults).isProduction).toBe(true);
  });
});
