import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";
import * as azuread from "@pulumi/azuread";

// Import the program's configuration settings.
const config = new pulumi.Config();

const imageName = config.get("imageName");
const imageTag = config.get("imageTag");
if (!imageName) {
    throw new Error("imageName must be set");
}
if (!imageTag) {
    throw new Error("imageTag must be set");
}

const imageNameWithTag = `${imageName}:${imageTag}`;
const ghcrToken = config.requireSecret("ghcr_token");

const containerPort = config.getNumber("containerPort");
if (containerPort === undefined) {
    throw new Error("containerPort must be set");
}

const bedingungsbaumBaseUrl = config.get("bedingungsbaumBaseUrl");
if (!bedingungsbaumBaseUrl) {
    throw new Error("bedingungsbaumBaseUrl must be set");
}

const ebdBaseUrl = config.get("ebdBaseUrl");
if (!ebdBaseUrl) {
    throw new Error("ebdBaseUrl must be set");
}

const environment = config.get("environment");
if (!environment) {
    throw new Error("environment must be set");
}

const websitesContainerStartTimeLimit = config.get("websitesContainerStartTimeLimit");
if (!websitesContainerStartTimeLimit) {
    throw new Error("websitesContainerStartTimeLimit must be set");
}

const ohDearHealthCheckSecret = config.requireSecret("ohDearHealthCheckSecret");

const db7zArchivePassword = config.requireSecret("db_7z_archive_password");

// MCP server Auth0 configuration (optional). Set BOTH to protect the /mcp endpoint with
// Auth0; leave BOTH unset to run /mcp unauthenticated (the server logs a warning). The
// issuer is the shared tenant; the audience is the per-environment canonical /mcp URL
// (the Auth0 API identifier). Setting only one is a misconfiguration the server rejects.
const mcpAuth0IssuerBaseUrl = config.get("mcpAuth0IssuerBaseUrl");
const mcpAuth0Audience = config.get("mcpAuth0Audience");

// App Service Plan SKU configuration (see https://azure.microsoft.com/pricing/details/app-service/)
// Common SKUs: B1/B2/B3 (Basic), S1/S2/S3 (Standard), P1v2/P2v2/P3v2 (PremiumV2)
const appServicePlanSkuName = config.get("appServicePlanSkuName") || "B1";
const appServicePlanSkuTier = config.get("appServicePlanSkuTier") || "Basic";

// Get location from azure-native config
const azureConfig = new pulumi.Config("azure-native");
const location = azureConfig.get("location") || "germanywestcentral";

// Create an Azure Resource Group with environment name
const resourceGroupName = `ahb-tabellen-${environment}`;
const resourceGroup = new resources.ResourceGroup(resourceGroupName, {
    resourceGroupName: resourceGroupName,
    location: location,
});

// Create an Azure Storage Account
new storage.StorageAccount("ahbtabellen", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    sku: {
        name: storage.SkuName.Standard_LRS,
    },
    kind: storage.Kind.StorageV2,
});

// Create an App Service Plan
const appServicePlan = new web.AppServicePlan("ahb-tabellen-plan", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    kind: "Linux",
    reserved: true, // Required for Linux App Service Plans, see https://stackoverflow.com/questions/66520937/pulumi-azure-native-provider-azure-webapp-the-parameter-linuxfxversion-has-an
    sku: {
        name: appServicePlanSkuName,
        tier: appServicePlanSkuTier,
    },
});

// Base application settings for the container.
const appSettings = [
    { name: "DOCKER_REGISTRY_SERVER_URL", value: "https://ghcr.io" },
    { name: "DOCKER_REGISTRY_SERVER_USERNAME", value: "hf-krechan" }, // Provide GitHub username
    { name: "DOCKER_REGISTRY_SERVER_PASSWORD", value: ghcrToken }, // Provide GitHub token or PAT
    { name: "PORT", value: String(containerPort) },
    { name: "BEDINGUNGSBAUM_BASE_URL", value: bedingungsbaumBaseUrl },
    { name: "EBD_BASE_URL", value: ebdBaseUrl },
    { name: "ENVIRONMENT", value: environment },
    { name: "WEBSITES_CONTAINER_START_TIME_LIMIT", value: websitesContainerStartTimeLimit },
    { name: "OH_DEAR_HEALTH_CHECK_SECRET", value: ohDearHealthCheckSecret },
    { name: "DB_7Z_ARCHIVE_PASSWORD", value: db7zArchivePassword },
];

// Enable MCP authentication only when both values are configured for this stack.
if (mcpAuth0IssuerBaseUrl && mcpAuth0Audience) {
    appSettings.push(
        { name: "MCP_AUTH0_ISSUER_BASE_URL", value: mcpAuth0IssuerBaseUrl },
        { name: "MCP_AUTH0_AUDIENCE", value: mcpAuth0Audience },
    );
}

// --- Microsoft Entra ID app registrations (optional; gated on config). ---
// Provisions the two app registrations behind Microsoft (Entra) sign-in and the Copilot 365
// agent's access to the MCP endpoint:
//   (1) an MCP *resource* app exposing the delegated `access_as_user` scope (v2 access tokens),
//       whose client id is the audience the backend validates (MCP_ENTRA_AUDIENCE), and
//   (2) a *SPA* app whose client id the Angular build embeds (exported here for wiring into
//       src/app/environments/environment.<env>.ts).
// The azuread provider must be authenticated with Directory-write permissions (separate from the
// azure-native service principal — see infra/README.md). Leave `entraTenantId` UNSET to skip the
// whole block, so `pulumi preview` behaves exactly as before on stacks that haven't opted in.
let entraSpaClientId: pulumi.Output<string> | undefined;
let entraMcpResourceClientId: pulumi.Output<string> | undefined;

