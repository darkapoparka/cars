import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, git, json, exportCommit, filesAt, excluded } from './lib/workflow.mjs';
import { applyRefreshAdapter } from './lib/client-refresh-adapters.mjs';
import { loadDealerProfile } from './lib/client-refresh-normalize.mjs';
import { retainDealerVariantAssets, applyExtendedRefreshAdapter } from './lib/client-refresh-six.mjs';
import { prepareAppDealer } from './lib/app-dealer-adapter.mjs';
import { applyDealerIcons, inspectDealerIcon, DEALER_ICON_PATH, DEALER_MANIFEST_PATH } from './lib/uk-dealer-icons.mjs';

const lock=json(path.join(ROOT,'templates.lock.json'));
const brief=path.join(ROOT,'leads/uk-2026-10-10-briefs/gb-stockport-broadbent-car-and-servicing');
const png=fs.readFileSync(path.join(brief,'assets/app-icon.png')), ico=fs.readFileSync(path.join(brief,'assets/favicon.ico'));
const boundaries={
  'auto-best':['src/app.html','static/favicon.ico'],
  modern:['apps/web/app/[locale]/layout.tsx','apps/web/app/-/icon.png','apps/web/app/-/apple-icon.png'],
  import:['src/lib/config/site.ts','src/routes/+layout.svelte'],
  app:['app/manifest.ts','app/favicon.ico'],
  mobile:['src/app/layout.tsx','src/app/favicon.ico'],
  'karento-best':['src/lib/content.ts','src/routes/+layout.svelte']
};
const roots={'auto-best':'static',modern:'apps/web/public',import:'static',app:'public',mobile:'public','karento-best':'static'};
const source=new Map(Object.entries(boundaries).flatMap(([key,names])=>names.map(name=>[key+'/'+name,
  git(ROOT,['show',lock.templates[key].commit+':templates/'+key+'/'+name],{encoding:null})])));
const manifest={variants:Object.keys(boundaries).map((key,index)=>({key,base:index?'/variant-'+(index+1):'',
  entry:key==='modern'?'/variant-2/cars':index?'/variant-'+(index+1)+'/':'/'}))};
const profile={business:{name:'Broadbent Car and Servicing',shortName:'Broadbent',accent:'#263329',
  previewNotice:'Independent design preview.',inventoryNotice:'Dated listing samples.'}};

test('all six exact pinned icon boundaries bind to the actual retained Broadbent assets before sealing',()=>{
  const files=new Map(source), report=applyDealerIcons({files,manifest,profile,png,ico});
  for(const key of Object.keys(boundaries)) {
    assert.ok(files.get(key+'/'+roots[key]+DEALER_ICON_PATH).equals(png),key+' PNG identity');
    if(key!=='app') {
      const webmanifest=JSON.parse(files.get(key+'/'+roots[key]+DEALER_MANIFEST_PATH));
      assert.equal(webmanifest.name,profile.business.name);
      assert.equal(webmanifest.icons[0].src,'app-icon.png');
      assert.equal(webmanifest.icons[0].sizes,report.width+'x'+report.height);
      assert.equal(webmanifest.scope,'../');
      assert.equal(webmanifest.start_url,key==='modern'?'../cars':'../');
    }
  }
  assert.ok(files.get('app/public/dealer-app/icon.png').equals(png));
  for(const name of ['auto-best/static/favicon.ico','app/app/favicon.ico','mobile/src/app/favicon.ico']) assert.ok(files.get(name).equals(ico));
  for(const name of ['modern/apps/web/app/-/icon.png','modern/apps/web/app/-/apple-icon.png']) assert.ok(files.get(name).equals(png));
  assert.match(files.get('app/app/manifest.ts').toString(),new RegExp(report.width+'x'+report.height));
  assert.match(files.get('modern/apps/web/app/[locale]/layout.tsx').toString(),/manifest: withBasePath/);
  assert.match(files.get('auto-best/src/app.html').toString(),/%sveltekit\.assets%\/dealer-brand\/app-icon\.png/);
  assert.doesNotMatch(files.get('karento-best/src/routes/+layout.svelte').toString(),/template\/favicon\.svg/);
  assert.match(files.get('mobile/src/app/layout.tsx').toString(),/apple:.*dealer-brand\/app-icon\.png/);
  assert.equal(report.identityQa,false);
  assert.equal(report.rendering,'unverified');
  assert.ok(source.get('app/app/favicon.ico')!==files.get('app/app/favicon.ico'),'immutable source map is unchanged');
});

