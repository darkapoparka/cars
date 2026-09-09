const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
let ts;
try { ts = require('../carwow/node_modules/typescript'); } catch { ts = require('typescript'); }
const root = path.resolve(__dirname, '../carwow/src/lib/data');
const files = ['dealer-stock-media.ts','daynight-vehicles.ts','daynight-current-inventory.ts'];
const hashes = {};
let passed = 0;
function test(name, run) { run(); passed++; console.log(`PASS ${name}`); }
function load(name, imports = {}) {
  const source = fs.readFileSync(path.join(root, name), 'utf8');
  const buf = Buffer.from(source);
  hashes[name] = crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
  const result = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},reportDiagnostics:true});
  const errors = (result.diagnostics || []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `${name}: TypeScript syntax errors`);
  const exports = {};
  vm.runInNewContext(result.outputText, {exports, require(specifier) {
    assert.ok(Object.prototype.hasOwnProperty.call(imports,specifier), `Unexpected import ${specifier}`);
    return imports[specifier];
  },Intl,Set}, {filename:name});
  return exports;
}
const media = load(files[0]);
const local = '/assets/images/lead/fixture/front.webp';
const rear = '/assets/images/lead/fixture/rear.jpg';
const list = value => JSON.parse(JSON.stringify(value));
test('ordered local gallery',()=>assert.deepEqual(list(media.stockGallery([local,rear])),[local,rear]));
test('duplicate gallery entries removed',()=>assert.deepEqual(list(media.localStockImages([local,local,rear])),[local,rear]));
test('missing gallery keeps honest fallback',()=>assert.deepEqual(list(media.stockGallery([])),[media.missingStockImage]));
test('undefined gallery is safe',()=>assert.deepEqual(list(media.stockGallery(undefined)),[media.missingStockImage]));
test('remote, traversal, unsupported and wrong-root paths excluded',()=>assert.equal(media.localStockImages(['https://example.com/car.webp','/assets/images/lead/../other.jpg','/brand/logo.png','/assets/images/lead/test.svg','/assets/images/lead/test.jpg?x=1','/assets/images/lead/a//b.webp',false]).length,0));
// These are explicit test fixtures, not dealer inventory or evidence of photographed cars.
const fixture = {id:1,sourceId:'fixture-1',evidenceUrl:'https://example.invalid/fixture-1',make:'Fixture',title:'Fixture Car',yearNumber:2020,productionMonth:6,mileageKm:50,fuel:'Бензин',transmission:'Ръчна',category:'Хечбек',engineCc:1000,powerHp:null,color:'Сив',priceEur:4990,priceQualification:'Условие от тестова обява',description:'Тестови данни',equipment:[],localImages:[local,rear],observedAt:'2026-09-09',mediaStatus:'fixture-only',condition:'used'};
const fixtureStock = {default:{listings:[fixture,{...fixture,id:2,sourceId:'fixture-2',localImages:[],priceEur:0,engineCc:0,condition:'new'}]}};
const imports = {'./dealer-stock.json':fixtureStock,'./dealer-stock-media':media};
const vehicles = load(files[1],imports);
const current = load(files[2],imports);
test('vehicle card uses its first local image',()=>assert.equal(vehicles.cars[0].image,local));
test('detail uses full matched gallery',()=>assert.deepEqual(list(vehicles.cars[0].gallery),[local,rear]));
test('current inventory uses the same image',()=>assert.equal(current.currentDayNightListings[0].image,local));
test('missing record is in placeholder set',()=>assert.equal(vehicles.placeholderImageSlugs.has(vehicles.cars[1].slug),true));
test('local-photo record is not in placeholder set',()=>assert.equal(vehicles.placeholderImageSlugs.has(vehicles.cars[0].slug),false));
test('low-mileage used record stays used',()=>assert.equal(vehicles.getDayNightVehicleCondition(vehicles.cars[0]),'used'));
test('explicit new condition retained',()=>assert.equal(vehicles.getDayNightVehicleCondition(vehicles.cars[1]),'new'));
test('unknown legacy condition is not inferred new',()=>assert.equal(vehicles.getDayNightVehicleCondition({mileageValue:0}),'used'));
test('cash price does not become installment',()=>assert.equal(vehicles.cars[0].price,4990));
test('unknown price has no zero-euro label',()=>assert.equal(vehicles.cars[1].priceEur,'Цена при запитване'));
test('unknown power is not invented',()=>assert.equal(vehicles.cars[0].power,'Не е посочена'));
test('zero engine size is not presented as a specification',()=>assert.equal(vehicles.cars[1].engine,'Не е посочен'));
test('source URL and observation date retained',()=>assert.equal(vehicles.cars[0].sourceUrl,fixture.evidenceUrl));
console.log(JSON.stringify({scope:'TypeScript syntax and fixture-based adapter tests; not framework, actual media, browser, or full inventory QA',node:process.version,typescript:ts.version,passed,failed:0,inputGitBlobs:hashes},null,2));
