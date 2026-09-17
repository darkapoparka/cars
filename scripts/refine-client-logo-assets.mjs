import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const sharpRoot = process.env.CARS_SHARP_ROOT;
if (!sharpRoot) throw new Error('CARS_SHARP_ROOT is required. Install sharp in an isolated prefix and point CARS_SHARP_ROOT at it.');
const sharp = createRequire(path.join(sharpRoot, 'package.json'))('sharp');

const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
if (!slug) throw new Error('Usage: node scripts/refine-client-logo-assets.mjs --client <slug>');

const client = path.join(root, 'clients', slug);
const factsFile = path.join(client, 'business-facts.json');
const outputDir = path.join(client, 'assets', 'brand');
const rasterExtensions = new Set(['.png', '.webp', '.jpg', '.jpeg', '.avif', '.svg']);
const ignoredName = /(?:cover|hero|banner|showroom|vehicle|stock|gallery|photo|favicon|icon|apple|opengraph|qr|map|team|avatar|video)/i;
const preferredName = /(?:logo|wordmark|brand|mark)/i;
const MAX_SCAN_FILES = 2500;

const exists = async (target) => fs.access(target).then(() => true, () => false);
const readJson = async (target) => JSON.parse((await fs.readFile(target, 'utf8')).replace(/^\uFEFF/, ''));
const normalizePublicPath = (value) => typeof value === 'string' ? value.trim().replace(/^https?:\/\/[^/]+/i, '') : '';
const escapeXml = (value) => String(value).replace(/[<>&"']/g, (character) => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;'
})[character]);

