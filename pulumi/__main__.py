"""
Pulumi program that deploys a containerized web service to Azure Container Instances.
"""

import pulumi_azure_native as azure_native
import pulumi

# Import the program's configuration settings.
config = pulumi.Config()

image_name = config.get("imageName")
image_tag = config.get("imageTag")
assert image_name, "imageName must be set"
assert image_tag, "imageTag must be set"

image_name_with_tag = f"{image_name}:{image_tag}"
ghcr_token = config.require_secret("ghcr_token")
assert ghcr_token, "ghcr_token must be set"

container_port = config.get_int("containerPort")
assert container_port, "containerPort must be set"

bedingungsbaum_base_url = config.get("bedingungsbaumBaseUrl")
assert bedingungsbaum_base_url, "bedingungsbaumBaseUrl must be set"

ebd_base_url = config.get("ebdBaseUrl")
assert ebd_base_url, "ebdBaseUrl must be set"

environment = config.get("environment")
assert environment, "environment must be set"

websites_container_start_time_limit = config.get("websitesContainerStartTimeLimit")
assert websites_container_start_time_limit, "websitesContainerStartTimeLimit must be set"

oh_dear_health_check_secret = config.require_secret("ohDearHealthCheckSecret")
assert oh_dear_health_check_secret, "ohDearHealthCheckSecret must be set"

db_7z_archive_password = config.require_secret("db_7z_archive_password")
assert db_7z_archive_password, "db_7z_archive_password must be set"

# App Service Plan SKU configuration (see https://azure.microsoft.com/pricing/details/app-service/)
# Common SKUs: B1/B2/B3 (Basic), S1/S2/S3 (Standard), P1v2/P2v2/P3v2 (PremiumV2)
app_service_plan_sku_name = config.get("appServicePlanSkuName") or "B1"
app_service_plan_sku_tier = config.get("appServicePlanSkuTier") or "Basic"

# Get location from azure-native config
azure_config = pulumi.Config("azure-native")
location = azure_config.get("location") or "germanywestcentral"

# Create an Azure Resource Group with environment name
resource_group_name = f"ahb-tabellen-{environment}"
resource_group = azure_native.resources.ResourceGroup(
    resource_group_name,
    resource_group_name=resource_group_name,
    location=location
)

# Create an Azure Storage Account
storage_account = azure_native.storage.StorageAccount(
    "ahbtabellen",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    sku=azure_native.storage.SkuArgs(
        name=azure_native.storage.SkuName.STANDARD_LRS,
    ),
    kind=azure_native.storage.Kind.STORAGE_V2,
)

# Create an App Service Plan
app_service_plan = azure_native.web.AppServicePlan(
    "ahb-tabellen-plan",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    kind="Linux",
    reserved=True,  # Required for Linux App Service Plans, see https://stackoverflow.com/questions/66520937/pulumi-azure-native-provider-azure-webapp-the-parameter-linuxfxversion-has-an
    sku=azure_native.web.SkuDescriptionArgs(
        name=app_service_plan_sku_name,
        tier=app_service_plan_sku_tier,
    ),
)

# Create a Web App
web_app = azure_native.web.WebApp(
    "ahb-tabellen",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    server_farm_id=app_service_plan.id,
    site_config=azure_native.web.SiteConfigArgs(
        app_settings=[
            azure_native.web.NameValuePairArgs(
                name="DOCKER_REGISTRY_SERVER_URL", value="https://ghcr.io"
            ),
            azure_native.web.NameValuePairArgs(
                name="DOCKER_REGISTRY_SERVER_USERNAME", value="hf-krechan"
            ),  # Provide GitHub username
            azure_native.web.NameValuePairArgs(
                name="DOCKER_REGISTRY_SERVER_PASSWORD", value=ghcr_token
            ),  # Provide GitHub token or PAT
            azure_native.web.NameValuePairArgs(name="PORT", value=str(container_port)),
            azure_native.web.NameValuePairArgs(
                name="BEDINGUNGSBAUM_BASE_URL", value=bedingungsbaum_base_url
            ),
            azure_native.web.NameValuePairArgs(
                name="EBD_BASE_URL", value=ebd_base_url
            ),
            azure_native.web.NameValuePairArgs(name="ENVIRONMENT", value=environment),
            azure_native.web.NameValuePairArgs(name="WEBSITES_CONTAINER_START_TIME_LIMIT", value=websites_container_start_time_limit),
            azure_native.web.NameValuePairArgs(name="OH_DEAR_HEALTH_CHECK_SECRET", value=oh_dear_health_check_secret),
            azure_native.web.NameValuePairArgs(name="DB_7Z_ARCHIVE_PASSWORD", value=db_7z_archive_password),
        ],
        linux_fx_version=f"DOCKER|{image_name_with_tag}",
    ),
)

# Export the endpoint of the web app
pulumi.export("endpoint", web_app.default_host_name)
