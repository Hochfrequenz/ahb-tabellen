import { ENV_VARS } from '../infrastructure/app-config';
import { buildBedingungJumpHint } from './bedingung-hint';

describe('buildBedingungJumpHint', () => {
  it('names the Bedingungsbaum URL this deployment was configured with', () => {
    // The hint is handed to LLM clients as a tool description, so a stale URL here sends them
    // somewhere that only redirects — or, after the .de retirement, nowhere at all.
    const hint = buildBedingungJumpHint({
      [ENV_VARS.bedingungsbaumBaseUrl]: 'https://bedingungsbaum.hochfrequenz.app',
    });

    expect(hint).toContain('https://bedingungsbaum.hochfrequenz.app');
    expect(hint).not.toContain('hochfrequenz.de');
  });

  it('falls back to the compiled default when the variable is unset', () => {
    expect(buildBedingungJumpHint({})).toContain('https://bedingungsbaum.hochfrequenz.de');
  });

  it('treats an empty value as unset, matching buildRuntimeConfig', () => {
    // `readString` in app-config.ts gives an empty variable the same meaning as a missing one.
    // The two must agree, or /config.js and this hint would disagree about the same variable.
    expect(buildBedingungJumpHint({ [ENV_VARS.bedingungsbaumBaseUrl]: '' })).toContain(
      'https://bedingungsbaum.hochfrequenz.de'
    );
  });
});
