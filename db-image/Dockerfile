# The AHB database, shipped as its own versioned image.
#
# Why a separate image rather than a file inside the application image:
#
#   - The application image rebuilds on every release; the database changes a few times a year.
#     Keeping them apart means a code release does not push or pull ~1.1 GB.
#   - A database update becomes a digest bump in a compose file — reviewed, promotable from stage
#     to production, and revertible — exactly like any other image (ADR-0014 in
#     Hochfrequenz/hf-apps-collection).
#   - The application container can then run `read_only: true` with the database on a volume it
#     mounts `:ro`.
#
# The image is a seed job, not a server: its entrypoint copies the database into /data and exits.
#
# Build context is a directory containing the decrypted `ahb.db`; see
# .github/workflows/publish-db-image.yml.
FROM alpine:3.23

# Names the database release, e.g. v2026.08.06.0. Written to /db/VERSION, which is what the seed
# script compares against the volume to decide whether there is anything to do.
ARG DB_VERSION
RUN test -n "${DB_VERSION}" || (echo "DB_VERSION build-arg is required" >&2; exit 1)

# `--chmod` on the COPY, never a later `RUN chmod`: changing a file's mode in a following layer
# forces an overlayfs copy-up, and Docker tars the WHOLE file into that layer — so the database
# would ship twice. Measured with a 40 MB stand-in: 88.7 MB with `RUN chmod` against 48.7 MB with
# `--chmod`. At ~1.1 GB that is a wasted gigabyte in every pull and on every host.
COPY --chmod=0444 ahb.db /db/ahb.db
COPY --chmod=0555 seed-ahb-db.sh /usr/local/bin/seed-ahb-db

# VERSION is created here rather than copied in, so its layer costs only its own few bytes.
RUN printf '%s\n' "${DB_VERSION}" > /db/VERSION && chmod 0444 /db/VERSION

# Runs as root, deliberately: a freshly created Docker volume is owned by root, and a job that
# cannot write to it is no use. The exposure is small — no network, no ports, no listening
# process, and the stack still applies `cap_drop: ALL` and `no-new-privileges`. The files it
# writes are 0444, so the application reads them as its own unprivileged user.
CMD ["seed-ahb-db"]
