import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl(), out = 'artifacts/mobile-render-check';
await mkdir(out, { recursive: true });
const browser = await launchBrowser(), results = [];
try {
  for (const route of ['/', '/listing-grid', '/listing-detail-v1/1', '/contact?topic=trade-in', '/contact?topic=import', '/blog-detail/1']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      const targets = [...document.querySelectorAll('body *')].filter(node => node instanceof HTMLElement);
      const sizes = targets.map(node => [node, parseFloat(getComputedStyle(node).fontSize)]);
      for (const [node, size] of sizes) node.style.fontSize = `${size * 2}px`;
    });
    await page.waitForFunction(() => { const dock = document.querySelector('.dn-mobile-detail-bar, .dn-mobile-bottom-nav'); return !dock || Math.abs(parseFloat(document.body.style.getPropertyValue('--dn-active-dock-height')) - dock.getBoundingClientRect().height) < 1; });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.screenshot({ path: `${out}/text-200-${route.replace(/[^a-z0-9]/gi, '_')}.png` });
    results.push({ test: '200% computed-text stress test (not native OS text-size)', route, overflow, passed: overflow <= 1 });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
  await page.addInitScript(() => {
    window.__performance = { lcp: 0, cls: 0 };
    new PerformanceObserver(list => { for (const entry of list.getEntries()) window.__performance.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__performance.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  const performance = await page.evaluate(() => window.__performance);
  const imageBytes = await page.evaluate(() => performance.getEntriesByType('resource').filter(entry => entry.initiatorType === 'img').reduce((total, entry) => total + entry.transferSize, 0));
  await page.locator('.dn-quick-search__trigger').click();
  await page.locator('#dn-listing-filter-dialog:modal').waitFor();
  await page.screenshot({ path: `${out}/slow-network-search.png` });
  results.push({ test: 'Cold-cache local production at 1.6 Mbps / 150 ms; no CPU throttle', passed: true, imageBytes, performance });
  await page.close();
} finally {
  await browser.close();
  await writeFile(`${out}/report.json`, JSON.stringify({ generatedAt: new Date().toISOString(), base, results }, null, 2));
}
console.log(JSON.stringify(results, null, 2));
if (results.some(result => !result.passed)) process.exitCode = 1;
