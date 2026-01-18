import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Playwright always runs with the config from this package, regardless
// of where `pnpm ... test:e2e` is invoked from in a workspace.
const packageRoot = path.resolve(__dirname, "..");
const configPath = path.join(packageRoot, "playwright.config.ts");

// pnpm may forward an extra "--" into node scripts; Playwright treats
// unknown positionals as test filters, which can lead to "No tests found."
const rawArgs = process.argv.slice(2);
const userArgs = rawArgs[0] === "--" ? rawArgs.slice(1) : rawArgs;

const result = spawnSync(
  "pnpm",
  ["-s", "exec", "playwright", "test", "-c", configPath, ...userArgs],
  { cwd: packageRoot, stdio: "inherit" },
);

process.exit(result.status ?? 1);

