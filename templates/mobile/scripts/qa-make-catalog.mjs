import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { carModelGroups, modelNodeKey } from '../.qa/domain/native-taxonomy.mjs';
const base = process.env.QA_URL || 'http://127.0.0.1:6425';
const out = process.env.QA_OUTPUT || 'reference/web/make-model/catalog';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 355, height: 709 } });
page.setDefaultTimeout(15000);
const report = [], errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text() + ' ' + message.location().url); });
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await page.goto(base + '/search', { waitUntil: 'networkidle', timeout: 90000 });
await page.locator('[data-hydrated="true"]').waitFor();
try {
  for (const [make, groups] of Object.entries(carModelGroups).filter(([make]) => make !== 'Any')) {
    const before = errors.length;
    try {
      await page.getByRole('button', { name: 'All Makes', exact: true }).click();
      await page.getByLabel('Search makes', { exact: true }).fill(make);
      await page.getByRole('dialog').getByRole('button', { name: make, exact: true }).first().click();
      await page.getByRole('dialog').getByRole('heading', { name: make, exact: true }).waitFor();
      const keys = await page.locator('[data-model-node]').evaluateAll(elements => elements.map(el => el.getAttribute('data-model-node')));
      assert.deepEqual(keys, groups.map(group => modelNodeKey(group, groups)), make + ' native order/identities');
      assert.equal(new Set(keys).size, keys.length, make + ' duplicate nodes');
      const metrics = await page.getByRole('dialog').evaluate(el => ({ scroll: el.scrollHeight - el.clientHeight, width: el.scrollWidth - el.clientWidth }));
      assert(metrics.scroll <= 1 && metrics.width <= 1, make + ' overflowing picker');
      if (groups.length) {
        const first = page.locator('[data-model-node]').first().getByRole('checkbox').first();
        await first.check(); await first.uncheck();
      }
      await page.getByRole('dialog').getByRole('button', { name: 'Cancel', exact: true }).click();
      assert.equal(errors.length, before, errors.slice(before).join('\n'));
      report.push({ make, models: groups.length, pass: true });
    } catch (error) {
      report.push({ make, pass: false, error: error.message, errors: errors.slice(before) });
      await page.screenshot({ path: out + '/failure-' + report.length + '.png' }).catch(() => {});
      await page.goto(base + '/search', { waitUntil: 'networkidle' });
    }
    await fs.writeFile(out + '/report.json', JSON.stringify({ at: new Date().toISOString(), base, report, errors }, null, 2));
    if (report.length % 20 === 0) console.log('MAKE_CATALOG', report.length, report.filter(item => !item.pass).length + ' failed');
  }
} finally { await browser.close(); }
console.log('MAKE_CATALOG_FINAL', report.filter(item => item.pass).length + '/' + report.length);
if (report.some(item => !item.pass) || errors.length) process.exitCode = 1;
