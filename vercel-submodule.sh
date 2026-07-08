#!/usr/bin/env bash
set -euo pipefail

# Vercel cannot natively clone PRIVATE git submodules (the build environment has
# no credentials for github.com/cohesive-dev/cohesive-insurance-crm-prisma).
#
# This script injects a read-only token into the submodule URL and checks the
# submodule out, so `prisma generate` (run by `npm run build`) can find
# prisma/schema.prisma. It runs BEFORE the framework build via the Vercel
# "Build Command" override:  bash vercel-submodule.sh && npm run build
#
# Requires the GH_ACCESS_TOKEN env var (a fine-grained PAT with read-only
# access to the prisma submodule repo) set in Vercel Project Settings.

if [ -z "${GH_ACCESS_TOKEN:-}" ]; then
  echo "Error: GH_ACCESS_TOKEN is not set." >&2
  exit 1
fi

# Rewrite the submodule URL to inject the token, sync it into .git/config, then
# fetch. The token is only written into the ephemeral build workspace.
sed -i "s|https://github.com/|https://${GH_ACCESS_TOKEN}@github.com/|g" .gitmodules

git submodule sync
git submodule update --init --recursive

echo "Submodules checked out."
