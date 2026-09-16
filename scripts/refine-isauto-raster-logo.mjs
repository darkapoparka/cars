import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const OFFICIAL_LOGO =
  'https://www.isauto.net/assets/logo-cf0718a1710eaf3a212a58eb9a20c0d17527708d0fcd27bb8bf5a2433907dbdd.png';
const sharpRoot = process.env.IS_AUTO_SHARP_ROOT;

if (!sharpRoot) {
  throw new Error('IS_AUTO_SHARP_ROOT is required to build the IS AUTO raster logo.');
}

const sharp = createRequire(path.join(sharpRoot, 'package.json'))('sharp');
const textExtensions = new Set(['.html', '.js', '.json', '.md', '.mjs', '.svelte', '.ts', '.tsx']);
const TARGET_RED = [238, 28, 42];
const TARGET_DARK = [31, 27, 29];
const TARGET_LIGHT = [255, 255, 255];

async function exists(target) {
  return fs.access(target).then(() => true, () => false);
}

async function ensureDir(target) {
  await fs.mkdir(target, { recursive: true });
}

async function walk(directory, predicate = () => true) {
  const results = [];
  if (!(await exists(directory))) return results;
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

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.max(minimum, Math.min(maximum, value));

function alphaBounds(data, width, height) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha < 8) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX || maxY < minY) {
    throw new Error('IS AUTO logo has no visible alpha bounds.');
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}

const response = await fetch(OFFICIAL_LOGO, {
  redirect: 'follow',
  headers: {
    'user-agent': 'Mozilla/5.0 (compatible; CarsLeadBuilder/1.0; +https://github.com/darkapoparka/cars)',
    accept: 'image/avif,image/webp,image/apng,image/png,image/jpeg,*/*;q=0.8'
  }
});
if (!response.ok) {
  throw new Error(`Official IS AUTO logo returned HTTP ${response.status}.`);
}
const sourceBytes = Buffer.from(await response.arrayBuffer());
if (sourceBytes.length < 10_000) {
  throw new Error(`Official IS AUTO logo is unexpectedly small (${sourceBytes.length} bytes).`);
}

const sourceMetadata = await sharp(sourceBytes).metadata();
if ((sourceMetadata.width ?? 0) < 500 || (sourceMetadata.height ?? 0) < 150) {
  throw new Error(
    `Official IS AUTO logo is too small (${sourceMetadata.width}x${sourceMetadata.height}).`
  );
}

const { data: sourceRgb, info: sourceInfo } = await sharp(sourceBytes)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

function transparentOfficialMark(mode) {
  const neutral = mode === 'light' ? TARGET_LIGHT : TARGET_DARK;
  const output = Buffer.alloc(sourceInfo.width * sourceInfo.height * 4);

  for (
    let sourceIndex = 0, outputIndex = 0;
    sourceIndex < sourceRgb.length;
    sourceIndex += 3, outputIndex += 4
  ) {
    const r = sourceRgb[sourceIndex];
    const g = sourceRgb[sourceIndex + 1];
    const b = sourceRgb[sourceIndex + 2];

    // The source is the dealership's official red/black wordmark on white.
    // Recover the original antialiasing while removing only that white field.
    const redPixel = r > 105 && r > g + 3 && r > b + 3;
    let alpha;
    let target;

    if (redPixel) {
      const alphaFromGreen = (255 - g) / (255 - TARGET_RED[1]);
      const alphaFromBlue = (255 - b) / (255 - TARGET_RED[2]);
      alpha = clamp(Math.max(alphaFromGreen, alphaFromBlue));
      target = TARGET_RED;
    } else {
      const average = (r + g + b) / 3;
      alpha = clamp((255 - average) / (255 - 28));
      target = neutral;
    }

    alpha = alpha < 0.018 ? 0 : Math.pow(alpha, 0.94);
    output[outputIndex] = target[0];
    output[outputIndex + 1] = target[1];
    output[outputIndex + 2] = target[2];
    output[outputIndex + 3] = Math.round(alpha * 255);
  }

  return output;
}

