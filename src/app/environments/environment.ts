// this environment is used for local development and on the staging server
import { EnvironmentInterface } from './environment.interface';

export const environment: EnvironmentInterface = {
  // set to TRUE if you want the DEFAULT AUTHENTICATION BEHAVIOR of the production environment
  isProduction: false, // during local development (localhost 4000/4200), the user "local@development.com" is authenticated by default
  apiUrl: 'http://localhost:3000',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  entraClientId: '<entra-spa-client-id>', // provisioned by infra (#951); MSAL is stubbed in dev
  entraAuthority: 'https://login.microsoftonline.com/<tenant-guid>',
  entraScopes: ['openid', 'profile', 'email'],
  baseUrl: 'http://localhost:4200',
  warmupUrl: 'https://ahbicht-stage.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};
