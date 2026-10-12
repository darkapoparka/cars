import fs from 'node:fs';
import path from 'node:path';
import { loadLogoContract } from './client-logo-contract.mjs';
import {inside,sha256} from './workflow.mjs';
import {normalizeDealerLocale} from './dealer-locale.mjs';
import {parseCatalogJson} from './native-localization.mjs';
import {stockPriceFrom} from './stock-price.mjs';
import {originalListingSourceRecorded} from './registered-listing-proof.mjs';
export {originalListingIdRecorded,originalListingSourceRecorded} from './registered-listing-proof.mjs';
import {validateRegisteredPublishedInputs,REGISTERED_PUBLIC_ROOT} from './registered-reviewed-public-inputs.mjs';

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
    if (/\b(?:p\.?\s*o\.?\s*a\.?|on\s+request|price\s+on\s+application|not\s+(?:published|provided|available|disclosed)|unpublished|unknown|tbc|tba)\b|^\s*n\/a(?:\b|\s*\()/i.test(value)) continue;
    const normalized = value.replace(/[^0-9.,-]/g, '').replace(/,(?=\d{3}(?:\D|$))/g, '').replace(',', '.');
    if (!/\d/.test(normalized)) continue;
    const parsed = Number(normalized);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
};
const normalizePhoneHref = (value, countryCode) => {
  const source = asString(value);
  if (!source) return '';
  const local = source.replace(/^tel:/, '');
  // Only a recorded UK business and a complete domestic number may gain +44.
  // Retain international numbers, short codes and extension-bearing input.
  if (countryCode === 'GB' && /^0[\d\s().-]*$/.test(local)) {
    const localDigits = local.replace(/\D/g, '');
    if (/^0[1-9]\d{9}$/.test(localDigits)) return `tel:+44${localDigits.slice(1)}`;
  }
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
  if (/\bUNITED\s+KINGDOM\b/.test(direct) || /^EN-?GB$/.test(direct)) return 'GB';
  const text = `${direct} ${asString(locale)}`.toUpperCase();
  if (/BULGARIA|БЪЛГАР|BG-?BG/.test(text)) return 'BG';
  if (/UNITED ARAB EMIRATES|UAE|EN-?AE/.test(text)) return 'AE';
  if (/UNITED STATES|USA|EN-?US/.test(text)) return 'US';
  if (!direct && /\bEN-?GB\b/.test(text)) return 'GB';
  return '';
}

