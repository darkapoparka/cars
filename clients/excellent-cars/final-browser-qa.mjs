import fs from 'node:fs/promises';
import { chromium } from '../../templates/boxcar/node_modules/playwright/index.mjs';

const root = 'J:/cars/clients/excellent-cars';
const variant = process.argv[2];
const port = Number(process.argv[3]);
const ports = { 'auto-best': 6621, modern: 6622, carwow: 6623 };
const config = JSON.parse(await fs.readFile(`${root}/personalization.json`, 'utf8'));
const expectedPort = ports[variant];
if (!variant || !expectedPort || port !== expectedPort) {
  throw new Error(`Usage: final-browser-qa.mjs <auto-best|modern|carwow> <${Object.values(ports).join('|')}>`);
}

const base = `http://127.0.0.1:${port}`;
const outputDir = `${root}/qa/final/${variant}`;
await fs.mkdir(outputDir, { recursive: true });

const routeMap = {
  'auto-best': ['/', '/listing-grid', config.detailRoutes['auto-best'], '/contact', '/about-us', '/blog'],
  modern: ['/cars', config.detailRoutes.modern, '/bg/contact', '/bg/imports', '/bg/sell', '/bg/lease', '/bg/guides', '/bg/blog'],
  carwow: ['/', '/inventory', config.detailRoutes.carwow, '/contact', '/about', '/services', '/financing', '/sell-your-car', '/reviews', '/team']
};

const result = {
  schemaVersion: 1,
  variant,
  baseUrl: `${base}/`,
  generatedAt: new Date().toISOString(),
  widths: [390, 1440],
  routes: [],
  interactions: [],
  evidenceDirectory: `qa/final/${variant}`
};

