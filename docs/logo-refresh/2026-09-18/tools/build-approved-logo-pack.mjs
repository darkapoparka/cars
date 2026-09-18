import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const root = process.cwd();
const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
const decisionsPath = path.resolve(valueAfter('--decisions') || 'docs/logo-refresh/2026-09-18/IDENTITY_DECISIONS.json');
const sharpRoot = process.env.CARS_SHARP_ROOT;
if (!slug) throw new Error('Usage: node build-approved-logo-pack.mjs --client <slug> [--decisions <file>]');
if (!sharpRoot) throw new Error('CARS_SHARP_ROOT is required and must contain sharp.');
const sharp = createRequire(path.join(sharpRoot, 'package.json'))('sharp');

const clientRoot = path.join(root, 'clients', slug);
const outputRoot = path.join(clientRoot, 'assets', 'brand');
const allowedStrategies = new Set(['REFINE OFFICIAL LOGO', 'USE GENERATED CANDIDATE']);
const allowedModes = new Set(['original', 'white', 'dark', 'accent']);
const rasterExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.avif']);
const canonical = {
  masterPng: 'logo-master.png',
  masterWebp: 'logo-master.webp',
  lightPng: 'logo-on-light.png',
  lightWebp: 'logo-on-light.webp',
  darkPng: 'logo-on-dark.png',
  darkWebp: 'logo-on-dark.webp',
  accentPng: 'logo-on-accent.png',
  accentWebp: 'logo-on-accent.webp',
  universalPng: 'logo-universal.png',
  universalWebp: 'logo-universal.webp'
};
const exists = async (target) => fs.access(target).then(() => true, () => false);
const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const normalizePublicPath = (value) => `/${String(value).replace(/^\/+/, '')}`;

