import { EnvironmentInterface } from './environment.interface';
import { withRuntimeConfig } from './runtime-config';

/**
 * The values compiled into the container image.
 *
 * Every deployment overrides what it needs through `/config.js` (see `runtime-config.ts`), so one
 * image serves both stage and production. These defaults are therefore not "the production
 * configuration" so much as **what the app falls back to when `/config.js` is missing or fails to
 * load** — the failure mode ADR-0008 calls out. Two consequences for anyone editing this file:
 *
 * - `apiUrl` and `baseUrl` are derived from the current origin rather than hard-coded. The Express
 *   server serves the SPA and the API from a single origin in every deployment, so this is always
 *   correct — and it means a stage container that lost its configuration talks to itself rather
 *   than silently to production.
 * - The remaining values still match the Azure App Service deployment, which sets no `APP_*`
 *   variables at all. Note that deployment cannot actually serve this image — it has no database
 *   volume, so the server exits at startup (see the README's "Azure deployment" warning). These
 *   values are kept aligned with it anyway, so that nothing else changes when it is migrated.
 *
 * Search indexing is the one setting a fallback cannot make safe in both directions: `true` is
 * correct for production and wrong for stage. Stage sets `APP_ALLOW_SEARCH_INDEXING=false` and,
 * because that would be lost along with the rest of the configuration, its Traefik router also
 * sends `X-Robots-Tag: noindex` — a header the bundle cannot get wrong.
 */
const origin = typeof window === 'undefined' ? '' : window.location.origin;

const defaults: EnvironmentInterface = {
  isProduction: true, // DO NOT CHANGE - disables automatic dummy user login in production environment
  apiUrl: origin,
  bedingungsbaumBaseUrl: 'https://bedingungsbaum.hochfrequenz.de',
  ebdBaseUrl: 'https://ebd.hochfrequenz.de',
  fristenkalenderBaseUrl: 'https://fristenkalender.hochfrequenz.de',
  auth0Domain: 'auth.hochfrequenz.de',
  auth0ClientId: 'VSkXGqlTD7Rf5Q4n9a0h00rInEyL2ZQj',
  entraClientId: '00000000-0000-0000-0000-000000000000', // provisioned by infra (#951)
  entraAuthority: 'https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000',
  entraScopes: ['openid', 'profile', 'email'],
  baseUrl: origin,
  warmupUrl: 'https://ahbicht.azurewebsites.net/api/ResolveConditionText/FV2504/UTILMDS/333',
  allowSearchIndexing: true,
  enablePruefiComparison: false,
};

export const environment: EnvironmentInterface = withRuntimeConfig(defaults);