async function walk(directory, output = []) {
  if (output.length >= MAX_SCAN_FILES || !(await exists(directory))) return output;
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (output.length >= MAX_SCAN_FILES) break;
    if (['node_modules', '.git', '.next', '.svelte-kit', 'build', 'dist', '.turbo'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(target, output);
    else if (entry.isFile() && rasterExtensions.has(path.extname(entry.name).toLowerCase())) output.push(target);
  }
  return output;
}

function factsSource(raw) {
  return raw?.business && typeof raw.business === 'object' ? raw.business : raw;
}

function candidatePublicPaths(raw) {
  const source = factsSource(raw);
  const branding = source?.branding && typeof source.branding === 'object' ? source.branding : {};
  return [
    branding.logoOnLight,
    branding.logoOnDark,
    source.logoOnLight,
    source.logoOnDark,
    source.logo,
    source.logoLight,
    source.logoDark,
    source.workingLogoPath,
    source.wordmarkPath,
    raw?.logo,
    raw?.logoLight,
    raw?.logoDark,
    raw?.workingLogoPath,
    raw?.wordmarkPath
  ].map(normalizePublicPath).filter(Boolean);
}

function pathCandidates(publicPath) {
  const clean = publicPath.replace(/^\/+/, '');
  const withoutAssetsPrefix = clean.replace(/^assets\//, '');
  const candidates = [
    path.join(client, clean),
    path.join(client, 'assets', withoutAssetsPrefix),
    path.join(client, 'assets', path.basename(clean))
  ];
  for (const variant of ['auto-best', 'carwow', 'import']) {
    candidates.push(path.join(client, variant, 'static', clean));
    candidates.push(path.join(client, variant, 'static', withoutAssetsPrefix));
  }
  candidates.push(path.join(client, 'modern', 'apps', 'web', 'public', clean));
  candidates.push(path.join(client, 'modern', 'apps', 'web', 'public', withoutAssetsPrefix));
  return candidates;
}

async function imageScore(target, explicitIndex = 99) {
  try {
    const metadata = await sharp(target, { density: 300 }).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    if (!width || !height) return -Infinity;
    const fileName = path.basename(target);
    let score = Math.log2(Math.max(1, width * height));
    if (preferredName.test(fileName)) score += 14;
    if (/wordmark/i.test(fileName)) score += 5;
    if (/on-dark|light/i.test(fileName)) score -= 1;
    if (ignoredName.test(fileName)) score -= 35;
    if (explicitIndex < 99) score += Math.max(0, 30 - explicitIndex * 2);
    const ratio = width / height;
    if (ratio >= 1.8 && ratio <= 8) score += 6;
    if (ratio < 0.45 || ratio > 12) score -= 8;
    return score;
  } catch {
    return -Infinity;
  }
}

async function chooseSource(raw) {
  const seen = new Set();
  const ranked = [];
  const explicit = candidatePublicPaths(raw);
  for (let index = 0; index < explicit.length; index += 1) {
    for (const target of pathCandidates(explicit[index])) {
      if (seen.has(target) || !(await exists(target))) continue;
      seen.add(target);
      ranked.push({ target, score: await imageScore(target, index), explicit: true });
    }
  }
  for (const base of [path.join(client, 'assets'), path.join(client, 'auto-best', 'static'), path.join(client, 'carwow', 'static'), path.join(client, 'modern', 'apps', 'web', 'public'), path.join(client, 'import', 'static')]) {
    for (const target of await walk(base)) {
      if (seen.has(target)) continue;
      seen.add(target);
      ranked.push({ target, score: await imageScore(target), explicit: false });
    }
  }
  ranked.sort((left, right) => right.score - left.score);
  return ranked.find((entry) => Number.isFinite(entry.score) && entry.score > 0)?.target || '';
}

function borderStats(data, width, height) {
  const samples = [];
  const add = (x, y) => {
    const offset = (y * width + x) * 4;
    const alpha = data[offset + 3];
    if (alpha > 220) samples.push([data[offset], data[offset + 1], data[offset + 2]]);
  };
  for (let x = 0; x < width; x += Math.max(1, Math.floor(width / 120))) {
    add(x, 0); add(x, height - 1);
  }
  for (let y = 0; y < height; y += Math.max(1, Math.floor(height / 120))) {
    add(0, y); add(width - 1, y);
  }
  if (samples.length < 20) return null;
  const mean = [0, 1, 2].map((channel) => samples.reduce((sum, value) => sum + value[channel], 0) / samples.length);
  const close = samples.filter((value) => Math.hypot(value[0] - mean[0], value[1] - mean[1], value[2] - mean[2]) < 34).length / samples.length;
  return close > 0.82 ? mean : null;
}

async function transparentMark(source) {
  const pipeline = sharp(source, { density: 320 }).rotate().ensureAlpha();
  const { data, info } = await pipeline.raw().toBuffer({ resolveWithObject: true });
  const background = borderStats(data, info.width, info.height);
  const output = Buffer.from(data);
  let opaque = 0;
  let colored = 0;
  let luminanceTotal = 0;
  let visible = 0;
  const buckets = new Set();

  for (let index = 0; index < output.length; index += 4) {
    const r = output[index];
    const g = output[index + 1];
    const b = output[index + 2];
    let alpha = output[index + 3];
    if (alpha > 230) opaque += 1;
    if (background) {
      const distance = Math.hypot(r - background[0], g - background[1], b - background[2]);
      const removal = Math.max(0, Math.min(1, (48 - distance) / 30));
      alpha = Math.round(alpha * (1 - removal));
      output[index + 3] = alpha;
    }
    if (alpha > 20) {
      visible += 1;
      const maximum = Math.max(r, g, b);
      const minimum = Math.min(r, g, b);
      if (maximum - minimum > 38) colored += 1;
      luminanceTotal += (0.2126 * r + 0.7152 * g + 0.0722 * b) * (alpha / 255);
      buckets.add(`${r >> 5}-${g >> 5}-${b >> 5}`);
    }
  }

  const pixels = info.width * info.height;
  const visibleRatio = visible / Math.max(1, pixels);
  const photoLike = buckets.size > 120 && visibleRatio > 0.72 && opaque / Math.max(1, pixels) > 0.75;
  if (photoLike || visible < 100) return null;

  const base = sharp(output, { raw: info }).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 6 });
  const { data: trimmed, info: trimmedInfo } = await base.raw().toBuffer({ resolveWithObject: true });
  const averageLuminance = luminanceTotal / Math.max(1, visible);
  const colorRatio = colored / Math.max(1, visible);
  const recolorDark = averageLuminance > 170 && colorRatio < 0.42;

  if (recolorDark) {
    for (let index = 0; index < trimmed.length; index += 4) {
      if (trimmed[index + 3] === 0) continue;
      trimmed[index] = 22;
      trimmed[index + 1] = 24;
      trimmed[index + 2] = 29;
    }
  }
  return { data: trimmed, info: trimmedInfo };
}

