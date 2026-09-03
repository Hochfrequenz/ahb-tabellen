import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: 'https://ahb-tabellen.stage.hochfrequenz.de',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  entraClientId: 'e8418ff3-641e-4ef6-b407-30e36b867b9c', // stage SPA app registration (Pulumi output)
  entraAuthority: 'https://login.microsoftonline.com/fb2b0361-fa12-48a5-bade-533bf89760d9',
  entraScopes: ['openid', 'profile', 'email'],
  baseUrl: 'https://ahb-tabellen.stage.hochfrequenz.de',
  warmupUrl: 'https://ahbicht-stage.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
