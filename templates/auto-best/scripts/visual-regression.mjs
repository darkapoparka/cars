import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { launchBrowser, previewUrl, isolateMapProvider } from './browser.mjs';

const mode = process.argv[2];
if (!['baseline', 'compare'].includes(mode)) throw new Error('Use baseline or compare. Baselines must precede source edits.');
const base = previewUrl();
const directory = path.resolve(process.env.VISUAL_DIR || 'artifacts/visual-regression');
const widths = [320, 390, 430, 768, 1024, 1440];
const routes = {
  home: '/', cars: '/listing-grid', detail: '/listing-detail-v1/1',
  contact: '/contact', sell: '/contact?topic=trade-in', import: '/contact?topic=import',
  leasing: '/contact?topic=leasing', about: '/about-us', blog: '/blog', article: '/blog-detail/1'
};
const manifestPath = path.join(directory, 'baseline.json');
if (mode === 'baseline') {
  try { const previous = JSON.parse(await readFile(manifestPath, 'utf8')); if (previous.complete || !process.argv.includes('--resume')) throw new Error('Baseline exists. Only an incomplete, unchanged-source capture can be resumed with --resume.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await mkdir(path.join(directory, mode), { recursive: true });
const browser = await launchBrowser();
const results = mode === 'baseline' && process.argv.includes('--resume') ? JSON.parse(await readFile(manifestPath, 'utf8')).results : [];
const context = await browser.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce', locale: 'bg-BG' });
const page = await context.newPage();
await isolateMapProvider(page);
page.setDefaultTimeout(60000);
async function settle() {
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 10000))]);
    for (const image of document.images) image.loading = 'eager';
    for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 25));
    }
    await Promise.race([Promise.all([...document.images].map(image => image.decode().catch(() => {}))), new Promise(resolve => setTimeout(resolve, 5000))]);
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(200);
}
const diffPage = await context.newPage();
async function comparePixels(before, after) {
  return diffPage.evaluate(async ([a, b]) => {
    async function decode(base64) {
      const image = new Image(); image.src = `data:image/png;base64,${base64}`; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      return { width: image.width, height: image.height, data: ctx.getImageData(0, 0, image.width, image.height).data };
    }
    const old = await decode(a), current = await decode(b);
    if (old.width !== current.width || old.height !== current.height) return { dimensionsMatch: false, before: [old.width, old.height], after: [current.width, current.height] };
    let changed = 0;
    for (let i = 0; i < old.data.length; i += 4) if ([0, 1, 2, 3].some(n => old.data[i + n] !== current.data[i + n])) changed++;
    return { dimensionsMatch: true, changedPixels: changed, totalPixels: old.width * old.height };
  }, [before.toString('base64'), after.toString('base64')]);
}
try {
  for (const width of widths) for (const [name, route] of Object.entries(routes)) {
    if (mode === 'baseline' && results.some(result => result.filename === `${width}-${name}.png`)) continue;
    await page.setViewportSize({ width, height: 900 });
    const errors = []; const onError = error => errors.push(error.message); page.on('pageerror', onError);
    const response = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle();
    const filename = `${width}-${name}.png`;
    const image = await page.screenshot({ path: path.join(directory, mode, filename), fullPage: true, animations: 'disabled', caret: 'hide', timeout: 120000 });
    const result = { width, route, filename, status: response.status(), errors };
    page.off('pageerror', onError);
    if (mode === 'compare') Object.assign(result, await comparePixels(await readFile(path.join(directory, 'baseline', filename)), image));
    results.push(result);
    await writeFile(path.join(directory, `${mode}.json`), JSON.stringify({ base, browser: browser.version(), mode, complete: false, results }, null, 2));
    console.log(filename, result.status, mode === 'compare' ? JSON.stringify({ dimensionsMatch: result.dimensionsMatch, changedPixels: result.changedPixels }) : 'captured');
  }
  const passed = results.every(r => r.status === 200 && r.errors.length === 0 && (mode === 'baseline' || r.dimensionsMatch && r.changedPixels === 0));
  await writeFile(path.join(directory, `${mode}.json`), JSON.stringify({ base, browser: browser.version(), mode, complete: true, passed, results }, null, 2));
  if (!passed) process.exitCode = 1;
} finally { await browser.close(); }
