import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { translatedEnglishPatterns } from './locale-copy-audit.mjs';
import { clippedBudgetLabels, overflowingDockLabels, overflowingTabLabels } from './locale-visibility-audit.mjs';
const root = path.resolve(import.meta.dirname, '..');
const base = process.env.DEALER_BASE_URL || process.env.BASE_URL;
const out = process.env.LOCALE_QA_OUT || path.join(root, 'runtime/phase2/routes-' + Date.now());
if (!base) throw new Error('Set BASE_URL to the verified owned preview.');
const selected = process.env.LOCALE_QA_DESIGNS?.split(',') ?? ['auto-best'];
const widths = process.env.LOCALE_QA_WIDTHS?.split(',').map(Number) ?? [320, 390, 1440];
const locales = ['en', 'bg'];
const plans = {
  'auto-best': { mount: '', routes: ['/', '/listing-grid', '/listing-detail-v1/1', '/contact', '/contact?topic=trade-in', '/contact?topic=import', '/contact?topic=leasing', '/contact?topic=inspection', '/about-us', '/blog', '/blog-detail/1', '/locale-settings', '/missing-locale-qa-page'] },
  modern: { mount: '/variant-2', routes: ['/', '/cars', '/cars/bmw', '/listing/demo-audi-1', '/listing/demo-audi-1/contact', '/sell', '/imports', '/imports/china', '/lease', '/contact', '/motorbikes', '/vans', '/trucks', '/collections/chinese-ev-hybrids', '/guides', '/blog', '/legal/privacy', '/legal/terms', '/missing-locale-qa-page'] },
  carwow: { mount: '/variant-3', routes: ['/', '/inventory', '/inventory/map', '/inventory/audi-rs-6-avant-demo-1', '/sell-your-car', '/sell-your-car/request', '/contact', '/contact?intent=import', '/financing', '/calculator', '/compare', '/favorites', '/about', '/services', '/faq', '/blog', '/team', '/reviews', '/terms', '/presentation/home2', '/presentation/home3', '/missing-locale-qa-page'] }
};
fs.mkdirSync(out, { recursive: true });
const results = [];
const startedAt = new Date().toISOString();
const save = () => fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ startedAt, base, widths, locales, selected, scope: 'Explicit-locale route families, visible copy, metadata, overflow and runtime errors. Preferences and interactive states are tested separately.', results }, null, 2));
// Include every retained stock and editorial detail, not only the first sample.
const vehicleIds=[...fs.readFileSync(path.join(root,'src/lib/data/inventory.ts'),'utf8').matchAll(/\bid:\s*(\d+)/g)].map(m=>m[1]);
const articleIds=[...fs.readFileSync(path.join(root,'src/lib/data/editorial.ts'),'utf8').matchAll(/\bid:\s*(\d+)/g)].map(m=>m[1]);
plans['auto-best'].routes=[...new Set([...plans['auto-best'].routes,...vehicleIds.map(id=>'/listing-detail-v1/'+id),...articleIds.map(id=>'/blog-detail/'+id)])];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const normalized = text => text.replace(/\s+/g, ' ').trim();
try {
  for (const design of selected) {
    const plan = plans[design] ? { ...plans[design], mount: process.env.LOCALE_QA_MOUNT ?? plans[design].mount } : null; if (!plan) throw new Error('Unknown design: ' + design);
    const records = ['catalog', 'template', 'dealer'].flatMap(name => JSON.parse(fs.readFileSync(path.join(root, `localization/${name}.reviewed.json`), 'utf8')));
    const translatedEnglish = [...new Set(records.filter(record => record.disposition === 'translate' && record.en !== record.bg && !record.en.includes('{')).map(record => normalized(record.en)).filter(text => text.length >= 12 && /[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(text)))];
    const translatedPatterns = translatedEnglishPatterns(records);
    for (const locale of locales) for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: width >= 1000 ? 1000 : 844 }, locale: locale === 'en' ? 'bg-BG' : 'en-US', reducedMotion: 'reduce' });
      await context.addCookies([
        { name: 'cars_prompt', value: 'v1', url: base, httpOnly: true, sameSite: 'Lax' },
        { name: 'cars_locale', value: locale === 'en' ? 'bg' : 'en', url: base, httpOnly: true, sameSite: 'Lax' },
        { name: 'cars_country', value: 'DE', url: base, httpOnly: true, sameSite: 'Lax' }
      ]);
      const page = await context.newPage();
      let errors = [], consoleErrors = [], blockedWrites = [], blockedExternalReads = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', event => { if (event.type() === 'error') consoleErrors.push(event.text()); });
      await context.route('**/*', route => {
        const request = route.request();
        if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method())) {
          const target = new URL(request.url());
          const record = { method: request.method(), url: request.url() };
          // Google Maps calls this read RPC using POST. Block it in QA without misreporting a dealership write.
          if (target.hostname === 'maps.googleapis.com' && target.pathname.endsWith('/GetViewportInfo')) blockedExternalReads.push(record);
          else blockedWrites.push(record);
          return route.abort();
        }
        return route.continue();
      });
      const dynamicRoutes = [];
      const routes = [...plan.routes];
      const discoveredFamilies = new Set();
      for (const route of routes) {
        errors = []; consoleErrors = []; blockedWrites = []; blockedExternalReads = [];
        const requested = `${plan.mount}/${locale}${route === '/' ? '' : route}`;
        const name = `${design}-${locale}-${width}-${route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home'}`;
        try {
          const response = await page.goto(base + requested, { waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.waitForFunction(() => document.body.innerText.trim().length > 100, null, { timeout: 20000 });
          if (!route.includes('missing-locale-qa-page')) await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached', timeout: 20000 });
          await page.waitForTimeout(150);
          const evidence = await page.evaluate(({ locale, translatedEnglish, translatedPatterns }) => {
            const visible = element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden';
            const text = value => (value ?? '').replace(/\s+/g, ' ').trim();
            const display = [];
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              const parent = node.parentElement;
              if (parent && visible(parent) && !parent.closest('script,style,option,[lang=en]:not(html),[lang=bg]:not(html),nextjs-portal')) display.push(text(node.textContent));
            }
            for (const element of document.querySelectorAll('[aria-label],[placeholder],[title],[alt]')) if (visible(element) && !element.closest('[lang=en]:not(html),[lang=bg]:not(html)')) for (const attribute of ['aria-label', 'placeholder', 'title', 'alt']) if (element.hasAttribute(attribute)) display.push(text(element.getAttribute(attribute)));
            const title = document.title;
            const description = document.querySelector('meta[name=description]')?.getAttribute('content') ?? '';
            const allCopy = [title, description, ...display];
            const knownEnglish = new Set(translatedEnglish);
            const dynamicEnglish = translatedPatterns.map(pattern => new RegExp(pattern, 'u'));
            const wrongLanguage = [...new Set(allCopy.filter(value => locale === 'en' ? /[А-Яа-яЁё]/.test(value) : knownEnglish.has(value) || dynamicEnglish.some(pattern => pattern.test(value))))];
            const imageFailures = [...document.images].filter(image => /dealer-brand|\/brand\/.*logo|logo/.test(image.currentSrc || image.src) && visible(image) && image.complete && !image.naturalWidth).map(image => image.src);
            return {
              htmlLanguage: document.documentElement.lang, direction: document.documentElement.dir, title, description,
              canonical: document.querySelector('link[rel=canonical]')?.getAttribute('href') ?? null,
              alternates: [...document.querySelectorAll('link[rel=alternate][hreflang]')].map(link => ({ language: link.getAttribute('hreflang'), href: link.getAttribute('href') })),
              headings: [...document.querySelectorAll('h1,h2')].filter(visible).map(element => text(element.textContent)).slice(0, 12),
              wrongLanguage: wrongLanguage.slice(0, 35), imageFailures, horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
              dialogOpen: [...document.querySelectorAll('[data-locale-dialog][open]')].some(visible), hasDemoNotice: !!document.querySelector('[data-dealer-demo-notice]'),
              hasRuntimeOverlay: !!document.querySelector('vite-error-overlay,[data-nextjs-dialog-overlay]'),
              visibleText: document.body.innerText.slice(0, 24000),
              childRoutes: [...document.querySelectorAll('a[href]')].map(link => link.getAttribute('href')).filter(href => /\/(?:blog|guides|team)\/[^/?#]+/.test(href ?? '')).slice(0, 8)
            };
          }, { locale, translatedEnglish, translatedPatterns });
          const clippedBudgetText = await page.evaluate(clippedBudgetLabels);
          const dockOverflow = await page.evaluate(overflowingDockLabels);
          const tabOverflow = await page.evaluate(overflowingTabLabels);
          const issues = [];
          if (tabOverflow.length) issues.push('Overflowing tab labels: ' + JSON.stringify(tabOverflow));
          if (clippedBudgetText.length) issues.push('Clipped budget labels: ' + JSON.stringify(clippedBudgetText));
          if (dockOverflow.length) issues.push('Overlapping dock labels: ' + JSON.stringify(dockOverflow));
          const expectedStatus = route.includes('missing-locale-qa-page') ? 404 : 200;
          if (response?.status() !== expectedStatus) issues.push(`HTTP ${response?.status()} instead of ${expectedStatus}`);
          if (!new URL(page.url()).pathname.startsWith(`${plan.mount}/${locale}`)) issues.push('Locale/mount lost in navigation');
          if (evidence.htmlLanguage !== locale || evidence.direction !== 'ltr') issues.push('Incorrect document locale/direction');
          if (/\?{3,}/.test(evidence.visibleText)) issues.push("Garbled display text");
          if (evidence.wrongLanguage.length) issues.push('Untranslated or wrong-language copy');
          if (evidence.horizontalOverflow > 1) issues.push('Horizontal viewport overflow');
          if (evidence.imageFailures.length) issues.push('Broken approved logo');
          if (evidence.hasRuntimeOverlay || errors.length) issues.push('Runtime error');
          if (evidence.dialogOpen) issues.push('Dismissed first-visit prompt reopened');
          // The global demo banner was intentionally removed; write safety is verified by the server/HTTP suites and blockedWrites above.
          if (!evidence.title.trim()) issues.push('Missing page title');
          if (expectedStatus === 200 && !evidence.description.trim()) issues.push('Missing localized metadata description');
          if (blockedWrites.length) issues.push('Unexpected write attempt during public route navigation');
          if (!/private.*no-store/.test(response?.headers()['cache-control'] ?? '')) issues.push('Visitor-dependent HTML is not private/no-store');
          if (evidence.canonical && !new URL(evidence.canonical, base).pathname.startsWith(`${plan.mount}/${locale}`)) issues.push('Canonical URL lost mount or locale');
          const hydration = consoleErrors.filter(error => /hydrat|did not match|does not match|Minified React error #(418|419|423|425)/i.test(error));
          if (hydration.length) issues.push('Hydration disagreement');
          const screenshot = issues.length > 0 || /^(?:\/|\/sell|\/sell-your-car|\/imports|\/lease|\/financing|\/contact(?:\?.*)?)$/.test(route);
          if (screenshot) await page.screenshot({ path: path.join(out, name + '.png'), animations: 'disabled' });
          fs.writeFileSync(path.join(out, name + '.txt'), evidence.visibleText);
          const { visibleText, childRoutes, ...details } = evidence;
          for (const child of childRoutes) {
            const target = new URL(child, page.url());
            const family = target.pathname.match(/\/(blog|guides|team)\/[^/?#]+/)?.[1];
            if (target.origin !== new URL(base).origin || !target.pathname.startsWith(plan.mount + '/' + locale + '/') || !family || discoveredFamilies.has(family)) continue;
            discoveredFamilies.add(family);
            const next = target.pathname.slice((plan.mount + '/' + locale).length) + target.search;
            if (!routes.includes(next)) routes.push(next);
          }
          results.push({ name, design, locale, width, requested, finalUrl: page.url(), status: response?.status(), pass: issues.length === 0, issues, errors: [...errors], hydration, blockedWrites: [...blockedWrites], blockedExternalReads: [...blockedExternalReads], ...details });
          console.log(`${issues.length ? 'FAIL' : 'PASS'} ${name}${issues.length ? ': ' + issues.join('; ') : ''}`);
        } catch (error) {
          results.push({ name, design, locale, width, requested, pass: false, issues: [error.message], errors, blockedWrites });
          console.error('FAIL ' + name + ': ' + error.message);
        }
        save();
      }
      await context.close();
    }
  }
} finally { await browser.close(); save(); }
const summary = { out, checks: results.length, passed: results.filter(result => result.pass).length, failed: results.filter(result => !result.pass).length };
console.log(JSON.stringify(summary));
if (summary.failed) process.exitCode = 1;
