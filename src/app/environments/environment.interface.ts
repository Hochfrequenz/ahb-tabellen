export interface EnvironmentInterface {
  isProduction: boolean;
  apiUrl: string;
  bedingungsbaumBaseUrl: string;
  ebdBaseUrl: string;
  fristenkalenderBaseUrl: string;
  /**
   * MaKo-Prozesse is not deployed under this host yet - neither in production nor on a
   * staging domain (see https://github.com/Hochfrequenz/mako_prozesse/issues/65). Every
   * environment therefore points at the intended production URL until the custom domain
   * is live; re-check once it is.
   */
  makoProzesseBaseUrl: string;
  auth0Domain: string;
  auth0ClientId: string;
  baseUrl: string;
  warmupUrl?: string;
  allowSearchIndexing: boolean;
  enablePruefiComparison: boolean;
}
