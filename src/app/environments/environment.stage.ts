import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: 'https://ahb-tabellen.stage.hochfrequenz.de',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  // no *.stage host here because MaKo-Prozesse is not deployed under this host yet at all
  // (see Hochfrequenz/mako_prozesse#65); the intended production URL stands in until the
  // custom domain is live
  makoProzesseBaseUrl: 'https://mako-prozesse.hochfrequenz.de',
  // dolmetscher.stage.hochfrequenz.de DOES exist -- it resolves to the Dolmetscher's own
  // Azure Static Web App -- but it does not serve: as of 2026-08 its TLS certificate does
  // not cover that hostname, so a browser gets a cert error rather than the app. Stage
  // therefore points at production, and this is worth revisiting once the cert is fixed,
  // unlike makoProzesseBaseUrl above, which stands in for a host that exists nowhere yet.
  dolmetscherBaseUrl: 'https://dolmetscher.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  baseUrl: 'https://ahb-tabellen.stage.hochfrequenz.de',
  warmupUrl: 'https://ahbicht-stage.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
