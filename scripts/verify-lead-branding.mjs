import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SURFACES = ['onLight', 'onDark', 'onAccent'];
const PUBLIC_ROOTS = {
  'auto-best': 'auto-best/static', modern: 'modern/apps/web/public',
  import: 'import/static', app: 'app/public', mobile: 'mobile/public',
  'karento-best': 'karento-best/static',
};
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const assert = (ok, message) => { if (!ok) throw new Error(message); };

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
  const contractFile = path.join(client, 'branding/logo-contract.json');
  assert(fs.existsSync(contractFile), 'Required branding/logo-contract.json is missing');
  const contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
  const generation = contract.imageGeneration || contract.imageGen || {};
  const reference = contract.generationId || generation.reference || generation.id;
  assert(typeof reference === 'string' && reference.trim(), 'Actual Image Gen provenance is required');
  assert(typeof contract.identityStatus === 'string' && contract.identityStatus.trim(),
    'Branding identity status must distinguish a sourced identity from a proposal');
  const manifest = integrated ? JSON.parse(fs.readFileSync(path.join(client, 'dealer.json'), 'utf8')) : null;
  if (manifest) {
    const keys = manifest.variants.map(variant => variant.key).sort();
    assert(JSON.stringify(keys) === JSON.stringify(Object.keys(PUBLIC_ROOTS).sort()),
      'Integrated branding acceptance requires all six families exactly once');
  }
  const surfaces = [];
  for (const surface of SURFACES) {
    const asset = contract.assets?.[surface];
    assert(asset && /^\/dealer-brand\/[a-zA-Z0-9._-]+\.(png|webp)$/.test(asset.publicPath),
      'Required transparent raster treatment missing: ' + surface);
    assert(/^[a-f0-9]{64}$/.test(asset.sha256 || ''), 'Missing asset digest: ' + surface);
    const relative = asset.publicPath.slice(1), file = containedFile(client, relative);
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
    if (manifest) for (const variant of manifest.variants) {
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
    status: 'passed', imageGenerationReference: reference, identityStatus: contract.identityStatus,
    integrated, surfaces, renderedContrastVerified: false,
    note: 'Alpha, hashes, provenance declaration and optional six-family copies passed. Verify spelling, surfaces and actual consumers in the browser.' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
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
