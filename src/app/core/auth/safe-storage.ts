/**
 * Web Storage access that never throws. `localStorage`/`sessionStorage` can throw in private
 * mode, when disabled by policy, or on quota — and an auth/startup path must not crash the app
 * because of it. Reads degrade to `null`; writes/removes are best-effort no-ops on failure.
 */
export function safeStorageGet(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function safeStorageSet(storage: Storage, key: string, value: string): void {
  try {
    storage.setItem(key, value);
  } catch {
    // ignore — storage unavailable
  }
}

export function safeStorageRemove(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // ignore — storage unavailable
  }
}
