import { InjectionToken } from '@angular/core';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';
import { safeStorageGet, safeStorageRemove, safeStorageSet } from './safe-storage';

/**
 * The shared MSAL browser client (Microsoft Entra ID). We use `@azure/msal-browser` directly
 * rather than `@azure/msal-angular` so there is no Angular peer-dependency to track; the
 * `AuthFacade` is the Angular-facing abstraction. Provided as a token so tests can inject a fake.
 */
export const MSAL_CLIENT = new InjectionToken<IPublicClientApplication>('MSAL_CLIENT', {
  providedIn: 'root',
  factory: () =>
    new PublicClientApplication({
      auth: {
        clientId: environment.entraClientId,
        authority: environment.entraAuthority,
        // Distinct from Auth0's callback (window.location.origin) so the two SDKs never both
        // try to process the same authorization response.
        redirectUri: `${window.location.origin}/auth/msal-callback`,
        postLogoutRedirectUri: window.location.origin,
      },
      cache: { cacheLocation: 'localStorage' },
    }),
});

/**
 * The all-zero GUID that `environment.prod.ts` ships for `entraClientId` / `entraAuthority`.
 *
 * It is a placeholder, not a value: the Entra app registrations are provisioned by the app's
 * Pulumi program only where `entraEnabled` is set, which today is the stage stack alone. See
 * https://github.com/Hochfrequenz/ahb-tabellen/issues/1095.
 */
const UNCONFIGURED_GUID = '00000000-0000-0000-0000-000000000000';

/**
 * Pure decision for whether Microsoft (Entra) sign-in can actually complete.
 *
 * The app offers two login providers, but only Auth0 is configured in every environment. Where
 * the Entra registration does not exist, the compiled values are the placeholder above and a
 * sign-in attempt dies at Microsoft with `AADSTS` noise the user can do nothing about — so the
 * button must not be offered at all rather than offered and broken.
 *
 * Blank counts as unconfigured because the runtime config gives an empty `APP_*` variable the
 * same meaning as a missing one (see `readString` in `app-config.ts`), so a deployment that sets
 * `APP_ENTRA_CLIENT_ID=` must behave exactly like one that omits it.
 */
export function resolveEntraIsConfigured(input: {
  entraClientId: string;
  entraAuthority: string;
}): boolean {
  const clientId = (input.entraClientId ?? '').trim();
  const authority = (input.entraAuthority ?? '').trim();
  if (!clientId || !authority) {
    return false;
  }
  // The authority embeds the tenant id, so a placeholder tenant is as fatal as a placeholder
  // client id even when the other half is real.
  return clientId !== UNCONFIGURED_GUID && !authority.includes(UNCONFIGURED_GUID);
}

/**
 * Whether to offer Microsoft sign-in in the UI. Overridable in tests; read by every component
 * that renders a provider choice, so the two entry points cannot drift apart.
 */
export const ENTRA_IS_CONFIGURED = new InjectionToken<boolean>('ENTRA_IS_CONFIGURED', {
  providedIn: 'root',
  factory: () =>
    resolveEntraIsConfigured({
      entraClientId: environment.entraClientId,
      entraAuthority: environment.entraAuthority,
    }),
});

/** localStorage flag persisting the local "use the real auth providers" opt-in. */
export const REALAUTH_FLAG_KEY = 'ahb.realauth';

/**
 * Pure decision for whether the dev auth stub is active. It is active in a dev environment
 * (non-production build, or localhost) UNLESS the realauth override is set — the opt-in escape
 * hatch that lets the real Auth0/Microsoft flows run locally.
 */
export function resolveAuthIsDevelopment(input: {
  isProduction: boolean;
  hostname: string;
  realauthOverride: boolean;
}): boolean {
  const isDevEnvironment = !input.isProduction || input.hostname === 'localhost';
  return isDevEnvironment && !input.realauthOverride;
}

/** Read (and persist) the realauth override from `?realauth=1|0` and localStorage. */
function readRealauthOverride(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const param = new URLSearchParams(window.location.search).get('realauth');
  if (param === '1') {
    safeStorageSet(localStorage, REALAUTH_FLAG_KEY, '1');
  } else if (param === '0') {
    safeStorageRemove(localStorage, REALAUTH_FLAG_KEY);
  }
  return safeStorageGet(localStorage, REALAUTH_FLAG_KEY) === '1';
}

/**
 * The live dev-stub decision: dev environment AND no realauth override. Use this everywhere the
 * app decides whether to stub auth — the `AUTH_IS_DEVELOPMENT` token AND the Auth0 SDK stub in
 * app.config — so the `?realauth=1` escape hatch is honored consistently.
 */
export function computeAuthIsDevelopment(): boolean {
  return resolveAuthIsDevelopment({
    isProduction: environment.isProduction,
    hostname: typeof window !== 'undefined' ? window.location.hostname : '',
    realauthOverride: readRealauthOverride(),
  });
}

/**
 * True when running against the dev stub (no real auth), centralizing the checks previously
 * inlined in AuthGuard/LoginButtonComponent. Overridable in tests. Append `?realauth=1` to the
 * URL to force the real providers on localhost (persisted; `?realauth=0` clears it) — useful for
 * exercising the Microsoft/Auth0 redirect flows locally against a real app registration.
 */
export const AUTH_IS_DEVELOPMENT = new InjectionToken<boolean>('AUTH_IS_DEVELOPMENT', {
  providedIn: 'root',
  factory: () => computeAuthIsDevelopment(),
});
