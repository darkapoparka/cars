import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import {assertLeadBranding,isBrandConsumerSource,reviewedRasterProvenance} from './publishing/lead-branding.mjs';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SURFACES = ['onLight', 'onDark', 'onAccent'];
const PUBLIC_ROOTS = {
  'auto-best': 'auto-best/static', modern: 'modern/apps/web/public',
  import: 'import/static', app: 'app/public', mobile: 'mobile/public',
  'karento-best': 'karento-best/static',
};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (ok, message) => { if (!ok) throw new Error(message); };

// Read supported source consumers independently of the receipt. Do not collect
// dependency/build trees or re-copy all inventory and historical raster bytes.
const OMITTED_CONSUMER_DIRECTORIES = new Set(['node_modules', '.git', '.template', '.client',
  '.vercel', '.netlify', '.wrangler', '.open-next', '.vinext', '.cloudflare', '.cars-cloudflare',
  '.cars-build-assets', '.svelte-kit', '.turbo', '.cache', '.pnpm-store', 'build', 'dist',
  'runtime', 'artifacts', 'audits', 'evidence', 'test-results', 'playwright-report', 'coverage']);
function readCurrentConsumers(client, read) {
  let count = 0, bytes = 0;
  const walk = relative => {
    for (const item of fs.readdirSync(path.join(client, relative), {withFileTypes: true})) {
      if (OMITTED_CONSUMER_DIRECTORIES.has(item.name) || item.name.startsWith('.next') || item.name.startsWith('.env')) continue;
      const name = relative + '/' + item.name;
      if (/\/dealer-brand\/v2-[a-f0-9]{16}(?:\/|$)/.test(name)) continue;
      assert(!item.isSymbolicLink(), 'Branding source scan refuses symlinks: ' + name);
      if (item.isDirectory()) walk(name);
      else if (isBrandConsumerSource(name)) {
        const size = fs.statSync(path.join(client, name)).size;
        assert(item.isFile() && ++count <= 20000 && size <= 16 * 1024 ** 2 &&
          (bytes += size) <= 64 * 1024 ** 2, 'Branding source consumer scan exceeds its read bound');
        read(name);
      }
    }
  };
  for (const key of Object.keys(PUBLIC_ROOTS)) walk(key);
}

function currentBrandingInputs(client, contract, manifest, integrated) {
  assert(contract.schemaVersion === 1 && contract.dealer === manifest.slug &&
    contract.policy === 'template-default' && /^[a-f0-9]{16}$/.test(contract.packId || '') &&
    contract.publicBase === '/dealer-brand/v2-' + contract.packId,
  'Current branding identity or content-versioned pack differs');
  const files = new Map(), read = name => {
    if (!files.has(name)) files.set(name, fs.readFileSync(containedFile(client, name)));
    return files.get(name);
  };
  read('.cars-branding.json');
  const reviewed = contract.reviewedSurfaceVariants;
  if (reviewed) {
    assert(reviewed.schemaVersion === 1 && reviewed.reviewed === true &&
      Number.isFinite(Date.parse(reviewed.reviewedAt)) &&
      JSON.stringify(Object.keys(reviewed.surfaces || {}).sort()) === JSON.stringify([...SURFACES].sort()),
    'Current branding needs all three reviewed surfaces');
    assert(Array.isArray(contract.packInputs) &&
      digest(JSON.stringify(contract.packInputs)).slice(0, 16) === contract.packId,
    'Current branding source pack identity changed');
    for (const row of contract.packInputs) assert(digest(read(row.path)) === row.sha256,
      'Current branding source bytes changed: ' + row.path);
  }
  const assets = {};
  for (const surface of SURFACES) {
    if (reviewed) {
      const row = reviewed.surfaces[surface];
      reviewedRasterProvenance({...row, generation: row.generation ?
        {...row.generation, generationId: row.generation.id} : undefined},
      {retainedAllowed: contract.creationMethod === 'reviewed-raster-surface-variants'});
    }
    const suffix = 'logo-' + ({onLight: 'on-light', onDark: 'on-dark', onAccent: 'on-accent'}[surface]) + '.webp';
    const publicPath = contract.publicBase + '/' + suffix;
    const rows = contract.assets?.filter(row => row.key === 'auto-best' && row.path === PUBLIC_ROOTS['auto-best'] + publicPath);
    assert(rows?.length === 1, 'Current branding surface is missing: ' + surface);
    assets[surface] = {publicPath, sha256: rows[0].sha256, sourcePath: 'branding/' + suffix};
  }
  if (integrated) {
    const paths = new Set([
      ...contract.assets.map(row => row.path), ...contract.consumerReferences.map(row => row.path),
      ...contract.palette.checks.map(row => row.path), ...Object.keys(contract.facts),
      ...(contract.packInputs || []).map(row => row.path),
      'app/lib/dealer.json', 'modern/packages/marketplace/lead-site.ts',
    ]);
    // Include current bindings independently of the recorded consumer list.
    for (const name of ['auto-best/src/lib/config/brand.ts', 'mobile/src/components/Header.tsx',
      'mobile/src/lib/showroom-config.ts', 'auto-best/src/lib/data/dealer-profile.json',
      'import/src/lib/data/dealer-profile.json', 'modern/packages/marketplace-domain/testing/dealer-profile.json']) {
      if (fs.existsSync(path.join(client, name))) paths.add(name);
    }
    for (const name of paths) read(name);
    readCurrentConsumers(client, read);
    assertLeadBranding(files, manifest);
  }
  return assets;
}

