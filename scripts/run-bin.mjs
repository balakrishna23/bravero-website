import { spawn } from "node:child_process";
import path from "node:path";
import { createSitesEnv } from "./sites-env.mjs";

const [, , binName, ...args] = process.argv;

if (!binName) {
  console.error("usage: node scripts/run-bin.mjs <binary> [args...]");
  process.exit(64);
}

const { env, projectRoot } = createSitesEnv();
const binPath = path.join(
  projectRoot,
  "node_modules",
  ".bin",
  process.platform === "win32" ? `${binName}.cmd` : binName,
);

const child = spawn(binPath, args, {
  cwd: projectRoot,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});

child.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
