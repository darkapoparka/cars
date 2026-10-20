import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {AUTO_BEST_PHONE_BOUNDARIES} from './publishing/auto-best-optional-contact.mjs';
import {applyOptionalContactFallback} from './publishing/dealer-contact-fallback.mjs';

const root=fileURLToPath(new URL('..',import.meta.url)),prefix='auto-best/';
const require=createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM||new URL('../templates/karento-best/package.json',import.meta.url));
const svelte=require('svelte/compiler'),typescript=require('typescript');
const server=require('svelte/server'),internal=require('svelte/internal/server');
const policy=fs.readFileSync(path.join(root,'templates/auto-best/src/lib/locale/policy.ts'),'utf8');
const policyModule={exports:{}};
vm.runInNewContext(typescript.transpileModule(policy,{compilerOptions:{module:typescript.ModuleKind.CommonJS,target:typescript.ScriptTarget.ES2022}}).outputText,{exports:policyModule.exports,module:policyModule,URL,URLSearchParams,Response,Headers});
const config=Function('brand','return ('+fs.readFileSync(path.join(root,'templates/auto-best/src/lib/config/locale.ts'),'utf8').match(/export const dealerLocaleConfiguration = (\{[\s\S]+?\n\}) as const/)[1]+');')({name:'Template Auto Best'});
const nativeLocale=policyModule.exports.createLocalePolicy(config);
const condition="brand.phone && brand.phoneHref !== 'tel:'";
const manifest={slug:'al-sammarraie-used-cars',sourceFormat:'dealer-pack',packaging:{version:'5'},shareIdentity:{publicOrigin:'https://al-sammarraie-used-cars.webpreviews.site'},variants:[{key:'import',base:'/variant-3'}],localization:{defaultLocale:'en'}};

function fixture({phone=false,sourceFormat='dealer-pack'}={}){
  const business={countryCode:'AE',phoneDisplay:phone?'+971 50 123 4567':'',phoneHref:phone?'tel:+971501234567':'',phoneE164:phone?'+971501234567':''};
  const profile={factPolicy:'dealer-pack-optional-v1',business};
  const files=new Map([['business-facts.json',Buffer.from(JSON.stringify({business}))],[prefix+'src/lib/data/dealer-profile.json',Buffer.from(JSON.stringify(profile))],
    [prefix+'src/lib/config/brand.ts',Buffer.from('export const brand = {\n  phone: '+JSON.stringify(business.phoneDisplay)+',\n  phoneHref: '+JSON.stringify(business.phoneHref||'tel:')+',\n} as const;')],
    [prefix+'src/lib/data/navigation.ts',fs.readFileSync(path.join(root,'templates/auto-best/src/lib/data/navigation.ts'))],
    ['import/src/lib/config/dealer.ts',Buffer.from('  "emailHref": '+JSON.stringify(phone?'mailto:retained-business@example.com':'')+',\n')],['import/src/lib/config/site.ts',Buffer.from('contactHref: daynightContact.emailHref,')]]);
  for(const relative of Object.keys(AUTO_BEST_PHONE_BOUNDARIES))files.set(prefix+relative,fs.readFileSync(path.join(root,'templates/auto-best',relative)));
  return {files,profile,manifest:{...manifest,sourceFormat},brand:{phone:business.phoneDisplay,phoneHref:business.phoneHref||'tel:'}};
}

