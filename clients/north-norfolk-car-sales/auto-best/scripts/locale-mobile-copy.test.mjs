import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { compileCatalog } from './locale-catalog.mjs';
const read = p => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
const usesNativeKey = (source, key) =>
  source.includes(`i18n.t("${key}")`) || source.includes(`i18n.t('${key}')`);
const common = JSON.parse(read('localization/common.json'));
const rows = ['catalog', 'template', 'dealer'].flatMap(name => JSON.parse(read(`localization/${name}.reviewed.json`)));
const catalog = compileCatalog(common, rows);

const messageSource = read('src/lib/locale/messages.ts');
const messageAst = ts.createSourceFile('messages.ts', messageSource, ts.ScriptTarget.Latest, true);
const dealerFunction = messageAst.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'dealerLabel');
assert.ok(dealerFunction, 'native dealer label function');
const dealerFunctionJs = ts.transpileModule(dealerFunction.getFullText(messageAst), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 }
}).outputText;
const dealerLabelsFor = async labels => {
  const module = `const dealerLocalizedText = ${JSON.stringify(labels)};\n${dealerFunctionJs}`;
  return (await import(`data:text/javascript;base64,${Buffer.from(module).toString('base64')}`)).dealerLabel;
};

test('compact dealer labels select the native display variant without changing full copy', async () => {
  const labels = {
    en: { address: '15 Example Street, Central District, Varna', addressShort: '15 Example St, Varna', appointment: 'Visits by appointment', appointmentShort: 'By appointment' },
    bg: { address: 'ул. Примерна 15, Централен район, Варна', addressShort: 'ул. Примерна 15, Варна', appointment: 'Посещения с предварителна уговорка', appointmentShort: 'С предварителна уговорка' }
  };
  const dealerLabel = await dealerLabelsFor(labels);
  for (const locale of ['en', 'bg']) for (const field of ['address', 'appointment']) {
    assert.equal(dealerLabel(locale, field), labels[locale][field]);
    assert.equal(dealerLabel(locale, field, true), labels[locale][`${field}Short`]);
  }
});

test('older dealer configurations keep their own localized fields when compact variants are absent', async () => {
  const labels = {
    en: { address: '45 Independent Street, Plovdiv', appointment: 'Monday to Friday, 09:00–18:00' },
    bg: { address: 'ул. Независима 45, Пловдив', appointment: 'Понеделник–петък, 09:00–18:00' }
  };
  const dealerLabel = await dealerLabelsFor(labels);
  for (const locale of ['en', 'bg']) for (const field of ['address', 'appointment'])
    assert.equal(dealerLabel(locale, field, true), labels[locale][field]);
});

test('compact import controls retain complete native EN/BG copy', () => {
  const expected = {
    'action.importShort': ['Import', 'Внос'],
    'action.requestShort': ['Request', 'Заяви'],
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
    assert.ok(usesNativeKey(guide, key), key);
  for (const [path, contextKey] of [
    ['src/lib/components/home/SearchBox.svelte', 'action.requestImport'],
    ['src/lib/components/company/VehicleEnquiry.svelte', 'action.requestImport'],
    ['src/lib/components/company/TradeInEnquiry.svelte', 'action.requestValuation']
  ]) {
    const source = read(path);
    assert.ok(usesNativeKey(source, 'action.requestShort'), `${path}: compact label`);
    assert.ok(usesNativeKey(source, contextKey), `${path}: complete request context`);
  }
});
