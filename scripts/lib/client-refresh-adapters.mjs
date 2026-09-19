import { ensureImportMenuKeys } from './import-menu-keys.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { applyDealerLogoContract } from './client-logo-contract.mjs';
import { applyCarwowSafeContent, applyImportSafeContent } from './client-refresh-safe-content.mjs';

const exists = (file) => fs.existsSync(file);
const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value.replace(/\r?\n/g, '\n'));
};
const q = (value) => JSON.stringify(String(value ?? ''));
const textExtensions = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.svelte', '.html', '.json']);
function patchTextTree(root, replacements, ignoredDirectories = new Set()) {
  const changed = [];
  const visit = (current) => {
    if (!exists(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (textExtensions.has(path.extname(entry.name).toLowerCase())) {
        let value = read(target);
        const before = value;
        for (const [from, to] of replacements) value = value.split(from).join(to);
        if (value !== before) {
          write(target, value);
          changed.push(target);
        }
      }
    }
  };
  visit(root);
  return changed;
}
const unique = (values) => [...new Set(values.filter(Boolean))];
function replaceExportConstBlock(text, name, replacement) {
  const start = text.indexOf(`export const ${name} =`);
  if (start < 0) throw new Error(`Cannot locate export const ${name}`);
  const marker = ' as const;';
  const end = text.indexOf(marker, start);
  if (end < 0) throw new Error(`Cannot locate end of export const ${name}`);
  return text.slice(0, start) + replacement + text.slice(end + marker.length);
}
const publicRoot = (key, variant) =>
  key === 'modern' ? path.join(variant, 'apps/web/public') : path.join(variant, 'static');
const findScalar = (text, key) =>
  text.match(new RegExp(`${key}\\s*:\\s*['"]([^'"]+)['"]`))?.[1] || '';
const RASTER_LOGO_EXTENSION = /\.(?:png|webp)$/i;
const isRasterLogo = (value) => typeof value === 'string' &&
  RASTER_LOGO_EXTENSION.test(value.split(/[?#]/, 1)[0]);
const rasterLogoCandidates = (value) => {
  const source = String(value || '');
  if (!source) return [];
  if (isRasterLogo(source)) return [source];
  const match = source.match(/^(.*)\.[^./?#]+([?#].*)?$/);
  if (!match) return [];
  const suffix = match[2] || '';
  return [`${match[1]}.webp${suffix}`, `${match[1]}.png${suffix}`];
};
function requireRasterLogo(value, key, surface) {
  if (!isRasterLogo(value)) {
    throw new Error(`${key}: missing committed PNG/WebP logo for ${surface}; SVG, CSS and text fallbacks are not accepted.`);
  }
  return value;
}

function publicAssetExists(variant, key, publicPath) {
  return Boolean(publicPath?.startsWith('/') &&
    exists(path.join(publicRoot(key, variant), publicPath.slice(1))));
}

function canonicalAssetSource(variant, publicPath) {
  if (!publicPath?.startsWith('/')) return '';
  const client = path.dirname(variant);
  const relative = publicPath.slice(1);
  const parts = relative.split('/');
  const candidates = [path.join(client, relative)];
  if (parts[0] === 'assets' && parts.length > 2) {
    candidates.push(path.join(client, 'assets', ...parts.slice(2)));
    candidates.push(path.join(client, 'assets', path.basename(relative)));
  }
  return candidates.find((candidate) => exists(candidate)) || '';
}

function dealerAssetExists(variant, key, publicPath) {
  return publicAssetExists(variant, key, publicPath) ||
    Boolean(canonicalAssetSource(variant, publicPath));
}

function pickLogo(oldVariant, key, business, dark = false) {
  const candidates = dark
    ? [business.logoDark, business.logoLight, business.logo]
    : [business.logo, business.logoLight, business.logoDark];
  const configFile = key === 'modern'
    ? path.join(oldVariant, 'packages/marketplace/lead-site.ts')
    : key === 'auto-best'
      ? path.join(oldVariant, 'src/lib/config/brand.ts')
      : key === 'carwow'
        ? path.join(oldVariant, 'src/lib/data/daynight-site.ts')
        : path.join(oldVariant, 'src/lib/data/daynight.ts');
  const config = exists(configFile) ? read(configFile) : '';
  const keys = key === 'modern'
    ? ['logoPath']
    : key === 'auto-best'
      ? dark ? ['logoOnDark', 'logo', 'logoLight'] : ['logo', 'logoLight', 'logoOnDark']
      : dark ? ['logoDark', 'logoLight'] : ['logoLight', 'logoDark'];
  candidates.push(...keys.map((name) => findScalar(config, name)));
  for (const candidate of candidates) {
    for (const raster of rasterLogoCandidates(candidate)) {
      if (dealerAssetExists(oldVariant, key, raster)) return raster;
    }
  }
  const root = publicRoot(key, oldVariant);
  const preferred = dark
    ? ['wordmark-light.webp', 'wordmark-light.png', 'logo-on-dark.webp', 'logo-on-dark.png', 'logo-dark.webp', 'logo-dark.png', 'logo-light.webp', 'logo-light.png', 'wordmark.webp', 'wordmark.png', 'logo.webp', 'logo.png']
    : ['wordmark.webp', 'wordmark.png', 'logo-on-light.webp', 'logo-on-light.png', 'logo-light.webp', 'logo-light.png', 'logo.webp', 'logo.png'];
  for (const folder of ['', 'dealer', 'brand', 'navara', business.slug || '']) {
    for (const name of preferred) {
      const rel = [folder, name].filter(Boolean).join('/');
      if (exists(path.join(root, rel))) return `/${rel}`;
    }
  }
  return '';
}

function localeLanguage(profile) {
  return profile.business.countryCode === 'BG' ? 'bg' : 'en';
}
function textFor(profile, bg, en) {
  return localeLanguage(profile) === 'bg' ? bg : en;
}
function mileageKm(listing) {
  return Math.max(0, Math.round(
    listing.mileageUnit === 'mi' ? listing.mileageValue * 1.609344 : listing.mileageValue
  ));
}
function autoBestBody(bodyType, rawBody = '') {
  const normalized = String(bodyType || '').toLowerCase();
  const raw = String(rawBody || '').toLowerCase();
  if (normalized === 'hatchback') return 'Hatchback';
  if (normalized === 'sedan') return 'Sedan';
  if (normalized === 'wagon') return 'Wagon';
  if (normalized === 'suv') return 'SUV';
  if (normalized === 'coupe') return 'Coupe';
  if (normalized === 'convertible') return 'Convertible';
  if (normalized === 'pickup') return 'Pickup Truck';
  if (normalized === 'van' || normalized === 'minibus') return 'Minivan';
  if (raw.includes('sportback') || raw.includes('спортбек')) return 'Sportback';
  return rawBody || bodyType || 'Other';
}
function autoBestEquipment(features) {
  const joined = features.join(' ').toLowerCase();
  const result = [];
  if (/4x4|awd|quattro|xdrive|4matic/.test(joined)) result.push('4x4');
  if (/360/.test(joined)) result.push('360° камера');
  if (/panoram|панорам/.test(joined)) result.push('Панорамен покрив');
  if (/heated|подгр/.test(joined)) result.push('Подгряване на седалки');
  if (/nav|навига/.test(joined)) result.push('Навигация');
  if (/park|парктр/.test(joined)) result.push('Парктроник');
  if (/keyless|безключ/.test(joined)) result.push('Безключов достъп');
  if (/adaptive cruise|адаптив.*круиз/.test(joined)) result.push('Адаптивен круиз контрол');
  return result;
}

function autoBestBrand(profile, logo, logoDark) {
  const b = profile.business;
  const social = b.socialLinks || {};
  return `export type BrandConfig = {
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

const name = ${q(b.name)};
const shortName = ${q(b.shortName || b.name)};
const city = ${q(b.city)};
const addressLine = ${q(b.addressLine || b.address)};

export const brand = {
  name,
  shortName,
  city,
  youtubeUrl: ${q(social.youtube || 'https://www.youtube.com/')},
  instagramUrl: ${q(social.instagram || 'https://www.instagram.com/')},
  facebookUrl: ${q(social.facebook || 'https://www.facebook.com/')},
  phone: ${q(b.phoneDisplay)},
  phoneHref: ${q(b.phoneHref || `tel:${b.phoneE164}`)},
  addressLine,
  address: ${q(b.address || b.addressLine)},
  appointment: ${q(b.hours)},
  logo: ${q(logo)},
  logoOnDark: ${q(logoDark || logo)}
} as const satisfies BrandConfig;
`;
}

function autoBestInventory(profile) {
  const b = profile.business;
  const records = profile.listings.map((item, index) => ({
    id: index + 1,
    verification: 'verified',
    evidenceUrl: item.sourceUrl || b.inventoryUrl,
    image: item.image,
    category: item.body || item.bodyType,
    body: autoBestBody(item.bodyType, item.body),
    make: item.make,
    title: item.title,
    year: String(item.year),
    yearNumber: item.year,
    mileage: item.mileageUnit === 'mi'
      ? `${new Intl.NumberFormat(b.locale || 'en-US').format(item.mileageValue)} mi`
      : `${new Intl.NumberFormat(b.locale || 'bg-BG').format(item.mileageValue)} км`,
    mileageKm: mileageKm(item),
    fuel: item.fuel,
    transmission: item.transmission,
    equipment: autoBestEquipment(item.features),
    condition: item.condition,
    priceEur: Number(item.priceAmount || 0),
    href: `/listing-detail-v1/${index + 1}`
  }));
  return `export type VehicleCondition = 'new' | 'used';
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

export const featuredVehicles: Vehicle[] = ${JSON.stringify(records, null, 2)};

const inventoryLocale = ${q(b.locale || 'en-US')};
const inventoryCurrency = ${q(b.currency || 'EUR')};
export const formatVehiclePrice = (amount: number) =>
  new Intl.NumberFormat(inventoryLocale, {
    style: 'currency',
    currency: inventoryCurrency,
    maximumFractionDigits: 0
  }).format(amount);
`;
}

function autoBestCompany(profile) {
  const b = profile.business;
  const english = localeLanguage(profile) !== 'bg';
  const supported = ['inspection', 'import', 'leasing', 'trade-in'];
  const services = (b.services || []).slice(0, 4).map((service, index) => ({
    index: String(index + 1).padStart(2, '0'),
    icon: supported[index],
    title: service.title || service.name || (english ? 'Dealer service' : 'Услуга'),
    description: service.description || service.text || b.previewNotice,
    href: `/contact?topic=${supported[index]}`,
    cta: english ? 'Ask the dealer' : 'Попитайте автокъщата'
  }));
  if (!services.length) {
    services.push({
      index: '01',
      icon: 'inspection',
      title: english ? `Viewing in ${b.city}` : `Оглед в ${b.city}`,
      description: b.hours,
      href: '/contact?topic=inspection',
      cta: english ? 'Arrange a viewing' : 'Уговорете оглед'
    });
  }
  const topic = (id, label, title) => ({
    id, label, title,
    description: english
      ? `Contact ${b.shortName || b.name} to confirm availability, details, and the next step.`
      : `Свържете се с ${b.shortName || b.name}, за да потвърдите наличност, данни и следваща стъпка.`
  });
  const topics = [
    topic('general', english ? 'General question' : 'Общ въпрос', english ? 'Contact the dealer' : 'Разговор с екипа'),
    topic('inspection', english ? 'Viewing' : 'Оглед', english ? `Viewing in ${b.city}` : `Оглед в ${b.city}`),
    topic('import', english ? 'Import' : 'Внос', english ? 'Import enquiry' : 'Запитване за внос'),
    topic('leasing', english ? 'Financing' : 'Лизинг', english ? 'Financing enquiry' : 'Запитване за лизинг'),
    topic('trade-in', english ? 'Trade-in' : 'Бартер', english ? 'Trade-in enquiry' : 'Запитване за бартер')
  ];
  const coordinates = b.coordinates && Number.isFinite(b.coordinates.latitude) &&
    Number.isFinite(b.coordinates.longitude)
    ? b.coordinates : { latitude: 0, longitude: 0 };
  return `import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string; };
export type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string; };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {};
export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export const companyServices: CompanyService[] = ${JSON.stringify(services, null, 2)};
export const contactTopics: ContactTopic[] = ${JSON.stringify(topics, null, 2)};
export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = ${JSON.stringify(coordinates)} as const;
export const dealerAddress = brand.address;
`;
}

function patchAutoBestMap(candidate, profile) {
  const file = path.join(candidate, 'src/lib/components/company/ShowroomMap.svelte');
  let text = read(file);
  text = text.replace("  import { showroomCoordinates } from '$data/company';\n\n  const mapEmbedUrl = `https://maps.google.com/maps?q=${showroomCoordinates.latitude},${showroomCoordinates.longitude}&z=17&hl=bg&output=embed`;",
    `  const mapEmbedUrl = ${q(profile.business.mapsEmbedUrl)};`);
  text = text.replace('title={`Карта до ${brand.name}`}',
    `title={${q(textFor(profile, 'Карта до', 'Map to'))} + \` \${brand.name}\`}`);
  text = text.replace('>Отворете в Google Maps</a>',
    `>${textFor(profile, 'Отворете в Google Maps', 'Open in Google Maps')}</a>`);
  write(file, text);
}

function patchAutoBestHero(candidate) {
  const file = path.join(candidate, 'src/lib/components/home/Hero.svelte');
  if (!exists(file)) return null;
  let text = read(file);
  text = text.replace(
    '{brand.city} · Студентски град · Оглед по уговорка',
    '{brand.addressLine} · Оглед по уговорка'
  );
  write(file, text);
  return 'src/lib/components/home/Hero.svelte (dealer location binding)';
}

function patchAutoBestIdentity(candidate) {
  const file = path.join(candidate, 'src/routes/listing-detail-v1/[id]/+page.svelte');
  let text = read(file);
  text = text
    .replace('aria-label="Auto Best"', 'aria-label={brand.name}')
    .replace('alt="Auto Best — доверен дилър. Обсъдете автомобила."',
      'alt={`${brand.name} — доверен дилър. Обсъдете автомобила.`}');
  write(file, text);
  return 'src/routes/listing-detail-v1/[id]/+page.svelte (dealer identity)';
}

function patchAutoBest({ oldVariant, candidate, profile }) {
  const b = profile.business;
  const freshBrand = read(path.join(candidate, 'src/lib/config/brand.ts'));
  const logo = requireRasterLogo(pickLogo(oldVariant, 'auto-best', b, false), 'auto-best', 'light surfaces');
  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'auto-best', b, true) || logo, 'auto-best', 'dark surfaces');
  write(path.join(candidate, 'src/lib/config/brand.ts'), autoBestBrand(profile, logo, logoDark));
  write(path.join(candidate, 'src/lib/data/inventory.ts'), autoBestInventory(profile));
  write(path.join(candidate, 'src/lib/data/company.ts'), autoBestCompany(profile));
  write(path.join(candidate, 'src/lib/data/dealer-profile.json'), `${JSON.stringify(profile, null, 2)}\n`);
  patchAutoBestMap(candidate, profile);
  const identityFile = patchAutoBestIdentity(candidate);
  return [
    'src/lib/config/brand.ts',
    'src/lib/data/inventory.ts',
    'src/lib/data/company.ts',
    'src/lib/data/dealer-profile.json',
    'src/lib/components/company/ShowroomMap.svelte (address adapter)',
    identityFile
  ];
}

function modernListing(item, index, id, profile) {
  const b = profile.business;
  const fuel = ['gasoline', 'diesel', 'hybrid', 'plug_in_hybrid', 'electric', 'lpg', 'cng'].includes(item.fuelType)
    ? item.fuelType : 'other';
  const transmission = item.transmissionType === 'manual' ? 'manual' :
    item.transmissionType === 'automatic' ? 'automatic' : 'semi_automatic';
  const body = ['hatchback', 'sedan', 'wagon', 'suv', 'coupe', 'convertible', 'pickup', 'van', 'minibus', 'motorcycle', 'scooter', 'truck'].includes(item.bodyType)
    ? item.bodyType : 'other';
  const features = item.features.slice(0, 8).map((feature) => ({ bg: feature, en: feature }));
  return {
    id,
    slug: item.slug || `${b.slug}-${index + 1}`,
    category: body === 'van' ? 'van' : 'car',
    dealerOrgId: `dealer-${b.slug}`,
    status: 'active',
    title: item.title,
    description: item.description || b.inventoryNotice,
    price: { amount: Number(item.priceAmount || 0), currency: item.currency || b.currency },
    priceType: 'fixed',
    images: item.images.map((url) => ({ url, alt: item.title })),
    badges: [item.condition === 'new' ? 'new' : 'used'],
    location: { city: b.city, region: b.region || b.city, country: b.country },
    ...(features.length ? { features } : {}),
    spec: {
      make: item.make,
      model: item.model,
      ...(item.trim ? { trim: item.trim } : {}),
      year: item.year,
      bodyType: body,
      fuelType: fuel,
      transmission,
      mileageValue: mileageKm(item),
      mileageUnit: 'km',
      ...(item.powerHp ? { enginePowerHp: item.powerHp } : {}),
      ...(item.color ? { colorExterior: item.color } : {})
    },
    seller: {
      id: `dealer-${b.slug}`,
      type: 'dealer',
      displayName: b.name,
      verificationStatus: 'unverified',
      city: b.city,
      ...(b.logo ? { logoUrl: b.logo } : {})
    },
    publishedAt: `${(item.observedAt || b.observedAt || '2026-01-01').slice(0, 10)}T09:00:00.000Z`,
    promoted: index < 3
  };
}

function replaceModernListings(file, profile) {
  let text = read(file);
  const startMarker = 'export const mockListings: VehicleListing[] = [';
  const endMarker = '\n];\n\nconst matchesText';
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Cannot locate modern mockListings in ${file}`);
  const currentBlock = text.slice(start, end);
  const ids = unique([...currentBlock.matchAll(/\n  \{\n    id:\s*"([^"]+)"/g)]
    .map((match) => match[1]));
  if (!ids.length) throw new Error(`No stable modern listing IDs found in ${file}`);
  const listings = ids.map((id, index) =>
    modernListing(profile.listings[index % profile.listings.length], index, id, profile));
  const replacement = `export const mockListings: VehicleListing[] = ${JSON.stringify(listings, null, 2)}`;
  text = `${text.slice(0, start)}${replacement}${text.slice(end + 3)}`;
  write(file, text);
}

function replaceLeadScalar(text, key, value) {
  const rx = new RegExp(`(^\\s*${key}:\\s*)(?:"[^"]*"|'[^']*'|true|false)(,?)`, 'm');
  return text.replace(rx, `$1${typeof value === 'boolean' ? String(value) : q(value)}$2`);
}

function patchModernDealerText(candidate, profile) {
  const b = profile.business;
  const replacements = [
    ['DAY NIGHT AUTO GROUP', b.name.toUpperCase()],
    ['Day Night Auto Group', b.name],
    ['Day & Night Auto Group', b.name],
    ['Day Night Auto', b.shortName || b.name],
    ['Day & Night', b.shortName || b.name],
    ['0877733110', b.phoneE164.replace(/\D/g, '')],
    ['0877 733 110', b.phoneDisplay],
    ['daynight-sales', `${b.slug}-sales`],
    ['daynight-import', `${b.slug}-import`],
    ['daynight-inspection', `${b.slug}-documents`],
    ['София', b.city],
    ['Sofia', b.city],
    ['Студентски град', b.region || b.city],
    ['Studentski grad', b.region || b.city]
  ];
  const roots = [
    path.join(candidate, 'apps/web/app'),
    path.join(candidate, 'apps/web/lib'),
    path.join(candidate, 'packages/marketplace'),
    path.join(candidate, 'packages/marketplace-ui')
  ];
  return roots.flatMap((root) => patchTextTree(root, replacements,
    new Set(['node_modules', '.next', 'dist', 'build'])));
}

function patchModern({ oldVariant, candidate, profile }) {
  const b = profile.business;
  const listingFile = path.join(candidate, 'packages/marketplace-domain/testing/mock-data.ts');
  replaceModernListings(listingFile, profile);
  const file = path.join(candidate, 'packages/marketplace/lead-site.ts');
  let text = read(file);
  const logo = requireRasterLogo(pickLogo(oldVariant, 'modern', b, false), 'modern', 'primary surfaces');
  const values = {
    accent: b.accent,
    address: b.address,
    city: b.city,
    contactUrl: b.phoneHref,
    country: b.country,
    countryCode: b.countryCode,
    currency: b.currency,
    email: b.email,
    locale: b.locale,
    logoPath: logo,
    mapsEmbedUrl: b.mapsEmbedUrl,
    mapsUrl: b.mapsUrl,
    name: b.name,
    phoneDisplay: b.phoneDisplay,
    phoneHref: b.phoneHref,
    shortName: b.shortName,
    slug: b.slug,
    staticDemoMode: true,
    tagline: b.inventoryNotice
  };
  for (const [key, value] of Object.entries(values)) text = replaceLeadScalar(text, key, value);
  text = text.replace(/^\s*district:\s*\{[^\n]+\},/m,
    `  district: { bg: ${q(b.region || b.city)}, en: ${q(b.region || b.city)} },`);
  text = text.replace(/\s*socialLinks:\s*\{[\s\S]*?\n\s*\},\n\s*staticDemoMode:/m,
    `\n  socialLinks: ${JSON.stringify(Object.fromEntries(Object.entries(b.socialLinks || {}).filter(([, value]) => value)))},\n  staticDemoMode:`);
  write(file, text);
  write(path.join(candidate, 'packages/marketplace-domain/testing/dealer-profile.json'),
    `${JSON.stringify(profile, null, 2)}\n`);
  const dealerTextFiles = patchModernDealerText(candidate, profile)
    .map((file) => path.relative(candidate, file).replaceAll('\\', '/'));
  return [
    'packages/marketplace-domain/testing/mock-data.ts',
    'packages/marketplace/lead-site.ts',
    'packages/marketplace-domain/testing/dealer-profile.json',
    ...dealerTextFiles
  ];
}

function carwowInventory(profile) {
  const b = profile.business;
  const items = profile.listings.map((item) => ({
    id: item.sourceId || item.id,
    title: item.title,
    sourceUrl: item.sourceUrl || b.inventoryUrl,
    priceEur: new Intl.NumberFormat(b.locale || 'en-US', {
      style: 'currency', currency: item.currency || b.currency, maximumFractionDigits: 0
    }).format(Number(item.priceAmount || 0)).replace(/\s+/g, ' '),
    priceBgn: '',
    status: item.availability,
    date: String(item.year),
    mileage: item.mileageUnit === 'mi'
      ? `${new Intl.NumberFormat(b.locale || 'en-US').format(item.mileageValue).replace(/\s+/g, ' ')} mi`
      : `${new Intl.NumberFormat(b.locale || 'en-US').format(item.mileageValue).replace(/\s+/g, ' ')} km`,
    color: item.color,
    fuel: item.fuel,
    power: item.powerHp ? `${item.powerHp} hp` : '',
    transmission: item.transmission,
    body: item.body,
    features: item.features,
    image: item.image
  }));
  return `// Dealer listing snapshot normalized from the canonical Cars source pack.
export type CurrentDayNightListing = {
  id: string;
  title: string;
  sourceUrl: string;
  priceEur: string;
  priceBgn: string;
  status: string;
  date: string;
  mileage: string;
  color: string;
  fuel: string;
  power: string;
  transmission: string;
  body: string;
  features: string[];
  image: string;
};

export const currentDayNightListings = ${JSON.stringify(items, null, 2)} satisfies CurrentDayNightListing[];
`;
}

function patchCarwowSite(candidate, oldVariant, profile) {
  const b = profile.business;
  const file = path.join(candidate, 'src/lib/data/daynight-site.ts');
  let text = read(file);
  const oldSite = path.join(oldVariant, 'src/lib/data/daynight-site.ts');
  const old = exists(oldSite) ? read(oldSite) : '';
  const logoLight = requireRasterLogo(pickLogo(oldVariant, 'carwow', b, false), 'carwow', 'light surfaces');
  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'carwow', b, true) || logoLight, 'carwow', 'dark surfaces');
  const constants = {
    phoneE164: b.phoneE164,
    city: b.city,
    shortName: b.shortName || b.name,
    district: b.region || b.city,
    street: b.addressLine || b.address
  };
  for (const [name, value] of Object.entries(constants)) {
    text = text.replace(new RegExp(`const ${name} = '[^']*';`), `const ${name} = ${q(value)};`);
  }
  text = text.replace(/const location = `[^`]*`;/,
    `const location = ${q(b.address || b.addressLine || b.city)};`);
  const scalar = {
    name: b.name,
    countryCode: b.countryCode,
    locale: b.locale,
    currency: b.currency,
    phone: b.phoneE164.replace(/\D/g, ''),
    phoneLabel: b.phoneDisplay,
    email: b.email,
    hoursLabel: b.hours,
    sourceInventory: b.inventoryUrl,
    logoLight,
    logoDark,
    heroTitle: b.name,
    heroSubtitle: `${b.city} · ${b.inventoryNotice}`
  };
  for (const [key, value] of Object.entries(scalar)) {
    text = text.replace(new RegExp(`(^\\s*${key}:\\s*)'[^']*'`, 'm'), `$1${q(value)}`);
  }
  text = text
    .replace(/^\s*locationShort:\s*`[^`]*`,/m, `\tlocationShort: ${q(b.addressLine || b.city)},`)
    .replace(/^\s*locationLandmark:\s*`[^`]*`,/m, `\tlocationLandmark: ${q(b.address || b.addressLine || b.city)},`);
  const socialLinks = {
    facebook: b.socialLinks?.facebook || '',
    instagram: b.socialLinks?.instagram || '',
    youtube: b.socialLinks?.youtube || '',
    tiktok: b.socialLinks?.tiktok || ''
  };
  if (!text.includes('\tsocialLinks:')) {
    text = text.replace('\n\tprimaryCta:', `\n\tsocialLinks: ${JSON.stringify(socialLinks)},\n\tprimaryCta:`);
  }
  text = text.replace(/\n\s*\{ label: 'Профил на автокъщата', href: '\/about\/daynight-auto-plovdiv' \},/, '');
  text = text.replace("{ label: 'За Day Night Auto', href: '/about' }",
    `{ label: ${q(textFor(profile, `За ${b.shortName || b.name}`, `About ${b.shortName || b.name}`))}, href: '/about' }`);
  write(file, text);
  return { logoLight, logoDark };
}

