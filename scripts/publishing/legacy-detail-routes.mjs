import fs from 'node:fs';
import path from 'node:path';
import { readTypeScriptCatalog } from '../lib/catalog-literal.mjs';
import { normalized, sha256 } from '../lib/workflow.mjs';

export const LEGACY_DETAIL_FILE = '.cars-legacy-detail-routes.json';
const ROUTE_FACTORY_SHA256 = '094d5128ad5e689e41486a228b1de6d11c54efbe051ce0e75c0170709d8571c9';
const INVENTORY_PATH = 'carwow/src/lib/data/daynight-current-inventory.ts';
const VEHICLES_PATH = 'carwow/src/lib/data/daynight-vehicles.ts';
const segment = value => typeof value === 'string' && /^[a-zA-Z0-9_-]+$/.test(value);
const digest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');

// These are the exact reviewed Carwow identity rules. The source closure is
// checked before parsing stock; unknown route factories require explicit review.
function oldSlug(listing) {
  const brand = listing.title.startsWith('Mercedes-Benz') ? 'Mercedes-Benz'
    : listing.title.startsWith('Land Rover') ? 'Land Rover' : listing.title.split(' ')[0];
  const remainder = listing.title.slice(brand.length).trim();
  const patterns = {
    'Mercedes-Benz': /^(?:GLA \d+(?: AMG)?|GLS \d+|GLE \d+(?: 4MATIC)?|GL \d+ AMG|G \d+(?: AMG)?|S \d+(?: AMG)?|E \d+(?: AMG)?|CLS \d+(?: AMG)?|AMG GT(?: S)?|V \d+)/i,
    BMW: /^(?:X\d|M\d|\d{3})\b/i,
    Audi: /^(?:RS\d|Q\d|A\d)\b/i,
    'Land Rover': /^Range Rover Sport/i,
    Lamborghini: /^Urus/i
  };
  const model = remainder.match(patterns[brand] ?? /^\S+(?:\s+\S+)?/)?.[0] ?? remainder.split(' ')[0];
  const slugBase = `${brand} ${model}`.toLocaleLowerCase('en-US').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `${slugBase}-${listing.id.slice(-6)}`;
}

