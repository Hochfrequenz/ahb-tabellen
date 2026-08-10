# Auth0 as code (Pulumi)

Manages the Auth0 tenant `auth.hochfrequenz.de` declaratively so that **no one
has to click in the Auth0 dashboard** and every change is reviewed via PR.

Tracked in [#903](https://github.com/Hochfrequenz/ahb-tabellen/issues/903).

- **Provider:** [`@pulumi/auth0`](https://www.pulumi.com/registry/packages/auth0/)
- **Stack:** `shared` (single stack — the tenant is shared across prod/stage/dev,
  unlike the Azure `../` project which uses per-env `stage`/`prod` stacks)
- **Backend:** Pulumi Cloud (same as the Azure project)

## Scope (phase 1)

- SPA clients: prod + shared stage/dev
- MCP API resource servers: prod + stage audiences

Out of scope for now: tenant settings, connections, Actions/Rules, roles & RBAC.

## One-time setup

1. **Create a Management M2M app** in Auth0 named e.g. `Pulumi Management`,
   authorized for the Auth0 Management API with (at least) these scopes:
   `read:clients`, `update:clients`, `create:clients`,
   `read:resource_servers`, `update:resource_servers`, `create:resource_servers`,
   `read:client_grants`, `update:client_grants`.
   Trim to what is actually needed.

2. **Configure credentials** (local):

   ```bash
   cd infra/auth0
   npm install
   pulumi stack select shared   # or: pulumi stack init shared
   pulumi config set auth0:domain auth.hochfrequenz.de
   pulumi config set auth0:clientId <PULUMI_MGMT_M2M_CLIENT_ID>
   pulumi config set --secret auth0:clientSecret <PULUMI_MGMT_M2M_CLIENT_SECRET>
   ```

3. **Mirror to CI**: add a GitHub Actions secret so `deploy-auth0.yml` can run.
   The workflow reads `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`
   from repo secrets, plus the existing `PULUMI_ACCESS_TOKEN`.

## Importing the existing (live) resources

These resources already serve live logins — **import, never recreate**.

1. Find the resource IDs in the Auth0 dashboard (client IDs; for resource
   servers the API id is `<resource-server-id>`, not the audience URL).
2. Import each into the `shared` stack, e.g.:

   ```bash
   pulumi import auth0:index/client:Client ahb-tabellen-prod-spa      VSkXGqlTD7Rf5Q4n9a0h00rInEyL2ZQj
   pulumi import auth0:index/client:Client ahb-tabellen-stage-dev-spa Hku0EniRjy4B2krnx1sCwTIOzAiVta1B
   pulumi import auth0:index/resourceServer:ResourceServer ahb-tabellen-mcp-prod  <resource-server-id>
   pulumi import auth0:index/resourceServer:ResourceServer ahb-tabellen-mcp-stage <resource-server-id>
   ```

3. Reconcile `index.ts` with the imported state until:

   ```bash
   pulumi preview
   ```

   shows **no changes** (in particular **zero replacements/deletions**). This is
   the hard gate — do not merge until the preview is clean.

## Day-to-day

- Change `index.ts`, open a PR. CI posts a `pulumi preview` as a PR comment.
- On merge to `main`, CI runs `pulumi up`.
- Never edit managed resources in the Auth0 dashboard — change the code instead.
