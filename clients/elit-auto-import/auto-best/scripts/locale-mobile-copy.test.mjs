import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compileCatalog } from './locale-catalog.mjs';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const common = JSON.parse(read('localization/common.json'));
const rows = ['catalog', 'template', 'dealer'].flatMap(name => JSON.parse(read(`localization/${name}.reviewed.json`)));
const catalog = compileCatalog(common, rows);

test('compact import controls retain complete native EN/BG copy', () => {
  const expected = {
    'action.importShort': ['Import', 'Внос'],
    'action.requestImport': ['Request import', 'Заяви внос'],
    'action.requestValuation': ['Request valuation', 'Заяви оценка'],
    m_0dc54277231e: ['Import guide (demo)', 'За вноса (демо)'],
    m_15f4f5be4ade: ['How it works', 'Как работи'],
    m_ed51f4a53cda: ['Back to enquiry', 'Към запитването']
  };
  for (const [key, pair] of Object.entries(expected)) {
    assert.deepEqual([catalog.en[key], catalog.bg[key]], pair, key);
    assert.ok(!/[\u0400-\u04ff]/u.test(catalog.en[key]), `${key}: English copy`);
  }
});

test('primary actions use direct native keys while demo copy stays descriptive', () => {
  const guide = read('src/lib/components/company/ImportHowItWorks.svelte');
  for (const key of ['m_0dc54277231e', 'm_15f4f5be4ade', 'm_ed51f4a53cda'])
    assert.ok(guide.includes(`i18n.t("${key}")`), key);
  assert.ok(read('src/lib/components/home/SearchBox.svelte').includes('i18n.t("action.importShort")'));
  assert.ok(read('src/lib/components/company/VehicleEnquiry.svelte').includes('i18n.t("action.requestImport")'));
  assert.ok(read('src/lib/components/company/TradeInEnquiry.svelte').includes('i18n.t("action.requestValuation")'));
});