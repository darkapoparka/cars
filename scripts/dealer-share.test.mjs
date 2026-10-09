import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import test from 'node:test';
import {applyDealerShare, canonicalPublicUrl, createDealerShareAssets, inspectDealerShareHtml, mountedPathname, publicOrigin, removeIdentityHeadTags, resolveShareIdentity} from './publishing/dealer-share.mjs';
import {verifyDealerShare} from './publishing/verify-dealer-share.mjs';

const require = createRequire(path.resolve(import.meta.dirname, '../templates/karento-best/package.json'));
const sharp = require('sharp');
const ts = require('typescript');
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const variants = [{key: 'auto-best', base: '', entry: '/'}, {key: 'modern', base: '/variant-2', entry: '/variant-2/cars'}, {key: 'import', base: '/variant-3', entry: '/variant-3/'}, {key: 'app', base: '/variant-4', entry: '/variant-4/'}, {key: 'mobile', base: '/variant-5', entry: '/variant-5/'}, {key: 'karento-best', base: '/variant-6', entry: '/variant-6/'}];

async function fixture() {
  const logo = await sharp({create: {width: 400, height: 100, channels: 4, background: '#00000000'}}).composite([{input: {create: {width: 280, height: 60, channels: 4, background: '#18212cff'}}, left: 60, top: 20}]).png().toBuffer();
  const files = new Map([['dealer-brand/logo-on-light.png', logo]]);
  for (const key of ['auto-best', 'import', 'karento-best']) files.set(`${key}/src/routes/+layout.svelte`, Buffer.from(`<script lang="ts">import {page} from '$app/state'; const canonicalUrl = $derived(page.url.origin + page.url.pathname); let {children} = $props();</script><svelte:head>{#if canonicalUrl}<link rel="canonical" href={canonicalUrl} />{/if}<link rel="icon" href="/template.svg"/><meta property="og:image" content="https://reference.example/logo.png"/><meta name="robots" content="noindex"/></svelte:head>{@render children()}`));
  files.set('import/src/routes/(site)/+layout.svelte', Buffer.from(`<script>import {page} from '$app/state'; let {data,children}=$props(); const canonicalFor=()=>data.site.identity.origin+page.url.pathname;const canonical = $derived(canonicalFor());</script><svelte:head><link rel="canonical" href={canonical}/><meta property="og:url" content={canonical}/><link rel="alternate" hreflang="en" href={canonicalFor()}/></svelte:head>{@render children()}`));
  files.set('import/src/lib/components/RequestSecurity.svelte', Buffer.from(`<script>import {page} from '$app/state';const safe=(url)=>url.origin===page.url.origin;</script><a href={safe(page.url)?'/safe':'/'}>Continue</a>`));
  files.set('import/src/routes/(site)/blog/+page.svelte', Buffer.from(`<script>let {data}=$props();</script><svelte:head\n><title>{data.title}</title><meta property="og:title" content={data.title}/><meta property="og:image" content="https://wrong.example/image.svg"/></svelte:head\n><main/>`));
  files.set('modern/apps/web/app/[locale]/layout.tsx', Buffer.from(`import type {Metadata} from 'next';export const metadata: Metadata={icons:{icon:'/template.svg'},metadataBase:new URL('https://reference.example')};export default function Layout({children}:{children: React.ReactNode}){return <html><head><link rel="icon" href="/template.svg"/></head><body>{children}</body></html>}`));
  files.set('modern/apps/web/app/[locale]/listing/[slug]/page.tsx', Buffer.from(`export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:slug,openGraph:{url:'https://reference.example/wrong',images:['/wrong.jpg']}}}export default function Page(){return <main/>}`));
  files.set('modern/apps/web/proxy.ts', Buffer.from(`import {NextResponse} from 'next/server';export const config={matcher:['/((?!_next|ingest|.*\\\\..*).*)']};export default function proxy(){return NextResponse.next()}`));
  files.set('app/app/layout.tsx', Buffer.from(`import type {Metadata} from 'next';export async function generateMetadata():Promise<Metadata>{return {title:'Dealer',robots:{index:false,follow:false}}}export default function Layout({children}:{children:React.ReactNode}){return <html><head><link rel="icon" href="/wrong.svg"/></head><body>{children}</body></html>}`));
  files.set('app/app/[locale]/cars/[slug]/page.tsx', Buffer.from(`export const generateMetadata=async ({params}:{params:Promise<{slug:string}>})=>({title:(await params).slug});export default function Page(){return <main/>}`));
  files.set('app/proxy.ts', Buffer.from(`import {NextResponse} from 'next/server';export function proxy(){return NextResponse.next()}export const config={matcher:['/((?!_next|.*\\\\..*).*)']};`));
  files.set('app/public/manifest.webmanifest', Buffer.from(JSON.stringify({name:'Reference',short_name:'Reference',display:'standalone',icons:[{src:'/wrong.svg'}]})));
  files.set('mobile/src/app/layout.tsx', Buffer.from(`import type {Metadata} from 'next';export const metadata:Metadata={title:'Your showroom',description:'Website preview'};export default function Layout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>}`));
  files.set('mobile/src/app/contact/page.tsx', Buffer.from(`export const metadata={title:'Contact'};export default function Contact(){return <main/>}`));
  files.set('mobile/src/app/icon.svg', Buffer.from('<svg/>'));
  const manifest = {slug:'reviewed-dealer',variants,shareIdentity:{name:'Reviewed Dealer',publicOrigin:'https://dealer.example',description:'Dealer proposal with sample inventory.',logo:{sourcePath:'dealer-brand/logo-on-light.png',sha256:sha(logo)}}};
  return {files,manifest};
}

