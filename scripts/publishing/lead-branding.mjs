import {applyLogoSurfaceBindings,assertLogoSurfaceBindings,MOBILE_LOGO_HEADER} from './logo-surface-bindings.mjs';
/** Dealer branding is content. Template palettes are not inferred from that content. */
import {createHash} from 'node:crypto';
export const BRANDING_SCHEMA = 1;
export const PUBLIC_ROOTS = Object.freeze({'auto-best':'auto-best/static/',modern:'modern/apps/web/public/',import:'import/static/',app:'app/public/',mobile:'mobile/public/','karento-best':'karento-best/static/'});
const sha = b => createHash('sha256').update(b).digest('hex');
const encode = v => Buffer.from(JSON.stringify(v,null,2)+'\n');
const read = (files,name) => {if(!files.has(name))throw Error('Missing branding input: '+name);return Buffer.from(files.get(name)).toString('utf8');};
const PROFILE_LOGO_CONSUMERS=Object.freeze({'auto-best':'auto-best/src/lib/data/dealer-profile.json',import:'import/src/lib/data/dealer-profile.json',modern:'modern/packages/marketplace-domain/testing/dealer-profile.json'});
function derivedProfileLogoRows(files,publicBase,originalFiles=files){
 if(!(files instanceof Map)||!(originalFiles instanceof Map))throw Error('Exact final profile logo pack required');
 const rows=[];
 for(const [key,name]of Object.entries(PROFILE_LOGO_CONSUMERS)){
  if(!files.has(name))continue;const before=Buffer.from(files.get(name)),profile=JSON.parse(before.toString('utf8'));
  if(profile.logoContract===undefined||profile.logoContract===null)continue;
  if(typeof publicBase!=='string'||!/^\/dealer-brand\/v2-[a-f0-9]{16}$/.test(publicBase))throw Error('Exact final profile logo pack required');
  const original=JSON.parse(read(originalFiles,name)),assets=profile.logoContract?.assets;
  if(!original.logoContract?.assets||!profile.business||!assets||Array.isArray(assets))throw Error('Malformed derived profile logo contract: '+name);
  const bindings={};for(const [surface,tone]of [['onLight','on-light'],['onDark','on-dark'],['onAccent','on-accent']]){
   const prior=assets[surface];if(!prior||typeof prior.publicPath!=='string'||!/^\/[A-Za-z0-9/._-]+$/.test(prior.publicPath)||prior.publicPath.includes('..')||!/^[a-f0-9]{64}$/.test(prior.sha256))throw Error('Malformed derived profile logo surface: '+name+'/'+surface);
   let priorBytesValid=Number.isSafeInteger(prior.bytes)&&prior.bytes>=1;
   if(!Object.hasOwn(prior,'bytes')){
    // Older published contracts omitted bytes; admit only their exact retained raster.
    const recorded=original.logoContract.assets[surface],retained=originalFiles.get(PUBLIC_ROOTS[key]+prior.publicPath.slice(1));
    priorBytesValid=!!recorded&&!Object.hasOwn(recorded,'bytes')&&recorded.publicPath===prior.publicPath&&recorded.sha256===prior.sha256&&Buffer.isBuffer(retained)&&retained.length>0&&sha(retained)===prior.sha256;
   }
   if(!priorBytesValid)throw Error('Malformed derived profile logo surface: '+name+'/'+surface);
   const publicPath=publicBase+'/logo-'+tone+'.webp',physicalPath=PUBLIC_ROOTS[key]+publicPath.slice(1),bytes=files.get(physicalPath);if(!Buffer.isBuffer(bytes)||bytes.length<1)throw Error('Missing final profile logo asset: '+physicalPath);
   bindings[surface]={publicPath,sha256:sha(bytes),bytes:bytes.length};profile.logoContract.assets[surface]={...prior,...bindings[surface]};
  }
  for(const [field,surface]of [['logo','onLight'],['logoLight','onLight'],['logoDark','onDark']]){if(typeof profile.business[field]!=='string')throw Error('Malformed derived business logo binding: '+name+'/'+field);profile.business[field]=bindings[surface].publicPath;}
  // Restore only the declared derived logo fields to prove all facts/stock/custom fields survive.
  const factual=JSON.parse(JSON.stringify(profile));for(const field of ['logo','logoLight','logoDark'])factual.business[field]=original.business[field];for(const surface of ['onLight','onDark','onAccent'])for(const field of ['publicPath','sha256','bytes'])factual.logoContract.assets[surface][field]=original.logoContract.assets[surface][field];
  if(JSON.stringify(factual)!==JSON.stringify(original))throw Error('Branding changed non-logo profile facts: '+name);
  const after=encode(profile);rows.push({path:name,beforeSha256:sha(Buffer.from(originalFiles.get(name))),afterSha256:sha(after),assets:bindings,factualFieldsUnchanged:true,before,after});
 }return rows;
}
export function rebindDerivedProfileLogoContracts(files,publicBase,{originalFiles=files}={}){
 const rows=derivedProfileLogoRows(files,publicBase,originalFiles);for(const row of rows)files.set(row.path,row.after);return rows.map(({before,after,...proof})=>proof);
}
export function assertDerivedProfileLogoContracts(files,publicBase){
 for(const row of derivedProfileLogoRows(files,publicBase)){const actual=JSON.parse(row.before.toString('utf8')),expected=JSON.parse(row.after.toString('utf8'));for(const field of ['logo','logoLight','logoDark'])if(actual.business[field]!==expected.business[field])throw Error('Final derived profile business logo differs: '+row.path);for(const surface of ['onLight','onDark','onAccent'])for(const field of ['publicPath','sha256','bytes'])if(actual.logoContract.assets[surface][field]!==expected.logoContract.assets[surface][field])throw Error('Final derived profile logo bytes differ: '+row.path+'/'+surface+'/'+field);}
}
const cssColors = text => (text.match(/#[\da-f]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)/gi)||[]).map(v=>v.toLowerCase().replace(/\s+/g,''));
const PALETTES = Object.freeze([
 {key:'modern',file:'packages/marketplace/lead-site.ts',start:'// LEAD_SITE_CONFIG_START',fields:['accent','desktopAccent']},
 {key:'import',file:'src/lib/config/dealer.ts',start:'export const dealerTheme = {',fields:['accent','accentHover','accentContrast']}
]);
function scalar(text,field,start){const at=text.indexOf(start);if(at<0)throw Error('Missing palette boundary: '+start);const part=text.slice(at),pattern=new RegExp('(^[ \\t]*'+field+':[ \\t]*)([\"\'])(#[a-fA-F0-9]{3,8})\\2','m'),match=pattern.exec(part);if(!match)throw Error('Missing native palette field: '+field);return {value:match[3],at:at+match.index,match:match[0],prefix:match[1]};}
export function preserveTemplatePalettes(files,manifest,readTemplate){
 const changes=[],checks=[];
 for(const rule of PALETTES){const source=manifest.templateSources?.[rule.key];if(source?.repository!=='darkapoparka/cars'||source.path!=='templates/'+rule.key)throw Error('Missing exact template palette source');const native=readTemplate(source,rule.file),name=rule.key+'/'+rule.file;let current=read(files,name);
  for(const field of rule.fields){const expected=scalar(native,field,rule.start).value,actual=scalar(current,field,rule.start);if(actual.value!==expected){current=current.slice(0,actual.at)+actual.prefix+JSON.stringify(expected)+current.slice(actual.at+actual.match.length);changes.push({path:name,field,from:actual.value,to:expected});}checks.push({path:name,field,value:expected,sourceRevision:source.revision});}
  files.set(name,Buffer.from(current));
 }
 // Compare colour sequences, not localized labels or native route mounts.
 for(const [name,bytes] of files){const family=Object.keys(PUBLIC_ROOTS).find(k=>name.startsWith(k+'/'));if(!family||!/(?:\.css|\.scss|\.stylex\.tsx?)$/.test(name)||name.includes('/static/')||name.includes('/public/'))continue;const source=manifest.templateSources[family],native=readTemplate(source,name.slice(family.length+1),true),actual=cssColors(Buffer.from(bytes).toString());if(native===null){if(actual.length)throw Error('Unreviewed new palette stylesheet: '+name);continue;}const expected=cssColors(native);if(JSON.stringify(expected)!==JSON.stringify(actual))throw Error('Unapproved template palette drift: '+name);checks.push({path:name,colorSequenceSha256:sha(JSON.stringify(expected)),sourceRevision:source.revision});}
 return {policy:'template-default',changes,checks};
}
function iconFile(frames){const head=Buffer.alloc(6+16*frames.length);head.writeUInt16LE(1,2);head.writeUInt16LE(frames.length,4);let offset=head.length;frames.forEach(({size,bytes},i)=>{const at=6+i*16;head[at]=size===256?0:size;head[at+1]=head[at];head.writeUInt16LE(1,at+4);head.writeUInt16LE(32,at+6);head.writeUInt32LE(bytes.length,at+8);head.writeUInt32LE(offset,at+12);offset+=bytes.length;});return Buffer.concat([head,...frames.map(f=>f.bytes)]);}
async function rasterPack(master,sharp){
 const png=Buffer.from(master.png,'base64'),markPng=Buffer.from(master.markPng,'base64');if(sha(png)!==master.sha256||sha(markPng)!==master.markSha256)throw Error('Generated master hash mismatch');
 const source=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true}),mark=await sharp(markPng).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(source.info.width<160||source.info.height<45||source.info.channels!==4||mark.info.channels!==4||Math.min(mark.info.width,mark.info.height)<12)throw Error('Generated artwork does not meet the reviewed source-size boundary');
 let transparent=0,opaque=0;for(let i=3;i<source.data.length;i+=4){if(source.data[i]===0)transparent++;if(source.data[i]>=230)opaque++;}if(transparent<source.info.width*source.info.height*.25||opaque<80)throw Error('Logo has an opaque background or no substantive artwork');
 const assets=new Map();
 async function paint(input,white,width){const rgba=Buffer.from(input.data);for(let i=0;i<rgba.length;i+=4){rgba[i]=white?255:18;rgba[i+1]=white?255:21;rgba[i+2]=white?255:26;}return sharp(rgba,{raw:input.info}).resize({width}).png().toBuffer();}
 for(const [tone,white]of [['on-light',false],['on-dark',true]]){
  const logo=await paint(source,white,512);assets.set('logo-'+tone+'.png',logo);assets.set('logo-'+tone+'.webp',await sharp(logo).webp({lossless:true,effort:6}).toBuffer());
  const painted=await paint(mark,white,192),tile=await sharp(painted).resize(192,192,{fit:'contain',background:'#00000000'}).extend({top:32,bottom:32,left:32,right:32,background:'#00000000'}).png().toBuffer();assets.set('mark-'+tone+'.webp',await sharp(tile).webp({lossless:true,effort:6}).toBuffer());
 }
 assets.set('logo-on-accent.webp',assets.get('logo-on-dark.webp'));
 const icon=await sharp(assets.get('mark-on-light.webp')).flatten({background:'#ffffff'}).resize(512,512).png().toBuffer();assets.set('app-icon.png',icon);assets.set('apple-touch-icon.png',await sharp(icon).resize(180,180).png().toBuffer());assets.set('favicon.ico',iconFile(await Promise.all([16,32,48].map(async size=>({size,bytes:await sharp(icon).resize(size,size).png().toBuffer()})))));
 return {assets,masterPng:png,markPng,nativeMaster:{width:source.info.width,height:source.info.height},alphaSha256:sha(Buffer.from(source.data.filter((_,i)=>i%4===3)))};
}
const SURFACE_NAMES=Object.freeze({onLight:'on-light',onDark:'on-dark',onAccent:'on-accent'});
const PNG_SIGNATURE=Buffer.from([137,80,78,71,13,10,26,10]);
const validHash=value=>/^[a-f0-9]{64}$/.test(value||'');
function reviewedGeneration(value){
 if(!value||!['image_gen','image_gen.imagegen'].includes(value.tool)||typeof value.generationId!=='string'||!value.generationId.trim()||
  (value.modelVersion!==undefined&&value.modelVersion!==null&&(typeof value.modelVersion!=='string'||!value.modelVersion.trim())))throw Error('Reviewed surface requires actual ImageGen generation provenance');
 return {tool:value.tool,id:value.generationId,modelVersion:value.modelVersion??null};
}
export function reviewedRasterProvenance(input,{retainedAllowed=false}={}){
 if(input?.generation!==undefined&&input.generation!==null){if(input.retainedSource!==undefined)throw Error('A raster cannot be both generated and retained');return {generation:reviewedGeneration(input.generation)};}
 const source=input?.retainedSource;
 if(!retainedAllowed||source?.kind!=='retained-reviewed-raster'||!validHash(source.sha256)||!validHash(source.reviewSha256)||typeof source.reviewReference!=='string')throw Error('Reviewed surface requires actual ImageGen generation provenance or explicit retained raster proof');
 reviewSourceReference(source.reference);reviewSourceReference(source.reviewReference);
 return {retainedSource:{kind:source.kind,reference:source.reference,sha256:source.sha256,reviewReference:source.reviewReference,reviewSha256:source.reviewSha256}};
}
const REVIEWED_ASSET_NAMES=new Set(['mark-on-light.webp','mark-on-dark.webp','app-icon.png','apple-touch-icon.png','favicon.ico']);
function reviewSourceReference(value){if(typeof value!=='string'||!value.trim()||value.length>2048||/[\x00-\x1f]/.test(value))throw Error('Reviewed surface source reference is required');return value;}
function assertSurfaceReview(value){
 if(value?.schemaVersion!==1||value.reviewed!==true||typeof value.reviewedAt!=='string'||!/^\d{4}-\d{2}-\d{2}T/.test(value.reviewedAt)||!Number.isFinite(Date.parse(value.reviewedAt)))throw Error('Dated explicit surface review is required');
 const names=Object.keys(value.surfaces||{}).sort();if(JSON.stringify(names)!==JSON.stringify(Object.keys(SURFACE_NAMES).sort()))throw Error('Exactly three reviewed logo surfaces are required');
}
async function transparentPng(bytes,wanted,sharp,label,mark=false){
 if(!Buffer.isBuffer(bytes)||!validHash(wanted)||sha(bytes)!==wanted)throw Error(label+' PNG hash mismatch');
 if(!bytes.subarray(0,8).equals(PNG_SIGNATURE))throw Error(label+' must be actual PNG bytes');
 const metadata=await sharp(bytes).metadata();
 if(metadata.format!=='png'||!metadata.hasAlpha||(metadata.pages&&metadata.pages!==1))throw Error(label+' requires one PNG with real alpha');
 const decoded=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 if(decoded.info.channels!==4||(mark?Math.min(decoded.info.width,decoded.info.height)<12:decoded.info.width<160||decoded.info.height<45))throw Error(label+' does not meet the reviewed source-size boundary');
 let transparent=0,opaque=0;for(let i=3;i<decoded.data.length;i+=4){if(decoded.data[i]===0)transparent++;if(decoded.data[i]>=230)opaque++;}
 if(transparent<decoded.info.width*decoded.info.height*.25||opaque<80)throw Error(label+' has an opaque background or no substantive artwork');
 return {width:decoded.info.width,height:decoded.info.height,alphaSha256:sha(Buffer.from(decoded.data.filter((_,i)=>i%4===3)))};
}
async function reviewedRasterPack(master,reviewedSurfaces,sharp){
 assertSurfaceReview(reviewedSurfaces);
 const retainedAllowed=reviewedSurfaces.sourceMode==='retained-or-mixed-raster';
 if(reviewedSurfaces.sourceMode!==undefined&&!retainedAllowed)throw Error('Unknown reviewed raster source mode');
 const sourceNames=retainedAllowed?{master:'branding/reviewed-master.png',mark:'branding/reviewed-mark.png'}:{master:'branding/generated-master.png',mark:'branding/generated-mark.png'};
 const masterPng=Buffer.isBuffer(master.png)?Buffer.from(master.png):Buffer.from(master.png||'','base64');
 const nativeMaster=await transparentPng(masterPng,master.sha256,sharp,'Generated master');
 const suppliedMark=master.markPng!==undefined;
 if(suppliedMark!==Boolean(master.markSha256))throw Error('Generated mark bytes and hash must be supplied together');
 const inputs=[],assets=new Map(),surfaces={};
 for(const [name,tone]of Object.entries(SURFACE_NAMES)){
  const input=reviewedSurfaces.surfaces[name],png=Buffer.isBuffer(input?.png)?Buffer.from(input.png):null;
  const provenance=reviewedRasterProvenance(input,{retainedAllowed}),sourceReference=reviewSourceReference(input?.sourceReference);
  const metadata=await transparentPng(png,input?.sha256,sharp,'Reviewed '+name);
  const assetPath='branding/reviewed-surfaces/'+tone+'.png';
  inputs.push({name,png,assetPath,sha256:input.sha256,...provenance,sourceReference,...metadata});
  surfaces[name]={schemaVersion:1,assetPath,sha256:input.sha256,...provenance,sourceReference,...metadata};
  if(name!=='onAccent')assets.set('logo-'+tone+'.png',png);
  assets.set('logo-'+tone+'.webp',await sharp(png).webp({lossless:true,effort:6}).toBuffer());
 }
 const markPng=suppliedMark?(Buffer.isBuffer(master.markPng)?Buffer.from(master.markPng):Buffer.from(master.markPng,'base64')):inputs.find(row=>row.name==='onLight').png;
 if(suppliedMark)await transparentPng(markPng,master.markSha256,sharp,'Generated mark',true);
 for(const [name,tone]of Object.entries(SURFACE_NAMES).filter(([name])=>name!=='onAccent')){
  const artwork=suppliedMark?markPng:inputs.find(row=>row.name===name).png;
  // A full reviewed logo is an honest icon fallback. Contain it; never invent a crop or repaint its pixels.
  const tile=await sharp(artwork).resize(192,192,{fit:'contain',background:'#00000000'}).extend({top:32,bottom:32,left:32,right:32,background:'#00000000'}).png().toBuffer();
  assets.set('mark-'+tone+'.webp',await sharp(tile).webp({lossless:true,effort:6}).toBuffer());
 }
 const icon=await sharp(assets.get('mark-on-light.webp')).resize(512,512,{fit:'contain',background:'#00000000'}).png().toBuffer();
 assets.set('app-icon.png',icon);assets.set('apple-touch-icon.png',await sharp(icon).resize(180,180).png().toBuffer());
 assets.set('favicon.ico',iconFile(await Promise.all([16,32,48].map(async size=>({size,bytes:await sharp(icon).resize(size,size).png().toBuffer()})))));
 const reviewedAssets=[];
 for(const [name,input]of Object.entries(reviewedSurfaces.assets??{})){
  if(!retainedAllowed||!REVIEWED_ASSET_NAMES.has(name)||!Buffer.isBuffer(input?.bytes)||!validHash(input.sha256)||sha(input.bytes)!==input.sha256)throw Error('Invalid reviewed supplemental branding asset');
  const provenance=reviewedRasterProvenance(input,{retainedAllowed:true}),sourceReference=reviewSourceReference(input.sourceReference);
  if(name==='favicon.ico'){if(input.bytes.length<22||input.bytes.readUInt16LE(0)!==0||input.bytes.readUInt16LE(2)!==1||input.bytes.readUInt16LE(4)<1)throw Error('Reviewed favicon must contain ICO bytes');}
  else{const metadata=await sharp(input.bytes).metadata(),format=name.endsWith('.webp')?'webp':'png';if(metadata.format!==format||!metadata.hasAlpha||(metadata.pages&&metadata.pages!==1)||Math.min(metadata.width,metadata.height)<12)throw Error('Reviewed supplemental asset format or alpha changed');}
  const assetPath='branding/reviewed-assets/'+name;assets.set(name,Buffer.from(input.bytes));reviewedAssets.push({name,assetPath,sha256:input.sha256,...provenance,sourceReference,bytes:Buffer.from(input.bytes)});
 }
 const packInputs=[{role:'master',path:sourceNames.master,sha256:sha(masterPng)},{role:'mark',path:sourceNames.mark,sha256:sha(markPng)},...inputs.map(row=>({role:row.name,path:row.assetPath,sha256:row.sha256})),...reviewedAssets.map(row=>({role:'asset:'+row.name,path:row.assetPath,sha256:row.sha256}))];
 return {assets,masterPng,markPng,nativeMaster,packInputs,sourceNames,reviewedAssets,reviewedInputs:inputs,
  packId:sha(JSON.stringify(packInputs)).slice(0,16),reviewedSurfaceVariants:{schemaVersion:1,reviewed:true,reviewedAt:reviewedSurfaces.reviewedAt,...(retainedAllowed?{sourceMode:reviewedSurfaces.sourceMode}:{}),surfaces},
  markSource:suppliedMark?(retainedAllowed?'reviewed-mark-colors-preserved':'generated-mark-colors-preserved'):'full-reviewed-surface-logo-contained'};
}
const LEGACY_LOGO = /^\/(?:dealer-brand\/logo[^/]*\.(?:webp|png)|dealer-app\/logo[^/]*\.(?:webp|png)|branding\/logo-on-(?:light|dark|accent)\.(?:webp|png)|lead-logo(?:-inverse|-dark|-white)?\.png|brand\/daynight-wordmark\.svg)$/;
function toneFor(path){return /(?:on-dark|on-accent|logo-dark|inverse|white)/.test(path)?'on-dark':'on-light';}
export async function applyLeadBranding(files,manifest,{master,sharp,readTemplate,generation,reviewedSurfaces}){
 const retainedAllowed=reviewedSurfaces?.sourceMode==='retained-or-mixed-raster';
 if(!(files instanceof Map)||!master||manifest.packaging?.version!=='5'||(!retainedAllowed&&(generation?.tool!=='image_gen'||!generation.generationId)))throw Error('A sourced image-generation master and six-design manifest are required');
 if(retainedAllowed&&generation!==undefined)throw Error('Mixed raster inputs require role-specific provenance instead of one shared generation');
 if(files.has('.cars-branding.json'))throw Error('Branding contract already exists; review an explicit refresh instead of applying twice');
 const usesReviewedSurfaces=reviewedSurfaces!==undefined;
 const targetFiles=files;files=new Map(files);
 const original=new Map(files),facts=Object.fromEntries(['business-facts.json','stock.json','locale.json','auto-best/src/lib/data/dealer-profile.json'].filter(p=>files.has(p)).map(p=>[p,sha(files.get(p))]));
 const palette=preserveTemplatePalettes(files,manifest,readTemplate),pack=usesReviewedSurfaces?await reviewedRasterPack(master,reviewedSurfaces,sharp):await rasterPack(master,sharp),packId=pack.packId??sha(Buffer.concat([pack.masterPng,pack.markPng])).slice(0,16),publicBase='/dealer-brand/v2-'+packId;
 const derivedProfiles=new Set(Object.values(PROFILE_LOGO_CONSUMERS).filter(name=>original.has(name)&&JSON.parse(read(original,name)).logoContract!=null));
 const oldLogos=new Set();for(const [name,bytes]of original){if(!/\.(?:json|ts|tsx|js|svelte)$/.test(name)||!Object.keys(PUBLIC_ROOTS).some(k=>name.startsWith(k+'/')))continue;for(const match of Buffer.from(bytes).toString().matchAll(/(["'])(\/[^"'\r\n]+)\1/g))if(LEGACY_LOGO.test(match[2]))oldLogos.add(match[2]);}
 const publicPaths=[];
 for(const [key,root]of Object.entries(PUBLIC_ROOTS)){
  for(const [name,bytes]of pack.assets){const target=root+publicBase.slice(1)+'/'+name;files.set(target,bytes);publicPaths.push({key,path:target,sha256:sha(bytes)});}
  // Retain compatible aliases without depending on them for cache invalidation.
  for(const [name,bytes]of pack.assets)files.set(root+'dealer-brand/'+name,bytes);
  for(const old of oldLogos){if(!files.has(root+old.slice(1))||old.endsWith('.svg'))continue;const tone=toneFor(old),ext=old.endsWith('.png')?'png':'webp';files.set(root+old.slice(1),pack.assets.get('logo-'+tone+'.'+ext));}
  for(const name of [root+'favicon.ico',root+'apple-touch-icon.png',root+'dealer-brand/icon.png',root+'dealer-brand/icon-192.png',root+'dealer-brand/icon-512.png'])if(files.has(name))files.set(name,name.endsWith('.ico')?pack.assets.get('favicon.ico'):pack.assets.get('app-icon.png'));
 }
 for(const [name,bytes]of [...files]){if(!/\.(?:json|ts|tsx|js|svelte)$/.test(name)||!Object.keys(PUBLIC_ROOTS).some(k=>name.startsWith(k+'/'))||name.includes('/.template/')||name.includes('/.client/')||Object.hasOwn(facts,name)||derivedProfiles.has(name))continue;const text=Buffer.from(bytes).toString();let next=text;for(const old of oldLogos)next=next.replaceAll(JSON.stringify(old),JSON.stringify(publicBase+'/logo-'+toneFor(old)+'.webp')).replaceAll("'"+old+"'",JSON.stringify(publicBase+'/logo-'+toneFor(old)+'.webp'));if(next!==text)files.set(name,Buffer.from(next));}
 const surfaceBindingsVersion=files.has(MOBILE_LOGO_HEADER)?(applyLogoSurfaceBindings(files,publicBase),1):0;
 const appFile='app/lib/dealer.json';if(files.has(appFile)){const app=JSON.parse(read(files,appFile));app.logo={...app.logo,light:publicBase+'/logo-on-light.webp',dark:publicBase+'/logo-on-dark.webp',icon:publicBase+'/app-icon.png'};files.set(appFile,encode(app));}
 const modern='modern/packages/marketplace/lead-site.ts';let modernText=read(files,modern);modernText=modernText.replace(/(^\s*logoPath:\s*)["'][^"']+["']/m,(_,prefix)=>prefix+JSON.stringify(publicBase+'/logo-on-light.webp'));files.set(modern,Buffer.from(modernText));
 for(const name of ['branding/logo-on-light.png','branding/logo-on-dark.png','assets/app-icon.png','assets/favicon.ico']){const prior=original.get(name);if(prior)files.set('branding/retained-originals/'+sha(prior).slice(0,16)+'-'+name.split('/').pop(),prior);files.set(name,name.endsWith('.ico')?pack.assets.get('favicon.ico'):name.includes('app-icon')?pack.assets.get('app-icon.png'):pack.assets.get(name.split('/').pop()));}
 files.set(pack.sourceNames?.master??'branding/generated-master.png',pack.masterPng);files.set(pack.sourceNames?.mark??'branding/generated-mark.png',pack.markPng);for(const [name,bytes]of pack.assets)files.set('branding/'+name,bytes);
 for(const input of pack.reviewedInputs||[])files.set(input.assetPath,input.png);
 for(const input of pack.reviewedAssets||[])files.set(input.assetPath,input.bytes);
 const derivedProfileLogoBindings=rebindDerivedProfileLogoContracts(files,publicBase,{originalFiles:original});
 for(const row of derivedProfileLogoBindings)if(Object.hasOwn(facts,row.path))facts[row.path]=row.afterSha256;
 for(const [name,wanted]of Object.entries(facts))if(sha(files.get(name))!==wanted)throw Error('Branding changed dealer facts: '+name);
 const changes=[...files].filter(([name,bytes])=>!original.has(name)||!Buffer.from(original.get(name)).equals(Buffer.from(bytes))).map(([name,bytes])=>({path:name,before:original.has(name)?sha(original.get(name)):null,after:sha(bytes)}));
 const contract={schemaVersion:BRANDING_SCHEMA,surfaceBindingsVersion,dealer:manifest.slug,policy:'template-default',packId,publicBase,creationMethod:retainedAllowed?'reviewed-raster-surface-variants':usesReviewedSurfaces?'image-generation-reviewed-surface-variants':'image-generation-derived-raster',...(retainedAllowed?{}:{generation:{tool:generation.tool,id:generation.generationId,modelVersion:generation.modelVersion??null,sourceSha256:generation.sourceFileSha256}}),approval:'independent-proposal-not-dealer-approved',nativeMaster:pack.nativeMaster,consumerReferences:captureBrandConsumers(files,publicBase),...(usesReviewedSurfaces?{reviewedSurfaceVariants:pack.reviewedSurfaceVariants,packInputs:pack.packInputs,markSource:pack.markSource,...(pack.reviewedAssets?.length?{reviewedAssets:pack.reviewedAssets.map(({bytes,...proof})=>proof)}:{})}: {alphaSha256:pack.alphaSha256}),monochromePairFromOneMaster:!usesReviewedSurfaces,palette,assets:publicPaths,facts,changes,...(derivedProfileLogoBindings.length?{derivedProfileLogoBindings}:{}),hostedQa:false};
 files.set('.cars-branding.json',encode(contract));files.set('branding/brand-policy.json',encode({schemaVersion:1,palettePolicy:'template-default',heroOverride:false,bannerOverride:false,sectionOverride:false,dealerAccentForUi:false,logoSurfacePolicy:'explicit-light-dark',packId,source:pack.sourceNames?.master.split('/').at(-1)??'generated-master.png',approval:contract.approval}));assertLeadBranding(files,manifest);for(const [name,bytes]of files)targetFiles.set(name,bytes);return contract;
}
export function captureBrandConsumers(files,publicBase){
 const consumers=[],names=['logo-on-light.webp','logo-on-dark.webp','logo-on-accent.webp','app-icon.png'];
 for(const [name,bytes]of files){if(!Object.keys(PUBLIC_ROOTS).some(key=>name.startsWith(key+'/'))||!/[.](?:json|ts|tsx|js|svelte)$/.test(name)||name.includes('/public/')||name.includes('/static/')||name.includes('/.template/')||name.includes('/.client/'))continue;const text=Buffer.from(bytes).toString(),urls=names.map(suffix=>publicBase+'/'+suffix).filter(url=>text.includes(url));if(urls.length)consumers.push({path:name,urls});}
 return consumers.sort((a,b)=>a.path.localeCompare(b.path,'en'));
}

export function assertLeadBranding(files,manifest){
 const contract=JSON.parse(read(files,'.cars-branding.json')),retainedAllowed=contract.creationMethod==='reviewed-raster-surface-variants',reviewed=retainedAllowed||contract.creationMethod==='image-generation-reviewed-surface-variants';if(contract.schemaVersion!==BRANDING_SCHEMA||contract.dealer!==manifest.slug||contract.policy!=='template-default'||contract.monochromePairFromOneMaster!==!reviewed||!Array.isArray(contract.assets)||contract.assets.length!==Object.keys(PUBLIC_ROOTS).length*10)throw Error('Missing or invalid six-family branding contract');
 if(reviewed){
  const review=contract.reviewedSurfaceVariants;assertSurfaceReview(review);
  if(retainedAllowed&&review.sourceMode!=='retained-or-mixed-raster')throw Error('Reviewed retained raster mode changed');
  if(retainedAllowed&&contract.generation!==undefined)throw Error('Retained pack must not claim one shared generation');
  const expectedInputs=[{role:'master',path:retainedAllowed?'branding/reviewed-master.png':'branding/generated-master.png'},{role:'mark',path:retainedAllowed?'branding/reviewed-mark.png':'branding/generated-mark.png'},...Object.entries(SURFACE_NAMES).map(([role,tone])=>({role,path:'branding/reviewed-surfaces/'+tone+'.png'}))];
  const supplemental=contract.reviewedAssets??[];if(!Array.isArray(supplemental)||(!retainedAllowed&&supplemental.length)||new Set(supplemental.map(row=>row.name)).size!==supplemental.length)throw Error('Invalid supplemental branding proof');
  for(const row of supplemental){if(!REVIEWED_ASSET_NAMES.has(row.name)||row.assetPath!=='branding/reviewed-assets/'+row.name)throw Error('Unsafe supplemental branding proof');expectedInputs.push({role:'asset:'+row.name,path:row.assetPath});reviewedRasterProvenance({...row,generation:row.generation?{tool:row.generation.tool,generationId:row.generation.id,modelVersion:row.generation.modelVersion}:undefined},{retainedAllowed:true});reviewSourceReference(row.sourceReference);for(const root of Object.values(PUBLIC_ROOTS))if(sha(files.get(root+contract.publicBase.slice(1)+'/'+row.name)||Buffer.alloc(0))!==row.sha256)throw Error('Reviewed supplemental asset changed: '+row.name);}
  if(!Array.isArray(contract.packInputs)||contract.packInputs.length!==expectedInputs.length||contract.packId!==sha(JSON.stringify(contract.packInputs)).slice(0,16))throw Error('Reviewed surface content identity changed');
  for(const [index,expected]of expectedInputs.entries()){const row=contract.packInputs[index];if(row.role!==expected.role||row.path!==expected.path||!validHash(row.sha256)||!files.has(row.path)||sha(files.get(row.path))!==row.sha256)throw Error('Reviewed branding source missing or changed: '+expected.role);}
  for(const [name,tone]of Object.entries(SURFACE_NAMES)){const row=review.surfaces[name],input=contract.packInputs.find(row=>row.role===name);if(row.assetPath!=='branding/reviewed-surfaces/'+tone+'.png'||row.sha256!==input.sha256||!validHash(row.alphaSha256))throw Error('Reviewed surface proof changed: '+name);reviewSourceReference(row.sourceReference);reviewedRasterProvenance({...row,generation:row.generation?{tool:row.generation.tool,generationId:row.generation.id,modelVersion:row.generation.modelVersion}:undefined},{retainedAllowed});
   if(name!=='onAccent')for(const root of Object.values(PUBLIC_ROOTS))if(sha(files.get(root+contract.publicBase.slice(1)+'/logo-'+tone+'.png')||Buffer.alloc(0))!==row.sha256)throw Error('Reviewed surface RGB source changed: '+name);
  }
  if(!(retainedAllowed?['reviewed-mark-colors-preserved','full-reviewed-surface-logo-contained']:['generated-mark-colors-preserved','full-reviewed-surface-logo-contained']).includes(contract.markSource))throw Error('Missing reviewed mark derivation');
 }
 if(contract.publicBase!=='/dealer-brand/v2-'+contract.packId||!Array.isArray(contract.consumerReferences)||!contract.consumerReferences.length)throw Error('Unversioned or unbound logo consumers');
 const assetNames=['logo-on-light.png','logo-on-light.webp','mark-on-light.webp','logo-on-dark.png','logo-on-dark.webp','mark-on-dark.webp','logo-on-accent.webp','app-icon.png','apple-touch-icon.png','favicon.ico'];const expected=new Set(Object.entries(PUBLIC_ROOTS).flatMap(([key,prefix])=>assetNames.map(name=>key+':'+prefix+contract.publicBase.slice(1)+'/'+name)));const actual=new Set(contract.assets.map(row=>row.key+':'+row.path));if(actual.size!==expected.size||[...expected].some(key=>!actual.has(key)))throw Error('Incomplete or duplicated family logo assets');
 for(const consumer of contract.consumerReferences){if(!Object.keys(PUBLIC_ROOTS).some(key=>consumer.path.startsWith(key+'/'))||consumer.path.split('/').includes('..'))throw Error('Unsafe logo consumer');const content=read(files,consumer.path);for(const url of consumer.urls)if(!url.startsWith(contract.publicBase+'/')||!content.includes(url))throw Error('Logo consumer reverted or changed: '+consumer.path);}
 if(manifest.branding?.surfaceBindingsVersion===1&&contract.surfaceBindingsVersion!==1)throw Error('Missing mandatory logo surface proof');if(contract.surfaceBindingsVersion===1)assertLogoSurfaceBindings(files,contract.publicBase);
 const app=JSON.parse(read(files,'app/lib/dealer.json'));for(const [key,name]of [['light','logo-on-light.webp'],['dark','logo-on-dark.webp'],['icon','app-icon.png']]){const value=app.logo?.[key],expected=contract.publicBase+'/'+name,base=manifest.variants?.find(row=>row.key==='app')?.base;if(value!==expected&&(!base||value!==base+expected))throw Error('App logo surface contract changed: '+key);}
 for(const check of contract.palette.checks){const key=check.path.split('/')[0];if(check.sourceRevision!==manifest.templateSources?.[key]?.revision)throw Error('Palette proof belongs to an older template pin: '+key);}

 for(const row of contract.assets)if(!files.has(row.path)||sha(files.get(row.path))!==row.sha256)throw Error('Branding asset missing or changed: '+row.path);
 for(const check of contract.palette.checks){const text=read(files,check.path);if(check.field){const rule=PALETTES.find(r=>r.key===check.path.split('/')[0]);if(scalar(text,check.field,rule.start).value!==check.value)throw Error('Template palette override after branding: '+check.path);}else if(sha(JSON.stringify(cssColors(text)))!==check.colorSequenceSha256)throw Error('Template CSS colours changed after branding: '+check.path);}
 assertDerivedProfileLogoContracts(files,contract.publicBase);
 for(const row of contract.derivedProfileLogoBindings||[])if(!Object.values(PROFILE_LOGO_CONSUMERS).includes(row.path)||row.factualFieldsUnchanged!==true||!files.has(row.path)||sha(files.get(row.path))!==row.afterSha256)throw Error('Derived profile branding proof changed: '+row.path);
 for(const [name,wanted]of Object.entries(contract.facts))if(sha(files.get(name))!==wanted)throw Error('Factual source changed since branding: '+name);return contract;
}



