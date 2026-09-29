import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Runs only inside a generated dealer package. No template checkout is rebuilt.
export function nativeBuildPlan(key) {
  if (key === 'modern') return {
    key, root: 'modern', base: '/variant-2',
    environment: { NEXT_PUBLIC_BASE_PATH: '/variant-2' },
    steps: [
      ['npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '-c',
        'pnpm install --frozen-lockfile --prod=false'],
      ['npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '-c',
        'pnpm --filter @repo/database build && pnpm --filter web build']
    ]
  };
  const bases = { 'auto-best': '', import: '/variant-2', carwow: '/variant-3' };
  if (!Object.hasOwn(bases, key)) throw new Error('Unknown native build service');
  const generatedLocaleStep = ['auto-best', 'carwow'].includes(key)
    ? [['node', 'scripts/build-locales.mjs']]
    : [];
  return { key, root: key, base: bases[key],
    environment: key === 'import' ? { TEMPLATE_BASE_PATH: bases[key] }
      : key === 'carwow' ? { DAY_LOCALE_BASE: bases[key] } : {},
    steps: [
      ['npm', 'ci', '--include=dev'],
      ...generatedLocaleStep,
      ['npm', 'run', 'build'],
      ['node', '../scripts/fix-svelte-service-output.mjs', ...(bases[key] ? [bases[key]] : [])]
    ]
  };
}
export function runNativeBuild(key, { packageRoot = path.resolve(import.meta.dirname, '..'), run = spawnSync } = {}) {
  const plan = nativeBuildPlan(key);
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'dealer.json'), 'utf8'));
  if (manifest.packaging?.version !== '2' || !manifest.variants?.some(v => v.key === key && v.base === plan.base)) throw new Error('Build service differs from the native package manifest');
  const environment = { ...process.env, ...plan.environment };
  if (key === 'carwow') delete environment.DAY_PREVIEW_ADAPTER;
  const cwd = path.join(packageRoot, plan.root);
  for (const [program, ...args] of plan.steps) {
    // Arguments come only from the fixed plan above, never from manifest text.
    const windows = process.platform === 'win32' && program !== 'node';
    const command = windows ? 'cmd.exe' : program === 'node' ? process.execPath : program;
    const parameters = windows ? ['/d', '/s', '/c', `"${[program, ...args].map(a => `"${a}"`).join(' ')}"`] : args;
    const result = run(command, parameters, {
      cwd, env: environment, stdio: 'inherit', windowsHide: true,
      ...(windows ? { windowsVerbatimArguments: true } : {})
    });
    if (result.error || result.status !== 0) throw new Error(`Native ${key} build failed: ${result.error?.message || result.status}`);
  }
  return { key, base: plan.base };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node scripts/build-native-service.mjs auto-best|modern|import|carwow');
    runNativeBuild(process.argv[2]);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