function evaluate(source, modules) {
  const output = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true},reportDiagnostics:true});
  assert.equal(output.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0);
  const module = {exports:{}};
  vm.runInNewContext(output.outputText, {module,exports:module.exports,require:name => {assert.ok(Object.hasOwn(modules,name),'Unexpected generated import '+name);return modules[name]},URL,Headers,Error});
  return module.exports;
}

test('public canonical URLs retain mounts/locales/deep links while removing filter state', () => {
  assert.equal(publicOrigin('https://dealer.example/'),'https://dealer.example');
  for (const origin of ['http://dealer.example','https://dealer.example/variant-6','https://localhost','https://127.0.0.1','https://user:secret@dealer.example','https://dealer.example/?x=1','https://dealer.example:444','https://promosale_varna.mobile.bg']) assert.throws(()=>publicOrigin(origin));
  assert.equal(canonicalPublicUrl('https://dealer.example','/variant-6/bg/vehicle?fbclid=x#photos'),'https://dealer.example/variant-6/bg/vehicle');
  assert.equal(canonicalPublicUrl('https://dealer.example','/variant-6/vehicle?id=dealer-car-1&fbclid=x#photos',{preserveQuery:['id']}),'https://dealer.example/variant-6/vehicle?id=dealer-car-1');
  assert.notEqual(canonicalPublicUrl('https://dealer.example','/variant-6/vehicle?id=dealer-car-1',{preserveQuery:['id']}),canonicalPublicUrl('https://dealer.example','/variant-6/vehicle?id=dealer-car-2',{preserveQuery:['id']}));
  assert.equal(mountedPathname('/bg/cars/id','/variant-2'),'/variant-2/bg/cars/id');
  assert.equal(mountedPathname('/variant-2/bg/cars/id','/variant-2'),'/variant-2/bg/cars/id');
  assert.throws(()=>canonicalPublicUrl('https://dealer.example','//other.example/page'));
});

test('dealer identity requires committed reviewed raster bytes and refuses inherited fallbacks',async()=>{
  const {files,manifest}=await fixture();
  assert.equal(resolveShareIdentity(files,manifest).name,'Reviewed Dealer');
  assert.throws(()=>resolveShareIdentity(files,{...manifest,shareIdentity:undefined}),/reviewed dealer name/);
  assert.throws(()=>resolveShareIdentity(files,{...manifest,shareIdentity:{...manifest.shareIdentity,logo:{sourcePath:'dealer-brand/logo-on-light.png',sha256:'0'.repeat(64)}}}),/SHA-256 differs/);
  assert.throws(()=>resolveShareIdentity(files,{...manifest,shareIdentity:{...manifest.shareIdentity,logo:{sourcePath:'../template/logo.png',sha256:'0'.repeat(64)}}}),/explicit package-relative/);
});

