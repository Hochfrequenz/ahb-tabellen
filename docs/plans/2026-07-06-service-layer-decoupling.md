# Service Layer Decoupling (prep for MCP server)

## Goal

Decouple the server's business logic from the Express/HTTP transport so the exact
same logic can be exposed by **both** the existing HTTP REST API and (in a later
round) an MCP server.

This document covers **Round 1 only: introduce a transport-agnostic service layer.**
It is a mechanical, behavior-preserving refactor. Adding the MCP server and shared
Auth0 token validation is explicitly **out of scope** and will be planned separately.

## Current state (assessment)

Layering today:

```
server.ts            → Express bootstrap, CORS, DB init, serves Angular
infrastructure/       api.routes.ts (Express Router), database.ts, errors.ts, xlsx-generator
controller/*          Express adapters: parse req → validate → call repo → write res
repository/*          business logic + TypeORM queries  (already Express-free ✅)
entities/*            domain models
```

**Good:** the `repository/*` layer has zero Express coupling — clean, reusable
signatures (`AHBRepository.get(pruefi, fv, fileType)`, `searchAhbLines(payload)`,
`AhbDiffRepository.getDiff(...)`, etc.). Errors (`AppError` hierarchy) already carry
transport-neutral data (`statusCode`, `errorCode`, `message`); only `httpErrorHandler`
is Express-specific.

**Gap:** two kinds of non-HTTP logic are trapped in the controllers and would have to
be duplicated by an MCP layer:

1. **Input validation** — `^\d{5}$` (pruefi) and `^FV\d{4}$` (format version) regexes
   are copy-pasted across `ahb.ts` (`:18,:25`) and `ahbDiff.ts` (`:18,:24,:30,:49,:55`).
   `search.ts` has a _separate_ kind of validation (payload shape: page/pageSize/sort/q,
   `:17-28`) — no pruefi/fv regexes there. All of these are domain rules, not HTTP rules.
2. **Format resolution** — the `json|xlsx|csv → FileType` mapping in `ahb.ts` is domain
   logic tangled together with HTTP concerns (Content-Type / Content-Disposition).

## Endpoint triage

| Endpoint                                                 | Logic in controller today                                | Round-1 action                                                   |
| -------------------------------------------------------- | -------------------------------------------------------- | ---------------------------------------------------------------- |
| `GET /ahb/:fv/:pruefi`                                   | pruefi+fv validation, `format→FileType`, content headers | → `AhbService.getAhb`                                            |
| `GET /ahb-diff/:pruefi`                                  | pruefi + 2× fv validation                                | → `AhbDiffService.getDiff`                                       |
| `GET /ahb-diff-summary`                                  | 2× fv validation                                         | → `AhbDiffService.getSummary`                                    |
| `POST /search/query`                                     | body validation (page/pageSize/sort/q)                   | → `AhbService.searchAhbLines`                                    |
| `GET /format-versions`                                   | passthrough                                              | → `MetadataService.listFormatVersions`                           |
| `GET /formate`                                           | passthrough                                              | → `MetadataService.listFormate`                                  |
| `GET /direction-values`                                  | passthrough                                              | → `MetadataService.listDirections`                               |
| `GET /datenstand`                                        | passthrough                                              | → `MetadataService.getDatenstand`                                |
| `GET /pruefidentifikatoren/:fv`                          | passthrough, **no fv validation today**                  | → `MetadataService.listPruefisByFormatVersion` (adds validation) |
| `GET /health`, `/api/health`                             | Oh-Dear secret, DB probe, `req.header`                   | **leave HTTP-only** — not a service, not an MCP tool             |
| `GET /version` (`server.ts:40`)                          | env-var echo                                             | **leave HTTP-only** — infra                                      |
| `GET /health`, `GET /readiness` root (`server.ts:50-51`) | empty liveness probes                                    | **leave HTTP-only** — infra                                      |
| `/api/**` catch-all 404 (`api.routes.ts:64`)             | not-found                                                | **leave HTTP-only** — routing                                    |

### Notes surfaced during triage (do NOT fix here — flag only)

