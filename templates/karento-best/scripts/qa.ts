import { spawnSync } from "node:child_process";
for (const script of [
  "validate-ssr.ts",
  "validate-interactions.ts",
  "validate-native-widgets.ts",
  "validate-smoke.ts",
]) {
  const result = spawnSync(process.execPath, ["scripts/" + script], {
    stdio: "inherit",
    env: process.env,
    windowsHide: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
