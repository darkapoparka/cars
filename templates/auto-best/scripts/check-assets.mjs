import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const staticRoot = path.join(root, 'static');
// Preserve source identity/artwork for provenance; the default logo and icon are Auto Best.
const retainedSourceAssets = new Set(['/assets/images/template/service-sell-key-v1.webp', '/assets/images/icon-box/car-list4.png', '/assets/images/icon-box/car-list7.png', '/assets/images/lead/day-night-guide-import.webp', '/assets/images/lead/day-night-guide-inspection.webp', '/assets/images/lead/day-night-guide-leasing.webp', '/assets/images/lead/day-night-home-hero-v3.webp', '/assets/images/lead/day-night-home-black-v1.webp', '/assets/images/lead/day-night-logo.png', '/favicon.ico', '/assets/images/section/car-slide1.png', '/assets/images/section/car-slide2.png', '/assets/images/section/car-slide3.png']);
const sourceExtension = /\.(?:css|html|js|svelte|ts)$/i;
const mediaExtension = /\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)$/i;
const publicAssetReference = /\/(?:assets\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico|auto-best-icon\.svg)/gi;
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


// Validate content as well as ownership: a zero-byte or mislabeled export is not an asset.
for (const file of guardedMediaFiles) {
  const bytes = await readFile(file);
  const ext = path.extname(file).toLowerCase();
  const valid = bytes.length > 0 && (
    ext === '.png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
    ext === '.webp' ? bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' :
    ['.jpg', '.jpeg'].includes(ext) ? bytes[0] === 255 && bytes[1] === 216 :
    ext === '.svg' ? /<svg[\s>]/.test(bytes.toString('utf8')) : true
  );
  if (!valid) errors.push(`Invalid or empty media: ${toPublicPath(file)}`);
}
for (const reference of retainedSourceAssets) {
  if (!guardedStaticAssets.has(reference)) errors.push(`Missing retained provenance asset: ${reference}`);
}

for (const reference of referencedAssets) {
  if (!guardedStaticAssets.has(reference)) errors.push(`Missing static asset for source reference: ${reference}`);
}

for (const publicPath of guardedStaticAssets) {
  if (publicPath !== '/favicon.ico' && !referencedAssets.has(publicPath) && !retainedSourceAssets.has(publicPath)) {
    errors.push(`Unreferenced static media: ${publicPath}`);
  }
}

if (errors.length) {
  console.error(errors.sort().join('\n'));
  process.exit(1);
}

console.log(`Asset check passed: ${allStaticAssets.size} inventoried static files, ${guardedStaticAssets.size} guarded media files, ${referencedAssets.size} referenced public assets.`);
