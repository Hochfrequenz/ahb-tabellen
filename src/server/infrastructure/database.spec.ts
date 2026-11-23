import fs from 'fs';
import os from 'os';
import path from 'path';
import { assertDatabaseIsUsable, resolveDbPath, resolveMmapSize } from './database';

describe('resolveDbPath', () => {
  it('falls back to the in-repository location so local development needs no configuration', () => {
    expect(resolveDbPath({})).toBe(path.resolve(process.cwd(), 'src/server/data/ahb.db'));
  });

  it('uses AHB_DB_PATH, which points at the seeded volume in a container', () => {
    expect(resolveDbPath({ AHB_DB_PATH: '/data/ahb.db' })).toBe('/data/ahb.db');
  });

  it('resolves a relative AHB_DB_PATH against the working directory', () => {
    expect(resolveDbPath({ AHB_DB_PATH: 'tmp/ahb.db' })).toBe(
      path.resolve(process.cwd(), 'tmp/ahb.db')
    );
  });

  it('treats an empty AHB_DB_PATH as unset, since compose emits one for a blank .env entry', () => {
    expect(resolveDbPath({ AHB_DB_PATH: '' })).toBe(
      path.resolve(process.cwd(), 'src/server/data/ahb.db')
    );
  });
});

describe('resolveMmapSize', () => {
  it('defaults to 2 GiB when unset or empty', () => {
    const twoGiB = 2 * 1024 * 1024 * 1024;
    expect(resolveMmapSize({})).toBe(twoGiB);
    expect(resolveMmapSize({ AHB_DB_MMAP_SIZE: '' })).toBe(twoGiB);
  });

  it('accepts 0, which disables memory mapping under a tight memory limit', () => {
    // A truthiness check would fold this back into the default and silently ignore the operator.
    expect(resolveMmapSize({ AHB_DB_MMAP_SIZE: '0' })).toBe(0);
  });

  it('accepts an explicit byte count', () => {
    expect(resolveMmapSize({ AHB_DB_MMAP_SIZE: '536870912' })).toBe(536870912);
  });

  // `Number` accepts every one of these. Whitespace is the dangerous one: it converts to 0, which
  // is a valid setting, so it would have silently disabled memory mapping.
  it.each(['512MB', '-1', '1.5', 'lots', '   ', '0x40000000', '1e9', ' 5 ', '+7', '\n512'])(
    'rejects %p rather than silently accepting a value nobody wrote',
    raw => {
      expect(() => resolveMmapSize({ AHB_DB_MMAP_SIZE: raw })).toThrow(/AHB_DB_MMAP_SIZE/);
    }
  );
});

describe('assertDatabaseIsUsable', () => {
  it('names AHB_DB_PATH when the database is missing', () => {
    expect(() => assertDatabaseIsUsable('/nope/ahb.db')).toThrow(/AHB_DB_PATH/);
  });

  it('calls out a directory, which is what a bind mount to a missing source produces', () => {
    expect(() => assertDatabaseIsUsable(process.cwd())).toThrow(/is not a file/);
  });

  it('accepts a real file', () => {
    expect(() => assertDatabaseIsUsable(__filename)).not.toThrow();
  });

  it('rejects an empty file, which would fail every query with SQLITE_NOTADB', () => {
    const empty = path.join(os.tmpdir(), `ahb-empty-${process.pid}.db`);
    fs.writeFileSync(empty, '');
    try {
      expect(() => assertDatabaseIsUsable(empty)).toThrow(/is empty/);
    } finally {
      fs.unlinkSync(empty);
    }
  });
});
