import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const projects = [
  'cars-priselci',
  'cars-outletcarsvarna',
  'cars-promosalevarna',
  'cars-autolife',
  'cars-astracar',
  'cars-alhamooralthahabi',
  'cars-avangardauto',
  'cars-f1rstmotors',
  'cars-albasmamotors',
  'cars-elitautoimport',
  'cars-automarketvarna',
  'cars-eliqauto',
  'cars-kgteamauto',
  'cars-championautopro',
  'excellent-cars',
  'cars-perfectauto',
  'cars-asko96',
  'cars-texasdriveauto',
  'day-and-night-a',
  'cars-thedealerspoint',
  'cars-ivoauto',
  'cars-navaracar',
  'cars-legendauto',
  'cars-isautovarna'
];

const variants = [
  { key: 'auto-best', home: '/' },
  { key: 'modern', home: '/variant-2/cars' },
  { key: 'carwow', home: '/variant-3/' }
];

const viewports = [
  { key: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1 },
  { key: 'mobile', width: 390, height: 844, deviceScaleFactor: 1 }
];

const shard = Number.parseInt(process.argv[2] ?? '0', 10);
const shardCount = Number.parseInt(process.argv[3] ?? '1', 10);
if (!Number.isInteger(shard) || !Number.isInteger(shardCount) || shard < 0 || shard >= shardCount) {
  throw new Error(`Invalid shard ${shard}/${shardCount}`);
}

const selectedProjects = projects.filter((_, index) => index % shardCount === shard);
const outputRoot = path.resolve(`artifacts/logo-production-qa/shard-${shard}`);
await fs.mkdir(outputRoot, { recursive: true });

function absolutize(base, href) {
  try {
    const url = new URL(href, base);
    return url.origin === new URL(base).origin ? url.href : null;
  } catch {
    return null;
  }
}

async function settle(page) {
  await page.waitForLoadState('domcontentloaded', { timeout: 45_000 }).catch(() => {});
  await page.waitForLoadState('networkidle', { timeout: 12_000 }).catch(() => {});
  await page.waitForTimeout(1_000);
}

async function collectDiagnostics(page, viewportKey) {
  return page.evaluate((currentViewport) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };

    const allImages = [...document.images].filter(visible).map((img) => {
      const rect = img.getBoundingClientRect();
      const style = getComputedStyle(img);
      const parentStyle = img.parentElement ? getComputedStyle(img.parentElement) : null;
      const src = img.currentSrc || img.src || '';
      const alt = img.alt || '';
      const logoLike = /logo|wordmark|brand|lead-logo/i.test(`${src} ${alt} ${img.className}`);
      return {
        src,
        alt,
        className: String(img.className || ''),
        logoLike,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
        x: Math.round(rect.x * 100) / 100,
        y: Math.round(rect.y * 100) / 100,
        objectFit: style.objectFit,
        objectPosition: style.objectPosition,
        filter: style.filter,
        opacity: style.opacity,
        border: style.border,
        boxShadow: style.boxShadow,
        backgroundColor: style.backgroundColor,
        parentBackgroundColor: parentStyle?.backgroundColor ?? null,
        parentBorder: parentStyle?.border ?? null,
        parentBoxShadow: parentStyle?.boxShadow ?? null,
        extension: (() => {
          try { return new URL(src).pathname.split('.').pop()?.toLowerCase() ?? ''; }
          catch { return ''; }
        })(),
        likelyUpscaled: img.naturalWidth > 0 && rect.width > img.naturalWidth * 1.2,
        tiny: rect.width < 72 || rect.height < 20
      };
    });

    const anchors = [...document.querySelectorAll('a[href]')]
      .filter(visible)
      .map((a) => ({ href: a.href, text: (a.textContent || '').trim().replace(/\s+/g, ' ') }))
      .filter((item) => item.href.startsWith(location.origin));

    const logos = allImages.filter((img) => img.logoLike);
    return {
      viewport: currentViewport,
      url: location.href,
      title: document.title,
      lang: document.documentElement.lang,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      logos,
      allVisibleImageCount: allImages.length,
      anchors
    };
  }, viewportKey);
}

