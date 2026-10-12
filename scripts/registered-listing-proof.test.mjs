import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readOriginalTupleListingRecords,readOriginalSunnyListingRecords,originalListingIdRecorded,originalListingSourceRecorded} from './lib/registered-listing-proof.mjs';
import {readCatalogLiteral,readTypeScriptCatalog} from './lib/catalog-literal.mjs';
import {validateRegisteredPersonalization} from './registered-dealer-adoption.mjs';
import {readRegisteredPersonalization,loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {sha256} from './lib/workflow.mjs';
const source=slug=>fs.readFileSync(process.env.CARS_HISTORICAL_LISTING_FIXTURE_ROOT?path.join(process.env.CARS_HISTORICAL_LISTING_FIXTURE_ROOT,slug+'.ts'):fileURLToPath(new URL('./test-fixtures/historical-listings/'+slug+'.ts',import.meta.url)));
const expected={
 'rqs-auto-team':['11724246018394817','11752568346883957'],
 'sprint-auto-varna':['21766075081643432','84641185'],
 'evrocar-varna-09':['11764956071799029','11751724444140717'],
 'europa-varna':['21781896273585445','11761848228910347']
};
const sunnyIds=['11785246205747169','21742745404828023','11753359500914380','21742571140983319','11756481171645307','11767106522243743','21758614493706426','21742139197389610'];
const tuples=(slug)=>readOriginalTupleListingRecords(source(slug));
const change=(bytes,from,to)=>{const text=bytes.toString();assert(text.includes(from));return Buffer.from(text.replace(from,to));};
test('all four exact historical tuple sources preserve every original row and recorded ID',()=>{
 for(const [slug,ids]of Object.entries(expected)){const bytes=source(slug),before=sha256(bytes),rows=tuples(slug);assert.equal(rows.length,8);assert.deepEqual(rows.filter(r=>r.sourceId).map(r=>r.sourceId),ids);assert.equal(rows.filter(r=>r.sourceId==='').length,6);for(const row of rows.filter(r=>r.sourceId)){assert(originalListingIdRecorded(bytes,row.sourceId));assert(originalListingSourceRecorded(bytes,row.sourceId,row.sourceUrl));}assert.equal(sha256(bytes),before);}
 const evro=tuples('evrocar-varna-09');assert(evro.every(r=>!Object.hasOwn(r,'mileageKm')&&!Object.hasOwn(r,'transmission')),'no hardcoded renderer mileage/transmission become source facts');
 const sprint=tuples('sprint-auto-varna');assert.equal(sprint[1].sourceId,'84641185');assert.match(sprint[1].sourceUrl,/auto\.bg/,'preserve real Auto.bg ID, without relabeling it as a Mobile ID');
});
test('RQS six missing IDs remain unknown and tuple provenance binds the exact ID/URL pair',()=>{
 for(const slug of Object.keys(expected)){const bytes=source(slug),rows=tuples(slug),known=rows.filter(r=>r.sourceId);assert.equal(originalListingSourceRecorded(bytes,known[0].sourceId,known[1].sourceUrl),false);assert.equal(originalListingIdRecorded(bytes,known[0].sourceId.slice(1)),false);for(const row of rows.filter(r=>!r.sourceId)){assert.equal(originalListingIdRecorded(bytes,''),false);assert.equal(originalListingIdRecorded(bytes,row.slug),false);assert.equal(originalListingSourceRecorded(bytes,String(rows.indexOf(row)+1),row.sourceUrl||'https://example.com'),false);}}
});
test('unsupported tuple fields, duplicate IDs, computed data and comment-only declarations reject',()=>{
 const bytes=source('rqs-auto-team'),rows=tuples('rqs-auto-team');
 for(const bad of [change(bytes,'sourceId:string,sourceUrl:string','noteId:string,sourceUrl:string'),change(bytes,'const rows:Row[]=[','const rows:Row[]=run(['),change(bytes,"'11752568346883957'","'11724246018394817'"),Buffer.from('/*\n'+bytes.toString().replaceAll('*/','* /')+'\n*/')])assert.throws(()=>readOriginalTupleListingRecords(bad));
 const arbitrary=Buffer.from("const unrelated=[['11724246018394817','"+rows[0].sourceUrl+"']];");assert.equal(originalListingIdRecorded(arbitrary,'11724246018394817'),false);
});
test('Sunny literal source IDs and slugs safely derive all eight exact original URLs',()=>{
 const bytes=source('sunny-varna'),before=sha256(bytes),rows=readOriginalSunnyListingRecords(bytes);assert.equal(rows.length,8);assert.deepEqual(rows.map(r=>r.sourceId),sunnyIds);assert.equal(rows[2].engineCc,null);for(const row of rows){assert.equal(bytes.toString().includes(row.sourceUrl),false);assert(originalListingIdRecorded(bytes,row.sourceId));assert(originalListingSourceRecorded(bytes,row.sourceId,row.sourceUrl));assert.equal(originalListingSourceRecorded(bytes,row.sourceId,row.sourceUrl.replace('sunny.mobile.bg','other.mobile.bg')),false);}assert.equal(originalListingSourceRecorded(bytes,rows[0].sourceId,rows[1].sourceUrl),false);assert.equal(sha256(bytes),before);
});
test('Sunny URL templates reject changed hosts/expressions, overrides, executable notes and comment spoofing',()=>{
 const bytes=source('sunny-varna'),row=readOriginalSunnyListingRecords(bytes)[0];
 for(const bad of [change(bytes,'https://sunny.mobile.bg/obiava-','https://other.mobile.bg/obiava-'),change(bytes,'record.sourceId','getId(record)'),change(bytes,'...record, sourceUrl:','...record, sourceUrl:evil, sourceUrl:'),change(bytes,'sourceNote:catalogueNote','sourceNote:run(catalogueNote)'),change(bytes,"const catalogueNote = '","const catalogueNote = run('"),change(bytes,"slug:'vw-beetle-gaz-benzin'","slug:'../escape'"),change(bytes,"sourceId:'21742745404828023'","sourceId:'11785246205747169'")]){assert.throws(()=>readOriginalSunnyListingRecords(bad));assert.equal(originalListingSourceRecorded(Buffer.concat([bad,Buffer.from('\n// '+row.sourceUrl)]),row.sourceId,row.sourceUrl),false);}
 assert.throws(()=>readOriginalSunnyListingRecords(Buffer.from('/*\n'+bytes.toString().replaceAll('*/','* /')+'\n*/')));
});
test('the shared literal parser defaults to rejecting identifiers and accepts only explicit literal string data',()=>{
 assert.throws(()=>readTypeScriptCatalog('const rows=[note];','rows'));
 assert.deepEqual(readTypeScriptCatalog('const rows=[note,null];','rows',{literalIdentifiers:new Map([['note','Recorded note']])}),['Recorded note',null]);
 for(const text of ['const rows=[note()];','const rows=[{get sourceId(){return 1}}];','const rows=[...other];','const rows=[note+"suffix"];'])assert.throws(()=>readTypeScriptCatalog(text,'rows',{literalIdentifiers:new Map([['note','Recorded note']])}));
 assert.throws(()=>readCatalogLiteral('note',0,{literalIdentifiers:new Map([['note',()=>1]])}));
});
// Byte-only media fixtures exercise the maintained proof guards; they do not
// purport to authenticate or materialize this dealer's public inventory photos.
function derivedFixture(slug){
 const bytes=source(slug),row=(slug==='sunny-varna'?readOriginalSunnyListingRecords(bytes):readOriginalTupleListingRecords(bytes)).find(r=>r.sourceId),proof={path:'carwow/src/lib/data/dealer.ts',sha256:sha256(bytes)},logo=Buffer.from('retained-raster-logo-test-bytes'),photo=Buffer.from('retained-stock-photo-test-bytes'),identity={dealerId:slug,repository:'darkapoparka/cars-'+slug};
 const files=new Map([[proof.path,bytes],['carwow/static/brand/logo.png',logo],['carwow/static/stock/original.webp',photo]]),input={schemaVersion:1,kind:'cars-registered-dealer-derived-inputs',dealer:slug,reviewed:true,reviewedAt:'2026-10-12T00:00:00Z',facts:{business:{name:slug,countryCode:'BG',currency:'EUR',city:'Varna',logo:'/brand/logo.png',logoDark:'/brand/logo.png',inventoryNotice:'Dated listings; confirm availability.',previewNotice:'Independent proposal.'}},stock:{kind:'dated-listing-snapshot',listings:[{...row,id:row.sourceId,title:row.title||row.make+' '+row.model,sourceUrl:row.sourceUrl,images:['/stock/original.webp'],sourceRecord:{...proof,id:row.sourceId}}]},locale:{schemaVersion:1,dealerId:slug,defaultLocale:'bg',enabledLocales:['bg','en'],dealerCountry:'BG',inventoryCurrency:'EUR'},sourceEvidence:[proof],media:[{publicPath:'/brand/logo.png',sourcePath:'carwow/static/brand/logo.png',sha256:sha256(logo)},{publicPath:'/stock/original.webp',sourcePath:'carwow/static/stock/original.webp',sha256:sha256(photo)}]};return {bytes,row,files,input,identity};
}
test('actual maintained derived-input admission accepts only original supported tuple/Sunny source joins',()=>{
 for(const slug of [...Object.keys(expected),'sunny-varna']){const f=derivedFixture(slug),before=sha256(f.bytes);assert.equal(validateRegisteredPersonalization(f.input,{dealer:slug,identity:f.identity,baseline:{files:f.files}}).media.size,2);assert.equal(sha256(f.bytes),before);for(const mutate of [x=>x.stock.listings[0].sourceUrl='https://example.com/invented',x=>x.stock.listings[0].id='invented',x=>x.media[1].sha256='0'.repeat(64),x=>x.sourceEvidence[0].sha256='0'.repeat(64)]){const bad=structuredClone(f.input);mutate(bad);assert.throws(()=>validateRegisteredPersonalization(bad,{dealer:slug,identity:f.identity,baseline:{files:f.files}}));}}
});
test('ordinary sealed profile-loader provenance recognizes the same exact original source records',()=>{
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../test-output/historical-profile-loader');fs.mkdirSync(root,{recursive:true});
 for(const slug of [...Object.keys(expected),'sunny-varna']){const f=derivedFixture(slug),client=path.join(root,slug),enc=v=>Buffer.from(JSON.stringify(v,null,2)+'\n'),inputBytes=enc(f.input),inputPin={path:'.client/registered-personalization.json',sha256:sha256(inputBytes)},receipt={schemaVersion:1,kind:'cars-registered-dealer-source-adoption',dealer:slug,reviewed:true,reviewedAt:'2026-10-12T00:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,identity:f.identity,personalization:inputPin},receiptBytes=enc(receipt),receiptPin={path:'.client/registered-source-adoption.json',sha256:sha256(receiptBytes)};
  for(const [name,b]of [...f.files,['dealer.json',enc({slug,dealerId:slug,repository:f.identity.repository,registeredSourceAdoption:{receipt:receiptPin,personalization:inputPin}})],[inputPin.path,inputBytes],[receiptPin.path,receiptBytes]]){const target=path.resolve(client,name);assert(target.startsWith(client+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
  assert.equal(readRegisteredPersonalization(client,slug).stock.listings[0].id,f.row.sourceId);const profile=loadDealerProfile(client,slug);assert.equal(profile.listings[0].sourceId,f.row.sourceId);assert.equal(profile.listings[0].sourceUrl,f.row.sourceUrl);assert.deepEqual(profile.listings[0].images,['/stock/original.webp']);assert.equal(sha256(fs.readFileSync(path.join(client,'carwow/src/lib/data/dealer.ts'))),sha256(f.bytes));
 }
});

test('comment-only actual Sunny records and URL comments cannot enter the joined provenance helper',()=>{
 const bytes=source('sunny-varna'),before=sha256(bytes),rows=readOriginalSunnyListingRecords(bytes);
 const commentOnly=Buffer.from('/*\n'+bytes.toString().replaceAll('*/','* /')+'\n*/\n// '+rows[0].sourceUrl+'\n');
 assert.throws(()=>readOriginalSunnyListingRecords(commentOnly));
 assert.equal(originalListingIdRecorded(commentOnly,rows[0].sourceId),false);
 assert.equal(originalListingSourceRecorded(commentOnly,rows[0].sourceId,rows[0].sourceUrl),false);
 assert.equal(sha256(bytes),before);
});
test('legacy literal JSON/object provenance preserves real IDs and requires the URL in the same record',()=>{
 const rows=readOriginalSunnyListingRecords(source('sunny-varna')),[first,second]=rows;
 const object={listings:[{id:first.sourceId,sourceUrl:first.sourceUrl},{id:second.sourceId,sourceUrl:second.sourceUrl}]},json=Buffer.from(JSON.stringify(object));
 assert(originalListingIdRecorded(json,first.sourceId));assert(originalListingSourceRecorded(json,first.sourceId,first.sourceUrl));
 assert.equal(originalListingSourceRecorded(json,first.sourceId,second.sourceUrl),false);
 const typedSource=Buffer.from('export const stock = '+JSON.stringify(object.listings)+';');
 assert(originalListingSourceRecorded(typedSource,first.sourceId,first.sourceUrl));
 const sprint=tuples('sprint-auto-varna').find(row=>row.sourceId==='84641185');
 const numericSource=Buffer.from('export const original = {stockId:84641185,originalUrl:'+JSON.stringify(sprint.sourceUrl)+'};');
 assert(originalListingIdRecorded(numericSource,sprint.sourceId));assert(originalListingSourceRecorded(numericSource,sprint.sourceId,sprint.sourceUrl));
 for(const bad of [
  Buffer.from('/* '+json.toString()+' */\n// '+first.sourceUrl),
  Buffer.from('const original={sourceId:'+JSON.stringify(first.sourceId)+'};\n// '+first.sourceUrl),
  Buffer.from('const original={sourceId:'+JSON.stringify(first.sourceId)+'};const unrelated={sourceUrl:'+JSON.stringify(first.sourceUrl)+'};'),
  Buffer.from('const note='+JSON.stringify(json.toString())+';'),
  Buffer.from('const original={sourceId:run(),sourceUrl:'+JSON.stringify(first.sourceUrl)+'};')
 ])assert.equal(originalListingSourceRecorded(bad,first.sourceId,first.sourceUrl),false);
 assert.equal(originalListingIdRecorded(Buffer.from('/* '+json.toString()+' */'),first.sourceId),false);
});
test('both maintained consumers reject comment-only source proof even with matching byte pins',()=>{
 const slug='sunny-varna',f=derivedFixture(slug),bad=Buffer.from('/*\n'+f.bytes.toString().replaceAll('*/','* /')+'\n*/\n// '+f.row.sourceUrl+'\n'),p=f.input.sourceEvidence[0];
 f.files.set(p.path,bad);p.sha256=sha256(bad);f.input.stock.listings[0].sourceRecord.sha256=p.sha256;
 assert.throws(()=>validateRegisteredPersonalization(f.input,{dealer:slug,identity:f.identity,baseline:{files:f.files}}),/listing ID\/source URL absent/);
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../test-output/comment-only-source-proof'),client=path.join(root,slug),enc=v=>Buffer.from(JSON.stringify(v,null,2)+'\n'),inputBytes=enc(f.input),inputPin={path:'.client/registered-personalization.json',sha256:sha256(inputBytes)},receipt={schemaVersion:1,kind:'cars-registered-dealer-source-adoption',dealer:slug,reviewed:true,reviewedAt:'2026-10-12T00:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,identity:f.identity,personalization:inputPin},receiptBytes=enc(receipt),receiptPin={path:'.client/registered-source-adoption.json',sha256:sha256(receiptBytes)};
 for(const [name,b]of [...f.files,['dealer.json',enc({slug,dealerId:slug,repository:f.identity.repository,registeredSourceAdoption:{receipt:receiptPin,personalization:inputPin}})],[inputPin.path,inputBytes],[receiptPin.path,receiptBytes]]){const target=path.resolve(client,name);assert(target.startsWith(client+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
 assert.throws(()=>readRegisteredPersonalization(client,slug),/listing ID\/source URL absent/);
 assert.throws(()=>loadDealerProfile(client,slug),/listing ID\/source URL absent/);
});

test('legacy JSON source pairs remain accepted by both maintained consumers with exact original IDs',()=>{
 const slug='sunny-varna',f=derivedFixture(slug),original=sha256(f.bytes),p=f.input.sourceEvidence[0],json=Buffer.from(JSON.stringify({listings:[{id:f.row.sourceId,sourceUrl:f.row.sourceUrl}]}));
 f.files.set(p.path,json);p.sha256=sha256(json);f.input.stock.listings[0].sourceRecord.sha256=p.sha256;
 assert.equal(validateRegisteredPersonalization(f.input,{dealer:slug,identity:f.identity,baseline:{files:f.files}}).media.size,2);
 const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../test-output/legacy-json-source-proof'),client=path.join(root,slug),enc=v=>Buffer.from(JSON.stringify(v,null,2)+'\n'),inputBytes=enc(f.input),inputPin={path:'.client/registered-personalization.json',sha256:sha256(inputBytes)},receipt={schemaVersion:1,kind:'cars-registered-dealer-source-adoption',dealer:slug,reviewed:true,reviewedAt:'2026-10-12T00:00:00Z',nativeApproval:false,hostedApproval:false,globalReleaseApproval:false,identity:f.identity,personalization:inputPin},receiptBytes=enc(receipt),receiptPin={path:'.client/registered-source-adoption.json',sha256:sha256(receiptBytes)};
 for(const [name,b]of [...f.files,['dealer.json',enc({slug,dealerId:slug,repository:f.identity.repository,registeredSourceAdoption:{receipt:receiptPin,personalization:inputPin}})],[inputPin.path,inputBytes],[receiptPin.path,receiptBytes]]){const target=path.resolve(client,name);assert(target.startsWith(client+path.sep));fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
 assert.equal(readRegisteredPersonalization(client,slug).stock.listings[0].id,f.row.sourceId);
 assert.equal(loadDealerProfile(client,slug).listings[0].sourceUrl,f.row.sourceUrl);
 assert.equal(sha256(f.bytes),original);
});
