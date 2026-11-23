import { EnvironmentInterface } from './environment.interface';

/**
 * The subset of the environment a deployment may override at runtime.
 *
 * `isProduction` is deliberately absent. It gates the automatic dummy-user login, so making it
 * settable from a container's environment would turn a stray `.env` line into an authentication
 * bypass. It stays a build-time constant.
 */
export type RuntimeConfig = Partial<Omit<EnvironmentInterface, 'isProduction'>>;

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

/**
 * Merge the deployment's runtime configuration over the values compiled into the bundle.
 *
 * The Express server renders `/config.js` from its environment and `index.html` loads it before
 * the application bundle, so `window.__APP_CONFIG__` is already populated by the time any
 * consumer reads `environment` (ADR-0008 in Hochfrequenz/hf-apps-collection). One image therefore
 * serves every environment: what is verified on stage is bit-for-bit what runs in production.
 *
 * Where there is no server — `ng serve`, `ng test` — the script is simply absent and the compiled
 * values apply unchanged. That fallback is also the failure mode when `/config.js` fails to load
 * in a container, which is why the compiled values are chosen to be safe rather than
 * production-specific: see the comment in `environment.prod.ts`.
 */
export function withRuntimeConfig(defaults: EnvironmentInterface): EnvironmentInterface {
  const overrides = typeof window === 'undefined' ? undefined : window.__APP_CONFIG__;
  // `isProduction` is restored after the spread rather than merely omitted from `RuntimeConfig`:
  // the config arrives as untyped JSON, so the type alone guarantees nothing at runtime.
  return { ...defaults, ...overrides, isProduction: defaults.isProduction };
}
