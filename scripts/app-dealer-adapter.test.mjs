import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {prepareAppDealer} from './lib/app-dealer-adapter.mjs';
import {refreshNormalizeInternals} from './lib/client-refresh-normalize.mjs';
const manifest={slug:'dealer-one',localization:{defaultLocale:'bg',dealerCountry:'BG',inventoryCurrency:'EUR'},variants:[{key:'auto-best'},{key:'modern'},{key:'carwow'}]};
const profile={slug:'dealer-one',business:{name:'Dealer One',city:'Sofia',logoLight:'/dealer/logo.png',logoDark:'/dealer/logo.png'},listings:[{slug:'car-one',brand:'Porsche',model:'911',year:2020,priceAmount:50000,currency:'EUR',mileageKm:100000,fuelType:'gasoline',transmissionType:'automatic',bodyType:'Coupe',images:['/dealer/stock/1.svg'],features:[]},{slug:'car-two',brand:'BMW',model:'X3',year:2022,priceAmount:70000,currency:'EUR',mileageKm:50000,fuelType:'diesel',transmissionType:'automatic',bodyType:'SUV',images:['/dealer/stock/2.webp'],features:['Navigation']}]};
const source=new Map([
 ['auto-best/src/lib/data/dealer-profile.json',Buffer.from(JSON.stringify(profile))],
 ['auto-best/static/dealer/logo.png',Buffer.from('logo')],
 ['auto-best/static/dealer/stock/1.svg',Buffer.from('<svg viewBox="0 0 10 10"><path d="M0 0h10v10z"/></svg>')],
 ['auto-best/static/dealer/stock/2.webp',Buffer.from('photo')]
]);
const readFile=async name=>{if(!source.has(name)){const error=new Error('missing');error.code='ENOENT';throw error;}return source.get(name);};
test('dealer App replaces SVG stock placeholders without inventing vehicle photography',async()=>{
 const result=await prepareAppDealer('',manifest,{readFile});
 const placeholder=result.inventory[0],photo=result.inventory[1];
 assert.equal(placeholder.imagePlaceholder,true);
 assert.deepEqual(placeholder.images,['/cutouts/buy-sedan-v1.png']);
 assert.deepEqual(placeholder.proposalBenefits,['Warranty option','Finance option']);
 assert.equal(photo.imagePlaceholder,false);
 assert.match(photo.image,/^\/dealer-app\/vehicle-[a-f0-9]{20}\.webp$/);
 assert.equal([...result.files.keys()].some(name=>name.endsWith('.svg')),false);
 assert.equal(result.provenance.logoPolicy,'Preserve existing raster identities; no replacement logo was generated.');
});

async function adaptMileage(fields,business={}) {
 const input={...profile,business:{...profile.business,...business},listings:[{...profile.listings[1],...fields}]};
 const bytes=Buffer.from(JSON.stringify(input));
 const result=await prepareAppDealer('',manifest,{readFile:async name=>name==='auto-best/src/lib/data/dealer-profile.json'?bytes:readFile(name)});
 return {vehicle:result.inventory[0],facts:result.provenance.mileageFacts[0],input,bytes,result};
}

test('App consumes normalized, tagged and flat UK miles without losing original mileage facts',async()=>{
 const cases=[
  {mileageKm:undefined,mileageValue:10000,mileageUnit:'mi',raw:{mileage:{value:10000,unit:'mi'}}},
  {mileageKm:undefined,mileage:{value:10000,unit:'miles'}},
  {mileageKm:undefined,mileageValue:10000},
  {mileageKm:undefined,mileage:10000,mileageUnit:'mi'},
  {mileageKm:undefined,mileageMiles:10000},
  {mileageKm:undefined,mileageMiles:'10,000'},
  {mileageKm:undefined,raw:{mileage:{value:10000,unit:'mi'}}},
  {mileageKm:undefined,raw:{mileageMiles:10000}}
 ];
 for(const fields of cases) {
  const {vehicle,facts,input,bytes,result}=await adaptMileage(fields,{country:'GB',currency:'GBP',distanceUnit:'mi'});
  assert.equal(vehicle.mileage,16093,JSON.stringify(fields));
  assert.equal(vehicle.mileageOnRequest,false);
  assert.deepEqual(facts,{slug:'car-two',sourceValue:10000,sourceUnit:'mi',canonicalKm:16093});
  assert.equal(result.provenance.profileSha256,createHash('sha256').update(bytes).digest('hex'));
  assert.deepEqual(input.listings[0],{...profile.listings[1],...fields});
 }
});

