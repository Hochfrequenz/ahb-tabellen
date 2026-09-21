#!/bin/sh
#
# Copy the AHB database from this image into the volume mounted at /data, unless the volume
# already holds this exact version.
#
# Runs as a one-shot compose service that the application waits on
# (`condition: service_completed_successfully`). On an unchanged deployment it does nothing and
# exits within milliseconds; it only moves ~1.1 GB when the data image itself has been bumped.
set -eu

SRC_DIR=/db
DEST_DIR=/data

version="$(cat "$SRC_DIR/VERSION")"

if [ -f "$DEST_DIR/VERSION" ] && cmp -s "$SRC_DIR/VERSION" "$DEST_DIR/VERSION"; then
  echo "AHB database ${version} is already seeded in ${DEST_DIR}; nothing to do."
  exit 0
fi

echo "Seeding AHB database ${version} into ${DEST_DIR} ..."

# Clear the marker before touching anything else. If this run is killed halfway, the next one
# must seed again rather than trust a database it cannot vouch for.
rm -f "$DEST_DIR/VERSION" "$DEST_DIR/ahb.db.tmp"

# Copy to a temporary name and rename: a rename within one filesystem is atomic, so the
# application can never open a half-written database.
cp "$SRC_DIR/ahb.db" "$DEST_DIR/ahb.db.tmp"
chmod 0444 "$DEST_DIR/ahb.db.tmp"
mv "$DEST_DIR/ahb.db.tmp" "$DEST_DIR/ahb.db"

cp "$SRC_DIR/VERSION" "$DEST_DIR/VERSION"
chmod 0444 "$DEST_DIR/VERSION"

echo "Seeded AHB database ${version}."
