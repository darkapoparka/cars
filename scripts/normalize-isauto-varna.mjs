import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const AUTO_BEST = path.join(CLIENT, 'auto-best');
const CARWOW = path.join(CLIENT, 'carwow');
const MODERN = path.join(CLIENT, 'modern');
const MODERN_PUBLIC_DATA = path.join(
  MODERN,
  'apps',
  'web',
  'lib',
  'public-marketplace-data.ts'
);

async function readFrom(root, relative) {
  return fs.readFile(path.join(root, relative), 'utf8');
}

async function writeTo(root, relative, content) {
  await fs.writeFile(
    path.join(root, relative),
    content.endsWith('\n') ? content : `${content}\n`,
    'utf8'
  );
}

const carwowSocialFiles = [
  'src/lib/components/about/DesktopAboutPage.svelte',
  'src/lib/components/home/mobile/mobile-home-data.ts',
  'src/lib/components/layout/DayNightFooter.svelte',
  'src/lib/components/layout/DesktopDealerFooter.svelte',
  'src/lib/components/layout/SiteChromeTopBar.svelte'
];

const replacements = [
  ['https://www.facebook.com/61566304063141/', 'https://www.facebook.com/isauto1'],
  ['https://www.instagram.com/daynight.auto.plovdiv/', 'https://www.instagram.com/is__auto/?hl=bg']
];

for (const relative of carwowSocialFiles) {
  const before = await readFrom(CARWOW, relative);
  let after = before;
  for (const [legacy, official] of replacements) after = after.replaceAll(legacy, official);
  if (after !== before) await writeTo(CARWOW, relative, after);
}

const canonicalDealerProfile = await readFrom(CARWOW, 'src/lib/data/dealer-profile.json');
for (const [, official] of replacements) {
  if (!canonicalDealerProfile.includes(official)) {
    throw new Error(`Missing official social URL in canonical Carwow dealer profile: ${official}`);
  }
}

await writeTo(
  CARWOW,
  'src/lib/data/daynight-videos.ts',
  `// IS AUTO's official website publishes Facebook and Instagram links, but no verified YouTube channel.\n// Keep the inherited template video surface empty instead of presenting another dealer's media.\nexport const youtubeChannelUrl: string | null = null;\nexport const homeVideos = [] as const;\n`
);

const emptyCarwowVideoComponent = `<script lang="ts">\n\t// Intentionally empty: IS AUTO does not publish a verified YouTube channel.\n</script>\n`;
await writeTo(CARWOW, 'src/lib/components/home/desktop/DesktopHomeVideos.svelte', emptyCarwowVideoComponent);
await writeTo(CARWOW, 'src/lib/components/home/mobile/MobileHomeVideos.svelte', emptyCarwowVideoComponent);

// Keep the template-owned nullable YouTube contract intact. The shared components
// hide the link when youtubeChannelUrl is null; deleting the import would leave
// refreshed component markup out of sync with its data module.
for (const relative of [
  'src/lib/components/about/DesktopAboutPage.svelte',
  'src/lib/components/layout/DesktopDealerFooter.svelte'
]) {
  const content = await readFrom(CARWOW, relative);
  if (!content.includes("import { youtubeChannelUrl } from '$lib/data/daynight-videos';")) {
    throw new Error(`Missing nullable YouTube data contract in ${relative}`);
  }
}

await writeTo(
  AUTO_BEST,
  'src/lib/data/videos.ts',
  `export interface FeaturedVideo {\n  id: string;\n  title: string;\n  duration: string;\n  thumbnail: string;\n}\n\n// IS AUTO does not publish a verified YouTube channel. Do not inherit another dealer's videos.\nexport const featuredVideos: readonly FeaturedVideo[] = [];\n`
);


