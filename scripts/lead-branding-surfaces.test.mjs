import test from 'node:test';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {applyRefreshAdapter} from './lib/client-refresh-adapters.mjs';
import {newSourceReviewedCopy} from './prepare-new-dealer-source.mjs';
import {applyLeadBranding,assertLeadBranding,PUBLIC_ROOTS} from './publishing/lead-branding.mjs';
import {resolveBrandingSharp} from './verify-lead-branding.mjs';
import {MOBILE_LOGO_HEADER,MODERN_LOGO_CONFIG,applyLogoSurfaceBindings,assertLogoSurfaceBindings} from './publishing/logo-surface-bindings.mjs';

const sharp=resolveBrandingSharp(),sha=bytes=>createHash('sha256').update(bytes).digest('hex'),text=source=>Buffer.from(source),json=value=>text(JSON.stringify(value));
const modern=`// LEAD_SITE_CONFIG_START
export const leadSite = {
  accent: "#30343b",
  desktopAccent: "#4b5057",
  logoPath: "/dealer-brand/logo-on-light.webp",
  logoOnLight: "/dealer-brand/logo-on-light.webp",
  logoOnDark: "/dealer-brand/logo-on-dark.webp"
};`;
const importer=`export const dealerTheme = {
  accent: "#17191c",
  accentHover: "#34383d",
  accentContrast: "#ffffff"
};`;
const generation={tool:'image_gen',generationId:'synthetic-fixture-not-rollout-evidence',modelVersion:null,sourceFileSha256:'a'.repeat(64)};
function fixture(){
 const files=new Map([
  ['modern/packages/marketplace/lead-site.ts',text(modern.replace('#30343b','#176b43'))],
  ['import/src/lib/config/dealer.ts',text(importer.replace('#17191c','#176b43'))],
  ['business-facts.json',json({name:'Truthful dealer',phone:'+359888123456',accent:'#176b43'})],
  ['stock.json',json([{id:'real-1',price:18000,currency:'EUR'}])],
  ['locale.json',json({country:'BG',currency:'EUR'})],
  ['auto-best/src/lib/data/dealer-profile.json',json({name:'Truthful dealer',phone:'+359888123456',logo:'/branding/logo-on-light.png'})],
  ['app/lib/dealer.json',json({id:'fixture',name:'Truthful dealer',logo:{light:'/dealer-app/logo-light-old.webp',dark:'/dealer-app/logo-dark-old.webp',icon:'/dealer-app/icon.png'}})],
  [MOBILE_LOGO_HEADER,text(`filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },
              <Image
                src={showroom.logo}
                alt={showroom.name}
              />`)],
  ['app/app/tokens.stylex.ts',text('export const tokens = {background: "#30343b",color: "#ffffff"};')]
 ]);
 for(const [key,root]of Object.entries(PUBLIC_ROOTS)){
  files.set(root+'dealer-brand/logo-on-light.webp',text('old light'));
  files.set(root+'dealer-brand/logo-on-dark.webp',text('old dark'));
  files.set(key+'/src/logo-consumer.ts',text('export const light="/branding/logo-on-light.png",dark="/branding/logo-on-dark.png";'));
 }
 const manifest={slug:'fixture',packaging:{version:'5'},branding:{surfaceBindingsVersion:1},variants:Object.keys(PUBLIC_ROOTS).map(key=>({key})),templateSources:Object.fromEntries(Object.keys(PUBLIC_ROOTS).map(key=>[key,{repository:'darkapoparka/cars',path:'templates/'+key,revision:'1'.repeat(40)}]))};
 const readTemplate=(source,file,optional)=>source.path.endsWith('/modern')?modern:source.path.endsWith('/import')?importer:file==='app/tokens.stylex.ts'?'export const tokens = {background: "#30343b",color: "#ffffff"};':optional?null:(()=>{throw Error('Unexpected template request');})();
 return {files,manifest,readTemplate};
}
async function artwork(rgb,width=160,height=48){
 const rgba=Buffer.alloc(width*height*4);
 for(let y=8;y<height-8;y++)for(let x=12;x<width-12;x++){
  const at=(y*width+x)*4;rgba[at]=rgb[0];rgba[at+1]=rgb[1];rgba[at+2]=rgb[2];rgba[at+3]=255;
 }
 return sharp(rgba,{raw:{width,height,channels:4}}).png().toBuffer();
}
async function inputs(){
 const png=await artwork([17,183,71]),dark=await artwork([245,239,221]),accent=await artwork([71,153,222]),mark=await artwork([17,183,71],32,32);
 const master={png:png.toString('base64'),sha256:sha(png)},reviewedSurfaces={schemaVersion:1,reviewed:true,reviewedAt:'2026-10-11T09:00:00.000Z',surfaces:Object.fromEntries([['onLight',png],['onDark',dark],['onAccent',accent]].map(([name,bytes])=>[name,{png:bytes,sha256:sha(bytes),sourceReference:'synthetic/'+name+'.png',generation}]))};
 return {master,reviewedSurfaces,png,dark,accent,mark};
}
function digest(files){return sha(JSON.stringify([...files].map(([name,bytes])=>[name,sha(bytes)])));}
async function apply(state,input){return applyLeadBranding(state.files,state.manifest,{...input,generation,sharp,readTemplate:state.readTemplate});}

