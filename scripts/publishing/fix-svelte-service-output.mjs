import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exists = async (file) => fs.stat(file).then(() => true, (error) => {
  if (error.code === 'ENOENT') return false;
  throw error;
});

function relativeStaticPath(value) {
  if (typeof value !== 'string' || value.includes('\\') || value.includes('\0')) throw new Error('Invalid prerendered output path');
  const normalized = value.replace(/^\//, '');
  if (!normalized || normalized.split('/').some((part) => part === '..' || part === '.')) throw new Error(`Unsafe prerendered output path: ${value}`);
  return normalized;
}

function contained(root, target) {
  const relative = path.relative(root, target);
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

async function functionHandlerRepairs(output) {
  const repairs = [];
  const functions = path.join(output, 'functions');
  if (!await exists(functions)) return repairs;
  async function walk(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      // Adapter route aliases reuse a canonical Function; never mutate through links.
      if (!entry.isDirectory() || entry.isSymbolicLink()) continue;
      const root = path.join(directory, entry.name);
      if (!entry.name.endsWith('.func')) { await walk(root); continue; }
      const file = path.join(root, '.vc-config.json');
      if (!await exists(file)) continue;
      const config = JSON.parse(await fs.readFile(file, 'utf8'));
      if (config.framework?.slug !== 'sveltekit') continue;
      if (typeof config.handler !== 'string' || !config.handler || config.handler.includes('\0')) throw Error('Svelte Function has no valid handler');
      const handler = config.handler.replaceAll('\\', '/');
      const original = path.resolve(root, handler.split('/').join(path.sep));
      if (contained(root, original)) {
        if (!await exists(original) || !contained(await fs.realpath(root), await fs.realpath(original)) || !(await fs.stat(original)).isFile()) throw Error('Missing or external Svelte Function handler');
        if (handler !== config.handler) repairs.push({ file, config: { ...config, handler } });
        continue;
      }
      // adapter-vercel 7's Windows NFT output can retain the build-source path
      // while copying this exact entry into the Function. Repair only that
      // recognized generated entry, after comparing both immutable copies.
      const expected = '.svelte-kit/vercel-tmp/index.js';
      const actual = path.join(root, ...expected.split('/'));
      let proof = original;
      if (!await exists(proof) && process.platform === 'win32' && /^3\./.test(config.framework.version ?? '')
        && path.basename(output) === 'output' && path.basename(path.dirname(output)) === '.vercel'
        && handler.startsWith('../')) {
        const serviceRoot = path.dirname(path.dirname(output));
        // The adapter concatenates the drive-root twice when constructing its
        // handler on Windows. Its actual source entry remains in this service.
        if (handler.endsWith('/' + path.basename(serviceRoot) + '/' + expected)) proof = path.join(serviceRoot, ...expected.split('/'));
      }
      if (!handler.endsWith('/' + expected) || !await exists(proof) || !await exists(actual)
        || !contained(await fs.realpath(root), await fs.realpath(actual))
        || !(await fs.stat(proof)).isFile() || !(await fs.stat(actual)).isFile()
        || !(await fs.readFile(proof)).equals(await fs.readFile(actual))) throw Error('Unrecognized external Svelte Function handler');
      repairs.push({ file, config: { ...config, handler: expected } });
    }
  }
  await walk(functions);
  return repairs;
}

/** Repair adapter output in the current service; safe to run again on that output. */
export async function fixSvelteServiceOutput({ output = path.resolve('.vercel/output'), base = '' } = {}) {
  if (!['', '/variant-2', '/variant-3', '/variant-6'].includes(base)) throw new Error(`Unsupported service base: ${base}`);
  const file = path.join(output, 'config.json');
  const config = JSON.parse(await fs.readFile(file, 'utf8'));
  if (!Array.isArray(config.routes)) throw new Error('Svelte adapter output has no routes array');
  const handlerRepairs = await functionHandlerRepairs(output);
  const hasRootFunction = await exists(path.join(output, 'functions/index.func'));
  for (const route of config.routes) {
    if (base && route.src?.startsWith('^')) {
      const existing = route.src.match(/^\^\/variant-\d+(?=\/|\(|\?|\$)/)?.[0].slice(1);
      if (existing && existing !== base) throw new Error(`Unexpected existing service mount: ${route.src}`);
      if (!existing) route.src = `^${base}${route.src.slice(1)}`;
    }
    if (route.dest === '/' && hasRootFunction) route.dest = '/index';
  }
  const staticRoutes = [];
  for (const [relativeFile, override] of Object.entries(config.overrides ?? {}).sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    const overridePath = relativeStaticPath(override.path);
    const candidates = [...new Set([
      relativeStaticPath(relativeFile),
      `${overridePath}.html`,
      `${overridePath}/index.html`,
      ...(base ? [`${base.slice(1)}/${relativeStaticPath(relativeFile)}`] : []),
    ])];
    let actual;
    for (const candidate of candidates) {
      if (await exists(path.join(output, 'static', candidate))) { actual = candidate; break; }
    }
    if (!actual) throw new Error(`Missing prerendered output for ${override.path}`);
    const mounted = base && !(overridePath === base.slice(1) || overridePath.startsWith(`${base.slice(1)}/`))
      ? `${base.slice(1)}/${overridePath}` : overridePath;
    const route = { src: `^/${escapeRegex(mounted)}/?$`, dest: `/${actual}` };
    const existing = config.routes.find((entry) => entry.src === route.src);
    if (existing && existing.dest !== route.dest) throw new Error(`Conflicting prerendered route: ${route.src}`);
    if (!existing) staticRoutes.push(route);
  }
  config.routes.unshift(...staticRoutes);
  config.overrides = {};
  for (const repair of handlerRepairs) await fs.writeFile(repair.file, `${JSON.stringify(repair.config, null, 2)}\n`);
  await fs.writeFile(file, `${JSON.stringify(config, null, 2)}\n`);
  return { base, staticPages: staticRoutes.length, functionHandlers: handlerRepairs.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv[2] === '--help') console.log('Usage: node scripts/fix-svelte-service-output.mjs [/variant-2|/variant-3|/variant-6] (run from a built Svelte service root)');
    else if (process.argv.length > 3) throw new Error('Expected at most one service base argument');
    else console.log(JSON.stringify(await fixSvelteServiceOutput({ base: process.argv[2] ?? '' })));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
