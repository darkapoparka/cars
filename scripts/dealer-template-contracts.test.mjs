import assert from 'node:assert/strict';
import test from 'node:test';
import {FAMILY_NODE,repairDealerTemplateContracts} from './publishing/dealer-template-contracts.mjs';
const inv='auto-best/src/lib/data/inventory.ts';
const logo='modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx';
const stock='[\n  {"id":1,"priceEur":12990,"title":"Dealer car"}\n]';
const source=`type Vehicle = {\n  make: string;\n  title: string;\n};\nexport const featuredVehicles: Vehicle[] = ${stock};\nexport const formatVehiclePrice = (\n  amount: number,\n  locale: Locale = localeContract.defaultLocale\n) => amount > 0 ? formatPrice(amount, locale) : templateText(locale, 'Price on request');\n`;
const wordmark=`function DealerMobileWordmark({\n  clean,\n}: {\n  clean: boolean;\n  wordmarkTone: WordmarkTone;\n}) { return logoSource; }\nconst logoSource = useOnLight ? leadSite.logoOnLight : leadSite.logoOnDark;\n<DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />\n`;
const fixture=(buffer=false)=>new Map([[inv,buffer?Buffer.from(source):source],[logo,buffer?Buffer.from(wordmark):wordmark],['dealer-stock.json',stock]]);
test('six family engines match native contracts',()=>assert.deepEqual(FAMILY_NODE,{'auto-best':'22.23.2',modern:'22.23.2',import:'24.21.0',app:'22.23.2',mobile:'22.23.2','karento-best':'24.21.0'}));
for(const buffer of [false,true])test('presentation repair preserves facts and input kind '+buffer,()=>{
 const files=fixture(buffer),report=repairDealerTemplateContracts(files);
 assert.equal(report.changes.length,2);assert.equal(report.templateMastersChanged,false);
 assert.equal(files.get('dealer-stock.json'),stock);assert.ok(String(files.get(inv)).includes(stock));
 assert.match(String(files.get(inv)),/export const formatVehiclePriceLabel/);
 assert.match(String(files.get(logo)),/logoSource=\{logoSource\}/);
 assert.equal(Buffer.isBuffer(files.get(inv)),buffer);
 for(const row of report.changes){assert.notEqual(row.beforeSha256,row.afterSha256);assert.equal(row.factsPreserved,true);}
});
test('drift in second file leaves first file unmodified',()=>{const files=fixture();files.set(logo,wordmark.replace('function DealerMobileWordmark','function RenamedWordmark'));const before=[...files];assert.throws(()=>repairDealerTemplateContracts(files),/boundary changed/);assert.deepEqual([...files],before);});
test('missing logo leaves inventory untouched',()=>{const files=fixture();files.delete(logo);assert.throws(()=>repairDealerTemplateContracts(files),/Missing native contract/);assert.equal(files.get(inv),source);});
test('double application fails without corrupting files',()=>{const files=fixture();repairDealerTemplateContracts(files);const before=[...files];assert.throws(()=>repairDealerTemplateContracts(files),/inventory boundary changed/);assert.deepEqual([...files],before);});
test('price wrapping keeps amount and grouping, permits a break before currency',()=>{const files=fixture();repairDealerTemplateContracts(files);const tail=String(files.get(inv)).split('export const formatVehiclePriceLabel = ')[1].trim();const fn=Function('formatVehiclePrice','localeContract','return '+tail.replace('(amount: number, locale: Locale = localeContract.defaultLocale)','(amount, locale = localeContract.defaultLocale)'))(()=> '12\u00a0990\u00a0€',{defaultLocale:'bg'});assert.equal(fn(12990),'12\u00a0990 €');});