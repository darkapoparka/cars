import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const AUTO_BEST = path.join(CLIENT, 'auto-best');
const AUTO_BEST_TEMPLATE = path.join(ROOT, 'templates', 'auto-best');
const generatedRoot = path.join(
  process.env.RUNNER_TEMP ?? path.join(ROOT, 'runtime'),
  'isauto-official-raster-logo'
);
const archiveRoot = path.join(CLIENT, 'assets', 'brand');

const exists = (target) => fs.access(target).then(() => true, () => false);
const ensureDir = (target) => fs.mkdir(target, { recursive: true });

async function walk(directory, predicate = () => true) {
  const files = [];
  if (!(await exists(directory))) return files;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(target, predicate)));
    else if (predicate(target)) files.push(target);
  }
  return files;
}

await ensureDir(archiveRoot);

const generatedDarkPng = path.join(generatedRoot, 'isauto-logo-dark.png');
const generatedLightPng = path.join(generatedRoot, 'isauto-logo-light.png');
const generatedDarkWebp = path.join(generatedRoot, 'isauto-logo-dark.webp');
const generatedLightWebp = path.join(generatedRoot, 'isauto-logo-light.webp');

const brandPackRoots = [
  path.join(CLIENT, 'assets', 'brand'),
  path.join(AUTO_BEST, 'static', 'assets', 'brand'),
  path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'assets', 'brand'),
  path.join(CLIENT, 'carwow', 'static', 'assets', 'brand')
];
for (const brandRoot of brandPackRoots) {
  await ensureDir(brandRoot);
  await fs.copyFile(generatedDarkPng, path.join(brandRoot, 'logo-master.png'));
  await fs.copyFile(generatedDarkWebp, path.join(brandRoot, 'logo-on-light.webp'));
  await fs.copyFile(generatedLightWebp, path.join(brandRoot, 'logo-on-dark.webp'));
  await fs.copyFile(generatedLightWebp, path.join(brandRoot, 'logo-on-accent.webp'));
  await fs.rm(path.join(brandRoot, 'logo-universal.webp'), { force: true });
}

for (const mode of ['dark', 'light']) {
  const generated = path.join(generatedRoot, `isauto-logo-${mode}.webp`);
  const archived = path.join(archiveRoot, `isauto-logo-${mode}.webp`);
  await fs.copyFile(generated, archived);
}

const runtimeDerivatives = [
  path.join(AUTO_BEST, 'static', 'assets', 'images', 'lead', 'isauto', 'logo-dark.webp'),
  path.join(AUTO_BEST, 'static', 'assets', 'images', 'lead', 'isauto', 'logo-light.webp'),
  path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-dark.webp'),
  path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-light.webp'),
  path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-dark.webp'),
  path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-light.webp')
];
for (const target of runtimeDerivatives) await fs.rm(target, { force: true });

// Normalize Auto Best onto one explicit dealer-asset contract. The build script
// creates the refined files under its historical path; publish only /dealer/*.
const legacyAutoBestDealer = path.join(AUTO_BEST, 'static', 'assets', 'images', 'lead', 'isauto');
const autoBestDealer = path.join(AUTO_BEST, 'static', 'dealer');
await ensureDir(autoBestDealer);
for (let index = 1; index <= 6; index += 1) {
  await fs.copyFile(
    path.join(legacyAutoBestDealer, `inventory-${index}.webp`),
    path.join(autoBestDealer, `inventory-${index}.webp`)
  );
}
for (const filename of ['logo-dark.png', 'logo-light.png']) {
  await fs.copyFile(
    path.join(legacyAutoBestDealer, filename),
    path.join(autoBestDealer, filename)
  );
}

const autoBestSourceFiles = await walk(
  path.join(AUTO_BEST, 'src'),
  (file) => /\.(?:css|html|js|svelte|ts)$/i.test(file)
);
for (const target of autoBestSourceFiles) {
  const before = await fs.readFile(target, 'utf8');
  const after = before
    .replaceAll('/assets/images/lead/isauto/logo-dark.png', '/assets/brand/logo-on-light.webp')
    .replaceAll('/assets/images/lead/isauto/logo-light.png', '/assets/brand/logo-on-dark.webp')
    .replaceAll('/dealer/logo-dark.png', '/assets/brand/logo-on-light.webp')
    .replaceAll('/dealer/logo-light.png', '/assets/brand/logo-on-dark.webp')
    .replaceAll('/assets/images/lead/isauto/', '/dealer/')
    .replaceAll('assets/images/lead/isauto/', 'dealer/');
  if (after !== before) await fs.writeFile(target, after, 'utf8');
}
await fs.rm(legacyAutoBestDealer, { recursive: true, force: true });

