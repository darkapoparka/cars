import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const CARWOW = path.join(CLIENT, 'carwow');
const MODERN = path.join(CLIENT, 'modern');
const MODERN_PUBLIC_DATA = path.join(
  MODERN,
  'apps',
  'web',
  'lib',
  'public-marketplace-data.ts'
);

const socialFiles = [
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

async function read(relative) {
  return fs.readFile(path.join(CARWOW, relative), 'utf8');
}

async function write(relative, content) {
  await fs.writeFile(path.join(CARWOW, relative), content.endsWith('\n') ? content : `${content}\n`, 'utf8');
}

for (const relative of socialFiles) {
  const before = await read(relative);
  let after = before;
  for (const [legacy, official] of replacements) after = after.replaceAll(legacy, official);
  for (const [, official] of replacements) {
    if (!after.includes(official)) throw new Error(`Missing official social URL in ${relative}: ${official}`);
  }
  if (after !== before) await write(relative, after);
}

await write('src/lib/data/daynight-videos.ts', `// IS AUTO's official website publishes Facebook and Instagram links, but no verified YouTube channel.\n// Keep the inherited template video surface empty instead of presenting another dealer's media.\nexport const youtubeChannelUrl: string | null = null;\nexport const homeVideos = [] as const;\n`);

const emptyVideoComponent = `<script lang="ts">\n\t// Intentionally empty: IS AUTO does not publish a verified YouTube channel.\n</script>\n`;
await write('src/lib/components/home/desktop/DesktopHomeVideos.svelte', emptyVideoComponent);
await write('src/lib/components/home/mobile/MobileHomeVideos.svelte', emptyVideoComponent);

let about = await read('src/lib/components/about/DesktopAboutPage.svelte');
about = about.replace("\timport { youtubeChannelUrl } from '$lib/data/daynight-videos';\n", '');
about = about.replace(/\n\t\t\t\t\t<a\s+href=\{youtubeChannelUrl\}[\s\S]*?<\/a\s*>/, '');
await write('src/lib/components/about/DesktopAboutPage.svelte', about);

let footer = await read('src/lib/components/layout/DesktopDealerFooter.svelte');
footer = footer.replace("\timport { youtubeChannelUrl } from '$lib/data/daynight-videos';\n", '');
footer = footer.replace(/\n\tconst youtubeLink = \{[\s\S]*?\n\t\} as const;\n/, '\n');
footer = footer.replace(/\n\t\t\t\t\t<a \{\.\.\.youtubeLink\}[\s\S]*?<\/a\s*>/, '');
await write('src/lib/components/layout/DesktopDealerFooter.svelte', footer);

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
await fs.writeFile(MODERN_PUBLIC_DATA, modernPublicData.endsWith('\n') ? modernPublicData : `${modernPublicData}\n`, 'utf8');

const modernTestImportFixes = [
  {
    relative: 'apps/web/lib/public-structured-data.test.ts',
    legacy: 'import { getMockListingBySlug } from "@repo/marketplace";',
    replacement: 'import { getMockListingBySlug } from "@repo/marketplace-domain/testing/mock-data";'
  },
  {
    relative: 'packages/marketplace-ui/lib/listing-truth.test.ts',
    legacy: 'import { getMockListingBySlug, type VehicleListing } from "@repo/marketplace";',
    replacement: 'import { getMockListingBySlug } from "@repo/marketplace-domain/testing/mock-data";\nimport type { VehicleListing } from "@repo/marketplace";'
  },
  {
    relative: 'packages/marketplace-ui/lib/vehicle-card-policy.test.ts',
    legacy: 'import { getMockListingBySlug, type VehicleListing } from "@repo/marketplace";',
    replacement: 'import { getMockListingBySlug } from "@repo/marketplace-domain/testing/mock-data";\nimport type { VehicleListing } from "@repo/marketplace";'
  }
];

for (const fix of modernTestImportFixes) {
  const target = path.join(MODERN, fix.relative);
  const before = await fs.readFile(target, 'utf8');
  const after = before.replace(fix.legacy, fix.replacement);
  if (!after.includes(fix.replacement)) {
    throw new Error(`Could not normalize Modern test import: ${fix.relative}`);
  }
  if (after !== before) await fs.writeFile(target, after, 'utf8');
}

const forbidden = [
  'daynight.auto.plovdiv',
  '61566304063141',
  'kristiankirilov1355',
  '6S3dLIgeAT8',
  'zG6rjLpT4u8',
  'w_XaGmIWJFM'
];

async function scan(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(target);
    else if (/\.(?:svelte|ts|js|mjs)$/.test(entry.name)) {
      const content = await fs.readFile(target, 'utf8');
      for (const value of forbidden) {
        if (content.includes(value)) throw new Error(`Inherited IS AUTO content remains in ${target}: ${value}`);
      }
    }
  }
}

await scan(path.join(CARWOW, 'src'));
console.log('IS AUTO content normalized; Modern mock lookup and test imports made deterministic.');
