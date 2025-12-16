import { DataSource } from 'typeorm';
import { AhbMetaInformation } from '../entities/ahb-meta-information.entity';
import { AhbLine, Anwendungshandbuch } from '../entities/ahb-line.entity';
import { AhbDiffLine } from '../entities/ahb-diff.entity';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/server/data/ahb.db');

// Create the DataSource configuration
const dataSourceConfig = {
  type: 'sqlite' as const,
  database: dbPath,
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

    // Memory-map up to 2GB of the database file for direct memory access.
    // For our 900MB database, this maps the entire file, avoiding read() syscalls
    // and letting the OS manage caching efficiently. Can yield 2-5x speedup for random reads.
    const MMAP_SIZE_2GB = 2 * 1024 * 1024 * 1024;
    await dataSource.query(`PRAGMA mmap_size = ${MMAP_SIZE_2GB}`);
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
