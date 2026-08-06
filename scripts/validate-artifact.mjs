import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createSitesEnv } from "./sites-env.mjs";

const { projectRoot } = createSitesEnv();
const workerPath = path.join(projectRoot, "dist", "server", "index.js");
const hostingPath = path.join(projectRoot, "dist", ".openai", "hosting.json");

for (const [targetPath, label] of [
  [workerPath, "Missing Sites Worker entry: dist/server/index.js"],
  [hostingPath, "Missing packaged Sites manifest: dist/.openai/hosting.json"],
]) {
  try {
    await access(targetPath, constants.F_OK);
  } catch {
    console.error(label);
    process.exit(66);
  }
}

JSON.parse(await readFile(hostingPath, "utf8"));

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("sites-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);

if (!worker.default || typeof worker.default.fetch !== "function") {
  throw new Error(
    "dist/server/index.js must have an ESM default export with fetch(request, env, ctx)",
  );
}

console.log("Validated Sites artifact: ESM Worker default.fetch and hosting manifest are present.");