test('social card contains the entire reviewed logo at 1200x630; favicon icons remain square PNG/ICO',async()=>{
  const {files,manifest}=await fixture();
  const assets=await createDealerShareAssets(resolveShareIdentity(files,manifest));
  const metadata=await sharp(assets.outputs.get('social.png')).metadata();
  assert.equal(metadata.width,1200);assert.equal(metadata.height,630);
  assert.deepEqual(assets.layout.transparentBounds,{left:60,top:20,width:280,height:60});
  assert.equal(assets.layout.logoRender.width,960);assert.ok(assets.layout.logoRender.height<=320);
  const {data,info}=await sharp(assets.outputs.get('social.png')).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixel=(x,y)=>[...data.subarray((y*info.width+x)*info.channels,(y*info.width+x)*info.channels+3)];
  assert.deepEqual(pixel(20,20),[255,255,255]);assert.deepEqual(pixel(600,240),[24,33,44]);assert.deepEqual(pixel(1190,240),[255,255,255]);
  for(const size of [32,180,512]){const icon=await sharp(assets.outputs.get(`icon-${size}.png`)).metadata();assert.equal(icon.width,size);assert.equal(icon.height,size);}
  const ico=assets.outputs.get('favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
  assert.equal(assets.layout.faviconSource,'contained-reviewed-wordmark');
});

test('only identity head tags are removed; robots, preloads and route titles survive',()=>{
  const before='<svelte:head><title>Car details</title><meta name="robots" content="noindex"/><link rel="preload" href="/font.woff2" as="font"/><meta property="og:image" content={image}/><meta property="og:url" content={canonical}/><link rel="canonical" href={canonical}/><link rel="shortcut icon" href={dealer.logo.icon}/></svelte:head>';
  const result=removeIdentityHeadTags(before);assert.equal(result.removed.length,4);assert.match(result.source,/Car details/);assert.match(result.source,/robots/);assert.match(result.source,/preload/);assert.doesNotMatch(result.source,/og:image|canonical|shortcut icon/);
});

test('all six package families use one asset set and dynamic metadata without changing input identity bytes',async()=>{
  const {files,manifest}=await fixture();const logo=Buffer.from(files.get(manifest.shareIdentity.logo.sourcePath));
  const receipt=await applyDealerShare(files,manifest);
  assert.deepEqual(Object.keys(receipt.metadataBoundaries).sort(),variants.map(v=>v.key).sort());
  assert.equal(receipt.assetHosting,'shared-root-autobest');assert.equal(receipt.assets.length,6);
  assert.ok(receipt.assets.every(asset=>asset.path.startsWith('auto-best/static/dealer-share/')&&asset.publicUrl.startsWith('https://dealer.example/dealer-share/')));
  assert.deepEqual(files.get(manifest.shareIdentity.logo.sourcePath),logo);
  assert.match(files.get('import/src/lib/components/RequestSecurity.svelte').toString(),/url.origin===page.url.origin/);
  assert.ok(!receipt.transformations.some(item=>item.path.endsWith('RequestSecurity.svelte')));
  assert.doesNotMatch(files.get('import/src/routes/(site)/blog/+page.svelte').toString(),/og:image|og:title|wrong.example/);
  assert.equal(files.has('mobile/src/app/icon.svg'),false);
  assert.match(files.get('karento-best/src/lib/CarsDealerShare.svelte').toString(),/searchParams.get\('id'\)/);
  assert.deepEqual(receipt.canonicalQueryIdentity['karento-best'],{pathname:'/variant-6/vehicle',keys:['id']});
  for(const key of ['auto-best','import','karento-best']){
    const source=files.get(`${key}/src/lib/CarsDealerShare.svelte`).toString();
    assert.match(source,/page.url.pathname/);assert.match(source,/og:image:width/);assert.match(source,/1200/);assert.doesNotMatch(source,/reference.example|template.svg/);
    assert.match(files.get(`${key}/src/routes/+layout.svelte`).toString(),/CarsDealerShare/);
  }
  const modern=files.get('modern/apps/web/app/[locale]/listing/[slug]/page.tsx').toString();assert.match(modern,/carsOriginalGenerateMetadata/);assert.match(modern,/dealerShareMetadata/);
  assert.ok(files.has('mobile/src/proxy.ts'));assert.ok(!files.has('mobile/proxy.ts'));
  const pwa=JSON.parse(files.get('app/public/manifest.webmanifest'));assert.equal(pwa.name,'Reviewed Dealer');assert.equal(pwa.start_url,'/variant-4/');assert.equal(pwa.scope,'/variant-4/');assert.match(pwa.icons[0].src,/https:\/\/dealer.example\/dealer-share\//);
  await assert.rejects(()=>applyDealerShare(files,manifest),/already applied/);
});

test('Next metadata overrides inherited origins/images and retains requested mounted deep link',async()=>{
  const {files,manifest}=await fixture();await applyDealerShare(files,manifest);
  const helper=evaluate(files.get('app/lib/cars-dealer-share.ts').toString(),{'next/headers':{headers:async()=>new Headers({'x-cars-public-path':'/variant-4/bg/cars/reviewed-car?fbclid=x'})}});
  const metadata=await helper.dealerShareMetadata({title:'Reviewed car',description:'A reviewed description',robots:{index:false},openGraph:{url:'https://old.example/wrong',images:['https://old.example/logo.svg']},alternates:{languages:{en:'https://old.example/variant-4/en/cars/reviewed-car'}}});
  assert.equal(metadata.alternates.canonical,'https://dealer.example/variant-4/bg/cars/reviewed-car');assert.equal(metadata.openGraph.url,metadata.alternates.canonical);assert.match(metadata.openGraph.images[0].url,/https:\/\/dealer.example\/dealer-share\//);assert.equal(metadata.openGraph.images[0].width,1200);assert.equal(metadata.openGraph.images[0].height,630);assert.equal(metadata.twitter.card,'summary_large_image');assert.equal(metadata.icons.icon[0].type,'image/png');assert.equal(metadata.robots.index,false);assert.equal(metadata.title,'Reviewed car');assert.equal(metadata.alternates.languages.en,'https://dealer.example/variant-4/en/cars/reviewed-car');
});

test('proxy preserves existing security/cookies/locale and replaces forged request pathname',async()=>{
  const {files,manifest}=await fixture();await applyDealerShare(files,manifest);
  const nextResponse={next:({request}={})=>{const headers=new Headers({'x-middleware-next':'1'});if(request){headers.set('x-middleware-override-headers',[...request.headers.keys()].join(','));for(const [key,value]of request.headers)headers.set('x-middleware-request-'+key,value);}return{headers,status:200}}};
  const original={proxy:()=>({headers:new Headers({'set-cookie':'cars-app-locale=bg; SameSite=Lax','cache-control':'private, no-store','x-frame-options':'DENY','x-middleware-override-headers':'x-cars-app-locale','x-middleware-request-x-cars-app-locale':'bg'}),status:200})};
  const proxy=evaluate(files.get('app/proxy.ts').toString(),{'next/server':{NextResponse:nextResponse},'./cars-original-proxy':original});
  const response=await proxy.proxy({headers:new Headers({'x-cars-public-path':'//evil.example','user-agent':'social-crawler'}),nextUrl:{pathname:'/bg/cars/car'}},{});
  assert.equal(response.headers.get('x-middleware-request-x-cars-public-path'),'/variant-4/bg/cars/car');assert.equal(response.headers.get('x-middleware-request-x-cars-app-locale'),'bg');assert.equal(response.headers.get('x-frame-options'),'DENY');assert.equal(response.headers.get('cache-control'),'private, no-store');assert.match(response.headers.get('set-cookie'),/cars-app-locale=bg/);assert.equal(response.status,200);assert.deepEqual([...proxy.config.matcher],['/((?!_next|.*\\..*).*)']);
});

test('served HTML audit detects the concrete missing/foreign canonical and sharing image cases',()=>{
  const bad=inspectDealerShareHtml('<html><head><link rel="icon" href="/reference.svg"/><meta property="og:url" content="https://reference.example/wrong"/><meta property="og:image" content="/too-small.svg"/></head></html>','https://dealer.example/variant-3/');
  assert.ok(bad.problems.includes('missing-duplicate-or-foreign-canonical'));assert.ok(bad.problems.includes('og-url-does-not-match-canonical'));assert.ok(bad.problems.includes('non-absolute-or-foreign-og-image'));
  const good=inspectDealerShareHtml('<html><head><link rel="canonical" href="https://dealer.example/variant-3/"/><link rel="icon" type="image/png" href="https://dealer.example/dealer-share/hash/icon-32.png"/><meta property="og:url" content="https://dealer.example/variant-3/"/><meta property="og:image" content="https://dealer.example/dealer-share/hash/social.png"/></head></html>','https://dealer.example/variant-3/');assert.deepEqual(good.problems,[]);
});

test('anonymous hosted verifier binds mounted page metadata and image bytes to the package receipt',async()=>{
  const {files,manifest}=await fixture();const receipt=await applyDealerShare(files,manifest);
  const root=manifest.shareIdentity.publicOrigin,directory=root+receipt.publicDirectory,page=root+'/variant-6/bg/vehicle';
  const html=`<html><head><link rel="canonical" href="${page}"/><link rel="icon" href="${directory}/icon-32.png"/><meta property="og:url" content="${page}"/><meta property="og:image" content="${directory}/social.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:image" content="${directory}/social.png"/></head></html>`;
  let calls=0;
  const fetchPage=async(url,options)=>{
    assert.match(options.headers['User-Agent'],/facebookexternalhit/);assert.equal(options.headers.Authorization,undefined);calls++;
    const isPage=url===page,asset=receipt.assets.find(entry=>entry.publicUrl===url);
    assert.ok(isPage||asset,'unexpected public request');
    const bytes=isPage?Buffer.from(html):files.get(asset.path);
    return {ok:true,status:200,url,headers:new Headers({'content-type':isPage?'text/html':'image/png'}),text:async()=>bytes.toString(),arrayBuffer:async()=>bytes};
  };
  const evidence=await verifyDealerShare({origin:root,paths:['/variant-6/bg/vehicle'],receipt,fetch:fetchPage});
  assert.equal(evidence.passed,true);assert.equal(evidence.access,'anonymous-social-crawler-http');assert.equal(calls,3);
  const incorrect=structuredClone(receipt);incorrect.assets.find(entry=>entry.publicUrl.endsWith('/social.png')).sha256='0'.repeat(64);
  const mismatch=await verifyDealerShare({origin:root,paths:['/variant-6/bg/vehicle'],receipt:incorrect,fetch:fetchPage});
  assert.equal(mismatch.passed,false);assert.ok(mismatch.pages[0].problems.includes('unavailable-og-image'));assert.match(mismatch.assets.find(asset=>asset.url.endsWith('/social.png')).error,/bytes differ/);
});

test('Signature crawler verification preserves distinct vehicle IDs while dropping Facebook tracking',async()=>{
  const {files,manifest}=await fixture();const receipt=await applyDealerShare(files,manifest);
  const root=manifest.shareIdentity.publicOrigin,directory=root+receipt.publicDirectory;
  const routes=['/variant-6/vehicle?id=stock-a&fbclid=facebook-a','/variant-6/vehicle?id=stock-b&fbclid=facebook-b'];
  const expected=[root+'/variant-6/vehicle?id=stock-a',root+'/variant-6/vehicle?id=stock-b'];
  let collapseVehicles=false;
  const fetchPage=async(url,options)=>{
    assert.match(options.headers['User-Agent'],/facebookexternalhit/);
    const index=routes.findIndex(route=>root+route===url);
    const asset=receipt.assets.find(entry=>entry.publicUrl===url);
    assert.ok(index>=0||asset,'unexpected public request');
    const canonical=collapseVehicles?root+'/variant-6/vehicle':expected[index];
    const html=`<html><head><link rel="canonical" href="${canonical}"/><link rel="icon" href="${directory}/icon-32.png"/><meta property="og:url" content="${canonical}"/><meta property="og:image" content="${directory}/social.png"/><meta property="og:image:width" content="1200"/><meta property="og:image:height" content="630"/><meta name="twitter:image" content="${directory}/social.png"/></head></html>`;
    const bytes=index>=0?Buffer.from(html):files.get(asset.path);
    return {ok:true,status:200,url,headers:new Headers({'content-type':index>=0?'text/html':'image/png'}),text:async()=>bytes.toString(),arrayBuffer:async()=>bytes};
  };
  const evidence=await verifyDealerShare({origin:root,paths:routes,receipt,fetch:fetchPage});
  assert.equal(evidence.passed,true);
  assert.deepEqual(evidence.pages.map(page=>page.canonical[0]),expected);
  collapseVehicles=true;
  const collapsed=await verifyDealerShare({origin:root,paths:routes,receipt,fetch:fetchPage});
  assert.equal(collapsed.passed,false);
  assert.ok(collapsed.pages.every(page=>page.problems.includes('canonical-does-not-match-mounted-page')));
});
