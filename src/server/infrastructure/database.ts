import { DataSource } from 'typeorm';
import { AhbMetaInformation } from '../entities/ahb-meta-information.entity';
import { AhbLine, Anwendungshandbuch } from '../entities/ahb-line.entity';
import { AhbDiffLine } from '../entities/ahb-diff.entity';
import * as sqlite3 from 'sqlite3';
import path from 'path';

/**
 * Where the SQLite database lives when `AHB_DB_PATH` is unset: the checked-out repository
 * layout, so `npm run start` and the tests keep working without any configuration.
 */
const DEFAULT_DB_PATH = path.join('src', 'server', 'data', 'ahb.db');

/**
 * Resolve the database location from the environment.
 *
 * In a container the database is no longer part of the image — it is seeded into a volume
 * mounted read-only at `/data`, and `AHB_DB_PATH` points there. Relative values are resolved
 * against the working directory so the default keeps behaving exactly as the previous
 * hard-coded `path.resolve(process.cwd(), 'src/server/data/ahb.db')` did.
 */
export function resolveDbPath(env: NodeJS.ProcessEnv = process.env): string {
  return path.resolve(process.cwd(), env['AHB_DB_PATH'] || DEFAULT_DB_PATH);
}

/**
 * Open flags for the sqlite3 driver. The default (`OPEN_READWRITE | OPEN_CREATE`) cannot open a
 * database on a read-only mount, and silently creating an empty database when the path is wrong
 * is a worse failure than refusing to start. Each flag earns its place:
 *
 * - `OPEN_READONLY` — this is a read-only workload (see `PRAGMA query_only` below), and it is
 *   what lets the container run with `read_only: true` and the data volume mounted `:ro`.
 * - `OPEN_FULLMUTEX` — serialized threading mode. node-sqlite3 defaults to it, but passing
 *   explicit flags replaces the default set rather than extending it, so it must be repeated.
 * - `OPEN_URI` — not for URI filenames (a plain path stays a plain path), but because TypeORM
 *   skips its `mkdir -p` on the database's directory when this flag is set. That mkdir would
 *   otherwise run against a read-only mount on every startup.
 */
const OPEN_FLAGS = sqlite3.OPEN_READONLY | sqlite3.OPEN_FULLMUTEX | sqlite3.OPEN_URI;

// Create the DataSource configuration
const dataSourceConfig = {
  type: 'sqlite' as const,
  database: resolveDbPath(),
  flags: OPEN_FLAGS,
  entities: [AhbMetaInformation, AhbLine, Anwendungshandbuch, AhbDiffLine],
  logging: true, // Enable SQL query logging
  synchronize: false, // Set to false since we already have the database schema
};

// Export the DataSource for use in other files
export const AppDataSource = new DataSource(dataSourceConfig);

// Promise that resolves when PRAGMAs are applied. Used to ensure PRAGMAs are
// applied exactly once, even if multiple callers race to initialize.
let pragmasPromise: Promise<void> | null = null;

// Apply performance PRAGMAs for read-only workload
function applyPerformancePragmas(dataSource: DataSource): Promise<void> {
  if (pragmasPromise) return pragmasPromise;

  // Assign promise synchronously before async work begins to prevent race conditions
  pragmasPromise = (async () => {
    // Prevent accidental writes and allow SQLite to skip write-related overhead
    await dataSource.query('PRAGMA query_only = ON');

    // Increase page cache from default ~2MB to 64MB.
    // Negative value specifies size in KB (SQLite convention).
    // Keeps frequently accessed pages in memory, reducing disk I/O for repeated queries.
    const CACHE_SIZE_64MB_IN_KB = -64000;
    await dataSource.query(`PRAGMA cache_size = ${CACHE_SIZE_64MB_IN_KB}`);

    // Memory-map the database file for direct memory access, avoiding read() syscalls and
    // letting the OS manage caching. Can yield 2-5x speedup for random reads.
    //
    // Sized by AHB_DB_MMAP_SIZE so it can be tuned per deployment. Mapped pages are page
    // cache, but under a cgroup memory limit they still count towards the container's usage
    // (reclaimable, so the effect is eviction pressure rather than an OOM kill). The default
    // maps our ~1.1 GB database in full, which suits a host with memory to spare; lower it
    // on a container with a tight `mem_limit`.
    const MMAP_SIZE_DEFAULT = 2 * 1024 * 1024 * 1024;
    const mmapSize = Number(process.env['AHB_DB_MMAP_SIZE']) || MMAP_SIZE_DEFAULT;
    await dataSource.query(`PRAGMA mmap_size = ${mmapSize}`);
  })();

  return pragmasPromise;
}

// Wrap the original initialize to apply PRAGMAs after connection
const originalInitialize = AppDataSource.initialize.bind(AppDataSource);
AppDataSource.initialize = async function (): Promise<DataSource> {
  const result = await originalInitialize();
  await applyPerformancePragmas(result);
  return result;
};
