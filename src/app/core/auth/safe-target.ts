/**
 * Normalize a user-supplied post-login `target` to a safe app-internal path, defending against
 * open-redirect style navigation. The value reaches us from `/?target=…`, from `router.url`, and
 * from mutable sessionStorage, so every consumer must sanitize it before use.
 *
 * A safe target is a rooted internal path: a single leading `/`, not protocol-relative (`//`),
 * with no scheme and no backslashes (some browsers normalize `\` to `/`). Anything else → `/`.
 */
export function safeInternalTarget(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || raw.includes('\\')) {
    return '/';
  }
  return raw;
}
