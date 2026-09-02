import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: 'http://localhost:4000',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  // MaKo-Prozesse is not deployed under this host yet, in any environment
  // (see Hochfrequenz/mako_prozesse#65) - every stack points at the intended
  // production URL until the custom domain is live
  makoProzesseBaseUrl: 'https://mako-prozesse.hochfrequenz.de',
  dolmetscherBaseUrl: 'https://dolmetscher.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  baseUrl: 'http://localhost:4200',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
