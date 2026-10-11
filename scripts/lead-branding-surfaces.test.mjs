import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {applyLeadBranding,assertLeadBranding,PUBLIC_ROOTS} from './publishing/lead-branding.mjs';
import {resolveBrandingSharp} from './verify-lead-branding.mjs';
import {MOBILE_LOGO_HEADER,assertLogoSurfaceBindings} from './publishing/logo-surface-bindings.mjs';

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
