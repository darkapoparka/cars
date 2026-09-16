import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const OFFICIAL_APP_ICON = 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/5d/a3/71/5da37113-2cfd-2a93-e59e-0b775452bf60/AppIcon-0-0-1x_U007emarketing-0-0-0-6-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png';
const sharpRoot = process.env.IS_AUTO_SHARP_ROOT;

if (!sharpRoot) {
  throw new Error('IS_AUTO_SHARP_ROOT is required to build the IS AUTO raster logo.');
}

const sharp = createRequire(path.join(sharpRoot, 'package.json'))('sharp');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.md', '.mjs', '.svelte', '.ts', '.tsx']);

async function exists(target) {
  return fs.access(target).then(() => true, () => false);
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
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

async function replaceInTree(directory, replacer) {
  for (const target of await walk(directory, (file) => textExtensions.has(path.extname(file).toLowerCase()))) {
    const before = await fs.readFile(target, 'utf8');
    const after = replacer(before, target);
    if (after !== before) await fs.writeFile(target, after, 'utf8');
  }
}

const response = await fetch(OFFICIAL_APP_ICON, {
  redirect: 'follow',
  headers: {
    'user-agent': 'Mozilla/5.0 (compatible; CarsLeadBuilder/1.0; +https://github.com/darkapoparka/cars)',
    accept: 'image/avif,image/webp,image/apng,image/png,image/jpeg,*/*;q=0.8'
  }
});
if (!response.ok) {
  throw new Error(`Official IS AUTO raster source returned HTTP ${response.status}.`);
}
const sourceBytes = Buffer.from(await response.arrayBuffer());
if (sourceBytes.length < 10_000) {
  throw new Error(`Official IS AUTO raster source is unexpectedly small (${sourceBytes.length} bytes).`);
}

const sourceMetadata = await sharp(sourceBytes).metadata();
const width = sourceMetadata.width ?? 0;
const height = sourceMetadata.height ?? 0;
if (width < 400 || height < 400) {
  throw new Error(`Official IS AUTO raster source is too small (${width}x${height}).`);
}

// Apple serves the square app icon centered inside a wider preview. Crop a central
// horizontal band that contains the real IS AUTO mark, not the rounded black tile.
const side = Math.min(width, height);
const squareLeft = Math.max(0, Math.floor((width - side) / 2));
const squareTop = Math.max(0, Math.floor((height - side) / 2));
const band = {
  left: squareLeft + Math.floor(side * 0.10),
  top: squareTop + Math.floor(side * 0.27),
  width: Math.floor(side * 0.80),
  height: Math.floor(side * 0.42)
};

const { data: rgba, info } = await sharp(sourceBytes)
  .extract(band)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildTransparentMark(mode) {
  const output = Buffer.alloc(rgba.length);
  for (let index = 0; index < rgba.length; index += 4) {
    const r = rgba[index];
    const g = rgba[index + 1];
    const b = rgba[index + 2];
    const sourceAlpha = rgba[index + 3] / 255;
    const maximum = Math.max(r, g, b);
    const minimum = Math.min(r, g, b);
    const chroma = maximum - minimum;
    const redPixel = r >= 70 && r > g * 1.32 && r > b * 1.32;
    const neutralPixel = chroma <= 48;

    let alpha = 0;
    if (redPixel) {
      alpha = sourceAlpha * clamp((r - 38) / 172, 0, 1);
      output[index] = 224;
      output[index + 1] = 24;
      output[index + 2] = 38;
    } else if (neutralPixel) {
      alpha = sourceAlpha * clamp((maximum - 72) / 150, 0, 1);
      const tone = mode === 'light' ? 255 : 24;
      output[index] = tone;
      output[index + 1] = tone;
      output[index + 2] = tone;
    }
    output[index + 3] = Math.round(clamp(alpha, 0, 1) * 255);
  }
  return output;
}

async function renderLogo(mode, pngTarget, webpTarget) {
  const cleaned = await sharp(buildTransparentMark(mode), {
    raw: { width: info.width, height: info.height, channels: 4 }
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize(1200, 320, {
      fit: 'contain',
      position: 'centre',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: false
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const metadata = await sharp(cleaned).metadata();
  if (metadata.width !== 1200 || metadata.height !== 320 || metadata.hasAlpha !== true) {
    throw new Error(`Refined ${mode} logo did not produce the expected transparent 1200x320 PNG.`);
  }

  await ensureDir(path.dirname(pngTarget));
  await fs.writeFile(pngTarget, cleaned);
  await fs.writeFile(
    webpTarget,
    await sharp(cleaned).webp({ quality: 96, alphaQuality: 100, effort: 6 }).toBuffer()
  );
}

const logoDestinations = [
  {
    dark: path.join(CLIENT, 'auto-best', 'static', 'assets', 'images', 'lead', 'isauto', 'logo-dark.png'),
    light: path.join(CLIENT, 'auto-best', 'static', 'assets', 'images', 'lead', 'isauto', 'logo-light.png')
  },
  {
    dark: path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-dark.png'),
    light: path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-light.png')
  },
  {
    dark: path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-dark.png'),
    light: path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-light.png')
  }
];

const generatedRoot = path.join(process.env.RUNNER_TEMP ?? path.join(ROOT, 'runtime'), 'isauto-official-raster-logo');
await ensureDir(generatedRoot);
const darkMaster = path.join(generatedRoot, 'isauto-logo-dark.png');
const lightMaster = path.join(generatedRoot, 'isauto-logo-light.png');
await renderLogo('dark', darkMaster, path.join(generatedRoot, 'isauto-logo-dark.webp'));
await renderLogo('light', lightMaster, path.join(generatedRoot, 'isauto-logo-light.webp'));

for (const destination of logoDestinations) {
  await ensureDir(path.dirname(destination.dark));
  await fs.copyFile(darkMaster, destination.dark);
  await fs.copyFile(lightMaster, destination.light);
  await fs.copyFile(
    path.join(generatedRoot, 'isauto-logo-dark.webp'),
    destination.dark.replace(/\.png$/i, '.webp')
  );
  await fs.copyFile(
    path.join(generatedRoot, 'isauto-logo-light.webp'),
    destination.light.replace(/\.png$/i, '.webp')
  );
}

// Remove the last inherited Sofia suffix from the Varna-only Modern experience.
const modernRuntimeRoots = [
  path.join(CLIENT, 'modern', 'apps'),
  path.join(CLIENT, 'modern', 'packages')
];
for (const runtimeRoot of modernRuntimeRoots) {
  await replaceInTree(runtimeRoot, (content) => content
    .replaceAll('Бизнес парк Варна, София', 'Бизнес парк Варна')
    .replaceAll('Бизнес парк Варна, гр. София', 'Бизнес парк Варна')
    .replaceAll('Business Park Varna, Sofia', 'Business Park Varna')
  );
}

for (const runtimeRoot of modernRuntimeRoots) {
  for (const target of await walk(runtimeRoot, (file) => textExtensions.has(path.extname(file).toLowerCase()))) {
    const content = await fs.readFile(target, 'utf8');
    if (/Бизнес парк Варна[^\n]{0,40}София|Business Park Varna[^\n]{0,40}Sofia/.test(content)) {
      throw new Error(`Inherited Sofia reference remains in the Varna Modern experience: ${target}`);
    }
  }
}

const provenancePath = path.join(CLIENT, 'assets', 'provenance.json');
if (await exists(provenancePath)) {
  const provenance = JSON.parse(await fs.readFile(provenancePath, 'utf8'));
  provenance.brand = {
    ...(provenance.brand ?? {}),
    source: 'https://apps.apple.com/bg/app/isauto/id6446795247',
    rasterSource: OFFICIAL_APP_ICON,
    implementation: 'Official IS AUTO raster identity cleaned into transparent dark/light PNG masters, with WebP derivatives. No SVG dealer logo is used at runtime.'
  };
  await fs.writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
}

for (const destination of logoDestinations) {
  for (const target of [destination.dark, destination.light]) {
    if (!(await exists(target))) throw new Error(`Missing refined raster logo: ${target}`);
    const metadata = await sharp(target).metadata();
    if (metadata.format !== 'png' || metadata.hasAlpha !== true || metadata.width !== 1200 || metadata.height !== 320) {
      throw new Error(`Invalid refined raster logo: ${target}`);
    }
  }
}

console.log([
  'IS AUTO official raster identity refined:',
  '- official App Store artwork used as the source;',
  '- transparent 1200x320 dark/light PNG masters and WebP derivatives written to all variants;',
  '- no SVG dealer logo used at runtime;',
  '- inherited Modern Sofia suffix removed from the Varna experience.'
].join('\n'));
