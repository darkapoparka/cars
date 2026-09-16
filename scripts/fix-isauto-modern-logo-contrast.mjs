import fs from 'node:fs';
import path from 'node:path';

const target = path.join(
  process.cwd(),
  'clients',
  'isauto-varna',
  'modern',
  'packages',
  'marketplace',
  'lead-site.ts'
);

if (!fs.existsSync(target)) {
  throw new Error(`Missing IS AUTO Modern lead-site config: ${target}`);
}

const before = fs.readFileSync(target, 'utf8');
const darkPaths = [
  '/isauto/logo-dark.png',
  '/variant-2/isauto/logo-dark.png'
];
const lightPath = before.includes('/variant-2/isauto/')
  ? '/variant-2/isauto/logo-light.png'
  : '/isauto/logo-light.png';

let after = before;
for (const darkPath of darkPaths) {
  after = after.replaceAll(darkPath, lightPath);
}

if (!/logoPath:\s*["']\/(?:variant-2\/)?isauto\/logo-light\.png["']/.test(after)) {
  throw new Error('Modern dark header must reference the light IS AUTO raster wordmark.');
}
if (/logoPath:\s*["']\/(?:variant-2\/)?isauto\/logo-dark\.png["']/.test(after)) {
  throw new Error('Modern dark header still references the dark IS AUTO wordmark.');
}

if (after !== before) {
  fs.writeFileSync(target, after, 'utf8');
}

console.log('IS AUTO Modern dark header uses the light raster wordmark.');
