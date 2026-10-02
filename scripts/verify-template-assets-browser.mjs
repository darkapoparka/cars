import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import { createRequire } from 'node:module';
if (process.argv.includes('--help')) { console.log('Usage: node scripts/verify-template-assets-browser.mjs carwow|auto-best|import|modern|app http://127.0.0.1:PORT TEMPLATE-ROOT NEW-REPORT-DIRECTORY [RETAINED-PUBLIC-INDEX.json]'); process.exit(0); }
const [family, origin, root, reportDirectory, publicIndexFile] = process.argv.slice(2);
if (!root || !reportDirectory) throw Error('Explicit template and report directories are required');
const outputDirectory = path.resolve(reportDirectory);
const reportRelative = path.relative(path.resolve(root), outputDirectory);
if (!reportRelative || (reportRelative !== '..' && !reportRelative.startsWith('..' + path.sep) && !path.isAbsolute(reportRelative))) throw Error('Report output must be outside template sources');
if (fs.existsSync(outputDirectory)) throw Error('Report directory already exists');
fs.mkdirSync(path.dirname(outputDirectory), { recursive: true });
fs.mkdirSync(outputDirectory);
if (!['carwow', 'auto-best', 'import', 'modern', 'app'].includes(family) || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) throw Error('Explicit local template required');
const require = createRequire(path.join(path.resolve(root), 'package.json'));
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = createRequire(path.resolve(import.meta.dirname, '../templates/carwow/package.json'))('playwright')); }
const next = family === 'modern' || family === 'app';
const base = family === 'modern' ? '/variant-2' : family === 'app' ? '/variant-4' : '';
const publicIndex = publicIndexFile ? JSON.parse(fs.readFileSync(publicIndexFile,'utf8')) : null;
if(next && !publicIndex) throw Error('Next checks require the exact retained public index');
const sharedMessages = JSON.parse(fs.readFileSync(new URL('./publishing/switcher-messages.json',import.meta.url),'utf8'));
const mountConfig = {language:'en',labels:sharedMessages.en,localization:{defaultLocale:'en',enabledLocales:['en','bg'],messages:sharedMessages},variants:[{key:'auto-best',base:'',entry:'/'},{key:'modern',base:'/variant-2',entry:'/variant-2/cars'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'},{key:'app',base:'/variant-4',entry:'/variant-4/'}]};
const rootSwitcher = next ? fs.readFileSync(new URL('./publishing/preview-switcher.js',import.meta.url),'utf8').replace('__CARS_SWITCHER_CONFIG__',()=>JSON.stringify(mountConfig)) : null;
const browser = await chromium.launch({ headless: true });
const source = path.join(root, next ? 'public' : 'static');
const published = path.join(root, '.vercel/output/static');
const routes = family === 'modern' ? ['/', '/cars', '/contact', '/imports', '/sell', '/lease', '/guides']
  : family === 'app' ? ['/', '/cars', '/search', '/saved', '/finance', '/sell', '/service', '/stores', '/more']
  : family === 'auto-best' ? ['/', '/listing-grid', '/about-us', '/contact', '/blog']
  : ['/', '/inventory', '/about', '/contact', '/sell-your-car', '/financing', '/services', '/compare', '/blog'];
const report = { family, origin, productionBuild: true, publishedAssetsEnforced: true, rootSwitcherFixture: next, method: publicIndex ? "Production Next build with exact retained public index enforced" : "Production build with actual Vercel adapter output enforced", cases: [], passed: false };
const output = path.join(outputDirectory, family + '-retention-browser.json');
function save() { fs.writeFileSync(output, JSON.stringify(report, null, 2)); }
const mime = { '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
try {
  for (const width of [320, 390, 1440]) for (const locale of ['bg', 'en']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, locale: 'en-US' });
    let served = 0; const failures = [], errors = [];
    await context.route('**/*', async route => {
      const request = route.request(), url = new URL(request.url());
      if (rootSwitcher && url.origin === origin && url.pathname === '/preview-switcher.js') return route.fulfill({status:200,contentType:'text/javascript',body:rootSwitcher});
      if (!['GET', 'HEAD'].includes(request.method()) && url.origin !== origin) return route.abort();
      if (url.origin !== origin) return route.continue();
      const localPath = base && url.pathname.startsWith(base + '/') ? url.pathname.slice(base.length) : url.pathname;
      const relative = decodeURIComponent(localPath).replace(/^\//, '');
      if (relative.split('/').includes('..')) return route.abort();
      const original = path.join(source, relative), actual = path.join(published, relative);
      if (!fs.existsSync(original) && !fs.existsSync(actual)) return route.continue();
      if (fs.existsSync(original) && !fs.statSync(original).isFile()) return route.continue();
      served++;
      if (publicIndex && fs.existsSync(original)) {
        const entry = publicIndex[relative];
        if (!entry) { failures.push({path:relative,reason:"omitted-public-asset-requested"}); return route.fulfill({status:404,body:"Omitted public asset"}); }
        const bytes=fs.readFileSync(original);
        if(createHash("sha256").update(bytes).digest("hex")!==entry.sha256) throw Error("Public source changed during browser verification");
        return route.fulfill({status:200,contentType:mime[path.extname(original)]??"application/octet-stream",body:bytes});
      }
      if (!fs.existsSync(actual)) { failures.push({ path: relative, reason: 'missing-from-published-output' }); return route.fulfill({ status: 404, body: 'Missing published asset' }); }
      return route.fulfill({ status: 200, contentType: mime[path.extname(actual)] ?? 'application/octet-stream', body: fs.readFileSync(actual) });
    });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) failures.push({ url: response.url(), status: response.status() }); });
    const dismiss = async () => {
      const button = page.getByRole('button', { name: /^(Не сега|Not now)$/i });
      if (await button.count() && await button.first().isVisible()) await button.first().click();
    };
    for (const route of routes) {
      const fromFailure = failures.length, fromError = errors.length;
      const item = { width, locale, route, passed: false };
      try {
        const response = await page.goto(origin + base + '/' + locale + (route === '/' ? '' : route), { waitUntil: 'networkidle', timeout: 45000 });
        item.status = response.status(); assert.equal(item.status, 200);
        await page.waitForTimeout(300); await dismiss();
        for (let scroll = 0; scroll < 5; scroll++) { await page.evaluate(() => scrollBy(0, 700)); await page.waitForTimeout(180); }
        await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(250);
        item.layout = await page.evaluate(() => ({ lang: document.documentElement.lang,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          broken: [...document.images].filter(i => i.getBoundingClientRect().width > 0 && i.getBoundingClientRect().height > 0 && i.getBoundingClientRect().left < innerWidth && i.getBoundingClientRect().right > 0 && i.getBoundingClientRect().top < innerHeight && i.getBoundingClientRect().bottom > 0 && !i.naturalWidth).map(i => i.currentSrc),
          bodyLength: document.body.innerText.length, headings: [...document.querySelectorAll("h1,h2")].map(h => h.textContent?.trim()).filter(Boolean) }));
        assert.equal(item.layout.lang, locale); assert.equal(item.layout.overflow, false);
        assert.deepEqual(item.layout.broken, []); assert.ok(item.layout.bodyLength > 0); assert.ok(item.layout.headings.length > 0, "Rendered page heading required");
        if (width === 390 && locale === 'bg' && ['/', '/inventory', '/listing-grid', '/cars'].includes(route))
          await page.screenshot({ path: path.join(outputDirectory, `${family}-trimmed-${route === '/' ? 'home' : 'inventory'}.png`) });
        if (route === '/inventory' || route === '/listing-grid' || route === '/cars') {
          const choice = await page.locator('a[href]:visible').evaluateAll((items, family) => items.map(a => ({ href: a.getAttribute('href'), url: a.href })).find(a => (family === 'modern' ? /\/listing\/[^/?]+/ : family === 'app' ? /\/cars\/[^/?]+/ : /\/(?:inventory|listing-detail-v1)\/[^/?]+/).test(new URL(a.url).pathname)), family);
          assert.ok(choice, 'Actual vehicle link is required');
          await page.locator('a[href=' + JSON.stringify(choice.href) + ']:visible').first().click();
          await page.waitForURL(choice.url, { timeout: 15000 }); await page.waitForTimeout(500);
          const reload = await page.reload({ waitUntil: 'networkidle' }); assert.equal(reload.status(), 200);
          item.detail = page.url(); await page.goBack({ waitUntil: 'networkidle' });
          assert.ok(new URL(page.url()).pathname.endsWith(route));
        }
        item.failures = failures.slice(fromFailure); item.errors = errors.slice(fromError);
        assert.deepEqual(item.failures, []); assert.deepEqual(item.errors, []);
        item.passed = true;
      } catch (error) { item.error = error.message; item.failures = failures.slice(fromFailure); item.errors = errors.slice(fromError); }
      report.cases.push(item); save();
      console.log(JSON.stringify({ family, width, locale, route, passed: item.passed, error: item.error, failures: item.failures?.length }));
    }
    report.servedAssetRequests = (report.servedAssetRequests ?? 0) + served;
    await context.close();
  }
  report.passed = report.cases.every(item => item.passed);
  report.completedAt = new Date().toISOString(); save();
  if (!report.passed) process.exitCode = 1;
} finally { await browser.close(); }
