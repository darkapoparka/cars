import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {DEALERS, JOURNEYS, TOOLING, validateIdentity, withinFamily, listingIdentity, chooseFilter, checkFiltered, shouldBlockRequest, diagnosticFailures, stockRecords, phoneDigits} from './verify-uk-hosted.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const git=process.platform==='win32'?'L:/Toolchains/Git/2.54.0/cmd/git.exe':'git';
const source='fabcc0704a8eea8646eee254af41f03947ce674c';
const dealer='stockport-broadbent-car-and-servicing';
const bytes=file=>execFileSync(git,['-C',root,'show',source+':clients/'+dealer+'/'+file],{maxBuffer:2*1024*1024});
const manifest=JSON.parse(bytes('dealer.json'));
const actualStock=JSON.parse(bytes('stock.json'));
const records=stockRecords(actualStock);
const identity={dealer,sourceCommit:source,publishedCommit:'a'.repeat(40),packageDigest:'b'.repeat(64)};
const origin=manifest.shareIdentity.publicOrigin;

test('exact canonical six-design manifest binds only the intended UK Cloudflare identity',()=>{
  const result=validateIdentity(identity,manifest);
  assert.equal(result.origin,origin);
  assert.equal(result.repository,'darkapoparka/cars-uk-'+dealer);
  for(const mutate of [
    m=>m.variants.pop(),
    m=>m.variants.reverse(),
    m=>m.variants[5].base='/variant-7',
    m=>m.variants[0].entry='https://example.org/',
    m=>m.shareIdentity.publicOrigin='https://other.workers.dev',
    m=>m.cloudflare.workerPrefix='cars-'+dealer,
    m=>m.localization.inventoryCurrency='EUR',
  ]){const m=structuredClone(manifest);mutate(m);assert.throws(()=>validateIdentity(identity,m));}
  assert.throws(()=>validateIdentity({...identity,sourceCommit:'main'},manifest));
  assert.throws(()=>validateIdentity({...identity,publishedCommit:''},manifest));
  assert.throws(()=>validateIdentity({...identity,dealer:'../another'},manifest));
  assert.equal(DEALERS.length,10);
});

test('real dated UK snapshot accepts numeric GBP prices and retains exact source identities',()=>{
  assert.equal(records.length,10);
  assert.deepEqual(records[0],{id:'860026521888',slug:'peugeot-partner-2017-860026521888',make:'Peugeot',model:'Partner',year:2017,price:3995});
  assert.equal(records.filter(row=>row.make==='Ford').length,6);
  const wrong=structuredClone(actualStock);wrong.records[0].currency='EUR';
  assert.throws(()=>stockRecords(wrong),/Incomplete source vehicle/);
  const duplicate=structuredClone(actualStock);duplicate.records[1].id=duplicate.records[0].id;
  assert.throws(()=>stockRecords(duplicate),/Duplicate/);
  const nonNumeric=structuredClone(actualStock);nonNumeric.records[0].price={amount:3995,currency:'GBP'};
  assert.throws(()=>stockRecords(nonNumeric),/Incomplete/);
});

test('detail identity mapping follows actual six-family routes and rejects foreign or unknown stock',()=>{
  const first=records[0].id;
  const hrefs={
    'auto-best':'/listing-detail-v1/1',
    modern:'/variant-2/listing/peugeot-partner-2017-860026521888',
    import:'/variant-3/inventory/860026521888',
    app:'/variant-4/en/cars/peugeot-partner-2017-860026521888',
    mobile:'/variant-5/vehicle/860026521888',
    'karento-best':'/variant-6/vehicle?id=860026521888',
  };
  for(const [key,href]of Object.entries(hrefs)){
    assert.equal(listingIdentity(href,key,origin,records).id,first,key);
    assert.equal(listingIdentity('https://example.org'+href,key,origin,records),null);
    assert.equal(listingIdentity(href+'#photo',key,origin,records).id,first);
  }
  assert.equal(listingIdentity('/variant-5/vehicle/other','mobile',origin,records).id,null);
  assert.equal(listingIdentity('/listing-detail-v1/999','auto-best',origin,records).id,null);
  assert.equal(listingIdentity('/variant-5/vehicle/860026521888/gallery','mobile',origin,records),null);
  assert.equal(listingIdentity('/variant-6/vehicle','karento-best',origin,records).id,null);
  assert.equal(listingIdentity(hrefs.modern,'auto-best',origin,records),null);
});

