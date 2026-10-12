import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import os from 'node:os';
import {validateModernFreeServicesRequest,applyModernFreeNativeOverlay,applyModernFreeBuildOverlay,createModernFreeServicesPlugin,emitModernFreeServicesSnapshots,modernFreeServicesBuildSource,MODERN_FREE_SOURCE_REVISION,MODERN_FREE_CLIENT_TREE} from './lib/modern-free-services-build.mjs';
import {applyCloudflareNext,cloudflareNextBuildHelper} from './publishing/cloudflare-next.mjs';
const fixtureRoot=fs.mkdtempSync(path.join(os.tmpdir(),'cars-modern-free-build-test-'));
const hash=b=>createHash('sha256').update(b).digest('hex'),blob=b=>createHash('sha1').update(Buffer.from('blob '+b.length+'\0')).update(b).digest('hex');
function fixture(){
 const files=new Map(),overlay=new Map();
 const layout='import { getRequestPreferences } from "@/lib/locale-preferences";\nexport const dynamic = "force-dynamic";\nexport const revalidate = 0;\nasync function RootLayout(nativePreferences, normalizedLocale, requestBootstrap) {\n  const preferences = nativePreferences ?? await getRequestPreferences(normalizedLocale);\nreturn preferences;\n}';
 const entries=[['templates/modern/apps/web/lib/locale-preferences.ts','export const originalNative=true;\n','export function resolveCarsNativePreferences(){}\n'],['templates/modern/apps/web/app/[locale]/layout.tsx','original native Layout\n',layout],['templates/modern/packages/marketplace-ui/components/locale-preferences.tsx','original provider\n','reviewed native provider\n']];
 const rows=entries.map(([p,before,after])=>{const b=Buffer.from(before),a=Buffer.from(after);files.set(p.slice(10),b);overlay.set(p,a);return {path:p,beforeGitBlob:blob(b),beforeSha256:hash(b),afterGitBlob:blob(a),afterSha256:hash(a)};});
 files.set('modern/apps/web/app/[locale]/services/page.tsx',Buffer.from('export default async function ServicesPage(){return null;}\n'));
 const request={schemaVersion:1,kind:'cars-modern-free-services-build-experiment',dealer:'priselci',sourceRevision:MODERN_FREE_SOURCE_REVISION,sourceTree:MODERN_FREE_CLIENT_TREE,overlayCommit:'a'.repeat(40),files:rows};
 const options={dealer:'priselci',sourceTree:MODERN_FREE_CLIENT_TREE,sourceReleases:{modern:{revision:MODERN_FREE_SOURCE_REVISION}},sourceCommit:'b'.repeat(40),readOverlay:(_commit,name)=>overlay.get(name)};
 return {files,overlay,request,options};
}
test('absent marker returns exact original source reference and build helper bytes',()=>{const f=fixture();assert.equal(applyModernFreeNativeOverlay(f.files,undefined).files,f.files);assert.equal(applyModernFreeBuildOverlay(f.files,null),f.files);assert.equal(validateModernFreeServicesRequest(undefined),null);assert.equal(cloudflareNextBuildHelper(),cloudflareNextBuildHelper({modernFreeServicesExperiment:false}));});
test('request pins exactly original Priselci b1f/client9b5 and three immutable before/after rows',()=>{const f=fixture();assert.deepEqual(validateModernFreeServicesRequest(f.request,f.options),f.request);for(const change of [r=>r.dealer='other',r=>r.sourceRevision='c'.repeat(40),r=>r.sourceTree='c'.repeat(40),r=>r.overlayCommit='main',r=>r.extra=true,r=>r.files.pop(),r=>r.files.push({...r.files[0]}),r=>r.files[0].path='templates/mobile/src/app/page.tsx',r=>r.files[0].afterSha256='bad']){const r=structuredClone(f.request);change(r);assert.throws(()=>validateModernFreeServicesRequest(r,f.options),/Modern Free/);}});
test('source overlay leaves originals untouched and rejects drift of both sides',()=>{const f=fixture(),before=new Map(f.files),result=applyModernFreeNativeOverlay(f.files,f.request,f.options);assert.deepEqual(f.files,before);assert.equal(result.experiment.sourceTree,MODERN_FREE_CLIENT_TREE);assert.equal(result.experiment.overlayCommit,f.request.overlayCommit);for(const row of f.request.files)assert.deepEqual(result.files.get(row.path.slice(10)),f.overlay.get(row.path));const changed=new Map(f.files);changed.set(f.request.files[0].path.slice(10),Buffer.from('drift'));assert.throws(()=>applyModernFreeNativeOverlay(changed,f.request,f.options),/bytes differ/);assert.throws(()=>applyModernFreeNativeOverlay(f.files,f.request,{...f.options,readOverlay:()=>Buffer.from('drift')}),/bytes differ/);});
test('only native server Layout and Services params receive phase-gated build changes',()=>{const f=fixture(),over=applyModernFreeNativeOverlay(f.files,f.request,f.options),out=applyModernFreeBuildOverlay(over.files,over.experiment,{base:'/variant-2'}),layout=out.get('modern/apps/web/app/[locale]/layout.tsx').toString();assert.match(layout,/VINEXT_PRERENDER === "1" && process\.env\.NEXT_PHASE === "phase-production-build" \? "auto" : "force-dynamic"/);assert.match(layout,/\? false : 0/);assert.match(layout,/carsPrerender \? getStaticServicesPreferences\(normalizedLocale\) : await getRequestPreferences/);assert.doesNotMatch(layout,/force-static/);assert.deepEqual(out.get('modern/packages/marketplace-ui/components/locale-preferences.tsx'),over.files.get('modern/packages/marketplace-ui/components/locale-preferences.tsx'));assert.match(out.get('modern/apps/web/app/[locale]/services/page.tsx').toString(),/return \[\{ locale: "en" \}, \{ locale: "bg" \}\]/);assert.equal(JSON.parse(out.get('.cars-modern-free-build.json')).queryCache,false);});
test('extra pure resolver export uses only the original RSC graph module id',()=>{const f=fixture(),plugin=createModernFreeServicesPlugin({packageRoot:fixtureRoot,cwd:path.join(fixtureRoot,'modern/apps/web')}),emitted=[];for(const name of ['client','ssr','rsc'])plugin.buildStart.call({environment:{name},emitFile:x=>emitted.push(x)});assert.equal(emitted.length,1);assert.equal(emitted[0].fileName,'cars-native-preferences.js');assert.match(plugin.load(plugin.resolveId(emitted[0].id)),/modern\/apps\/web\/lib\/locale-preferences\.ts/);assert.doesNotMatch(plugin.load(plugin.resolveId(emitted[0].id)),/headers|cookies|request\.cf/);});