function replaceRange(text, startMarker, endMarker, replacement, label) {
  const start = text.indexOf(startMarker);
  const end = text.indexOf(endMarker, start);
  if (start < 0 || end < 0) throw new Error(`Cannot locate ${label}`);
  return text.slice(0, start) + replacement + text.slice(end);
}

function wrapSvelteBlock(text, needle, condition, label) {
  const at = text.indexOf(needle);
  if (at < 0) throw new Error(`Cannot locate ${label}`);
  const start = text.lastIndexOf('\n\t\t\t\t\t<a', at);
  const close = text.indexOf('</a', at);
  const end = text.indexOf('>', close) + 1;
  if (start < 0 || close < 0 || end <= 0) throw new Error(`Cannot bound ${label}`);
  const block = text.slice(start + 1, end).replace(needle, condition.href);
  return text.slice(0, start + 1) + `{#if ${condition.when}}\n${block}\n\t\t\t\t\t{/if}` + text.slice(end);
}

function patchCarwowDealerSurfaces(candidate, profile) {
  const b = profile.business;
  const changed = [];
  const social = b.socialLinks || {};

  const topbarFile = path.join(candidate, 'src/lib/components/layout/SiteChromeTopBar.svelte');
  if (exists(topbarFile)) {
    let value = read(topbarFile).replace(
      'const locationShort = `Студентски град, ${daynightSite.city}`;',
      'const locationShort = daynightSite.locationShort;'
    );
    const start = '\t\t\t<ul class="m-0 flex list-none items-center gap-1.5 p-0" aria-label="Социални канали">';
    const end = '\n\t\t\t<div class="relative border-l border-sa-surface/25 pl-3" id="language-select">';
    const socialMarkup = `\t\t\t{#if daynightSite.socialLinks.facebook || daynightSite.socialLinks.instagram}
\t\t\t\t<ul class="m-0 flex list-none items-center gap-1.5 p-0" aria-label="Социални канали">
\t\t\t\t\t{#if daynightSite.socialLinks.facebook}
\t\t\t\t\t\t<li><a href={daynightSite.socialLinks.facebook} aria-label="Facebook" target="_blank" rel="noopener" class={socialLinkBase + ' site-chrome-topbar__social-link--facebook'}><SiteChromeIcon name="facebook" /></a></li>
\t\t\t\t\t{/if}
\t\t\t\t\t{#if daynightSite.socialLinks.instagram}
\t\t\t\t\t\t<li><a href={daynightSite.socialLinks.instagram} aria-label="Instagram" target="_blank" rel="noopener" class={socialLinkBase + ' site-chrome-topbar__social-link--instagram'}><SiteChromeIcon name="instagram" /></a></li>
\t\t\t\t\t{/if}
\t\t\t\t</ul>
\t\t\t{/if}`;
    value = replaceRange(value, start, end, socialMarkup, 'Carwow topbar social block');
    write(topbarFile, value);
    changed.push('src/lib/components/layout/SiteChromeTopBar.svelte');
  }

  const mobileDataFile = path.join(candidate, 'src/lib/components/home/mobile/mobile-home-data.ts');
  if (exists(mobileDataFile)) {
    let value = read(mobileDataFile);
    const entries = [];
    if (social.facebook) entries.push({ label: 'Facebook', href: social.facebook, title: 'Facebook', icon: 'facebook', external: true });
    if (social.instagram) entries.push({ label: 'Instagram', href: social.instagram, title: 'Instagram', icon: 'instagram', external: true });
    entries.push({ label: 'Mobile.bg', href: '__SOURCE_INVENTORY__', title: textFor(profile, 'Виж наличните автомобили в mobile.bg', 'View dealer inventory'), icon: 'mobilebg', external: true });
    const rendered = entries.map((entry) => entry.href === '__SOURCE_INVENTORY__'
      ? `\t{ label: ${q(entry.label)}, href: daynightSite.sourceInventory, title: ${q(entry.title)}, icon: ${q(entry.icon)}, external: true }`
      : `\t${JSON.stringify(entry)}`).join(',\n');
    value = value.replace(/export const footerSocialLinks: FooterSocialLink\[\] = \[[\s\S]*?\n\];/,
      `export const footerSocialLinks: FooterSocialLink[] = [\n${rendered}\n];`);
    write(mobileDataFile, value);
    changed.push('src/lib/components/home/mobile/mobile-home-data.ts');
  }

  const videoFile = path.join(candidate, 'src/lib/data/daynight-videos.ts');
  write(videoFile, `export type DayNightVideo = {\n\tid: string;\n\ttitle: string;\n\tduration: string;\n\tthumbnail: string;\n\turl: string;\n};\n\nexport const youtubeChannelUrl = ${q(social.youtube || '')};\nexport const homeVideos: DayNightVideo[] = [];\n`);
  changed.push('src/lib/data/daynight-videos.ts');

  const dealerFooterFile = path.join(candidate, 'src/lib/components/layout/DesktopDealerFooter.svelte');
  if (exists(dealerFooterFile)) {
    let value = read(dealerFooterFile);
    value = wrapSvelteBlock(value, 'href="https://www.facebook.com/61566304063141/"',
      { when: 'daynightSite.socialLinks.facebook', href: 'href={daynightSite.socialLinks.facebook}' }, 'desktop footer Facebook');
    value = wrapSvelteBlock(value, 'href="https://www.instagram.com/daynight.auto.plovdiv/"',
      { when: 'daynightSite.socialLinks.instagram', href: 'href={daynightSite.socialLinks.instagram}' }, 'desktop footer Instagram');
    const youtubeAt = value.indexOf('<a {...youtubeLink}');
    if (youtubeAt >= 0) {
      const close = value.indexOf('</a', youtubeAt);
      const end = value.indexOf('>', close) + 1;
      const start = value.lastIndexOf('\n\t\t\t\t\t<a', youtubeAt);
      const block = value.slice(start + 1, end);
      value = value.slice(0, start + 1) + `{#if youtubeChannelUrl}\n${block}\n\t\t\t\t\t{/if}` + value.slice(end);
    }
    write(dealerFooterFile, value);
    changed.push('src/lib/components/layout/DesktopDealerFooter.svelte');
  }

  const legacyFooterFile = path.join(candidate, 'src/lib/components/layout/DayNightFooter.svelte');
  if (exists(legacyFooterFile)) {
    const value = read(legacyFooterFile)
      .replace("href: 'https://www.facebook.com/61566304063141/'", 'href: daynightSite.socialLinks.facebook')
      .replace("href: 'https://www.instagram.com/daynight.auto.plovdiv/'", 'href: daynightSite.socialLinks.instagram');
    write(legacyFooterFile, value);
    changed.push('src/lib/components/layout/DayNightFooter.svelte');
  }

  const aboutFile = path.join(candidate, 'src/lib/components/about/DesktopAboutPage.svelte');
  if (exists(aboutFile)) {
    let value = read(aboutFile)
      .replace('Разгледай автомобилите онлайн или ни посети в Студентски град.', 'Разгледай автомобилите онлайн или ни посети на {daynightSite.locationShort}.')
      .replace('<strong>Студентски град, {daynightSite.city}</strong>', '<strong>{daynightSite.locationShort}</strong>');
    const start = '\t\t\t\t<div class="about-hero-socials">';
    const end = '\n\t\t\t</nav>';
    const replacement = `\t\t\t\t{#if daynightSite.socialLinks.facebook || daynightSite.socialLinks.instagram || youtubeChannelUrl}
\t\t\t\t\t<div class="about-hero-socials">
\t\t\t\t\t\t{#if daynightSite.socialLinks.facebook}<a href={daynightSite.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><SiteChromeIcon name="facebook" /></a>{/if}
\t\t\t\t\t\t{#if daynightSite.socialLinks.instagram}<a href={daynightSite.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><SiteChromeIcon name="instagram" /></a>{/if}
\t\t\t\t\t\t{#if youtubeChannelUrl}<a href={youtubeChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><img src={resolve('/assets/icons/youtube-footer.svg')} alt="" width="22" height="22" /></a>{/if}
\t\t\t\t\t</div>
\t\t\t\t{/if}`;
    value = replaceRange(value, start, end, replacement, 'Carwow about social block');
    write(aboutFile, value);
    changed.push('src/lib/components/about/DesktopAboutPage.svelte');
  }

  return changed;
}

