import test from 'node:test';import assert from 'node:assert/strict';import{createHash}from'node:crypto';
import{applyLeadBranding,assertLeadBranding,PUBLIC_ROOTS}from'./publishing/lead-branding.mjs';
import{MOBILE_LOGO_HEADER}from'./publishing/logo-surface-bindings.mjs';
import{resolveBrandingSharp}from'./verify-lead-branding.mjs';
import{prepareAppDealer}from'./lib/app-dealer-adapter.mjs';
import{refreshBrandedAppProvenance}from'./dealer-updates/update-dealer-template.mjs';
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


async function appFixture(){
 const state=fixture(),profile={slug:'fixture',business:{name:'Truthful dealer',city:'Sofia',phoneDisplay:'+359888123456',logoLight:'/dealer/old-light.png',logoDark:'/dealer/old-dark.png'},listings:[{slug:'car-one',brand:'BMW',model:'X3',year:2022,priceAmount:70000,currency:'EUR',mileageKm:50000,fuelType:'diesel',transmissionType:'automatic',bodyType:'SUV',images:['/dealer/stock/one.webp'],features:['Navigation']}]};
 const light=await artwork([17,183,71]),dark=await artwork([212,87,51]);state.manifest.localization={defaultLocale:'bg',dealerCountry:'BG',inventoryCurrency:'EUR'};state.files.set('auto-best/src/lib/data/dealer-profile.json',json(profile));state.files.set('auto-best/static/dealer/old-light.png',light);state.files.set('auto-best/static/dealer/old-dark.png',dark);state.files.set('auto-best/static/dealer/stock/one.webp',text('recorded stock image'));
 const readFile=async name=>{if(state.files.has(name))return state.files.get(name);throw Object.assign(Error('Missing '+name),{code:'ENOENT'});},app=await prepareAppDealer('',state.manifest,{readFile});for(const[name,bytes]of app.files)state.files.set('app/'+name,bytes);const aliases=app.provenance.assets.filter(a=>['logo-light','logo-dark'].includes(a.role)).map(a=>({path:'app/'+a.output,bytes:Buffer.from(state.files.get('app/'+a.output)),sha256:a.sha256}));assert.equal(aliases.length,2);return{state,app,aliases};
}

test('reviewed branding preserves hash-addressed App aliases through actual provenance regeneration',async()=>{
 const {state,app,aliases}=await appFixture(),input=await inputs(),facts=Buffer.from(state.files.get('auto-best/src/lib/data/dealer-profile.json'));state.files.set('app/public/dealer-app/logo-dark-legacy.png',text('legacy alias'));state.files.set('app/src/legacy-consumer.ts',text('export const old="/dealer-app/logo-dark-legacy.png";'));
 const contract=await apply(state,input);assertLeadBranding(state.files,state.manifest);for(const row of aliases){assert(state.files.get(row.path).equals(row.bytes),'Content-addressed alias was rewritten: '+row.path);assert.equal(sha(state.files.get(row.path)),row.sha256);}assert(state.files.get('app/public/dealer-app/logo-dark-legacy.png').equals(input.dark));const config=JSON.parse(state.files.get('app/lib/dealer.json'));assert.equal(config.logo.light,contract.publicBase+'/logo-on-light.webp');assert.equal(config.logo.dark,contract.publicBase+'/logo-on-dark.webp');assert(state.files.get('auto-best/src/lib/data/dealer-profile.json').equals(facts));
 const inventory=Buffer.from(state.files.get('app/lib/dealer-inventory.json')),result=await refreshBrandedAppProvenance({files:state.files,manifest:state.manifest,provenance:app.provenance});assert.equal(result.proof.inventoryBytesIdentical,true);assert.equal(result.proof.nonLogoBusinessConfigIdentical,true);assert.equal(result.proof.allExistingGeneratedAppBytesIdentical,true);assert.equal(result.proof.selectedFinalLogoBindingPreserved,true);assert.equal(JSON.parse(state.files.get('app/lib/dealer.json')).logo.dark,contract.publicBase+'/logo-on-dark.webp');assert.equal(JSON.parse(state.files.get('app/lib/dealer.json')).logo.light,contract.publicBase+'/logo-on-light.webp');assertLeadBranding(state.files,state.manifest);assert(state.files.get('app/lib/dealer-inventory.json').equals(inventory));for(const row of aliases)assert(state.files.get(row.path).equals(row.bytes));
});

test('a corrupted hash-addressed App alias refuses atomically instead of bypassing its byte lease',async()=>{
 const {state,aliases}=await appFixture(),input=await inputs();state.files.set(aliases[0].path,text('unreviewed different bytes'));const before=digest(state.files);await assert.rejects(()=>apply(state,input),/Content-addressed App logo alias differs/);assert.equal(digest(state.files),before);
});
