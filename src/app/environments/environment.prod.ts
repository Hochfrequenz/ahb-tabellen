import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: 'https://ahb-tabellen.hochfrequenz.de',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.hochfrequenz.de',
  // this is the *intended* host: MaKo-Prozesse is not deployed under it yet
  // (see Hochfrequenz/mako_prozesse#65), so the pill will not resolve to the app
  // until the custom domain is live
  makoProzesseBaseUrl: 'https://mako-prozesse.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'VSkXGqlTD7Rf5Q4n9a0h00rInEyL2ZQj',
  baseUrl: 'https://ahb-tabellen.hochfrequenz.de',
  warmupUrl: 'https://ahbicht.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: true,
  enablePruefiComparison: false,
};
