import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { DEMO_STOCK_LAYOUT_PATHS, personalizeDemoStockDisclosure } from './lib/client-refresh-safe-content.mjs';
import { assessPageSnapshot, dealerPackIdentityRequirements } from './verify-dealer-pack.mjs';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { applyExtendedRefreshAdapter } from './lib/client-refresh-six.mjs';

const require = createRequire(process.env.CARS_QA_RESOLVE_FROM || path.resolve('templates/auto-best/package.json'));
const { compile } = require('svelte/compiler');
const ts = require('typescript');
const { render } = await import(pathToFileURL(require.resolve('svelte/server')).href);
const notice = 'Illustrative demo vehicles from the retained Cars template; these are not this dealer’s stock. Availability has not been verified. Listing prices are omitted in this preview.';
const profile = { stockKind: 'illustrative-not-dealer-stock', business: { inventoryNotice: notice } };
// Exact selected 5d052ea layouts: tests exercise the released consumers, not a newer fixture.
const selected = {
  'auto-best': '018f28d2f90bf76a0cc40c9d5b471e91617f7696cc537c35ce23d878d8ab5fcd',
  modern: 'ab485eba9444e25645998e67ddad2f28a82f061303455beacb170d4b78b459e7',
  import: '6ce42f4d493a0712eaad5f679ee86f7f1c901be476a132bb59d4d1ecd76f4c4a',
  'karento-best': '37e0c6ced042663f095f58d492f6f2975a677b70fe7a9af4ff3100f0169a72e5'
};
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
async function renderNotice(markup) {
  const compiled = compile(markup, { generate: 'server', filename: 'DemoDisclosure.svelte' });
  const code = compiled.js.code.replaceAll("'svelte/internal/server'", JSON.stringify(pathToFileURL(require.resolve('svelte/internal/server')).href));
  const module = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  return render(module.default).body;
}

for (const [key, file] of Object.entries(DEMO_STOCK_LAYOUT_PATHS)) test(`${key} renders the exact demo disclosure in its released common layout`, async () => {
  const original = fs.readFileSync(path.resolve('templates', key, file), 'utf8');
  assert.equal(createHash('sha256').update(original).digest('hex'), selected[key]);
  const output = personalizeDemoStockDisclosure(original, key, profile);
  const nodes = [...output.matchAll(/<p data-dealer-stock-disclosure [^>]+>\{[^\n]+\}<\/p>/g)];
  assert.equal(nodes.length, 1);
  const inserted = key === 'import' ? nodes[0][0] + '\n' : key === 'auto-best' ? '  ' + nodes[0][0] + '\n' : '\n' + nodes[0][0];
  assert.equal(output.replace(inserted, ''), original, 'preserve all native layout composition and consumers');
  if (key === 'auto-best') {
    assert.ok(output.indexOf(nodes[0][0]) > output.indexOf('{@render children()}'), 'disclosure must follow the absolute-header homepage');
    assert.ok(output.indexOf(nodes[0][0]) < output.indexOf('</SiteShell>'), 'disclosure must stay inside shared main flow');
    assert.match(nodes[0][0], /background:#f6f6f8/);
  }
  assert.match(nodes[0][0], /width: ?(?:"100%"|100%)/);
  assert.doesNotMatch(nodes[0][0], /display:none|hidden|position:fixed|position:absolute/);
  if (key === 'modern') {
    const parsed = ts.createSourceFile(file, output, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    assert.deepEqual(parsed.parseDiagnostics, []);
  } else compile(output, { generate: 'server', filename: key + '/+layout.svelte' });
  // Compile and SSR the exact inserted Svelte node, independently of tabs/media queries.
  const markup = nodes[0][0].replace(/style=\{\{[^}]+\}\}/, 'style="padding:0.75rem 1rem;width:100%;box-sizing:border-box"');
  const rendered = await renderNotice(markup);
  assert.ok(rendered.includes(escape(notice)));
  assert.equal(personalizeDemoStockDisclosure(original, key, { ...profile, stockKind: 'dated-published-advertisements' }), original);
});

test('demo layout boundaries and exact nonempty copy fail closed', () => {
  for (const key of Object.keys(DEMO_STOCK_LAYOUT_PATHS)) {
    const source = fs.readFileSync(path.resolve('templates', key, DEMO_STOCK_LAYOUT_PATHS[key]), 'utf8');
    assert.throws(() => personalizeDemoStockDisclosure('', key, profile), /exactly one reviewed/);
    assert.throws(() => personalizeDemoStockDisclosure(source + source, key, profile), /exactly one reviewed/);
    assert.throws(() => personalizeDemoStockDisclosure(personalizeDemoStockDisclosure(source, key, profile), key, profile), /exactly one reviewed/);
    assert.throws(() => personalizeDemoStockDisclosure(source, key, { ...profile, business: { inventoryNotice: ' ' } }), /exact inventory disclosure/);
    assert.equal(personalizeDemoStockDisclosure(source, key, { business: {} }), source);
  }
});

test('maintained adapter entry points refuse changed demo layouts before source or asset mutation', t => {
  const area = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-demo-disclosure-'));
  t.after(() => {
    const relative = path.relative(fs.realpathSync(os.tmpdir()), fs.realpathSync(area));
    assert.ok(relative.startsWith('cars-demo-disclosure-') && !relative.includes(path.sep) && !path.isAbsolute(relative));
    fs.rmSync(area, { recursive: true, force: true });
  });
  for (const key of ['auto-best', 'modern', 'import']) {
    const candidate = path.join(area, key), file = path.join(candidate, DEMO_STOCK_LAYOUT_PATHS[key]);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'Changed public layout');
    const writes = [];
    assert.throws(() => applyRefreshAdapter({ key, candidate, profile, mutationWriter: { writeFile: (...args) => writes.push(args) } }), /exactly one reviewed public layout/);
    assert.deepEqual(writes, []);
    assert.equal(fs.readFileSync(file, 'utf8'), 'Changed public layout');
  }
  const files = new Map([['karento-best/' + DEMO_STOCK_LAYOUT_PATHS['karento-best'], Buffer.from('Changed public layout')]]);
  const before = structuredClone(files);
  assert.throws(() => applyExtendedRefreshAdapter({ files, key: 'karento-best', profile, client: area }), /exactly one reviewed public layout/);
  assert.deepEqual(files, new Map([...before].map(([name, bytes]) => [name, Buffer.from(bytes)])));
});