test('an unknown metadata boundary stops adaptation and renamed PNG bytes do not pass as ICO',()=>{
  const files=new Map(source);
  files.set('mobile/src/app/layout.tsx',Buffer.from('export const metadata = unknownMetadata();'));
  assert.throws(()=>applyDealerIcons({files,manifest,profile,png,ico}),/Mobile metadata/);
  const unknownModern=new Map(source);
  unknownModern.set('modern/apps/web/app/[locale]/layout.tsx',Buffer.from(source.get('modern/apps/web/app/[locale]/layout.tsx').toString().replaceAll('leadSite.logoPath','leadSite.unreviewedLogo')));
  assert.throws(()=>applyDealerIcons({files:unknownModern,manifest,profile,png,ico}),/Modern metadata/);
  assert.throws(()=>inspectDealerIcon(png,png),/genuine assets\/favicon\.ico/);
  const truncated=ico.subarray(0,23);
  assert.throws(()=>inspectDealerIcon(png,truncated),/favicon ICO|genuine assets\/favicon/);
});


test('all six icon consumers remain valid after the actual pinned dealer personalization sequence',async(t)=>{
  // A bounded text-only test fixture exercises actual adapters. No asset pools,
  // dependency directories, template clones, Git checkout or project are created.
  const temp=fs.mkdtempSync(path.join(ROOT,'runtime','uk-icons-composition-test-'));
  const slug='stockport-broadbent-car-and-servicing',client=path.join(temp,slug);
  fs.mkdirSync(client);
  const write=(name,bytes)=>{const target=path.join(client,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);};
  try {
    for(const key of Object.keys(boundaries)) exportCommit(ROOT,lock.templates[key].commit,path.join(client,key),{
      prefix:'templates/'+key,filter:(name,directory)=>!excluded(name)&&!/(?:^|\/)(?:public|static)(?:\/|$)/.test(name)&&(directory||/\.(?:[cm]?[jt]sx?|svelte|html|json|css)$/.test(name))
    });
    for(const [name,bytes] of source)write(name,bytes);
    for(const name of filesAt(brief))write(name,fs.readFileSync(path.join(brief,name)));
    const actualProfile=loadDealerProfile(client,slug);
    const actualManifest={...manifest,slug,packaging:{version:'5'},localization:{
      defaultLocale:'en',enabledLocales:['en','bg'],dealerCountry:'GB',inventoryCurrency:'GBP'
    }};
    for(const key of ['auto-best','modern','import']){
      const assets=new Map();retainDealerVariantAssets(assets,key,actualProfile,client);
      for(const [name,bytes] of assets)write(name,bytes);
      const candidate=path.join(client,key);
      applyRefreshAdapter({key,oldVariant:candidate,candidate,profile:actualProfile});
    }
    const files=new Map(filesAt(client).map(name=>[name,fs.readFileSync(path.join(client,name))]));
    const retainedBytes=[...files.values()].reduce((sum,bytes)=>sum+bytes.length,0);
    t.diagnostic(JSON.stringify({fixtureFiles:files.size,fixtureBytes:retainedBytes,sourceAssetPoolsCopied:false}));
    assert.ok(retainedBytes<128*1024**2,'Composition fixture remains bounded to text and selected identity media');
    const appFiles=new Map([...files].filter(([name])=>name.startsWith('app/')).map(([name,bytes])=>[name.slice(4),bytes]));
    const app=await prepareAppDealer(client,actualManifest,{appFiles});
    for(const [name,bytes] of app.files)files.set('app/'+name,bytes);
    files.set('app/public/dealer-app/icon.png',png);
    for(const key of ['mobile','karento-best'])applyExtendedRefreshAdapter({files,key,profile:actualProfile,client});
    assert.match(files.get('modern/apps/web/app/[locale]/layout.tsx').toString(),/url: withBasePath\(leadSite\.logoOnLight\)/);
    const result=applyDealerIcons({files,manifest:actualManifest,profile:actualProfile,png,ico});
    assert.equal(result.identityQa,false);
    assert.equal(result.rendering,'unverified');
    for(const key of Object.keys(boundaries)){
      assert.ok(files.get(key+'/'+roots[key]+DEALER_ICON_PATH).equals(png));
      for(const name of boundaries[key].filter(name=>/\.(?:tsx?|svelte|html)$/.test(name))){
        const text=files.get(key+'/'+name).toString();
        if(name==='app/manifest.ts')assert.match(text,new RegExp(result.width+'x'+result.height));
        else if(key==='import'&&name==='src/routes/+layout.svelte')assert.match(text,/<link rel="apple-touch-icon" href=\{base \+ site\.identity\.favicon\}/);
        else assert.ok(text.includes(DEALER_ICON_PATH),key+'/'+name+' has retained icon');
      }
    }
  } finally {fs.rmSync(temp,{recursive:true,force:true});}
});
