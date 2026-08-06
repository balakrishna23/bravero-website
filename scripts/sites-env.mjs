import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const runtimeRoot = process.env.SITES_RUNTIME_ROOT || path.join(projectRoot, ".sites-runtime");

for (const dir of [
  path.join(runtimeRoot, "home"),
  path.join(runtimeRoot, "npm-cache"),
  path.join(runtimeRoot, "xdg-config"),
  path.join(runtimeRoot, "tmp"),
  path.join(runtimeRoot, "wrangler", "logs"),
]) {
  mkdirSync(dir, { recursive: true });
}

export function createSitesEnv(extraEnv = {}) {
  const vitePatchPath = path
    .join(projectRoot, "scripts", "vite-windows-patch.cjs")
    .replaceAll("\\", "/");
  const nodeOptionsParts = [
    process.env.NODE_OPTIONS,
    process.platform === "win32"
      ? `--require=${vitePatchPath}`
      : "",
  ].filter(Boolean);

  const env = {
    ...process.env,
    ...extraEnv,
    SITES_ENV_READY: "1",
    SITES_PROJECT_ROOT: projectRoot,
    HOME: path.join(runtimeRoot, "home"),
    XDG_CONFIG_HOME: path.join(runtimeRoot, "xdg-config"),
    TMPDIR: path.join(runtimeRoot, "tmp"),
    WRANGLER_WRITE_LOGS: "false",
    WRANGLER_LOG_PATH: path.join(runtimeRoot, "wrangler", "logs"),
    MINIFLARE_REGISTRY_PATH: path.join(runtimeRoot, "wrangler", "registry"),
    npm_config_cache: path.join(runtimeRoot, "npm-cache"),
    npm_config_audit: "false",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
    NODE_OPTIONS: nodeOptionsParts.join(" "),
  };

  delete env.NPM_CONFIG_CACHE;
  delete env.npm_config_proxy;
  delete env.npm_config_http_proxy;
  delete env.npm_config_https_proxy;
  delete env.NPM_CONFIG_PROXY;
  delete env.NPM_CONFIG_HTTP_PROXY;
  delete env.NPM_CONFIG_HTTPS_PROXY;

  return { env, projectRoot };
}
