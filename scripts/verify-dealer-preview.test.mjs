import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {previewDetail,previewJourney,verifyPreview} from './verify-dealer-preview.mjs';
import {planSixDesignSelection} from './lib/six-design-release.mjs';

// Contract fixture only: no Chromium, network request or rendered-image evidence.
function fixture(t, {middle='modern', language='en', override, defect}={}) {
  const temporaryRoot=fs.realpathSync(os.tmpdir());
  const output=fs.mkdtempSync(path.join(temporaryRoot,'cars-preview-contract-'));
  t.after(()=>{
    const target=fs.realpathSync(output);
    assert.equal(path.dirname(target),temporaryRoot);
    assert(path.basename(target).startsWith('cars-preview-contract-'));
    fs.rmSync(target,{recursive:true,force:true});
  });
  const variants=planSixDesignSelection([
    {key:'auto-best',base:'',entry:'/'},
    {key:middle,base:'/variant-2',entry:middle==='modern'?'/variant-2/cars':'/variant-2/'},
    {key:'carwow',base:'/variant-3',entry:'/variant-3/'}
  ]).variants;
  const manifest={schemaVersion:1,slug:'preview-fixture',repository:'darkapoparka/cars-preview-fixture',
    packaging:{version:'5'},variants,language,switcher:{language},
    localization:{schemaVersion:1,dealerId:'preview-fixture',defaultLocale:language,enabledLocales:['en','bg'],dealerCountry:'BG',inventoryCurrency:'EUR'},
    ...(override?{qa:{journeys:override}}:{})};
  const origin='https://preview-fixture.example',visited=[],pages=[];
  const entries=variants.map(v=>['mobile','karento-best'].includes(v.key)?v.entry+'?lang='+language:
    v.base+'/'+language+(v.entry.slice(v.base.length)==='/'?'':v.entry.slice(v.base.length)));
  const node=(href,key,home=false)=>({href:new URL(href,origin).href,dataset:{designKey:key,...(home?{homeId:'2'}:{})},
    getAttribute:n=>n==='href'?href:n==='data-design-key'?key:n==='data-home-id'&&home?'2':null});
  const choices=variants.map((v,i)=>node(entries[i],v.key));
  const home=node('/variant-4/'+language+'/2','app',true);
  const adminHref=defect==='admin-origin'?'https://foreign.example/':'https://cars-admin-blue.vercel.app/?dealer=preview-fixture';
  const chromium={launch:async()=>({close:async()=>{},newPage:async()=>{
    let href=origin+'/',expanded=false;
    const index=()=>Math.max(0,variants.findIndex(v=>v.base&&(new URL(href).pathname===v.base||new URL(href).pathname.startsWith(v.base+'/'))));
    const family=()=>variants[index()].key;
    const locale=()=>{
      const url=new URL(href),current=variants[index()],requested=['mobile','karento-best'].includes(current.key)?url.searchParams.get('lang'):url.pathname.slice(current.base.length).split('/')[1];
      return ['en','bg'].includes(requested)?requested:language;
    };
    const locator=rows=>({filter(){return this;},first(){return locator(rows.slice(0,1));},nth(n){return locator(rows.slice(n,n+1));},
      count:async()=>rows.length,evaluateAll:async fn=>fn(rows),getAttribute:async name=>rows[0]?.getAttribute(name),
      click:async()=>{assert.equal(rows.length,1);href=rows[0].href;expanded=false;}});
    const assertButton=name=>{
      const expected=(locale()==='bg'?'Дизайн':'Design')+' '+(index()+1)+' / 6';
      assert(name instanceof RegExp?name.test(expected):name===expected,'Switcher button must use actual six-choice accessible name; received '+name);
    };
    const button=name=>({waitFor:async()=>assertButton(name),click:async()=>{assertButton(name);expanded=!expanded;},getAttribute:async()=>String(expanded),evaluate:async()=>true});
    const menu={waitFor:async()=>assert(expanded),evaluate:async()=>true,
      getByRole:()=>locator([...choices,home]),locator:selector=>{assert.equal(selector,'a[data-design-key]:not([data-home-id])');return locator(choices);}};
    const admin={count:async()=>defect==='missing-admin'?0:1,waitFor:async()=>{},click:async()=>{},
      evaluate:async fn=>fn({getAttribute:n=>({href:adminHref,target:'_blank',rel:'noopener noreferrer'})[n]})};
    const detail=()=>{
      const v=variants[index()],prefix=v.base+(['mobile','karento-best'].includes(v.key)?'':'/'+language);
      const suffix={'auto-best':'/listing-detail-v1/actual-id',modern:'/listing/actual-id',import:'/inventory/actual-id',app:'/cars/actual-id',mobile:'/vehicle/actual-id','karento-best':'/vehicle?id=actual-id'}[v.key];
      return node(prefix+suffix,v.key);
    };
    const page={on(){},url:()=>href,goto:async target=>{
      assert.equal(new URL(target).origin,origin,'Fixture must not request a foreign origin');
      const entry=variants.findIndex(v=>new URL(target).pathname===v.entry&&!new URL(target).search);
      href=new URL(entry>=0?entries[entry]:target,origin).href;visited.push(href);
      const failed=defect==='app-contact'&&family()==='app'&&new URL(href).pathname.endsWith('/stores');
      return {status:()=>failed?500:200,ok:()=>!failed};
    },waitForLoadState:async()=>{},evaluate:async()=>({title:'Fixture',bodyLength:300,overflow:0,broken:[],phones:['tel:+441234567890'],staleIdentity:[]}),
      screenshot:async()=>{},keyboard:{press:async()=>{expanded=false;}},setViewportSize:async()=>{},close:async()=>{},
      waitForEvent:async event=>{assert.equal(event,'popup');return {url:()=>adminHref,waitForLoadState:async()=>{},close:async()=>{}};},
      getByRole:(role,options)=>{
        if(role==='button')return button(options.name);
        assert.equal(role,'navigation');assert.equal(options.name,locale()==='bg'?'Изберете дизайн':'Choose a design');return menu;
      },
      locator:selector=>{
        if(selector==='a[data-cars-admin]')return admin;
        if(selector==='a[href]')return locator([node('/variant-4/'+language+'/cars','app'),detail()]);
        if(selector.startsWith('input'))return locator([]);
        if(selector.startsWith('a[href*='))return locator([detail()]);
        throw Error('Unimplemented fixture locator '+selector);
      }};
    pages.push(page);return page;
  }})};
  return {manifest,origin,output,chromium,visited,pages};
}