test('three reviewed surfaces retain exact PNG RGB bytes, lossless WebP colors, all60 assets and truthful facts',async()=>{
 const state=fixture(),input=await inputs(),facts=new Map([...state.files].filter(([name])=>['business-facts.json','stock.json','locale.json','auto-best/src/lib/data/dealer-profile.json'].includes(name)));
 const contract=await apply(state,input);assertLeadBranding(state.files,state.manifest);assertLogoSurfaceBindings(state.files,contract.publicBase);
 assert.equal(contract.creationMethod,'image-generation-reviewed-surface-variants');assert.equal(contract.monochromePairFromOneMaster,false);assert.equal(contract.generation.modelVersion,null);assert.equal(contract.assets.length,60);assert.equal(contract.markSource,'full-reviewed-surface-logo-contained');assert.equal('alphaSha256' in contract,false);
 assert.equal(contract.reviewedSurfaceVariants.surfaces.onDark.generation.modelVersion,null);
 for(const [name,bytes]of facts)assert.deepEqual(state.files.get(name),bytes,name);
 for(const root of Object.values(PUBLIC_ROOTS)){
  for(const [tone,bytes]of [['on-light',input.png],['on-dark',input.dark]])assert.deepEqual(state.files.get(root+contract.publicBase.slice(1)+'/logo-'+tone+'.png'),bytes);
  for(const [tone,rgb]of [['on-light',[17,183,71]],['on-dark',[245,239,221]],['on-accent',[71,153,222]]]){
   const {data,info}=await sharp(state.files.get(root+contract.publicBase.slice(1)+'/logo-'+tone+'.webp')).raw().toBuffer({resolveWithObject:true}),at=(24*info.width+80)*info.channels;
   assert.deepEqual([...data.subarray(at,at+3)],rgb);
  }
 }
 const icon=await sharp(state.files.get('branding/app-icon.png')).metadata();assert.equal(icon.hasAlpha,true);assert.equal(icon.width,512);
 const mark=await sharp(state.files.get('branding/mark-on-light.webp')).metadata();assert.equal(mark.width,256);assert.equal(mark.height,256);
 const ico=state.files.get('branding/favicon.ico');assert.equal(ico.readUInt16LE(2),1);assert.equal(ico.readUInt16LE(4),3);
 assert.match(state.files.get('modern/packages/marketplace/lead-site.ts').toString(),/#30343b/);
});

test('each reviewed surface participates in content identity, including a distinct accent image',async()=>{
 const input=await inputs(),one=await apply(fixture(),input);
 for(const name of ['onLight','onDark','onAccent']){
  const changed=await inputs(),png=await artwork([181,37,119]);changed.reviewedSurfaces.surfaces[name]={...changed.reviewedSurfaces.surfaces[name],png,sha256:sha(png)};
  const two=await apply(fixture(),changed);assert.notEqual(two.packId,one.packId,name);
 }
});

test('generated mark colors remain intact and no separate mark claim is fabricated',async()=>{
 const input=await inputs();input.master.markPng=input.mark.toString('base64');input.master.markSha256=sha(input.mark);
 const state=fixture(),contract=await apply(state,input);assert.equal(contract.markSource,'generated-mark-colors-preserved');assert.deepEqual(state.files.get('branding/generated-mark.png'),input.mark);
 const {data,info}=await sharp(state.files.get('branding/mark-on-dark.webp')).raw().toBuffer({resolveWithObject:true}),at=(128*info.width+128)*info.channels;
 assert.deepEqual([...data.subarray(at,at+3)],[17,183,71]);
});

test('missing surface, false review, hash mismatch, non-PNG and absent provenance reject atomically',async()=>{
 for(const mutate of [
  input=>{input.reviewedSurfaces=null;},
  input=>{delete input.reviewedSurfaces.surfaces.onAccent;},
  input=>{input.reviewedSurfaces.surfaces.other=input.reviewedSurfaces.surfaces.onLight;},
  input=>{input.reviewedSurfaces.reviewed=false;},
  input=>{input.reviewedSurfaces.reviewedAt='unknown';},
  input=>{input.reviewedSurfaces.surfaces.onLight.sha256='0'.repeat(64);},
  input=>{input.reviewedSurfaces.surfaces.onDark.sourceReference='';},
  input=>{input.reviewedSurfaces.surfaces.onDark.generation={tool:'unknown',generationId:'fake'};},
  input=>{input.master.sha256='0'.repeat(64);},
  input=>{input.master.markSha256='0'.repeat(64);},
  async input=>{const png=await sharp(input.png).webp().toBuffer();input.reviewedSurfaces.surfaces.onLight.png=png;input.reviewedSurfaces.surfaces.onLight.sha256=sha(png);}
 ]){
  const state=fixture(),input=await inputs(),before=digest(state.files);await mutate(input);await assert.rejects(()=>apply(state,input));assert.equal(digest(state.files),before);
 }
});

test('opaque, alpha-free and empty artwork refuse review despite correct PNG hashes',async()=>{
 for(const options of [
  {create:{width:160,height:48,channels:4,background:'#176b43'}},
  {create:{width:160,height:48,channels:3,background:'#176b43'}},
  {create:{width:160,height:48,channels:4,background:'#00000000'}}
 ]){
  const state=fixture(),input=await inputs(),before=digest(state.files),png=await sharp(options).png().toBuffer();input.reviewedSurfaces.surfaces.onAccent={...input.reviewedSurfaces.surfaces.onAccent,png,sha256:sha(png)};
  await assert.rejects(()=>apply(state,input),/alpha|opaque|substantive/);assert.equal(digest(state.files),before);
 }
});

test('all60 public assets, reviewed input seals, facts, palettes and surface bindings stay mandatory',async()=>{
 const state=fixture(),contract=await apply(state,await inputs());
 for(const row of contract.assets){const broken=new Map(state.files);broken.set(row.path,text('changed'));assert.throws(()=>assertLeadBranding(broken,state.manifest),/source changed|missing or changed/);}
 for(const row of contract.packInputs){const broken=new Map(state.files);broken.set(row.path,text('changed'));assert.throws(()=>assertLeadBranding(broken,state.manifest),/source missing or changed/);}
 for(const name of Object.keys(contract.facts)){const broken=new Map(state.files);broken.set(name,json({fake:true}));assert.throws(()=>assertLeadBranding(broken,state.manifest),/Factual source changed/);}
 const palette=new Map(state.files);palette.set('modern/packages/marketplace/lead-site.ts',text(palette.get('modern/packages/marketplace/lead-site.ts').toString().replace('#30343b','#176b43')));assert.throws(()=>assertLeadBranding(palette,state.manifest),/palette override/);
 const surface=new Map(state.files);surface.set(MOBILE_LOGO_HEADER,text('no committed source artwork'));assert.throws(()=>assertLeadBranding(surface,state.manifest),/Logo consumer|Mobile hero/);
 const receipt=JSON.parse(state.files.get('.cars-branding.json'));receipt.reviewedSurfaceVariants.reviewed=false;const unreviewed=new Map(state.files);unreviewed.set('.cars-branding.json',json(receipt));assert.throws(()=>assertLeadBranding(unreviewed,state.manifest),/explicit surface review/);
 await assert.rejects(async()=>apply(state,await inputs()),/already exists/);
});

test('legacy monochrome mode retains matching alpha, original content identity and older contracts',async()=>{
 const state=fixture(),input=await inputs();input.master.markPng=input.mark.toString('base64');input.master.markSha256=sha(input.mark);delete input.reviewedSurfaces;
 const beforeFacts=Buffer.from(state.files.get('business-facts.json')),contract=await apply(state,input);assertLeadBranding(state.files,state.manifest);
 assert.equal(contract.monochromePairFromOneMaster,true);assert.equal(contract.creationMethod,'image-generation-derived-raster');assert.equal(contract.packId,sha(Buffer.concat([input.png,input.mark])).slice(0,16));assert.equal(contract.assets.length,60);assert.deepEqual(state.files.get('business-facts.json'),beforeFacts);
 const a=await sharp(state.files.get('branding/logo-on-light.webp')).raw().toBuffer({resolveWithObject:true}),b=await sharp(state.files.get('branding/logo-on-dark.webp')).raw().toBuffer({resolveWithObject:true});
 for(let i=0;i<a.data.length;i+=4){assert.equal(a.data[i+3],b.data[i+3]);if(a.data[i+3]>=230){assert(Math.max(...a.data.subarray(i,i+3))<50);assert(Math.min(...b.data.subarray(i,i+3))>=250);}}
 delete contract.creationMethod;state.files.set('.cars-branding.json',json(contract));assertLeadBranding(state.files,state.manifest);
});

test('template color drift rejects both modes without mutating source',async()=>{
 for(const reviewed of [true,false]){
  const state=fixture(),input=await inputs();state.files.set('app/app/tokens.stylex.ts',text('export const tokens = {background: "#ff0000",color: "#ffffff"};'));
  if(!reviewed){input.master.markPng=input.mark.toString('base64');input.master.markSha256=sha(input.mark);delete input.reviewedSurfaces;}
  const before=digest(state.files);await assert.rejects(()=>apply(state,input),/palette drift/);assert.equal(digest(state.files),before);
 }
});

const bindingRoot=()=>path.resolve(process.env.CARS_LOGO_BINDING_TEST_ROOT||path.join(import.meta.dirname,'..'));
const nativeText=name=>fs.readFileSync(path.join(bindingRoot(),'templates',name),'utf8');
const surfaceBase='/dealer-brand/v2-0123456789abcdef';
const bindingFiles=source=>new Map([[MODERN_LOGO_CONFIG,text(source)],[MOBILE_LOGO_HEADER,text(nativeText('mobile/src/components/Header.tsx'))]]);
const inverseLine=/^[ \t]*logoInversePath:[^\n]*\n/m;

test('real Modern config without legacy logoOnLight gains exactly one inverse raster and preserves native source',()=>{
 const source=nativeText('modern/packages/marketplace/lead-site.ts');
 assert.match(source,/readonly logoInversePath\?: string/);
 assert.doesNotMatch(source,/^[ \t]*logoOnLight:/m);
 const files=bindingFiles(source);applyLogoSurfaceBindings(files,surfaceBase);assertLogoSurfaceBindings(files,surfaceBase);
 const bound=files.get(MODERN_LOGO_CONFIG).toString();
 assert.equal(bound.replace(inverseLine,''),source);
 assert.equal((bound.match(/^[ \t]*logoInversePath:/gm)||[]).length,1);
 assert.equal(bound.match(/^[ \t]*logoInversePath:[ \t]*("[^"]+")/m)[1],JSON.stringify(surfaceBase+'/logo-on-dark.webp'));
 const first=Buffer.from(files.get(MODERN_LOGO_CONFIG));applyLogoSurfaceBindings(files,surfaceBase);assert.deepEqual(files.get(MODERN_LOGO_CONFIG),first);
 const consumer=nativeText('modern/packages/marketplace/site-config.ts');
 const expression=consumer.match(/inverseLogo: (config\.logoInversePath \?\? config\.logoPath),/)[1];
 const inverse=JSON.parse(bound.match(/^[ \t]*logoInversePath:[ \t]*("[^"]+")/m)[1]);
 assert.equal(Function('config','return '+expression)({logoInversePath:inverse,logoPath:'/retained-primary.png'}),surfaceBase+'/logo-on-dark.webp');
});

test('actual first3 normalization and Modern adapter output retain facts, primary raster and native config after binding',()=>{
 const original=nativeText('modern/packages/marketplace/lead-site.ts'),nativeListings=nativeText('modern/packages/marketplace-domain/testing/mock-data.ts');
 const client=path.resolve(process.env.CARS_LOGO_BINDING_TEST_OUTPUT_ROOT||path.join(bindingRoot(),'runtime/modern-logo-binding-tests')),candidate=path.join(client,'modern');
 const writeFixture=(name,bytes)=>{const target=path.join(client,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);};
 for(const slug of ['centralauto-varna','kalchev-varna','sevicar-varna']){
  const prefix=path.join(bindingRoot(),'docs/releases/cloudflare-existing25-20261011/new-source',slug);
  const inputs=Object.fromEntries(['facts','stock','locale'].map(key=>[key,fs.readFileSync(path.join(prefix,key+'.json'))]));
  const branding=JSON.parse(fs.readFileSync(path.join(prefix,'branding.json'),'utf8'));
  for(const [key,name]of [['facts','business-facts.json'],['stock','stock.json'],['locale','locale.json']])writeFixture(name,inputs[key]);
  for(const [tone,name]of [['onLight','logo-on-light.png'],['onDark','logo-on-dark.png']]){
   const bytes=fs.readFileSync(path.join(bindingRoot(),branding.surfaces[tone].path));assert.equal(sha(bytes),branding.surfaces[tone].sha256);writeFixture('dealer-brand/'+name,bytes);
  }
  writeFixture('modern/packages/marketplace/lead-site.ts',original);writeFixture('modern/packages/marketplace-domain/testing/mock-data.ts',nativeListings);
  const profile=loadDealerProfile(client,slug),stock=JSON.parse(inputs.stock);
  assert.equal(profile.sourceCount,stock.records.length);assert.equal(profile.listings.length,stock.records.length);assert.equal(profile.stockKind,stock.kind);
  const copyReview=JSON.parse(fs.readFileSync(path.join(prefix,'copy-review.json'),'utf8'));
  applyRefreshAdapter({key:'modern',oldVariant:candidate,candidate,profile,reviewedModernCopy:newSourceReviewedCopy(profile,copyReview)});
  const prepared=fs.readFileSync(path.join(candidate,'packages/marketplace/lead-site.ts'),'utf8');assert.doesNotMatch(prepared,/^[ \t]*logoOnLight:/m);
  assert.match(prepared,/logoPath: "\/dealer-brand\/logo-on-light\.png"/);
  const files=bindingFiles(prepared);applyLogoSurfaceBindings(files,surfaceBase);assertLogoSurfaceBindings(files,surfaceBase);
  assert.equal(files.get(MODERN_LOGO_CONFIG).toString().replace(inverseLine,''),prepared,slug);
  for(const [key,name]of [['facts','business-facts.json'],['stock','stock.json'],['locale','locale.json']])assert.deepEqual(fs.readFileSync(path.join(client,name)),inputs[key],slug+' '+key);
 }
});

test('Modern inverse binding preserves supported legacy and existing inverse consumers',()=>{
 for(const source of [modern,modern.replace('  logoOnLight:', '  logoInversePath: "/old-inverse.webp",\n  logoOnLight:')]){
  const files=bindingFiles(source),primary=source.match(/^[ \t]*logoPath:[^\n]*/m)[0];
  applyLogoSurfaceBindings(files,surfaceBase);assertLogoSurfaceBindings(files,surfaceBase);const bound=files.get(MODERN_LOGO_CONFIG).toString();
  assert.equal((bound.match(/^[ \t]*logoInversePath:/gm)||[]).length,1);assert.equal(bound.match(/^[ \t]*logoPath:[^\n]*/m)[0],primary);
 }
});

test('missing, duplicate and unknown Modern assignment boundaries reject without changing the map',()=>{
 const source=nativeText('modern/packages/marketplace/lead-site.ts');
 for(const mutate of [
  s=>s.replace(/^  logoPath:[^\n]*\n/m,''),
  s=>s.replace(/^  logoPath:[^\n]*$/m,line=>line+'\n'+line),
  s=>s.replace(/^  logoPath:[^\n]*$/m,'  logoPath: unknownLogo(),'),
  s=>s.replace(/^  logoPath:[^\n]*$/m,'  logoPath: "missing-comma.png"'),
  s=>s.replace(/^  logoPath:[^\n]*$/m,line=>line+'\n  logoInversePath: "a.png",\n  logoInversePath: "b.png",'),
  s=>s.replace(/^  logoPath:[^\n]*$/m,line=>line+'\n  logoInversePath: unknownLogo(),'),
  s=>s.replace(/^  logoPath:[^\n]*$/m,line=>line+'\n  logoInversePath: "a.png" + unknownLogo(),'),
  s=>s.replace(/^  logoPath:[^\n]*$/m,'  logoPath: unknownLogo(),\n  logoInversePath: "a.png",')
 ]){
  const files=bindingFiles(mutate(source)),before=new Map([...files].map(([name,bytes])=>[name,Buffer.from(bytes)]));
  assert.throws(()=>applyLogoSurfaceBindings(files,surfaceBase),/Changed logo surface boundary Modern inverse logo/);assert.deepEqual(files,before);
 }
 const duplicateLegacy=bindingFiles(modern.replace('  logoOnLight:', '  logoOnLight: "a.png",\n  logoOnLight:'));
 assert.throws(()=>applyLogoSurfaceBindings(duplicateLegacy,surfaceBase),/Changed logo surface boundary/);
 const files=bindingFiles(source);applyLogoSurfaceBindings(files,surfaceBase);
 files.set(MODERN_LOGO_CONFIG,text(files.get(MODERN_LOGO_CONFIG).toString().replace(inverseLine,line=>line+line)));
 assert.throws(()=>assertLogoSurfaceBindings(files,surfaceBase),/Modern dark footer/);
});


// Parse adversarial native configs as TypeScript data without evaluating them.
const nativeSyntax=source=>{assert.doesNotThrow(()=>stripTypeScriptTypes('declare function unknownLogo(): string;\n'+source));return source;};
const logoFieldLine=/^  logoPath:[^\n]*$/m;

test('supported spaced primary and inverse literals preserve the native primary and update exactly one inverse',()=>{
 const source=nativeText('modern/packages/marketplace/lead-site.ts');
 for(const spaces of [' ', '\t', ' \t ']){
  const spaced=nativeSyntax(source.replace(logoFieldLine,line=>line.replace('logoPath:', 'logoPath'+spaces+':')+'\n  logoInversePath'+spaces+': "/old-inverse.webp",'));
  const files=bindingFiles(spaced),primary=spaced.match(/^[ \t]*logoPath[ \t]*:[^\n]*$/m)[0];
  applyLogoSurfaceBindings(files,surfaceBase);assertLogoSurfaceBindings(files,surfaceBase);const bound=files.get(MODERN_LOGO_CONFIG).toString();
  assert.equal(bound.match(/^[ \t]*logoPath[ \t]*:[^\n]*$/m)[0],primary);
  assert.equal((bound.match(/^[ \t]*logoInversePath[ \t]*:/gm)||[]).length,1);
  assert.equal(bound.replace(/^([ \t]*logoInversePath[ \t]*:[ \t]*)"[^"\n]*"/m,'$1"/old-inverse.webp"'),spaced);
  const bytes=Buffer.from(files.get(MODERN_LOGO_CONFIG));applyLogoSurfaceBindings(files,surfaceBase);assert.deepEqual(files.get(MODERN_LOGO_CONFIG),bytes);
 }
});

test('spaced computed and duplicate Modern primary or inverse assignments reject before any map changes',()=>{
 const source=nativeText('modern/packages/marketplace/lead-site.ts');
 const mutations=[
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath : unknownLogo(),'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath\t: unknownLogo(),'),
  s=>s.replace(logoFieldLine,'  logoPath : unknownLogo(),'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoPath : unknownLogo(),'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath: "/old.webp",\n  logoInversePath : unknownLogo(),'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath : "/one.webp",\n  logoInversePath\t: "/two.webp",'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath : "/old.webp" + unknownLogo(),'),
 ];
 for(const key of ['logoPath','logoInversePath'])for(const alternate of ['"'+key+'"',"'"+key+"'",'["'+key+'"]',"[ '"+key+"' ]"]){
  mutations.push(s=>s.replace(logoFieldLine,line=>line+'\n  '+alternate+' : unknownLogo(),'));
  mutations.push(s=>s.replace(logoFieldLine,line=>line+'\n  '+alternate+' : "/later-override.webp",'));
 }
 for(const mutate of mutations){const files=bindingFiles(nativeSyntax(mutate(source))),before=new Map([...files].map(([name,bytes])=>[name,Buffer.from(bytes)]));assert.throws(()=>applyLogoSurfaceBindings(files,surfaceBase),/Changed logo surface boundary Modern inverse logo/);assert.deepEqual(files,before);}
});

test('assert-only Modern checks reject spaced computed replacements and alternate known-key overrides',()=>{
 const files=bindingFiles(nativeText('modern/packages/marketplace/lead-site.ts'));applyLogoSurfaceBindings(files,surfaceBase);const bound=files.get(MODERN_LOGO_CONFIG).toString();
 const mutations=[
  s=>s.replace(/^  logoInversePath:[^\n]*$/m,'  logoInversePath : unknownLogo(),'),
  s=>s.replace(logoFieldLine,'  logoPath\t: unknownLogo(),'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoPath : "/later-primary.webp",'),
  s=>s.replace(logoFieldLine,line=>line+'\n  logoInversePath\t: unknownLogo(),'),
 ];
 for(const key of ['logoPath','logoInversePath'])for(const alternate of ['"'+key+'"',"'"+key+"'",'["'+key+'"]',"[ '"+key+"' ]"]){
  mutations.push(s=>s.replace(logoFieldLine,line=>line+'\n  '+alternate+' : unknownLogo(),'));
  mutations.push(s=>s.replace(logoFieldLine,line=>line+'\n  '+alternate+' : "/later-override.webp",'));
 }
 for(const mutate of mutations){const candidate=new Map(files);candidate.set(MODERN_LOGO_CONFIG,text(nativeSyntax(mutate(bound))));const before=new Map([...candidate].map(([name,bytes])=>[name,Buffer.from(bytes)]));assert.throws(()=>assertLogoSurfaceBindings(candidate,surfaceBase),/Modern dark footer/);assert.deepEqual(candidate,before);}
});

test('actual native config rejects computed declarations, spreads and escaped quoted keys atomically',()=>{
 const source=nativeText('modern/packages/marketplace/lead-site.ts');
 const applied=bindingFiles(source);applyLogoSurfaceBindings(applied,surfaceBase);
 const bound=applied.get(MODERN_LOGO_CONFIG).toString();
 const declarations=[];
 for(const key of ['logoPath','logoInversePath']){
  declarations.push('['+String.fromCharCode(96)+key+String.fromCharCode(96)+'] : "/later-override.webp",');
  declarations.push('["logo" + "'+key.slice(4)+'"] : "/later-override.webp",');
  declarations.push('["'+key+'" as const] : "/later-override.webp",');
  declarations.push('"logo\\u0050'+key.slice(5)+'" : "/later-override.webp",');
  declarations.push('"logo\\x50'+key.slice(5)+'" : "/later-override.webp",');
  declarations.push('...{'+key+': "/later-override.webp"},');
 }
 declarations.push('...unknownLogo(),');
 for(const declaration of declarations)for(const separator of ['\n  ',' ']){
  const mutate=original=>original.replace(logoFieldLine,line=>line+separator+declaration);
  const files=bindingFiles(nativeSyntax(mutate(source))),before=new Map([...files].map(([name,bytes])=>[name,Buffer.from(bytes)]));
  assert.throws(()=>applyLogoSurfaceBindings(files,surfaceBase),/Changed logo surface boundary Modern inverse logo/,declaration);assert.deepEqual(files,before);
  const candidate=new Map(applied);candidate.set(MODERN_LOGO_CONFIG,text(nativeSyntax(mutate(bound))));const assertedBefore=new Map([...candidate].map(([name,bytes])=>[name,Buffer.from(bytes)]));
  assert.throws(()=>assertLogoSurfaceBindings(candidate,surfaceBase),/Modern dark footer/,declaration);assert.deepEqual(candidate,assertedBefore);
 }
 // Punctuation in factual string values and comments is never a declaration.
 const safe=nativeSyntax(source.replace('  websiteKind: "dealership",','  websiteKind: "dealership",\n  // ...["logoInversePath"]: ignored comment\n  displayNote: "... [computed] \\"logoInversePath\\": value",'));
 const safeFiles=bindingFiles(safe);applyLogoSurfaceBindings(safeFiles,surfaceBase);assertLogoSurfaceBindings(safeFiles,surfaceBase);
 assert.equal(safeFiles.get(MODERN_LOGO_CONFIG).toString().replace(inverseLine,''),safe);
});
