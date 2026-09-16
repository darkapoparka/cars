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

const fragileMockImport = /import\s+\{[^}]*getMockListingBy(?:Id|Slug)[^}]*\}\s+from\s+["']\.\/mock-data["']/m;
for (const relative of [
  'packages/marketplace/mock-directory.ts',
  'packages/marketplace/directory.test.ts'
]) {
  const source = await fs.readFile(path.join(modern, relative), 'utf8');
  if (fragileMockImport.test(source)) {
    throw new Error(`Fragile Modern mock-data helper import remains in ${relative}.`);
  }
}

console.log('Retired Auto Best video assets removed; Modern mock lookups normalized.');
