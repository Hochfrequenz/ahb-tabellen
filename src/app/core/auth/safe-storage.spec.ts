import { safeStorageGet, safeStorageRemove, safeStorageSet } from './safe-storage';

/** A Storage whose every operation throws, e.g. Safari private mode / disabled storage. */
const throwingStorage: Storage = {
  get length(): number {
    throw new Error('nope');
  },
  clear() {
    throw new Error('nope');
  },
  getItem() {
    throw new Error('nope');
  },
  key() {
    throw new Error('nope');
  },
  removeItem() {
    throw new Error('nope');
  },
  setItem() {
    throw new Error('nope');
  },
};

describe('safe-storage', () => {
  it('reads/writes/removes through a working storage', () => {
    const store: Record<string, string> = {};
    const storage = {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => void (store[k] = v),
      removeItem: (k: string) => void delete store[k],
    } as unknown as Storage;

    safeStorageSet(storage, 'k', 'v');
    expect(safeStorageGet(storage, 'k')).toBe('v');
    safeStorageRemove(storage, 'k');
    expect(safeStorageGet(storage, 'k')).toBeNull();
  });

  it('never throws when the underlying storage throws', () => {
    expect(() => safeStorageSet(throwingStorage, 'k', 'v')).not.toThrow();
    expect(() => safeStorageRemove(throwingStorage, 'k')).not.toThrow();
    expect(safeStorageGet(throwingStorage, 'k')).toBeNull();
  });
});