test('actual emitted Vite config parses and admits official prerender plus the original graph plugin',()=>{
 const f=fixture(),support={
  'modern/apps/web/package.json':JSON.stringify({dependencies:{next:'16.3.8',react:'19.2.4','react-dom':'19.2.4'}}),
  'modern/pnpm-lock.yaml':"packages:\n  '@tailwindcss/typography@0.5.20':\n    resolution: {integrity: fixture}\n",
  'modern/packages/design-system/package.json':JSON.stringify({devDependencies:{'@tailwindcss/typography':'^0.5.19'}}),
  'modern/packages/design-system/styles/globals.css':'@plugin "@tailwindcss/typography";\n',
  'modern/pnpm-workspace.yaml':'allowBuilds:\n  esbuild: true\n',
  'modern/packages/internationalization/request.ts':'process.env.VERCEL === "1"\n          ? request.headers.get("x-vercel-ip-country")\n          : null'
 };
 for(const [name,source] of Object.entries(support))f.files.set(name,Buffer.from(source));
 const overlay=applyModernFreeNativeOverlay(f.files,f.request,f.options),output=applyCloudflareNext(overlay.files,{slug:'priselci',variants:[{key:'modern',base:'/variant-2'}]},{modernFreeServicesExperiment:overlay.experiment});
 const source=output.get('modern/apps/web/vite.config.ts').toString();
 assert.match(source,/vinext\(\{prerender:\{routes:"\*",concurrency:1\}\}\)/);
 assert.doesNotMatch(source,/NaN|staticAssetsAdapter/);
 // Execute the generated JS-shaped config with dependency stubs, so malformed
 // string interpolation cannot pass merely because the generator parses.
 const executable=source.replace(/^import .*;\n/gm,'').replaceAll('import.meta.dirname',JSON.stringify(path.join(fixtureRoot,'modern/apps/web'))).replace('export default defineConfig','return defineConfig');
 const nativeGraphPlugin={name:'original-native-graph'},config=new Function('defineConfig','vinext','cloudflare','path','createModernFreeServicesPlugin',executable)(x=>x,options=>({name:'vinext',options}),options=>({name:'cloudflare',options}),path,()=>nativeGraphPlugin);
 assert.deepEqual(config.plugins[0],{name:'vinext',options:{prerender:{routes:'*',concurrency:1}}});
 assert.equal(config.plugins[1],nativeGraphPlugin);
 assert.deepEqual(config.plugins[2].options,{viteEnvironment:{name:'rsc',childEnvironments:['ssr']}});
 assert.equal(JSON.parse(output.get('.cars-cloudflare-next.json')).targets.filter(t=>t.freeStaticExperiment).length,1);
});

