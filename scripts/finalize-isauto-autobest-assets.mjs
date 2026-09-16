import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const autoBest = path.join(root, 'clients', 'isauto-varna', 'auto-best');
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

console.log('Retired Auto Best video assets removed; asset guard normalized to 101 files.');
