import { spawnSync } from 'node:child_process';

const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
if (!slug) throw new Error('Usage: node scripts/repair-client.mjs --client <slug>');

function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit'
  });
  if (result.status !== 0) throw new Error(`${script} failed with exit code ${result.status}`);
}

run('scripts/sanitize-client-preview-content.mjs', ['--client', slug]);
run('scripts/refine-client-logo-assets.mjs', ['--client', slug]);
run('scripts/refresh-client.mjs', ['--client', slug, '--write']);
run('scripts/enforce-client-logo-surfaces.mjs', ['--client', slug]);
run('scripts/sanitize-client-preview-content.mjs', ['--client', slug]);
console.log(`Repaired ${slug} from approved template locks with contextual transparent logos.`);
