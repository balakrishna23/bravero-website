"use strict";

if (process.platform === "win32") {
  const childProcess = require("node:child_process");
  const originalExec = childProcess.exec;

  childProcess.exec = function patchedExec(command, ...args) {
    if (typeof command === "string" && command.trim().toLowerCase() === "net use") {
      const callback = args.find((value) => typeof value === "function");
      if (callback) {
        process.nextTick(() => callback(new Error("Skipped net use probe on Windows."), "", ""));
      }

      return {
        pid: undefined,
        killed: false,
        kill() {
          return false;
        },
        on() {
          return this;
        },
        once() {
          return this;
        },
        removeListener() {
          return this;
        },
      };
    }

    return originalExec.call(this, command, ...args);
  };
}
