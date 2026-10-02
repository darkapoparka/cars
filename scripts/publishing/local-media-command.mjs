import fs from 'node:fs/promises';
import path from 'node:path';
import { packagePublicAssets, verifyPublicAssetBundle } from './public-asset-bundle.mjs';

export async function runLocalMediaCommand(root, argv) {
  if (argv.includes('--help')) { console.log('Usage: node scripts/package-shared-media.mjs --local-assets --client SLUG --input PUBLIC-BUILD --manifest DEALER-JSON --out runtime/NEW-OUTPUT [--exclusions REVIEW-JSON] [--write]'); return; }
  const options = {}; let write = false;
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i];
    if (key === '--local-assets') continue;
    if (key === '--write') { write = true; continue; }
    if (!['--client', '--input', '--manifest', '--out', '--exclusions'].includes(key) || !argv[i + 1] || argv[i + 1].startsWith('--')) throw new Error('Incomplete local-assets argument: ' + key);
    if (options[key]) throw new Error('Duplicate argument: ' + key);
    options[key] = argv[++i];
  }
  if (!options['--input'] || !options['--manifest'] || !options['--out'] || !options['--client']) throw new Error('Use --local-assets --client SLUG --input BUILT-PUBLIC-DIRECTORY --manifest DEALER-JSON --out runtime/NEW-DIRECTORY [--exclusions REVIEW-JSON] [--write]');
  const output = path.resolve(root, options['--out']);
  const relative = path.relative(path.join(root, 'runtime'), output);
  if (!relative || relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) throw new Error('Output must be a new directory under Cars/runtime');
  const manifest = JSON.parse(await fs.readFile(path.resolve(root, options['--manifest']), 'utf8'));
  if (manifest.schemaVersion !== 1 || manifest.slug !== options['--client']) throw new Error('Dealer manifest identity mismatch');
  const exclusions = options['--exclusions'] ? JSON.parse(await fs.readFile(path.resolve(root, options['--exclusions']), 'utf8')) : [];
  const result = await packagePublicAssets({ input: path.resolve(root, options['--input']), output, dealer: manifest.slug, variants: manifest.variants, exclusions, write });
  const verification = write ? await verifyPublicAssetBundle(output) : null;
  console.log(JSON.stringify({ mode: result.mode, dealer: result.dealer, output, ...result.summary, verification, deploymentPerformed: false, runtimeRenderingChanged: false }, null, 2));
  return result;
}
