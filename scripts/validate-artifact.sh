#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

worker="${SITES_PROJECT_ROOT}/dist/server/index.js"
hosting="${SITES_PROJECT_ROOT}/dist/.openai/hosting.json"
sitemap="${SITES_PROJECT_ROOT}/dist/client/sitemap.xml"
robots="${SITES_PROJECT_ROOT}/dist/client/robots.txt"

[[ -f "${worker}" ]] || {
  echo "Missing Sites Worker entry: dist/server/index.js" >&2
  exit 66
}
[[ -f "${hosting}" ]] || {
  echo "Missing packaged Sites manifest: dist/.openai/hosting.json" >&2
  exit 66
}
[[ -f "${sitemap}" ]] || {
  echo "Missing packaged sitemap: dist/client/sitemap.xml" >&2
  exit 66
}
[[ -f "${robots}" ]] || {
  echo "Missing packaged crawler policy: dist/client/robots.txt" >&2
  exit 66
}

node --input-type=module - "${worker}" "${hosting}" "${sitemap}" "${robots}" <<'NODE'
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const [workerPath, hostingPath, sitemapPath, robotsPath] = process.argv.slice(2);
JSON.parse(await readFile(hostingPath, "utf8"));

const sitemap = await readFile(sitemapPath, "utf8");
if (!sitemap.includes("<loc>https://bravero.ai/</loc>")) {
  throw new Error("Sitemap does not contain the canonical Bravero URL");
}

const robots = await readFile(robotsPath, "utf8");
if (!robots.includes("Sitemap: https://bravero.ai/sitemap.xml")) {
  throw new Error("Crawler policy does not reference the Bravero sitemap");
}

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);
if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error("dist/server/index.js must have an ESM default export with fetch(request, env, ctx)");
}
NODE

echo "Validated Sites artifact: ESM Worker default.fetch and hosting manifest are present."
