import {applyVercelAssets} from './publishing/vercel-asset-plan.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {appendAppVariant,appendAppService,baseNativeManifest,assertAppVariant,APP_VARIANT} from './publishing/app-variant.mjs';
import {validatePackagingManifest} from './package-dealer.mjs';
const bytes=v=>Buffer.from(typeof v==='string'?v:JSON.stringify(v));
function fixture(middle='modern'){
 const variants=[{key:'auto-best',base:'',entry:'/'},{key:middle,base:'/variant-2',entry:middle==='modern'?'/variant-2/cars':'/variant-2/'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}];
 const manifest={schemaVersion:1,slug:'dealer-one',repository:'owner/dealer-one',packaging:{version:'2'},variants,templateRevisions:{},templateSources:{}};
 const middleService=middle==='import'?'importer':middle;
 const config={services:{autobest:{root:'auto-best',buildCommand:'node ../scripts/build-native-service.mjs auto-best'},carwow:{root:'carwow',buildCommand:'node ../scripts/build-native-service.mjs carwow'},[middleService]:{root:middle,buildCommand:'node ../scripts/build-native-service.mjs '+middle}},rewrites:[{source:'/variant-2/(.*)',destination:{service:middleService}},{source:'/variant-3/(.*)',destination:{service:'carwow'}},{source:'/(.*)',destination:{service:'autobest'}}]};
 const baseFiles=new Map([['dealer.json',bytes(manifest)],['vercel.json',bytes(config)],['auto-best/static/preview-switcher.js',bytes('const config = '+JSON.stringify({variants,language:'bg'})+'; const mount = "";')],['auto-best/static/dealer/logo.webp',bytes('approved-logo')],['carwow/source.svelte',bytes('existing-ui')],['scripts/build-native-service.mjs',bytes("if(manifest.packaging?.version !== '2')throw Error('version');")],['.cars-package.json',bytes({schemaVersion:1})]]);
 const appFiles=new Map([['lib/dealer.json',bytes({mode:'dealer',id:'dealer-one',name:'Dealer One',logo:{light:'/logo.png',dark:'/logo.png',icon:'/icon.png'}})],['lib/dealer-inventory.json',bytes([{slug:'car-one',images:['/vehicle.webp']}])],['public/logo.png',bytes('approved-logo')],['public/icon.png',bytes('icon')],['public/vehicle.webp',bytes('retained-vehicle')]]);
 return {baseFiles,appFiles,sourceCommit:'b'.repeat(40),template:{repository:'owner/cars',revision:'a'.repeat(40),path:'templates/app'},sharedSwitcher:'const embeddedConfig = __CARS_SWITCHER_CONFIG__; globalThis.__CARS_SWITCHER_CONFIG__ = embeddedConfig; /* shared */',provenance:{},baseDeployment:'dpl_test'};
}
for(const middle of ['modern','import'])test('append App preserves '+middle+' trio and assets',()=>{const f=fixture(middle),result=appendAppVariant(f);assert.equal(result.manifest.variants.length,4);assert.deepEqual(result.manifest.variants[3],APP_VARIANT);assert.equal(result.files.get('carwow/source.svelte').toString(),'existing-ui');assert.equal(result.files.get('auto-best/static/dealer/logo.webp').toString(),'approved-logo');assert.equal(result.manifest.packaging.version,'3');assertAppVariant(result.files,result.manifest);validatePackagingManifest(result.manifest);assert.equal(baseNativeManifest(result.manifest).variants.length,3);assert.equal(baseNativeManifest(result.manifest).packaging.version,'2');const vc=JSON.parse(result.files.get('vercel.json'));assert.equal(vc.rewrites.at(-1).destination.service,'autobest');assert.equal(vc.services.app.root,'app');const rendered=result.files.get('auto-best/static/preview-switcher.js').toString();assert.match(rendered,/shared/);assert.match(rendered,/"key":"app"/);});
test('duplicate append is rejected',()=>{const f=fixture(),first=appendAppVariant(f);assert.throws(()=>appendAppVariant({...f,baseFiles:first.files}),/verified native trio/);});
test('App tampering fails source digest',()=>{const r=appendAppVariant(fixture());r.files.set('app/public/logo.png',bytes('changed'));assert.throws(()=>assertAppVariant(r.files,r.manifest),/changed after personalization/);});
test('existing fourth service is not overwritten',()=>assert.throws(()=>appendAppService({services:{autobest:{},carwow:{},app:{}},rewrites:[]}),/already exists/));
test('unknown baseline is not silently reconfigured',()=>{const f=fixture();f.baseFiles.set('auto-best/static/preview-switcher.js',bytes('custom unknown switcher'));assert.throws(()=>appendAppVariant(f),/Unknown deployed switcher/);});
test('existing three-design manifests still validate',()=>validatePackagingManifest(JSON.parse(fixture().baseFiles.get('dealer.json'))));

test('App append re-plans a Vercel-optimized trio without nested build wrappers or source seal changes', () => {
 const f=fixture(); f.baseFiles.set('carwow/static/dealer/logo.webp',bytes('approved-logo'));
 const prior=applyVercelAssets(f.baseFiles); assert.equal(prior.objects.length,1);
 const result=appendAppVariant(f); assertAppVariant(result.files,result.manifest);
 const vc=JSON.parse(result.files.get('vercel.json'));
 assert.equal((vc.services.autobest.buildCommand.match(/vercel-service-assets.mjs before/g)||[]).length,1);
 assert.equal(JSON.parse(result.files.get('.cars-vercel-assets.json')).variants.length,4);
 assert.equal(result.files.get('carwow/static/dealer/logo.webp').toString(),'approved-logo');
});

test('App append keeps the current native install/build helper unchanged', () => {
  const f=fixture();
  const helper=bytes("if(!['2', '3'].includes(manifest.packaging?.version))throw Error('version'); // install proof");
  f.baseFiles.set('scripts/build-native-service.mjs',helper);
  const result=appendAppVariant(f);
  assert.deepEqual(result.files.get('scripts/build-native-service.mjs'),helper);
  assert.equal(JSON.parse(result.files.get('vercel.json')).services.app.installCommand,'npm ci --include=dev');
});
test('App append still rejects an unknown native build boundary', () => {
  const f=fixture(); f.baseFiles.set('scripts/build-native-service.mjs',bytes('unknown custom build'));
  assert.throws(()=>appendAppVariant(f),/Unrecognized native build manifest/);
});
