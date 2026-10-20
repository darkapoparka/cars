import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import { createRequire } from 'node:module';
import { MOBILE_CURRENCY_PATHS, personalizeMobileDealerCurrency } from './lib/mobile-dealer-currency.mjs';
import { UK_MOBILE_PATHS, personalizeMobileUk } from './lib/client-refresh-uk-next.mjs';

const template = path.resolve(import.meta.dirname, '../templates/mobile');
const require = createRequire(path.join(template, 'package.json')), ts = require('typescript');
const sources = () => new Map([...new Set([...MOBILE_CURRENCY_PATHS, ...UK_MOBILE_PATHS])].map(name => [name, fs.readFileSync(path.join(template, name))]));
const source = (files, name) => files.get(name).toString();
const bindFormatters = (files, currency) => {
  files.set('src/lib/locale.ts', Buffer.from(source(files, 'src/lib/locale.ts').replace("currency: 'EUR'", 'currency: ' + JSON.stringify(currency))));
  files.set('src/lib/search.ts', Buffer.from(source(files, 'src/lib/search.ts').replace("'€' + new Intl.NumberFormat('en-GB', { maximumFractionDigits: 0 }).format(amount)", "new Intl.NumberFormat('en-GB', { style: 'currency', currency: " + JSON.stringify(currency) + ', maximumFractionDigits: 0 }).format(amount)')));
};
function moduleFrom(files, name) {
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} }; cache.set(file, module);
    const input = files.has(file) ? source(files, file) : fs.readFileSync(path.join(template, file), 'utf8');
    const output = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const localRequire = specifier => {
      if (!specifier.startsWith('.')) return require(specifier);
      if (specifier.endsWith('.json')) return JSON.parse(fs.readFileSync(path.posix.join(template, path.posix.dirname(file), specifier), 'utf8'));
      return load(path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier + '.ts')));
    };
    vm.runInNewContext('(function(require,module,exports){' + output + '\n})', { URL, Intl, console })(localRequire, module, module.exports);
    return module.exports;
  }
  return load(name);
}
function amountFormatter(files, locale) {
  const text = source(files, 'src/components/ShowroomServiceRequest.tsx');
  const sf = ts.createSourceFile('request.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let amount;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText(sf) === 'amount') amount = node.initializer.getText(sf); ts.forEachChild(node, visit); }
  visit(sf); assert.ok(amount, 'actual service-review amount formatter exists');
  const js = ts.transpileModule('const amount = ' + amount + ';', { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
  return new Function('locale', js + '\nreturn amount;')(locale);
}
const euroProfile = { business: { countryCode: 'GB', currency: 'GBP', distanceUnit: 'mi' }, listings: [{ id: 'recorded-car', currency: 'GBP', mileageValue: 60000, mileageUnit: 'mi', raw: { mileageMiles: 60000 } }] };
function ready(currency) {
  const files = sources(); bindFormatters(files, currency);
  if (currency === 'GBP') for (const name of personalizeMobileUk(files, euroProfile)) files.set(name, Buffer.from(files.get(name)));
  return files;
}
const invariantDeclarations = (name, input) => {
  const sf = ts.createSourceFile(name, input, ts.ScriptTarget.Latest, true, name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS), values = [];
  function visit(node) {
    if ((ts.isCallExpression(node) && node.expression.getText(sf) === 'stylex.create') || ts.isNumericLiteral(node)) values.push(node.getText(sf));
    ts.forEachChild(node, visit);
  }
  visit(sf); return values;
};

test('native EUR sources are byte-identical after currency binding', () => {
  const files = ready('EUR'), before = new Map(files);
  assert.deepEqual(personalizeMobileDealerCurrency(files, 'EUR'), []);
  for (const [name, bytes] of before) assert.equal(files.get(name), bytes, name);
});

for (const [market, currency, unit] of [['AE', 'AED', 'AED'], ['US', 'USD', 'USD'], ['GB', 'GBP', '£']]) {
  test(market + ' currency reaches actual controls, service review/message and monthly consumers without changing numbers', () => {
    const files = ready(currency), before = new Map([...files].map(([name, bytes]) => [name, bytes.toString()]));
    assert.match(before.get('src/components/NativeFilterFields.tsx'), /unit="€"/, 'baseline native controls still expose EUR even after the UK overlay');
    if (market !== 'GB') assert.match(before.get('src/components/ShowroomServiceRequest.tsx'), /currency: 'EUR'/, 'baseline service review uses the wrong currency');
    const changed = personalizeMobileDealerCurrency(files, currency, market === 'GB');
    assert.ok(changed.includes('src/components/NativeFilterFields.tsx'));
    for (const name of MOBILE_CURRENCY_PATHS) {
      assert.doesNotMatch(source(files, name).replace("field.unit === '€'", 'capturedUnitIsEuro'), /€|\bEUR\b/, name);
      assert.deepEqual(invariantDeclarations(name, source(files, name)), invariantDeclarations(name, before.get(name)), 'StyleX and numeric literals: ' + name);
    }
    assert.match(source(files, 'src/components/ShowroomFilterSheet.tsx'), new RegExp('unit="' + unit + '"'));
    assert.match(source(files, 'src/components/ShowroomDesktopFilterFields.tsx'), new RegExp("0, 100000, 500, '" + unit + "'"));
    const fields = moduleFrom(files, 'src/lib/filter-fields.ts').filterSections.flatMap(section => section.fields);
    assert.equal(fields.find(field => field.id === 'price').unit, unit);
    assert.equal(moduleFrom(files, 'src/lib/native-filter-options.ts').nativeFilterOptions.price.options[0], 'Price (' + unit + ')');
    const native = moduleFrom(files, 'src/lib/native-filter-fields.ts');
    const filters = moduleFrom(files, 'src/lib/types.ts').defaultFilters;
    const captured = JSON.parse(fs.readFileSync(path.join(template, 'src/lib/native-data/filter-definitions.json'), 'utf8')).car.flatMap(section => section.fields);
    for (const payment of ['buy', 'lease']) {
      const fields = native.getFilterSections({ ...filters, payment }).flatMap(section => section.fields);
      const id = payment === 'buy' ? 'price' : 'leaseRate', actual = fields.find(field => field.id === id);
      assert.equal(actual.unit, unit, 'the actual AdvancedFilters range dialog receives the correct monetary unit');
      assert.equal(JSON.stringify(actual.optionValues), JSON.stringify(captured.find(field => field.id === id).optionValues), 'the native numeric range choices are unchanged');
    }
    const requests = moduleFrom(files, 'src/lib/service-requests.ts');
    for (const locale of ['bg', 'en']) {
      const values = { ...requests.emptyServiceRequest(), make: 'Audi', model: 'A3', budget: '45000.25', price: '12345.67', mileage: '60000' };
      const imported = requests.serviceRequestMessage('import', values, locale), sold = requests.serviceRequestMessage('sell', values, locale);
      assert.match(imported, new RegExp('\\(' + currency + '\\): 45000\\.25'));
      assert.match(sold, new RegExp('\\(' + currency + '\\): 12345\\.67'));
      assert.ok(locale === 'en' || imported.includes('Максимален бюджет'), 'Bulgarian labels remain translated');
      assert.equal(amountFormatter(files, locale)('12345.67'), new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : market === 'GB' ? 'en-GB' : 'en-IE', { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(12345.67));
    }
    const locale = moduleFrom(files, 'src/lib/locale.ts');
    assert.equal(locale.localeMoney(12345, 'en'), new Intl.NumberFormat(market === 'GB' ? 'en-GB' : 'en-IE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(12345));
    assert.ok(source(files, 'src/components/VehicleCard.tsx').includes("currency: '" + currency + "'"));
    assert.ok(source(files, 'src/components/VehicleCard.tsx').includes("' " + currency + " mth.'"));
    assert.ok(source(files, 'src/components/NativeCarPark.tsx').includes('for {number(v.price)} ' + unit), 'saved-price copy uses the existing fractional number formatter and the recorded unit');
    if (market === 'GB') {
      assert.equal(fields.find(field => field.id === 'mileage').unit, 'mi');
      assert.match(source(files, 'src/lib/service-requests.ts'), /Mileage \(mi\)/);
      assert.match(source(files, 'src/lib/dealer-mileage.ts'), /60000/);
    }
  });
}

test('missing or ambiguous currency consumers hold before any helper mutation', () => {
  for (const name of MOBILE_CURRENCY_PATHS.filter(name => !['src/lib/locale.ts', 'src/lib/search.ts'].includes(name))) {
    const files = ready('USD'); files.delete(name);
    const before = new Map(files);
    assert.throws(() => personalizeMobileDealerCurrency(files, 'USD'), /Missing Mobile currency boundary/);
    assert.deepEqual(files, before);
  }
  for (const transform of [value => value.replace('unit="€"', 'unit="unknown"'), value => value + '\nconst duplicate = <div unit="€" />;']) {
    const files = ready('USD'), name = 'src/components/NativeFilterFields.tsx';
    files.set(name, Buffer.from(transform(source(files, name))));
    const before = new Map(files);
    assert.throws(() => personalizeMobileDealerCurrency(files, 'USD'), /Reviewed Mobile currency boundary changed/);
    assert.deepEqual(files, before);
  }
  assert.throws(() => personalizeMobileDealerCurrency(ready('USD'), 'usd'), /explicit stock currency/);
  const mismatched = ready('USD');
  assert.throws(() => personalizeMobileDealerCurrency(mismatched, 'AED'), /currency boundary changed/);
});
