import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stripTypeScriptTypes } from 'node:module';
import { applyCarwowSafeContent, applyImportSafeContent } from './lib/client-refresh-safe-content.mjs';
import { readTypeScriptCatalog } from './lib/catalog-literal.mjs';
import {readRegisteredPersonalization,originalListingIdRecorded} from './lib/client-refresh-normalize.mjs';
import {tinyArea,writeFixture} from './test-fixtures/fleet-single-worker.mjs';

const profile = (countryCode) => ({
  business: {
    countryCode,
    shortName: 'Fixture Auto',
    name: 'Fixture Auto',
    phoneDisplay: '+359 88 000 0000',
    email: 'fixture@example.com',
    observedAt: '2026-09-21',
    city: 'Sofia',
    address: 'Fixture Street 1',
    inventoryNotice: 'Confirm current inventory.',
    previewNotice: 'Independent demonstration.'
  }
});

for (const countryCode of ['BG', 'AE']) {
  test('Carwow safe review copy is catalog-backed for ' + countryCode, () => {
    const candidate = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-safe-copy-'));
    applyCarwowSafeContent({ candidate, profile: profile(countryCode), logo: '/dealer-brand/logo.webp' });
    const generated = fs.readFileSync(path.join(candidate, 'src/lib/data/daynight-reviews.ts'), 'utf8');
    assert.match(generated, /Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения./);
    assert.doesNotMatch(generated, /No verified customer reviews are included in this independent preview/);
    assert.doesNotMatch(generated, /В този независим преглед не са включени потвърдени клиентски отзиви/);
  });
}

test('ordinary profile reads require no registered overlay and unsafe overlay paths fail closed',t=>{
 const root=tinyArea(t);writeFixture(path.join(root,'business-facts.json'),{business:{name:'Original',unknown:null}});
 assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained'});assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained',registeredSourceAdoption:{receipt:{path:'../outside.json',sha256:'1'.repeat(64)},personalization:{path:'.client/registered-personalization.json',sha256:'2'.repeat(64)}}});
 assert.throws(()=>readRegisteredPersonalization(root,'retained'),/exact bounded path\/hash/);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'business-facts.json'))),{business:{name:'Original',unknown:null}});
});
test('listing provenance requires the exact recorded ID field, never a substring in copy',()=>{
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12345","description":"123"}'),'123'),false);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"123"}'),'123'),true);
 assert.equal(originalListingIdRecorded(Buffer.from("{sourceId: '12.3'}"),'12.3'),true);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12x3"}'),'12.3'),false);
});

