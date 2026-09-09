import assert from 'node:assert/strict';
import { launchBrowser, previewUrl } from './browser.mjs';
import { smokeReport } from './smoke-report.mjs';

const base = previewUrl();
const output = 'artifacts/route-smoke';
const suite = await smokeReport(output, base);
const browser = await launchBrowser();
const core = ['/', '/listing-grid', '/about-us', '/blog', '/contact', ...['inspection', 'leasing', 'trade-in', 'import'].map(topic => `/contact?topic=${topic}`)];
const invalid = ['/listing-detail-v1/999', '/listing-detail-v1/01', '/blog-detail/999', '/missing-page'];
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const details = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname).filter(path => /\/\d+$/.test(path));
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
    for (const route of [...core, ...details, '/listing-grid?q=no-match-xyz', '/blog?q=no-match-xyz', ...invalid]) {
      await suite.check(`${width} ${route}`, async () => {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const failedAssets = [];
        page.on('response', response => { if (response.status() >= 400 && /\.(webp|png|jpg|css|js|woff2)(\?|$)/.test(response.url()) && response.url().startsWith(base)) failedAssets.push(response.url()); });
        try {
          const response = await page.goto(base + route, { waitUntil: 'networkidle' });
          assert.equal(response.status(), invalid.includes(route) ? 404 : 200);
          await page.evaluate(() => document.fonts.ready);
          // Warm lazy content, then check the entire rendered document.
          for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 750) { await page.evaluate(y => scrollTo(0, y), y); await page.waitForTimeout(35); }
          await page.waitForTimeout(150);
          const geometry = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - innerWidth,
            broken: [...document.images].filter(image => image.getBoundingClientRect().width > 0 && image.complete && !image.naturalWidth).map(image => image.currentSrc),
            headings: document.querySelectorAll('main h1').length,
            main: document.querySelectorAll('main').length,
            dock: !!document.querySelector('.dn-mobile-detail-bar'),
            token: getComputedStyle(document.documentElement).getPropertyValue('--dn-focus').trim()
          }));
          assert(geometry.overflow <= 1, 'Page must not overflow horizontally');
          assert.deepEqual(geometry.broken, []); assert.deepEqual(errors, []); assert.deepEqual(failedAssets, []);
          assert.equal(geometry.main, 1); assert(geometry.headings >= 1); assert(geometry.token);
          assert.equal(geometry.dock, route.startsWith('/listing-detail-v1/') && !invalid.includes(route));
          if (route === '/about-us') assert.equal(await page.locator('[data-demo-content]').count(), 0);
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: `${output}/${width}-${route.replace(/[^a-z0-9]/gi, '_') || 'home'}.png` });
          return geometry;
        } finally { await page.close(); }
      });
    }
    await context.close();
  }
  for (const [width, height] of [[320,677],[430,932],[768,900],[991,900],[992,900],[1024,900],[1920,1080],[844,390]]) {
    await suite.check(`responsive ${width}x${height}`, async () => {
      const page = await browser.newPage({ viewport: { width, height } });
      try {
        for (const route of ['/', '/listing-grid', '/listing-detail-v1/4', '/blog-detail/1', '/about-us', '/contact?topic=leasing&vehicle=4']) {
          await page.goto(base + route, { waitUntil: 'networkidle' });
          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route}: overflow`);
        }
      } finally { await page.close(); }
    });
  }
} finally { await browser.close(); await suite.finish(); }
