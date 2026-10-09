import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { planSixDesignSelection } from './lib/six-design-release.mjs';
import { validateManifest } from './lib/workflow.mjs';
import { packageDealer, validatePackagingManifest, vercelConfiguration } from './package-dealer.mjs';
import { appSourceDigest, baseNativeManifest } from './publishing/app-variant.mjs';
import { nativeBuildPlan, runNativeBuild } from './publishing/build-native-service.mjs';
import { configureModernMountGuard } from './publishing/native-mounts.mjs';
import vm from 'node:vm';
import { applySixVariantMounts, assertExtendedVariantSources, extendedSourceDigest, mountSvelteUrlAttributes, sealSixVariantBuild } from './publishing/six-variant.mjs';
import { applyVercelAssets } from './publishing/vercel-asset-plan.mjs';
import { nativeFixture } from './test-fixtures/native-source.mjs';
import { verifyPackage } from './export-dealer.mjs';
import { normalized } from './lib/workflow.mjs';

const bytes = value => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value));
function manifest(middle = 'modern') {
  const variants = planSixDesignSelection([{key:'auto-best',base:'',entry:'/'},{key:middle,base:'/variant-2',entry:middle === 'modern'?'/variant-2/cars':'/variant-2/'},{key:'carwow',base:'/variant-3',entry:'/variant-3/'}]).variants;
  return {schemaVersion:1,slug:'publisher-fixture',repository:'darkapoparka/cars-publisher-fixture',packaging:{version:'5'},variants,templateRevisions:Object.fromEntries(variants.map(v=>[v.key,'a'.repeat(40)]))};
}
function mountedFixture() {
  const files = new Map();
  files.set('app/package.json',bytes('{"name":"fixture-app"}'));
  files.set('app/app/page.tsx',bytes("import {redirect} from 'next/navigation';import {browserPath} from '@/lib/paths';export default function EntryPage(){redirect(browserPath('/',dealer.defaultLocale));}"));
  files.set('app/next.config.js',bytes('const nextConfig = {basePath: process.env.NEXT_PUBLIC_BASE_PATH};module.exports = nextConfig;'));
  files.set('mobile/next.config.js',bytes('module.exports = { images: { unoptimized: true } };'));
  files.set('mobile/src/app/layout.tsx',bytes('export default function Layout(){return <html><body><Children /></body></html>}'));
  files.set('mobile/src/component.tsx',bytes('const route="/vehicle/one";const image="/images/car.webp";const icon="url(/icons/car.svg)";const pathname="/results";'));
  files.set('mobile/public/images/car.webp',bytes('public-car'));
  files.set('mobile/public/icons/car.svg',bytes('<svg/>'));
  files.set('karento-best/package.json',fs.readFileSync(new URL('../templates/karento-best/package.json',import.meta.url)));
  files.set('karento-best/package-lock.json',fs.readFileSync(new URL('../templates/karento-best/package-lock.json',import.meta.url)));
  files.set('karento-best/vite.config.ts',bytes('import adapter from "@sveltejs/adapter-node";const c={plugins:[sveltekit({ adapter: adapter() })]};'));
  files.set('karento-best/src/lib/routes.ts',bytes('export type SourceKey="index";export function resolveRoute(path: string): SourceKey | null { return path==="/"?"index":null; }'));
  files.set('karento-best/src/lib/components/Header.svelte',bytes('<script lang="ts">import {goto} from "$app/navigation";const active=page.url.pathname==="/";const logo="/brand/logo.webp";</script><a href="/vehicles">Cars</a><a href={item.href + (filter ? "?sort=price" : "")}>Dynamic</a><img src={logo}/><button onclick={()=>goto("/login")}>Sign in</button>'));
  files.set('karento-best/src/app.html',bytes('<html><head>%sveltekit.head%</head><body>%sveltekit.body%</body></html>'));
  files.set('karento-best/static/brand/logo.webp',bytes('public-logo'));
  files.set('karento-best/static/mobile.css',bytes('.icon{background:url(/brand/logo.webp)}'));
  return files;
}

