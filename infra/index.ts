import * as pulumi from "@pulumi/pulumi";
import * as resources from "@pulumi/azure-native/resources";
import * as storage from "@pulumi/azure-native/storage";
import * as web from "@pulumi/azure-native/web";

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

// MaKo-Prozesse is not deployed under this host yet, in any environment
// (see Hochfrequenz/mako_prozesse#65), so every stack - stage included - configures the
// intended production URL until the custom domain is live.
const makoProzesseBaseUrl = config.get("makoProzesseBaseUrl");
if (!makoProzesseBaseUrl) {
    throw new Error("makoProzesseBaseUrl must be set");
}

const dolmetscherBaseUrl = config.get("dolmetscherBaseUrl");
if (!dolmetscherBaseUrl) {
    throw new Error("dolmetscherBaseUrl must be set");
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
    // The *_BASE_URL settings below are passed for parity/documentation only and are NOT
    // read at runtime: start.sh builds with --configuration=$ENVIRONMENT, so the sibling-app
    // URLs are baked into the bundle from src/app/environments/*. Don't hunt for a consumer.
    { name: "BEDINGUNGSBAUM_BASE_URL", value: bedingungsbaumBaseUrl },
    { name: "EBD_BASE_URL", value: ebdBaseUrl },
    { name: "MAKO_PROZESSE_BASE_URL", value: makoProzesseBaseUrl },
    { name: "DOLMETSCHER_BASE_URL", value: dolmetscherBaseUrl },
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