function normalizeBusiness(client, slug, rawFacts) {
  const hasRawFacts = rawFacts && typeof rawFacts === 'object' && Object.keys(rawFacts).length > 0;
  const source = hasRawFacts
    ? (rawFacts.business || rawFacts)
    : (slug === 'eliqauto' ? legacyEliqBusiness(client) : {});
  const countryCode = normalizeCountryCode(source.countryCode || source.country, source.locale);
  const locale = firstString(source.locale, countryCode === 'BG' ? 'bg-BG' : countryCode === 'AE' ? 'en-AE' : countryCode === 'GB' ? 'en-GB' : 'en-US');
  const currency = firstString(source.currency, countryCode === 'BG' ? 'EUR' : countryCode === 'AE' ? 'AED' : countryCode === 'US' ? 'USD' : countryCode === 'GB' ? 'GBP' : 'EUR').toUpperCase();
  const distanceUnit = firstString(source.distanceUnit, source.mileageUnit, ['US', 'GB'].includes(countryCode) ? 'mi' : 'km').toLowerCase();
  const publishedPhones = [
    ...asArray(source.phones),
    ...asArray(source.phoneNumbers)
  ];
  const phoneHref = normalizePhoneHref(firstString(
    source.phoneHref,
    source.phoneE164,
    source.phone,
    publishedPhones[0]
  ), countryCode);
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
    country: firstString(source.country, countryCode === 'BG' ? 'Bulgaria' : countryCode === 'AE' ? 'United Arab Emirates' : countryCode === 'US' ? 'United States' : countryCode === 'GB' ? 'United Kingdom' : ''),
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
  if (Array.isArray(rawFacts?.vehicles)) return {listings:rawFacts.vehicles,kind:asString(rawFacts.kind)};
  for (const name of ['stock.json', 'normalized-inventory.json', 'FACTS-AND-INVENTORY.json']) {
    const file = path.join(client, name);
    if (!exists(file)) continue;
    const value = readJson(file);
    if (Array.isArray(value)) return {listings:value,kind:''};
    for (const key of ['records', 'vehicles', 'listings', 'inventory', 'stock']) {
      if (Array.isArray(value?.[key])) return {listings:value[key],kind:asString(value.kind)};
    }
  }
  if (slug === 'eliqauto') {
    const value = readJson(path.join(client, 'auto-best/src/lib/data/eliq-source.json'));
    return {listings:asArray(value.listings),kind:asString(value.kind)};
  }
  return {listings:[],kind:''};
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
  if (stockPriceFrom(item.priceEur) !== null) return 'EUR';
  if (stockPriceFrom(item.priceUsd) !== null) return 'USD';
  return firstString(item.currency, item.priceCurrency, business.currency, 'EUR').toUpperCase();
}
function inferPrice(item) {
  return stockPriceFrom(item.priceEur, item.priceUsd, item.priceAmount, item.price, item.amount, item.rawPriceText, item.sourcePrice);
}
function inferMileage(item, business) {
  const fallbackUnit = firstString(item.mileageUnit, item.distanceUnit, business.distanceUnit, 'km');
  const candidates = [
    [item.mileageKm, 'km'], [item.km, 'km'], [item.mileageMiles, 'mi'],
    [item.mileageValue, fallbackUnit],
    [item.mileage?.value, firstString(item.mileage?.unit, fallbackUnit)],
    [item.mileage, fallbackUnit]
  ];
  for (const [rawValue, rawUnit] of candidates) {
    const value = numberFrom(rawValue);
    if (value === null) continue;
    const unit = String(rawUnit).trim().toLowerCase();
    if (!/^(?:mi|mile|miles|km|kilometres?|kilometers?)$/.test(unit)) throw new Error('Unsupported source mileage unit: ' + rawUnit);
    return { value, unit: unit.startsWith('mi') ? 'mi' : 'km' };
  }
  return { value: null, unit: business.distanceUnit || 'km' };
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
  const mileage = inferMileage(item, business);
  const mileageValue = mileage.value ?? 0;
  const mileageUnit = mileage.unit;
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
    mileageOnRequest: item.mileageOnRequest === true || mileage.value === null,
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

/** Optional sealed derived input for adopted registered source. Ordinary facts
 * remain authoritative and byte-identical; this explicitly reviewed overlay
 * preserves their original source references and unknown values. */

/** The explicit registered fallback never describes template examples as dealer stock. */
export function assertRegisteredDemoDisclosures(input) {
  const s=input.stock,b=input.facts?.business??input.facts,fail=m=>{throw Error('Registered template demo: '+m);};
  if(s?.mode!=='template-demo'||s.kind!=='illustrative-not-dealer-stock'||s.previewOnly!==true||s.actualDealerAvailability!==false||typeof s.disclosure!=='string'||!s.disclosure.trim()||b?.inventoryNotice!==s.disclosure||!b.previewNotice?.trim())fail('explicit preview and stock disclosures required');
  if(!s.templateDemo?.source||!s.templateDemo.catalog||!s.templateDemo.bindings||!Array.isArray(s.listings)||!s.listings.length||s.listings.length>50)fail('bounded immutable catalog proof required');
  const ids=new Set();for(const row of s.listings){const p=row.sourceRecord;if(typeof row.id!=='string'||!/^template-demo-auto-best-[0-9]+$/.test(row.id)||ids.has(row.id)||row.id!=='template-demo-auto-best-'+p?.sourceId||p?.catalogPath!==s.templateDemo.catalog.path||p?.catalogSha256!==s.templateDemo.catalog.sha256||row.sourceUrl!==''||row.verification!=='sample'||row.availability!=='illustrative-not-dealer-stock'||row.evidenceUrl||row.href||row.source||row.observedAt||!Array.isArray(row.images)||!row.images.length)fail('example identity, provenance or availability differs');ids.add(row.id);}
  if(!input.facts?.retainedSourceInventory||input.facts.retainedSourceInventory.renderAsDealerStock!==false||!Array.isArray(input.facts.retainedSourceInventory.records))fail('original factual records must remain separately retained');
}

export function normalizeRegisteredListings(input,business) {
  const demo=input.stock?.mode==='template-demo';if(demo)assertRegisteredDemoDisclosures(input);
  return input.stock.listings.map((row,index)=>{const listing=normalizeListing(row,index,business);return demo?{...listing,sourceUrl:'',sourceId:row.id,observedAt:'',availability:'illustrative-not-dealer-stock',description:business.inventoryNotice}:listing;});
}

export function normalizeRegisteredBusiness(client,slug,input){
  const business=normalizeBusiness(client,slug,input.facts);
  return input.stock?.mode==='template-demo'?{...business,inventoryUrl:'',observedAt:''}:business;
}

export function readRegisteredPersonalization(client, slug) {
  const manifestFile=path.join(client,'dealer.json');
  if (!exists(manifestFile)) return null;
  const manifest=readJson(manifestFile),binding=manifest.registeredSourceAdoption;
  if (!binding) return null;
  const fail=message=>{throw new Error('Registered personalization: '+message);};
  const sameKeys=(v,k)=>v&&JSON.stringify(Object.keys(v).sort())===JSON.stringify([...k].sort());
  if (manifest.slug!==slug||!sameKeys(binding,['receipt','personalization'])) fail('manifest binding differs');
  const pinned=(pin,expected)=>{
    if(!sameKeys(pin,['path','sha256'])||pin.path!==expected||!/^[a-f0-9]{64}$/.test(pin.sha256??''))fail('exact bounded path/hash required');
    const file=inside(client,pin.path,{mustExist:true});if(!fs.lstatSync(file).isFile())fail('regular input file required');
    const bytes=fs.readFileSync(file);if(bytes.length>2*1024**2||sha256(bytes)!==pin.sha256)fail('reviewed input bytes changed');return parseCatalogJson(new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/^\uFEFF/,''));
  };
  const receipt=pinned(binding.receipt,'.client/registered-source-adoption.json'),input=pinned(binding.personalization,'.client/registered-personalization.json');
  if(receipt.schemaVersion!==1||receipt.kind!=='cars-registered-dealer-source-adoption'||receipt.dealer!==slug||receipt.reviewed!==true||!Number.isFinite(Date.parse(receipt.reviewedAt))||receipt.nativeApproval!==false||receipt.hostedApproval!==false||receipt.globalReleaseApproval!==false||receipt.identity?.dealerId!==manifest.dealerId||receipt.identity?.repository!==manifest.repository||receipt.personalization?.sha256!==binding.personalization.sha256)fail('receipt identity or derived-input seal differs');
  if(input.schemaVersion!==1||input.kind!=='cars-registered-dealer-derived-inputs'||input.dealer!==slug||input.reviewed!==true||!Number.isFinite(Date.parse(input.reviewedAt))||input.locale?.dealerId!==manifest.dealerId)fail('reviewed derived inputs required');
  normalizeDealerLocale(input.locale,manifest.dealerId);
  if(!Array.isArray(input.sourceEvidence)||!input.sourceEvidence.length||input.sourceEvidence.length>50)fail('original factual references required');
  for(const p of input.sourceEvidence){if(!sameKeys(p,['path','sha256'])||typeof p.path!=='string'||!/^[a-zA-Z0-9._/-]+$/.test(p.path)||p.path.startsWith('/')||p.path.split('/').some(s=>!s||s==='.'||s==='..')||p.path.startsWith('auto-best/')||p.path.startsWith('modern/')||!/^[a-f0-9]{64}$/.test(p.sha256??''))fail('unsafe or mutable original proof');const file=inside(client,p.path,{mustExist:true});if(!fs.lstatSync(file).isFile()||sha256(fs.readFileSync(file))!==p.sha256)fail('original factual proof bytes changed');}
  const business=input.facts?.business??input.facts;
  if(!business?.name||business.countryCode!==input.locale.dealerCountry||business.currency!==input.locale.inventoryCurrency||!Array.isArray(input.stock?.listings)||!input.stock.listings.length||input.stock.listings.length>400)fail('explicit normalized business and stock required');
  if(input.publishedInputs){
    const originalFacts=parseCatalogJson(fs.readFileSync(inside(client,'business-facts.json',{mustExist:true}),'utf8'));
    const readBytes=(pin,local,max)=>{const file=inside(client,local,{mustExist:true});let current=fs.realpathSync(client);for(const component of local.split('/')){current=path.join(current,component);if(fs.lstatSync(current).isSymbolicLink())fail('materialized proof contains a link');}if(!fs.lstatSync(file).isFile()||fs.statSync(file).size>max)fail('bounded materialized proof required');return fs.readFileSync(file);};
    const proof=validateRegisteredPublishedInputs(input,{dealer:slug,identity:receipt.identity,originalFacts,readBytes});
    const marker=inside(client,REGISTERED_PUBLIC_ROOT+'/input-manifest.json',{mustExist:true});if(!fs.lstatSync(marker).isFile()||!fs.readFileSync(marker).equals(proof.materializedFiles.get(REGISTERED_PUBLIC_ROOT+'/input-manifest.json')))fail('materialized immutable input manifest differs');
    return input;
  }
  if(input.stock.mode==='template-demo')assertRegisteredDemoDisclosures(input);
  else {if(input.stock.mode!==undefined&&input.stock.mode!=='retained-dealer-source')fail('unsupported registered stock mode');const ids=new Set();for(const item of input.stock.listings){const p=item.sourceRecord;if(typeof item.id!=='string'||!item.id||ids.has(item.id)||p?.id!==item.id||!input.sourceEvidence.some(e=>e.path===p.path&&e.sha256===p.sha256))fail('original listing identity/reference differs');ids.add(item.id);const bytes=fs.readFileSync(inside(client,p.path,{mustExist:true}));if(!originalListingSourceRecorded(bytes,item.id,item.sourceUrl))fail('listing ID/source URL absent from original factual proof');}}
  return input;
}

