import { spawnSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
const packageRoot = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'dealer.json'), 'utf8'));
const selected = manifest.variants?.filter(v => v.key === 'app');
if (!['3','5'].includes(manifest.packaging?.version) || selected?.length !== 1 || selected[0].base !== '/variant-4') throw Error('App build differs from package manifest');
const cwd = path.join(packageRoot, 'app');
const result = spawnSync(process.execPath, [path.join(cwd, 'node_modules/next/dist/bin/next'), 'build', '--webpack'], {
  cwd, stdio:'inherit', env:{...process.env,NEXT_PUBLIC_BASE_PATH:'/variant-4'}, windowsHide:true
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
