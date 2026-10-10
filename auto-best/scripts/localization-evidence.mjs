import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export function sourceSnapshot(root) {
  const list = directory => fs.readdirSync(path.join(root, directory), { recursive: true })
    .map(p => directory + '/' + p.replaceAll('\\', '/'))
    .filter(p => fs.statSync(path.join(root, p)).isFile());
  const sources = [...list('src'), ...list('localization'),
    'package.json', 'package-lock.json', 'svelte.config.js', 'vite.config.ts', 'tsconfig.json', 'vercel.json'];
  const hashes = paths => Object.fromEntries(paths.sort().map(p => [p, sha256(fs.readFileSync(path.join(root, p)))]));
  const application = hashes(sources);
  const assets = hashes(list('static'));
  const tests = hashes(list('scripts').filter(p => /\.(mjs|js|ts)$/.test(p)));
  return { applicationSha256: sha256(JSON.stringify(application)), assetsSha256: sha256(JSON.stringify(assets)),
    testsSha256: sha256(JSON.stringify(tests)), application, assets, tests };
}
