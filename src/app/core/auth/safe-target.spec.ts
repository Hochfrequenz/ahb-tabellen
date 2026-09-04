import { safeInternalTarget } from './safe-target';

describe('safeInternalTarget', () => {
  it.each(['/search', '/ahb/UTILMD', '/compare?a=1#b'])('keeps the internal path %s', target => {
    expect(safeInternalTarget(target)).toBe(target);
  });

  it.each([
    [null, '/'],
    [undefined, '/'],
    ['', '/'],
    ['//evil.com', '/'], // protocol-relative
    ['https://evil.com', '/'], // absolute with scheme
    ['http:evil', '/'], // scheme without slashes
    ['/\\evil.com', '/'], // backslash normalized to slash by some browsers
    ['\\\\evil.com', '/'],
    ['javascript:alert(1)', '/'],
    ['relative/path', '/'], // not rooted
  ])('rejects unsafe target %p → /', (target, expected) => {
    expect(safeInternalTarget(target as string | null | undefined)).toBe(expected);
  });
});