test('family navigation validates complete path boundaries, scheme, authority and credentials',()=>{
  assert(withinFamily('/variant-2/en/cars?q=Ford','modern',origin));
  assert(withinFamily('/variant-2','modern',origin));
  assert(!withinFamily('/variant-20/cars','modern',origin));
  assert(!withinFamily('/variant-2/../variant-3/inventory','modern',origin));
  assert(!withinFamily('//example.org/variant-2/cars','modern',origin));
  assert(!withinFamily('javascript:alert(1)','modern',origin));
  assert(!withinFamily('https://user@'+new URL(origin).host+'/variant-2/cars','modern',origin));
  assert(withinFamily('/contact','auto-best',origin));
  assert(!withinFamily('/variant-6/contact','auto-best',origin));
});

test('keyword selection uses the actually rendered subset, including Modern car-only inventory',()=>{
  const all=records.map(row=>({id:row.id}));
  const full=chooseFilter(records,all);
  assert.equal(full.query,'Ford');assert.equal(full.ids.length,6);
  const cars=records.filter(row=>['Mondeo','Fiesta','Clio','Astra'].includes(row.model)).map(row=>({id:row.id}));
  const narrowed=chooseFilter(records,cars);
  assert.equal(narrowed.query,'Ford');assert.equal(narrowed.ids.length,2);
  assert.throws(()=>chooseFilter(records,[{id:records[0].id}]),/at least two makes/);
});

test('filter proof rejects unchanged, incomplete, unknown and wrong rendered results',()=>{
  const baseline=records.map(row=>({id:row.id}));
  const choice=chooseFilter(records,baseline);
  const filtered=choice.ids.map(id=>({id}));
  assert.deepEqual(checkFiltered(filtered,baseline,choice),[...choice.ids].sort());
  assert.deepEqual(checkFiltered([...filtered,filtered[0]],baseline,choice),[...choice.ids].sort());
  assert.throws(()=>checkFiltered(baseline,baseline,choice),/differ/);
  assert.throws(()=>checkFiltered(filtered.slice(1),baseline,choice),/differ/);
  assert.throws(()=>checkFiltered([...filtered,{id:null}],baseline,choice),/unknown/);
  assert.throws(()=>checkFiltered([],baseline,choice),/no known/);
});

test('browser guard blocks mutation requests and external navigation while preserving real public GET assets',()=>{
  for(const method of ['POST','PUT','PATCH','DELETE','CONNECT'])assert(shouldBlockRequest({method,url:origin+'/contact',mainDocument:false},origin));
  assert.equal(shouldBlockRequest({method:'GET',url:origin+'/variant-3/api/inventory/count?q=Ford',mainDocument:false},origin),null);
  assert.equal(shouldBlockRequest({method:'HEAD',url:origin+'/',mainDocument:true},origin),null);
  assert.equal(shouldBlockRequest({method:'GET',url:'https://cdn.example.org/logo.png',mainDocument:false},origin),null);
  assert(shouldBlockRequest({method:'GET',url:'https://example.org/contact',mainDocument:true},origin));
});

test('render diagnostics fail on overflow, broken images, runtime error UI and inherited/default identity',()=>{
  const good={bodyLength:1200,overflow:0,broken:[],staleIdentity:[],errorUi:false,lang:'en-GB'};
  assert.deepEqual(diagnosticFailures(good),[]);
  for(const change of [{bodyLength:0},{overflow:2},{broken:[{src:'x.png'}]},{staleIdentity:['Other Dealer']},{errorUi:true},{lang:'bg'}])assert.equal(diagnosticFailures({...good,...change}).length,1);
});

test('approved browser tooling comes from the inspected immutable Auto Best bytes',()=>{
  const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  const packageBytes=execFileSync(git,['-C',root,'show',TOOLING.commit+':templates/auto-best/package.json']);
  const lockBytes=execFileSync(git,['-C',root,'show',TOOLING.commit+':templates/auto-best/package-lock.json'],{maxBuffer:2*1024*1024});
  assert.equal(sha(packageBytes),TOOLING.packageSha256);
  assert.equal(sha(lockBytes),TOOLING.lockSha256);
  const lock=JSON.parse(lockBytes);
  assert.equal(lock.packages['node_modules/playwright'].version,'1.62.1');
  assert.equal(lock.packages['node_modules/playwright-core'].version,'1.62.1');
  assert.equal(Object.keys(JOURNEYS).length,6);
});

test('UK national, E164 and international-prefix phone formats compare without accepting a different destination',()=>{
  assert.equal(phoneDigits('tel:07398 540293'),phoneDigits('tel:+44 7398 540293'));
  assert.equal(phoneDigits('tel:0044-7398-540293'),phoneDigits('+447398540293'));
  assert.equal(phoneDigits('020 7946 0123'),phoneDigits('+44 (20) 7946 0123'));
  assert.notEqual(phoneDigits('07398 540294'),phoneDigits('+447398540293'));
  assert.notEqual(phoneDigits('+359 7398 540293'),phoneDigits('+447398540293'));
});
