import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = JSON.parse(await readFile(path.join(root, 'src/lib/server/pages.json'), 'utf8'));
const captures = path.resolve(root, '../../runtime/karento-qa');
const rows = [];
for (const width of [1440, 390, 320]) {
  for (const route of Object.keys(pages).sort()) {
    const a = await sharp(path.join(captures, `reference-${route}-${width}.jpg`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const b = await sharp(path.join(captures, `clone-${route}-${width}.jpg`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    if (a.info.width !== b.info.width || a.info.height !== b.info.height) throw new Error(`Screenshot dimensions differ: ${route} ${width}`);
    const changed = pixelmatch(a.data, b.data, null, a.info.width, a.info.height, { threshold: 0.15 });
    rows.push({ route, viewportWidth: width, screenshotWidth: a.info.width, screenshotHeight: a.info.height, differentPercent: 100 * changed / (a.info.width * a.info.height) });
  }
}
const report = {
  checkedAt: new Date().toISOString(),
  source: 'https://carento-demo.vercel.app/',
  clone: 'http://127.0.0.1:6462',
  scope: 'First viewport of every available HTML page at 1440, 390 and 320 px, after vendor initialization and preloader dismissal. Full-page DOM geometry was also inspected during capture. Screenshots are JPEG; font antialiasing and running chart/carousel animations may differ.',
  threshold: 0.15,
  comparisons: rows,
  summary: {
    comparisons: rows.length,
    underOnePercent: rows.filter(row => row.differentPercent < 1).length,
    largestDifferences: [...rows].sort((a, b) => b.differentPercent - a.differentPercent).slice(0, 8)
  }
};
await writeFile(path.resolve(root, '../../docs/karento/visual-comparison.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report.summary, null, 2));
