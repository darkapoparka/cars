import assert from 'node:assert/strict';
import test from 'node:test';
import { stockPriceFrom } from './lib/stock-price.mjs';
import { refreshNormalizeInternals } from './lib/client-refresh-normalize.mjs';

// Minimal historical card headings: declared 07.09.2026 snapshot, preserved
// in b4c596617bf71edf9f98c7d50b66f543df4709d5/clients/priselci/evidence/cards.json.
const historical = [
  [
    "VW Golf 1.4 БЕНЗИН",
    "3 600 €",
    3600
  ],
  [
    "VW Passat 1.4 БЕНЗИН",
    "4 299 €",
    4299
  ],
  [
    "VW Passat 2.0TDI COMMONRAIL",
    "3 900 €",
    3900
  ],
  [
    "Seat Ibiza 1.2 БЕНЗИН",
    "3 499 €",
    3499
  ],
  [
    "Renault Koleos 2.0 ДИЗЕЛ 4Х4",
    "4 299 €",
    4299
  ],
  [
    "Peugeot 307 CC КАБРИО",
    "2 899 €",
    2899
  ],
  [
    "Ford Mondeo 2.0 DIZEL",
    "3 299 €",
    3299
  ],
  [
    "Peugeot 5008 2.0HDI 150К.С",
    "5 099 €",
    5099
  ],
  [
    "Mercedes-Benz C 200 2.2 CDI",
    "2 799 €",
    2799
  ],
  [
    "Citroen C3 Picasso 1.6HDI 90К.С",
    "3 499 €",
    3499
  ],
  [
    "Audi A3 1.9 TDI 105ps",
    "4 699 €",
    4699
  ],
  [
    "Dacia Sandero 1.4 БЕНЗИН/ГАЗ",
    "2 500 €",
    2500
  ],
  [
    "Renault Grand scenic 1.5DCI",
    "4 299 €",
    4299
  ],
  [
    "BMW X3 2.0 ДИЗЕЛ 4Х4",
    "4 399 €",
    4399
  ],
  [
    "Nissan Qashqai 1.5 DCI",
    "5 499 €",
    5499
  ],
  [
    "Mercedes-Benz E 280 3.0CDI V6",
    "4 100 €",
    4100
  ]
];
test('helper: all sixteen historical price lines remain independent of titles', () => {
  for (const [title, price, expected] of historical) {
    assert.equal(stockPriceFrom(`${title}\n\n  ${price}\nНе се начислява ДДС`), expected, title);
  }
  for (const separator of ['\n', '\r\n', '\r']) {
    assert.equal(stockPriceFrom(`Mercedes-Benz E 280 3.0CDI V6${separator}4 100 €`), 4100);
  }
});
test('helper: grouping, decimals and explicit currencies retain valid amounts', () => {
  for (const [raw, expected] of [
    ['4 299 €',4299],['4\u00a0299 EUR',4299],['4\u202f299,50 EUR',4299.5],
    ['€4,299',4299],['USD 12,500.00',12500],['£18,950',18950],
    ['4.299,00 €',4299],['1,234,567.89 AED',1234567.89],
    ['12 500 лв.',12500],['4299',4299],['4299.50',4299.5],['0',0],[0,0],[44299,44299]
  ]) assert.equal(stockPriceFrom(raw), expected, String(raw));
});
test('helper: malformed, unknown and ambiguous source prices cannot become numeric facts', () => {
  for (const raw of [
    'Renault Koleos 2.0 ДИЗЕЛ 4Х4 4 299 €','Mercedes V6 4 100 €',
    '4x4 4299','2007\n4299','4 299 €\n4 399 €','4 299 € / 8 408 лв.',
    'POA 4299','on request 2026','unknown','N/A','по договаряне',
    '4 29 €','4  299 €','4,299,50 €','1234,567 €','4-299 €',
    '-4299',-4299,NaN,Infinity,{},null,undefined,''
  ]) assert.equal(stockPriceFrom(raw), null, String(raw));
  assert.equal(stockPriceFrom(null, '4 299 €'), 4299);
});
test('helper: historical prepare.mjs extraction reproduces exactly the three bad scalars', () => {
  const wrong = historical.flatMap(([title, price, expected]) => {
    const raw = `${title}\n\n  ${price}\nНе се начислява ДДС`;
    const match = raw.match(/([\d\s]+)\s*€/);
    const legacy = match ? Number(match[1].replace(/\s/g,'')) : null;
    return legacy === expected ? [] : [[title,legacy,expected]];
  });
  assert.deepEqual(wrong.map(([,legacy,expected])=>[legacy,expected]), [[44299,4299],[44399,4399],[64100,4100]]);
});
const business = {currency:'EUR',distanceUnit:'km',city:'Приселци',observedAt:'2026-09-07'};
test('normalizer: maintained listing boundary rejects concatenated title text', () => {
  for (const [title, price, expected] of historical) {
    const input = {id:'historic-id',title,year:2007,rawPriceText:`${title}\n${price}\nНе се начислява ДДС`,images:['/source.webp'],sourceUrl:'https://priselci.mobile.bg/',mileageKm:235193};
    const normalized = refreshNormalizeInternals.normalizeListing(input,0,business);
    assert.equal(normalized.priceAmount,expected,title);
    assert.equal(normalized.currency,'EUR');
    assert.equal(normalized.mileageValue,235193);
    assert.equal(normalized.id,input.id);
    assert.equal(normalized.title,title);
    assert.strictEqual(normalized.raw,input);
  }
  assert.equal(refreshNormalizeInternals.normalizeListing({title:'Mercedes V6',rawPriceText:'Mercedes V6 4 100 €'},0,business).priceAmount,null);
});
test('normalizer: unknown prices and explicit USD fields retain factual semantics', () => {
  const usd = refreshNormalizeInternals.normalizeListing({title:'Source listing',priceEur:'V6 4100',priceUsd:'$12,500.00'},0,business);
  assert.equal(usd.priceAmount,12500);assert.equal(usd.currency,'USD');
  for (const rawPriceText of ['POA 4100','4 299 €\n4 399 €']) {
    assert.equal(refreshNormalizeInternals.normalizeListing({title:'Source listing',rawPriceText},0,business).priceAmount,null);
  }
});

