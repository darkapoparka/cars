// Compatibility entry point. The technical registry owns both generated views.
import { spawnSync } from 'node:child_process';
import path from 'node:path';
const result = spawnSync(process.execPath, [path.join(import.meta.dirname, 'index-deployments.mjs'), ...process.argv.slice(2)], {stdio:'inherit', windowsHide:true});
process.exitCode = result.status ?? 1;