- **Validation inconsistency:** `/pruefidentifikatoren/:fv` accepts any string while
  every other endpoint enforces `^FV\d{4}$`. Round 1 makes validation consistent by
  routing this through the shared validator. This is the one intentional behavior
  change (previously-accepted malformed values now 400). Called out explicitly so it
  is not a surprise.
- **CSV appears broken today:** the controller maps `csv → FileType.CSV` and sets
  `text/csv`, but `AHBRepository.get` only handles JSON and XLSX and throws
  `new Error('Unsupported file type')` (→ 500) for CSV. Round 1 preserves this exact
  behavior. Do not attempt to implement CSV here — track separately.

## Target structure

```
src/server/
  service/
    validation.ts        # assertPruefi(), assertFormatVersion(), parseFileType()
    ahb.service.ts       # getAhb(pruefi, fv, format), searchAhbLines(payload)
    ahbDiff.service.ts   # getDiff(...), getSummary(...)
    metadata.service.ts  # listFormatVersions / listFormate / listDirections /
                         #   getDatenstand / listPruefisByFormatVersion
  controller/*           # thin HTTP adapters: parse req → call service → set headers → serialize
  repository/*           # UNCHANGED
  infrastructure/*       # UNCHANGED (errors, database, routes, xlsx-generator)
```

### Design rules (these make Round 2 / MCP nearly free)

1. **Services never import or touch `express` / `Request` / `Response`.** They take
   primitives, return domain data, and throw `AppError` subclasses on invalid input.
2. **`AhbService.getAhb` returns `{ fileType: FileType; content: Ahb | Buffer }`.**
   The service resolves and validates the format; the _controller_ owns Content-Type
   and Content-Disposition. An MCP tool will later call this requesting JSON and use
   `content` directly, ignoring the binary path.
3. **All validation lives in `service/validation.ts`**, throwing the existing
   `ValidationError`. One definition of "valid pruefi / valid format version",
   reused by every transport.
4. **Errors stay in `infrastructure/errors.ts`.** Round 2 will add an `mcpErrorHandler`
   mirroring `httpErrorHandler`; no service-layer change needed then.
5. **Services own their repositories** with the same `constructor(repo?)` default-`new`
   pattern the controllers use today — preserves the existing test-injection style.
6. **Controllers now default-`new` their _service_** (`this.service = service ?? new AhbService()`)
   so the zero-arg construction in `api.routes.ts:13-20` (`new AHBController()`) keeps working
   unchanged. Both `AHBController` and `SearchController` delegate to the same `AhbService`
   (both wrap `AHBRepository` today).

### Prerequisite exports (do first — several types are currently inline/unexported)

- `AHBRepository.searchAhbLines` payload and result types are **inline anonymous types**
  (`repository/ahb.ts:24-74`). Extract and `export` them as `SearchPayload` and
  `SearchResult` from `repository/ahb.ts` so the service can reference them by name.
- `PruefiWithName` is a **non-exported** interface in `repository/formatVersion.ts:9`.
  Add `export`.
- `AhbDiffRepository.getDiff` returns the repo-local `AhbDiffResult` (`repository/ahbDiff.ts:32-41`),
  **not** the client model `AhbDiff`. Ensure it's exported and used as the service type.

### Import-source hazard

There are two `AhbDiffSummary` and two `AhbDiff`-ish types: the repository ones
(`repository/ahbDiff.ts`) and ng-openapi-gen client models under
`src/app/core/api/models`. **Services must import the repository types**, never the
client models, or the types will silently diverge. (`Ahb` is the exception — the repo
itself imports `Ahb` from `../../app/core/api/models`, so the service uses that same one.)

### Proposed signatures

