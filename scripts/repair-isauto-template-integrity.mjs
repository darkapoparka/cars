import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const AUTO_BEST = path.join(CLIENT, 'auto-best');
const MODERN = path.join(CLIENT, 'modern');
const CARWOW = path.join(CLIENT, 'carwow');
const AUTO_BEST_TEMPLATE = path.join(ROOT, 'templates', 'auto-best');
const MODERN_TEMPLATE = path.join(ROOT, 'templates', 'modern');
const CARWOW_TEMPLATE = path.join(ROOT, 'templates', 'carwow');
const scratch = await fs.mkdtemp(path.join(os.tmpdir(), 'isauto-template-integrity-'));

const textExtensions = new Set(['.html', '.js', '.json', '.md', '.mjs', '.svelte', '.ts', '.tsx']);
const mediaExtension = /\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)$/i;

async function exists(target) {
  return fs.access(target).then(() => true, () => false);
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function copyDirectory(source, destination) {
  if (!(await exists(source))) throw new Error(`Missing source directory: ${source}`);
  await fs.rm(destination, { recursive: true, force: true });
  await ensureDir(path.dirname(destination));
  await fs.cp(source, destination, { recursive: true, force: true });
}

async function copyFile(source, destination) {
  if (!(await exists(source))) throw new Error(`Missing source file: ${source}`);
  await ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
}

async function readText(target) {
  return fs.readFile(target, 'utf8');
}

async function writeText(target, value) {
  await fs.writeFile(target, value.endsWith('\n') ? value : `${value}\n`, 'utf8');
}

async function walk(directory, predicate = () => true) {
  const results = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...(await walk(target, predicate)));
    else if (predicate(target)) results.push(target);
  }
  return results;
}

async function replaceInFile(target, replacer) {
  const before = await readText(target);
  const after = replacer(before);
  if (after !== before) await writeText(target, after);
  return { before, after };
}

async function replaceInTree(directory, replacer) {
  for (const target of await walk(directory, (file) => textExtensions.has(path.extname(file).toLowerCase()))) {
    await replaceInFile(target, (content) => replacer(content, target));
  }
}

async function hashFile(target) {
  return crypto.createHash('sha256').update(await fs.readFile(target)).digest('hex');
}

async function assertTreesEqual(source, destination, ignoredRelativePaths = new Set()) {
  const sourceFiles = await walk(source);
  for (const sourceFile of sourceFiles) {
    const relative = path.relative(source, sourceFile).split(path.sep).join('/');
    if (ignoredRelativePaths.has(relative)) continue;
    const destinationFile = path.join(destination, relative);
    if (!(await exists(destinationFile))) throw new Error(`Template asset missing after restore: ${destinationFile}`);
    const [sourceHash, destinationHash] = await Promise.all([hashFile(sourceFile), hashFile(destinationFile)]);
    if (sourceHash !== destinationHash) throw new Error(`Template asset drift remains: ${destinationFile}`);
  }
}

// ---------------------------------------------------------------------------
// Auto Best: restore the approved template composition and artwork exactly.
// Keep only IS AUTO's raster logo and six localized inventory photos as an overlay.
// ---------------------------------------------------------------------------
const autoBestLeadTemplate = path.join(AUTO_BEST_TEMPLATE, 'static', 'assets', 'images', 'lead');
const autoBestLeadClient = path.join(AUTO_BEST, 'static', 'assets', 'images', 'lead');
const autoBestDealerAssets = path.join(autoBestLeadClient, 'isauto');
const autoBestDealerBackup = path.join(scratch, 'auto-best-isauto');

await copyDirectory(autoBestDealerAssets, autoBestDealerBackup);
await copyDirectory(autoBestLeadTemplate, autoBestLeadClient);
await copyDirectory(autoBestDealerBackup, autoBestDealerAssets);

// The template hero must remain the hero. The dealer-specific hero is not used here.
await fs.rm(path.join(autoBestDealerAssets, 'hero.webp'), { force: true });

// No verified IS AUTO YouTube channel: keep the section disabled. Also remove
// template stock artwork that is not consumed by this dealer's verified inventory.
const autoBestRemovedLeadAssets = [
  'day-night-video-g-class.jpg',
  'day-night-video-panamera.jpg',
  'day-night-video-urus.jpg',
  'day-night-stock-01.webp',
  'day-night-stock-02.webp',
  'day-night-stock-03.webp',
  'day-night-stock-04.webp',
  'day-night-stock-05.webp',
  'day-night-stock-06.webp'
];
for (const filename of autoBestRemovedLeadAssets) {
  await fs.rm(path.join(autoBestLeadClient, filename), { force: true });
}

await copyFile(
  path.join(AUTO_BEST_TEMPLATE, 'src', 'lib', 'data', 'home.ts'),
  path.join(AUTO_BEST, 'src', 'lib', 'data', 'home.ts')
);