test('disclosure source literals preserve punctuation without treating the notice as markup', async () => {
  const original = fs.readFileSync('templates/auto-best/src/routes/+layout.svelte', 'utf8');
  const literal = `${notice} Let's keep "quotes", \\ and $& <script>alert(1)</script> verbatim.`;
  const output = personalizeDemoStockDisclosure(original, 'auto-best', { ...profile, business: { inventoryNotice: literal } });
  const node = output.match(/<p data-dealer-stock-disclosure [^>]+>\{[^\n]+\}<\/p>/)[0];
  const rendered = await renderNotice(node);
  assert.ok(rendered.includes(escape(literal)));
  assert.doesNotMatch(rendered, /<script>/);
});

test('strict inventory/detail QA still refuses absent disclosure and accepts the rendered exact notice', async () => {
  const variants = ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best'].map((key, index) => ({ key, base: index ? '/variant-' + (index + 1) : '', entry: index ? '/variant-' + (index + 1) + '/' : '/' }));
  const manifest = { slug: 'j26-vans-trucks', packaging: { version: '5' }, variants };
  const base = { url: 'http://127.0.0.1:8787/', status: 200, contentType: 'text/html', text: 'J26 Vans & Trucks Ltd. Browse the vehicle examples and contact the showroom before visiting to confirm current availability.', metadata: '', phones: [], fabMarks: [{ visible: true, loaded: true, dealerFabLogo: true }], designChoices: variants.map(v => ({ key: v.key, href: v.entry })), adminLinks: [{ href: 'https://cars-admin-blue.vercel.app/', target: '_blank', rel: 'noopener noreferrer' }], errors: [], brokenImages: [], overflow: 0 };
  const options = { facts: { business: { name: 'J26 Vans & Trucks Ltd' } }, manifest, variant: variants[0], fleet: { records: [] }, demoStock: true, requireDisclosure: true };
  const markup = personalizeDemoStockDisclosure('<SiteShell {presentation}>', 'auto-best', profile).split('\n')[1];
  const text = (await renderNotice(markup)).replace(/<[^>]*>/g, '');
  for (const label of ['inventory', 'detail']) {
    const args = { ...options, identityRequirements: dealerPackIdentityRequirements(label) };
    assert.ok(assessPageSnapshot({ ...args, snapshot: base }).findings.includes('demo-stock-disclosure'));
    const result = assessPageSnapshot({ ...args, snapshot: { ...base, text: base.text + ' ' + text } });
    assert.equal(result.status, 'passed');
    assert.equal(result.disclosureObserved, true);
  }
});