export function loadDealerProfile(client, slug) {
  const derived=readRegisteredPersonalization(client,slug);
  const factsFile = path.join(client, 'business-facts.json');
  const rawFacts = derived?.facts ?? (exists(factsFile) ? readJson(factsFile) : {});
  const business = derived?normalizeRegisteredBusiness(client,slug,derived):normalizeBusiness(client, slug, rawFacts);
  const logoContract = loadLogoContract(client);
  if (logoContract) { business.logo = logoContract.assets.onLight.publicPath; business.logoLight = logoContract.assets.onLight.publicPath; business.logoDark = logoContract.assets.onDark.publicPath; }
  const inventory = derived ? {listings:derived.stock.listings,kind:derived.stock.kind} : loadInventory(client, rawFacts, slug), rawListings = inventory.listings;
  const listings = (derived?normalizeRegisteredListings(derived,business):rawListings.map((item, index) => normalizeListing(item, index, business)))
    .filter((item) => item.title && item.image);
  if (!business.name) throw new Error(`Dealer ${slug} has no reusable business name.`);
  if (!listings.length) throw new Error(`Dealer ${slug} has no reusable inventory with imagery.`);
  return { schemaVersion: 1, slug, business, listings, rawFacts, sourceCount: rawListings.length, stockKind:inventory.kind, logoContract };
}

export const refreshNormalizeInternals = {
  asString, firstString, normalizeBody, normalizeFuel, normalizeTransmission,
  numberFrom, normalizedImages, normalizeBusiness, normalizeListing
};