function fileSafe(value) {
  return value.replace(/^\//, 'home').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'home';
}

async function settle(page, ms = 1400) {
  await page.waitForTimeout(ms);
  await page.evaluate(async () => {
    try {
      await document.fonts?.ready;
    } catch {}
  });
}

async function navigate(page, route) {
  let response = null;
  let navigationError = null;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      response = await page.goto(`${base}${route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 90000
      });
      await page.waitForSelector('body', { timeout: 30000 });
      navigationError = null;
      break;
    } catch (error) {
      navigationError = error instanceof Error ? error.message : String(error);
      if (attempt === 0) await page.waitForTimeout(1000);
    }
  }
  await settle(page);
  return { response, navigationError };
}

async function pageMetrics(page) {
  await page.evaluate(async () => {
    const scrollHeight = document.scrollingElement?.scrollHeight ?? document.body.scrollHeight;
    for (let y = 0; y < scrollHeight; y += 750) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(650);
  return page.evaluate(() => {
    const images = [...document.images]
      .filter((image) => image.getBoundingClientRect().width > 0)
      .map((image) => ({
        src: image.currentSrc || image.src,
        loaded: image.complete && image.naturalWidth > 0
      }));
    const identitySources = [
      document.body.innerText,
      document.title,
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      ...[...document.images].map((image) => image.alt)
    ].join('\n');
    return {
      url: location.href,
      title: document.title,
      text: document.body.innerText,
      identity: /Excellent Cars/i.test(identitySources),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      images,
      brokenImages: images.filter((image) => !image.loaded).map((image) => image.src)
    };
  });
}

async function routeSweep() {
  for (const width of [390, 1440]) {
    for (const [index, route] of routeMap[variant].entries()) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      const errors = [];
      const consoleErrors = [];
      const requestFailures = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('requestfailed', (request) => requestFailures.push(`${request.method()} ${request.url()} — ${request.failure()?.errorText ?? 'failed'}`));
      const navigation = await navigate(page, route);
      const metrics = await pageMetrics(page);
      const key = `${width}-${String(index).padStart(2, '0')}-${fileSafe(route)}`;
      let screenshot = null;
      if (index < 4) {
        screenshot = `qa/final/${variant}/${key}.png`;
        await page.screenshot({ path: `${root}/${screenshot}`, fullPage: true, timeout: 30000 });
      }
      result.routes.push({
        route,
        width,
        status: navigation.response?.status() ?? null,
        navigationError: navigation.navigationError,
        overflow: metrics.overflow,
        overflowPass: metrics.overflow <= 0,
        brokenImages: metrics.brokenImages,
        pageErrors: errors,
        consoleErrors,
        requestFailures,
        identity: metrics.identity,
        screenshot,
        pass:
          !navigation.navigationError &&
          navigation.response?.status() === 200 &&
          metrics.overflow <= 0 &&
          metrics.brokenImages.length === 0 &&
          errors.length === 0 &&
          consoleErrors.length === 0 &&
          true
      });
      await page.close();
    }
  }
}

async function firstVisible(locator) {
  const count = await locator.count();
  for (let index = 0; index < count; index += 1) {
    if (await locator.nth(index).isVisible().catch(() => false)) return locator.nth(index);
  }
  return null;
}

async function visibleCount(locator) {
  let count = 0;
  for (let index = 0; index < (await locator.count()); index += 1) {
    if (await locator.nth(index).isVisible().catch(() => false)) count += 1;
  }
  return count;
}

async function screenshot(page, name) {
  const relative = `qa/final/${variant}/${name}.png`;
  await page.screenshot({ path: `${root}/${relative}`, fullPage: false, timeout: 30000 });
  return relative;
}

async function autoInteractions(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const item = { width, errors: [], screenshots: [] };
  page.on('pageerror', (error) => item.errors.push(error.message));
  try {
    await navigate(page, '/');
    if (width === 390) {
      const trigger = await firstVisible(page.locator('button[aria-controls="dn-mobile-menu"]'));
      if (trigger) {
        await trigger.click();
        await page.waitForTimeout(350);
        item.menuOpened = (await trigger.getAttribute('aria-expanded')) === 'true';
        item.screenshots.push(await screenshot(page, `${width}-menu-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        item.menuEscapeDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true';
        if (!item.menuEscapeDismissed) {
          const close = await firstVisible(page.getByRole('button', { name: 'Затворете менюто', exact: true }));
          if (close) await close.click();
          await page.waitForTimeout(350);
        }
        item.menuDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true';
      }
    } else {
      const trigger = await firstVisible(page.locator('a[aria-controls^="dn-mega-"]'));
      if (trigger) {
        await trigger.hover();
        await page.waitForTimeout(250);
        item.menuOpened = (await trigger.getAttribute('aria-expanded')) === 'true';
        item.screenshots.push(await screenshot(page, `${width}-menu-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(350);
        item.menuDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true';
      }
    }

    await navigate(page, '/listing-grid');
    if (width === 390) {
      const trigger = await firstVisible(page.locator('button[aria-controls="dn-listing-filter-dialog"]'));
      if (trigger) {
        await trigger.click();
        const dialog = page.locator('#dn-listing-filter-dialog');
        await dialog.waitFor({ state: 'visible', timeout: 10000 });
        const input = await firstVisible(dialog.locator('input[name="q"]'));
        if (input) await input.fill('Cupra');
        item.filterOpened = await dialog.isVisible();
        item.screenshots.push(await screenshot(page, `${width}-filter-open`));
        const submit = await firstVisible(dialog.locator('button[type="submit"], .dn-listing-filter__dialog-submit'));
        if (submit) await submit.click();
        await page.waitForTimeout(900);
      }
    } else {
      const form = page.locator('#dn-desktop-discovery');
      const make = await firstVisible(form.locator('select[name="make"]'));
      if (make) await make.selectOption('Cupra');
      const submit = await firstVisible(form.getByRole('button', { name: 'Търси', exact: true }));
      if (submit) await submit.click();
      await page.waitForTimeout(700);
    }
    item.searchUrl = page.url();
    item.search = /Cupra/i.test(item.searchUrl) && /Cupra Born/i.test(await page.locator('body').innerText());
    item.screenshots.push(await screenshot(page, `${width}-search`));

    await navigate(page, config.detailRoutes['auto-best']);
    await page.waitForSelector('.dn-detail-gallery > img', { state: 'visible', timeout: 30000 });
    await page.waitForTimeout(1800);
    const photo = page.locator('.dn-detail-gallery > img').first();
    const before = await photo.getAttribute('src');
    const next = await firstVisible(page.getByRole('button', { name: 'Следваща снимка', exact: true }));
    let after = before;
    let attempts = 0;
    for (; next && attempts < 3 && after === before; attempts += 1) {
      await next.click({ force: true });
      await page.waitForTimeout(900);
      after = await photo.getAttribute('src');
    }
    item.gallery = { before, after, attempts, changed: Boolean(before && after && before !== after) };
    const descriptionTab = await firstVisible(page.getByRole('tab', { name: 'Описание', exact: true }));
    if (descriptionTab) {
      await descriptionTab.click();
      item.detailTab = /Excellent Cars/i.test(await page.locator('#detail-panel-description').innerText());
    }
    const enquiry = await firstVisible(page.getByRole('link', { name: 'Заявете оглед', exact: true }));
    if (enquiry) {
      await enquiry.click();
      await page.waitForTimeout(500);
      item.enquiryUrl = page.url();
      item.enquiry = /\/contact\?topic=inspection/.test(item.enquiryUrl) && (await visibleCount(page.locator('a[href="tel:+359895996559"]'))) > 0;
    }
    item.screenshots.push(await screenshot(page, `${width}-enquiry`));
  } catch (error) {
    item.error = error instanceof Error ? error.message : String(error);
  } finally {
    await page.close();
  }
  item.pass =
    item.errors.length === 0 &&
    item.menuDismissed === true &&
    item.search === true &&
    item.gallery?.changed === true &&
    item.detailTab === true &&
    item.enquiry === true;
  return item;
}

async function modernInteractions(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const item = { width, errors: [], screenshots: [] };
  page.on('pageerror', (error) => item.errors.push(error.message));
  try {
    await navigate(page, '/cars');
    if (width === 390) {
      const trigger = await firstVisible(page.locator('button[aria-controls="dealer-mobile-menu"]'));
      if (trigger) {
        await trigger.click();
        await page.waitForTimeout(450);
        item.menuOpened = (await trigger.getAttribute('aria-expanded')) === 'true';
        item.screenshots.push(await screenshot(page, `${width}-menu-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
        item.menuEscapeDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true';
        if (!item.menuEscapeDismissed) {
          const close = await firstVisible(page.getByRole('button', { name: 'Затвори менюто', exact: true }));
          if (close) await close.click();
          await page.waitForTimeout(350);
        }
        item.menuDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true';
      }
    }

    await navigate(page, '/cars');
    if (width === 390) {
      const filter = await firstVisible(page.locator('button[data-slot="mobile-discovery-filters"]'));
      if (filter) {
        await filter.click();
        await page.waitForTimeout(350);
        item.filterOpened = await visibleCount(page.getByRole('dialog')) > 0;
        item.screenshots.push(await screenshot(page, `${width}-filter-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        item.filterDismissed = await visibleCount(page.getByRole('dialog')) === 0;
      }
    }

    await navigate(page, '/cars');
    const searchTrigger = await firstVisible(page.getByRole('button', { name: /Търси \d+ автомобила|Отвори търсенето|Търсене на автомобили/ }));
    if (searchTrigger) await searchTrigger.click();
    await page.waitForTimeout(300);
    const input = await firstVisible(page.getByRole('searchbox'));
    if (input) {
      await input.fill('Cupra');
      item.screenshots.push(await screenshot(page, `${width}-search-open`));
      await input.press('Enter');
      await page.waitForTimeout(800);
      const suggestion = await firstVisible(page.getByRole('button', { name: 'Търси „Cupra“', exact: true }));
      if (suggestion) {
        await suggestion.click();
        await page.waitForTimeout(700);
      }
    }
    item.searchUrl = page.url();
    item.search = /[?&]q=Cupra/i.test(item.searchUrl) && /Cupra Born/i.test(await page.locator('body').innerText());

    const listing = await firstVisible(page.locator('a[href*="/listing/excellent-"]'));
    if (listing) {
      item.detailHref = await listing.getAttribute('href');
      await listing.click();
      await page.waitForTimeout(900);
      item.detailUrl = page.url();
      item.phoneEnquiry = (await page.locator('a[href="tel:+359895996559"]').count()) > 0;
      await page.goBack();
      await page.waitForTimeout(550);
      item.returnUrl = page.url();
      item.returnPreservesSearch = item.returnUrl === item.searchUrl;
    }

    await navigate(page, '/bg/contact');
    item.contact = /0895 996 559/.test(await page.locator('body').innerText());
    item.screenshots.push(await screenshot(page, `${width}-enquiry`));
  } catch (error) {
    item.error = error instanceof Error ? error.message : String(error);
  } finally {
    await page.close();
  }
  item.pass =
    item.errors.length === 0 &&
    item.menuDismissed === (width === 390 ? true : undefined) &&
    item.filterOpened === (width === 390 ? true : undefined) &&
    item.filterDismissed === (width === 390 ? true : undefined) &&
    item.search === true &&
    item.phoneEnquiry === true &&
    item.returnPreservesSearch === true &&
    item.contact === true;
  return item;
}

async function carwowInteractions(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const item = { width, errors: [], screenshots: [] };
  page.on('pageerror', (error) => item.errors.push(error.message));
  try {
    await navigate(page, '/');
    if (width === 390) {
      const trigger = await firstVisible(page.getByRole('button', { name: 'Меню', exact: true }));
      if (trigger) {
        await trigger.click();
        await page.waitForTimeout(400);
        item.menuOpened = (await trigger.getAttribute('aria-expanded')) === 'true';
        item.screenshots.push(await screenshot(page, `${width}-menu-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(550);
        item.menuEscapeDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true' && (await visibleCount(page.locator('.mobile-drawer[data-state="open"]'))) === 0;
        if (!item.menuEscapeDismissed) {
          const close = await firstVisible(page.getByRole('button', { name: 'Затвори', exact: true }));
          if (close) await close.click();
          await page.waitForTimeout(400);
        }
        item.menuDismissed = (await trigger.getAttribute('aria-expanded')) !== 'true' && (await visibleCount(page.locator('.mobile-drawer[data-state="open"]'))) === 0;
      }
    }

    await navigate(page, '/inventory');
    if (width === 390) {
      const filter = await firstVisible(page.getByRole('button', { name: 'Филтри', exact: true }));
      if (filter) {
        await filter.click();
        await page.waitForTimeout(350);
        item.filterOpened = await visibleCount(page.locator('.mobile-fullsheet')) > 0;
        item.screenshots.push(await screenshot(page, `${width}-filter-open`));
        await page.keyboard.press('Escape');
        await page.waitForTimeout(450);
        item.filterDismissed = await visibleCount(page.locator('.mobile-fullsheet')) === 0;
      }
      await navigate(page, '/inventory');
      const search = await firstVisible(page.locator('#mobile-inventory-search'));
      if (search) await search.click();
      await page.waitForTimeout(300);
      const input = await firstVisible(page.locator('#mobile-inventory-query'));
      if (input) {
        await input.fill('Cupra');
        item.screenshots.push(await screenshot(page, `${width}-search-open`));
        const apply = await firstVisible(page.locator('.mobile-filter-sheet__actions button.is-primary'));
        if (apply) await apply.click();
        await page.waitForTimeout(700);
      }
    } else {
      const search = await firstVisible(page.getByRole('button', { name: 'Търсене на автомобили', exact: true }));
      if (search) await search.click();
      await page.waitForTimeout(350);
      const dialog = page.locator('dialog.inventory-filter-dialog');
      const input = await firstVisible(dialog.locator('input[aria-label="Марка, модел или ключова дума"]'));
      if (input) {
        await input.fill('Cupra');
        item.screenshots.push(await screenshot(page, `${width}-search-open`));
        await input.press('Enter');
        await page.waitForTimeout(700);
      }
    }
    item.searchUrl = page.url();
    item.search = /Cupra/i.test(await page.locator('body').innerText()) && (/Cupra/i.test(item.searchUrl) || /Cupra Born/i.test(await page.locator('body').innerText()));

    await navigate(page, config.detailRoutes.carwow);
    item.detail = /Excellent Cars/i.test(await page.locator('body').innerText());
    item.phoneEnquiry = (await page.locator('a[href="tel:+359895996559"]').count()) > 0;
    item.inquiryControl = (await page.getByRole('button', { name: 'Изпрати запитване', exact: true }).count()) > 0;
    item.screenshots.push(await screenshot(page, `${width}-detail`));
    await navigate(page, '/contact');
    item.contact = /0895 996 559/.test(await page.locator('body').innerText());
    item.screenshots.push(await screenshot(page, `${width}-enquiry`));
  } catch (error) {
    item.error = error instanceof Error ? error.message : String(error);
  } finally {
    await page.close();
  }
  item.pass =
    item.errors.length === 0 &&
    item.menuDismissed === (width === 390 ? true : undefined) &&
    item.filterOpened === (width === 390 ? true : undefined) &&
    item.filterDismissed === (width === 390 ? true : undefined) &&
    item.search === true &&
    item.detail === true &&
    item.phoneEnquiry === true &&
    item.contact === true;
  return item;
}

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  await routeSweep();
  for (const width of [390, 1440]) {
    result.interactions.push(
      variant === 'auto-best'
        ? await autoInteractions(width)
        : variant === 'modern'
          ? await modernInteractions(width)
          : await carwowInteractions(width)
    );
  }
} finally {
  await browser.close();
}

result.routePass = result.routes.every((route) => route.pass);
result.interactionPass = result.interactions.every((interaction) => interaction.pass);
result.pass = result.routePass && result.interactionPass;
await fs.writeFile(`${outputDir}/results.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ variant, routePass: result.routePass, interactionPass: result.interactionPass, pass: result.pass, routeCount: result.routes.length, interactionCount: result.interactions.length }));
if (!result.pass) process.exitCode = 2;
