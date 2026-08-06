import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createSitesEnv } from "./sites-env.mjs";

const { env, projectRoot } = createSitesEnv();

function runNodeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: projectRoot,
      env,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`Script failed with exit code ${code ?? 1}`));
    });

    child.on("error", reject);
  });
}

function runVinextBuild() {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      ["./node_modules/vinext/dist/cli.js", "build"],
      {
        cwd: projectRoot,
        env,
        stdio: "inherit",
      },
    );

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`vinext build failed with exit code ${code ?? 1}`));
    });

    child.on("error", reject);
  });
}

console.log("Running vinext build...");
await runVinextBuild();
await runNodeScript(fileURLToPath(new URL("./validate-artifact.mjs", import.meta.url)));
