import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareAppDealer} from './lib/app-dealer-adapter.mjs';
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