test('six-design smoke resolves native journeys and ignores extra home links when counting designs',async t=>{
  const f=fixture(t),result=await verifyPreview({slug:f.manifest.slug,...f,widths:[390]});
  assert.equal(result.passed,true,JSON.stringify(result.results.map(r=>({key:r.key,failure:r.failure}))));
  assert.equal(result.results.length,6);
  assert.deepEqual(result.results.map(r=>r.key),f.manifest.variants.map(v=>v.key));
  for(const row of result.results){assert.equal(row.routes.length,4);assert.equal(row.designChoices.length,6);assert.equal(row.adminOpened,true);}
  for(const suffix of ['/en/listing-grid','/variant-2/en/cars','/variant-3/en/inventory','/variant-4/en/cars','/variant-4/en/stores','/variant-5/results?lang=en','/variant-6/vehicles?lang=en','/variant-6/vehicle?id=actual-id'])assert(f.visited.some(href=>href.endsWith(suffix)),suffix);
  assert.equal(result.access.publicWithoutShareLink,true);
});

test('Import-first manifests retain their mounts and all six designs are counted at both widths',async t=>{
  const f=fixture(t,{middle:'import',language:'bg'}),result=await verifyPreview({slug:f.manifest.slug,...f});
  assert.equal(result.passed,true,JSON.stringify(result.results.map(r=>r.failure)));
  assert.equal(result.results.length,12);
  assert(f.visited.some(href=>href.endsWith('/variant-2/bg/inventory')));
  assert(f.visited.some(href=>href.endsWith('/variant-3/bg/cars')));
});

test('one missing shared Admin, foreign Admin origin or failed App contact keeps smoke failed',async t=>{
  for(const defect of ['missing-admin','admin-origin','app-contact']){
    const f=fixture(t,{defect}),result=await verifyPreview({slug:f.manifest.slug,...f,widths:[390]});
    assert.equal(result.passed,false,defect);
    assert.equal(result.access.publicWithoutShareLink,false);
  }
});

test('explicit public journey overrides preserve locale/query routes without changing the manifest',async t=>{
  const f=fixture(t,{override:{mobile:{inventory:'/variant-5/results?lang=bg&sort=price',contact:'/variant-5/contact?lang=bg'}}}),before=JSON.stringify(f.manifest);
  const result=await verifyPreview({slug:f.manifest.slug,...f,widths:[390]});
  assert.equal(result.passed,true,JSON.stringify(result.results.map(r=>r.failure)));
  assert(f.visited.some(href=>href.endsWith('/variant-5/results?lang=bg&sort=price')));
  assert(f.visited.some(href=>href.endsWith('/variant-5/contact?lang=bg')));
  assert.equal(JSON.stringify(f.manifest),before);
});

test('journey overrides cannot escape their design mount and legacy Modern contact keeps its locale',t=>{
  const f=fixture(t),mobile=f.manifest.variants.find(v=>v.key==='mobile');
  for(const route of ['https://foreign.example/contact','//foreign.example/contact','/variant-4/en/stores','/variant-5/../en/contact']){
    f.manifest.qa={journeys:{mobile:{contact:route}}};
    assert.throws(()=>previewJourney(f.manifest,mobile),/public path|design mount/);
  }
  const modern={key:'modern',base:'/variant-2',entry:'/variant-2/cars'};
  const legacy={packaging:{version:'1'},language:'en',variants:[{key:'auto-best',base:'',entry:'/'},modern,{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]};
  assert.deepEqual(previewJourney(legacy,modern),{inventory:'/variant-2/cars',detail:'/variant-2/listing/',contact:'/variant-2/en/contact'});
  legacy.language='bg';assert.equal(previewJourney(legacy,modern).contact,'/variant-2/bg/contact');
});

test('detail discovery keeps exact native public URLs and rejects foreign or malformed candidates',()=>{
  const inventory='https://preview-fixture.example/variant-5/results?lang=bg';
  assert.equal(previewDetail(['http://','https://foreign.example/variant-5/vehicle/id','https://name:secret@preview-fixture.example/variant-5/vehicle/id','/variant-5/vehicle/id?lang=bg'],inventory,'/variant-5/vehicle/'),'/variant-5/vehicle/id?lang=bg');
  assert.equal(previewDetail(['/variant-6/vehicles','/variant-6/vehicle?id=real-stock&lang=en'],inventory,'/variant-6/vehicle'),'/variant-6/vehicle?id=real-stock&lang=en');
});

test('empty viewport selection cannot create a passing acceptance result',async t=>{
  const f=fixture(t);await assert.rejects(verifyPreview({slug:f.manifest.slug,...f,widths:[]}),/positive viewport/);
  assert.equal(f.pages.length,0);
});