const autoBestGenericDirectories = [
  'assets/images/icon-box',
  'assets/images/partner',
  'assets/images/brand-curated',
  'assets/images/template'
];
for (const relative of autoBestGenericDirectories) {
  const source = path.join(AUTO_BEST_TEMPLATE, 'static', relative);
  if (await exists(source)) {
    await copyDirectory(source, path.join(AUTO_BEST, 'static', relative));
  }
}
await fs.rm(path.join(AUTO_BEST, 'static', 'auto-best-icon.svg'), { force: true });

const autoBestAppHtml = path.join(AUTO_BEST, 'src', 'app.html');
await replaceInFile(autoBestAppHtml, (content) =>
  content.replace(
    '<link rel="icon" type="image/svg+xml" href="/auto-best-icon.svg" />',
    '<link rel="icon" type="image/png" href="/assets/images/lead/isauto/logo-dark.png" />'
  )
);

const autoBestAssetCheck = path.join(AUTO_BEST, 'scripts', 'check-assets.mjs');
const autoBestMediaFiles = await walk(path.join(AUTO_BEST, 'static'), (file) => mediaExtension.test(file));
await replaceInFile(autoBestAssetCheck, (content) => {
  if (!/const guardedMediaCount = \d+;/.test(content)) {
    throw new Error('Could not locate Auto Best guardedMediaCount.');
  }
  return content.replace(/const guardedMediaCount = \d+;/, `const guardedMediaCount = ${autoBestMediaFiles.length};`);
});

await assertTreesEqual(autoBestLeadTemplate, autoBestLeadClient, new Set(autoBestRemovedLeadAssets));

const autoBestHome = await readText(path.join(AUTO_BEST, 'src', 'lib', 'data', 'home.ts'));
const templateHome = await readText(path.join(AUTO_BEST_TEMPLATE, 'src', 'lib', 'data', 'home.ts'));
if (autoBestHome !== templateHome) throw new Error('Auto Best home data is not template-identical.');
if ((await readText(autoBestAppHtml)).includes('auto-best-icon.svg')) {
  throw new Error('Auto Best still references the inherited SVG favicon.');
}

// ---------------------------------------------------------------------------
// Modern: preserve every template stylesheet and the approved lead hero.
// Dealer identity, inventory and raster logos remain the only overlay.
// ---------------------------------------------------------------------------
const modernTemplateCssFiles = await walk(
  MODERN_TEMPLATE,
  (file) => path.extname(file).toLowerCase() === '.css'
);
for (const source of modernTemplateCssFiles) {
  const relative = path.relative(MODERN_TEMPLATE, source);
  await copyFile(source, path.join(MODERN, relative));
}
await fs.rm(path.join(MODERN, 'apps', 'web', 'public', 'isauto', 'hero.webp'), { force: true });

const modernLeadSite = path.join(MODERN, 'packages', 'marketplace', 'lead-site.ts');
await replaceInFile(modernLeadSite, (content) => content
  .replace(/heroPath:\s*"[^"]+"/, 'heroPath: "/lead-hero.jpg"')
  .replaceAll('"/isauto/', '"/variant-2/isauto/')
  .replaceAll("'/isauto/", "'/variant-2/isauto/")
  .replaceAll('"/lead-sell-', '"/variant-2/lead-sell-')
  .replaceAll("'/lead-sell-", "'/variant-2/lead-sell-")
  .replaceAll('"/images/services/', '"/variant-2/images/services/')
  .replaceAll("'/images/services/", "'/variant-2/images/services/")
  .replaceAll('/variant-2/variant-2/', '/variant-2/')
);

const modernMockData = path.join(MODERN, 'packages', 'marketplace-domain', 'testing', 'mock-data.ts');
await replaceInFile(modernMockData, (content) => content
  .replaceAll('"/isauto/', '"/variant-2/isauto/')
  .replaceAll("'/isauto/", "'/variant-2/isauto/")
  .replaceAll('/variant-2/variant-2/', '/variant-2/')
);

// Catch any dealer-raster references introduced by another generated data consumer.
const modernRuntimeRoots = [path.join(MODERN, 'apps'), path.join(MODERN, 'packages')];
for (const runtimeRoot of modernRuntimeRoots) {
  await replaceInTree(runtimeRoot, (content) => content
    .replaceAll('"/isauto/', '"/variant-2/isauto/')
    .replaceAll("'/isauto/", "'/variant-2/isauto/")
    .replaceAll('/variant-2/variant-2/', '/variant-2/')
  );
}

