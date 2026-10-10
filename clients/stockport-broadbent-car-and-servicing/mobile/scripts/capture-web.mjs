import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const base = process.env.QA_URL || 'http://127.0.0.1:6424';
const out = path.resolve('reference/web/resume');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const context = await browser.newContext({
  viewport: { width: 427, height: 872 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push({ route: page.url(), error: e.message }));
const screens = [
  ['home', '/'],
  ['search', '/search'],
  ['sell', '/sell'],
  ['profile', '/profile'],
  ['park', '/car-park'],
  ['searches', '/my-searches'],
  ['results', '/results?makes=BMW'],
  ['detail', '/vehicle/bmw-x6'],
];
const report = [];
try {
  for (const [name, route] of screens) {
    const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
    await page.evaluate(() => document.fonts.ready);
    await sharp(await page.screenshot())
      .resize(427, 872)
      .png()
      .toFile(path.join(out, name + '.png'));
    const geometry = await page.evaluate(() => ({
      width: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      fonts: [...document.fonts].map((f) => ({
        family: f.family,
        weight: f.weight,
        status: f.status,
      })),
      brokenImages: [...document.images]
        .filter((i) => !i.complete || !i.naturalWidth)
        .map((i) => i.src),
    }));
    report.push({ name, route, status: response.status(), ...geometry });
    console.log(name, response.status(), JSON.stringify(geometry));
  }
} finally {
  await writeFile(
    path.join(out, 'capture-report.json'),
    JSON.stringify({ at: new Date().toISOString(), report, errors }, null, 2),
  );
  await browser.close();
}
if (errors.length || report.some((r) => r.status !== 200 || r.overflow || r.brokenImages.length))
  process.exitCode = 1;
