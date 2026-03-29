"""
Auth0 configuration for ahb-tabellen.

Manages:
- Database Connection (username/password login)
- Azure AD SSO connections (multi-tenant, data-driven from Pulumi config)
- ConnectionClient bindings to enable connections on Auth0 applications
"""

import json
from typing import Any

import pulumi
import pulumi_auth0 as auth0

# Auth0 Application Client IDs
AUTH0_CLIENT_ID_PROD = "VSkXGqlTD7Rf5Q4n9a0h00rInEyL2ZQj"
AUTH0_CLIENT_ID_DEV_STAGE = "Hku0EniRjy4B2krnx1sCwTIOzAiVta1B"

ALL_CLIENT_IDS = [AUTH0_CLIENT_ID_PROD, AUTH0_CLIENT_ID_DEV_STAGE]


def configure_auth0() -> None:
    """
    Set up Auth0 connections and bind them to applications.

    Reads Azure AD tenant configurations from Pulumi config key 'auth0Tenants'
    (JSON list) and creates one Azure AD connection per tenant.
    """
    config = pulumi.Config()

    # --- Database Connection (username/password) ---
    db_connection = auth0.Connection(
        "db-connection",
        name="Username-Password-Authentication",
        strategy="auth0",
        options=auth0.ConnectionOptionsArgs(
            password_policy="good",
            brute_force_protection=True,
            requires_username=False,
        ),
    )

    # Enable database connection on both applications
    for i, client_id in enumerate(ALL_CLIENT_IDS):
        auth0.ConnectionClient(
            f"db-connection-client-{i}",
            connection_id=db_connection.id,
            client_id=client_id,
        )

    # --- Azure AD SSO Connections (multi-tenant, data-driven) ---
    tenants_json = config.get("auth0Tenants") or "[]"
    tenants: list[dict[str, Any]] = json.loads(tenants_json)

    for tenant in tenants:
        tenant_name = tenant["name"]
        assert tenant_name, "Each Auth0 tenant config must have a 'name'"

        domain = tenant["domain"]
        tenant_domain = tenant["tenantDomain"]
        client_id = tenant["clientId"]
        client_secret = tenant["clientSecret"]

        resource_name = f"azure-ad-{tenant_name.lower()}"

        ad_connection = auth0.Connection(
            resource_name,
            name=f"azure-ad-{tenant_name.lower()}",
            strategy="waad",
            options=auth0.ConnectionOptionsArgs(
                domain=domain,
                tenant_domain=tenant_domain,
                client_id=client_id,
                client_secret=client_secret,
                waad_protocol="openid-connect",
                use_wsfed=False,
                api_enable_users=True,
                # Request basic profile and email scopes
                scopes=["openid", "profile", "email"],
                set_user_root_attributes="on_each_login",
                should_trust_email_verification_connection="always_set_emails_as_verified",
            ),
        )

        # Enable this AD connection on both applications
        for j, app_client_id in enumerate(ALL_CLIENT_IDS):
            auth0.ConnectionClient(
                f"{resource_name}-client-{j}",
                connection_id=ad_connection.id,
                client_id=app_client_id,
            )

    pulumi.export("auth0_db_connection_id", db_connection.id)
