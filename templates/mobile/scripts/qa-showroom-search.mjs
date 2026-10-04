import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium, webkit } from 'playwright';

const base = process.env.QA_URL || 'http://127.0.0.1:6474';
const output = path.resolve(process.env.QA_OUTPUT || '../../runtime/mobile-showroom-search');
const engines = [
  ['chromium', chromium],
  ['webkit', webkit],
].filter(([name]) => !process.env.QA_ENGINE || process.env.QA_ENGINE === name);
assert.ok(engines.length, 'QA_ENGINE must be chromium or webkit');
await mkdir(output, { recursive: true });
const report = { at: new Date().toISOString(), base, checks: [], errors: [] };

for (const [engineName, engine] of engines) {
  const browser = await engine.launch({
    headless: true,
    ...(engineName === 'chromium' ? { channel: 'chrome' } : {}),
  });
  try {
    for (const locale of ['bg', 'en']) {
      const bg = locale === 'bg';
      const labels = {
        search: bg ? 'Търсене' : 'Search',
        make: bg ? 'Марка и модел' : 'Make & model',
        allBmw: bg ? 'BMW · Всички модели' : 'BMW · All models',
        back: bg ? 'Назад: Марки' : 'Back: Makes',
        modelSearch: bg ? 'Търсене на модел' : 'Search models',
        makeSearch: bg ? 'Търсене на марка' : 'Search makes',
        allMakes: bg ? 'Всички марки' : 'Any make',
        anyModel: bg ? 'Всички модели' : 'Any model',
        expandSeries: bg ? 'Разгъни 1 серия' : 'Expand 1 Series',
        series: bg ? '1 серия' : '1 Series',
        apply: bg ? /^Покажи \d+ кол/ : /^Show \d+ cars?$/,
        close: bg ? 'Затвори филтрите' : 'Close filters',
      };
      for (const width of [320, 390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 844 } });
        const page = await context.newPage();
        page.setDefaultTimeout(12000);
        page.on('pageerror', (error) =>
          report.errors.push({ engine: engineName, locale, width, message: error.message }),
        );
        page.on('console', (message) => {
          if (message.type() === 'error')
            report.errors.push({ engine: engineName, locale, width, message: message.text() });
        });
        try {
          const response = await page.goto(base + '/?lang=' + locale + '&filter=search');
          assert.equal(response.status(), 200);
          await page.locator('[data-hydrated="true"]').waitFor();
          await page.waitForFunction((value) => document.documentElement.lang === value, locale);
          await page.evaluate(() => document.fonts.ready);
          const suggestions = page.getByRole('button', {
            name: new RegExp('^' + labels.search + ': BMW '),
          });
          assert.equal(await suggestions.count(), 4);
          for (const suggestion of await suggestions.all()) {
            const arrow = suggestion.locator(':scope > span:last-child > span[aria-hidden="true"]');
            assert.equal(await arrow.count(), 1);
            assert.ok(await arrow.isVisible());
            assert.ok(
              await suggestion.evaluate((element) => element.scrollWidth <= element.clientWidth),
            );
          }
          await page.getByRole('button', { name: labels.search + ': BMW X6', exact: true }).click();
          assert.equal(await page.getByRole('searchbox').inputValue(), 'BMW X6');
          assert.equal(new URL(page.url()).searchParams.get('query'), null);
          await page.getByRole('button', { name: labels.apply }).click();
          await page.locator('dialog[open]').waitFor({ state: 'hidden' });
          assert.equal(new URL(page.url()).searchParams.get('query'), 'BMW X6');
          assert.equal(await page.locator('[data-showroom-vehicle]').count(), 1);

          await page.goto(base + '/?lang=' + locale + '&filter=make');
          await page.locator('[data-hydrated="true"]').waitFor();
          if (width < 700) {
            const bmw = page.getByRole('button', { name: 'BMW', exact: true });
            const allMakes = page.getByRole('button', { name: labels.allMakes, exact: true });
            const makeRows = page.locator('[data-make-option]');
            const rowLayout = await makeRows.evaluateAll((rows) =>
              rows.map((row) => {
                const button = row.querySelector('button');
                const logo = button.children[0].getBoundingClientRect();
                return {
                  border: getComputedStyle(row).borderBottomWidth,
                  buttonBorder: getComputedStyle(button).borderBottomWidth,
                  logoWidth: logo.width,
                  textLeft: button.children[1].getBoundingClientRect().left,
                  buttonHeight: button.getBoundingClientRect().height,
                };
              }),
            );
            assert.equal(rowLayout.length, 2);
            assert.ok(rowLayout.every((row) => row.border === '0px' && row.buttonBorder === '0px'));
            assert.ok(rowLayout.every((row) => row.logoWidth === 32 && row.buttonHeight >= 48));
            assert.equal(rowLayout[0].textLeft, rowLayout[1].textLeft);
            assert.equal(
              await allMakes
                .locator(':scope > span:last-child')
                .evaluate((element) => getComputedStyle(element).borderRadius),
              '50%',
            );
            // Tap row padding, outside the logo and text, to exercise the full hit target.
            await bmw.click({ position: { x: 2, y: 28 } });
            const allModels = page.getByRole('checkbox', { name: labels.allBmw, exact: true });
            await allModels.waitFor();
            assert.equal(await allModels.isChecked(), true);
            assert.equal(
              await allModels.evaluate((element) => getComputedStyle(element).borderRadius),
              '50%',
            );
            assert.ok(
              await page
                .locator('[data-showroom-model-options] [data-model-node]')
                .evaluateAll((rows) =>
                  rows.every((row) => getComputedStyle(row).borderBottomWidth === '0px'),
                ),
            );
            await allModels.press('Space');
            await page.getByRole('textbox', { name: labels.makeSearch, exact: true }).waitFor();
            assert.equal(await allModels.count(), 0);
            assert.equal(await bmw.evaluate((element) => element === document.activeElement), true);

            await bmw.click();
            const series = page.getByRole('checkbox', { name: labels.series, exact: true });
            await page.getByRole('button', { name: labels.expandSeries, exact: true }).click();
            assert.equal(await series.isChecked(), false);
            const model120 = page.getByRole('checkbox', { name: '120', exact: true });
            await page
              .locator('label')
              .filter({ has: model120 })
              .click({ position: { x: 16, y: 26 } });
            assert.equal(await model120.isChecked(), true);
            assert.equal(await series.evaluate((element) => element.indeterminate), true);
            await model120.press('Space');
            assert.equal(await model120.isChecked(), false);
            assert.equal(await series.evaluate((element) => element.indeterminate), false);
            await series.check();
            assert.equal(await allModels.isChecked(), false);
            await page.getByRole('textbox', { name: labels.modelSearch, exact: true }).fill('120');
            await page.getByRole('button', { name: labels.back, exact: true }).click();
            assert.equal(
              await page
                .getByRole('textbox', { name: labels.makeSearch, exact: true })
                .inputValue(),
              '',
            );
            await page.getByRole('button', { name: /^BMW/ }).first().click();
            assert.equal(
              await page
                .getByRole('textbox', { name: labels.modelSearch, exact: true })
                .inputValue(),
              '',
            );
            assert.equal(await series.isChecked(), true);
            await allModels.check();
            assert.equal(await series.isChecked(), false);
            await allModels.press('Space');
            await page.getByRole('button', { name: labels.apply }).click();
            await page.locator('dialog[open]').waitFor({ state: 'hidden' });
            assert.equal(new URL(page.url()).searchParams.get('makes'), null);
            assert.equal(new URL(page.url()).searchParams.get('makeModels'), null);
          } else {
            await page.getByRole('checkbox', { name: 'BMW', exact: true }).check();
            const allModels = page.getByRole('checkbox', { name: labels.anyModel, exact: true });
            await allModels.waitFor();
            assert.equal(
              await allModels.evaluate((element) => getComputedStyle(element).borderRadius),
              '5px',
            );
            await page.getByRole('button', { name: labels.close, exact: true }).click();
          }
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
            true,
          );
          report.checks.push({
            engine: engineName,
            locale,
            width,
            description:
              width < 700
                ? 'Search draft/apply, aligned borderless make rows, full-row taps, circular native checkboxes, mixed selection and brand back navigation'
                : 'Desktop search draft/apply and preserved square model checkboxes',
          });
        } finally {
          await context.close();
        }
      }
    }
  } catch (error) {
    report.errors.push({ engine: engineName, message: error.stack || String(error) });
  } finally {
    await browser.close();
  }
}

report.passed = report.errors.length === 0 && report.checks.length === engines.length * 6;
await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
