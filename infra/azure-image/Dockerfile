# check=skip=InvalidDefaultArgInFrom,FromPlatformFlagConstDisallowed
# ^ A parser directive, so it has to be the very first line — before even a comment, or it is
# silently ignored. Both checks fire on this file by design: APP_IMAGE deliberately has no
# default, and the constant --platform is the point rather than an oversight. Reasons below.

# The Azure variant of the application image: the published image, plus the database.
#
# TRANSITIONAL. Azure App Service has no volume to seed the database into and no per-deployment
# place to point AHB_DB_PATH at, so the slim image from ../../Dockerfile cannot run there — it
# exits at startup with no database (Hochfrequenz/ahb-tabellen#985). This file bakes the database
# back in for Azure alone, so the App Service keeps serving hochfrequenz.de while the Compose
# stacks in Hochfrequenz/hf-apps-collection take over. It dies with the rest of infra/.
#
# Deliberately derived FROM the already-published application image rather than rebuilding it:
# the Azure image is then provably the same code as the one the Compose stacks run, costs one
# extra layer instead of a second Angular build, and cannot drift from it.
#
# The build context is this directory, which holds nothing but this file — both inputs are images.

# The database, published by the repository that produces the data. Pinned by digest as well as
# tag, because a tag is mutable and this is licensed data that must not be silently replaced.
# Keep in step with the ahb-tabellen-db seed job in hf-apps-collection, so Azure and the Compose
# stacks serve the same dataset.
ARG DB_IMAGE=ghcr.io/hochfrequenz/xml-migs-and-ahbs:v2026.08.06.0@sha256:fb8dcf1c1471fc100d0cb4b9360a7ea7f6d95e8eb5d09936442d068f72c489a9

# The application image built earlier in this run. No default on purpose: a build against a
# floating `latest` would produce an Azure image nobody can trace back to a release.
ARG APP_IMAGE

# Pinned to amd64 for the same reason as the stage below, and so a build on an arm64 machine does
# not warn about a platform mismatch it cannot avoid. Only a data file is copied out of here, so
# the architecture of this stage never actually matters.
FROM --platform=linux/amd64 ${DB_IMAGE} AS ahb-db

# --platform is load-bearing, not boilerplate. The App Service plan is Linux/amd64 and the
# application image is published for amd64 alone, so without it a build on an arm64 machine (any
# Apple Silicon laptop, or an arm GitHub runner) fails to resolve the base image at all:
# "no match for platform in manifest". Pinning it also keeps the image we ship to Azure
# independent of whatever the builder happens to be.
FROM --platform=linux/amd64 ${APP_IMAGE}

# With AHB_DB_PATH unset, src/server/infrastructure/database.ts resolves the database relative to
# the working directory — which is exactly what App Service can give us: no mount, no extra app
# setting. WORKDIR is /service in the base image; the destination is spelled out absolutely so a
# WORKDIR change upstream cannot quietly move the database out from under the server.
#
# No --chown: the file arrives 0444 and COPY preserves the mode, so the unprivileged `nodejs`
# user reads it without us rewriting a gigabyte into a fresh layer. The parent directories COPY
# creates are 0755, so they can be traversed.
COPY --from=ahb-db /db/ahb.db /service/src/server/data/ahb.db
