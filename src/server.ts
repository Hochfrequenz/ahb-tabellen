import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { join } from 'path';
import cors from 'cors';
import router from './server/infrastructure/api.routes';
import { httpErrorHandler } from './server/infrastructure/errors';
import { AppDataSource } from './server/infrastructure/database';
import { mountMcp } from './server/mcp/http';
import {
  buildRuntimeConfig,
  CONFIG_SCRIPT_PATH,
  renderConfigScript,
} from './server/infrastructure/app-config';
import 'reflect-metadata';

const server = express();
server.use(express.json());
server.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:4200',
      'http://localhost:4000',
      'https://ahb-tabellen.stage.hochfrequenz.de',
      'https://ahb-tabellen.hochfrequenz.de',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const distFolder = join(process.cwd(), 'dist/ahb-tabellen/browser');
const indexHtml = 'index.html';

// Built once, at startup, so a malformed APP_* variable fails the process immediately rather
// than the first request that happens to need it.
const configScript = renderConfigScript(buildRuntimeConfig());

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
  })
  .catch(error => {
    console.error('Error initializing database connection:', error);
  });

server.get('/version', (_, res) =>
  res.send({
    version: process.env['VERSION'] || 'unknown',
    buildDate: process.env['BUILD_DATE'] || 'unknown',
    commitHash: process.env['COMMIT_HASH'] || 'unknown',
    commitDate: process.env['COMMIT_DATE'] || 'unknown',
    buildBranch: process.env['BUILD_BRANCH'] || 'unknown',
    environment: process.env['ENVIRONMENT'] || 'unknown (local)',
    name: 'ahb-tabellen',
  })
);
server.get('/health', (_, res) => res.send());
server.get('/readiness', (_, res) => res.send());

server.use('/api', router);

// Mount the MCP server (Streamable HTTP) + its OAuth metadata. MUST be registered before
// the static/catch-all routes below so /mcp and /.well-known are not shadowed by the SPA.
mountMcp(server);

// Apply error handler middleware
server.use(httpErrorHandler);

// Runtime configuration for the Angular bundle, which loads it from index.html before starting.
// MUST be registered before the static handler below, whose `*file.*ext` pattern would otherwise
// match this path and 404 it. Never cached: a configuration change must take effect on restart.
server.get(CONFIG_SCRIPT_PATH, (_, res) =>
  res.type('application/javascript').set('Cache-Control', 'no-store').send(configScript)
);

// Serve static files from /browser
server.get('*file.*ext', express.static(distFolder, { maxAge: '1y' }));

// All regular routes serve angular
server.get('{/*splat}', async (_, res) => res.sendFile(join(distFolder, indexHtml)));

const port = process.env['PORT'] || 3000;
const httpServer = server.listen(port, () => {
  console.log(`Node Express server listening on http://localhost:${port}`);
});

// Node as PID 1 gets no default signal handlers, so without this `docker stop` waits out its
// full grace period and then SIGKILLs the container on every deploy. Stop accepting connections,
// drop idle keep-alives, close the database, then exit.
const shutdown = (signal: NodeJS.Signals): void => {
  console.log(`Received ${signal}, shutting down`);
  httpServer.close(() => {
    const closed = AppDataSource.isInitialized ? AppDataSource.destroy() : Promise.resolve();
    void closed.finally(() => process.exit(0));
  });
  httpServer.closeIdleConnections();
  // Safety net: one long-lived request must not keep the container alive indefinitely.
  setTimeout(() => process.exit(0), 10_000).unref();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