function patchDealerTextFiles(candidate, profile) {
  const b = profile.business;
  const replacements = [
    ['DAY NIGHT AUTO GROUP', b.name.toUpperCase()],
    ['DAY NIGHT AUTO', b.name.toUpperCase()],
    ['Day Night Auto Group', b.name],
    ['Day & Night Auto Group', b.name],
    ['Day Night Auto', b.shortName || b.name],
    ['Day & Night', b.shortName || b.name],
    ['0877733110', b.phoneE164.replace(/\D/g, '')],
    ['0877 733 110', b.phoneDisplay],
    ['София', b.city],
    ['Sofia', b.city]
  ];
  return patchTextTree(path.join(candidate, 'src'), replacements,
    new Set(['node_modules', '.svelte-kit', 'dist', 'build']))
    .map((file) => path.relative(candidate, file).replaceAll('\\', '/'));
}

function patchCarwowManifest(candidate, profile) {
  const file = path.join(candidate, 'static/site.webmanifest');
  if (!exists(file)) return [];
  const manifest = JSON.parse(read(file));
  manifest.name = profile.business.name;
  manifest.short_name = profile.business.shortName || profile.business.name;
  write(file, `${JSON.stringify(manifest, null, 2)}\n`);
  return ['static/site.webmanifest'];
}

