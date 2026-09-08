import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const staticRoot = path.join(root, 'static');
const retainedSourceAssets = new Set(['/assets/images/lead/day-night-home-hero-v3.webp', '/assets/images/lead/day-night-home-black-v1.webp']);
const sourceExtension = /\.(?:css|html|js|json|svelte|ts)$/i;
const mediaExtension = /\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)$/i;
const publicAssetReference = /\/(?:(?:assets|navara)\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico)/gi;
const legacyRuntimeNames = [
  'best-home.css',
  'best-home.js',
  'day-night-desktop.css',
  'day-night-desktop.js',
  'day-night-header-bootstrap.js',
  'day-night-site.css',
  'day-night-site.js'
];
const retiredRuntimeDirectories = ['/_next/', '/legacy-pages/'];

const walk = async (directory, predicate) => {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute, predicate)));
    else if (predicate(entry.name)) files.push(absolute);
  }

  return files;
};

const toPublicPath = (absolute) => `/${path.relative(staticRoot, absolute).split(path.sep).join('/')}`;
const sourceFiles = await walk(sourceRoot, (name) => sourceExtension.test(name));
const allStaticFiles = await walk(staticRoot, () => true);
const guardedMediaFiles = allStaticFiles.filter((file) => mediaExtension.test(file));
const referencedAssets = new Set();
const errors = [];

for (const file of sourceFiles) {
  const source = await readFile(file, 'utf8');
  const relative = path.relative(root, file);

  for (const match of source.matchAll(publicAssetReference)) referencedAssets.add(match[0]);

  const lowerSource = source.toLowerCase();
  for (const legacyName of legacyRuntimeNames) {
    if (lowerSource.includes(legacyName)) {
      errors.push(`${relative}: references retired runtime asset ${legacyName}`);
    }
  }
}

const allStaticAssets = new Set(allStaticFiles.map(toPublicPath));
const guardedStaticAssets = new Set(guardedMediaFiles.map(toPublicPath));

for (const publicPath of allStaticAssets) {
  const lowerPath = publicPath.toLowerCase();
  const legacyName = legacyRuntimeNames.find((name) => lowerPath.endsWith(`/${name}`));
  const legacyDirectory = retiredRuntimeDirectories.find((directory) => lowerPath.includes(directory));

  if (legacyName) errors.push(`Retired runtime asset exists in static/: ${publicPath}`);
  if (legacyDirectory) errors.push(`Retired runtime directory exists in static/: ${publicPath}`);
  if (!mediaExtension.test(publicPath) && !/\.(?:md|webmanifest)$/.test(publicPath)) {
    errors.push(`Unexpected unguarded static file: ${publicPath}`);
  }
}

for (const reference of referencedAssets) {
  if (!guardedStaticAssets.has(reference)) errors.push(`Missing static asset for source reference: ${reference}`);
}

// Independent client copies retain source assets for provenance. Their count is
// not a template acceptance condition; validate every wired asset and gallery.
const stock = JSON.parse(await readFile(path.join(sourceRoot, 'lib/data/navara-data.json'), 'utf8'));
for (const vehicle of stock.vehicles) {
  if (vehicle.images.length < 2) errors.push(`Incomplete gallery: ${vehicle.sourceId}`);
  for (const image of vehicle.images) {
    if (!image.startsWith('/navara/') || !guardedStaticAssets.has(image)) errors.push(`Missing local listing photo: ${image}`);
  }
}

if (errors.length) {
  console.error(errors.sort().join('\n'));
  process.exit(1);
}

console.log(`Asset check passed: ${allStaticAssets.size} inventoried static files, ${guardedStaticAssets.size} guarded media files, ${referencedAssets.size} referenced public assets.`);
