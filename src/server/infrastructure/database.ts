import { DataSource } from 'typeorm';
import { AhbMetaInformation } from '../entities/ahb-meta-information.entity';
import { AhbLine, Anwendungshandbuch } from '../entities/ahb-line.entity';
import { AhbDiffLine } from '../entities/ahb-diff.entity';
import * as sqlite3 from 'sqlite3';
import fs from 'fs';
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

/** Maps our ~1.1 GB database in full. Suits a host with memory to spare. */
const MMAP_SIZE_DEFAULT = 2 * 1024 * 1024 * 1024;

/**
 * Bytes to memory-map, from `AHB_DB_MMAP_SIZE`.
 *
 * Parsed strictly. `0` is a meaningful value — it disables memory mapping, which is the first
 * thing to try when the container is under memory pressure — so it cannot be folded into the
 * default by a truthiness check, and a typo like `512MB` must not silently leave the default in
 * place while the operator believes they lowered it.
 *
 * Note that SQLite clamps this at compile time (`SQLITE_MAX_MMAP_SIZE`, 0x7FFF0000): the 2 GiB
 * default reads back as 2147418112, and raising it further has no effect and reports nothing.
 * Lowering it is the useful direction.
 */
export function resolveMmapSize(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env['AHB_DB_MMAP_SIZE'];
  if (raw === undefined || raw === '') return MMAP_SIZE_DEFAULT;

  // Matched as digits before being converted, because `Number` is far more permissive than it
  // looks: it reads "   " as 0 — silently disabling mapping — and accepts "0x40000000", "1e9",
  // " 5 " and "+7". Each of those is a configuration the operator did not write.
  if (!/^[0-9]+$/.test(raw)) {
    throw new Error(`AHB_DB_MMAP_SIZE must be a whole number of bytes, got "${raw}"`);
  }
  return Number(raw);
}

/**
 * Fail before opening the database rather than after.
 *
 * The database is now an external dependency — a volume seeded by a separate job, addressed by
 * `AHB_DB_PATH` — so it can be absent, mistyped, or (with a bind mount whose source does not
 * exist) a directory Docker helpfully created. Each of those used to be impossible; each would
 * otherwise surface as a server that starts happily and fails every single API request.
 */
export function assertDatabaseIsUsable(dbPath: string): void {
  let stats: fs.Stats;
  try {
    stats = fs.statSync(dbPath);
  } catch {
    throw new Error(
      `No database at ${dbPath}. Set AHB_DB_PATH to the database file, and check that the ` +
        `volume it lives on is mounted and has been seeded.`
    );
  }

  if (!stats.isFile()) {
    throw new Error(
      `${dbPath} is not a file. A bind mount whose source does not exist makes Docker create a ` +
        `directory in its place — check the path on the host.`
    );
  }

  // An empty file passes every other check here and then fails every query with SQLITE_NOTADB.
  if (stats.size === 0) {
    throw new Error(`${dbPath} is empty. The seed job did not finish, or the volume was cleared.`);
  }

  // The container runs as an unprivileged user while the seed job writes as root, so a mode the
  // job did not intend surfaces here rather than as a bare SQLITE_CANTOPEN.
  try {
    fs.accessSync(dbPath, fs.constants.R_OK);
  } catch {
    throw new Error(`${dbPath} is not readable by this user (uid ${process.getuid?.() ?? '?'}).`);
  }
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
    await dataSource.query(`PRAGMA mmap_size = ${resolveMmapSize()}`);
  })();

  // Clear the memo if it fails. Otherwise one bad PRAGMA is cached forever: the underlying
  // connection is already open by then (`isInitialized` is true), so every later attempt replays
  // the same rejection even once the cause has been fixed.
  pragmasPromise = pragmasPromise.catch((error: unknown) => {
    pragmasPromise = null;
    throw error;
  });

  return pragmasPromise;
}

// Wrap the original initialize to apply PRAGMAs after connection
const originalInitialize = AppDataSource.initialize.bind(AppDataSource);
AppDataSource.initialize = async function (): Promise<DataSource> {
  assertDatabaseIsUsable(dataSourceConfig.database);
  const result = await originalInitialize();
  await applyPerformancePragmas(result);
  return result;
};
