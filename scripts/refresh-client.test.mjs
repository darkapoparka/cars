import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NAVARA = path.join(ROOT, 'clients/navara-car');
const PROMOSALE = path.join(ROOT, 'clients/promosale-varna');
const ELIQ = path.join(ROOT, 'clients/eliqauto');
const profile = loadDealerProfile(NAVARA, 'navara-car');
const promosaleProfile = loadDealerProfile(PROMOSALE, 'promosale-varna');

const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
};
const copyRelative = (sourceRoot, destinationRoot, relative) =>
  copy(path.join(sourceRoot, relative), path.join(destinationRoot, relative));

function temporaryCandidate(templateKey, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `cars-refresh-${templateKey}-`));
  const template = path.join(ROOT, 'templates', templateKey);
  for (const relative of files) copyRelative(template, root, relative);
  return { root, template };
}

test('legacy ELIQ source normalizes the published dealer identity', () => {
  const eliq = loadDealerProfile(ELIQ, 'eliqauto');
  assert.equal(eliq.business.name, 'ELIQ AUTO');
  assert.equal(eliq.business.city, 'Пазарджик');
  assert.equal(eliq.business.phoneDisplay, '0896 781 662');
  assert.match(eliq.business.logo, /eliq-auto-wordmark-header\.png$/);
  assert.equal(eliq.listings.length, 16);
});

test('Auto Best refresh keeps approved hero artwork and restores Navara dealer data', () => {
  const protectedFile = 'src/lib/data/vehicle-artwork.ts';
  const legacy = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-refresh-navara-legacy-'));
  const { root, template } = temporaryCandidate('auto-best', [
    protectedFile,
    'src/lib/config/brand.ts',
    'src/lib/data/inventory.ts',
    'src/lib/data/company.ts',
    'src/lib/components/company/ShowroomMap.svelte',
    'src/routes/listing-detail-v1/[id]/+page.svelte'
  ]);

  const legacyArtwork = path.join(legacy, protectedFile);
  copy(path.join(template, protectedFile), legacyArtwork);
  fs.appendFileSync(legacyArtwork, '\n// Legacy dealer listing-photo hero override.\n');
  assert.notEqual(hash(legacyArtwork), hash(path.join(template, protectedFile)),
    'the legacy Navara artwork fixture should differ from the approved template');

  applyRefreshAdapter({
    key: 'auto-best',
    oldVariant: legacy,
    candidate: root,
    profile
  });

  assert.equal(hash(path.join(root, protectedFile)), hash(path.join(template, protectedFile)),
    'dealer personalization must not overwrite template-owned vehicle artwork');
  assert.match(fs.readFileSync(path.join(root, 'src/lib/config/brand.ts'), 'utf8'), /Навара кар/);
  assert.match(fs.readFileSync(path.join(root, 'src/lib/data/inventory.ts'), 'utf8'), /Nissan Micra 1\.0 N-Sport/);
  assert.match(fs.readFileSync(path.join(root, 'src/lib/data/inventory.ts'), 'utf8'), /\/navara\/vehicles\//);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/routes/listing-detail-v1/[id]/+page.svelte'), 'utf8'), /Auto Best/);
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(legacy, { recursive: true, force: true });
});

test('Modern refresh preserves the approved hero while retaining stable fixture IDs', () => {
  const hero = 'apps/web/public/lead-hero.jpg';
  const { root, template } = temporaryCandidate('modern', [
    hero,
    'packages/marketplace/lead-site.ts',
    'packages/marketplace-domain/testing/mock-data.ts'
  ]);

  applyRefreshAdapter({
    key: 'modern',
    oldVariant: path.join(NAVARA, 'modern'),
    candidate: root,
    profile
  });

  assert.equal(hash(path.join(root, hero)), hash(path.join(template, hero)));
  const listings = fs.readFileSync(path.join(root, 'packages/marketplace-domain/testing/mock-data.ts'), 'utf8');
  assert.match(listings, /"id": "am-1001"/);
  assert.match(listings, /"id": "am-1009"/);
  assert.match(listings, /Nissan Micra 1\.0 N-Sport/);
  const leadSite = fs.readFileSync(path.join(root, 'packages/marketplace/lead-site.ts'), 'utf8');
  assert.match(leadSite, /name: "Навара кар"/);
  assert.match(leadSite, /heroPath: "\/lead-hero\.jpg"/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('Carwow refresh keeps current hero composition and removes sample dealer identity', () => {
  const hero = 'src/lib/components/home/desktop/DesktopHomeHero.svelte';
  const { root, template } = temporaryCandidate('carwow', [
    hero,
    'src/lib/data/daynight-current-inventory.ts',
    'src/lib/data/daynight-site.ts',
    'static/site.webmanifest'
  ]);

  applyRefreshAdapter({
    key: 'carwow',
    oldVariant: path.join(NAVARA, 'carwow'),
    candidate: root,
    profile
  });

  assert.equal(hash(path.join(root, hero)), hash(path.join(template, hero)));
  const site = fs.readFileSync(path.join(root, 'src/lib/data/daynight-site.ts'), 'utf8');
  assert.match(site, /name: "Навара кар"/);
  assert.doesNotMatch(site, /Day Night Auto/i);
  const inventory = fs.readFileSync(path.join(root, 'src/lib/data/daynight-current-inventory.ts'), 'utf8');
  assert.match(inventory, /Nissan Micra 1\.0 N-Sport/);
  assert.match(inventory, /"priceEur": "10 500 €"/);
  assert.match(inventory, /"mileage": "63 800 km"/);
  assert.doesNotMatch(inventory, /[\u00a0\u202f]/,
    'Carwow numeric strings must use parser-safe ASCII spaces');
  fs.rmSync(root, { recursive: true, force: true });
});


test('Import refresh retains the approved structural hero and replaces sample stock', () => {
  const hero = 'static/assets/daynight/hero/home-05-showroom-exterior.webp';
  const { root, template } = temporaryCandidate('import', [
    hero,
    'src/lib/data/daynight.ts',
    'src/lib/data/daynight-listings.json',
    'src/lib/data/vehicles.ts',
    'src/lib/data/dealers.ts',
    'src/lib/data/agents.ts'
  ]);

  applyRefreshAdapter({
    key: 'import',
    oldVariant: path.join(PROMOSALE, 'import'),
    candidate: root,
    profile: promosaleProfile
  });

  assert.equal(hash(path.join(root, hero)), hash(path.join(template, hero)));
  const feed = JSON.parse(fs.readFileSync(path.join(root, 'src/lib/data/daynight-listings.json'), 'utf8'));
  assert.equal(feed.count, promosaleProfile.listings.length);
  assert.match(feed.listings[0].title, /Mercedes-Benz EQE/);
  assert.match(feed.listings[0].image, /^\/dealer\/inventory\//);
  const data = fs.readFileSync(path.join(root, 'src/lib/data/daynight.ts'), 'utf8');
  assert.match(data, /Promosale Varna/);
  assert.doesNotMatch(data, /Day Night Auto/i);
  const vehicles = fs.readFileSync(path.join(root, 'src/lib/data/vehicles.ts'), 'utf8');
  assert.match(vehicles, /knownBrokenImageFallbacks: Record<string, string> = \{\}/);
  assert.doesNotMatch(vehicles, /card-48|inventory-audi/);
  fs.rmSync(root, { recursive: true, force: true });
});