function factoryDigest(source) {
  const identityAt = source.indexOf('const getVehicleIdentity =');
  const vehicleAt = source.indexOf('const listingToVehicle =');
  const slugAt = source.indexOf('const slugBase =');
  const featuresAt = source.indexOf('const features =', slugAt);
  const result = source.match(/slug:\s*`[^`]+`/)?.[0];
  if ([identityAt, vehicleAt, slugAt, featuresAt].some(at => at < 0) || !result) return null;
  return sha256(source.slice(identityAt, vehicleAt) + '\n' + source.slice(slugAt, featuresAt) + '\n' + result);
}

export function buildLegacyDetailRouteMap({ dealerRoot, profile, manifest }) {
  return mapLegacyCarwowDetails({ profile, manifest,
    inventoryBytes: fs.readFileSync(path.join(dealerRoot, INVENTORY_PATH)),
    vehicleBytes: fs.readFileSync(path.join(dealerRoot, VEHICLES_PATH)) });
}

export function mapLegacyCarwowDetails({ inventoryBytes, vehicleBytes, profile, manifest }) {
  const target = manifest.variants.find(variant => variant.base === '/variant-3');
  if (!target || !['modern', 'import'].includes(target.key)) throw new Error('Legacy Carwow details require the reviewed Modern/Import slot-3 replacement');
  if (profile.slug !== manifest.slug) throw new Error('Legacy detail dealer/profile mismatch');
  inventoryBytes = normalized(inventoryBytes);
  vehicleBytes = normalized(vehicleBytes);
  if (factoryDigest(vehicleBytes.toString('utf8')) !== ROUTE_FACTORY_SHA256) throw new Error('Unreviewed legacy Carwow detail route factory');
  const stock = readTypeScriptCatalog(inventoryBytes.toString('utf8'), 'currentDayNightListings');
  if (!Array.isArray(stock) || !stock.length) throw new Error('Legacy Carwow inventory is missing');
  const sourceIds = new Map();
  for (const listing of profile.listings) {
    const id = String(listing.sourceId || listing.id);
    if (sourceIds.has(id)) throw new Error(`Duplicate current inventory identity: ${id}`);
    sourceIds.set(id, listing);
  }
  const entries = [], retired = [], slugs = new Set();
  for (const listing of stock) {
    if (!segment(listing.id) || typeof listing.title !== 'string' || !listing.title) throw new Error('Invalid legacy inventory identity');
    const slug = oldSlug(listing);
    if (!segment(slug) || slugs.has(slug)) throw new Error(`Ambiguous legacy detail slug: ${slug}`);
    slugs.add(slug);
    const current = sourceIds.get(listing.id);
    if (!current) { retired.push({ sourceId: listing.id, slug, reason: 'No retained current inventory identity; keep a genuine missing-vehicle response.' }); continue; }
    if (listing.sourceUrl && current.sourceUrl && listing.sourceUrl !== current.sourceUrl) throw new Error(`Legacy/current source URL mismatch: ${listing.id}`);
    const targetId = target.key === 'import' ? String(current.sourceId || current.id) : current.slug;
    if (!segment(targetId)) throw new Error(`Invalid new detail identity: ${listing.id}`);
    entries.push({ sourceId: listing.id, slug, targetId });
  }
  const artifact = {
    schemaVersion: 1, dealer: manifest.slug, family: target.key, base: target.base,
    defaultLocale: manifest.localization?.defaultLocale ?? manifest.language ?? 'en',
    source: { inventory: { path: INVENTORY_PATH, sha256: sha256(inventoryBytes) }, vehicles: { path: VEHICLES_PATH, sha256: sha256(vehicleBytes) }, routeFactorySha256: ROUTE_FACTORY_SHA256 },
    profileSha256: sha256(JSON.stringify(profile)), entries, retired
  };
  legacyDetailRedirects(manifest, artifact);
  const bytes = json(artifact);
  return { artifact, bytes, reference: { schemaVersion: 1, path: LEGACY_DETAIL_FILE, sha256: sha256(bytes) } };
}

export function legacyDetailRedirects(manifest, artifact) {
  if (!artifact) return [];
  const target = manifest.variants.find(variant => variant.base === '/variant-3');
  if (artifact.schemaVersion !== 1 || artifact.dealer !== manifest.slug || !target || artifact.family !== target.key || artifact.base !== target.base
    || !['modern', 'import'].includes(target.key) || !['en', 'bg'].includes(artifact.defaultLocale)
    || artifact.source?.routeFactorySha256 !== ROUTE_FACTORY_SHA256 || !digest(artifact.profileSha256)
    || artifact.source?.inventory?.path !== INVENTORY_PATH || !digest(artifact.source?.inventory?.sha256)
    || artifact.source?.vehicles?.path !== VEHICLES_PATH || !digest(artifact.source?.vehicles?.sha256)
    || !Array.isArray(artifact.entries) || !Array.isArray(artifact.retired)) throw new Error('Invalid legacy detail route proof');
  const seen = new Set(), redirects = [];
  const catalogDestination = locale => target.key === 'modern' ? `${target.base}/${locale}/cars`
    : `${target.base}/inventory?lang=${locale}`;
  for (const locale of ['en', 'bg']) redirects.push({ source: `${target.base}/${locale}/inventory`, destination: catalogDestination(locale), permanent: false });
  if (target.key === 'modern') {
    for (const locale of ['en', 'bg']) redirects.push({ source: `${target.base}/inventory`, has: [{ type: 'query', key: 'lang', value: locale }], destination: catalogDestination(locale), permanent: false });
    redirects.push({ source: `${target.base}/inventory`, destination: catalogDestination(artifact.defaultLocale), permanent: false });
  }
  for (const { sourceId, slug, targetId } of artifact.entries) {
    if (!segment(sourceId) || !segment(slug) || !segment(targetId) || seen.has(slug)) throw new Error('Invalid or duplicate legacy detail route');
    seen.add(slug);
    const source = `${target.base}/inventory/${slug}`;
    const destination = locale => target.key === 'modern' ? `${target.base}/${locale}/listing/${targetId}`
      : `${target.base}/inventory/${targetId}?lang=${locale}`;
    for (const locale of ['en', 'bg']) redirects.push({ source: `${target.base}/${locale}/inventory/${slug}`, destination: destination(locale), permanent: false });
    if (target.key === 'import' && slug === targetId) continue;
    for (const locale of ['en', 'bg']) redirects.push({ source, has: [{ type: 'query', key: 'lang', value: locale }], destination: destination(locale), permanent: false });
    redirects.push({ source, destination: destination(artifact.defaultLocale), permanent: false });
  }
  return redirects;
}

export function legacyDetailArtifact(files, manifest) {
  const reference = manifest.legacyDetailRoutes;
  if (!reference) {
    if (files.has(LEGACY_DETAIL_FILE)) throw new Error('Unreferenced legacy detail route artifact');
    return null;
  }
  const bytes = files.get(LEGACY_DETAIL_FILE);
  if (reference.schemaVersion !== 1 || reference.path !== LEGACY_DETAIL_FILE || !digest(reference.sha256)
    || !bytes || sha256(normalized(bytes)) !== reference.sha256) throw new Error('Legacy detail artifact differs from its committed manifest reference');
  const artifact = JSON.parse(bytes.toString('utf8'));
  legacyDetailRedirects(manifest, artifact);
  return artifact;
}