const modernTextFiles = (await Promise.all(modernRuntimeRoots.map((runtimeRoot) =>
  walk(runtimeRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))
))).flat();
for (const target of modernTextFiles) {
  const content = await readText(target);
  if (/['"]\/isauto\//.test(content)) {
    throw new Error(`Unprefixed Modern IS AUTO asset remains: ${target}`);
  }
}
for (let index = 1; index <= 6; index += 1) {
  const inventoryAsset = path.join(MODERN, 'apps', 'web', 'public', 'isauto', `inventory-${index}.webp`);
  if (!(await exists(inventoryAsset))) throw new Error(`Missing Modern inventory asset: ${inventoryAsset}`);
}
for (const filename of ['logo-dark.png', 'logo-light.png']) {
  const target = path.join(MODERN, 'apps', 'web', 'public', 'isauto', filename);
  if (!(await exists(target))) throw new Error(`Missing Modern dealer asset: ${target}`);
}

// ---------------------------------------------------------------------------
// Carwow: preserve the latest template media, fix localized number parsing,
// and remove inherited SVG/Day & Night dealer branding from metadata.
// ---------------------------------------------------------------------------
const carwowTemplateDealerMedia = path.join(CARWOW_TEMPLATE, 'static', 'assets', 'daynight');
const carwowClientDealerMedia = path.join(CARWOW, 'static', 'assets', 'daynight');
if (await exists(carwowTemplateDealerMedia)) {
  await copyDirectory(carwowTemplateDealerMedia, carwowClientDealerMedia);
  await assertTreesEqual(carwowTemplateDealerMedia, carwowClientDealerMedia);
}

const carwowVehicles = path.join(CARWOW, 'src', 'lib', 'data', 'daynight-vehicles.ts');
await replaceInFile(carwowVehicles, (content) => {
  const parserPattern = /const parseLocalizedNumber = \(value: string\) => \{[\s\S]*?\r?\n\};(?:\r?\n)*/;
  const parser = `const parseLocalizedNumber = (value: string) => {\n  const normalized = value\n    .replace(/[\\s\\u00a0\\u202f]/g, '')\n    .replace(',', '.')\n    .replace(/[^\\d.-]/g, '');\n  return Number(normalized);\n};\n\n`;
  if (!parserPattern.test(content)) throw new Error('Could not locate Carwow localized-number parser.');
  return content.replace(parserPattern, parser);
});

await fs.rm(path.join(CARWOW, 'static', 'assets', 'isauto', 'hero.webp'), { force: true });

const carwowRuntimeRoots = [path.join(CARWOW, 'src'), path.join(CARWOW, 'static')];
for (const runtimeRoot of carwowRuntimeRoots) {
  await replaceInTree(runtimeRoot, (content) => {
    const hadSvgOg = content.includes('daynight-og.svg');
    let next = content
      .replaceAll('/brand/daynight-og.svg', '/assets/daynight/hero/home-05-showroom-exterior.webp')
      .replaceAll('brand/daynight-og.svg', 'assets/daynight/hero/home-05-showroom-exterior.webp')
      .replaceAll('/assets/isauto/hero.webp', '/assets/daynight/hero/home-05-showroom-exterior.webp')
      .replaceAll('assets/isauto/hero.webp', 'assets/daynight/hero/home-05-showroom-exterior.webp')
      .replaceAll('/brand/daynight-logo-generated.png', '/brand/isauto-logo-dark.png')
      .replaceAll('brand/daynight-logo-generated.png', 'brand/isauto-logo-dark.png')
      .replaceAll('daynight-favicon.png', 'isauto-logo-dark.png');
    if (hadSvgOg) next = next.replaceAll('image/svg+xml', 'image/webp').replaceAll('image/png', 'image/webp');
    return next;
  });
}

const carwowTextFiles = (await Promise.all(carwowRuntimeRoots.map((runtimeRoot) =>
  walk(runtimeRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))
))).flat();
for (const target of carwowTextFiles) {
  const content = await readText(target);
  if (content.includes('daynight-og.svg')) throw new Error(`Inherited SVG OG branding remains: ${target}`);
  if (content.includes('daynight-logo-generated.png')) throw new Error(`Inherited dealer logo remains: ${target}`);
}

const carwowVehicleSource = await readText(carwowVehicles);
if (!carwowVehicleSource.includes(".replace(/[^\\d.-]/g, '')")) {
  throw new Error('Carwow localized number parser was not hardened.');
}

for (const filename of ['isauto-logo-dark.png', 'isauto-logo-light.png']) {
  const target = path.join(CARWOW, 'static', 'brand', filename);
  if (!(await exists(target))) throw new Error(`Missing Carwow raster logo: ${target}`);
}
for (let index = 1; index <= 6; index += 1) {
  const inventoryAsset = path.join(CARWOW, 'static', 'assets', 'isauto', `inventory-${index}.webp`);
  if (!(await exists(inventoryAsset))) throw new Error(`Missing Carwow inventory asset: ${inventoryAsset}`);
}

console.log([
  'IS AUTO template integrity restored:',
  '- Auto Best template hero/action artwork restored; dealer PNG logo and inventory retained.',
  '- Modern dealer assets are mounted under /variant-2.',
  '- Carwow numeric inventory and budget parsing repaired; raster metadata enforced.'
].join('\n'));