function chooseRoute(anchors, variantHome, kind) {
  const home = new URL(variantHome);
  const normalized = anchors
    .map((item) => ({ ...item, url: absolutize(home.href, item.href) }))
    .filter((item) => item.url)
    .filter((item) => new URL(item.url).origin === home.origin);

  const variantPrefix = home.pathname.startsWith('/variant-2')
    ? '/variant-2/'
    : home.pathname.startsWith('/variant-3')
      ? '/variant-3/'
      : '/';

  const scored = normalized.map((item) => {
    const haystack = `${new URL(item.url).pathname}${new URL(item.url).search} ${item.text}`.toLowerCase();
    let score = 0;
    if (new URL(item.url).pathname.startsWith(variantPrefix)) score += 4;
    if (kind === 'contact') {
      if (/contact|контакт/.test(haystack)) score += 12;
      if (/topic=/.test(haystack)) score -= 2;
    } else {
      if (/sell|trade-in|tradein|valuation|продай|продаж|бартер|оцен/.test(haystack)) score += 12;
      if (/topic=trade-in|topic=sell|topic=valuation/.test(haystack)) score += 8;
    }
    if (item.url === variantHome) score -= 20;
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.score > 4 ? scored[0].url : null;
}

async function openMobileDrawer(page) {
  const selectors = [
    'button[aria-controls*="menu" i]',
    'button[aria-label*="menu" i]',
    'button[aria-label*="меню" i]',
    'button:has-text("Меню")',
    'button:has-text("Menu")'
  ];
  for (const selector of selectors) {
    const candidates = page.locator(selector);
    const count = await candidates.count().catch(() => 0);
    for (let index = 0; index < Math.min(count, 8); index += 1) {
      const candidate = candidates.nth(index);
      if (!(await candidate.isVisible().catch(() => false))) continue;
      try {
        await candidate.click({ timeout: 3_000 });
        await page.waitForTimeout(500);
        return true;
      } catch {
      }
    }
  }
  return false;
}

const browser = await chromium.launch({ headless: true });
const records = [];

for (const project of selectedProjects) {
  const origin = `https://${project}.vercel.app`;
  for (const variant of variants) {
    const homeUrl = new URL(variant.home, origin).href;
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: viewport.deviceScaleFactor,
        reducedMotion: 'reduce',
        colorScheme: 'light',
        ignoreHTTPSErrors: false
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      const failedRequests = [];
      const errorResponses = [];
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(String(error)));
      page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), error: request.failure()?.errorText ?? 'unknown' }));
      page.on('response', (response) => {
        if (response.status() >= 400) errorResponses.push({ url: response.url(), status: response.status() });
      });

      const baseRecord = {
        project,
        origin,
        variant: variant.key,
        viewport: viewport.key,
        homeUrl,
        startedAt: new Date().toISOString(),
        pages: [],
        consoleErrors,
        pageErrors,
        failedRequests,
        errorResponses
      };

      try {
        const response = await page.goto(homeUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await settle(page);
        const homeDiagnostics = await collectDiagnostics(page, viewport.key);
        const contactUrl = chooseRoute(homeDiagnostics.anchors, homeUrl, 'contact');
        const sellUrl = chooseRoute(homeDiagnostics.anchors, homeUrl, 'sell');
        const routes = [
          { key: 'home', url: page.url() },
          ...(contactUrl ? [{ key: 'contact', url: contactUrl }] : []),
          ...(sellUrl && sellUrl !== contactUrl ? [{ key: 'sell', url: sellUrl }] : [])
        ];

        for (const route of routes) {
          if (route.key !== 'home') {
            await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => null);
            await settle(page);
          }
          const diagnostics = await collectDiagnostics(page, viewport.key);
          const screenshotName = `${project}__${variant.key}__${viewport.key}__${route.key}.jpg`;
          const screenshotPath = path.join(outputRoot, screenshotName);
          await page.screenshot({ path: screenshotPath, fullPage: true, type: 'jpeg', quality: 82 });
          baseRecord.pages.push({
            key: route.key,
            requestedUrl: route.url,
            finalUrl: page.url(),
            status: route.key === 'home' ? response?.status() ?? null : null,
            screenshot: screenshotName,
            diagnostics
          });
        }

        if (viewport.key === 'mobile') {
          await page.goto(homeUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 }).catch(() => null);
          await settle(page);
          const drawerOpened = await openMobileDrawer(page);
          if (drawerOpened) {
            const diagnostics = await collectDiagnostics(page, viewport.key);
            const screenshotName = `${project}__${variant.key}__${viewport.key}__drawer.jpg`;
            await page.screenshot({ path: path.join(outputRoot, screenshotName), fullPage: false, type: 'jpeg', quality: 88 });
            baseRecord.pages.push({
              key: 'drawer',
              requestedUrl: homeUrl,
              finalUrl: page.url(),
              status: null,
              screenshot: screenshotName,
              diagnostics
            });
          } else {
            baseRecord.pages.push({ key: 'drawer', requestedUrl: homeUrl, finalUrl: page.url(), status: null, screenshot: null, drawerOpened: false });
          }
        }
      } catch (error) {
        baseRecord.fatalError = String(error?.stack || error);
      } finally {
        baseRecord.finishedAt = new Date().toISOString();
        records.push(baseRecord);
        await context.close();
      }
    }
  }
}

