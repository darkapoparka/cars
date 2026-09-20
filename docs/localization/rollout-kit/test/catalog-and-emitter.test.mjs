import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { buildCore } from '../tools/build-core.mjs';
import { auditCatalog } from '../tools/catalog-audit.mjs';
const source=fs.readFileSync(new URL('../src/policy.ts',import.meta.url),'utf8');
const config=JSON.parse(fs.readFileSync(new URL('../config/al-reef.json',import.meta.url),'utf8'));
const record=(source,en,bg,disposition='translate')=>({source,key:'m_'+createHash('sha256').update(source).digest('hex').slice(0,12),en,bg,disposition,notes:'Synthetic test fixture'});
const records=[record('Всички {count} коли','All {count} cars','Всички {count} коли'),record('BMW','BMW','BMW','invariant')];
const common={'locale.save':{en:'Continue',bg:'Продължи'}};
test('the emitter preserves the existing typed API and FAB boundary',()=>{
  const output=buildCore(source,config), publicPart=output.slice(0,output.indexOf('export function cookieValue('));
  for(const symbol of ['localeContract','LocaleState','isLocale','intlLocale','formatPrice','routeParts','isResource','unsupportedLocale','localeHref','safeReturnPath','preferredLanguage','resolveLocale','preferenceResponse']) assert.ok(output.includes(symbol),symbol);
  assert.doesNotMatch(publicPart,/Set-Cookie|request\.body|preferenceResponse/);
  assert.match(output,/"inventoryCurrency": "AED"/);
  assert.equal(output,buildCore(source,config));
});
test('a candidate language cannot silently enable incomplete current app adapters',()=>{
  assert.throws(()=>buildCore(source,{...config,enabledLocales:['en','ar'],formatLocales:{en:'en-AE',ar:'ar-AE'},suggestedLanguages:{AE:'ar'}}),/released for en\/bg only/);
});
test('emitter fails rather than guessing an absent or duplicated source boundary',()=>{
  assert.throws(()=>buildCore(source.replace('/* CARS_DEFAULT_PUBLIC_BINDINGS */',''),config));
  assert.throws(()=>buildCore(source+'\n/* CARS_DEFAULT_PUBLIC_BINDINGS */',config));
});
test('complete catalogs are measured without inventing linguistic or browser approval',()=>{
  const report=auditCatalog({records,common,locale:'bg'});
  assert.equal(report.total,3);assert.equal(report.complete,3);assert.equal(report.contentComplete,true);
  assert.match(report.linguisticReview,/not-established/);
  assert.ok(report.translationPacket.every(m=>m.status==='requires-review'));
});
for(const locale of ['ar','de','uk','tr','ro','el'])test('planned '+locale+' exports untranslated review tasks rather than English fallbacks',()=>{
  const report=auditCatalog({records,common,locale});
  assert.equal(report.contentComplete,false);assert.equal(report.complete,0);
  assert.ok(report.translationPacket.every(m=>m.translation===''));
});
test('placeholder substitution cannot lose repeated, added or renamed parameters',()=>{
  for(const bg of ['Всички коли','Всички {other} коли','Всички {count} {count} коли']) {
    const report=auditCatalog({records:[{...records[0],bg}],common,locale:'bg'});
    assert.ok(report.problems.some(p=>p.reason==='placeholder-mismatch'));
  }
});
test('not-ui records are not exported as translation tasks',()=>{
  assert.equal(auditCatalog({records:[record('enum','enum','enum','not-ui')],common,locale:'bg'}).total,1);
});
test('duplicate keys and corrupt source identity fail explicitly',()=>{
  assert.throws(()=>auditCatalog({records:[...records,records[0]],common,locale:'bg'}),/Duplicate/);
  assert.throws(()=>auditCatalog({records:[{...records[0],source:'changed'}],common,locale:'bg'}),/Source\/key/);
});
test('missing common keys count as missing translations',()=>{
  assert.equal(auditCatalog({records:[],common:{'button.save':{en:'Save'}},locale:'bg'}).contentComplete,false);
});
test('empty or sentinel translations are never complete',()=>{
  for(const bg of ['','  ','TODO','TRANSLATE_ME'])assert.equal(auditCatalog({records:[{...records[0],bg}],common,locale:'bg'}).contentComplete,false);
});
test('unknown language aliases are rejected rather than confused with country codes',()=>{
  for(const locale of ['ua','gr','ae','zz'])assert.throws(()=>auditCatalog({records,common,locale}));
});