function patchCarwow({ oldVariant, candidate, profile }) {
  const inventory = path.join(candidate, 'src/lib/data/daynight-current-inventory.ts');
  write(inventory, carwowInventory(profile));
  const siteAssets = patchCarwowSite(candidate, oldVariant, profile);
  const safeContent = applyCarwowSafeContent({ candidate, profile, logo: siteAssets.logoLight || siteAssets.logoDark });
  const dealerSurfaces = patchCarwowDealerSurfaces(candidate, profile);
  const changed = patchDealerTextFiles(candidate, profile);
  write(path.join(candidate, 'src/lib/data/dealer-profile.json'), `${JSON.stringify(profile, null, 2)}\n`);
  return [
    'src/lib/data/daynight-current-inventory.ts',
    'src/lib/data/daynight-site.ts',
    'src/lib/data/dealer-profile.json',
    ...safeContent,
    ...dealerSurfaces,
    ...changed,
    ...patchCarwowManifest(candidate, profile)
  ];
}


function importListingFeed(profile) {
  const b = profile.business;
  const spacing = (value) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
    .format(Number(value || 0)).replace(/\u202f/g, ' ');
  const listings = profile.listings.map((item) => {
    const raw = item.raw || {};
    const price = item.priceAmount === null
      ? textFor(profile, 'Цена при запитване', 'Price on request')
      : `${spacing(item.priceAmount)} ${item.currency === 'EUR' ? '€' : item.currency}`;
    return {
      badge: item.condition === 'new' ? 'НОВА ОБЯВА' : 'ОБЯВА',
      category: item.body || item.bodyType,
      color: item.color,
      displacement: item.engine,
      euroStandard: raw.euroStandard || '',
      features: item.features,
      fuel: item.fuel,
      gearbox: item.transmission,
      href: item.sourceUrl || b.inventoryUrl,
      id: item.sourceId || item.id,
      image: item.image,
      location: item.location || b.city,
      mileage: item.mileageUnit === 'mi'
        ? `${spacing(item.mileageValue)} mi`
        : `${spacing(item.mileageValue)} км`,
      photoCount: String(item.images.length),
      power: raw.power || (item.powerHp ? `${item.powerHp} к.с.` : ''),
      price,
      priceBgn: raw.priceBgn || '',
      production: raw.production || `${item.year} г.`,
      rawPriceText: raw.rawPriceText || price,
      shortDescription: raw.shortDescription || item.description || b.inventoryNotice,
      title: item.title,
      vat: raw.vat || ''
    };
  });
  return {
    fetchedAt: (b.observedAt || new Date().toISOString()).slice(0, 10),
    sources: {
      dealerInventory: b.inventoryUrl,
      dealerContact: b.contactUrl || b.website
    },
    count: listings.length,
    listings
  };
}

