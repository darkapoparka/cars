import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const client = path.join(root, 'clients', 'isauto-varna');
const autoBest = path.join(client, 'auto-best');
const modern = path.join(client, 'modern');
const retiredVideoAssets = [
  'static/assets/images/lead/day-night-video-g-class.jpg',
  'static/assets/images/lead/day-night-video-panamera.jpg',
  'static/assets/images/lead/day-night-video-urus.jpg'
];

for (const relative of retiredVideoAssets) {
  await fs.rm(path.join(autoBest, relative), { force: true });
}

const videosDataPath = path.join(autoBest, 'src', 'lib', 'data', 'videos.ts');
const videosData = await fs.readFile(videosDataPath, 'utf8');
if (
  !videosData.includes('export const featuredVideos: readonly FeaturedVideo[] = [];') ||
  /6S3dLIgeAT8|zG6rjLpT4u8|w_XaGmIWJFM|Най-желаната кола в България|Продадох най-новата Панамера|Каква е разликата в G-класите/.test(videosData)
) {
  throw new Error('Unverified inherited Auto Best video data remains in the IS AUTO build.');
}

const videoSectionPath = path.join(
  autoBest,
  'src',
  'lib',
  'components',
  'home',
  'VideoSection.svelte'
);
const videoSection = await fs.readFile(videoSectionPath, 'utf8');
if (/featuredVideos|<iframe|dn-videos/.test(videoSection)) {
  throw new Error('The inherited Auto Best video surface is still rendered for IS AUTO.');
}

const assetCheckPath = path.join(autoBest, 'scripts', 'check-assets.mjs');
const before = await fs.readFile(assetCheckPath, 'utf8');
const after = before.replace(
  'const guardedMediaCount = 104;',
  'const guardedMediaCount = 101;'
);

if (!after.includes('const guardedMediaCount = 101;')) {
  throw new Error('Could not set the IS AUTO Auto Best guarded media count to 101.');
}

await fs.writeFile(assetCheckPath, after, 'utf8');

for (const relative of retiredVideoAssets) {
  try {
    await fs.access(path.join(autoBest, relative));
    throw new Error(`Retired inherited video asset still exists: ${relative}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const mockDirectoryPath = path.join(
  modern,
  'packages',
  'marketplace',
  'mock-directory.ts'
);
let mockDirectory = await fs.readFile(mockDirectoryPath, 'utf8');
mockDirectory = mockDirectory.replace(
  'import { getMockListingById } from "./mock-data";',
  'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";'
);
mockDirectory = mockDirectory.replace(
  'const listing = getMockListingById(listingId);',
  'const listing = mockListings.find((entry) => entry.id === listingId);'
);
if (
  !mockDirectory.includes('import { mockListings } from "@repo/marketplace-domain/testing/mock-data";') ||
  mockDirectory.includes('getMockListingById')
) {
  throw new Error('Could not normalize the Modern mock directory listing lookup.');
}
await fs.writeFile(mockDirectoryPath, mockDirectory, 'utf8');

const directoryTestPath = path.join(
  modern,
  'packages',
  'marketplace',
  'directory.test.ts'
);
let directoryTest = await fs.readFile(directoryTestPath, 'utf8');
directoryTest = directoryTest.replace(
  'import { getMockListingById } from "./mock-data";',
  'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";'
);
directoryTest = directoryTest.replace(
  'const listing = getMockListingById(preview.id);',
  'const listing = mockListings.find((entry) => entry.id === preview.id);'
);
if (
  !directoryTest.includes('import { mockListings } from "@repo/marketplace-domain/testing/mock-data";') ||
  directoryTest.includes('getMockListingById')
) {
  throw new Error('Could not normalize the Modern directory test listing lookup.');
}
await fs.writeFile(directoryTestPath, directoryTest, 'utf8');

for (const relative of [
  'packages/marketplace-ui/lib/inventory-search-suggestions.test.ts',
  'packages/marketplace-ui/lib/vehicle-card-view-policy.test.ts'
]) {
  const target = path.join(modern, relative);
  const source = await fs.readFile(target, 'utf8');
  const normalized = source.replace(
    'import { mockListings } from "@repo/marketplace";',
    'import { mockListings } from "@repo/marketplace-domain/testing/mock-data";'
  );
  if (!normalized.includes('import { mockListings } from "@repo/marketplace-domain/testing/mock-data";')) {
    throw new Error(`Could not normalize the Modern mock listing import in ${relative}.`);
  }
  await fs.writeFile(target, normalized, 'utf8');
}

// Keep getMockRelatedListings on the marketplace public API. Moving it to the
// testing subpath breaks the Next.js production build because that subpath is
// intentionally not a stable application import boundary.
const forbiddenMockImportPatterns = [
  /import\s+\{[^}]*\bgetMockListingById\b[^}]*\}\s+from\s+["']@repo\/marketplace["']/s,
  /import\s+\{[^}]*\bgetMockListingById\b[^}]*\}\s+from\s+["']\.\/mock-data["']/s
];

async function assertNoFragileMockImports(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await assertNoFragileMockImports(target);
      continue;
    }
    if (!/\.(?:ts|tsx|mts|cts)$/.test(entry.name)) continue;
    const source = await fs.readFile(target, 'utf8');
    for (const pattern of forbiddenMockImportPatterns) {
      if (pattern.test(source)) {
        throw new Error(`Fragile Modern mock listing lookup remains in ${target}.`);
      }
    }
  }
}

await assertNoFragileMockImports(modern);

console.log('Retired Auto Best video assets and UI removed; targeted Modern mock lookups normalized.');
