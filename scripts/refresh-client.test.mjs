import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { applyRefreshAdapter as runRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NAVARA = path.join(ROOT, 'clients/navara-car');
const PROMOSALE = path.join(ROOT, 'clients/promosale-varna');
const ELIQ = path.join(ROOT, 'clients/eliqauto');
const KG_TEAM = path.join(ROOT, 'clients/kg-team-auto');
const PERFECT = path.join(ROOT, 'clients/perfect-auto-varna');
const profile = loadDealerProfile(NAVARA, 'navara-car');
const promosaleProfile = loadDealerProfile(PROMOSALE, 'promosale-varna');
const perfectProfile = loadDealerProfile(PERFECT, 'perfect-auto-varna');

const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const copy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
};
const copyRelative = (sourceRoot, destinationRoot, relative) =>
  copy(path.join(sourceRoot, relative), path.join(destinationRoot, relative));

function applyRefreshAdapter(options) {
  const result = runRefreshAdapter(options);
  const contract = options.profile.logoContract;
  if (contract) {
    const publicDir = options.key === 'modern' ? 'apps/web/public' : 'static';
    for (const asset of Object.values(contract.assets)) {
      assert.equal(hash(path.join(options.candidate, publicDir, asset.publicPath.slice(1))), asset.sha256, 'Every contextual logo must match the approved contract after refresh');
    }
  }
  return result;
}

function temporaryCandidate(templateKey, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `cars-refresh-${templateKey}-`));
  const template = path.join(ROOT, 'templates', templateKey);
  const requiredConsumers = {
    'auto-best': [
      'localization/dealer.reviewed.json',
      'src/lib/config/locale.ts'
    ],
    carwow: [
      'localization/dealer.reviewed.json',
      'src/lib/locale/config.ts'
    ],
    modern: [
      'packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',
      'packages/marketplace-ui/components/listing-detail-content.tsx',
      'packages/marketplace-ui/components/seller-identity-card.tsx',
      'apps/web/lib/public-marketplace-data.ts',
      'apps/web/app/[locale]/layout.tsx'
    ],
    import: [
      'src/lib/components/home/HomeFiveHeader.svelte',
      'src/lib/config/dealer.ts'
    ]
  };
  for (const relative of new Set([...files, ...(requiredConsumers[templateKey] ?? [])])) copyRelative(template, root, relative);
  return { root, template };
}

test('legacy ELIQ source normalizes the published dealer identity', () => {
  const eliq = loadDealerProfile(ELIQ, 'eliqauto');
  assert.equal(eliq.business.name, 'ELIQ AUTO');
  assert.equal(eliq.business.city, 'Пазарджик');
  assert.equal(eliq.business.phoneDisplay, '0896 781 662');
  assert.equal(eliq.business.logo, eliq.logoContract.assets.onLight.publicPath);
  assert.equal(eliq.listings.length, 16);
});

test('dealer phone arrays normalize to an international contact number', () => {
  const kgTeam = loadDealerProfile(KG_TEAM, 'kg-team-auto');
  assert.equal(kgTeam.business.phoneE164, '+359877346262');
  assert.equal(kgTeam.business.phoneHref, 'tel:+359877346262');
  assert.equal(kgTeam.business.phoneDisplay, '+359877346262');
});