async function validateLogo(buffer, label) {
  const metadata = await sharp(buffer).metadata();
  const raw = await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const bounds = alphaBounds(raw.data, raw.info.width, raw.info.height);
  const horizontalCoverage = bounds.width / raw.info.width;
  const verticalCoverage = bounds.height / raw.info.height;
  const aspectRatio = raw.info.width / raw.info.height;

  if (
    metadata.format !== 'png' ||
    metadata.hasAlpha !== true ||
    raw.info.width !== 1200 ||
    raw.info.height < 350 ||
    raw.info.height > 480
  ) {
    throw new Error(
      `${label}: expected a transparent, tightly framed 1200px PNG; got ` +
      `${metadata.format} ${raw.info.width}x${raw.info.height}.`
    );
  }
  if (aspectRatio < 2.5 || aspectRatio > 3.4) {
    throw new Error(`${label}: invalid aspect ratio ${aspectRatio.toFixed(3)}.`);
  }
  if (horizontalCoverage < 0.90 || verticalCoverage < 0.78) {
    throw new Error(
      `${label}: excessive transparent padding ` +
      `(coverage ${horizontalCoverage.toFixed(3)} × ${verticalCoverage.toFixed(3)}).`
    );
  }

  return {
    width: raw.info.width,
    height: raw.info.height,
    bounds,
    horizontalCoverage,
    verticalCoverage,
    aspectRatio
  };
}

async function renderLogo(mode, pngTarget, webpTarget) {
  const transparent = transparentOfficialMark(mode);
  const rendered = await sharp(transparent, {
    raw: {
      width: sourceInfo.width,
      height: sourceInfo.height,
      channels: 4
    }
  })
    .trim({
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      threshold: 3
    })
    .resize({
      width: 1136,
      fit: 'inside',
      withoutEnlargement: false
    })
    .extend({
      left: 32,
      right: 32,
      top: 20,
      bottom: 20,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false
    })
    .toBuffer();

  const geometry = await validateLogo(rendered, `${mode} logo`);
  await ensureDir(path.dirname(pngTarget));
  await fs.writeFile(pngTarget, rendered);
  await fs.writeFile(
    webpTarget,
    await sharp(rendered)
      .webp({ quality: 96, alphaQuality: 100, effort: 6 })
      .toBuffer()
  );

  return geometry;
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

const generatedRoot = path.join(
  process.env.RUNNER_TEMP ?? path.join(ROOT, 'runtime'),
  'isauto-official-raster-logo'
);
await ensureDir(generatedRoot);
const darkMaster = path.join(generatedRoot, 'isauto-logo-dark.png');
const lightMaster = path.join(generatedRoot, 'isauto-logo-light.png');
const darkGeometry = await renderLogo(
  'dark',
  darkMaster,
  path.join(generatedRoot, 'isauto-logo-dark.webp')
);
const lightGeometry = await renderLogo(
  'light',
  lightMaster,
  path.join(generatedRoot, 'isauto-logo-light.webp')
);

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
  for (const target of await walk(
    runtimeRoot,
    (file) => textExtensions.has(path.extname(file).toLowerCase())
  )) {
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
    source: 'https://www.isauto.net/',
    rasterSource: OFFICIAL_LOGO,
    implementation:
      'The official IS AUTO website wordmark is converted into tightly framed transparent dark/light PNG masters with WebP archive derivatives. No SVG, CSS wordmark, generated text, App Store crop, or boxed background is used at runtime.'
  };
  await fs.writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
}

for (const destination of logoDestinations) {
  for (const target of [destination.dark, destination.light]) {
    if (!(await exists(target))) throw new Error(`Missing refined raster logo: ${target}`);
    const geometry = await validateLogo(await fs.readFile(target), target);
    if (geometry.horizontalCoverage < 0.90) {
      throw new Error(`Refined logo is not tightly cropped: ${target}`);
    }
  }
}

console.log([
  'IS AUTO official website identity finalized:',
  `- source: ${OFFICIAL_LOGO}`,
  `- dark PNG: ${darkGeometry.width}x${darkGeometry.height}, coverage ${darkGeometry.horizontalCoverage.toFixed(3)}x${darkGeometry.verticalCoverage.toFixed(3)}`,
  `- light PNG: ${lightGeometry.width}x${lightGeometry.height}, coverage ${lightGeometry.horizontalCoverage.toFixed(3)}x${lightGeometry.verticalCoverage.toFixed(3)}`,
  '- transparent, tightly cropped PNG runtime masters written to all three variants;',
  '- WebP archive derivatives generated;',
  '- no SVG, CSS/text logo, App Store crop, or oversized transparent canvas is used.'
].join('\n'));
