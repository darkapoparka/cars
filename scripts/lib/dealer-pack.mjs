import fs from 'node:fs';
import path from 'node:path';
import {ROOT, POLICY, sha256, inside, json, validateManifest} from './workflow.mjs';
import {normalizeDealerLocale} from './dealer-locale.mjs';
import {validateNewDealerFacts} from '../prepare-new-dealer-source.mjs';
import {validateNativeQualificationContext, validateTemplateQualification} from './native-localization.mjs';
import {listDealerPacks} from './dealer-pack-index.mjs';

export {listDealerPacks};
export const PACK_KEYS = Object.freeze(['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best']);
export const PACK_LOCK = 'dealers/templates.lock.json';
export const PACK_VARIANTS = Object.freeze(PACK_KEYS.map((key, i) => ({key, base: i ? '/variant-' + (i + 1) : '', entry: i === 1 ? '/variant-2/cars' : i ? '/variant-' + (i + 1) + '/' : '/'})));
export const PACK_COUNTRIES = Object.freeze({GB: {currency: 'GBP', distanceUnit: 'mi', locale: 'en-GB'}, AE: {currency: 'AED', distanceUnit: 'km', locale: 'en-AE'}, US: {currency: 'USD', distanceUnit: 'mi', locale: 'en-US'}});
const assert = (value, message) => {if (!value) throw Error(message);};
export const encodePackJson = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
export const validPackSlug = slug => typeof slug === 'string' && slug.length <= 43 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
export const safePackPath = name => typeof name === 'string' && /^[A-Za-z0-9._/-]+$/.test(name) && !name.startsWith('/') && name.split('/').every(part => part && !['.', '..'].includes(part));

/** Bounded, physical files only. Packs cannot smuggle app sources or credentials. */
export function readPackFiles(directory) {
  const files = new Map(); let bytes = 0;
  const visit = (current, prefix = '') => {
    for (const row of fs.readdirSync(current, {withFileTypes: true}).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const relative = prefix + row.name, file = path.join(current, row.name);
      assert(safePackPath(relative) && !row.isSymbolicLink(), 'Dealer pack contains an unsafe path: ' + relative);
      assert(!['node_modules', 'runtime', '.git', '.github', 'auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'].includes(row.name) && !row.name.startsWith('.env'), 'Only dealer inputs belong in a pack: ' + relative);
      if (row.isDirectory()) visit(file, relative + '/');
      else {
        assert(row.isFile() && fs.statSync(file).size <= 25 * 1024 ** 2, 'Oversized or non-regular pack member: ' + relative);
        const data = fs.readFileSync(file); bytes += data.length; files.set(relative, data);
        assert(files.size <= 512 && bytes <= 256 * 1024 ** 2, 'Dealer pack exceeds its input budget');
      }
    }
  };
  visit(directory); return files;
}

export function assertPublicPackFacts(facts, stock) {
  const inspect = (value, at = '') => {
    if (Array.isArray(value)) {value.forEach((row, i) => inspect(row, at + '[' + i + ']')); return;}
    if (!value || typeof value !== 'object') return;
    for (const [key, item] of Object.entries(value)) {
      assert(!/^(?:private|crm|outreach|contactHistory|ownerName|contactName|personalEmail|personalPhone|fit_reason|fit_score|qualification_notes|notes)$/i.test(key), 'Private or sales-research field is not a public pack fact: ' + at + key);
      if (/price|amount/i.test(key) && !/OnRequest$/.test(key)) assert(item === null || item === undefined || item === '', 'Listing prices must be omitted: ' + at + key);
      inspect(item, at + key + '.');
    }
  };
  inspect(facts); inspect(stock);
  assert(stock.records.every(row => row.priceOnRequest === true), 'Every preview listing must omit its price');
}

export function createPackManifest({slug, dealerId, country, lock, logo, observedAt}) {
  assert(validPackSlug(slug) && typeof dealerId === 'string' && PACK_COUNTRIES[country], 'Use an exact expansion lead, supported country, and bounded slug');
  const localization = normalizeDealerLocale({schemaVersion: 1, dealerId, defaultLocale: 'en', enabledLocales: ['en', 'bg'], dealerCountry: country, inventoryCurrency: PACK_COUNTRIES[country].currency}, dealerId);
  const sources = Object.fromEntries(PACK_KEYS.map(key => [key, lock.templates[key].source]));
  return {schemaVersion: 1, slug, dealerId, repository: 'darkapoparka/cars', defaultBranch: 'main',
    sourceFormat: 'dealer-pack', sourcePath: 'dealers/' + slug, templateLock: PACK_LOCK,
    language: 'en', variants: structuredClone(PACK_VARIANTS), extraAssets: ['dealer-stock', 'dealer-brand', 'branding'],
    packaging: {version: '5'}, templateRevisions: Object.fromEntries(PACK_KEYS.map(key => [key, sources[key].revision])), templateSources: sources,
    appVariant: {schemaVersion: 1, format: 'app-preview-v1', source: sources.app}, localization,
    branding: {schemaVersion: 1, required: true, policy: 'template-default', contract: '.cars-branding.json', surfaceBindingsVersion: 1},
    cloudflare: {workerPrefix: 'cars-' + slug},
    ...(logo ? {shareIdentity: logo} : {}),
    pack: {schemaVersion: 1, source: 'leads/expansion-2026-10-18', observedAt, proposal: true, dealerApproved: false, providerWrites: false}};
}

