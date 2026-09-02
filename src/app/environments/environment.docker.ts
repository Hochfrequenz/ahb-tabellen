import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: 'http://localhost:4000',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  entraClientId: '<entra-spa-client-id>', // provisioned by infra (#951)
  entraAuthority: 'https://login.microsoftonline.com/<tenant-guid>',
  entraScopes: ['openid', 'profile', 'email'],
  baseUrl: 'http://localhost:4200',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