function patchImportDayNight(candidate, oldVariant, profile) {
  const b = profile.business;
  const file = path.join(candidate, 'src/lib/data/daynight.ts');
  let text = read(file);
  const freshText = text;
  const logoDark = requireRasterLogo(pickLogo(oldVariant, 'import', b, true), 'import', 'dark surfaces');
  const logoLight = requireRasterLogo(pickLogo(oldVariant, 'import', b, false) || logoDark, 'import', 'light surfaces');
  const makes = unique(profile.listings.map((item) => item.make));
  text = text.replace(/const makeNames = \[[\s\S]*?\] as const;/,
    `const makeNames = ${JSON.stringify(makes, null, 2)} as const;`);
  const contact = {
    primaryPhoneLabel: b.phoneDisplay,
    primaryPhoneHref: b.phoneHref,
    marketplacePhoneLabel: b.phoneDisplay,
    marketplacePhoneHref: b.phoneHref,
    emailLabel: b.email || textFor(profile, 'Онлайн запитване', 'Online enquiry'),
    emailHref: b.email ? `mailto:${b.email}` : (b.contactUrl || b.inventoryUrl),
    viberHref: '',
    facebookHref: b.socialLinks?.facebook || '',
    instagramHref: b.socialLinks?.instagram || '',
    tiktokHref: b.socialLinks?.tiktok || '',
    reviewsHref: b.socialLinks?.facebook || '',
    youtubeHref: b.socialLinks?.youtube || '',
    addressLabel: b.address,
    appointmentNote: b.hours,
    mapEmbedUrl: b.mapsEmbedUrl
  };
  text = replaceExportConstBlock(text, 'daynightContact',
    `export const daynightContact = ${JSON.stringify(contact, null, 2)} as const;`);
  let hostname = '';
  try { hostname = new URL(b.website || b.inventoryUrl).hostname; } catch {}
  const brand = {
    name: b.name,
    displayName: b.name.toUpperCase(),
    bulgarianName: b.name,
    domain: hostname,
    tagline: b.tagline || `${b.name} · ${b.city}`,
    legalNote: `${b.inventoryNotice} ${b.previewNotice}`.trim()
  };
  text = replaceExportConstBlock(text, 'daynightBrand',
    `export const daynightBrand = ${JSON.stringify(brand, null, 2)} as const;`);
  let assetsStart = text.indexOf('export const daynightAssets =');
  let assetsEnd = text.indexOf(' as const;', assetsStart);
  if (assetsStart < 0 || assetsEnd < 0) throw new Error('Cannot locate Import daynightAssets');
  let assets = text.slice(assetsStart, assetsEnd + ' as const;'.length);
  assets = assets
    .replace(/logoDark:\s*'[^']*'/, `logoDark: ${q(logoDark)}`)
    .replace(/logoLight:\s*'[^']*'/, `logoLight: ${q(logoLight)}`);
  text = text.slice(0, assetsStart) + assets + text.slice(assetsEnd + ' as const;'.length);
  const consultant = [
    {
      slug: `${b.slug}-sales`,
      name: textFor(profile, 'Продажби и огледи', 'Sales and viewings'),
      title: textFor(profile, `Запитвания към ${b.name}`, `Enquiries for ${b.name}`),
      image: '/brand/daynight-team-placeholder.svg'
    },
    {
      slug: `${b.slug}-import`,
      name: textFor(profile, 'Внос и подбор', 'Import and sourcing'),
      title: textFor(profile, 'Запитвания за внос и наличности', 'Import and stock enquiries'),
      image: '/brand/daynight-team-placeholder.svg'
    },
    {
      slug: `${b.slug}-documents`,
      name: textFor(profile, 'Документи и предаване', 'Documents and handover'),
      title: textFor(profile, 'Следващи стъпки по сделката', 'Next transaction steps'),
      image: '/brand/daynight-team-placeholder.svg'
    }
  ];
  text = replaceExportConstBlock(text, 'daynightConsultants',
    `export const daynightConsultants = ${JSON.stringify(consultant, null, 2)} as const;`);
  write(file, text);
  return { logoDark, logoLight };
}

