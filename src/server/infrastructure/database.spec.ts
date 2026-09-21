import path from 'path';
import { resolveDbPath } from './database';

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
