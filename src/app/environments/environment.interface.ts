export interface EnvironmentInterface {
  isProduction: boolean;
  apiUrl: string;
  bedingungsbaumBaseUrl: string;
  ebdBaseUrl: string;
  fristenkalenderBaseUrl: string;
  auth0Domain: string;
  auth0ClientId: string;
  // Microsoft Entra ID (second, independent login provider — see #951). The SPA login is
  // gating-only, so `entraScopes` are OIDC scopes, not an API audience. The client id / tenant
  // are provisioned by the Pulumi `azuread` app registration (follow-up).
  entraClientId: string;
  entraAuthority: string; // https://login.microsoftonline.com/{tenantId}
  entraScopes: string[];
  baseUrl: string;
  warmupUrl?: string;
  allowSearchIndexing: boolean;
  enablePruefiComparison: boolean;
}