function patchImportVehicles(candidate, profile) {
  const b = profile.business;
  const file = path.join(candidate, 'src/lib/data/vehicles.ts');
  let text = read(file);
  text = text.replace(/const detailGalleryFallback = \[[\s\S]*?\];/,
    'const detailGalleryFallback: string[] = [];');
  text = text.replace(/const knownBrokenImageFallbacks: Record<string, string> = \{[\s\S]*?\n\};/,
    'const knownBrokenImageFallbacks: Record<string, string> = {};');
  text = text
    .replace("dealerSlug: 'daynight-plovdiv'", `dealerSlug: ${q(b.slug)}`)
    .replace(/agentSlug:[\s\S]*?rating:\s*4\.9,/,
      `agentSlug: ${q(`${b.slug}-sales`)},\n\trating: 0,`)
    .replace('gallery: [imageForVehicle(vehicle), ...detailGalleryFallback],',
      'gallery: [imageForVehicle(vehicle), ...detailGalleryFallback],');
  write(file, text);
}

function patchImportDealers(candidate, profile) {
  const b = profile.business;
  const specialties = (b.services || []).map((service) =>
    service.title || service.name || '').filter(Boolean);
  const file = path.join(candidate, 'src/lib/data/dealers.ts');
  write(file, `import { daynightAssets, daynightBrand, daynightContact } from './daynight';
import { vehicles } from './vehicles';

export interface Dealer {
\tslug: string;
\tname: string;
\tlocation: string;
\taddress: string;
\tphone: string;
\tlogo: string;
\tcover: string;
\tinventory: number;
\trating: number;
\tspecialties: string[];
}

export const dealers: Dealer[] = [
\t{
\t\tslug: ${q(b.slug)},
\t\tname: daynightBrand.name,
\t\tlocation: daynightContact.addressLabel,
\t\taddress: daynightContact.addressLabel + '. ' + daynightContact.appointmentNote + '.',
\t\tphone: daynightContact.primaryPhoneLabel,
\t\tlogo: daynightAssets.logoDark,
\t\tcover: daynightAssets.hero,
\t\tinventory: vehicles.length,
\t\trating: 0,
\t\tspecialties: ${JSON.stringify(specialties)}
\t}
];

export function getDealerBySlug(slug: string) {
\treturn dealers.find((dealer) => dealer.slug === slug);
}
`);
}