const entraTenantId = config.get("entraTenantId");
if (entraTenantId) {
    const appBaseUrl = config.get("appBaseUrl");
    if (!appBaseUrl) {
        throw new Error("appBaseUrl must be set when entraTenantId is configured (used for the SPA redirect URI).");
    }

    // Sanity check: the app registrations are provisioned into whatever tenant the azuread
    // provider credentials target, while MCP_ENTRA_TENANT_ID drives runtime token validation. If
    // entraTenantId drifts from the Azure deployment tenant, the registrations and the validator
    // can end up in different tenants and Entra sign-in fails at runtime. Warn (don't fail — the
    // azuread creds may legitimately target a different tenant than azure-native).
    const azureTenantId = azureConfig.get("tenantId");
    if (azureTenantId && azureTenantId !== entraTenantId) {
        pulumi.log.warn(
            `entraTenantId (${entraTenantId}) differs from azure-native:tenantId (${azureTenantId}). ` +
            `Ensure the azuread provider credentials operate in the entraTenantId tenant, otherwise ` +
            `the app registrations and MCP_ENTRA_TENANT_ID validation will target different tenants.`,
        );
    }

    // Stable identifier for the exposed delegated scope — must not change across deploys.
    const ACCESS_AS_USER_SCOPE_ID = "6b3f8f7a-6c1e-4c9a-9b2d-9e0a1f2b3c4d";

    // (1) MCP resource server app: exposes api://<clientId>/access_as_user, issues v2 tokens.
    const mcpApp = new azuread.Application(`ahb-tabellen-mcp-${environment}`, {
        displayName: `ahb-tabellen-mcp-${environment}`,
        signInAudience: "AzureADMyOrg", // single tenant
        api: {
            requestedAccessTokenVersion: 2,
            oauth2PermissionScopes: [{
                id: ACCESS_AS_USER_SCOPE_ID,
                value: "access_as_user",
                type: "User",
                enabled: true,
                adminConsentDisplayName: "Access AHB-Tabellen MCP",
                adminConsentDescription: "Allow the app to access the AHB-Tabellen MCP tools as the signed-in user.",
                userConsentDisplayName: "Access AHB-Tabellen MCP",
                userConsentDescription: "Allow the app to access the AHB-Tabellen MCP tools on your behalf.",
            }],
        },
    });

    // Clients REQUEST the scope api://<clientId>/access_as_user, so the app needs that identifier
    // URI. Added as a separate resource to avoid a self-cycle on the application's clientId. Note
    // this api:// URI is NOT the token audience the backend validates — see MCP_ENTRA_AUDIENCE below.
    const mcpIdentifierUri = pulumi.interpolate`api://${mcpApp.clientId}`;
    new azuread.ApplicationIdentifierUri(`ahb-tabellen-mcp-${environment}-uri`, {
        applicationId: mcpApp.id,
        identifierUri: mcpIdentifierUri,
    });

    new azuread.ServicePrincipal(`ahb-tabellen-mcp-${environment}-sp`, {
        clientId: mcpApp.clientId,
    });

    // (2) SPA app registration: gating-only login, so no API permission is required here.
    const spaApp = new azuread.Application(`ahb-tabellen-spa-${environment}`, {
        displayName: `ahb-tabellen-spa-${environment}`,
        signInAudience: "AzureADMyOrg",
        singlePageApplication: {
            // Trim a trailing slash so a configured "https://host/" can't yield a double-slash
            // redirect URI that won't match what MSAL sends.
            redirectUris: [`${appBaseUrl.replace(/\/+$/, "")}/auth/msal-callback`],
        },
    });
    new azuread.ServicePrincipal(`ahb-tabellen-spa-${environment}-sp`, {
        clientId: spaApp.clientId,
    });

    // MCP_ENTRA_AUDIENCE is the token `aud` the backend validates. For v2 access tokens
    // (requestedAccessTokenVersion: 2) the aud is the resource app's client-id GUID — NOT the
    // api://<clientId> URI, which is only what clients request as the scope. (See the decoded v2
    // token example at https://learn.microsoft.com/entra/identity-platform/access-tokens.)
    appSettings.push(
        { name: "MCP_ENTRA_TENANT_ID", value: entraTenantId },
        { name: "MCP_ENTRA_AUDIENCE", value: mcpApp.clientId },
    );

    entraSpaClientId = spaApp.clientId;
    entraMcpResourceClientId = mcpApp.clientId;
}

// Create a Web App
const webApp = new web.WebApp("ahb-tabellen", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    serverFarmId: appServicePlan.id,
    siteConfig: {
        appSettings: appSettings,
        linuxFxVersion: `DOCKER|${imageNameWithTag}`,
    },
});

// Export the endpoint of the web app
export const endpoint = webApp.defaultHostName;

// Entra app-registration outputs (undefined unless `entraTenantId` is configured). The SPA
// client id must be copied into src/app/environments/environment.<env>.ts (entraClientId); the
// backend consumes the MCP resource client id as MCP_ENTRA_AUDIENCE automatically (above).
export const entraSpaClientIdOutput = entraSpaClientId;
export const entraMcpResourceClientIdOutput = entraMcpResourceClientId;
