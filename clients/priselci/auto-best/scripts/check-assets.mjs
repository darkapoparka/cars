import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const staticRoot = path.join(root, 'static');
const guardedMediaCount = 149; // Exact personalized inventory; see ../evidence/asset-baseline.json.
const sourceExtension = /\.(?:css|html|js|svelte|ts)$/i;
const mediaExtension = /\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)$/i;
const publicAssetReference = /\/(?:assets\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico)/gi;
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
  if (!mediaExtension.test(publicPath)) {
    errors.push(`Unexpected unguarded static file: ${publicPath}`);
  }
}

if (guardedStaticAssets.size !== guardedMediaCount) {
  errors.push(`Expected exactly ${guardedMediaCount} guarded static media files, found ${guardedStaticAssets.size}`);
}

if (referencedAssets.size !== guardedMediaCount) {
  errors.push(`Expected exactly ${guardedMediaCount} referenced public assets, found ${referencedAssets.size}`);
}

for (const reference of referencedAssets) {
  if (!guardedStaticAssets.has(reference)) errors.push(`Missing static asset for source reference: ${reference}`);
}

for (const publicPath of guardedStaticAssets) {
  if (publicPath !== '/favicon.ico' && !referencedAssets.has(publicPath)) {
    errors.push(`Unreferenced static media: ${publicPath}`);
  }
}

if (errors.length) {
  console.error(errors.sort().join('\n'));
  process.exit(1);
}

console.log(`Asset check passed: ${allStaticAssets.size} inventoried static files, ${guardedStaticAssets.size} guarded media files, ${referencedAssets.size} referenced public assets.`);
