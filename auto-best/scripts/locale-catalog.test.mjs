import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { compileCatalog } from './locale-catalog.mjs';
const row=(key='test.title',en='Title',bg='Заглавие',source='Title')=>({key,en,bg,source,disposition:'translate'});
test('requires a complete EN/BG pair without placeholders or review stubs',()=>{
  for(const bg of ['',undefined,'TODO','MISSING_TRANSLATION']) assert.throws(()=>compileCatalog({},[{...row(),bg}]),/Incomplete/);
  assert.throws(()=>compileCatalog({},[row('test.title','Hello {name}','Здравейте')]),/Placeholder/);
});
test('rejects duplicate keys even when both entries happen to agree',()=>{
  assert.throws(()=>compileCatalog({},[row(),row()]),/Duplicate/);
  assert.throws(()=>compileCatalog({'test.title':{en:'Title',bg:'Заглавие'}},[row()]),/Duplicate/);
});
test('ambiguous aliases cannot select a meaning according to declaration order',()=>{
  const rows=[row('vehicle.description','About','Описание','Vehicle description tab'),row('company.about','About','Информация','About')];
  for(const source of [rows,[...rows].reverse()]) {
    const built=compileCatalog({},source);
    assert.equal(Object.hasOwn(built.sourceKeys,'About'),false);
    assert.deepEqual(built.ambiguousAliases,['About']);
    assert.equal(built.bg['vehicle.description'],'Описание');
    assert.equal(built.bg['company.about'],'Информация');
  }
});
test('identical meanings have a deterministic alias while not-ui entries are omitted',()=>{
  const rows=[row('z.title'),row('a.title'),{key:'internal',disposition:'not-ui'}];
  assert.equal(compileCatalog({},rows).sourceKeys.Title,'a.title');
  assert.equal(compileCatalog({},[...rows].reverse()).sourceKeys.Title,'a.title');
  assert.equal(Object.hasOwn(compileCatalog({},rows).en,'internal'),false);
});
test('actual catalogs contain no active ambiguous aliases and include dealer/context keys',()=>{
  const read=p=>JSON.parse(fs.readFileSync(new URL('../localization/'+p,import.meta.url),'utf8'));
  const built=compileCatalog(read('common.json'),['catalog','template','dealer'].flatMap(name=>read(name+'.reviewed.json')));
  for(const alias of built.ambiguousAliases) assert.equal(Object.hasOwn(built.sourceKeys,alias),false,alias);
  for(const key of ['dealer.city','dealer.address','dealer.addressLine','dealer.appointment','inventory.year.from','inventory.year.to','enquiry.purpose.sell','inventory.spec.transmission']) assert.ok(built.en[key]&&built.bg[key],key);
  assert.ok(Object.keys(built.en).length>900);
});
