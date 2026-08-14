import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");
const incoming = process.argv.slice(2);
const translated = [];
const isSitesPreview = incoming.includes("--strictPort");

for (let index = 0; index < incoming.length; index += 1) {
  const argument = incoming[index];
  if (argument === "--strictPort") continue;
  if (argument === "--host") {
    translated.push("--hostname");
    if (incoming[index + 1] && !incoming[index + 1].startsWith("--")) {
      translated.push(incoming[index + 1]);
      index += 1;
    }
    continue;
  }
  translated.push(argument);
}

const mode = isSitesPreview ? "start" : "dev";
const modeArgs = isSitesPreview ? [] : ["--webpack"];
const child = spawn(process.execPath, [nextBin, mode, ...modeArgs, ...translated], {
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
