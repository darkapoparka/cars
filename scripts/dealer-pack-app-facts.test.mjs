import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import {stripTypeScriptTypes} from 'node:module';
import {prepareAppDealer} from './lib/app-dealer-adapter.mjs';
import {UK_APP_PATHS, personalizeAppUk} from './lib/client-refresh-uk-next.mjs';

const template = path.resolve(import.meta.dirname, '../templates/app');
const readTemplate = name => fs.readFileSync(path.join(template, name), 'utf8');
const appFiles = () => new Map(UK_APP_PATHS.map(name => [name, readTemplate(name)]));
const factPolicy = 'dealer-pack-optional-v1';
const manifest = {slug:'us-facts', localization:{defaultLocale:'en',dealerCountry:'US',inventoryCurrency:'USD'}, variants:[{key:'auto-best'},{key:'modern'},{key:'import'}]};
const profile = {slug:'us-facts', business:{name:'Recorded Motors', countryCode:'US', country:'United States', currency:'USD', distanceUnit:'mi', city:'Recorded city', logo:'/dealer/logo.png'},
  listings:[
    {slug:'miles',mileageValue:60000,mileageUnit:'mi'},
    {slug:'kilometres',mileageValue:90000,mileageUnit:'km'},
    {slug:'unknown',mileageValue:null,mileageOnRequest:true},
    {slug:'zero',mileageValue:0,mileageUnit:'mi',mileageOnRequest:false},
  ].map(item=>({brand:'Toyota',model:'Corolla',year:2020,currency:'USD',priceAmount:null,priceOnRequest:true,images:['/dealer/car.webp'],features:[],...item}))};
const mileageFacts = profile.listings.map(item=>({slug:item.slug,sourceValue:item.mileageOnRequest?null:item.mileageValue,sourceUnit:item.mileageOnRequest?null:item.mileageUnit}));
async function adapt(options={}) {
  const bytes=Buffer.from(JSON.stringify(profile));
  return prepareAppDealer('',manifest,{appFiles:appFiles(),readFile:async name=>{
    if(name==='auto-best/src/lib/data/dealer-profile.json')return bytes;
    if(name==='auto-best/static/dealer/logo.png'||name==='auto-best/static/dealer/car.webp')return Buffer.from('retained test raster');
    throw Object.assign(Error('Missing fixture: '+name),{code:'ENOENT'});
  },...options});
}
const uri = source => 'data:text/javascript;base64,'+Buffer.from(stripTypeScriptTypes(source)).toString('base64');
const withoutImports = source => source.replace(/(?:import|export)\s+(?:type\s+)?[^;]*?\sfrom\s*['"][^'"]+['"];\s*/g,'');

test('US App pack preserves original source mileage and unknown facts without relabelling currency',async()=>{
  const before=JSON.stringify(profile),result=await adapt({factPolicy});
  assert.equal(JSON.stringify(profile),before);
  assert.equal(result.config.country,'US');assert.equal(result.config.currency,'USD');
  assert.equal(result.provenance.ukPresentation,undefined);
  assert.equal(result.provenance.dealerPackPresentation.countryCode,'US');
  assert.equal(result.files.has('lib/currency.ts'),false);
  assert.deepEqual(result.inventory.map(item=>[item.mileage,item.mileageOnRequest]),[[96561,false],[90000,false],[0,true],[0,false]]);
  assert(result.inventory.every(item=>item.priceOnRequest&&item.price===0));
  const helper=await import(uri(result.files.get('lib/dealer-mileage.ts').toString()));
  assert.deepEqual(result.inventory.map(item=>helper.formatStockMileage(item)),['60,000 mi','90,000 km','Mileage on request','0 mi']);
  assert.equal(helper.dealerMileageValue(result.inventory[0]),60000);
  assert.equal(helper.canonicalMileage(result.inventory[0]),96560.64);
  assert(Number.isNaN(helper.dealerMileageValue(result.inventory[2])));
});

test('US App actual numeric and preset filters compare source miles at the boundary',async()=>{
  const result=await adapt({factPolicy}),files=new Map([...appFiles(),...result.files]);
  const source=name=>files.get(name)?.toString()??readTemplate(name);
  const imports='import {dealerMileageValue,formatStockMileage} from '+JSON.stringify(uri(source('lib/dealer-mileage.ts')))+';\n';
  const body='const dealer={currency:"USD",defaultLocale:"en"};const isDealer=true;const dealerInventory='+JSON.stringify(result.inventory)+';\n'+
    ['lib/vehicle-values.ts','lib/inventory-identity.ts','lib/currency.ts','lib/inventory-settings.ts','lib/inventory-filters.ts'].map(name=>withoutImports(source(name))).join('\n');
  const runtime=await import(uri(imports+body));
  const filter=runtime.restoreFilters({...runtime.emptyFilters(),mileageMaximum:60000});
  const matching=filters=>result.inventory.filter(item=>runtime.matchesInventory(item,filters,'')).map(item=>item.slug);
  assert.deepEqual(matching(filter),['miles','kilometres','zero']);
  assert.deepEqual(matching({...filter,mileageMinimum:60000}),['miles']);
  assert.deepEqual(matching({...runtime.emptyFilters(),mileage:'Under 60,000 mi'}),['kilometres','zero']);
  assert.deepEqual(matching(runtime.emptyFilters()),['miles','kilometres','unknown','zero']);
  assert.deepEqual(matching({...runtime.emptyFilters(),maximum:10000}),[],'An omitted price is not an inexpensive vehicle');
  assert.equal(runtime.currency.code,'USD');assert.equal(runtime.currency.symbol,'USD');
  assert(runtime.mileageOptions.every(value=>value.endsWith(' mi')));
});

test('US presentation opt-in preserves existing App behavior and template markup/styles',async()=>{
  const legacy=await adapt();assert.equal(legacy.files.has('lib/dealer-mileage.ts'),false);assert.equal(legacy.provenance.dealerPackPresentation,undefined);
  const files=appFiles(),unchanged=[...files];assert.deepEqual(personalizeAppUk(files,profile,mileageFacts),[]);assert.deepEqual([...files],unchanged);
  const result=await adapt({factPolicy});
  for(const name of result.provenance.dealerPackPresentation.contentPaths.filter(name=>name.endsWith('.tsx'))){
    const before=readTemplate(name),after=result.files.get(name).toString();
    const tags=value=>value.match(/<\/?[A-Za-z][\w.:-]*(?=[\s/>])/g)??[];
    assert.deepEqual(tags(after),tags(before),name+' JSX element structure');
    const style=value=>value.match(/const (?:s|styles)\s*=\s*stylex\.create\([\s\S]*$/)?.[0];
    assert.equal(style(after),style(before),name+' style source');
  }
});

test('US pack overlay rejects changed source or conflicting currency atomically',()=>{
  for(const kind of ['source','currency']){
    const files=appFiles(),input=structuredClone(profile);
    if(kind==='source')files.set('components/VehicleCard.tsx','unreviewed changed boundary');
    else input.listings[0].currency='GBP';
    const before=[...files];assert.throws(()=>personalizeAppUk(files,input,mileageFacts,{factPolicy}),/boundary changed|mixed currencies/);assert.deepEqual([...files],before);
  }
});
