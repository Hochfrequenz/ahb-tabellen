import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthFacade } from './auth.facade';

/**
 * Attach the user's access token to calls to our own backend API — and only those, so the token
 * is never sent to third-party hosts (ahbicht, bedingungsbaum, …).
 */
export const apiAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Trailing slashes on APP_API_URL must not defeat the match (the generated client concatenates
  // `rootUrl + path` verbatim).
  const apiPrefix = `${environment.apiUrl.replace(/\/+$/, '')}/api/`;
  if (!req.url.startsWith(apiPrefix)) {
    return next(req);
  }
  return inject(AuthFacade)
    .getAccessToken()
    .pipe(
      switchMap(token =>
        next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req)
      )
    );
};
