// this environment is used for local development (`ng serve`) and by the unit tests
import { EnvironmentInterface } from './environment.interface';
import { withRuntimeConfig } from './runtime-config';

/**
 * Local development defaults. `ng serve` has no Express server in front of it, so `/config.js` is
 * absent and these values apply unchanged — which is exactly the intent: a developer should not
 * need a container to run the app.
 *
 * Values for the deployed environments do NOT belong here. Stage and production are configured
 * through `APP_*` variables on their stacks in Hochfrequenz/hf-apps-collection; a second copy in
 * this repository is precisely the drift ADR-0008 exists to prevent.
 */
const defaults: EnvironmentInterface = {
  // set to TRUE if you want the DEFAULT AUTHENTICATION BEHAVIOR of the production environment
  isProduction: false, // during local development (localhost 4000/4200), the user "local@development.com" is authenticated by default
  apiUrl: 'http://localhost:3000',
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.stage.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.stage.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.stage.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'Hku0EniRjy4B2krnx1sCwTIOzAiVta1B',
  entraClientId: 'e8418ff3-641e-4ef6-b407-30e36b867b9c',
  entraAuthority: 'https://login.microsoftonline.com/fb2b0361-fa12-48a5-bade-533bf89760d9',
  entraScopes: ['openid', 'profile', 'email'],
  baseUrl: 'http://localhost:4200',
  warmupUrl: 'https://ahbicht-stage.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: false,
  enablePruefiComparison: true,
};

export const environment: EnvironmentInterface = withRuntimeConfig(defaults);