for (const middle of ['modern','import']) test('v5 validates six explicit families preserving '+middle+' at slot 2',()=>{
  const m=manifest(middle);validatePackagingManifest(m);validateManifest(m);
  const native=baseNativeManifest(m);assert.equal(native.packaging.version,'2');assert.equal(native.variants.length,3);
  assert.equal(native.variants[1].key,middle);assert.equal(native.variants[2].key,middle==='modern'?'import':'modern');
  assert.deepEqual(Object.keys(native.templateRevisions).sort(),['auto-best','import','modern']);
  const config=vercelConfiguration(m);assert.equal(Object.keys(config.services).length,6);assert.equal(config.services.signature.root,'karento-best');
  assert.equal(config.rewrites.at(-1).destination.service,'autobest');assert.equal(config.redirects.find(v=>v.source==='/variant-3').destination,m.variants[2].entry);
  assert.equal(config.services.mobile.installCommand,'node ../scripts/build-native-service.mjs install mobile');
  assert.equal(config.services.signature.buildCommand,'node ../scripts/build-native-service.mjs karento-best --installed');
  assert.ok(!config.services.carwow);assert.ok(!config.services.admin);
});
test('v5 rejects missing, duplicated, historical or reordered designs',()=>{
  for(const mutate of [m=>m.variants.pop(),m=>m.variants[2].key=m.variants[1].key,m=>m.variants[2].key='carwow',m=>m.variants[5].base='/variant-7']){
    const m=manifest();mutate(m);assert.throws(()=>validatePackagingManifest(m));assert.throws(()=>validateManifest(m));
  }
});
test('mounted Svelte URL attributes preserve nested expressions and non-URL route comparisons',()=>{
  const input='<script>const route="/vehicles";</script><a href={item.href + (active ? "?sort=" + sort : "")}>Stock</a><img src={images[index]}/><a href="mailto:dealer@example.test">Email</a>';
  const output=mountSvelteUrlAttributes(input,'/variant-6').text;
  assert.match(output,/href=\{carsMountPath\(item.href \+ \(active/);assert.match(output,/src=\{carsMountPath\(images\[index\]\)\}/);
  assert.match(output,/const route="\/vehicles"/);assert.match(output,/href="mailto:dealer@example.test"/);
});
test('six-design mounting derives actual framework configuration/assets/navigation without changing input',()=>{
  const input=mountedFixture(),before=[...input].map(([name,b])=>[name,b.toString('hex')]);
  const output=applySixVariantMounts(input,manifest());
  assert.deepEqual([...input].map(([name,b])=>[name,b.toString('hex')]),before);
  assert.match(output.get('mobile/next.config.js').toString(),/basePath: '\/variant-5'/);
  assert.match(output.get('mobile/next.config.js').toString(),/outputFileTracingRoot: __dirname/);
  assert.match(output.get('app/next.config.js').toString(),/outputFileTracingRoot: __dirname/);
  const mobile=output.get('mobile/src/component.tsx').toString();assert.match(mobile,/"\/variant-5\/images\/car.webp"/);assert.match(mobile,/url\(\/variant-5\/icons/);assert.match(mobile,/const route="\/vehicle\/one"/);assert.match(mobile,/pathname="\/results"/);
  const header=output.get('karento-best/src/lib/components/Header.svelte').toString();assert.match(header,/href="\/variant-6\/vehicles"/);assert.match(header,/carsLocalPath\(page.url.pathname\)/);assert.match(header,/#lib\/cars-navigation.ts/);assert.match(header,/"\/variant-6\/brand\/logo.webp"/);
  const vite=output.get('karento-best/vite.config.ts').toString();assert.match(vite,/@sveltejs\/adapter-vercel/);assert.match(vite,/runtime: "nodejs24.x"/);assert.match(vite,/base: "\/variant-6"/);
  const pkg=JSON.parse(output.get('karento-best/package.json'));assert.equal(pkg.devDependencies['@sveltejs/adapter-vercel'],'7.0.0');assert.equal(pkg.engines.node,'24.x');
  assert.equal(JSON.parse(output.get('karento-best/package-lock.json')).packages['node_modules/@sveltejs/adapter-vercel'].version,'7.0.0');
  assert.match(output.get('mobile/src/app/layout.tsx').toString(),/src="\/preview-switcher.js"/);assert.match(output.get('karento-best/src/app.html').toString(),/src="\/preview-switcher.js"/);
  assert.match(output.get('app/app/page.tsx').toString(),/redirect\(localePath\('\/',dealer.defaultLocale\)\)/);
  assert.doesNotMatch(output.get('app/app/page.tsx').toString(),/browserPath/);
});
test('generated mount helper is idempotent, preserves external/hash URLs and restores local routes',async t=>{
  const output=applySixVariantMounts(mountedFixture(),manifest());const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cars-six-mount-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
  const file=path.join(dir,'mount.ts');fs.writeFileSync(file,output.get('karento-best/src/lib/cars-mount.ts'));
  const {carsMountPath,carsLocalPath}=await import(pathToFileURL(file));
  for(const value of ['/vehicles','/vehicle?photo=2','/'])assert.equal(carsMountPath(carsMountPath(value)),carsMountPath(value));
  for(const value of ['https://example.test/path','//example.test/path','#contact','tel:+359123456','/preview-switcher.js',undefined,null])assert.equal(carsMountPath(value),value);
  assert.equal(carsLocalPath('/variant-6/vehicles'),'/vehicles');assert.equal(carsLocalPath('/variant-6'),'/');assert.equal(carsLocalPath('/variant-60/vehicles'),'/variant-60/vehicles');
});
test('personalized JSON inventory and Signature detail modules mount copied dealer assets while preserving stock identity',()=>{
  const files=mountedFixture();
  files.set('mobile/public/assets/dealer/car.webp',bytes('car'));
  files.set('mobile/public/dealer-brand/logo.webp',bytes('logo'));
  files.set('mobile/src/lib/dealer-inventory.json',bytes([{id:'actual-stock-id',slug:'actual-stock-slug',image:'/assets/dealer/car.webp',logo:'/dealer-brand/logo.webp',url:'https://dealer.example/actual-stock-id'}]));
  files.set('karento-best/static/assets/dealer/car.webp',bytes('car'));
  files.set('karento-best/static/dealer-brand/logo.webp',bytes('logo'));
  files.set('karento-best/src/lib/data/dealer-detail.ts',bytes('export const detail={id:"actual-stock-id",gallery:["/assets/dealer/car.webp"],logo:"/dealer-brand/logo.webp",route:"/vehicle?id=actual-stock-id"};'));
  const mounted=applySixVariantMounts(files,manifest());
  assert.deepEqual(JSON.parse(mounted.get('mobile/src/lib/dealer-inventory.json')),[{id:'actual-stock-id',slug:'actual-stock-slug',image:'/variant-5/assets/dealer/car.webp',logo:'/variant-5/dealer-brand/logo.webp',url:'https://dealer.example/actual-stock-id'}]);
  const detail=mounted.get('karento-best/src/lib/data/dealer-detail.ts').toString();
  assert.match(detail,/gallery:\["\/variant-6\/assets\/dealer\/car.webp"\]/);
  assert.match(detail,/logo:"\/variant-6\/dealer-brand\/logo.webp"/);
  assert.match(detail,/id:"actual-stock-id"/);assert.match(detail,/route:"\/vehicle\?id=actual-stock-id"/);
});
test('unknown or modified dependency/mount inputs are rejected before package installation',()=>{
  const changed=mountedFixture();changed.set('karento-best/package-lock.json',bytes('{}'));assert.throws(()=>applySixVariantMounts(changed,manifest()),/dependency inputs changed/);
  const hybrid=mountedFixture();hybrid.set('mobile/next.config.js',bytes("module.exports = {basePath:'/already-mounted'}"));assert.throws(()=>applySixVariantMounts(hybrid,manifest()),/unknown basePath/);
});
test('extra dealer source receipts bind each selected revision and complete source bytes',()=>{
  const files=mountedFixture(),m=manifest();files.set('.cars-app.json',bytes('app receipt'));
  for(const [key,name,format] of [['mobile','.cars-mobile.json','mobile-preview-v1'],['karento-best','.cars-signature.json','signature-preview-v1']])files.set(name,bytes({schemaVersion:1,format,dealer:m.slug,name:'Dealer',template:{revision:m.templateRevisions[key]},sourceDigest:extendedSourceDigest(files,key),personalization:{logoPaths:['dealer/logo.webp']},inventory:{count:2}}));
  assertExtendedVariantSources(files,m);sealSixVariantBuild(files,m);assert.equal(JSON.parse(files.get('.cars-six-build.json')).families['karento-best'].base,'/variant-6');
  files.set('mobile/src/component.tsx',bytes('changed source'));assert.throws(()=>assertExtendedVariantSources(files,m),/changed after personalization/);
});
test('Vercel asset pooling covers both new families once while keeping source bytes sealed',()=>{
  const m=manifest(),files=new Map([['dealer.json',bytes(m)],['vercel.json',bytes(vercelConfiguration(m))]]);
  for(const v of m.variants){const publicRoot=v.key==='modern'?'modern/apps/web/public':v.key==='app'||v.key==='mobile'?v.key+'/public':v.key+'/static';files.set(publicRoot+'/dealer/logo.webp',bytes('one-reviewed-dealer-logo'));}
  const plan=applyVercelAssets(files);assert.equal(plan.variants.length,6);assert.equal(plan.objects.length,1);assert.equal(plan.summary.pooledCopies,6);
  assert.equal(plan.summary.localDuplicateBytesAvoided,5*'one-reviewed-dealer-logo'.length);assert.ok(plan.aliases.some(a=>a.source==='/variant-6/dealer/logo\\.webp'));
  assert.match(JSON.parse(files.get('vercel.json')).services.signature.buildCommand,/before karento-best/);
});
for(const key of ['modern','import'])test('native '+key+' build selects the reviewed slot3 from manifest rather than its default',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cars-six-build-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));fs.mkdirSync(path.join(root,key));
  fs.writeFileSync(path.join(root,'dealer.json'),JSON.stringify({packaging:{version:'5'},variants:[{key,base:'/variant-3'}]}));
  const calls=[];const result=runNativeBuild(key,{packageRoot:root,run:(program,args,options)=>{calls.push(options);return {status:0};}});
  assert.equal(result.base,'/variant-3');assert.equal(calls[0].env[key==='modern'?'NEXT_PUBLIC_BASE_PATH':'TEMPLATE_BASE_PATH'],'/variant-3');
  for(const call of calls){
    const paths=Object.entries(call.env).filter(([name])=>name.toLowerCase()==='path');
    assert.equal(paths.length,1,'Windows child environments must not contain competing PATH keys');
    assert.equal(paths[0][1].split(path.delimiter)[0],path.dirname(process.execPath),'npm script compilers must inherit the build Node runtime');
  }
});
test('new native services use retained npm locks and the right compiler/environment',()=>{
  assert.deepEqual(nativeBuildPlan('mobile').steps,[['npm','ci','--include=dev'],['npm','run','build']]);assert.equal(nativeBuildPlan('mobile').environment.NEXT_DIST_DIR,'.next');
  assert.deepEqual(nativeBuildPlan('karento-best').steps.at(-1),['node','../scripts/fix-svelte-service-output.mjs','/variant-6']);
  assert.throws(()=>nativeBuildPlan('mobile','/variant-3'),/Unsupported native mount/);
});

test('derived Modern alternate slot widens only the reviewed build guard and rejects unknown bases',()=>{
  const original='const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";\nif (publicBasePath !== "" && publicBasePath !== "/variant-2") {\nthrow new Error("Modern supports the standalone or native /variant-2 base path");\n}\nconst marker="trust-boundary-unchanged";';
  assert.equal(configureModernMountGuard(original,'/variant-2'),original);
  const generated=configureModernMountGuard(original,'/variant-3');
  assert.equal(configureModernMountGuard(generated,'/variant-3'),generated);
  assert.match(generated,/const marker="trust-boundary-unchanged"/);
  for(const base of ['', '/variant-2','/variant-3'])assert.doesNotThrow(()=>vm.runInNewContext(generated,{process:{env:{NEXT_PUBLIC_BASE_PATH:base}}}));
  for(const base of ['/variant-6','/variant-30','/visitor-selected'])assert.throws(()=>vm.runInNewContext(generated,{process:{env:{NEXT_PUBLIC_BASE_PATH:base}}}),/Modern supports/);
  assert.throws(()=>configureModernMountGuard(original.replace('publicBasePath !== "/variant-2"','!allowed.includes(publicBasePath) /* /variant-2 */'),'/variant-3'),/build guard changed/);
});

test('six-family package integrates source receipts, common identity, final seals and one Services deployment deterministically', async t => {
  // Synthetic test contracts only; these are never dealer release acceptance.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-six-package-'));
  t.after(() => {
    const relative = path.relative(path.resolve(os.tmpdir()), path.resolve(root));
    assert.ok(relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
    fs.rmSync(root, { recursive: true, force: true });
  });
  const source = path.join(root, 'source');
  const native = nativeFixture(source, 'modern', 'publisher-fixture');
  const other = nativeFixture(path.join(root, 'other'), 'import', 'publisher-fixture');
  const m = { ...native.manifest, packaging: { version: '5' }, variants: manifest().variants,
    templateRevisions: { ...manifest().templateRevisions, 'auto-best': native.manifest.templateRevisions['auto-best'], modern: native.manifest.templateRevisions.modern, import: other.manifest.templateRevisions.import }, extraAssets: ['dealer-brand'] };
  const files = new Map([...native.files].filter(([name]) => !name.startsWith('carwow/')));
  for (const [name, content] of other.files) if (name.startsWith('import/')) files.set(name, content);
  for (const [name, content] of mountedFixture()) files.set(name, content);
  const layout = '<script lang="ts">let {children}=$props();</script><svelte:head><meta property="og:image" content="https://reference.example/wrong.png"/></svelte:head>{@render children()}';
  for (const key of ['auto-best', 'import', 'karento-best']) files.set(key + '/src/routes/+layout.svelte', bytes(layout));
  files.set('modern/apps/web/app/[locale]/layout.tsx', bytes('export const metadata={title:"Fixture"};export default function Layout(){return <html><head></head><body>Fixture</body></html>}'));
  files.set('modern/apps/web/proxy.ts', Buffer.concat([files.get('modern/apps/web/proxy.ts'), bytes("export const config={matcher:['/((?!_next|.*\\\\..*).*)']};")]));
  files.set('app/app/layout.tsx', bytes('export const metadata={title:"Fixture"};export default function Layout(){return <html><body>Fixture</body></html>}'));
  files.set('mobile/package.json', bytes({name:'fixture-mobile'}));
  files.set('mobile/src/app/layout.tsx', bytes('export const metadata={title:"Fixture"};export default function Layout(){return <html><body>Fixture</body></html>}'));
  const sharp = createRequire(path.resolve(import.meta.dirname, '../templates/karento-best/package.json'))('sharp');
  const logo = await sharp({create:{width:160,height:60,channels:4,background:'#24313fff'}}).webp({lossless:true}).toBuffer();
  files.set('dealer-brand/logo.webp', logo);
  m.shareIdentity = { name:'Fixture Dealer',publicOrigin:'https://publisher-fixture.example',logo:{sourcePath:'dealer-brand/logo.webp',sha256:createHash('sha256').update(logo).digest('hex')} };
  files.set('app/lib/dealer.json', bytes({mode:'dealer',id:m.slug,name:'Fixture Dealer',logo:{light:'/dealer/logo.webp',dark:'/dealer/logo.webp',icon:'/dealer/logo.webp'}}));
  files.set('app/lib/dealer-inventory.json', bytes([{slug:'fixture-car',images:['/dealer/car.webp']} ]));
  files.set('app/public/dealer/logo.webp',logo);
  files.set('app/public/dealer/car.webp',logo);
  for (const [name, value] of files) files.set(name, normalized(value));
  files.set('.cars-app.json',bytes({schemaVersion:1,dealer:m.slug,template:{revision:m.templateRevisions.app},appDigest:appSourceDigest(new Map([...files].filter(([name])=>name.startsWith('app/')).map(([name,value])=>[name.slice(4),value])))}));
  for (const [key,name,format] of [['mobile','.cars-mobile.json','mobile-preview-v1'],['karento-best','.cars-signature.json','signature-preview-v1']]) files.set(name,bytes({schemaVersion:1,format,dealer:m.slug,name:'Fixture Dealer',template:{revision:m.templateRevisions[key]},sourceDigest:extendedSourceDigest(files,key),personalization:{logoPaths:['dealer/logo.webp']},inventory:{count:1}}));
  files.set('dealer.json',bytes(m));
  for (const [name, value] of files) {const file=path.join(source,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,value);}
  const before = new Map([...files].map(([name,value])=>[name,value.toString('hex')]));
  const options = {source,manifest:m,sourceCommit:'b'.repeat(40),nativeReleases:{'auto-best':native.releases['auto-best'],modern:native.releases.modern,import:other.releases.import}};
  const first = await packageDealer({...options,destination:path.join(root,'first')});
  const second = await packageDealer({...options,destination:path.join(root,'second')});
  assert.equal(first.digest,second.digest);
  const output = new Map(first.files.map(name=>[name,fs.readFileSync(path.join(first.destination,name))]));
  assert.equal(Object.keys(JSON.parse(output.get('vercel.json')).services).length,6);
  assert.match(output.get('auto-best/static/preview-switcher.js').toString(),/"key":"karento-best"/);
  const share = JSON.parse(output.get('.cars-dealer-share.json'));
  assert.equal(share.identity.name,'Fixture Dealer');
  assert.equal(Object.keys(share.metadataBoundaries).length,6);
  assert.deepEqual(share.canonicalQueryIdentity['karento-best'].keys,['id']);
  assert.equal(share.canonicalLocaleIdentity['karento-best'].base,'/variant-6');
  assert.equal(share.canonicalLocaleIdentity['karento-best'].key,'lang');
  assert.equal(share.assets.filter(asset=>asset.path.endsWith('/social.png')).length,1);
  assert.equal(share.assets.find(asset=>asset.path.endsWith('/social.png')).publicUrl.startsWith(m.shareIdentity.publicOrigin+'/dealer-share/'),true);
  const seal=JSON.parse(output.get('.cars-six-build.json'));
  for(const key of ['app','mobile','karento-best']) assert.equal(seal.families[key].digest,extendedSourceDigest(output,key));
  assert.match(output.get('app/app/page.tsx').toString(),/redirect\(localePath\(/);
  assert.doesNotMatch(output.get('karento-best/src/routes/+layout.svelte').toString(),/reference\.example/);
  assert.equal(verifyPackage(first.destination).digest,first.digest);
  for(const [name,value] of before) assert.equal(fs.readFileSync(path.join(source,name)).toString('hex'),value,'canonical input retained: '+name);
  assert.ok(!first.files.some(name=>name.startsWith('carwow/')||name.startsWith('admin/')));
});