// Execute the actual provider-preparation function with unrelated mounting,
// sharing and font stages stubbed. No application build, service or files.
function providerPreparation(){
  const source=fs.readFileSync(new URL('./package-dealer.mjs',import.meta.url),'utf8');
  const declaration=source.match(/^export async function prepareSixDesignProviderSource\([\s\S]+?^}/m)?.[0];
  assert.ok(declaration,'Maintained provider preparation function required');
  const stageCalls=[];
  const noOp=name=>(..._args)=>{stageCalls.push(name);};
  const imports=async name=>{
    if(name==='./publishing/dealer-contact-fallback.mjs')return {applyOptionalContactFallback};
    if(name==='./publishing/dealer-presentation.mjs')return {applyDealerPresentation:noOp('presentation'),resolveDealerPresentationVersion:value=>value};
    if(name==='./lib/client-logo-contract.mjs')return {bindModernMobileWordmarkLogo:value=>value};
    if(name==='./publishing/signature-font-assets.mjs')return {completeSignatureFontAssets:noOp('fonts')};
    if(name==='./publishing/dealer-share.mjs')return {applyDealerShare:noOp('share')};
    assert.fail('Unrecognized provider preparation import: '+name);
  };
  const prepare=Function('SIX_PACKAGING_VERSION','assertAppVariant','assertExtendedVariantSources','applySixVariantMounts','json','importModule',
    'return ('+declaration.replace(/^export /,'').replace(/\bimport\(/g,'importModule(')+');')(
      '5',noOp('app'),noOp('extended'),files=>{stageCalls.push('mounts');return files;},value=>JSON.stringify(value),imports);
  return {prepare,stageCalls};
}

function walk(value,visit){
  if(!value||typeof value!=='object')return;
  if(typeof value.type==='string')visit(value);
  for(const [key,item]of Object.entries(value))if(key!=='parent'){
    if(Array.isArray(item))for(const child of item)walk(child,visit);else if(item&&typeof item==='object')walk(item,visit);
  }
}
function phoneFragments(source,{guarded=false}={}){
  const ast=svelte.parse(source,{modern:true}),fragments=[];
  walk(ast.fragment,node=>{
    if(guarded&&node.type==='IfBlock'&&source.slice(node.test.start,node.test.end)===condition)fragments.push(source.slice(node.start,node.end));
    if(!guarded&&node.type==='RegularElement'&&node.name==='a'){
      const opening=source.slice(node.start,source.indexOf('>',node.start)+1);
      if(/phoneLinkAttributes|href=\{(?:brand\.phoneHref|i18n\.href\(brand\.phoneHref\))\}/.test(opening))fragments.push(source.slice(node.start,node.end));
    }
  });
  return fragments;
}
function renderPhoneConsumers(files,brand,{guarded=false,locale='en'}={}){
  const fragments=[];
  for(const [relative,count]of Object.entries(AUTO_BEST_PHONE_BOUNDARIES)){
    const source=String(files.get(prefix+relative)),rows=phoneFragments(source,{guarded});
    assert.equal(rows.length,count,'Native telephone boundary: '+relative);fragments.push(...rows);
  }
  const source='<script>let {brand,href}=$props();const topic={label:"General enquiry"};const phoneLinkAttributes={href:brand.phoneHref};const i18n={href,t:()=>"Call",dealer:()=>"Recorded city"};function Icon(){} function MobileNavIcon(){} function MobileActionIcon(){}</script>'+fragments.join('\n');
  const compiled=svelte.compile(source,{generate:'server',filename:'native-optional-phone-consumers.svelte'}).js.code;
  const component=Function('$',compiled.replace(/^import \* as \$ from 'svelte\/internal\/server';\n/,'').replace('export default function','return function'))(internal);
  return server.render(component,{props:{brand,href:value=>nativeLocale.localeHref(value,locale)}}).body;
}

test('selected native Auto Best controls reproduce empty tel href before the missing provider guard',()=>{
  const f=fixture(),html=renderPhoneConsumers(f.files,f.brand);
  assert.equal((html.match(/href="tel:"/g)??[]).length,17);
  assert.match(html,/href="tel:"[^>]*class="dn-footer__call"/);
  assert.equal(nativeLocale.localeHref('tel:','en'),'tel:');
  assert.equal(nativeLocale.localeHref('tel:','bg'),'tel:');
  for(const slug of ['al-sammarraie-used-cars','rebou-al-fakhama-used-cars']){
    const facts=JSON.parse(fs.readFileSync(path.join(root,'dealers',slug,'business-facts.json'))),dealer=JSON.parse(fs.readFileSync(path.join(root,'dealers',slug,'dealer.json')));
    assert.equal(facts.business.phone,'');assert.equal(facts.business.phoneDisplay,'');assert.equal(facts.business.email,'');
    assert.equal(dealer.presentation,undefined);assert.equal(dealer.sourceFormat,'dealer-pack');
    assert.equal(dealer.templateSources['auto-best'].revision,'5d052ea655714f3d0ca3656daa7dbff411e2f747');
  }
});

test('no-presentation dealer pack reaches the real 17-control guard in both provider paths',async()=>{
  for(const provider of ['cloudflare','vercel']){
    const f=fixture(),before=new Map(f.files),{prepare}=providerPreparation();
    assert.equal(f.manifest.presentation,undefined);
    const files=await prepare(f.files,f.manifest,{provider});
    const receipt=JSON.parse(files.get('.cars-dealer-contact-fallback.json'));
    assert.equal(receipt.autoBestOptionalContact.telephoneActionsHidden,17);
    assert.equal(receipt.autoBestOptionalContact.navigationRowsHidden,1);
    assert.equal(receipt.autoBestOptionalContact.phoneInvented,false);
    assert.equal(receipt.emailInvented,false);assert.equal(receipt.href,manifest.shareIdentity.publicOrigin+'/variant-3/en/contact');
    for(const locale of ['en','bg'])assert.doesNotMatch(renderPhoneConsumers(files,f.brand,{guarded:true,locale}),/href="tel:/);
    for(const relative of Object.keys(AUTO_BEST_PHONE_BOUNDARIES)){
      const old=String(before.get(prefix+relative)),updated=String(files.get(prefix+relative));
      assert.equal(updated.slice(updated.indexOf('<style')),old.slice(old.indexOf('<style')),'CSS preserved: '+relative);
      assert.equal((updated.match(/<form\b/g)??[]).length,(old.match(/<form\b/g)??[]).length,'Forms preserved: '+relative);
    }
    for(const name of ['business-facts.json',prefix+'src/lib/data/dealer-profile.json',prefix+'src/lib/config/brand.ts','import/src/lib/config/dealer.ts'])assert.equal(files.get(name),before.get(name));
    assert.match(String(files.get(prefix+'src/lib/data/navigation.ts')),/\.\.\.\(brand\.phone && brand\.phoneHref !== 'tel:' \?/);
    for(const [name,bytes]of before)assert.equal(f.files.get(name),bytes,'Provider input Map preserved');
  }
});

test('phone-present Auto source and legacy non-pack no-presentation inputs stay byte-identical',async()=>{
  for(const options of [{phone:true},{sourceFormat:undefined}]){
    const f=fixture(options);if(Object.hasOwn(options,'sourceFormat'))delete f.manifest.sourceFormat;
    const before=new Map(f.files),{prepare}=providerPreparation(),files=await prepare(f.files,f.manifest);
    for(const [name,bytes]of before)assert.equal(files.get(name),bytes);
    if(options.phone){assert.equal(JSON.parse(files.get('.cars-dealer-contact-fallback.json')).autoBestOptionalContact.applied,false);assert.match(renderPhoneConsumers(files,f.brand),/href="tel:\+971501234567"/);}
    else assert.equal(files.has('.cars-dealer-contact-fallback.json'),false);
  }
});

test('existing presentation opt-in still applies contacts once before presentation and mounting',async()=>{
  const f=fixture();f.manifest.presentation={version:'fixture'};
  f.files.set('modern/packages/marketplace-ui/components/dealer-mobile-brand-bar.tsx',Buffer.from('retained logo'));
  const {prepare,stageCalls}=providerPreparation(),files=await prepare(f.files,f.manifest);
  assert.equal(JSON.parse(files.get('.cars-dealer-contact-fallback.json')).autoBestOptionalContact.telephoneActionsHidden,17);
  assert.deepEqual(stageCalls,['app','extended','presentation','fonts','mounts','share']);
});