export function loadDealerPack(root = ROOT, slug, {requireBranding = true} = {}) {
  assert(validPackSlug(slug), 'Use a lowercase dealer-pack slug of at most 43 characters');
  const directory = inside(root, 'dealers/' + slug, {mustExist: true}), files = readPackFiles(directory);
  const read = name => {assert(files.has(name), 'Missing dealer pack input: ' + name); return JSON.parse(files.get(name).toString('utf8'));};
  const manifest = validateManifest(read('dealer.json'), {allowDealerPackSource: true});
  assert(manifest.slug === slug && manifest.sourceFormat === 'dealer-pack' && manifest.sourcePath === 'dealers/' + slug && manifest.templateLock === PACK_LOCK, 'Pack must identify its exact Cars source path and lock');
  const facts = read('business-facts.json'), stock = read('stock.json'), locale = normalizeDealerLocale(read('locale.json'), manifest.dealerId);
  assert(JSON.stringify(locale) === JSON.stringify(manifest.localization), 'Locale file and manifest differ');
  const identityReview = read('identity-review.json');
  const media = [...new Set(stock.records.flatMap(row => row.images ?? []))].map(name => {
    assert(name.startsWith('/dealer-stock/') && safePackPath(name.slice(1)) && files.has(name.slice(1)), 'Stock must use a retained pack image: ' + name);
    return {destination: name.slice(1)};
  });
  assertPublicPackFacts(facts, stock);
  validateNewDealerFacts({dealer: {...manifest, media}, facts, stock, locale, identityReview});
  const registryPath = path.join(root, 'docs/DEPLOYMENT-INVENTORY.json');
  const normalized = value => String(value).toLowerCase().replace(/[^a-z0-9]/g, '');
  const fleet = fs.existsSync(registryPath) ? json(registryPath).dealers ?? [] : [];
  assert(!fleet.some(row => normalized(row.slug) === normalized(slug) || [row.id, row.dealerId, row.researchId].includes(manifest.dealerId)), 'Dealer pack duplicates an existing fleet identity');
  assert(!listDealerPacks(root).some(row => row.slug !== slug && (row.dealerId === manifest.dealerId || normalized(row.slug) === normalized(slug))), 'Dealer pack duplicates another pack');
  const lockBytes = fs.readFileSync(path.join(root, PACK_LOCK)), lock = JSON.parse(lockBytes);
  assert(lock.schemaVersion === 1 && lock.exportPolicy === POLICY, 'Invalid pack template lock');
  const qualification = read('qualification.json');
  validateNativeQualificationContext(qualification, {dealer: slug});
  assert(qualification.candidateLockSha256 === sha256(lockBytes) && qualification.approvedLockSha256 === sha256(fs.readFileSync(path.join(root, 'templates.lock.json'))), 'Candidate or approved parent lock changed');
  assert(sha256(fs.readFileSync(inside(root, qualification.sourceDeltaReview.reference, {mustExist: true}))) === qualification.sourceDeltaReview.sha256, 'Source delta review changed');
  for (const key of PACK_KEYS) {
    validateTemplateQualification(key, lock.templates[key], qualification, {root});
    assert(JSON.stringify(manifest.templateSources[key]) === JSON.stringify(lock.templates[key].source) && manifest.templateRevisions[key] === lock.templates[key].commit, 'Pack source release differs: ' + key);
  }
  const branding = files.has('branding/logo-contract.json') ? read('branding/logo-contract.json') : null;
  if (requireBranding) {
    assert(branding?.schemaVersion === 1 && branding.dealer === slug && branding.reviewed === true, 'Prepare and review the dealer logo before building');
    for (const role of ['onLight', 'onDark', 'onAccent']) {
      const asset = branding.assets?.[role];
      assert(asset && /^\/dealer-brand\/[^/]+\.webp$/.test(asset.publicPath) && files.has(asset.publicPath.slice(1)) && sha256(files.get(asset.publicPath.slice(1))) === asset.sha256 && files.has(asset.sourcePath), 'Missing or changed logo surface: ' + role);
    }
  }
  const rows = [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, data]) => ({path: name, sha256: sha256(data)}));
  return {directory, manifest, facts, stock, locale, branding, files, lock, qualification, media,
    packDigest: sha256(JSON.stringify(rows)), fileCount: files.size, bytes: [...files.values()].reduce((sum, data) => sum + data.length, 0)};
}
