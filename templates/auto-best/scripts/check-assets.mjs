import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const staticRoot = path.join(root, 'static');
// Includes the reviewed 960px and 480px Contact and advice banner encodings.
// The mobile Audi chrome mark is a separate responsive source.
// Four generated Home section backdrops extend the guarded media inventory.
// The mobile Volkswagen badge is a curated Home shortcut.
// The Home advice banner has a separate editorial plate.
const guardedMediaCount = 177;
// Preserve the two earlier local Home scene options for provenance.
const homeScenePrototypes = ['/assets/images/template/home-sell-handover-v1.webp', '/assets/images/template/home-finance-scene-v1.webp'];
// Preserve source identity/artwork for provenance; the default logo and icon are Auto Best.
const retainedSourceAssets = new Set(['/assets/images/template/service-sell-key-v1.png', '/assets/images/icon-box/car-list4.png', '/assets/images/icon-box/car-list7.png', '/assets/images/lead/day-night-guide-import.webp', '/assets/images/lead/day-night-guide-inspection.webp', '/assets/images/lead/day-night-guide-leasing.webp', '/assets/images/lead/day-night-home-hero-v3.webp', '/assets/images/lead/day-night-home-black-v1.webp', '/assets/images/lead/day-night-logo.png', '/favicon.ico', '/assets/images/section/car-slide1.png', '/assets/images/section/car-slide2.png', '/assets/images/section/car-slide3.png']);
// The Home advice section now uses editorial artwork instead of this graphite plate.
retainedSourceAssets.add('/assets/images/template/home-section-guides-backdrop-v1.webp');
// The solid About banner no longer requests this photograph; retain its source provenance.
retainedSourceAssets.add('/assets/images/section/bg-12.jpg');
// Preserve the previous editorial hero photograph as source history.
retainedSourceAssets.add('/assets/images/lead/day-night-blog-hero-v2.webp');
// Earlier desktop showroom proposals remain archived for provenance.
for (const name of ['home', 'inventory', 'contact']) retainedSourceAssets.add(`/assets/images/lead/auto-best-desktop-${name}-v1.webp`);
// These proposals were rejected for warm colour or distorted props. Reuse reviewed cutouts instead.
retainedSourceAssets.add('/assets/images/lead/auto-best-desktop-about-v1.webp');
for (const name of ['blog', 'contact']) retainedSourceAssets.add(`/assets/images/lead/auto-best-desktop-${name}-v2.webp`);
for (const asset of homeScenePrototypes) retainedSourceAssets.add(asset);
// Rejected desktop section images remain available as source history, without runtime requests.
for (const name of ['inventory', 'body', 'brands', 'guides']) retainedSourceAssets.add(`/assets/images/template/home-section-${name}-v1.webp`);
for (const name of ['sell', 'import', 'finance']) retainedSourceAssets.add(`/assets/images/template/home-action-${name}-v2.webp`);
// Previous identity and the untouched generated source remain available for provenance.
retainedSourceAssets.add('/assets/images/template/auto-best-logo.svg');
retainedSourceAssets.add('/assets/images/template/auto-best-logo-light.svg');
retainedSourceAssets.add('/assets/images/template/auto-best-logo-v2-source.png');
// Full-resolution originals remain available; the runtime uses smaller optimized encodings.
retainedSourceAssets.add('/assets/images/template/auto-best-logo-v2.svg');
retainedSourceAssets.add('/assets/images/template/auto-best-logo-v2-light.svg');
retainedSourceAssets.add('/assets/images/template/body-wagon-v1.png');
// Previous campaign art is retained for provenance; active cards use front-facing compositions.
for (const name of ['day-night-mobile-sell-v1.webp', 'day-night-mobile-import-v1.webp', 'day-night-sell-banner-v2.webp']) retainedSourceAssets.add('/assets/images/lead/' + name);
retainedSourceAssets.add('/assets/images/template/service-sell-euros-v1.webp');
retainedSourceAssets.add('/assets/images/template/service-import-v1.webp');
retainedSourceAssets.add('/assets/images/template/service-sell-v2.webp');
retainedSourceAssets.add('/assets/images/template/service-import-v2.webp');
// Preserve the previous finance campaign image; mobile now uses the keys composition.
retainedSourceAssets.add('/assets/images/template/pdp-finance-studio-v1.jpg');
// Original low-resolution body illustrations remain available as source references.
for (const number of [1, 2, 3, 8]) retainedSourceAssets.add(`/assets/images/icon-box/car-list${number}.png`);
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

if (guardedStaticAssets.size !== guardedMediaCount) {
  errors.push(`Expected exactly ${guardedMediaCount} guarded static media files, found ${guardedStaticAssets.size}`);
}

const referencedAndRetained = new Set([...referencedAssets, ...retainedSourceAssets]);
if (referencedAndRetained.size !== guardedMediaCount) {
  errors.push(`Expected exactly ${guardedMediaCount} referenced or retained public assets, found ${referencedAndRetained.size}`);
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
