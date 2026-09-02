import { InjectionToken } from '@angular/core';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

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
 * True when running against the dev stub (no real auth), centralizing the checks previously
 * inlined in AuthGuard/LoginButtonComponent. Overridable in tests.
 */
export const AUTH_IS_DEVELOPMENT = new InjectionToken<boolean>('AUTH_IS_DEVELOPMENT', {
  providedIn: 'root',
  factory: () =>
    !environment.isProduction ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'),
});