for (const relative of [
  'src/lib/components/company/AboutHero.svelte',
  'src/lib/components/company/ContactIntent.svelte'
]) {
  const before = await readFrom(AUTO_BEST, relative);
  const after = before.replace(
    /\r?\n\s*\{ name: 'youtube', label: 'YouTube', href: brand\.youtubeUrl \},?/,
    ''
  );
  if (after.includes("name: 'youtube'")) {
    throw new Error(`Could not remove the unverified YouTube profile from ${relative}`);
  }
  if (after !== before) await writeTo(AUTO_BEST, relative, after);
}

const mobileMenuPath = 'src/lib/components/layout/MobileMenu.svelte';
let mobileMenu = await readFrom(AUTO_BEST, mobileMenuPath);
mobileMenu = mobileMenu.replace(
  /\r?\n\s*<a \{\.\.\.\{ href: brand\.youtubeUrl \}\} target="_blank" rel="noopener noreferrer"><SocialBrandIcon name="youtube" \/><span>YouTube<\/span><\/a>/,
  ''
);
mobileMenu = mobileMenu.replace(
  'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-template-columns: repeat(2, minmax(0, 1fr));'
);
if (mobileMenu.includes('href: brand.youtubeUrl')) {
  throw new Error('Could not remove the unverified YouTube link from the Auto Best mobile menu.');
}
await writeTo(AUTO_BEST, mobileMenuPath, mobileMenu);

let modernPublicData = await fs.readFile(MODERN_PUBLIC_DATA, 'utf8');
const originalMarketplaceImport = /import \{\r?\n  buildVehicleTaxonomyOptions,\r?\n  curatedVehicleTaxonomy,\r?\n  getMockListingBySlug,\r?\n  getMockListings,\r?\n  leadSite,\r?\n  type MarketplaceSearchParams,\r?\n  mockListings,\r?\n  type VehicleCategory,\r?\n  type VehicleListing,\r?\n  type VehicleTaxonomyMakeOption,\r?\n\} from "@repo\/marketplace";/;
const priorNormalizedImports = /import \{\r?\n  getMockListingBySlug,\r?\n  getMockListings,\r?\n  mockListings,\r?\n\} from "@repo\/marketplace-domain\/testing\/mock-data";\r?\nimport \{\r?\n  buildVehicleTaxonomyOptions,\r?\n  curatedVehicleTaxonomy,\r?\n  leadSite,\r?\n  type MarketplaceSearchParams,\r?\n  type VehicleCategory,\r?\n  type VehicleListing,\r?\n  type VehicleTaxonomyMakeOption,\r?\n\} from "@repo\/marketplace";/;
const deterministicImports = `import {\n  getMockListings,\n  mockListings,\n} from "@repo/marketplace-domain/testing/mock-data";\nimport {\n  buildVehicleTaxonomyOptions,\n  curatedVehicleTaxonomy,\n  leadSite,\n  type MarketplaceSearchParams,\n  type VehicleCategory,\n  type VehicleListing,\n  type VehicleTaxonomyMakeOption,\n} from "@repo/marketplace";`;

if (originalMarketplaceImport.test(modernPublicData)) {
  modernPublicData = modernPublicData.replace(originalMarketplaceImport, deterministicImports);
} else if (priorNormalizedImports.test(modernPublicData)) {
  modernPublicData = modernPublicData.replace(priorNormalizedImports, deterministicImports);
} else if (!modernPublicData.includes('from "@repo/marketplace-domain/testing/mock-data"')) {
  throw new Error('Could not find the expected Modern marketplace import block.');
}

if (!modernPublicData.includes('const getMockListingBySlug = (slug: string) =>')) {
  const importIndex = modernPublicData.indexOf(deterministicImports);
  if (importIndex < 0) {
    throw new Error('Could not locate the normalized Modern import insertion point.');
  }
  const insertAt = importIndex + deterministicImports.length;
  modernPublicData = `${modernPublicData.slice(0, insertAt)}\n\nconst getMockListingBySlug = (slug: string) =>\n  mockListings.find((listing) => listing.slug === slug);${modernPublicData.slice(insertAt)}`;
}
await fs.writeFile(
  MODERN_PUBLIC_DATA,
  modernPublicData.endsWith('\n') ? modernPublicData : `${modernPublicData}\n`,
  'utf8'
);

