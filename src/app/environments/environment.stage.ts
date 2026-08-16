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
  // the Dolmetscher is live in production but has no *.stage host (verified: the stage
  // hostname does not resolve), so stage points at production too -- unlike makoProzesseBaseUrl
  // above, which stands in for a host that does not exist anywhere yet
  dolmetscherBaseUrl: 'https://dolmetscher.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  baseUrl: 'https://ahb-tabellen.stage.hochfrequenz.de',
  warmupUrl: 'https://ahbicht-stage.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