test('canonical dealer logo assets replace a legacy boxed public logo', () => {
  const { root } = temporaryCandidate('auto-best', [
    'src/lib/config/brand.ts',
    'src/lib/data/inventory.ts',
    'src/lib/data/company.ts',
    'src/lib/components/company/ShowroomMap.svelte',
    'src/lib/components/home/Hero.svelte',
    'src/routes/listing-detail-v1/[id]/+page.svelte'
  ]);

  applyRefreshAdapter({
    key: 'auto-best',
    oldVariant: path.join(PERFECT, 'auto-best'),
    candidate: root,
    profile: perfectProfile
  });

  const brand = fs.readFileSync(path.join(root, 'src/lib/config/brand.ts'), 'utf8');
  assert.ok(brand.includes('logo: "/dealer-brand/logo-on-light.webp"'));
  assert.ok(brand.includes('logoOnDark: "/dealer-brand/logo-on-dark.webp"'));
  assert.doesNotMatch(brand, /cover\.png/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('Auto Best refresh keeps approved hero artwork and restores Navara dealer data', () => {
  const protectedFile = 'src/lib/data/vehicle-artwork.ts';
  const legacyClient = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-refresh-navara-legacy-'));
  const legacy = path.join(legacyClient, 'auto-best');
  for (const asset of Object.values(profile.logoContract.assets)) {
    copy(path.join(NAVARA, asset.publicPath.slice(1)), path.join(legacyClient, asset.publicPath.slice(1)));
  }
  for (const name of ['logo-master.png', 'logo-on-light.png']) {
    const source = path.join(NAVARA, 'branding', name);
    if (fs.existsSync(source)) copy(source, path.join(legacyClient, 'branding', name));
  }
  const { root, template } = temporaryCandidate('auto-best', [
    protectedFile,
    'src/lib/config/brand.ts',
    'src/lib/data/inventory.ts',
    'src/lib/data/company.ts',
    'src/lib/components/company/ShowroomMap.svelte',
    'src/lib/components/home/Hero.svelte',
    'src/routes/listing-detail-v1/[id]/+page.svelte'
  ]);

  copy(
    path.join(NAVARA, 'auto-best/src/lib/config/brand.ts'),
    path.join(legacy, 'src/lib/config/brand.ts')
  );
  copy(
    path.join(NAVARA, 'auto-best/static/navara/wordmark.png'),
    path.join(legacy, 'static/navara/wordmark.png')
  );
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
  const autoBestInventory = fs.readFileSync(path.join(root, 'src/lib/data/inventory.ts'), 'utf8');
  assert.match(autoBestInventory, /\/navara\/vehicles\//);
  assert.match(autoBestInventory, /"body": "Hatchback"/);
  assert.match(autoBestInventory, /"body": "SUV"/);
  const autoBestBrand = fs.readFileSync(path.join(root, 'src/lib/config/brand.ts'), 'utf8');
  assert.match(autoBestBrand, /Посещения с предварителна уговорка/);
  const autoBestLocale = fs.readFileSync(path.join(root, 'src/lib/config/locale.ts'), 'utf8');
  assert.match(autoBestLocale, /"city": "Varna"/,
    'English dealer-facing copy must use the client profile instead of Auto Best sample defaults');
  assert.match(autoBestLocale, /"city": "Варна"/,
    'Bulgarian dealer-facing copy must retain the reviewed native city name');
  assert.doesNotMatch(autoBestLocale, /city:\s*'Sofia'/,
    'a refreshed Varna client must not retain the Auto Best sample English fallback');
  assert.equal(
    hash(path.join(root, 'src/lib/components/home/Hero.svelte')),
    hash(path.join(template, 'src/lib/components/home/Hero.svelte')),
    'dealer refresh must not modify the template-owned hero component'
  );
  const autoBestHero = fs.readFileSync(path.join(root, 'src/lib/components/home/Hero.svelte'), 'utf8');
  assert.doesNotMatch(autoBestHero, /Студентски град/);
  assert.match(autoBestHero, /i18n\.dealer\(['"]addressLine['"]\)/);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src/routes/listing-detail-v1/[id]/+page.svelte'), 'utf8'), /Auto Best/);
  fs.rmSync(root, { recursive: true, force: true });
  fs.rmSync(legacyClient, { recursive: true, force: true });
});

test('Modern refresh preserves the approved hero while retaining stable fixture IDs', () => {
  const hero = 'apps/web/public/lead-hero.jpg';
  const { root, template } = temporaryCandidate('modern', [
    hero,
    'packages/marketplace/lead-site.ts',
    'packages/marketplace-domain/testing/mock-data.ts',
    'packages/marketplace-ui/components/marketplace-masthead.tsx'
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
  const mobileBrand = fs.readFileSync(path.join(root, 'packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx'), 'utf8');
  assert.match(mobileBrand, /const useOnLight = wordmarkTone === "dark" \|\| \(wordmarkTone === "original" && light\);/);
  assert.match(mobileBrand, /const logoSource = useOnLight \? leadSite\.logoOnLight : leadSite\.logoOnDark;/);
  assert.match(mobileBrand, /src=\{logoSource\}/);
  assert.doesNotMatch(mobileBrand, /src=\{wordmarkTone ===/);
  assert.doesNotMatch(mobileBrand, /clipPath|brightness-0|\binvert\b/);
  const masthead = fs.readFileSync(path.join(root, 'packages/marketplace-ui/components/marketplace-masthead.tsx'), 'utf8');
  assert.doesNotMatch(masthead, /Студентски град|Studentski grad/);
  fs.rmSync(root, { recursive: true, force: true });
});

test('Modern refresh accepts a previously generated CRLF JSON fixture', () => {
  const fixture = 'packages/marketplace-domain/testing/mock-data.ts';
  const { root } = temporaryCandidate('modern', [
    'apps/web/public/lead-hero.jpg',
    'packages/marketplace/lead-site.ts',
    fixture,
    'packages/marketplace-ui/components/marketplace-masthead.tsx'
  ]);
  const generatedFixture = fs.readFileSync(path.join(NAVARA, 'modern', fixture), 'utf8');
  fs.writeFileSync(path.join(root, fixture), generatedFixture.replace(/\r?\n/g, '\r\n'));
  const before = fs.readFileSync(path.join(root, fixture), 'utf8');
  assert.match(before, /\r\n/);
  assert.match(before, /"id": "am-1001"/);
  assert.match(before, /\];\r\n\r\nconst matchesText/);

  applyRefreshAdapter({
    key: 'modern',
    oldVariant: path.join(NAVARA, 'modern'),
    candidate: root,
    profile
  });

  const listings = fs.readFileSync(path.join(root, fixture), 'utf8');
  assert.match(listings, /"id": "am-1001"/);
  assert.match(listings, /"id": "am-1009"/);
  assert.match(listings, /\];\n\nconst matchesText/);
  assert.equal(listings.includes('\r'), false);
  fs.rmSync(root, { recursive: true, force: true });
});

test('Carwow refresh keeps current hero composition and removes sample dealer identity', () => {
  const hero = 'src/lib/components/home/desktop/DesktopHomeHero.svelte';
  const { root, template } = temporaryCandidate('carwow', [
    hero,
    'src/lib/data/daynight-current-inventory.ts',
    'src/lib/data/daynight-site.ts',
    'src/lib/data/daynight-videos.ts',
    'src/lib/components/layout/SiteChromeTopBar.svelte',
    'src/lib/components/layout/DayNightFooter.svelte',
    'src/lib/components/layout/DesktopDealerFooter.svelte',
    'src/lib/components/home/mobile/mobile-home-data.ts',
    'src/lib/components/about/DesktopAboutPage.svelte',
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
  assert.match(site, /name:\s*['"][^'"]+['"]/);
  assert.ok(site.toLocaleLowerCase('bg-BG').includes(profile.business.name.toLocaleLowerCase('bg-BG')));
  assert.doesNotMatch(site, /Day Night Auto/i);
  const inventory = fs.readFileSync(path.join(root, 'src/lib/data/daynight-current-inventory.ts'), 'utf8');
  assert.match(inventory, /Nissan Micra 1\.0 N-Sport/);
  assert.match(inventory, /"priceEur": "10 500 €"/);
  assert.match(inventory, /"mileage": "63 800 km"/);
  assert.doesNotMatch(inventory, /[\u00a0\u202f]/,
    'Carwow numeric strings must use parser-safe ASCII spaces');
  const carwowPublicFiles = [
    'src/lib/components/layout/SiteChromeTopBar.svelte',
    'src/lib/components/layout/DayNightFooter.svelte',
    'src/lib/components/layout/DesktopDealerFooter.svelte',
    'src/lib/components/home/mobile/mobile-home-data.ts',
    'src/lib/components/about/DesktopAboutPage.svelte',
    'src/lib/data/daynight-videos.ts'
  ].map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n');
  assert.doesNotMatch(carwowPublicFiles, /Студентски град|daynight\.auto\.plovdiv|kristiankirilov|61566304063141/);
  assert.match(site, /socialLinks: \{\"facebook\":\"\",\"instagram\":\"\",\"youtube\":\"\",\"tiktok\":\"\"\}/);
  assert.match(carwowPublicFiles, /homeVideos: DayNightVideo\[\] = \[\]/);
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
    'src/lib/data/agents.ts',
    'src/lib/components/home/HomeFiveHero.svelte'
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
  const dealer = fs.readFileSync(path.join(root, 'src/lib/config/dealer.ts'), 'utf8');
  assert.match(dealer, /Promosale Varna/);
  assert.doesNotMatch(dealer, /Day Night Auto/i);
  assert.match(dealer, /viber:\/\/chat\?number=/);
  assert.match(dealer, /default: "bg"/);
  assert.match(dealer, /country: "BG"/);
  const data = fs.readFileSync(path.join(root, 'src/lib/data/daynight.ts'), 'utf8');
  assert.match(data, /Promosale Varna/);
  assert.doesNotMatch(data, /Day Night Auto/i);
  const vehicles = fs.readFileSync(path.join(root, 'src/lib/data/vehicles.ts'), 'utf8');
  assert.match(vehicles, /knownBrokenImageFallbacks: Record<string, string> = \{\}/);
  assert.doesNotMatch(vehicles, /card-48|inventory-audi/);
  const heroSource = fs.readFileSync(
    path.join(root, 'src/lib/components/home/HomeFiveHero.svelte'),
    'utf8'
  );
  assert.match(heroSource, /site\.contact\.mapHref/);
  assert.match(heroSource, /site\.contact\.phoneHref/);
  assert.doesNotMatch(heroSource, /import \{ daynightContact \}/);
  assert.doesNotMatch(heroSource, /Day Night Auto%20Plovdiv|0877733110/);
  fs.rmSync(root, { recursive: true, force: true });
});