function emissionFixture(){
 const f=fixture(),over=applyModernFreeNativeOverlay(f.files,f.request,f.options),out=applyModernFreeBuildOverlay(over.files,over.experiment,{base:'/variant-2'});
 // Reuse one tiny owned output; each test restores only its prior file leaves.
 clearFixture();
 fs.mkdirSync(fixtureRoot,{recursive:true});const write=(name,bytes)=>{const dest=path.join(fixtureRoot,name);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);};
 write('.cars-modern-free-build.json',out.get('.cars-modern-free-build.json'));
 const server='modern/apps/web/dist/server',client='modern/apps/web/dist/client';fs.mkdirSync(path.join(fixtureRoot,client),{recursive:true});
 write(server+'/cars-native-preferences.js','export function resolveCarsNativePreferences(){}\n');
 for(const env of ['rsc','ssr','client'])write('.cars-modern-free-graph-'+env+'.json',JSON.stringify({schemaVersion:1,environment:env,graph:'original-native',rows:[{file:'index.js',moduleIds:['<package>/modern/apps/web/app/[locale]/services/page.tsx']}]}));
 const routes=[];for(const locale of ['en','bg']){routes.push({route:'/[locale]/services',status:'rendered',path:'/'+locale+'/services',router:'app',revalidate:false});write(server+'/prerendered-routes/'+locale+'/services.html','<html lang="'+locale+'"><script type="application/json" id="cars-modern-native-preferences">null</script></html>');write(server+'/prerendered-routes/'+locale+'/services.rsc',locale+':actual-native-payload-fixture');}
 routes.push({route:'/404',status:'rendered',router:'app',revalidate:false});write(server+'/prerendered-routes/404.html','official404-fixture');
 const index={buildId:'actual-tagged-build-fixture',trailingSlash:false,routes,pregeneratedConcretePaths:[]};write(server+'/vinext-prerender.json',JSON.stringify(index));
 return {index,write,target:{key:'modern',root:'modern/apps/web',assets:client,base:'/variant-2',freeStaticExperiment:{explicit:true}},server,client};
}
function clearFixture(){if(!fs.existsSync(fixtureRoot))return;function walk(dir){for(const item of fs.readdirSync(dir,{withFileTypes:true})){const child=path.resolve(dir,item.name);if(!child.startsWith(fixtureRoot+path.sep)||item.isSymbolicLink())throw Error('Unbounded fixture member');if(item.isDirectory()){walk(child);fs.rmdirSync(child);}else fs.unlinkSync(child);}}walk(fixtureRoot);}
function allLeaves(root){const rows=[];for(const item of fs.readdirSync(root,{withFileTypes:true})){if(item.isDirectory())rows.push(...allLeaves(path.join(root,item.name)).map(p=>item.name+'/'+p));else rows.push(item.name);}return rows;}
test('emitter seals exactly two original HTML/RSC pairs and internally discards only official404',()=>{const f=emissionFixture(),marker=emitModernFreeServicesSnapshots({packageRoot:fixtureRoot,target:f.target}),manifest=JSON.parse(fs.readFileSync(path.join(fixtureRoot,marker.manifestPath))),receipt=JSON.parse(fs.readFileSync(path.join(fixtureRoot,'modern/apps/web/dist/server/cars-free-services-build.json')));assert.equal(manifest.routes.length,2);assert.equal(receipt.discardedGenerated404,true);assert.equal(receipt.queryCache,false);assert.equal(receipt.resolver.callableVerified,false);assert(!fs.existsSync(path.join(fixtureRoot,f.server,'vinext-prerender.json')));assert(!fs.existsSync(path.join(fixtureRoot,f.server,'prerendered-routes')));for(const r of manifest.routes)for(const kind of ['html','rsc']){const b=fs.readFileSync(path.join(fixtureRoot,f.client,r[kind].path.slice(1)));assert.equal(hash(b),r[kind].sha256);assert.equal(b.length,r[kind].bytes);}});
test('emitter rejects extra successful pages before creating snapshot manifest',()=>{const f=emissionFixture();f.index.routes.push({route:'/about',status:'rendered',router:'app',revalidate:false});f.write(f.server+'/vinext-prerender.json',JSON.stringify(f.index));assert.throws(()=>emitModernFreeServicesSnapshots({packageRoot:fixtureRoot,target:f.target}),/extra or noncanonical/);assert(!fs.existsSync(path.join(fixtureRoot,f.server,'cars-free-services.json')));});
test('emitter rejects unexpected generated files, error routes, missing pairs and framework caches',()=>{for(const bad of ['extra','error','missing','cache']){const f=emissionFixture();if(bad==='extra')f.write(f.server+'/prerendered-routes/extra.html','unexpected');if(bad==='error'){f.index.routes[0].status='error';f.write(f.server+'/vinext-prerender.json',JSON.stringify(f.index));}if(bad==='missing')fs.unlinkSync(path.join(fixtureRoot,f.server,'prerendered-routes/en/services.rsc'));if(bad==='cache')f.write(f.client+'/_vinext/static-cache/unexpected.html','unexpected');assert.throws(()=>emitModernFreeServicesSnapshots({packageRoot:fixtureRoot,target:f.target}),/Modern Free/);}});
test('standalone maintained generated helper is syntactically loadable with opt-out absent',async()=>{const source=modernFreeServicesBuildSource();const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64'),module=await import(url);assert.equal(typeof module.emitModernFreeServicesSnapshots,'function');assert.equal(typeof module.createModernFreeServicesPlugin,'function');assert.doesNotMatch(cloudflareNextBuildHelper(),/modern-free-services-build/);assert.match(cloudflareNextBuildHelper({modernFreeServicesExperiment:true}),/emitModernFreeServicesSnapshots/);});
test.after(()=>{clearFixture();fs.rmdirSync(fixtureRoot);});

test('explicit experiment refreshes the persistent provider on SSR entry as well as prerender',()=>{const f=fixture(),over=applyModernFreeNativeOverlay(f.files,f.request,f.options),out=applyModernFreeBuildOverlay(over.files,over.experiment,{base:'/variant-3'}),layout=out.get('modern/apps/web/app/[locale]/layout.tsx').toString();assert.match(layout,/requestBootstrap = true;/);assert.doesNotMatch(layout,/requestBootstrap = requestBootstrap \|\| carsPrerender/);assert.match(layout,/carsPrerender \? getStaticServicesPreferences\(normalizedLocale\) : await getRequestPreferences/);const receipt=JSON.parse(out.get('.cars-modern-free-build.json'));assert.equal(receipt.mount,'/variant-3');assert.equal(receipt.generated.length,2);assert.equal(receipt.files.length,3);});