```ts
// service/validation.ts
export function assertPruefi(value: string): void; // throws ValidationError
export function assertFormatVersion(value: string): void; // throws ValidationError
export function parseFileType(format: string): FileType; // throws ValidationError

// service/ahb.service.ts
class AhbService {
  constructor(repository?: AHBRepository);
  getAhb(
    pruefi: string,
    formatVersion: string,
    format: string
  ): Promise<{ fileType: FileType; content: Ahb | Buffer }>; // Ahb from app/core/api/models
  searchAhbLines(payload: SearchPayload): Promise<SearchResult>; // types from repository/ahb
}

// service/ahbDiff.service.ts
class AhbDiffService {
  constructor(repository?: AhbDiffRepository);
  getDiff(pruefi: string, fvNew: string, fvOld: string): Promise<AhbDiffResult>; // repo type
  getSummary(fvNew: string, fvOld: string): Promise<AhbDiffSummary>; // repo type
}

// service/metadata.service.ts — thin delegators, validate fv where relevant
class MetadataService {
  listFormatVersions(): Promise<string[]>;
  listFormate(): Promise<string[]>;
  listDirections(): Promise<DirectionValues>;
  getDatenstand(): Promise<DatenstandResult>;
  listPruefisByFormatVersion(fv: string): Promise<PruefiWithName[]>; // now validates fv
}
```

Search payload validation currently lives inline in `search.ts` (page/pageSize are
positive numbers, sort is an array, q is a string). Move these checks into
`AhbService.searchAhbLines` before delegating to the repository.

## Controller shape after refactor (example: ahb)

```ts
public async get(req, res, next) {
  try {
    const { fileType, content } = await this.service.getAhb(
      req.params['pruefi'], req.params['formatVersion'],
      (req.query['format'] as string) || 'json',
    );
    res.status(200)
      .setHeader('Content-Type', CONTENT_TYPE[fileType])
      .setHeader('Content-Disposition',
        `attachment; filename=AHB_${req.params['formatVersion']}_${req.params['pruefi']}.${fileType}`);
    fileType === FileType.JSON ? res.json(content) : res.send(content);
  } catch (error) { next(error); }
}
```

`CONTENT_TYPE` is an HTTP-only lookup that stays in the controller (or an HTTP helper).

## Testing strategy

- **New:** `service/*.spec.ts` — own the validation and orchestration assertions moved
  out of the controller specs (invalid pruefi/fv → `ValidationError`, format mapping,
  search body validation, fv-validation now applied to `listPruefisByFormatVersion`).
- **Updated:** `controller/*.spec.ts` — shrink to "delegates to service and serializes
  correctly / sets right headers". Mock the service (same jest-mock pattern used today
  to mock repositories, e.g. `search.spec.ts`). Note this is a real rewrite, not a tweak:
  `search.spec.ts` currently `jest.mock('../repository/ahb')` and asserts the
  page/pageSize/sort/q validation cases (`:91-123`) — those validation assertions must be
  **relocated** to `ahb.service.spec.ts`, and the controller spec re-pointed to mock
  `AhbService` instead of `AHBRepository`.
- **Unchanged:** `repository/*.spec.ts`.
- Full `npm test` must stay green; no net loss of coverage. `npm run server:build`
  (tsc) and `npm run server:lint` must pass.

## Step-by-step execution

1. Add prerequisite exports: `SearchPayload`/`SearchResult` from `repository/ahb.ts`,
   `export` on `PruefiWithName` (`repository/formatVersion.ts`), confirm `AhbDiffResult`
   exported. Then add `service/validation.ts` + `service/validation.spec.ts`.
2. Add `AhbService` (getAhb + searchAhbLines) + spec. Rewire `ahb.ts` and `search.ts`
   controllers to delegate (both to `AhbService`); update their specs (relocate search
   validation cases into the service spec). Run tests.
3. Add `AhbDiffService` + spec. Rewire `ahbDiff.ts`; update spec. Run tests.
4. Add `MetadataService` + spec. Rewire `datenstand`, `formatVersion`, `formate`,
   `richtung` controllers; update specs. Run tests.
5. Full `npm test`, `npm run server:build`, `npm run server:lint`. Confirm no behavior
   change except the intentional `listPruefisByFormatVersion` fv-validation tightening.

## Out of scope (later rounds)

- The MCP server itself (transport choice: streamable HTTP on the same Express app vs.
  separate stdio process) and its tool definitions.
- **Auth0 for MCP** — the webapp authenticates client-side via `@auth0/auth0-angular`,
  but the REST API does **not** appear to validate tokens server-side today. Round 2
  will likely introduce shared JWT/JWKS validation middleware used by both the REST API
  and the MCP transport. Design TBD.
- Fixing CSV export.

```

```
