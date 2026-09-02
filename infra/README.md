# Pulumi

Pulumi is a modern infrastructure as code tool that allows you to create, deploy, and manage infrastructure on any cloud using your favorite language.

We chose TypeScript.

## Requirements

You need to have the following tools installed on your machine:

- [Pulumi](https://www.pulumi.com/docs/get-started/install/)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Node.js](https://nodejs.org/)

## Setup

Install the dependencies:

```bash
npm install
```

## Regular Used Commands

Before you start you need to login to your pulumi account and your cloud provider.

### Login

Use the following commands to login to your pulumi account and Azure.

#### Pulumi Login

```bash
pulumi login
```

#### Azure Login

```bash
az login
```

### Apply Pulumi Changes

To apply the changes to your infrastructure use the following command.
Don't be afraid to use, it will show you the changes before applying them.

```bash
pulumi up
```

### Destroy Pulumi Resources

```bash
pulumi destroy
```

### Config Commands

#### Set Config Values

```bash
pulumi config set key value
```

#### Set Secret Config

```bash
pulumi config set --secret key value
```

#### Get Config Values

```bash
pulumi config get key
```

#### Remove Config Values

```bash
pulumi config rm key
```

### Stack Commands

#### List Stacks

```bash
pulumi stack ls
```

#### Remove a stack

```bash
pulumi stack rm
```

#### Select a stack

```bash
pulumi stack select
```

#### Get Stack Outputs

```bash
pulumi stack output
```

## Microsoft Entra ID app registrations (optional)

`index.ts` can provision the two Entra ID app registrations behind Microsoft (Entra) sign-in and
the Copilot 365 agent's access to the MCP endpoint (see #951):

1. **MCP resource app** — exposes the delegated `api://<clientId>/access_as_user` scope and issues
   **v2** access tokens. Its client id is injected into the container as `MCP_ENTRA_AUDIENCE`
   (the audience the backend validates), alongside `MCP_ENTRA_TENANT_ID`.
2. **SPA app** — for the Angular login; redirect URI `<appBaseUrl>/auth/msal-callback`. Its client
   id is exported (see below) and must be copied into `src/app/environments/environment.<env>.ts`
   as `entraClientId` (with `entraAuthority` = `https://login.microsoftonline.com/<tenantId>`),
   because Angular embeds it at build time.

### Prerequisite: the `azuread` provider must be authenticated

Unlike the `azure-native` resources (deployment service principal), the `azuread` provider needs a
principal with **Directory-write** permissions (e.g. the Graph app role `Application.ReadWrite.OwnedBy`).
Authenticate it via `az login` (a user/SP with those permissions) or `ARM_*` / `AZURE_*` env vars.
**Whoever holds those credentials must run `pulumi up` for this block** — it is intentionally left
out of the per-PR `pulumi preview` unless enabled.

### Enable it

The block is **skipped entirely** until `entraTenantId` is set, so stacks that haven't opted in
preview and deploy exactly as before. To enable for a stack:

```bash
pulumi config set entraTenantId fb2b0361-fa12-48a5-bade-533bf89760d9   # the Entra/Azure tenant
pulumi config set appBaseUrl https://ahb-tabellen.stage.hochfrequenz.de # for the SPA redirect URI
pulumi up   # requires the azuread provider credentials described above
```

Then wire the exported SPA client id into the Angular environment and redeploy:

```bash
pulumi stack output entraSpaClientIdOutput        # → environment.<env>.ts: entraClientId
pulumi stack output entraMcpResourceClientIdOutput # informational; already injected as MCP_ENTRA_AUDIENCE
```