const homeFixture = `export type HomeFiveReview = {avatar:string;name:string;role:string;roleKind?:string;rating?:number;excerpt?:string;text:string};
export const unchangedBefore = 'native composition';
export const homeFiveReviewItems: HomeFiveReview[] = [
 {avatar:'/customer.webp',name:'Aleksandar Vytev',role:'Клиент на Day Night Auto',rating:5,text:'Actual purchase claim'},
 {avatar:'/customer2.webp',name:'Krasimir Georgiev',role:'Import customer',rating:4,text:'Actual delivery claim'},
 {avatar:'/customer3.webp',name:'Iliyan Petrov',role:'Sale customer',rating:5,text:'Actual sale claim'}
];
export const unchangedAfter = {palette:'native',layout:'three-card rail'};
`;
function importEditorialFixture(t) {
 const candidate=tinyArea(t);
 writeFixture(path.join(candidate,'src/lib/data/about-videos.ts'),"export type AboutVideo = { id:string;title:string };\nexport const youtubeChannelHref = 'https://www.youtube.com/@kristiankirilov1355/videos';\nexport const aboutVideos: AboutVideo[] = [{id:'6S3dLIgeAT8',title:'Lamborghini Urus'}];\n");
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture);
 writeFixture(path.join(candidate,'src/lib/content/extra-localized.ts'),"export const extraEnglish = {'Запазен текст':'Retained text'} as const;\n");
 // These are the selected S1 consumers' existing bindings and gates.
 const consumer="import {aboutVideos,youtubeChannelHref} from '$lib/data/about-videos';\n<YouTubeSection videos={aboutVideos} channelHref={youtubeChannelHref} />\n";
 writeFixture(path.join(candidate,'src/lib/components/home/HomePage.svelte'),consumer);
 writeFixture(path.join(candidate,'src/lib/components/home/HomeMobileEditorial.svelte'),consumer);
 return {candidate,consumer};
}
for (const countryCode of ['BG','AE']) {
 test('Import new native video/review consumers receive truthful localized examples for '+countryCode,t=>{
  const {candidate,consumer}=importEditorialFixture(t),dealer=profile(countryCode);
  const changed=applyImportSafeContent({candidate,profile:dealer});
  const videos=fs.readFileSync(path.join(candidate,'src/lib/data/about-videos.ts'),'utf8');
  assert.match(videos,/export type AboutVideo/);assert.match(videos,/youtubeChannelHref = "";/);
  assert.deepEqual(readTypeScriptCatalog(videos,'aboutVideos'),[]);
  assert.doesNotMatch(videos,/kristiankirilov|Lamborghini|6S3dLIgeAT8/);
  for(const page of ['HomePage','HomeMobileEditorial']) assert.equal(fs.readFileSync(path.join(candidate,'src/lib/components/home',page+'.svelte'),'utf8'),consumer);
  const home=fs.readFileSync(path.join(candidate,'src/lib/auxero/home-five.ts'),'utf8'),items=readTypeScriptCatalog(home,'homeFiveReviewItems');
  assert.equal(items.length,3);assert.deepEqual(items.map(r=>r.name),['№ 1','№ 2','№ 3']);
  assert.match(home,/unchangedBefore = 'native composition'/);assert.match(home,/unchangedAfter = \{palette:'native',layout:'three-card rail'\}/);
  assert.doesNotMatch(home,/Aleksandar|Krasimir|Iliyan|customer\.webp|purchase claim|delivery claim|sale claim|Day Night Auto/);
  const en=readTypeScriptCatalog(fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8'),'extraEnglish');
  assert.equal(en['Запазен текст'],'Retained text');
  for(const item of items){
   assert.equal(item.avatar,'');assert(!Object.hasOwn(item,'rating'));assert.match(item.text,/Измислен пример/);
   for(const field of ['role','excerpt','text']){assert.match(item[field],/[\u0400-\u04ff]/);assert.equal(typeof en[item[field]],'string');assert.doesNotMatch(en[item[field]],/[\u0400-\u04ff]/);}
   assert.match(en[item.text],/Fictional example/);assert.match(en[item.excerpt],/not a verified customer review/);
  }
  for(const name of ['src/lib/data/about-videos.ts','src/lib/auxero/home-five.ts','src/lib/content/extra-localized.ts'])assert(changed.includes(name));
  const first=[videos,home,fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8')];
  applyImportSafeContent({candidate,profile:dealer});
  assert.deepEqual(first,['src/lib/data/about-videos.ts','src/lib/auxero/home-five.ts','src/lib/content/extra-localized.ts'].map(name=>fs.readFileSync(path.join(candidate,name),'utf8')));
 });
}
test('Import new video boundary binds only an explicitly sourced dealer channel',t=>{
 const {candidate}=importEditorialFixture(t),dealer=profile('BG');dealer.business.socialLinks={youtube:'https://www.youtube.com/@verified-fixture'};
 applyImportSafeContent({candidate,profile:dealer});
 const videos=fs.readFileSync(path.join(candidate,'src/lib/data/about-videos.ts'),'utf8');
 assert.match(videos,/youtubeChannelHref = "https:\/\/www.youtube.com\/@verified-fixture";/);
 assert.deepEqual(readTypeScriptCatalog(videos,'aboutVideos'),[]);
});
test('Import review boundary fails closed when native source or its locale catalog changes',t=>{
 const {candidate}=importEditorialFixture(t);
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture.replace('homeFiveReviewItems','renamedUnreviewedItems'));
 assert.throws(()=>applyImportSafeContent({candidate,profile:profile('BG')}),/review export was not found exactly once/);
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture);
 writeFixture(path.join(candidate,'src/lib/content/extra-localized.ts'),"export const extraEnglish = {generated:computeTranslation()} as const;\n");
 assert.throws(()=>applyImportSafeContent({candidate,profile:profile('BG')}),/expected literal data/);
});

function importNativeCopy(candidate) {
 const source=fs.readFileSync(path.join(import.meta.dirname,'../templates/import/src/lib/content/localized.ts'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
 const extraEnglish=readTypeScriptCatalog(fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8'),'extraEnglish');
 return new Function('extraEnglish','site',stripTypeScriptTypes(source)+'\nreturn {contentText,localizedCopy};')(extraEnglish,{identity:{displayName:'Fixture Auto'}});
}

test('Import dated dealer disclosures render through the strict native EN/BG editorial boundary',t=>{
 const {candidate}=importEditorialFixture(t),dealer=profile('BG');
 for(const date of ['10.09.2026','14.10.2026']){
  dealer.business.inventoryNotice=`Представителни обяви към ${date} г. Потвърдете наличността и условията по телефона.`;
  const before=JSON.stringify(dealer);
  const changed=applyImportSafeContent({candidate,profile:dealer});
  assert(changed.includes('src/lib/content/extra-localized.ts'));
  assert.equal(new Set(changed).size,changed.length);
  const posts=readTypeScriptCatalog(fs.readFileSync(path.join(candidate,'src/lib/data/blog.ts'),'utf8'),'posts');
  const native=importNativeCopy(candidate);
  assert.equal(native.localizedCopy(posts,'en')[0].excerpt,`Representative listings as of ${date}. Confirm availability and terms by phone.`);
  assert.equal(native.localizedCopy(posts,'bg')[0].excerpt,dealer.business.inventoryNotice);
  assert.equal(posts[0].date,dealer.business.observedAt);
  assert.equal(JSON.stringify(dealer),before);
  assert.equal(native.contentText('en','Запазен текст'),'Retained text');
 }
 const catalog=fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8');
 applyImportSafeContent({candidate,profile:dealer});
 assert.equal(fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8'),catalog);
});

test('Import unknown inventory copy retains the strict missing-English error',t=>{
 const {candidate}=importEditorialFixture(t),dealer=profile('BG');
 dealer.business.inventoryNotice='Представителни обяви към неизвестна дата. Потвърдете гаранцията по телефона.';
 applyImportSafeContent({candidate,profile:dealer});
 const native=importNativeCopy(candidate);
 assert.throws(()=>native.contentText('en',dealer.business.inventoryNotice),/Missing English editorial catalog entry/);
 assert.equal(native.contentText('bg',dealer.business.inventoryNotice),dealer.business.inventoryNotice);
});
