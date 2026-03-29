# Auth0 Infrastructure Setup

This document describes the manual prerequisites and configuration steps required
before `pulumi up` can manage Auth0 resources for ahb-tabellen.

## Overview

The Pulumi program manages:
- A **Database Connection** (username/password login via Auth0)
- **Azure AD SSO connections** (one per customer tenant, data-driven from config)
- **ConnectionClient** bindings that enable each connection on the prod and dev/stage Auth0 applications

Auth0 domain: `auth.hochfrequenz.de`

## Prerequisites

### 1. Auth0 Machine-to-Machine (M2M) Application

Create an M2M application in Auth0 that Pulumi uses to call the Management API:

1. Go to Auth0 Dashboard > Applications > Create Application
2. Choose "Machine to Machine Applications"
3. Authorize it for the **Auth0 Management API** with the following scopes:
   - `create:connections`
   - `read:connections`
   - `update:connections`
   - `delete:connections`
   - `create:connection_clients`
   - `read:connection_clients`
   - `update:connection_clients`
   - `delete:connection_clients`
4. Note the **Domain**, **Client ID**, and **Client Secret** of this M2M app.

### 2. Auth0 Provider Configuration

Set the Auth0 provider credentials as environment variables or Pulumi config:

```bash
# Option A: Environment variables (recommended for CI)
export AUTH0_DOMAIN="auth.hochfrequenz.de"
export AUTH0_CLIENT_ID="<M2M app client ID>"
export AUTH0_CLIENT_SECRET="<M2M app client secret>"

# Option B: Pulumi config
pulumi config set auth0:domain auth.hochfrequenz.de
pulumi config set auth0:clientId <M2M app client ID>
pulumi config set auth0:clientSecret <M2M app client secret> --secret
```

### 3. Azure App Registration per Customer (for AD SSO)

For each customer that needs Azure AD SSO, create an App Registration in their
Azure Entra ID tenant:

1. In the customer's Azure Portal > Entra ID > App Registrations > New Registration
2. Set redirect URI to: `https://auth.hochfrequenz.de/login/callback`
3. Under "Certificates & Secrets", create a Client Secret
4. Under "API Permissions", grant `User.Read` (delegated)
5. Note the **Application (client) ID** and **Client Secret**

## Adding a New Customer AD Tenant

1. Create an Azure App Registration in the customer's Entra ID (see above).

2. Add the tenant to the Pulumi config. The `auth0Tenants` config key holds a
   JSON array of tenant objects:

   ```bash
   # Read current value, add the new tenant, then set it again:
   pulumi config set auth0Tenants '[
     {
       "name": "Hochfrequenz",
       "domain": "hochfrequenz.de",
       "tenantDomain": "hochfrequenz.onmicrosoft.com",
       "clientId": "<app-registration-client-id>",
       "clientSecret": "<app-registration-client-secret>"
     },
     {
       "name": "NewCustomer",
       "domain": "newcustomer.de",
       "tenantDomain": "newcustomer.onmicrosoft.com",
       "clientId": "<app-registration-client-id>",
       "clientSecret": "<app-registration-client-secret>"
     }
   ]' --secret
   ```

   Each tenant object requires:
   | Field          | Description                                      |
   |----------------|--------------------------------------------------|
   | `name`         | Human-readable name (used as Pulumi resource ID) |
   | `domain`       | The customer's email domain (e.g. `example.de`)  |
   | `tenantDomain` | Azure AD tenant domain (`*.onmicrosoft.com`)     |
   | `clientId`     | App Registration client ID                       |
   | `clientSecret` | App Registration client secret                   |

3. Run `pulumi preview` to verify, then `pulumi up` to apply.

## Auth0 Application Client IDs

| Environment | Client ID                            |
|-------------|--------------------------------------|
| Production  | `VSkXGqlTD7Rf5Q4n9a0h00rInEyL2ZQj`  |
| Dev / Stage | `Hku0EniRjy4B2krnx1sCwTIOzAiVta1B`  |

These are the existing Auth0 SPA applications. The Pulumi program enables each
connection on both applications via `ConnectionClient` resources.

## Importing Existing Resources

If the Database Connection already exists in Auth0, import it:

```bash
pulumi import auth0:index/connection:Connection db-connection <connection-id>
```

You can find connection IDs in the Auth0 Dashboard under Authentication > Database.
