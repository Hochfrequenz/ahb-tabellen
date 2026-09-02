import { resolveAuthIsDevelopment } from './msal.tokens';

describe('resolveAuthIsDevelopment', () => {
  it('is false in production (real providers)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: true,
        hostname: 'ahb-tabellen.hochfrequenz.de',
        realauthOverride: false,
      })
    ).toBe(false);
  });

  it('is true on localhost by default (dev stub)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: false,
        hostname: 'localhost',
        realauthOverride: false,
      })
    ).toBe(true);
  });

  it('is false on localhost when the realauth override is set (exercise the real flow locally)', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: false,
        hostname: 'localhost',
        realauthOverride: true,
      })
    ).toBe(false);
  });

  it('stays false in production even if the override is set', () => {
    expect(
      resolveAuthIsDevelopment({
        isProduction: true,
        hostname: 'ahb-tabellen.hochfrequenz.de',
        realauthOverride: true,
      })
    ).toBe(false);
  });
});