function fallbackSvg(name, accent, darkSurface = false) {
  const cleanName = String(name || slug).replace(/\s+/g, ' ').trim().toUpperCase();
  const safeName = escapeXml(cleanName);
  const estimated = Math.min(1500, Math.max(640, cleanName.length * 92));
  const foreground = darkSurface ? '#ffffff' : '#17191f';
  const line = darkSurface ? '#ffffff' : (/^#[0-9a-f]{6}$/i.test(accent || '') ? accent : '#c40101');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${estimated}" height="320" viewBox="0 0 ${estimated} 320"><rect width="100%" height="100%" fill="none"/><text x="24" y="212" fill="${foreground}" font-family="Arial,DejaVu Sans,sans-serif" font-size="150" font-weight="800" letter-spacing="-4">${safeName}</text><rect x="28" y="246" width="${Math.max(160, Math.min(estimated - 56, cleanName.length * 42))}" height="14" rx="7" fill="${line}"/></svg>`);
}

async function renderOutputs(mark, raw) {
  const source = factsSource(raw) || {};
  const name = source.name || source.displayName || source.shortName || slug;
  const accent = source.accent || raw?.accent || '#c40101';
  let lightSource;
  if (mark) lightSource = sharp(mark.data, { raw: mark.info });
  else lightSource = sharp(fallbackSvg(name, accent, false), { density: 240 });

  const lightPng = await lightSource
    .resize({ width: 1200, height: 420, fit: 'inside', withoutEnlargement: false, kernel: 'lanczos3' })
    .extend({ top: 24, bottom: 24, left: 30, right: 30, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();

  const { data: lightRaw, info } = await sharp(lightPng).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const darkRaw = Buffer.from(lightRaw);
  for (let index = 0; index < darkRaw.length; index += 4) {
    if (darkRaw[index + 3] === 0) continue;
    darkRaw[index] = 255;
    darkRaw[index + 1] = 255;
    darkRaw[index + 2] = 255;
  }
  const darkPng = await sharp(darkRaw, { raw: info }).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  return { lightPng, darkPng };
}

async function validate(buffer, label) {
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height || metadata.hasAlpha !== true || metadata.width < 600) {
    throw new Error(`${label}: invalid transparent logo ${metadata.width || 0}x${metadata.height || 0}`);
  }
  const stats = await sharp(buffer).ensureAlpha().stats();
  if ((stats.channels[3]?.min ?? 255) > 12) throw new Error(`${label}: logo has no transparent pixels.`);
}

function updateFacts(raw) {
  const target = raw?.business && typeof raw.business === 'object' ? raw.business : raw;
  target.branding = {
    ...(target.branding && typeof target.branding === 'object' ? target.branding : {}),
    logoOnLight: '/assets/brand/logo-on-light.webp',
    logoOnDark: '/assets/brand/logo-on-dark.webp',
    rasterPolicy: 'transparent-png-webp-surface-pair-v1'
  };
  target.logoOnLight = '/assets/brand/logo-on-light.webp';
  target.logoOnDark = '/assets/brand/logo-on-dark.webp';
  target.logo = '/assets/brand/logo-on-light.webp';
  target.logoLight = '/assets/brand/logo-on-dark.webp';
  target.logoDark = '/assets/brand/logo-on-light.webp';
  return raw;
}

if (!(await exists(client))) throw new Error(`Client directory not found: clients/${slug}`);
const raw = await readJson(factsFile);
const source = await chooseSource(raw);
const mark = source && !ignoredName.test(path.basename(source)) ? await transparentMark(source) : null;
const { lightPng, darkPng } = await renderOutputs(mark, raw);
await validate(lightPng, `${slug} light-surface`);
await validate(darkPng, `${slug} dark-surface`);
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, 'logo-on-light.png'), lightPng);
await fs.writeFile(path.join(outputDir, 'logo-on-dark.png'), darkPng);
await fs.writeFile(path.join(outputDir, 'logo-on-light.webp'), await sharp(lightPng).webp({ quality: 94, alphaQuality: 100, effort: 6 }).toBuffer());
await fs.writeFile(path.join(outputDir, 'logo-on-dark.webp'), await sharp(darkPng).webp({ quality: 94, alphaQuality: 100, effort: 6 }).toBuffer());
await fs.writeFile(path.join(outputDir, 'README.md'), `# ${slug} logo surface pair\n\nGenerated from ${source ? path.relative(client, source).replaceAll('\\\\', '/') : 'a transparent text fallback'} by \`scripts/refine-client-logo-assets.mjs\`.\n\n- \`logo-on-light.*\`: transparent identity for white and pale surfaces.\n- \`logo-on-dark.*\`: transparent all-white identity for charcoal, red, and other dark/accent surfaces.\n- CSS/SVG runtime logos and baked background rectangles are not used.\n`);
await fs.writeFile(factsFile, `${JSON.stringify(updateFacts(raw), null, 2)}\n`);
console.log(JSON.stringify({ client: slug, source: source ? path.relative(client, source).replaceAll('\\\\', '/') : null, output: path.relative(root, outputDir).replaceAll('\\\\', '/') }, null, 2));