function containedFile(root, relative) {
  assert(typeof relative === 'string' && relative && !relative.includes('\\') &&
    !relative.split('/').some(part => !part || part === '.' || part === '..') &&
    !path.isAbsolute(relative), 'Unsafe branding asset path');
  const target = path.resolve(root, relative);
  const resolvedRoot = fs.realpathSync(root);
  const real = fs.realpathSync(target);
  const remainder = path.relative(resolvedRoot, real);
  assert(remainder && remainder !== '..' && !remainder.startsWith('..' + path.sep) &&
    !path.isAbsolute(remainder), 'Branding asset escapes its source directory');
  assert(fs.statSync(real).isFile(), 'Branding asset must be a regular file');
  return real;
}

export function resolveBrandingSharp() {
  const candidates = [process.env.CARS_SHARP_ROOT && path.join(process.env.CARS_SHARP_ROOT, 'package.json'),
    path.join(ROOT, 'runtime/varna-tools/package.json'),
    path.join(ROOT, 'templates/karento-best/package.json')].filter(Boolean);
  for (const file of candidates) {
    try { return createRequire(file)('sharp'); }
    catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  throw new Error('Use an existing sharp installation via CARS_SHARP_ROOT; do not create another dependency copy.');
}

/** Technical raster/provenance checks. Surface contrast and copy fit still need browser review. */
export async function verifyLeadBranding({ client, sharp, integrated = false }) {
  assert(typeof sharp === 'function', 'Existing sharp dependency required');
  const manifestFile = path.join(client, 'dealer.json');
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : null;
  const current = manifest?.branding?.required === true || manifest?.branding?.contract === '.cars-branding.json' ||
    fs.existsSync(path.join(client, '.cars-branding.json'));
  const contractPath = current ? '.cars-branding.json' : 'branding/logo-contract.json';
  const contractFile = path.join(client, contractPath);
  assert(fs.existsSync(contractFile), 'Required ' + contractPath + ' is missing');
  const contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
  const generation = current ? contract.generation || {} : contract.imageGeneration || contract.imageGen || {};
  const reference = contract.generationId || generation.reference || generation.id;
  const retained = current && contract.creationMethod === 'reviewed-raster-surface-variants';
  assert(retained || typeof reference === 'string' && reference.trim(), 'Actual Image Gen provenance is required');
  const identityStatus = current ? contract.approval : contract.identityStatus;
  assert(typeof identityStatus === 'string' && identityStatus.trim(),
    'Branding identity status must distinguish a sourced identity from a proposal');
  assert(!integrated && !current || manifest, 'Dealer manifest is required for current or integrated branding');
  if (integrated) {
    const keys = manifest.variants.map(variant => variant.key).sort();
    assert(JSON.stringify(keys) === JSON.stringify(Object.keys(PUBLIC_ROOTS).sort()),
      'Integrated branding acceptance requires all six families exactly once');
  }
  const assets = current ? currentBrandingInputs(client, contract, manifest, integrated) : contract.assets;
  const surfaces = [];
  for (const surface of SURFACES) {
    const asset = assets?.[surface];
    assert(asset && /^\/dealer-brand\/(?:v2-[a-f0-9]{16}\/)?[a-zA-Z0-9._-]+\.(png|webp)$/.test(asset.publicPath),
      'Required transparent raster treatment missing: ' + surface);
    assert(/^[a-f0-9]{64}$/.test(asset.sha256 || ''), 'Missing asset digest: ' + surface);
    const relative = asset.publicPath.slice(1), file = containedFile(client, asset.sourcePath || relative);
    const bytes = fs.readFileSync(file);
    assert(digest(bytes) === asset.sha256, 'Logo bytes differ from their reviewed contract: ' + surface);
    const metadata = await sharp(bytes).metadata();
    assert(['png', 'webp'].includes(metadata.format) && metadata.hasAlpha,
      'Logo must contain real raster alpha transparency: ' + surface);
    assert(!metadata.pages || metadata.pages === 1, 'Animated logo treatment refused: ' + surface);
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let transparent = 0, visible = 0, left = info.width, top = info.height, right = -1, bottom = -1;
    for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
      const alpha = data[(y * info.width + x) * info.channels + info.channels - 1];
      if (alpha === 0) transparent++;
      if (alpha > 16) { visible++; left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); }
    }
    assert(transparent > 0 && visible > 0, 'Opaque or empty logo treatment refused: ' + surface);
    const copies = [];
    if (integrated) for (const variant of manifest.variants) {
      const copy = containedFile(client, PUBLIC_ROOTS[variant.key] + '/' + relative);
      assert(digest(fs.readFileSync(copy)) === asset.sha256,
        'Integrated logo bytes differ in ' + variant.key + ': ' + surface);
      copies.push(variant.key);
    }
    surfaces.push({ surface, publicPath: asset.publicPath, sha256: asset.sha256,
      width: info.width, height: info.height, transparentPixels: transparent,
      transparentFraction: transparent / (info.width * info.height),
      visibleBounds: { left, top, width: right - left + 1, height: bottom - top + 1 }, copies });
  }
  return { schemaVersion: 1, dealer: contract.dealer || path.basename(client),
    status: 'passed', contractPath, ...(current ? {packId: contract.packId} : {}),
    imageGenerationReference: reference ?? null, identityStatus,
    integrated, surfaces, renderedContrastVerified: false,
    note: 'Alpha, hashes, provenance declaration and optional six-family copies passed. Verify spelling, surfaces and actual consumers in the browser.' };
}

if (isEntrypoint(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.includes('--help')) console.log('Usage: node scripts/verify-lead-branding.mjs --client SLUG [--integrated]\nRead-only Image Gen provenance/raster-alpha/hash checks; --integrated checks all six public copies.');
    else {
      assert(args.every((value, index) => value === '--client' || value === '--integrated' || index === args.indexOf('--client') + 1), 'Unknown branding check argument');
      const slug = args[args.indexOf('--client') + 1];
      assert(args.includes('--client') && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || ''), 'Exact dealer slug required');
      const client = path.join(ROOT, 'clients', slug);
      console.log(JSON.stringify(await verifyLeadBranding({ client, sharp: resolveBrandingSharp(), integrated: args.includes('--integrated') }), null, 2));
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