function patchImportAgents(candidate) {
  const file = path.join(candidate, 'src/lib/data/agents.ts');
  write(file, `import { daynightBrand, daynightConsultants, daynightContact } from './daynight';
import type { Agent } from '$lib/types/agent';

export type { Agent } from '$lib/types/agent';

export const agents: Agent[] = daynightConsultants.map((consultant) => ({
\tslug: consultant.slug,
\tname: consultant.name,
\ttitle: consultant.title,
\tphone: daynightContact.primaryPhoneLabel,
\temail: daynightContact.emailLabel,
\timage: consultant.image,
\trating: 0,
\tsales: 0,
\tbio: daynightBrand.legalNote
}));

export function getAgentBySlug(slug: string) {
\treturn agents.find((agent) => agent.slug === slug);
}
`);
}

function patchImportHeroBindings(candidate) {
  const file = path.join(candidate, 'src/lib/components/home/HomeFiveHero.svelte');
  if (!exists(file)) return null;
  let text = read(file);
  if (!text.includes("import { daynightContact } from '$lib/data/daynight';")) {
    text = text.replace(
      "import { resolve } from '$app/paths';",
      "import { resolve } from '$app/paths';\n\timport { daynightContact } from '$lib/data/daynight';"
    );
  }
  text = text.replace(
    /const mobileShowroomMapHref =\n\s*'[^']*';/,
    "const mobileShowroomMapHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(daynightContact.addressLabel)}`;"
  );
  text = text.replace(
    /const mobileShowroomPhoneHref = '[^']*';/,
    'const mobileShowroomPhoneHref = daynightContact.primaryPhoneHref;'
  );
  text = text.replace(/\{isEnglish \? 'Plovdiv, South Industrial Zone' : 'Пловдив, Индустриална зона - Юг'\}/g, '{daynightContact.addressLabel}');
  text = text.replace(/\{isEnglish\s*\? 'Plovdiv, South Industrial Zone'\s*: 'Пловдив, Южна Индустриална зона'\}/g, '{daynightContact.addressLabel}');
  write(file, text);
  return 'src/lib/components/home/HomeFiveHero.svelte (dealer contact binding)';
}