for (const root of [
  path.join(CLIENT, 'modern', 'apps'),
  path.join(CLIENT, 'modern', 'packages')
]) {
  for (const target of await walk(root, (file) => /\.(?:js|jsx|mjs|ts|tsx)$/i.test(file))) {
    const before = await fs.readFile(target, 'utf8');
    let after = before
      .replaceAll('/variant-2/isauto/logo-light.png', '/variant-2/assets/brand/logo-on-dark.webp')
      .replaceAll('/variant-2/isauto/logo-dark.png', '/variant-2/assets/brand/logo-on-light.webp');
    after = after.replace(/(logoPath\s*:\s*)["'][^"']+["']/g, '$1"/variant-2/assets/brand/logo-on-dark.webp"');
    if (after !== before) await fs.writeFile(target, after, 'utf8');
  }
}
for (const target of await walk(path.join(CLIENT, 'carwow', 'src'), (file) => /\.(?:js|mjs|svelte|ts)$/i.test(file))) {
  const before = await fs.readFile(target, 'utf8');
  let after = before
    .replaceAll('/brand/isauto-logo-light.png', '/variant-3/assets/brand/logo-on-dark.webp')
    .replaceAll('/brand/isauto-logo-dark.png', '/variant-3/assets/brand/logo-on-light.webp');
  after = after
    .replace(/(logoLight\s*:\s*)["'][^"']+["']/g, '$1"/variant-3/assets/brand/logo-on-dark.webp"')
    .replace(/(logoDark\s*:\s*)["'][^"']+["']/g, '$1"/variant-3/assets/brand/logo-on-accent.webp"');
  if (after !== before) await fs.writeFile(target, after, 'utf8');
}

// These media remain referenced by approved template-owned data and components,
// even when a dealer has no verified videos or uses its own inventory records.
const retainedTemplateLeadMedia = [
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
for (const filename of retainedTemplateLeadMedia) {
  await fs.copyFile(
    path.join(AUTO_BEST_TEMPLATE, 'static', 'assets', 'images', 'lead', filename),
    path.join(AUTO_BEST, 'static', 'assets', 'images', 'lead', filename)
  );
}

// Dealer branding replaces the two template wordmarks and template favicon.
for (const target of [
  path.join(AUTO_BEST, 'static', 'assets', 'images', 'template', 'auto-best-logo.svg'),
  path.join(AUTO_BEST, 'static', 'assets', 'images', 'template', 'auto-best-logo-light.svg'),
  path.join(AUTO_BEST, 'static', 'auto-best-icon.svg')
]) {
  await fs.rm(target, { force: true });
}

const mediaExtension = /\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)$/i;
const mediaFiles = await walk(path.join(AUTO_BEST, 'static'), (file) => mediaExtension.test(file));
const assetCheck = path.join(AUTO_BEST, 'scripts', 'check-assets.mjs');
const assetCheckBefore = await fs.readFile(assetCheck, 'utf8');
if (!/const guardedMediaCount = \d+;/.test(assetCheckBefore)) {
  throw new Error('Could not locate Auto Best guardedMediaCount after dealer finalization.');
}
const dealerAssetReference =
  "const publicAssetReference = /\\/(?:(?:assets|dealer)\\/[A-Za-z0-9._@%+~/-]+\\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\\.ico|auto-best-icon\\.svg)/gi;";
const assetCheckWithDealerRefs = assetCheckBefore.replace(
  /const publicAssetReference = [^\n]+;/,
  dealerAssetReference
);
if (assetCheckWithDealerRefs === assetCheckBefore) {
  throw new Error('Could not extend Auto Best publicAssetReference for /dealer assets.');
}
await fs.writeFile(
  assetCheck,
  assetCheckWithDealerRefs.replace(
    /const guardedMediaCount = \d+;/,
    `const guardedMediaCount = ${mediaFiles.length};`
  ),
  'utf8'
);

const provenancePath = path.join(CLIENT, 'assets', 'provenance.json');
const provenance = JSON.parse(await fs.readFile(provenancePath, 'utf8'));
provenance.brand = {
  ...(provenance.brand ?? {}),
  implementation: 'Official IS AUTO raster identity cleaned into transparent contextual raster assets. All three variants publish logo-master.png plus logo-on-light.webp, logo-on-dark.webp and logo-on-accent.webp; legacy PNG dealer files remain only as compatibility fallbacks.',
  webpDerivatives: [
    'assets/brand/logo-on-light.webp',
    'assets/brand/logo-on-dark.webp',
    'assets/brand/logo-on-accent.webp'
  ]
};
await fs.writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');

for (const target of runtimeDerivatives) {
  if (await exists(target)) throw new Error(`Unused runtime logo derivative remains: ${target}`);
}
for (let index = 1; index <= 6; index += 1) {
  if (!(await exists(path.join(autoBestDealer, `inventory-${index}.webp`)))) {
    throw new Error(`Missing normalized Auto Best dealer inventory image ${index}.`);
  }
}
for (const filename of ['logo-dark.png', 'logo-light.png']) {
  if (!(await exists(path.join(autoBestDealer, filename)))) {
    throw new Error(`Missing normalized Auto Best dealer logo: ${filename}`);
  }
}

console.log(`IS AUTO assets finalized: ${mediaFiles.length} guarded Auto Best media files, shared /dealer/ runtime contract, approved template media restored.`);