const publicStructuredDataTest = path.join(
  MODERN,
  'apps',
  'web',
  'lib',
  'public-structured-data.test.ts'
);
let publicStructuredData = await fs.readFile(publicStructuredDataTest, 'utf8');
publicStructuredData = publicStructuredData.replace(
  /import \{ getMockListingBySlug \} from "@repo\/(?:marketplace|marketplace-domain\/testing\/mock-data)";/,
  'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";'
);
publicStructuredData = publicStructuredData.replace(
  'const listing = getMockListingBySlug("bmw-x5-m50d-sofia-2020");',
  'const listing = mockListings.find((entry) => entry.slug === "bmw-x5-m50d-sofia-2020");'
);
if (
  !publicStructuredData.includes('import { mockListings } from "@repo/marketplace-domain/testing/mock-data";') ||
  publicStructuredData.includes('getMockListingBySlug')
) {
  throw new Error('Could not normalize Modern public structured-data test fixtures.');
}
await fs.writeFile(publicStructuredDataTest, publicStructuredData, 'utf8');

const typedMockTests = [
  {
    relative: 'packages/marketplace-ui/lib/listing-truth.test.ts',
    call: 'const listing = getMockListingBySlug("bmw-x5-xdrive40d-berlin-2022");',
    replacement: 'const listing = mockListings.find((entry) => entry.slug === "bmw-x5-xdrive40d-berlin-2022");'
  },
  {
    relative: 'packages/marketplace-ui/lib/vehicle-card-policy.test.ts',
    call: 'const listing = getMockListingBySlug(slug);',
    replacement: 'const listing = mockListings.find((entry) => entry.slug === slug);'
  }
];

for (const fix of typedMockTests) {
  const target = path.join(MODERN, fix.relative);
  let content = await fs.readFile(target, 'utf8');
  content = content.replace(
    /import \{ getMockListingBySlug, type VehicleListing \} from "@repo\/marketplace";/,
    'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";\nimport type { VehicleListing } from "@repo/marketplace";'
  );
  content = content.replace(
    /import \{ getMockListingBySlug \} from "@repo\/marketplace-domain\/testing\/mock-data";\r?\nimport type \{ VehicleListing \} from "@repo\/marketplace";/,
    'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";\nimport type { VehicleListing } from "@repo/marketplace";'
  );
  content = content.replace(fix.call, fix.replacement);
  if (
    !content.includes('import { mockListings } from "@repo/marketplace-domain/testing/mock-data";') ||
    content.includes('getMockListingBySlug')
  ) {
    throw new Error(`Could not normalize Modern test fixture lookup: ${fix.relative}`);
  }
  await fs.writeFile(target, content, 'utf8');
}

const forbidden = [
  'daynight.auto.plovdiv',
  '61566304063141',
  'kristiankirilov1355',
  '6S3dLIgeAT8',
  'zG6rjLpT4u8',
  'w_XaGmIWJFM',
  'Най-желаната кола в България',
  'Продадох най-новата Панамера',
  'Каква е разликата в G-класите'
];

async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(target);
    else if (/\.(?:svelte|ts|tsx|js|mjs)$/.test(entry.name)) {
      const content = await fs.readFile(target, 'utf8');
      for (const value of forbidden) {
        if (content.includes(value)) throw new Error(`Inherited IS AUTO content remains in ${target}: ${value}`);
      }
    }
  }
}

await scan(CLIENT);
console.log('IS AUTO content normalized across all variants; Modern mock array lookups made deterministic.');

// Enforce a readable light wordmark on Modern's dark header after personalization.
await import('./fix-isauto-modern-logo-contrast.mjs');