function patchImportText(candidate, profile) {
  const b = profile.business;
  const replacements = [
    ['DAY NIGHT AUTO GROUP', b.name.toUpperCase()],
    ['DAY NIGHT AUTO', b.name.toUpperCase()],
    ['Day Night Auto Group', b.name],
    ['Day & Night Auto Group', b.name],
    ['Day Night Auto', b.shortName || b.name],
    ['Day & Night', b.shortName || b.name],
    ['0877733110', b.phoneE164.replace(/\D/g, '')],
    ['0877 733 110', b.phoneDisplay],
    ['гр. София, Студентски град, ул. Атанас Манчев 18', b.address]
  ];
  return patchTextTree(path.join(candidate, 'src'), replacements,
    new Set(['node_modules', '.svelte-kit', 'dist', 'build']))
    .map((file) => path.relative(candidate, file).replaceAll('\\', '/'));
}

function patchImport({ oldVariant, candidate, profile }) {
  const feedFile = path.join(candidate, 'src/lib/data/daynight-listings.json');
  write(feedFile, `${JSON.stringify(importListingFeed(profile), null, 2)}\n`);
  patchImportDayNight(candidate, oldVariant, profile);
  patchImportVehicles(candidate, profile);
  patchImportDealers(candidate, profile);
  patchImportAgents(candidate);
  const safeContent = applyImportSafeContent({ candidate, profile });
  const changed = patchImportText(candidate, profile);
  const heroBinding = patchImportHeroBindings(candidate);
  const menuHeader = path.join(candidate, 'src/lib/components/home/HomeFiveHeader.svelte');
  write(menuHeader, ensureImportMenuKeys(read(menuHeader)));
  changed.push('src/lib/components/home/HomeFiveHeader.svelte');
  write(path.join(candidate, 'src/lib/data/dealer-profile.json'),
    `${JSON.stringify(profile, null, 2)}\n`);
  return [
    'src/lib/data/daynight-listings.json',
    'src/lib/data/daynight.ts',
    'src/lib/data/vehicles.ts',
    'src/lib/data/dealers.ts',
    'src/lib/data/agents.ts',
    'src/lib/data/dealer-profile.json',
    ...safeContent,
    ...changed,
    ...(heroBinding ? [heroBinding] : [])
  ];
}

export function applyRefreshAdapter(options) {
  const adapter = { 'auto-best': patchAutoBest, modern: patchModern, carwow: patchCarwow, import: patchImport }[options.key];
  if (!adapter) throw new Error('No current refresh adapter for '+options.key);
  return [...adapter(options), ...applyDealerLogoContract(options)];
}

export const refreshAdapterInternals = {
  autoBestBody,
  autoBestEquipment,
  autoBestInventory,
  modernListing,
  carwowInventory,
  importListingFeed,
  pickLogo,
  isRasterLogo,
  rasterLogoCandidates,
  requireRasterLogo,
  replaceModernListings
};
