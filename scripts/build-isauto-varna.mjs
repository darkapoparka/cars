import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const ROOT = process.cwd();
const SLUG = 'isauto-varna';
const CLIENT = path.join(ROOT, 'clients', SLUG);
const TODAY = '2026-09-16';
const SITE = 'https://www.isauto.net/';
const CONTACTS = 'https://www.isauto.net/contacts';
const MOBILE = 'https://isautovarna.mobile.bg/';
const HERO_SOURCE = 'https://www.isauto.net/assets/home_top_image-6c0593ce5c4b33195567916b1cfd688ffce5c161da970f43e515f452d71c66d3.png';
const ADDRESS = 'Бизнес парк Варна, сграда B6';
const PHONE_DISPLAY = '0899 266 666';
const PHONE_E164 = '+359899266666';
const EMAIL = 'varna@isauto.net';
const USER_AGENT = 'Mozilla/5.0 (compatible; CarsLeadBuilder/1.0; +https://github.com/darkapoparka/cars)';

const listings = [
  {
    id: 'is-1001', numericId: 1,
    slug: 'audi-r8-performance-v10-2021',
    title: 'Audi R8 Performance V10', shortTitle: 'Audi R8', make: 'Audi', model: 'R8', trim: 'Performance V10 · B&O · Ceramic · Carbon',
    year: 2021, mileageKm: 75000, fuelBg: 'Бензин', fuelLong: 'Бензинов', fuelCode: 'gasoline', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'Купе', body: 'Coupe', bodyBg: 'Купе', bodyCode: 'coupe', priceEur: 148224, priceBgn: '289 900.95 лв.', color: '—', power: '—',
    equipment: [], features: ['Bang & Olufsen', 'Керамични спирачки', 'Carbon пакет'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-r8-perfomance-v10-bang-olufsen-audi-keramik-carbon-10'
  },
  {
    id: 'is-1002', numericId: 2,
    slug: 'audi-q7-50-tdi-2022',
    title: 'Audi Q7 50 TDI', shortTitle: 'Audi Q7', make: 'Audi', model: 'Q7', trim: '50 TDI · Virtual · 4-zone · Camera 360',
    year: 2022, mileageKm: 57500, fuelBg: 'Дизел', fuelLong: 'Дизелов', fuelCode: 'diesel', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'SUV', body: 'SUV', bodyBg: 'Джип', bodyCode: 'suv', priceEur: 67439, priceBgn: '131 899.22 лв.', color: '—', power: '—',
    equipment: ['4x4', '360° камера', 'Подгряване на седалки', 'Навигация', 'Парктроник'], features: ['Virtual cockpit', 'Подгряване на седалки', '4-зонов климатроник', '360° камера'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-q7-50tdi-virtual-podgrev-4-zoni-kamera360-9'
  },
  {
    id: 'is-1003', numericId: 3,
    slug: 'bmw-m5-xdrive-2018',
    title: 'BMW M5', shortTitle: 'BMW M5', make: 'BMW', model: 'M5', trim: 'xDrive · Ceramic · Bowers & Wilkins · Adaptive LED',
    year: 2018, mileageKm: 61000, fuelBg: 'Бензин', fuelLong: 'Бензинов', fuelCode: 'gasoline', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'Седан', body: 'Sedan', bodyBg: 'Лимузина', bodyCode: 'sedan', priceEur: 71530, priceBgn: '139 900.52 лв.', color: '—', power: '—',
    equipment: ['4x4', 'Навигация', 'Парктроник', 'Безключов достъп'], features: ['xDrive', 'Керамични спирачки', 'Bowers & Wilkins', 'Adaptive LED'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-m5-keramika-xdrive-m-sport-bowers-wilk-adaptiveled-8'
  },
  {
    id: 'is-1004', numericId: 4,
    slug: 'bmw-x5-xdrive-2014',
    title: 'BMW X5 xDrive', shortTitle: 'BMW X5', make: 'BMW', model: 'X5', trim: 'xDrive · Sport · Panoramic roof',
    year: 2014, mileageKm: 196000, fuelBg: 'Дизел', fuelLong: 'Дизелов', fuelCode: 'diesel', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'SUV', body: 'SUV', bodyBg: 'Джип', bodyCode: 'suv', priceEur: 24491, priceBgn: '47 900.23 лв.', color: '—', power: '—',
    equipment: ['4x4', 'Панорамен покрив', 'Подгряване на седалки'], features: ['xDrive', 'Sport пакет', 'Подгряване на седалки', 'Панорамен покрив'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-x5-xdrive-sport-podgrev-panorama-6-1-7'
  },
  {
    id: 'is-1005', numericId: 5,
    slug: 'bmw-750-m-performance-2019',
    title: 'BMW 750 M Performance', shortTitle: 'BMW 750', make: 'BMW', model: '7 Series', trim: '750 · M Performance · Laser · Harman Kardon',
    year: 2019, mileageKm: 167000, fuelBg: 'Дизел', fuelLong: 'Дизелов', fuelCode: 'diesel', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'Седан', body: 'Sedan', bodyBg: 'Лимузина', bodyCode: 'sedan', priceEur: 61304, priceBgn: '119 900.20 лв.', color: '—', power: '—',
    equipment: ['Навигация', 'Парктроник', 'Безключов достъп'], features: ['M Performance', 'Laser светлини', 'Alcantara', 'Virtual cockpit', 'Harman Kardon'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-750-m-perfomance-laser-alkantar-virtual-harman-kardon-3'
  },
  {
    id: 'is-1006', numericId: 6,
    slug: 'audi-a5-sportback-20-tdi-2018',
    title: 'Audi A5 Sportback 2.0 TDI', shortTitle: 'Audi A5 Sportback', make: 'Audi', model: 'A5', trim: 'Sportback · S line · Virtual · Ambient',
    year: 2018, mileageKm: 175000, fuelBg: 'Дизел', fuelLong: 'Дизелов', fuelCode: 'diesel', transmissionBg: 'Автоматик', transmissionLong: 'Автоматична', transmissionCode: 'automatic',
    category: 'Спортбек', body: 'Sportback', bodyBg: 'Купе', bodyCode: 'coupe', priceEur: 19900, priceBgn: '38 921.02 лв.', color: '—', power: '—',
    equipment: ['Подгряване на седалки', 'Навигация', 'Парктроник'], features: ['S line', 'Ambient осветление', 'Virtual cockpit', 'Подгряване на седалки', 'Парктроник', 'F1 пера'],
    sourceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-a5-sportback-2-0tdi-sline-ambient-virtual-podgrev-pdc-f1-745'
  }
];

const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const ensureDir = (target) => fs.mkdir(target, { recursive: true });
async function writeText(relative, content) {
  const target = path.join(ROOT, relative);
  await ensureDir(path.dirname(target));
  await fs.writeFile(target, content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}
async function readText(relative) { return fs.readFile(path.join(ROOT, relative), 'utf8'); }
async function writeJson(relative, value) { await writeText(relative, json(value)); }
async function exists(target) { return fs.access(target).then(() => true, () => false); }

if (!(await exists(CLIENT))) throw new Error(`Missing ${CLIENT}; run scripts/new-client.mjs first.`);
const sharpRoot = process.env.IS_AUTO_SHARP_ROOT;
if (!sharpRoot) throw new Error('IS_AUTO_SHARP_ROOT is required.');
const sharp = createRequire(path.join(sharpRoot, 'package.json'))('sharp');

async function fetchResponse(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT, accept: '*/*', 'accept-language': 'bg,en;q=0.8' }
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response;
}
async function fetchHtml(url) { return (await fetchResponse(url)).text(); }
function decodeHtml(value) {
  return value
    .replaceAll('&amp;', '&').replaceAll('&#38;', '&').replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'").replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}
function normalizeCandidate(value, base) {
  const cleaned = decodeHtml(value.trim().replace(/^['"]|['"]$/g, '')).replaceAll('\\/', '/');
  if (!cleaned || cleaned.startsWith('data:') || cleaned.startsWith('blob:')) return null;
  try { return new URL(cleaned.startsWith('//') ? `https:${cleaned}` : cleaned, base).href; }
  catch { return null; }
}
function extractImageCandidates(html, base) {
  const prioritized = [];
  const generic = [];
  const add = (bucket, raw) => {
    const url = normalizeCandidate(raw, base);
    if (!url || !/^https?:/i.test(url)) return;
    if (!/\.(?:avif|webp|png|jpe?g)(?:[?#]|$)/i.test(url)) return;
    if (/favicon|sprite|icon[-_.]|flags?[/_.]|spinner|placeholder|loader/i.test(url)) return;
    bucket.push(url);
  };
  for (const match of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["'][^>]+content=["']([^"']+)["']/gi)) add(prioritized, match[1]);
  for (const match of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|twitter:image(?::src)?)["']/gi)) add(prioritized, match[1]);
  for (const match of html.matchAll(/(?:src|data-src|data-original|data-lazy|data-image)=["']([^"']+)["']/gi)) add(generic, match[1]);
  for (const match of html.matchAll(/(?:srcset|data-srcset)=["']([^"']+)["']/gi)) {
    for (const item of match[1].split(',')) add(generic, item.trim().split(/\s+/)[0]);
  }
  for (const match of html.matchAll(/url\(([^)]+)\)/gi)) add(generic, match[1]);
  for (const match of html.matchAll(/https?:\\?\/\\?\/[^"'\s<>)]+?\.(?:avif|webp|png|jpe?g)(?:\?[^"'\s<>)]+)?/gi)) add(generic, match[0]);
  return [...new Set([...prioritized, ...generic])];
}
function imageUrlRank(url) {
  let score = 0;
  if (/og|original|large|gallery|vehicle|car|auto|upload|photo|image/i.test(url)) score += 8;
  if (/logo|brand|header|footer|banner|home_top|team|avatar/i.test(url)) score -= 20;
  if (/thumb|small|icon|crop/i.test(url)) score -= 4;
  return score;
}
async function selectVehicleImage(pageUrl) {
  const html = await fetchHtml(pageUrl);
  const candidates = extractImageCandidates(html, pageUrl)
    .sort((a, b) => imageUrlRank(b) - imageUrlRank(a))
    .slice(0, 24);
  let best = null;
  for (const url of candidates) {
    try {
      const response = await fetchResponse(url);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 20_000 || bytes.length > 25_000_000) continue;
      const metadata = await sharp(bytes).metadata();
      const width = metadata.width ?? 0;
      const height = metadata.height ?? 0;
      if (width < 700 || height < 420 || width / Math.max(height, 1) > 3.2) continue;
      const area = width * height;
      const candidate = { url, bytes, width, height, score: area + imageUrlRank(url) * 1_000_000 };
      if (!best || candidate.score > best.score) best = candidate;
    } catch (error) {
      console.warn(`Skipping image candidate ${url}: ${error.message}`);
    }
  }
  if (!best) throw new Error(`No usable listing image found for ${pageUrl}`);
  return best;
}
async function processPhoto(bytes, width, height, output) {
  await ensureDir(path.dirname(output));
  await sharp(bytes).rotate().resize(width, height, { fit: 'cover', position: 'attention', withoutEnlargement: false }).webp({ quality: 84, effort: 5 }).toFile(output);
}
function logoSvg(mode) {
  const ink = mode === 'light' ? '#ffffff' : '#151515';
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="240" viewBox="0 0 900 240"><text x="18" y="168" font-family="Arial,Helvetica,sans-serif" font-size="166" font-weight="900" letter-spacing="-7" fill="${ink}">IS</text><text x="205" y="168" font-family="Arial,Helvetica,sans-serif" font-size="166" font-weight="900" letter-spacing="-7" fill="#d71920">AUTO</text><rect x="22" y="194" width="650" height="13" rx="6.5" fill="#d71920"/></svg>`);
}
async function createLogo(mode, output) {
  await ensureDir(path.dirname(output));
  await sharp(logoSvg(mode)).png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(output);
}
async function copyFile(source, destination) { await ensureDir(path.dirname(destination)); await fs.copyFile(source, destination); }

const homepageHtml = await fetchHtml(SITE);
const socialUrls = [...homepageHtml.matchAll(/href=["']([^"']*(?:facebook\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com)[^"']*)["']/gi)]
  .map((match) => normalizeCandidate(match[1], SITE)).filter(Boolean);
const social = {
  instagram: socialUrls.find((url) => /instagram\.com/i.test(url)) ?? 'https://www.instagram.com/is__auto/?hl=bg',
  youtube: socialUrls.find((url) => /youtu(?:be\.com|\.be)/i.test(url)) ?? '',
  facebook: socialUrls.find((url) => /facebook\.com/i.test(url)) ?? 'https://www.facebook.com/isauto1'
};

const assetRoot = path.join(CLIENT, 'assets');
const generatedRoot = path.join(process.env.RUNNER_TEMP ?? path.join(ROOT, 'runtime'), 'isauto-generated');
await ensureDir(generatedRoot);
const heroResponse = await fetchResponse(HERO_SOURCE);
const heroBytes = Buffer.from(await heroResponse.arrayBuffer());
const heroMaster = path.join(generatedRoot, 'hero.webp');
await processPhoto(heroBytes, 1920, 1000, heroMaster);
const darkLogoMaster = path.join(generatedRoot, 'isauto-logo-dark.png');
const lightLogoMaster = path.join(generatedRoot, 'isauto-logo-light.png');
await createLogo('dark', darkLogoMaster);
await createLogo('light', lightLogoMaster);

const imageProvenance = [];
for (const [index, listing] of listings.entries()) {
  const selected = await selectVehicleImage(listing.sourceUrl);
  const master = path.join(generatedRoot, `inventory-${index + 1}.webp`);
  await processPhoto(selected.bytes, 1600, 1067, master);
  listing.imageSourceUrl = selected.url;
  listing.masterImage = master;
  imageProvenance.push({
    id: listing.id,
    vehicle: listing.title,
    pageUrl: listing.sourceUrl,
    imageUrl: selected.url,
    localizedAs: [
      `auto-best/static/assets/images/lead/isauto/inventory-${index + 1}.webp`,
      `modern/apps/web/public/isauto/inventory-${index + 1}.webp`,
      `carwow/static/assets/isauto/inventory-${index + 1}.webp`
    ],
    capturedAt: TODAY
  });
}

const assetDestinations = [
  { dir: path.join(CLIENT, 'auto-best/static/assets/images/lead/isauto'), hero: 'hero.webp', dark: 'logo-dark.png', light: 'logo-light.png' },
  { dir: path.join(CLIENT, 'modern/apps/web/public/isauto'), hero: 'hero.webp', dark: 'logo-dark.png', light: 'logo-light.png' },
  { dir: path.join(CLIENT, 'carwow/static/assets/isauto'), hero: 'hero.webp', dark: null, light: null }
];
for (const destination of assetDestinations) {
  await copyFile(heroMaster, path.join(destination.dir, destination.hero));
  for (const [index, listing] of listings.entries()) await copyFile(listing.masterImage, path.join(destination.dir, `inventory-${index + 1}.webp`));
  if (destination.dark) await copyFile(darkLogoMaster, path.join(destination.dir, destination.dark));
  if (destination.light) await copyFile(lightLogoMaster, path.join(destination.dir, destination.light));
}
await copyFile(darkLogoMaster, path.join(CLIENT, 'carwow/static/brand/isauto-logo-dark.png'));
await copyFile(lightLogoMaster, path.join(CLIENT, 'carwow/static/brand/isauto-logo-light.png'));

async function collectRasterFiles(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectRasterFiles(target)));
    else if (/\.(?:jpe?g|png|webp)$/i.test(entry.name)) files.push(target);
  }
  return files;
}

async function renderLocalizedReplacement(source, target, fit = 'cover') {
  const existing = await sharp(target).metadata().catch(() => ({}));
  const width = existing.width || 1200;
  const height = existing.height || 800;
  let pipeline = sharp(source)
    .rotate()
    .resize(width, height, {
      fit,
      position: fit === 'contain' ? 'centre' : 'attention',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    });
  const extension = path.extname(target).toLowerCase();
  if (extension === '.png') pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  else if (extension === '.jpg' || extension === '.jpeg') pipeline = pipeline.jpeg({ quality: 85, mozjpeg: true });
  else pipeline = pipeline.webp({ quality: 84, effort: 5 });
  await fs.writeFile(target, await pipeline.toBuffer());
}

let replacementIndex = 0;
const autoBestLegacyLeadRoot = path.join(CLIENT, 'auto-best/static/assets/images/lead');
for (const target of await collectRasterFiles(autoBestLegacyLeadRoot)) {
  if (target.includes(`${path.sep}isauto${path.sep}`)) continue;
  const filename = path.basename(target).toLowerCase();
  if (!filename.startsWith('day-night-')) continue;
  if (filename.includes('logo')) {
    await renderLocalizedReplacement(lightLogoMaster, target, 'contain');
    continue;
  }
  const useShowroom = /(?:hero|banner|showroom|studio|contact|about|video|guide|portrait|keys)/.test(filename);
  const source = useShowroom ? heroMaster : listings[replacementIndex++ % listings.length].masterImage;
  await renderLocalizedReplacement(source, target);
}

const carwowLegacyDealerRoot = path.join(CLIENT, 'carwow/static/assets/daynight');
for (const target of await collectRasterFiles(carwowLegacyDealerRoot)) {
  const filename = path.basename(target).toLowerCase();
  const useShowroom = /(?:hero|banner|showroom|team|contact|about|service|office|location)/.test(filename);
  const source = useShowroom ? heroMaster : listings[replacementIndex++ % listings.length].masterImage;
  await renderLocalizedReplacement(source, target);
}

const autoBestAssetCheckPath = path.join(CLIENT, 'auto-best/scripts/check-assets.mjs');
let autoBestAssetCheck = await fs.readFile(autoBestAssetCheckPath, 'utf8');
autoBestAssetCheck = autoBestAssetCheck.replace('const guardedMediaCount = 117;', 'const guardedMediaCount = 126;');
await fs.writeFile(autoBestAssetCheckPath, autoBestAssetCheck, 'utf8');

const textExtensions = new Set(['.ts', '.tsx', '.js', '.mjs', '.svelte', '.json', '.md', '.html']);
const safeReplacements = [
  ['DAY & NIGHT AUTO GROUP', 'IS AUTO VARNA'], ['DAY NIGHT AUTO GROUP', 'IS AUTO VARNA'],
  ['Day & Night Auto Group', 'IS AUTO Varna'], ['Day Night Auto Group', 'IS AUTO Varna'],
  ['Day Night Auto', 'IS AUTO'], ['DAY NIGHT AUTO', 'IS AUTO'], ['Day & Night', 'IS AUTO'],
  ['Auto Best', 'IS AUTO'], ['AUTO BEST', 'IS AUTO'],
  ['0877733110', '0899266666'], ['0877 733 110', PHONE_DISPLAY], ['+359877733110', PHONE_E164],
  ['087 982 4625', PHONE_DISPLAY], ['+359879824625', PHONE_E164],
  ['ул. „Атанас Манчев“ 18, Студентски град', ADDRESS], ['ул. Атанас Манчев 18', 'сграда B6'],
  ['Студентски град', 'Бизнес парк Варна'], ['daynight.mobile.bg', 'isautovarna.mobile.bg']
];
async function sanitizeTree(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.svelte-kit', 'build', 'dist'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) { await sanitizeTree(target); continue; }
    if (!textExtensions.has(path.extname(entry.name).toLowerCase())) continue;
    let content = await fs.readFile(target, 'utf8');
    const original = content;
    for (const [from, to] of safeReplacements) content = content.split(from).join(to);
    if (content !== original) await fs.writeFile(target, content, 'utf8');
  }
}
await sanitizeTree(CLIENT);

await writeText(`clients/${SLUG}/auto-best/src/lib/config/brand.ts`, `export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: \`tel:\${string}\`;
  appointment: string;
  logo: \`/\${string}\`;
  logoOnDark: \`/\${string}\`;
  youtubeUrl: \`https://\${string}\`;
  instagramUrl: \`https://\${string}\`;
  facebookUrl: \`https://\${string}\`;
};

const city = 'Варна';
const addressLine = '${ADDRESS}';

export const brand = {
  name: 'IS AUTO Varna',
  shortName: 'IS AUTO',
  city,
  youtubeUrl: '${social.youtube}',
  instagramUrl: '${social.instagram}',
  facebookUrl: '${social.facebook}',
  phone: '${PHONE_DISPLAY}',
  phoneHref: 'tel:${PHONE_E164}',
  addressLine,
  address: \`\${addressLine}, \${city}\`,
  appointment: 'Понеделник–петък 09:00–18:00 · събота 10:00–16:00',
  logo: '/assets/images/lead/isauto/logo-dark.png',
  logoOnDark: '/assets/images/lead/isauto/logo-light.png'
} as const satisfies BrandConfig;`);

const autoBestInventoryRecords = listings.map((item, index) => `  { id: ${item.numericId}, image: '/assets/images/lead/isauto/inventory-${index + 1}.webp', category: '${item.category}', body: '${item.body}', make: '${item.make}', title: '${item.title.replaceAll("'", "\\'")}', yearNumber: ${item.year}, mileageKm: ${item.mileageKm}, fuel: '${item.fuelBg}', transmission: '${item.transmissionBg}', equipment: ${JSON.stringify(item.equipment)}, condition: 'used', priceEur: ${item.priceEur}, evidenceUrl: '${item.sourceUrl}' }`).join(',\n');
await writeText(`clients/${SLUG}/auto-best/src/lib/data/inventory.ts`, `export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключов достъп'
  | 'Адаптивен круиз контрол';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  category: string;
  body: string;
  make: string;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: \`/listing-detail-v1/\${number}\`;
};

const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
${autoBestInventoryRecords}
];

export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'verified',
  year: String(record.yearNumber),
  mileage: \`\${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км\`,
  href: \`/listing-detail-v1/\${record.id}\`
}));

export const formatVehiclePrice = (priceEur: number) => \`\${new Intl.NumberFormat('bg-BG').format(priceEur)} €\`;`);

await writeText(`clients/${SLUG}/auto-best/src/lib/data/company.ts`, `import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string; };
export type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string; };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': { title: 'Подгответе за разговора', items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява'] },
  import: { title: 'Какъв автомобил търсите?', items: ['Марка, модел и предпочитания', 'Бюджет за покупката и вноса', 'Линк към обява, ако вече сте избрали'] },
  leasing: { title: 'Обсъдете с екипа', items: ['Автомобилът, който сте избрали', 'Първоначална вноска и срок', 'Актуални условия за конкретната сделка'] },
  inspection: { title: 'Уговорете посещението', items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение от екипа по телефона'] }
};

export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}

export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: \`Оглед в \${brand.city}\`, description: 'Посещение в шоурума с предварителна уговорка.', href: '/contact?topic=inspection', cta: 'Запазете оглед' },
  { index: '02', icon: 'import', title: 'Внос и автомобил по поръчка', description: 'Обсъдете критерии, бюджет и следващи стъпки с екипа.', href: '/contact?topic=import', cta: 'Попитайте за внос' },
  { index: '03', icon: 'leasing', title: 'Лизинг и разсрочване', description: 'Условията се потвърждават за конкретния автомобил и клиент.', href: '/contact?topic=leasing', cta: 'Обсъдете условия' },
  { index: '04', icon: 'trade-in', title: 'Продажба или замяна', description: 'Предложете своя автомобил за индивидуален преглед и оценка.', href: '/contact?topic=trade-in', cta: 'Поискайте оценка' }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с екипа', description: \`За наличност, оглед или друг въпрос към \${brand.name}.\` },
  { id: 'inspection', label: 'Оглед', title: \`Оглед в \${brand.city}\`, description: 'Уговорете посещение предварително, за да бъде подготвен конкретният автомобил.' },
  { id: 'import', label: 'Внос', title: 'Автомобил по поръчка', description: 'Изпратете обява или посочете марка, модел, година и бюджет.', mobileDescription: 'Изпратете обява или задайте модел и бюджет.' },
  { id: 'leasing', label: 'Лизинг', title: 'Лизинг и разсрочване', description: 'Получете актуални условия според избрания автомобил и конкретната сделка.' },
  { id: 'trade-in', label: 'Замяна', title: 'Продажба или замяна', description: 'Разкажете ни за автомобила, който искате да предложите, и поискайте индивидуална оценка.' }
];
export const resolveContactTopic = (value: string | null) => contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = { latitude: 43.2279192, longitude: 27.8574313 } as const;`);

await writeText(`clients/${SLUG}/auto-best/src/lib/data/home.ts`, `import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 180, height: 80, bounds: [9, 11, 171, 70] },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95, bounds: [0, 0, 206, 95] },
  { label: 'Купе', query: 'Coupe', image: '/assets/images/icon-box/car-list8.png', width: 180, height: 80, bounds: [11, 15, 170, 63] },
  { label: 'Спортбек', query: 'Sportback', image: '/assets/images/icon-box/car-list2.png', width: 180, height: 80, bounds: [12, 8, 168, 71] }
] as const;
const brandArtwork = [
  { label: 'Audi', image: '/assets/images/partner/parner11.png', width: 140, height: 80, bounds: [8, 18, 132, 62] },
  { label: 'BMW', image: '/assets/images/partner/parner12.png', width: 140, height: 80, bounds: [33, 3, 107, 77] }
] as const;
export const bodyTypes = bodyArtwork.map(item => ({ ...item, label: bodyLabel(item.query), count: featuredVehicles.filter(vehicle => vehicle.body === item.query).length }));
export const brands = brandArtwork.map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));
export const editorial = blogPosts.slice(0, 3).map(post => ({ title: post.title, text: post.text, image: post.image, href: \`/blog-detail/\${post.id}\`, meta: 'Полезно', category: post.category }));`);

await writeText(`clients/${SLUG}/modern/packages/marketplace/lead-site.ts`, `export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {
  readonly accent: string; readonly address: string; readonly city: string; readonly contactUrl: string; readonly country: string;
  readonly countryCode: string; readonly currency: LeadSiteCurrency; readonly district: { readonly bg: string; readonly en: string };
  readonly email: string; readonly financingArtworkPath: string; readonly heroPath: string; readonly locale: string; readonly logoPath: string;
  readonly mapsEmbedUrl: string; readonly mapsUrl: string; readonly name: string; readonly phoneDisplay: string; readonly phoneHref: string;
  readonly sellCategoryAssets: Readonly<Record<"car" | "motorbike" | "truck" | "van", string>>;
  readonly shortName: string; readonly slug: string; readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean; readonly tagline: string;
}
const mapQuery = encodeURIComponent('${ADDRESS}, Варна, България');
export const leadSite: LeadSiteConfig = {
  accent: "#d71920",
  address: "${ADDRESS}", city: "Варна", district: { bg: "Бизнес парк Варна", en: "Business Park Varna" },
  sellCategoryAssets: { car: "/lead-sell-car-v1.png", motorbike: "/lead-sell-motorcycle-v1.png", truck: "/lead-sell-truck-v1.png", van: "/lead-sell-van-v1.png" },
  financingArtworkPath: "/images/services/leasing-red-suv-v2.png",
  contactUrl: "tel:${PHONE_E164}", country: "България", countryCode: "BG", currency: "EUR", email: "${EMAIL}",
  heroPath: "/isauto/hero.webp", locale: "bg-BG", logoPath: "/isauto/logo-dark.png",
  mapsEmbedUrl: \`https://www.google.com/maps?q=\${mapQuery}&z=16&output=embed\`,
  mapsUrl: \`https://www.google.com/maps/search/?api=1&query=\${mapQuery}\`,
  name: "IS AUTO Varna", phoneDisplay: "${PHONE_DISPLAY}", phoneHref: "tel:${PHONE_E164}", shortName: "IS AUTO", slug: "${SLUG}",
  socialLinks: ${JSON.stringify(Object.fromEntries(Object.entries(social).filter(([, url]) => url !== SITE)))},
  staticDemoMode: true,
  tagline: "Нови и употребявани автомобили, внос и съдействие при покупка във Варна."
};`);

const modernPath = `clients/${SLUG}/modern/packages/marketplace-domain/testing/mock-data.ts`;
let modernData = await readText(modernPath);
const modernRecords = listings.map((item, index) => `  {
    id: "${item.id}", slug: "${item.slug}", category: "car", dealerOrgId: "dealer-isauto-varna", status: "active",
    title: "${item.year} ${item.title}",
    description: "Публична обява на IS AUTO Varna, проверена на ${TODAY}. Наличност, оборудване и финални условия се потвърждават директно с автокъщата.",
    price: { amount: ${item.priceEur}, currency: "EUR" }, priceType: "fixed",
    images: [{ url: "/isauto/inventory-${index + 1}.webp", alt: "${item.title.replaceAll('"', '\\"')} в IS AUTO Varna" }],
    badges: ["used"${index < 3 ? ', "promoted"' : ''}],
    location: { city: "Варна", region: "Бизнес парк Варна", country: "България" },
    features: ${JSON.stringify(item.features.map((feature) => ({ bg: feature, en: feature })))},
    spec: { make: "${item.make}", model: "${item.model}", trim: "${item.trim.replaceAll('"', '\\"')}", year: ${item.year}, bodyType: "${item.bodyCode}", fuelType: "${item.fuelCode}", transmission: "${item.transmissionCode}", mileageValue: ${item.mileageKm}, mileageUnit: "km" },
    seller: { id: "dealer-isauto-varna", type: "dealer", displayName: "IS AUTO Varna", verificationStatus: "verified", city: "Варна" },
    publishedAt: "2026-09-${String(16 - index).padStart(2, '0')}T08:00:00.000Z", promoted: ${index < 3}
  }`).join(',\n');
const arrayStart = modernData.indexOf('export const mockListings: VehicleListing[] = [');
const arrayEnd = modernData.indexOf('\n\nconst matchesText =', arrayStart);
if (arrayStart < 0 || arrayEnd < 0) throw new Error('Cannot locate modern mockListings array.');
modernData = `${modernData.slice(0, arrayStart)}export const mockListings: VehicleListing[] = [\n${modernRecords}\n];${modernData.slice(arrayEnd)}`;
modernData = modernData.replace(/const legacyListingSlugAliases:[\s\S]*?\n};/, 'const legacyListingSlugAliases: Readonly<Record<string, string>> = {};');
modernData = modernData.replace(/export const mockSavedListingIds = \[[^\]]*\];/, 'export const mockSavedListingIds = ["is-1001", "is-1003", "is-1006"];');
modernData = modernData.replace(/const sellerListingStatuses: Record<string, VehicleListing\["status"\]> = \{[\s\S]*?\n\};/, 'const sellerListingStatuses: Record<string, VehicleListing["status"]> = {\n  "is-1001": "active",\n  "is-1003": "pending_review",\n  "is-1006": "draft",\n};');
const idMap = new Map([['am-1001','is-1001'],['am-1002','is-1002'],['am-1003','is-1003'],['am-1004','is-1004'],['am-1005','is-1005'],['am-1006','is-1006'],['am-1007','is-1001'],['am-1008','is-1003'],['am-1009','is-1002'],['am-1010','is-1002'],['am-1011','is-1005'],['am-1012','is-1003'],['am-1013','is-1006'],['am-1014','is-1002']]);
for (const [from, to] of idMap) modernData = modernData.split(from).join(to);
const titleMap = [
  ['2020 BMW X5 M50d', '2021 Audi R8 Performance V10'], ['2022 Mercedes-Benz GLE 53 AMG Coupe', '2018 BMW M5'],
  ['2020 Mercedes-Benz AMG GT 43', '2018 Audi A5 Sportback 2.0 TDI'], ['2018 Mercedes-Benz V 250d VIP Business', '2014 BMW X5 xDrive']
];
for (const [from, to] of titleMap) modernData = modernData.split(from).join(to);
await writeText(modernPath, modernData);

await writeText(`clients/${SLUG}/carwow/src/lib/data/daynight-site.ts`, `import { contactLinks } from '$lib/utils/contact-links';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const phoneE164 = '${PHONE_E164}';
const city = 'Варна';
const shortName = 'IS AUTO';
const district = 'Бизнес парк Варна';
const street = 'сграда B6';
const location = \`гр. \${city}, \${district}, \${street}\`;
export const daynightSite = {
  name: 'IS AUTO VARNA', shortName, city, region: city, countryCode: 'BG', locale: 'bg-BG', currency: 'EUR', phoneE164,
  ...contactLinks(phoneE164), phone: '0899266666', phoneLabel: '${PHONE_DISPLAY}', email: '${EMAIL}', location,
  locationShort: \`\${district}, \${city}\`, locationLandmark: \`\${district} · \${street}\`,
  hoursLabel: 'Пн–Пт 09:00–18:00 · Сб 10:00–16:00',
  mapEmbedSrc: \`https://www.google.com/maps?q=\${encodeURIComponent(location)}&z=16&output=embed\`,
  mapUrl: \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(location)}\`, mapLabel: \`\${shortName}, \${location}\`,
  sourceInventory: '${MOBILE}', logoLight: '/brand/isauto-logo-light.png', logoDark: '/brand/isauto-logo-dark.png',
  socialLinks: ${JSON.stringify({ facebook: social.facebook, instagram: social.instagram, youtube: '', tiktok: '' })},
  primaryCta: 'Виж наличните автомобили', sellCarCta: 'Продай или замени автомобил', accountCta: 'Свържи се с екипа', phoneCta: 'Обади се за оглед',
  heroTitle: 'IS AUTO VARNA', heroSubtitle: 'Подбрани автомобили и директен контакт с шоурума в Бизнес парк Варна',
  reviewCount: daynightReviewCount, reviewCountLabel: daynightReviewCountLabel, reviewLinkLabel: daynightReviewLinkLabel
} as const;
export const publicNavItems = [
  { label: 'Начало', href: '/' }, { label: 'Автомобили', href: '/inventory' }, { label: 'Продай или замени', href: '/sell-your-car' },
  { label: 'Услуги', href: '/services' }, { label: 'За нас', href: '/about' }, { label: 'Контакти', href: '/contact' }
] as const;
export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory', children: [
    { label: 'Всички автомобили', href: '/inventory' }, { label: 'Карта', href: '/inventory/map' }, { label: 'Сравнение', href: '/compare' }, { label: 'Калкулатор', href: '/calculator' }
  ] },
  { label: 'Продай или замени', href: '/sell-your-car', children: [
    { label: 'Продай или замени', href: '/sell-your-car' }, { label: 'Заявка за оценка', href: '/sell-your-car/request' }
  ] },
  { label: 'Услуги', href: '/services', children: [
    { label: 'Дилърски услуги', href: '/services' }, { label: 'Финансиране', href: '/financing' }, { label: 'ЧЗВ', href: '/faq' }
  ] },
  { label: 'За нас', href: '/about', children: [
    { label: 'За IS AUTO', href: '/about' }, { label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' }, { label: 'Условия', href: '/terms' }
  ] },
  { label: 'Контакти', href: '/contact' }
] as const;
export const footerNavItems = [
  { label: 'Налични автомобили', href: '/inventory' }, { label: 'Карта на автомобили', href: '/inventory/map' },
  { label: 'Финансиране', href: '/financing' }, { label: 'Калкулатор', href: '/calculator' },
  { label: 'Продай или замени', href: '/sell-your-car' }, { label: 'Заявка за оценка', href: '/sell-your-car/request' },
  { label: 'Услуги', href: '/services' }, { label: 'ЧЗВ', href: '/faq' }
] as const;`);

const carwowRecords = listings.map((item, index) => `  {
    id: '${item.id}', title: '${item.title.replaceAll("'", "\\'")} ${item.trim.replaceAll("'", "\\'")}', sourceUrl: '${item.sourceUrl}',
    priceEur: '${new Intl.NumberFormat('bg-BG').format(item.priceEur)} €', priceBgn: '${item.priceBgn}', status: 'Наличен',
    date: '${item.year} г.', mileage: '${new Intl.NumberFormat('bg-BG').format(item.mileageKm)} км', color: '${item.color}', fuel: '${item.fuelLong}', power: '${item.power}',
    transmission: '${item.transmissionLong}', body: '${item.bodyBg}', features: ${JSON.stringify(item.features)}, image: '/assets/isauto/inventory-${index + 1}.webp'
  }`).join(',\n');
await writeText(`clients/${SLUG}/carwow/src/lib/data/daynight-current-inventory.ts`, `// Public IS AUTO Varna listing snapshot captured from the official site on ${TODAY}.
// Images are localized from the same listing pages to prevent hotlink failures.
export type CurrentDayNightListing = {
  id: string; title: string; sourceUrl: string; priceEur: string; priceBgn: string; status: string; date: string; mileage: string;
  color: string; fuel: string; power: string; transmission: string; body: string; features: string[]; image: string;
};
export const currentDayNightListings: CurrentDayNightListing[] = [
${carwowRecords}
];`);

await writeText(`clients/${SLUG}/carwow/src/lib/data/daynight-reviews.ts`, `export type DayNightReview = { id: string; text: string; avatar: \`/assets/\${string}\`; name: string; label: string; rating: number; };
export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = 'Няма публикувани или внесени клиентски оценки в този демонстрационен сайт.';
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = 'Няма добавени отзиви';
export const daynightReviewLinkLabel = daynightReviewCountLabel;
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({ id: \`\${rating}-star\`, label: String(rating), count: 0, percent: '0%' }));`);

let carwowVehicles = await readText(`clients/${SLUG}/carwow/src/lib/data/daynight-vehicles.ts`);
carwowVehicles = carwowVehicles
  .replaceAll('Наличен автомобил в София', 'Наличен автомобил във Варна')
  .replaceAll('Наличен автомобил в Варна', 'Наличен автомобил във Варна')
  .replaceAll("lot: `DN-${listing.id.slice(-6)}`", "lot: `IS-${listing.id.slice(-6)}`");
await writeText(`clients/${SLUG}/carwow/src/lib/data/daynight-vehicles.ts`, carwowVehicles);

const facts = {
  schemaVersion: 1,
  dealer: { slug: SLUG, name: 'IS AUTO Varna', shortName: 'IS AUTO', country: 'BG', city: 'Varna', address: ADDRESS },
  contact: { phone: PHONE_DISPLAY, phoneE164: PHONE_E164, email: EMAIL, website: SITE, inventoryProfile: MOBILE },
  openingHours: { weekdays: '09:00–18:00', saturday: '10:00–16:00', sunday: 'closed' },
  positioning: 'New and used vehicles, vehicle sourcing/import, purchase consultation and support with registration, insurance and finance discussions.',
  sourceUrls: [SITE, CONTACTS, 'https://www.isauto.net/about-us/', MOBILE],
  verifiedAt: TODAY,
  notes: [
    'This is an unpublished prospect demo; no commercial relationship or outreach is implied.',
    'Inventory is a dated public sample, not a live feed. Availability, specification and price must be confirmed directly with the dealer.',
    'Forms remain preview interactions unless a delivery backend is explicitly configured and tested.'
  ]
};
await writeJson(`clients/${SLUG}/business-facts.json`, facts);
await writeJson(`clients/${SLUG}/FACTS-AND-INVENTORY.json`, {
  schemaVersion: 1, observedAt: TODAY, dealer: facts.dealer,
  sources: { officialSite: SITE, contactPage: CONTACTS, mobileProfile: MOBILE },
  inventory: listings.map((item, index) => ({
    id: item.id, title: item.title, year: item.year, mileageKm: item.mileageKm, fuel: item.fuelBg, transmission: item.transmissionBg,
    priceEur: item.priceEur, priceBgn: item.priceBgn, sourceUrl: item.sourceUrl, localizedImage: {
      autoBest: `auto-best/static/assets/images/lead/isauto/inventory-${index + 1}.webp`,
      modern: `modern/apps/web/public/isauto/inventory-${index + 1}.webp`,
      carwow: `carwow/static/assets/isauto/inventory-${index + 1}.webp`
    }
  })),
  caveat: 'Dated official-site snapshot; not a live availability feed.'
});
await writeJson(`clients/${SLUG}/assets/provenance.json`, {
  schemaVersion: 1, capturedAt: TODAY,
  brand: {
    name: 'IS AUTO', source: SITE,
    implementation: 'Transparent raster wordmark refresh using the public IS AUTO name and red/black brand treatment; no boxed background.',
    files: [
      'auto-best/static/assets/images/lead/isauto/logo-dark.png',
      'auto-best/static/assets/images/lead/isauto/logo-light.png',
      'modern/apps/web/public/isauto/logo-dark.png',
      'modern/apps/web/public/isauto/logo-light.png',
      'carwow/static/brand/isauto-logo-dark.png',
      'carwow/static/brand/isauto-logo-light.png'
    ]
  },
  hero: { sourceUrl: HERO_SOURCE, localizedAs: [
    'modern/apps/web/public/isauto/hero.webp',
    'carwow/static/assets/isauto/hero.webp'
  ] },
  inventory: imageProvenance,
  usage: 'Localized inside the three prospect variants; no external hotlinks are required at runtime.'
});

await writeText(`clients/${SLUG}/CLIENT.md`, `# IS AUTO Varna

Status: new Varna prospect demo; no sale, outreach or CRM registration is implied.

## Verified public identity

- IS AUTO showroom in Varna
- ${ADDRESS}, Varna
- ${PHONE_DISPLAY}
- ${EMAIL}
- Monday–Friday 09:00–18:00; Saturday 10:00–16:00; Sunday closed
- Official site: ${SITE}
- Public inventory profile: ${MOBILE}

## Implemented variants
- Auto Best at \`/\`
- Modern at \`/variant-2/cars\`
- Carwow at \`/variant-3/\`

All variants use one dated six-vehicle official-site sample, localized dealer photography, one contact identity and transparent raster branding. The layouts remain the approved template compositions.

## Limitations

Inventory is not a live feed. Confirm availability, price, equipment and transaction terms directly with the dealer. Preview forms do not prove message delivery. No customer reviews, completed sales, warranties or guaranteed finance outcomes are asserted.`);
await writeText(`clients/${SLUG}/BUILD-STATUS.md`, `# Build status — IS AUTO Varna

- Canonical source: \`clients/${SLUG}\`
- Target branch: \`main\`
- Templates: Auto Best + Modern + Carwow
- Identity: personalized from verified public sources
- Inventory: six official-site listings observed ${TODAY}
- Media: localized from official IS AUTO pages; no runtime hotlinks
- Logo: transparent raster refresh, dark and light variants, no box
- Contact path: phone, email and map identity aligned across variants
- Review content: no fabricated customer reviews
- Build checks: performed by the build workflow before commit
- Hosted desktop/mobile review: pending deployment verification
`);

for (const variant of ['auto-best', 'modern', 'carwow']) {
  const relative = `clients/${SLUG}/${variant}/.client/project.json`;
  const project = JSON.parse(await readText(relative));
  project.state = 'personalized-needs-hosted-qa';
  project.offeredHomes = project.availableHomes;
  project.publicUrl = null;
  project.qa = { desktop: false, mobile: false, identity: true, contactPath: true };
  project.businessFacts = `clients/${SLUG}/business-facts.json`;
  project.stock = `clients/${SLUG}/FACTS-AND-INVENTORY.json`;
  project.assetProvenance = `clients/${SLUG}/assets/provenance.json`;
  project.limitations = [
    'Unpublished prospect demo; no agreement, outreach or CRM registration implied.',
    'Dated public inventory sample, not a live feed; confirm availability and prices.',
    'Forms and calculators remain preview interactions until a backend is configured and tested.',
    'No customer reviews, completed sales or guaranteed finance outcomes are asserted.',
    'Desktop and mobile hosted visual QA remains false until the deployed routes are reviewed.'
  ];
  await writeJson(relative, project);
}

const manifestPath = `clients/${SLUG}/dealer.json`;
const manifest = JSON.parse(await readText(manifestPath));
manifest.repository = 'darkapoparka/cars-isautovarna';
manifest.extraAssets = ['assets/provenance.json'];
await writeJson(manifestPath, manifest);

const leadRegistryPath = 'leads/bulgaria.json';
const leadRegistry = JSON.parse(await readText(leadRegistryPath));
leadRegistry.updatedAt = TODAY;
const leadRecord = {
  id: 'bg-varna-isauto-varna', name: 'IS AUTO Varna', country: 'BG', city: 'Varna', priority: 'new-build',
  inventory: { count: listings.length, kind: 'verified_official_site_sample', observedAt: TODAY, sourceUrl: SITE },
  website: { url: SITE, status: 'independent_site_found', assessedAt: TODAY, confidence: 'high' },
  businessContactSource: CONTACTS,
  evidenceNote: 'Official contact page confirms the Varna showroom at Business Park Varna, building B6, its phone, email and opening hours. Six official-site vehicle pages were localized for the prospect demo.',
  opportunityHypothesis: 'A single direct dealership experience with three selectable design directions, consistent stock presentation and a clear Varna viewing/contact path.',
  existingClientPath: `clients/${SLUG}`,
  recommendedEntryTemplate: 'auto-best',
  nextAction: 'Complete hosted route and responsive QA before any outreach. Reconfirm stock availability and private contact history; outreach remains unapproved.'
};
const existingLead = leadRegistry.leads.findIndex((item) => item.id === leadRecord.id || item.existingClientPath === leadRecord.existingClientPath);
if (existingLead >= 0) leadRegistry.leads[existingLead] = leadRecord; else leadRegistry.leads.push(leadRecord);
await writeJson(leadRegistryPath, leadRegistry);

await writeText('.github/workflows/publish-isauto-package.yml', `name: Publish IS AUTO Varna package branch

on:
  push:
    branches:
      - main
    paths:
      - .github/workflows/publish-isauto-package.yml
      - clients/${SLUG}/**
      - scripts/package-dealer.mjs
      - scripts/publishing/**
      - catalog.json
      - templates.lock.json
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: publish-${SLUG}-package
  cancel-in-progress: false

jobs:
  publish:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    steps:
      - name: Check out canonical source
        uses: actions/checkout@v4
        with:
          ref: main          fetch-depth: 1

      - name: Build deterministic package
        shell: bash
        run: |
          set -euo pipefail
          node scripts/package-dealer.mjs \\
            --client ${SLUG} \\
            --out runtime/dealer-packages/${SLUG} \\
            --source-commit "$GITHUB_SHA" \\
            --write

      - name: Publish package branch
        shell: bash
        env:
          GH_TOKEN: \${{ github.token }}
          PACKAGE_BRANCH: publish/${SLUG}
        run: |
          set -euo pipefail
          package="$GITHUB_WORKSPACE/runtime/dealer-packages/${SLUG}"
          publish_dir="$RUNNER_TEMP/${SLUG}-publish"
          mkdir -p "$publish_dir"
          cd "$publish_dir"
          git init
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git remote add origin "https://x-access-token:\${GH_TOKEN}@github.com/\${GITHUB_REPOSITORY}.git"
          if git fetch --depth=1 origin "refs/heads/\${PACKAGE_BRANCH}"; then
            git checkout -B "$PACKAGE_BRANCH" FETCH_HEAD
            find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
          else
            git checkout --orphan "$PACKAGE_BRANCH"
          fi
          cp -a "$package"/. .
          git add -A
          if git diff --cached --quiet; then
            echo "Package branch already matches canonical $GITHUB_SHA"
            exit 0
          fi
          git commit -m "Publish ${SLUG} from canonical $GITHUB_SHA"
          git push origin "HEAD:refs/heads/\${PACKAGE_BRANCH}"
`);

const modernDirectoryPath = `clients/${SLUG}/modern/packages/marketplace/mock-directory.ts`;
let modernDirectory = await readText(modernDirectoryPath);
const modernDirectoryTailIndex = modernDirectory.indexOf('const scaleOrganizationTypes');
if (modernDirectoryTailIndex < 0) throw new Error('Cannot locate Modern directory scale fixtures.');
let modernDirectoryTail = modernDirectory.slice(modernDirectoryTailIndex);
for (const [from, to] of idMap) modernDirectoryTail = modernDirectoryTail.split(from).join(to);
const modernDirectoryCore = `import {
  type OrganizationDirectoryEntry,
  type OrganizationDirectoryType,
  type OrganizationInventoryAvailabilityKind,
  organizationDirectoryEntriesSchema,
} from "./directory";
import { getMockListingById } from "./mock-data";

const getRepresentativeVehicle = (
  listingId: string,
  availability: OrganizationInventoryAvailabilityKind
) => {
  const listing = getMockListingById(listingId);
  const image = listing?.images[0];
  if (!(listing && image)) {
    throw new Error(\`Missing representative marketplace listing: \${listingId}\`);
  }
  return {
    availability,
    href: \`/listing/\${listing.slug}\`,
    id: listing.id,
    image: { alt: image.alt, url: image.url },
    price: listing.price,
    title: listing.title,
  };
};

/** Verified public IS AUTO identity plus plainly labelled synthetic scale records. */
export const mockOrganizationDirectoryCoreEntries =
  organizationDirectoryEntriesSchema.parse([
    {
      brandCoverage: [
        { authorizationVerified: false, brand: "Audi", relationship: "independent_importer" },
        { authorizationVerified: false, brand: "BMW", relationship: "independent_importer" },
      ],
      claimStatus: "unclaimed",
      contact: {
        email: "${EMAIL}",
        phone: "${PHONE_E164}",
        websiteUrl: "${SITE}",
      },
      dealerOrgId: "dealer-isauto-varna",
      description: "Публичен профил на IS AUTO Varna с шест автомобила от официалния сайт, локализирани за този демонстрационен проект.",
      displayName: "IS AUTO Varna",
      headquarters: { city: "Варна", countryCode: "BG" },
      headline: "Подбрани автомобили в Бизнес парк Варна",
      id: "directory-isauto-varna",
      inventory: {
        activeListingCount: 6,
        inTransitCount: 0,
        lastConfirmedAt: "${TODAY}T08:00:00.000Z",
        localCount: 6,
        orderableCount: 0,
        sourceStockCount: 0,
      },
      orgType: "dealer",
      profileImage: {
        alt: "IS AUTO Varna в Бизнес парк Варна",
        url: "/isauto/hero.webp",
      },
      representativeVehicles: [
        getRepresentativeVehicle("is-1001", "local"),
        getRepresentativeVehicle("is-1002", "local"),
        getRepresentativeVehicle("is-1003", "local"),
      ],
      slug: "isauto-varna",
      tradeLanes: [],
      verification: {
        businessVerified: true,
        inventoryCurrent: true,
        trustedSupplier: false,
      },
    },
  ]);
`;
await writeText(modernDirectoryPath, `${modernDirectoryCore}\n${modernDirectoryTail}`);

const unusedAutoBestMedia = [
  'auto-best/static/assets/images/icon-box/car-list3.png',
  'auto-best/static/assets/images/icon-box/car-list6.png',
  'auto-best/static/assets/images/lead/day-night-stock-01.webp',
  'auto-best/static/assets/images/lead/day-night-stock-02.webp',
  'auto-best/static/assets/images/lead/day-night-stock-03.webp',
  'auto-best/static/assets/images/lead/day-night-stock-04.webp',
  'auto-best/static/assets/images/lead/day-night-stock-05.webp',
  'auto-best/static/assets/images/lead/day-night-stock-06.webp',
  'auto-best/static/assets/images/lead/isauto/hero.webp',
  'auto-best/static/assets/images/partner/parner10.png',
  'auto-best/static/assets/images/partner/parner7.png',
  'auto-best/static/assets/images/partner/parner8.png',
  'auto-best/static/assets/images/partner/parner9.png',
  'auto-best/static/assets/images/partner/partner1.png',
  'auto-best/static/assets/images/partner/partner2.png',
  'auto-best/static/assets/images/partner/partner3.png',
  'auto-best/static/assets/images/partner/partner4.png',
  'auto-best/static/assets/images/partner/partner5.png',
  'auto-best/static/assets/images/partner/partner6.png',
  'auto-best/static/assets/images/template/auto-best-logo-light.svg',
  'auto-best/static/assets/images/template/auto-best-logo.svg',
  'auto-best/static/assets/images/template/body-wagon-v1.png'
];
for (const relative of unusedAutoBestMedia) {
  await fs.rm(path.join(CLIENT, relative), { force: true });
}
const personalizedAssetCheckPath = path.join(CLIENT, 'auto-best/scripts/check-assets.mjs');
let personalizedAssetCheck = await fs.readFile(personalizedAssetCheckPath, 'utf8');
personalizedAssetCheck = personalizedAssetCheck.replace('const guardedMediaCount = 126;', 'const guardedMediaCount = 104;');
await fs.writeFile(personalizedAssetCheckPath, personalizedAssetCheck, 'utf8');

console.log(json({
  client: SLUG,
  variants: ['auto-best', 'modern', 'carwow'],
  inventoryCount: listings.length,
  localizedImages: imageProvenance.map((item) => item.localizedAs),
  social,
  status: 'personalized'
}).trim());