import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
// Display-sized derivatives of the approved artwork. Keep the PNG masters intact.
const assets = [
  ['branding/showroom-placeholder-20261002.png', 384],
  ['branding/showroom-compact-20261005.png', 448],
  ...['car', 'motorbike', 'ebike', 'motorhome', 'truck'].map((category) => [
    `categories/${category}-realistic-20261003-v1.png`,
    256,
  ]),
];

const report = [];
for (const [source, width] of assets) {
  const target = source.replace(/\.png$/, '.webp');
  const original = path.join(root, 'public', source);
  const destination = path.join(root, 'public', target);
  await mkdir(path.dirname(destination), { recursive: true });
  await sharp(original)
    .resize({ width, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(destination);
  report.push({
    source,
    target,
    width,
    before: (await stat(original)).size,
    after: (await stat(destination)).size,
  });
}
console.log(JSON.stringify(report, null, 2));