await browser.close();

const report = {
  generatedAt: new Date().toISOString(),
  shard,
  shardCount,
  projects: selectedProjects,
  variants,
  viewports,
  records
};
await fs.writeFile(path.join(outputRoot, 'report.json'), JSON.stringify(report, null, 2));

const rows = records.flatMap((record) => record.pages.map((page) => {
  const logos = page.diagnostics?.logos ?? [];
  const flags = [
    page.diagnostics?.horizontalOverflow ? 'overflow' : '',
    logos.some((logo) => logo.extension === 'svg') ? 'svg-logo' : '',
    logos.some((logo) => logo.tiny) ? 'tiny-logo' : '',
    logos.some((logo) => logo.likelyUpscaled) ? 'upscaled-logo' : '',
    record.consoleErrors.length ? 'console-error' : '',
    record.pageErrors.length ? 'page-error' : '',
    record.failedRequests.length || record.errorResponses.length ? 'request-error' : ''
  ].filter(Boolean).join(', ');
  return `<tr><td>${record.project}</td><td>${record.variant}</td><td>${record.viewport}</td><td>${page.key}</td><td>${flags || 'none'}</td><td>${logos.map((logo) => `${logo.src} (${logo.width}×${logo.height}; ${logo.naturalWidth}×${logo.naturalHeight})`).join('<br>')}</td><td>${page.screenshot ? `<a href="${page.screenshot}"><img src="${page.screenshot}" loading="lazy" width="360"></a>` : 'not captured'}</td></tr>`;
})).join('\n');

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Logo production QA shard ${shard}</title><style>body{font:14px/1.45 system-ui,sans-serif;margin:24px;color:#171717}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ccc;padding:8px;vertical-align:top}th{position:sticky;top:0;background:#fff}img{height:auto;max-width:360px}td:nth-child(6){max-width:420px;word-break:break-all}</style></head><body><h1>Logo production QA — shard ${shard + 1}/${shardCount}</h1><p>Generated ${report.generatedAt}</p><table><thead><tr><th>Project</th><th>Variant</th><th>Viewport</th><th>Route</th><th>Automated flags</th><th>Visible logo diagnostics</th><th>Screenshot</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
await fs.writeFile(path.join(outputRoot, 'index.html'), html);
