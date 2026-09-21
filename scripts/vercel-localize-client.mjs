import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [service, carsCommit] = process.argv.slice(2);
const allowedServices = new Set(['auto-best', 'modern', 'import', 'carwow']);
const shaPattern = /^[a-f0-9]{40}$/;
const markerPath = path.join(packageRoot, '.cars-localization-bootstrap.json');
const lockPath = path.join(packageRoot, '.cars-localization-bootstrap.lock');
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));

function fail(message) {
  throw new Error(`Native localization bootstrap: ${message}`);
}

function run(program, args, { cwd = packageRoot, capture = false, env = process.env } = {}) {
  const result = spawnSync(program, args, {
    cwd,
    env,
    encoding: 'utf8',
    stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
  });
  if (result.error || result.status !== 0) {
    const details = capture ? `${result.stderr || ''}\n${result.stdout || ''}`.trim() : '';
    fail(`${program} ${args.join(' ')} failed: ${result.error?.message || result.status}${details ? `\n${details}` : ''}`);
  }
  return capture ? String(result.stdout || '').trim() : '';
}

function markerReady() {
  try {
    const marker = readJson(markerPath);
    const manifest = readJson(path.join(packageRoot, 'dealer.json'));
    const contract = readJson(path.join(packageRoot, 'localization', 'contract.json'));
    return marker.schemaVersion === 1 &&
      marker.carsCommit === carsCommit &&
      marker.repository === manifest.repository &&
      manifest.packaging?.version === '2' &&
      JSON.stringify([...(contract.enabledLocales || [])].sort()) === '["bg","en"]' &&
      fs.existsSync(path.join(packageRoot, service, 'package.json')) &&
      fs.existsSync(path.join(packageRoot, 'scripts', 'build-native-service.mjs'));
  } catch {
    return false;
  }
}

function copyGeneratedPackage(output) {
  const generated = readJson(path.join(output, 'dealer.json'));
  const variantKeys = new Set(generated.variants.map(({ key }) => key));

  for (const key of variantKeys) {
    const source = path.join(output, key);
    const destination = path.join(packageRoot, key);
    fs.rmSync(destination, { recursive: true, force: true });
    fs.cpSync(source, destination, { recursive: true, force: true, errorOnExist: false });
  }

  const localization = path.join(packageRoot, 'localization');
  fs.rmSync(localization, { recursive: true, force: true });
  fs.cpSync(path.join(output, 'localization'), localization, { recursive: true, force: true, errorOnExist: false });

  fs.mkdirSync(path.join(packageRoot, 'scripts'), { recursive: true });
  fs.cpSync(path.join(output, 'scripts'), path.join(packageRoot, 'scripts'), {
    recursive: true,
    force: true,
    errorOnExist: false
  });

  const skipped = new Set([...variantKeys, 'scripts', 'localization', 'vercel.json', '.git', '.github']);
  for (const entry of fs.readdirSync(output, { withFileTypes: true })) {
    if (skipped.has(entry.name)) continue;
    const source = path.join(output, entry.name);
    const destination = path.join(packageRoot, entry.name);
    if (entry.isDirectory()) {
      fs.cpSync(source, destination, { recursive: true, force: true, errorOnExist: false });
    } else if (entry.isFile()) {
      fs.copyFileSync(source, destination);
    }
  }
}

async function acquireLock() {
  for (let attempt = 0; attempt < 900; attempt += 1) {
    if (markerReady()) return false;
    try {
      fs.mkdirSync(lockPath);
      return true;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      await sleep(1000);
    }
  }
  fail('another service did not finish the shared package generation');
}

async function main() {
  if (!allowedServices.has(service)) fail('usage: node scripts/vercel-localize-client.mjs SERVICE CARS_COMMIT');
  if (!shaPattern.test(carsCommit || '')) fail('Cars commit must be an exact 40-character SHA');
  const sourceManifest = readJson(path.join(packageRoot, 'dealer.json'));
  if (!sourceManifest.variants?.some(({ key }) => key === service)) fail(`service ${service} is not part of this dealer package`);
  if (markerReady()) {
    console.log(`Native localization package already prepared from Cars ${carsCommit}.`);
    return;
  }

  const ownsLock = await acquireLock();
  if (!ownsLock) {
    console.log(`Native localization package prepared by another service from Cars ${carsCommit}.`);
    return;
  }

  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-vercel-localization-'));
  try {
    const cars = path.join(workspace, 'cars');
    const output = path.join(workspace, 'localized');
    fs.mkdirSync(cars, { recursive: true });
    run('git', ['init', '--quiet'], { cwd: cars });
    run('git', ['remote', 'add', 'origin', 'https://github.com/darkapoparka/cars.git'], { cwd: cars });
    run('git', ['config', 'core.sparseCheckout', 'true'], { cwd: cars });
    fs.mkdirSync(path.join(cars, '.git', 'info'), { recursive: true });
    fs.writeFileSync(
      path.join(cars, '.git', 'info', 'sparse-checkout'),
      '/scripts/\n/templates/\n/docs/\n/*.json\n'
    );
    run('git', ['fetch', '--no-tags', '--filter=blob:none', '--depth', '1', 'origin', carsCommit], { cwd: cars });
    run('git', ['checkout', '--quiet', '--detach', 'FETCH_HEAD'], { cwd: cars });
    const resolvedCarsCommit = run('git', ['rev-parse', 'HEAD'], { cwd: cars, capture: true });
    if (resolvedCarsCommit !== carsCommit) fail(`resolved Cars commit differs: ${resolvedCarsCommit}`);

    run(process.execPath, [
      path.join(cars, 'scripts', 'rollout-localized-client.mjs'),
      '--client-root', packageRoot,
      '--slug', sourceManifest.slug,
      '--repository', sourceManifest.repository,
      '--output', output
    ], {
      cwd: cars,
      env: {
        ...process.env,
        GITHUB_SHA: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GITHUB_SHA || ''
      }
    });

    const generated = readJson(path.join(output, 'dealer.json'));
    const contract = readJson(path.join(output, 'localization', 'contract.json'));
    const adoption = readJson(path.join(output, 'localization', 'adoption.json'));
    const lock = readJson(path.join(cars, 'templates.lock.json'));
    if (generated.packaging?.version !== '2') fail('generator did not produce packaging v2');
    if (generated.slug !== sourceManifest.slug || generated.repository !== sourceManifest.repository) fail('dealer publication identity changed');
    if (JSON.stringify([...(contract.enabledLocales || [])].sort()) !== '["bg","en"]') fail('generator did not produce complete EN/BG localization');
    if (adoption.packagingVersion !== '2' || adoption.dealerId !== contract.dealerId) fail('native adoption receipt is invalid');
    for (const variant of generated.variants) {
      const expected = lock.templates?.[variant.key]?.commit;
      if (!shaPattern.test(expected || '') || generated.templateRevisions?.[variant.key] !== expected || adoption.releases?.[variant.key]?.commit !== expected) {
        fail(`unsealed or stale template revision: ${variant.key}`);
      }
    }

    copyGeneratedPackage(output);
    fs.writeFileSync(markerPath, `${JSON.stringify({
      schemaVersion: 1,
      carsCommit,
      repository: generated.repository,
      slug: generated.slug,
      enabledLocales: contract.enabledLocales,
      preparedAt: new Date().toISOString()
    }, null, 2)}\n`);
    if (!markerReady()) fail('installed package failed its post-copy validation');
    console.log(`Prepared native EN/BG package for ${generated.slug} from Cars ${carsCommit}.`);
  } finally {
    fs.rmSync(workspace, { recursive: true, force: true });
    fs.rmSync(lockPath, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
