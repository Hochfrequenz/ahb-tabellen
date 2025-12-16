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

// Track whether PRAGMAs have been applied
let pragmasApplied = false;

// Apply performance PRAGMAs for read-only workload
async function applyPerformancePragmas(dataSource: DataSource): Promise<void> {
  if (pragmasApplied) return;

  // Prevent accidental writes and allow SQLite to skip write-related overhead
  await dataSource.query('PRAGMA query_only = ON');

  // Increase page cache from default ~2MB to 64MB (negative value = KB).
  // Keeps frequently accessed pages in memory, reducing disk I/O for repeated queries.
  await dataSource.query('PRAGMA cache_size = -64000');

  // Memory-map up to 2GB of the database file for direct memory access.
  // For our 900MB database, this maps the entire file, avoiding read() syscalls
  // and letting the OS manage caching efficiently. Can yield 2-5x speedup for random reads.
  await dataSource.query('PRAGMA mmap_size = 2147483648');

  pragmasApplied = true;
}

// Wrap the original initialize to apply PRAGMAs after connection
const originalInitialize = AppDataSource.initialize.bind(AppDataSource);
AppDataSource.initialize = async function (): Promise<DataSource> {
  const result = await originalInitialize();
  await applyPerformancePragmas(result);
  return result;
};