test('App keeps flat mileage value and unit precedence consistent and preserves canonical km',async()=>{
 const cases=[
  [{mileageKm:16093,mileageMiles:10000,mileageUnit:'mi'},16093,16093,'km'],
  [{mileageKm:undefined,km:12000,mileageMiles:10000,mileageUnit:'mi'},12000,12000,'km'],
  [{mileageKm:undefined,mileageMiles:10000,mileageValue:99999,mileageUnit:'km'},16093,10000,'mi'],
  [{mileageKm:undefined,mileageValue:10000,mileageUnit:'km'},10000,10000,'km'],
  [{mileageKm:16093.44},16093.44,16093.44,'km'],
  [{mileageKm:undefined,mileage:{value:10000,unit:'kilometres'}},10000,10000,'km']
 ];
 for(const [fields,canonicalKm,sourceValue,sourceUnit] of cases) {
  const {vehicle,facts}=await adaptMileage(fields,{distanceUnit:'mi'});
  assert.equal(vehicle.mileage,canonicalKm);
  assert.equal(vehicle.mileageOnRequest,false);
  assert.deepEqual(facts,{slug:'car-two',sourceValue,sourceUnit,canonicalKm});
 }
});

test('App keeps unpublished mileage unknown and accepts a published zero',async()=>{
 const unknowns=[
  {mileageKm:undefined},
  {mileageKm:undefined,mileageValue:null,mileageUnit:'mi'},
  {mileageKm:undefined,mileage:{value:'Not published',unit:'mi'}},
  {mileageKm:undefined,mileageValue:0,mileageUnit:'mi',raw:{}},
  {mileageKm:undefined,mileageValue:0,mileageUnit:'km',raw:{mileage:'Not published'}},
  {mileageKm:undefined,mileageMiles:-1},
  {mileageKm:50000,mileageOnRequest:true}
 ];
 for(const fields of unknowns) {
  const {vehicle,facts}=await adaptMileage(fields);
  assert.equal(vehicle.mileage,0,JSON.stringify(fields));
  assert.equal(vehicle.mileageOnRequest,true);
  assert.deepEqual(facts,{slug:'car-two',sourceValue:null,sourceUnit:null,canonicalKm:null});
 }
 for(const fields of [{mileageKm:0},{mileageKm:undefined,mileage:{value:0,unit:'mi'}},{mileageKm:undefined,mileageValue:0,mileageUnit:'mi',raw:{mileageMiles:0}}]) {
  const {vehicle}=await adaptMileage(fields);
  assert.equal(vehicle.mileage,0);
  assert.equal(vehicle.mileageOnRequest,false);
 }
});

test('App rejects known mileage with unsupported units or unsafe conversion',async()=>{
 await assert.rejects(adaptMileage({mileageKm:undefined,mileage:{value:10000,unit:'yards'}}),/Unsupported App source mileage unit/);
 await assert.rejects(adaptMileage({mileageKm:undefined,mileageMiles:Number.MAX_VALUE}),/supported numeric range/);
});

test('App preserves a normalized formatted published zero while missing source mileage remains unknown',async()=>{
 const business={distanceUnit:'mi',currency:'GBP'};
 const listing=refreshNormalizeInternals.normalizeListing({slug:'car-two',year:2022,make:'BMW',model:'X3',price:70000,mileage:'0 miles',mileageUnit:'mi',images:['/dealer/stock/2.webp']},0,business);
 assert.equal(listing.mileageValue,0);
 assert.equal(listing.mileageOnRequest,false);
 const published=await adaptMileage({...listing,mileageKm:undefined},business);
 assert.equal(published.vehicle.mileage,0);
 assert.equal(published.vehicle.mileageOnRequest,false);
 assert.deepEqual(published.facts,{slug:'car-two',sourceValue:0,sourceUnit:'mi',canonicalKm:0});
 const unknown=refreshNormalizeInternals.normalizeListing({slug:'car-two',year:2022,make:'BMW',model:'X3',price:70000,mileage:'Not published',images:['/dealer/stock/2.webp']},0,business);
 const missing=await adaptMileage({...unknown,mileageKm:undefined},business);
 assert.equal(missing.vehicle.mileageOnRequest,true);
 assert.deepEqual(missing.facts,{slug:'car-two',sourceValue:null,sourceUnit:null,canonicalKm:null});
});
