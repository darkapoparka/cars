import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Runs only inside a generated dealer package. No template checkout is rebuilt.
export function nativeBuildPlan(key) {
  if (key === 'modern') return {
    key, root: 'modern', base: '/variant-2',
    environment: { NEXT_PUBLIC_BASE_PATH: '/variant-2' },
    steps: [
      ['npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '--',
        'pnpm', 'install', '--frozen-lockfile', '--prod=false'],
      ['npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '--',
        'pnpm', '--filter', '@repo/database', 'build'],
      ['npx', '--yes', '--package=node@22.23.2', '--package=pnpm@11.4.0', '--',
        'pnpm', '--filter', 'web', 'build']
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
function dependencyInputs(packageRoot, key) {
  const root = fs.realpathSync(packageRoot), service = path.join(root, key);
  for (let dir = root; ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'templates.lock.json')) && !root.startsWith(path.join(dir, 'runtime') + path.sep)) throw Error('Install proof requires a generated package, not canonical source');
    if (dir === path.dirname(dir)) break;
  }
  const items = [];
  const add = relative => {
    const file = path.join(service, relative);
    if (!fs.existsSync(file)) return;
    if (!fs.statSync(file).isFile() || fs.lstatSync(file).isSymbolicLink()) throw Error('Linked dependency input requires review');
    items.push([relative.replaceAll('\\', '/'), createHash('sha256').update(fs.readFileSync(file)).digest('hex')]);
  };
  const lock = key === 'modern' ? 'pnpm-lock.yaml' : 'package-lock.json';
  for (const required of ['package.json', lock]) if (!fs.existsSync(path.join(service, required))) throw Error('Missing dependency input: ' + required);
  for (const name of ['package.json', lock, 'pnpm-workspace.yaml', '.npmrc', '.pnpmfile.cjs']) add(name);
  const visit = (relative, patches = false) => {
    if (!fs.existsSync(path.join(service, relative))) return;
    for (const item of fs.readdirSync(path.join(service, relative), {withFileTypes:true})) {
      if (item.name.startsWith('.') || ['node_modules','build','dist','runtime','docs','qa'].includes(item.name)) continue;
      const name = relative + '/' + item.name;
      if (item.isSymbolicLink()) throw Error('Linked workspace dependency input requires review');
      if (item.isDirectory()) visit(name, patches);
      else if (item.isFile() && (patches || item.name === 'package.json')) add(name);
    }
  };
  if (key === 'modern') { visit('apps'); visit('packages'); visit('patches', true); }
  return {schemaVersion:1,service:key,node:process.version,inputsDigest:createHash('sha256').update(JSON.stringify(items.sort())).digest('hex')};
}

export function runNativeBuild(key, { packageRoot = path.resolve(import.meta.dirname, '..'), run = spawnSync, dependenciesInstalled = false, installOnly = false } = {}) {
  const plan = nativeBuildPlan(key);
  const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot, 'dealer.json'), 'utf8'));
  if (!['2', '3'].includes(manifest.packaging?.version) || !manifest.variants?.some(v => v.key === key && v.base === plan.base)) throw new Error('Build service differs from the native package manifest');
  const environment = { ...process.env, ...plan.environment };
  if (key === 'carwow') delete environment.DAY_PREVIEW_ADAPTER;
  const cwd = path.join(packageRoot, plan.root);
  if (installOnly && dependenciesInstalled) throw Error('Install and reuse phases are mutually exclusive');
  const proof = installOnly || dependenciesInstalled ? dependencyInputs(packageRoot, key) : null;
  const proofDirectory = path.join(packageRoot, '.cars-build-assets');
  const proofFile = path.join(proofDirectory, key + '.dependencies.json');
  if (proof && fs.existsSync(proofDirectory) && fs.lstatSync(proofDirectory).isSymbolicLink()) throw Error('Linked dependency proof directory');
  if (proof && fs.existsSync(proofFile) && fs.lstatSync(proofFile).isSymbolicLink()) throw Error('Linked dependency proof file');
  if (installOnly && fs.existsSync(proofFile)) fs.unlinkSync(proofFile);
  if (dependenciesInstalled) {
    if (!fs.existsSync(proofFile) || JSON.stringify(JSON.parse(fs.readFileSync(proofFile, 'utf8'))) !== JSON.stringify(proof)) throw Error('Dependencies changed or no verified install phase; run install again');
    const compiler = key === 'modern' ? 'apps/web/node_modules/next/dist/bin/next' : 'node_modules/vite/bin/vite.js';
    if (!fs.existsSync(path.join(cwd, compiler))) throw Error('Installed compiler is missing; run install again');
  }
  const steps = installOnly ? plan.steps.slice(0, 1) : dependenciesInstalled ? plan.steps.slice(1) : plan.steps;
  for (const [program, ...args] of steps) {
    // Arguments come only from the fixed plan above, never from manifest text.
    const windows = process.platform === 'win32' && program !== 'node';
    const executable = windows ? path.join(path.dirname(process.execPath), `${program}.cmd`) : program;
    const command = windows ? 'cmd.exe' : program === 'node' ? process.execPath : program;
    const parameters = windows ? ['/d', '/s', '/c', `"${[executable, ...args].map(a => `"${a}"`).join(' ')}"`] : args;
    const result = run(command, parameters, {
      cwd, env: environment, stdio: 'inherit', windowsHide: true,
      ...(windows ? { windowsVerbatimArguments: true } : {})
    });
    if (result.error || result.status !== 0) throw new Error(`Native ${key} build failed: ${result.error?.message || result.status}`);
  }
  if (installOnly) {
    if (JSON.stringify(dependencyInputs(packageRoot, key)) !== JSON.stringify(proof)) throw Error('Dependency inputs changed during installation');
    fs.mkdirSync(proofDirectory, { recursive:true });
    fs.writeFileSync(proofFile, JSON.stringify(proof) + '\n', {flag:'wx'});
  }
  return { key, base: plan.base, phase: installOnly ? 'install' : 'build', dependencyInstallPerformed: !dependenciesInstalled };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length === 1) runNativeBuild(args[0]);
    else if (args.length === 2 && args[0] === 'install') runNativeBuild(args[1], {installOnly:true});
    else if (args.length === 2 && args[1] === '--installed') runNativeBuild(args[0], {dependenciesInstalled:true});
    else throw new Error('Usage: node scripts/build-native-service.mjs [install] auto-best|modern|import|carwow [--installed]');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
