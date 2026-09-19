import fs from 'node:fs';
import path from 'node:path';
import { loadLogoContract } from './client-logo-contract.mjs';

const exists = (file) => fs.existsSync(file);
const readText = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const readJson = (file) => JSON.parse(readText(file));
const asString = (value, fallback = '') => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  return fallback;
};
const firstString = (...values) => values.map((value) => asString(value)).find(Boolean) || '';
const asArray = (value) => Array.isArray(value) ? value : [];
const numberFrom = (...values) => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') continue;
    const normalized = value.replace(/[^0-9.,-]/g, '').replace(/,(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};
const normalizePhoneHref = (value) => {
  const source = asString(value);
  if (!source) return '';
  if (source.startsWith('tel:')) return source;
  const digits = source.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : '';
};
const valueText = (value) => {
  if (Array.isArray(value)) return value.map(valueText).filter(Boolean).join('; ');
  if (value && typeof value === 'object') return Object.values(value).map(valueText).filter(Boolean).join('; ');
  return asString(value);
};
const unique = (values) => [...new Set(values.filter(Boolean))];
const slugify = (value) => asString(value).toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parseTsString(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.match(new RegExp(`${escaped}\\s*:\\s*['\"]([^'\"]*)['\"]`))?.[1] || '';
}

function legacyEliqBusiness(client) {
  const brandFile = path.join(client, 'auto-best/src/lib/config/brand.ts');
  const text = exists(brandFile) ? readText(brandFile) : '';
  return {
    name: parseTsString(text, 'name') || 'ELIQ AUTO',
    shortName: parseTsString(text, 'shortName') || 'ELIQ AUTO',
    city: parseTsString(text, 'city'),
    addressLine: parseTsString(text, 'addressLine'),
    address: parseTsString(text, 'address'),
    phoneDisplay: parseTsString(text, 'phone'),
    phoneHref: parseTsString(text, 'phoneHref'),
    hours: parseTsString(text, 'appointment'),
    logo: parseTsString(text, 'logo'),
    youtube: parseTsString(text, 'youtubeUrl'),
    sourceUrl: 'https://eliqauto.mobile.bg/',
    country: 'Bulgaria', countryCode: 'BG', locale: 'bg-BG', currency: 'EUR', distanceUnit: 'km'
  };
}
function normalizeCountryCode(value, locale) {
  const direct = asString(value).toUpperCase();
  if (/^[A-Z]{2}$/.test(direct)) return direct;
  const text = `${direct} ${asString(locale)}`.toUpperCase();
  if (/BULGARIA|БЪЛГАР|BG-?BG/.test(text)) return 'BG';
  if (/UNITED ARAB EMIRATES|UAE|EN-?AE/.test(text)) return 'AE';
  if (/UNITED STATES|USA|EN-?US/.test(text)) return 'US';
  return '';
}

function normalizeBusiness(client, slug, rawFacts) {
  const hasRawFacts = rawFacts && typeof rawFacts === 'object' && Object.keys(rawFacts).length > 0;
  const source = hasRawFacts
    ? (rawFacts.business || rawFacts)
    : (slug === 'eliqauto' ? legacyEliqBusiness(client) : {});
  const countryCode = normalizeCountryCode(source.countryCode || source.country, source.locale);
  const locale = firstString(source.locale, countryCode === 'BG' ? 'bg-BG' : countryCode === 'AE' ? 'en-AE' : countryCode === 'US' ? 'en-US' : 'en-US');
  const currency = firstString(source.currency, countryCode === 'BG' ? 'EUR' : countryCode === 'AE' ? 'AED' : countryCode === 'US' ? 'USD' : 'EUR').toUpperCase();
  const distanceUnit = firstString(source.distanceUnit, source.mileageUnit, countryCode === 'US' ? 'mi' : 'km').toLowerCase();
  const publishedPhones = [
    ...asArray(source.phones),
    ...asArray(source.phoneNumbers)
  ];
  const phoneHref = normalizePhoneHref(firstString(
    source.phoneHref,
    source.phoneE164,
    source.phone,
    publishedPhones[0]
  ));
  const phoneDisplay = firstString(
    source.phoneDisplay,
    source.phone,
    source.primaryPhone,
    publishedPhones[0],
    phoneHref.replace(/^tel:/, '')
  );
  const address = firstString(source.address, source.addressLine, source.location);
  const name = firstString(source.name, source.displayName, source.latinName, slug);
  const social = source.socialLinks && typeof source.socialLinks === 'object' ? source.socialLinks : {};
  const notices = unique([
    source.inventoryNotice, source.stockNote, source.stockDisclosure, source.disclosure,
    rawFacts?.inventoryNotice, rawFacts?.stockNote, rawFacts?.disclosure
  ].map(valueText));
  const previewNotices = unique([
    source.previewNotice, source.status, source.rightsNote, source.assetStatus,
    rawFacts?.previewNotice, rawFacts?.status
  ].map(valueText));
  const mapsQuery = encodeURIComponent(`${name}, ${address || source.city || ''}`);
  const isBulgarian = countryCode === 'BG';
  const defaultHours = isBulgarian
    ? 'Посещения с предварителна уговорка.'
    : 'Contact the dealership before visiting.';
  const defaultInventoryNotice = isBulgarian
    ? 'Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.'
    : 'Dated listing samples; confirm price and availability directly with the dealership.';
  const defaultPreviewNotice = isBulgarian
    ? 'Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация.'
    : 'Independent preview. Forms do not send messages and no reservation is created.';
  return {
    slug,
    name,
    shortName: firstString(source.shortName, source.latinName, name),
    latinName: firstString(source.latinName, source.shortName, name),
    tagline: firstString(source.tagline, `${name} · ${source.city || ''}`),
    city: firstString(source.city, source.location?.city),
    region: firstString(source.region, source.district),
    country: firstString(source.country, countryCode === 'BG' ? 'Bulgaria' : countryCode === 'AE' ? 'United Arab Emirates' : countryCode === 'US' ? 'United States' : ''),
    countryCode,
    locale,
    currency,
    distanceUnit,
    address,
    addressLine: firstString(source.addressLine, address),
    phoneDisplay,
    phoneHref,
    phoneE164: phoneHref.replace(/^tel:/, ''),
    email: firstString(source.email),
    hours: firstString(valueText(source.hours), source.hoursDisplay, source.hoursNote, source.appointment, source.appointmentNote, defaultHours),
    website: firstString(source.website, source.sourceUrl, source.stockUrl, source.marketplaceUrl),
    inventoryUrl: firstString(source.stockUrl, source.marketplaceUrl, source.sourceProfile, source.sourceUrl, source.website),
    contactUrl: firstString(source.contactUrl, source.contactsUrl, source.contactSourceUrl, source.website),
    mapsUrl: firstString(source.mapsUrl, `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`),
    mapsEmbedUrl: firstString(source.mapsEmbedUrl, `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`),
    accent: firstString(source.accent, '#c40101'),
    logo: firstString(source.logo, source.workingLogoPath && `/${source.workingLogoPath.replace(/^\/+/, '')}`, source.branding?.logoOnLight),
    logoLight: firstString(source.logoLight, source.logo, source.branding?.logoOnDark, source.branding?.logoOnLight),
    logoDark: firstString(source.logoDark, source.logoLight, source.logo, source.branding?.logoOnDark),
    socialLinks: {
      facebook: firstString(social.facebook, source.facebook),
      instagram: firstString(social.instagram, source.instagram),
      youtube: firstString(social.youtube, source.youtube),
      tiktok: firstString(social.tiktok, source.tiktok)
    },
    services: asArray(source.services),
    inventoryNotice: notices.join(' ') || defaultInventoryNotice,
    previewNotice: previewNotices.join(' ') || defaultPreviewNotice,
    observedAt: firstString(source.observedAt, source.stockSnapshotDate, source.capturedAt, rawFacts?.observedAt),
    coordinates: source.coordinates && typeof source.coordinates === 'object' ? source.coordinates : null,
    raw: source
  };
}
function loadInventory(client, rawFacts, slug) {
  if (Array.isArray(rawFacts?.vehicles)) return rawFacts.vehicles;
  for (const name of ['stock.json', 'normalized-inventory.json', 'FACTS-AND-INVENTORY.json']) {
    const file = path.join(client, name);
    if (!exists(file)) continue;
    const value = readJson(file);
    if (Array.isArray(value)) return value;
    for (const key of ['records', 'vehicles', 'listings', 'inventory', 'stock']) {
      if (Array.isArray(value?.[key])) return value[key];
    }
  }
  if (slug === 'eliqauto') {
    const value = readJson(path.join(client, 'auto-best/src/lib/data/eliq-source.json'));
    return asArray(value.listings);
  }
  return [];
}

function normalizedImages(item) {
  const values = [
    ...asArray(item.images), ...asArray(item.gallery), ...asArray(item.photos),
    item.image, item.thumbnail, item.photo
  ];
  return unique(values.map((value) => typeof value === 'string' ? value : value?.url).map((value) => asString(value)));
}
function normalizedFeatures(item) {
  return unique([...asArray(item.features), ...asArray(item.equipment)].map((value) => {
    if (typeof value === 'string') return value;
    return firstString(value?.label, value?.name, value?.bg, value?.en);
  }));
}
function inferCurrency(item, business) {
  if (numberFrom(item.priceEur) !== null) return 'EUR';
  if (numberFrom(item.priceUsd) !== null) return 'USD';
  return firstString(item.currency, item.priceCurrency, business.currency, 'EUR').toUpperCase();
}
function inferPrice(item) {
  return numberFrom(item.priceEur, item.priceUsd, item.priceAmount, item.price, item.amount, item.rawPriceText, item.sourcePrice);
}
function inferMileage(item) {
  return numberFrom(item.mileageKm, item.mileageMiles, item.mileageValue, item.km, item.mileage);
}
function inferMileageUnit(item, business) {
  if (numberFrom(item.mileageMiles) !== null) return 'mi';
  if (numberFrom(item.mileageKm, item.km) !== null) return 'km';
  const direct = firstString(item.mileageUnit, item.distanceUnit, business.distanceUnit, 'km').toLowerCase();
  return direct.startsWith('mi') ? 'mi' : 'km';
}
function inferYear(item) {
  const year = numberFrom(item.year, item.production, item.date);
  return year && year >= 1900 && year <= 2100 ? Math.trunc(year) : new Date().getUTCFullYear();
}
function normalizeTransmission(value) {
  const text = asString(value);
  const lower = text.toLowerCase();
  if (/auto|автомат/.test(lower)) return 'automatic';
  if (/manual|ръч/.test(lower)) return 'manual';
  return 'other';
}
function normalizeFuel(value) {
  const text = asString(value);
  const lower = text.toLowerCase();
  if (/electric|електр/.test(lower)) return 'electric';
  if (/hybrid|хибрид/.test(lower)) return 'hybrid';
  if (/diesel|дизел/.test(lower)) return 'diesel';
  if (/lpg|газ/.test(lower)) return 'lpg';
  if (/petrol|gasoline|бензин/.test(lower)) return 'gasoline';
  return 'other';
}
function normalizeBody(value) {
  const text = asString(value);
  const lower = text.toLowerCase();
  if (/suv|джип|крос/.test(lower)) return 'suv';
  if (/sedan|седан/.test(lower)) return 'sedan';
  if (/wagon|комби|estate/.test(lower)) return 'wagon';
  if (/hatch|хеч/.test(lower)) return 'hatchback';
  if (/coupe|купе/.test(lower)) return 'coupe';
  if (/convert|кабри/.test(lower)) return 'convertible';
  if (/pickup|пикап/.test(lower)) return 'pickup';
  if (/van|миниван/.test(lower)) return 'van';
  return 'other';
}
function normalizeListing(item, index, business) {
  const make = firstString(item.make, item.brand);
  const model = firstString(item.model, item.derivative);
  const trim = firstString(item.trim);
  const year = inferYear(item);
  const title = firstString(item.title, item.fullTitle, `${year} ${make} ${model} ${trim}`.replace(/\s+/g, ' ').trim());
  const currency = inferCurrency(item, business);
  const priceAmount = inferPrice(item);
  const mileageValue = inferMileage(item) ?? 0;
  const mileageUnit = inferMileageUnit(item, business);
  const images = normalizedImages(item);
  const id = firstString(item.id, item.sourceId, item.index, String(index + 1));
  const body = firstString(item.body, item.category, item.bodyType, 'Other');
  const fuel = firstString(item.fuel, item.fuelType, 'Not published');
  const transmission = firstString(item.transmission, item.gearbox, item.transmissionType, 'Not published');
  const observedAt = firstString(item.observedAt, item.capturedAt, business.observedAt);
  const sourceUrl = firstString(item.sourceUrl, item.href, item.source, business.inventoryUrl);
  const status = firstString(item.availability, item.status, 'Dated listing sample — confirm availability');
  return {
    id,
    sourceId: firstString(item.sourceId, id),
    slug: firstString(item.slug, slugify(`${make}-${model}-${year}-${id}`)),
    title,
    make: make || title.split(/\s+/)[0] || 'Vehicle',
    model: model || title,
    trim,
    year,
    priceAmount,
    currency,
    mileageValue,
    mileageUnit,
    body,
    bodyType: normalizeBody(body),
    fuel,
    fuelType: normalizeFuel(fuel),
    transmission,
    transmissionType: normalizeTransmission(transmission),
    color: firstString(item.color, item.exteriorColor, item.colorExterior),
    powerHp: numberFrom(item.powerHp, item.power),
    engine: firstString(item.engine, item.displacement, item.engineCc),
    drivetrain: firstString(item.drivetrain, item.drive),
    features: normalizedFeatures(item),
    images,
    image: images[0] || '',
    sourceUrl,
    observedAt,
    availability: status,
    description: firstString(item.description, item.shortDescription, business.inventoryNotice),
    condition: firstString(item.condition, 'used').toLowerCase() === 'new' ? 'new' : 'used',
    location: firstString(item.viewingLocation, item.sourceLocation, item.location, business.city),
    raw: item
  };
}

export function loadDealerProfile(client, slug) {
  const factsFile = path.join(client, 'business-facts.json');
  const rawFacts = exists(factsFile) ? readJson(factsFile) : {};
  const business = normalizeBusiness(client, slug, rawFacts);
  const logoContract = loadLogoContract(client);
  if (logoContract) { business.logo = logoContract.assets.onLight.publicPath; business.logoLight = logoContract.assets.onLight.publicPath; business.logoDark = logoContract.assets.onDark.publicPath; }
  const rawListings = loadInventory(client, rawFacts, slug);
  const listings = rawListings.map((item, index) => normalizeListing(item, index, business))
    .filter((item) => item.title && item.image);
  if (!business.name) throw new Error(`Dealer ${slug} has no reusable business name.`);
  if (!listings.length) throw new Error(`Dealer ${slug} has no reusable inventory with imagery.`);
  return { schemaVersion: 1, slug, business, listings, rawFacts, sourceCount: rawListings.length, logoContract };
}

export const refreshNormalizeInternals = {
  asString, firstString, normalizeBody, normalizeFuel, normalizeTransmission,
  numberFrom, normalizedImages, normalizeBusiness, normalizeListing
};