function assertRelative(value, label) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${slug}: ${label} is required.`);
  const normalized = value.replaceAll('\\', '/').replace(/^\.\//, '');
  if (normalized.startsWith('/') || normalized.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error(`${slug}: unsafe ${label}: ${value}`);
  }
  return normalized;
}

function parseHex(value, label) {
  if (!/^#[0-9a-f]{6}$/i.test(value || '')) throw new Error(`${slug}: ${label} must be a six-digit hex color.`);
  return {
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16)
  };
}

function luminance({ r, g, b }) {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrast(left, right) {
  const a = luminance(left);
  const b = luminance(right);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function borderBackground(data, width, height) {
  const points = [];
  const add = (x, y) => {
    const index = (y * width + x) * 4;
    if (data[index + 3] > 235) points.push([data[index], data[index + 1], data[index + 2]]);
  };
  const xStep = Math.max(1, Math.floor(width / 180));
  const yStep = Math.max(1, Math.floor(height / 180));
  for (let x = 0; x < width; x += xStep) { add(x, 0); add(x, height - 1); }
  for (let y = 0; y < height; y += yStep) { add(0, y); add(width - 1, y); }
  if (points.length < 30) return null;
  const mean = [0, 1, 2].map((channel) => points.reduce((sum, point) => sum + point[channel], 0) / points.length);
  const distances = points.map((point) => Math.hypot(point[0] - mean[0], point[1] - mean[1], point[2] - mean[2]));
  const closeRatio = distances.filter((distance) => distance < 24).length / distances.length;
  const rms = Math.sqrt(distances.reduce((sum, distance) => sum + distance ** 2, 0) / distances.length);
  return closeRatio >= 0.9 && rms <= 22 ? { r: mean[0], g: mean[1], b: mean[2], rms, closeRatio } : null;
}

async function sourceToTransparentMaster(source, decision) {
  const input = sharp(source, { failOn: 'error' }).rotate().ensureAlpha();
  const { data, info } = await input.raw().toBuffer({ resolveWithObject: true });
  if (!info.width || !info.height) throw new Error(`${slug}: source has no usable dimensions.`);
  if (Math.max(info.width, info.height) < 600 || Math.min(info.width, info.height) < 80) {
    throw new Error(`${slug}: source is undersized (${info.width}x${info.height}); choose a better official raster or generated candidate.`);
  }

  const output = Buffer.from(data);
  const background = decision.removeBackground ? borderBackground(output, info.width, info.height) : null;
  if (decision.removeBackground && !background) {
    throw new Error(`${slug}: requested background removal, but the border is not a stable flat background.`);
  }
  if (background) {
    const start = Number.isFinite(decision.backgroundDistanceStart) ? decision.backgroundDistanceStart : 18;
    const end = Number.isFinite(decision.backgroundDistanceEnd) ? decision.backgroundDistanceEnd : 58;
    if (end <= start) throw new Error(`${slug}: backgroundDistanceEnd must exceed backgroundDistanceStart.`);
    for (let index = 0; index < output.length; index += 4) {
      const distance = Math.hypot(output[index] - background.r, output[index + 1] - background.g, output[index + 2] - background.b);
      const retained = Math.max(0, Math.min(1, (distance - start) / (end - start)));
      output[index + 3] = Math.round(output[index + 3] * retained);
    }
  }

  let visible = 0;
  let mostlyOpaque = 0;
  for (let index = 0; index < output.length; index += 4) {
    const alpha = output[index + 3];
    if (alpha > 20) visible += 1;
    if (alpha > 245) mostlyOpaque += 1;
  }
  const pixels = info.width * info.height;
  if (visible < 300) throw new Error(`${slug}: source becomes empty after transparency processing.`);
  if (!background && mostlyOpaque / pixels > 0.985) {
    throw new Error(`${slug}: source is effectively opaque; background plates are not accepted.`);
  }

  const trimmed = await sharp(output, { raw: info })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .png()
    .toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  const contentPixels = (trimmedMeta.width || 1) * (trimmedMeta.height || 1);
  const contentStats = await sharp(trimmed).ensureAlpha().stats();
  const alphaMean = contentStats.channels[3]?.mean ?? 255;
  if (alphaMean / 255 > 0.9 && visible / pixels > 0.82) {
    throw new Error(`${slug}: source still behaves like a rectangular plate after processing.`);
  }

  const shouldEnlarge = decision.allowUpscale === true;
  const maxWidth = Number.isInteger(decision.masterWidth) ? decision.masterWidth : 1400;
  const maxHeight = Number.isInteger(decision.masterHeight) ? decision.masterHeight : 500;
  const resized = await sharp(trimmed)
    .resize({ width: maxWidth, height: maxHeight, fit: 'inside', withoutEnlargement: !shouldEnlarge, kernel: 'lanczos3' })
    .extend({ top: 36, bottom: 36, left: 48, right: 48, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  const resizedMeta = await sharp(resized).metadata();
  if (Math.max(resizedMeta.width || 0, resizedMeta.height || 0) < 650) {
    throw new Error(`${slug}: rendered master is too small (${resizedMeta.width}x${resizedMeta.height}).`);
  }
  return { buffer: resized, sourceInfo: info, contentPixels, background };
}

async function recolor(master, color) {
  const { data, info } = await sharp(master).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const output = Buffer.from(data);
  for (let index = 0; index < output.length; index += 4) {
    if (output[index + 3] === 0) continue;
    output[index] = color.r;
    output[index + 1] = color.g;
    output[index + 2] = color.b;
  }
  return sharp(output, { raw: info }).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
}

async function modeBuffer(master, mode, decision) {
  if (!allowedModes.has(mode)) throw new Error(`${slug}: unsupported logo mode ${mode}.`);
  if (mode === 'original') return master;
  if (mode === 'white') return recolor(master, { r: 255, g: 255, b: 255 });
  if (mode === 'dark') return recolor(master, parseHex(decision.darkInk || '#17191f', 'darkInk'));
  return recolor(master, parseHex(decision.accentInk || decision.accentColor, 'accentInk'));
}

async function validateTransparent(buffer, label) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (!info.width || !info.height || info.width < 300 || info.height < 80) throw new Error(`${slug}: ${label} has invalid dimensions.`);
  let transparent = 0;
  let visible = 0;
  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];
    if (alpha < 10) transparent += 1;
    if (alpha > 30) visible += 1;
  }
  const pixels = info.width * info.height;
  if (transparent / pixels < 0.12) throw new Error(`${slug}: ${label} does not have meaningful transparency.`);
  if (visible / pixels > 0.78) throw new Error(`${slug}: ${label} still appears plate-like.`);
  const edge = [];
  const add = (x, y) => edge.push(data[(y * info.width + x) * 4 + 3]);
  const stepX = Math.max(1, Math.floor(info.width / 120));
  const stepY = Math.max(1, Math.floor(info.height / 120));
  for (let x = 0; x < info.width; x += stepX) { add(x, 0); add(x, info.height - 1); }
  for (let y = 0; y < info.height; y += stepY) { add(0, y); add(info.width - 1, y); }
  if (edge.some((alpha) => alpha > 12)) throw new Error(`${slug}: ${label} touches the outer edge; padding/transparency failed.`);
  return { width: info.width, height: info.height, transparentRatio: transparent / pixels, visibleRatio: visible / pixels };
}

async function validateContrast(buffer, backgroundHex, label, minimumRatio = 2.5, minimumPassingPixels = 0.58) {
  const background = parseHex(backgroundHex, `${label} background`);
  const { data } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let visible = 0;
  let passing = 0;
  let ratioTotal = 0;
  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3] / 255;
    if (alpha < 0.16) continue;
    visible += 1;
    const blended = {
      r: Math.round(data[index] * alpha + background.r * (1 - alpha)),
      g: Math.round(data[index + 1] * alpha + background.g * (1 - alpha)),
      b: Math.round(data[index + 2] * alpha + background.b * (1 - alpha))
    };
    const ratio = contrast(blended, background);
    ratioTotal += ratio;
    if (ratio >= minimumRatio) passing += 1;
  }
  if (!visible) throw new Error(`${slug}: ${label} has no visible pixels.`);
  const passingRatio = passing / visible;
  const averageRatio = ratioTotal / visible;
  if (passingRatio < minimumPassingPixels || averageRatio < minimumRatio) {
    throw new Error(`${slug}: ${label} contrast failed on ${backgroundHex} (passing ${(passingRatio * 100).toFixed(1)}%, average ${averageRatio.toFixed(2)}).`);
  }
  return { background: backgroundHex, passingRatio, averageRatio };
}

async function writePair(namePng, nameWebp, buffer) {
  await fs.writeFile(path.join(outputRoot, namePng), buffer);
  await fs.writeFile(path.join(outputRoot, nameWebp), await sharp(buffer).webp({ quality: 95, alphaQuality: 100, effort: 6 }).toBuffer());
}

function replaceScalar(file, key, value) {
  return fs.readFile(file, 'utf8').then((before) => {
    const pattern = new RegExp(`(^\\s*${key}\\s*:\\s*)["'][^"']*["']`, 'm');
    if (!pattern.test(before)) throw new Error(`${slug}: cannot locate ${key} in ${path.relative(root, file)}.`);
    return fs.writeFile(file, before.replace(pattern, `$1${JSON.stringify(value)}`).replace(/\r?\n/g, '\n'));
  });
}

async function copyPack(destination) {
  await fs.mkdir(destination, { recursive: true });
  const names = Object.values(canonical);
  for (const name of names) {
    const source = path.join(outputRoot, name);
    const target = path.join(destination, name);
    if (await exists(source)) await fs.copyFile(source, target);
    else await fs.rm(target, { force: true });
  }
  await fs.copyFile(path.join(outputRoot, 'logo-implementation.json'), path.join(destination, 'logo-implementation.json'));
}

const decisions = JSON.parse((await fs.readFile(decisionsPath, 'utf8')).replace(/^\uFEFF/, ''));
const decision = decisions.dealers?.[slug];
if (!decision) throw new Error(`${slug}: no identity decision in ${path.relative(root, decisionsPath)}.`);
if (!allowedStrategies.has(decision.strategy)) throw new Error(`${slug}: invalid strategy ${decision.strategy}.`);
const sourceRelative = assertRelative(decision.source, 'source');
const source = path.join(clientRoot, sourceRelative);
if (!(await exists(source))) throw new Error(`${slug}: approved source not found: ${sourceRelative}.`);
const extension = path.extname(source).toLowerCase();
if (!rasterExtensions.has(extension)) throw new Error(`${slug}: approved source must be a real raster image, not ${extension || 'an extensionless file'}.`);
const sourceBytes = await fs.readFile(source);
const { buffer: master, sourceInfo, background } = await sourceToTransparentMaster(source, decision);
await fs.mkdir(outputRoot, { recursive: true });
for (const name of Object.values(canonical)) await fs.rm(path.join(outputRoot, name), { force: true });

const lightMode = decision.onLight || 'original';
const darkMode = decision.onDark || 'white';
const accentMode = decision.onAccent || 'white';
const masterValidation = await validateTransparent(master, 'logo-master');
const onLight = await modeBuffer(master, lightMode, decision);
const onDark = await modeBuffer(master, darkMode, decision);
const lightValidation = await validateTransparent(onLight, 'logo-on-light');
const darkValidation = await validateTransparent(onDark, 'logo-on-dark');
const lightContrast = await validateContrast(onLight, decision.lightSurface || '#ffffff', 'logo-on-light', decision.minimumContrast || 2.5, decision.minimumPassingPixels || 0.58);
const darkContrast = await validateContrast(onDark, decision.darkSurface || '#17191f', 'logo-on-dark', decision.minimumContrast || 2.5, decision.minimumPassingPixels || 0.58);
await writePair(canonical.masterPng, canonical.masterWebp, master);
await writePair(canonical.lightPng, canonical.lightWebp, onLight);
await writePair(canonical.darkPng, canonical.darkWebp, onDark);

let accentValidation = null;
let accentContrast = null;
if (decision.accentRequired === true) {
  const onAccent = await modeBuffer(master, accentMode, decision);
  accentValidation = await validateTransparent(onAccent, 'logo-on-accent');
  accentContrast = await validateContrast(onAccent, decision.accentColor, 'logo-on-accent', decision.minimumContrast || 2.5, decision.minimumPassingPixels || 0.58);
  await writePair(canonical.accentPng, canonical.accentWebp, onAccent);
}

let universalValidation = null;
let universalContrasts = null;
if (decision.universal) {
  const universal = await modeBuffer(master, decision.universal, decision);
  universalValidation = await validateTransparent(universal, 'logo-universal');
  const againstLight = await validateContrast(universal, decision.lightSurface || '#ffffff', 'logo-universal/light', decision.minimumContrast || 2.5, decision.minimumPassingPixels || 0.58);
  const againstDark = await validateContrast(universal, decision.darkSurface || '#17191f', 'logo-universal/dark', decision.minimumContrast || 2.5, decision.minimumPassingPixels || 0.58);
  universalContrasts = { againstLight, againstDark };
  await writePair(canonical.universalPng, canonical.universalWebp, universal);
}

const implementation = {
  schemaVersion: 1,
  client: slug,
  strategy: decision.strategy,
  rationale: decision.rationale,
  source: sourceRelative,
  sourceSha256: sha256(sourceBytes),
  sourceFormat: extension.slice(1),
  sourceDimensions: { width: sourceInfo.width, height: sourceInfo.height },
  transformations: {
    removeBackground: decision.removeBackground === true,
    detectedBackground: background ? { r: Math.round(background.r), g: Math.round(background.g), b: Math.round(background.b) } : null,
    onLight: lightMode,
    onDark: darkMode,
    onAccent: decision.accentRequired === true ? accentMode : null,
    universal: decision.universal || null
  },
  surfaces: {
    light: decision.lightSurface || '#ffffff',
    dark: decision.darkSurface || '#17191f',
    accent: decision.accentRequired === true ? decision.accentColor : null
  },
  validation: {
    master: masterValidation,
    onLight: { ...lightValidation, contrast: lightContrast },
    onDark: { ...darkValidation, contrast: darkContrast },
    onAccent: accentValidation ? { ...accentValidation, contrast: accentContrast } : null,
    universal: universalValidation ? { ...universalValidation, contrast: universalContrasts } : null
  },
  assets: Object.fromEntries(await Promise.all(Object.entries(canonical).map(async ([key, name]) => {
    const target = path.join(outputRoot, name);
    return [key, (await exists(target)) ? `assets/brand/${name}` : null];
  })))
};
await fs.writeFile(path.join(outputRoot, 'logo-implementation.json'), `${JSON.stringify(implementation, null, 2)}\n`);

const variants = [
  { key: 'auto-best', publicRoot: 'static' },
  { key: 'modern', publicRoot: 'apps/web/public' },
  { key: 'carwow', publicRoot: 'static' },
  { key: 'import', publicRoot: 'static' }
].filter(({ key }) => path.join(clientRoot, key) && fs.access(path.join(clientRoot, key)).then(() => true, () => false));
const resolvedVariants = [];
for (const candidate of [
  { key: 'auto-best', publicRoot: 'static' },
  { key: 'modern', publicRoot: 'apps/web/public' },
  { key: 'carwow', publicRoot: 'static' },
  { key: 'import', publicRoot: 'static' }
]) {
  if (await exists(path.join(clientRoot, candidate.key))) resolvedVariants.push(candidate);
}
for (const variant of resolvedVariants) {
  await copyPack(path.join(clientRoot, variant.key, variant.publicRoot, 'assets', 'brand'));
  if (variant.key === 'auto-best') {
    const file = path.join(clientRoot, 'auto-best/src/lib/config/brand.ts');
    await replaceScalar(file, 'logo', '/assets/brand/logo-on-light.webp');
    await replaceScalar(file, 'logoOnDark', '/assets/brand/logo-on-dark.webp');
  } else if (variant.key === 'modern') {
    await replaceScalar(path.join(clientRoot, 'modern/packages/marketplace/lead-site.ts'), 'logoPath', '/assets/brand/logo-on-dark.webp');
  } else if (variant.key === 'carwow') {
    const file = path.join(clientRoot, 'carwow/src/lib/data/daynight-site.ts');
    await replaceScalar(file, 'logoDark', '/assets/brand/logo-on-light.webp');
    await replaceScalar(file, 'logoLight', decision.accentRequired ? '/assets/brand/logo-on-accent.webp' : '/assets/brand/logo-on-dark.webp');
  } else if (variant.key === 'import') {
    const file = path.join(clientRoot, 'import/src/lib/data/daynight.ts');
    await replaceScalar(file, 'logoDark', '/assets/brand/logo-on-dark.webp');
    await replaceScalar(file, 'logoLight', '/assets/brand/logo-on-light.webp');
  }
}

const factsPath = path.join(clientRoot, 'business-facts.json');
if (await exists(factsPath)) {
  const facts = JSON.parse((await fs.readFile(factsPath, 'utf8')).replace(/^\uFEFF/, ''));
  const target = facts.business && typeof facts.business === 'object' ? facts.business : facts;
  target.logo = '/assets/brand/logo-on-light.webp';
  target.logoOnLight = '/assets/brand/logo-on-light.webp';
  target.logoOnDark = '/assets/brand/logo-on-dark.webp';
  target.logoLight = '/assets/brand/logo-on-dark.webp';
  target.logoDark = '/assets/brand/logo-on-light.webp';
  target.logoIdentityDecision = {
    strategy: decision.strategy,
    rationale: decision.rationale,
    source: sourceRelative,
    manifest: '/assets/brand/logo-implementation.json'
  };
  target.branding = {
    ...(target.branding && typeof target.branding === 'object' ? target.branding : {}),
    logoOnLight: '/assets/brand/logo-on-light.webp',
    logoOnDark: '/assets/brand/logo-on-dark.webp',
    ...(decision.accentRequired ? { logoOnAccent: '/assets/brand/logo-on-accent.webp' } : {}),
    ...(decision.universal ? { logoUniversal: '/assets/brand/logo-universal.webp' } : {}),
    rasterPolicy: 'approved-transparent-contextual-pack-v2'
  };
  await fs.writeFile(factsPath, `${JSON.stringify(facts, null, 2)}\n`);
}

console.log(JSON.stringify({ client: slug, strategy: decision.strategy, source: sourceRelative, variants: resolvedVariants.map(({ key }) => key), implementation }, null, 2));
