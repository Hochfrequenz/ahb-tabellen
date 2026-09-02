import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Title } from '@angular/platform-browser';

import { routes } from './app.routes';
import { ApiModule } from './core/api';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './environments/environment';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthFacade } from './core/auth/auth.facade';

function isDevelopmentEnvironment(): boolean {
  return !environment.isProduction || window.location.hostname === 'localhost';
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    Title,
    importProvidersFrom(
      HttpClientModule,
      ApiModule.forRoot({
        rootUrl: environment.apiUrl,
      })
    ),
    provideAuth0({
      domain: environment.auth0Domain,
      clientId: environment.auth0ClientId,
      useRefreshTokens: true,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      ...(isDevelopmentEnvironment() && {
        skipRedirectCallback: true,
        _overrideIsAuthenticated: true,
        isAuthenticated: () => Promise.resolve(true),
        getUser: () =>
          Promise.resolve({
            email: 'local@development.com',
            name: 'Local Development User',
            sub: 'local-development',
          }),
        handleRedirectCallback: () => Promise.resolve({ appState: {} }),
        loginWithRedirect: () => Promise.resolve(),
        logout: () => Promise.resolve(),
      }),
    }),
    // Initialize MSAL and process any pending Microsoft redirect before the app renders.
    // No-op under the development stub (AuthFacade.initializeMsal returns early).
    provideAppInitializer(() => inject(AuthFacade).initializeMsal()),
  ],
};
