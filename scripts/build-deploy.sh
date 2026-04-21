#!/bin/bash
# Build the Vite bundle locally and stage it under ./deploy for Databricks
# Apps. The Apps build environment cannot reach the internal npm proxy, so
# we never run `npm install` inside Apps — only the pre-built `dist/` plus
# a zero-dep stdlib server get uploaded.
#
# Usage: ./scripts/build-deploy.sh  (then: databricks bundle deploy -t dev)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ building with vite…"
npm run build

echo "→ staging ./deploy/"
rm -rf deploy
mkdir -p deploy

cp -R dist deploy/dist
cp server.mjs deploy/
cp app.yaml deploy/

# Intentionally NO package.json in deploy/. The Apps runtime interprets
# its presence as "Node project, run npm install", which (a) fails because
# the npm proxy isn't reachable from the Apps build env and (b) tries to
# rewrite a stale node_modules cache left over from earlier deploys.
# Without package.json the runtime logs:
#   "No dependencies file found. Skipping installation."
# and goes straight to the command in app.yaml.  server.mjs is ESM by
# file extension — no package.json needed.

echo "→ deploy/ is ready:"
ls -la deploy/
echo
echo "Next: databricks bundle deploy -t dev -p fieldeng"
echo "Then: databricks apps deploy graphs-rag-slides \\"
echo "        --source-code-path /Workspace/Users/\$USER_EMAIL/.bundle/graphs-analytics-and-rag-slides/dev/files/deploy \\"
echo "        -p fieldeng"
