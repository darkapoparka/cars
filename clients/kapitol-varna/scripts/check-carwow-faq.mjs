import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Run from any directory after installing the retained Carwow dependencies:
// node clients/kapitol-varna/scripts/check-carwow-faq.mjs
// This is an isolated FAQ contract check, not a SvelteKit build/browser test.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../carwow');
const require = createRequire(path.join(root, 'package.json'));
const ts = require('typescript');
const file = path.join(root, 'src/lib/data/daynight-faq.ts');
const stockFile = path.join(root, 'src/lib/data/dealer-stock.json');
const source = fs.readFileSync(file, 'utf8');
const dealer = JSON.parse(fs.readFileSync(stockFile, 'utf8'));

const program = ts.createProgram([file], {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  types: []
});
const diagnostics = ts.getPreEmitDiagnostics(program);
assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
  getCurrentDirectory: () => root,
  getCanonicalFileName: (name) => name,
  getNewLine: () => '\n'
}));
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.CommonJS,
    esModuleInterop: true
  },
  fileName: file,
  reportDiagnostics: true
});
assert.equal(compiled.diagnostics?.length ?? 0, 0);
const output = {};
vm.runInNewContext(compiled.outputText, {
  exports: output,
  require: (specifier) => {
    assert.equal(specifier, './dealer-stock.json', 'Unexpected runtime dependency');
    return dealer;
  }
}, { filename: file, timeout: 1000 });
const groups = JSON.parse(JSON.stringify(output.daynightFaqGroups));

const expected = [
  ['how-to-buy', 'container mb-60', 'h3 mb-20 text-center capitalize', 'Как протича покупката?',
    ['steps', 'financing-documents', 'reserve', 'payment-methods', 'test-drive']],
  ['exchanges', 'container mb-60', 'h3 mb-20 text-center capitalize', 'Бартер и замяна',
    ['trade-in-accepted', 'trade-in-valuation', 'trade-in-topup', 'trade-in-documents']],
  ['refund', 'container', 'h3 mb-18 text-center capitalize', 'Гаранция и доставка',
    ['warranty', 'history-check', 'delivery']]
];
assert.deepEqual(groups.map((group) => [group.id, group.containerClass, group.headingClass, group.heading, group.items.map((item) => item.id)]), expected);
const items = groups.flatMap((group) => group.items);
assert.equal(items.length, 12);
assert.equal(new Set(items.map((item) => item.id)).size, 12);
const bodies = items.map((item) => item.answer.map((paragraph) => paragraph.text).join(' '));
assert.equal(new Set(bodies).size, 12, 'Each question needs its own answer');
const singleClassIds = new Set(['financing-documents', 'trade-in-valuation', 'history-check']);
for (const item of items) {
  assert.equal(item.toggleClass, singleClassIds.has(item.id) ? 'flat-toggle' : 'flat-toggle bg-white');
  assert.ok(item.question.length > 10);
  for (const [index, paragraph] of item.answer.entries()) {
    assert.equal(paragraph.class, `${index < item.answer.length - 1 ? 'mb-8 ' : ''}h7 text-secondary line-height-28`);
    assert.ok(paragraph.text.trim().length > 40);
  }
}
const text = (id) => bodies[items.findIndex((item) => item.id === id)];
for (const value of [dealer.name, dealer.phone, dealer.observedAt]) assert.ok(text('steps').includes(value));
for (const value of [dealer.address, dealer.city, dealer.hours, dealer.phone]) assert.ok(text('test-drive').includes(value));
assert.match(text('steps'), /Очакван внос/);
assert.match(text('steps'), /клиентски автомобил/);
assert.match(text('reserve'), /не е резервация/);
assert.match(text('warranty'), /Няма потвърдена обща гаранция/);
assert.match(text('delivery'), /не е потвърдена услуга/);
assert.match(text('financing-documents'), /Няма потвърден списък/);
assert.match(text('history-check'), /не представляват независима проверка/);
assert.ok(!/Day\s*(?:&|and)?\s*Night|София|\ufffd|оформяме документите|финализираме сделката/i.test(bodies.join(' ')));
console.log(JSON.stringify({
  result: 'pass', node: process.version, typescript: ts.version,
  checks: ['strict FAQ-module typecheck', 'module execution with dealer JSON', 'three retained groups and twelve item IDs', 'retained CSS hooks', 'twelve distinct answers', 'source-driven contact and observation date', 'incoming/consignment distinctions', 'no inherited deal/service guarantees'],
  sourceSha256: createHash('sha256').update(source).digest('hex'),
  groups: groups.length, questions: items.length,
  fullApplicationBuild: false, browserCheck: false
}, null, 2));
