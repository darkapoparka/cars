/** Dealer branding is content. Template palettes are not inferred from that content. */
import {createHash} from 'node:crypto';
export const BRANDING_SCHEMA = 1;
export const PUBLIC_ROOTS = Object.freeze({'auto-best':'auto-best/static/',modern:'modern/apps/web/public/',import:'import/static/',app:'app/public/',mobile:'mobile/public/','karento-best':'karento-best/static/'});
const sha = b => createHash('sha256').update(b).digest('hex');
const encode = v => Buffer.from(JSON.stringify(v,null,2)+'\n');
const read = (files,name) => {if(!files.has(name))throw Error('Missing branding input: '+name);return Buffer.from(files.get(name)).toString('utf8');};
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
const LEGACY_LOGO = /^\/(?:dealer-brand\/logo[^/]*\.(?:webp|png)|dealer-app\/logo[^/]*\.(?:webp|png)|branding\/logo-on-(?:light|dark|accent)\.(?:webp|png)|lead-logo(?:-inverse|-dark|-white)?\.png|brand\/daynight-wordmark\.svg)$/;
function toneFor(path){return /(?:on-dark|on-accent|logo-dark|inverse|white)/.test(path)?'on-dark':'on-light';}
export async function applyLeadBranding(files,manifest,{master,sharp,readTemplate,generation}){
 if(!(files instanceof Map)||!master||generation.tool!=='image_gen'||!generation.generationId||manifest.packaging?.version!=='5')throw Error('A sourced image-generation master and six-design manifest are required');
 if(files.has('.cars-branding.json'))throw Error('Branding contract already exists; review an explicit refresh instead of applying twice');
 const original=new Map(files),facts=Object.fromEntries(['business-facts.json','stock.json','locale.json','auto-best/src/lib/data/dealer-profile.json'].filter(p=>files.has(p)).map(p=>[p,sha(files.get(p))]));
 const palette=preserveTemplatePalettes(files,manifest,readTemplate),pack=await rasterPack(master,sharp),packId=sha(Buffer.concat([pack.masterPng,pack.markPng])).slice(0,16),publicBase='/dealer-brand/v2-'+packId;
 const oldLogos=new Set();for(const [name,bytes]of original){if(!/\.(?:json|ts|tsx|js|svelte)$/.test(name)||!Object.keys(PUBLIC_ROOTS).some(k=>name.startsWith(k+'/')))continue;for(const match of Buffer.from(bytes).toString().matchAll(/(["'])(\/[^"'\r\n]+)\1/g))if(LEGACY_LOGO.test(match[2]))oldLogos.add(match[2]);}
 const publicPaths=[];
 for(const [key,root]of Object.entries(PUBLIC_ROOTS)){
  for(const [name,bytes]of pack.assets){const target=root+publicBase.slice(1)+'/'+name;files.set(target,bytes);publicPaths.push({key,path:target,sha256:sha(bytes)});}
  // Retain compatible aliases without depending on them for cache invalidation.
  for(const [name,bytes]of pack.assets)files.set(root+'dealer-brand/'+name,bytes);
  for(const old of oldLogos){if(!files.has(root+old.slice(1))||old.endsWith('.svg'))continue;const tone=toneFor(old),ext=old.endsWith('.png')?'png':'webp';files.set(root+old.slice(1),pack.assets.get('logo-'+tone+'.'+ext));}
  for(const name of [root+'favicon.ico',root+'apple-touch-icon.png',root+'dealer-brand/icon.png',root+'dealer-brand/icon-192.png',root+'dealer-brand/icon-512.png'])if(files.has(name))files.set(name,name.endsWith('.ico')?pack.assets.get('favicon.ico'):pack.assets.get('app-icon.png'));
 }
 for(const [name,bytes]of [...files]){if(!/\.(?:json|ts|tsx|js|svelte)$/.test(name)||!Object.keys(PUBLIC_ROOTS).some(k=>name.startsWith(k+'/'))||name.includes('/.template/')||name.includes('/.client/'))continue;const text=Buffer.from(bytes).toString();let next=text;for(const old of oldLogos)next=next.replaceAll(JSON.stringify(old),JSON.stringify(publicBase+'/logo-'+toneFor(old)+'.webp')).replaceAll("'"+old+"'",JSON.stringify(publicBase+'/logo-'+toneFor(old)+'.webp'));if(next!==text)files.set(name,Buffer.from(next));}
 const appFile='app/lib/dealer.json';if(files.has(appFile)){const app=JSON.parse(read(files,appFile));app.logo={...app.logo,light:publicBase+'/logo-on-light.webp',dark:publicBase+'/logo-on-dark.webp',icon:publicBase+'/app-icon.png'};files.set(appFile,encode(app));}
 const modern='modern/packages/marketplace/lead-site.ts';let modernText=read(files,modern);modernText=modernText.replace(/(^\s*logoPath:\s*)["'][^"']+["']/m,(_,prefix)=>prefix+JSON.stringify(publicBase+'/logo-on-light.webp'));files.set(modern,Buffer.from(modernText));
 for(const name of ['branding/logo-on-light.png','branding/logo-on-dark.png','assets/app-icon.png','assets/favicon.ico']){const prior=original.get(name);if(prior)files.set('branding/retained-originals/'+sha(prior).slice(0,16)+'-'+name.split('/').pop(),prior);files.set(name,name.endsWith('.ico')?pack.assets.get('favicon.ico'):name.includes('app-icon')?pack.assets.get('app-icon.png'):pack.assets.get(name.split('/').pop()));}
 files.set('branding/generated-master.png',pack.masterPng);files.set('branding/generated-mark.png',pack.markPng);for(const [name,bytes]of pack.assets)files.set('branding/'+name,bytes);
 for(const [name,wanted]of Object.entries(facts))if(sha(files.get(name))!==wanted)throw Error('Branding changed dealer facts: '+name);
 const changes=[...files].filter(([name,bytes])=>!original.has(name)||!Buffer.from(original.get(name)).equals(Buffer.from(bytes))).map(([name,bytes])=>({path:name,before:original.has(name)?sha(original.get(name)):null,after:sha(bytes)}));
 const contract={schemaVersion:BRANDING_SCHEMA,dealer:manifest.slug,policy:'template-default',packId,publicBase,creationMethod:'image-generation-derived-raster',generation:{tool:generation.tool,id:generation.generationId,modelVersion:generation.modelVersion??null,sourceSha256:generation.sourceFileSha256},approval:'independent-proposal-not-dealer-approved',nativeMaster:pack.nativeMaster,alphaSha256:pack.alphaSha256,monochromePairFromOneMaster:true,palette,assets:publicPaths,facts,changes,hostedQa:false};
 files.set('.cars-branding.json',encode(contract));files.set('branding/brand-policy.json',encode({schemaVersion:1,palettePolicy:'template-default',heroOverride:false,bannerOverride:false,sectionOverride:false,dealerAccentForUi:false,logoSurfacePolicy:'explicit-light-dark',packId,source:'generated-master.png',approval:contract.approval}));return contract;
}
export function assertLeadBranding(files,manifest){
 const contract=JSON.parse(read(files,'.cars-branding.json'));if(contract.schemaVersion!==BRANDING_SCHEMA||contract.dealer!==manifest.slug||contract.policy!=='template-default'||contract.monochromePairFromOneMaster!==true||!Array.isArray(contract.assets)||contract.assets.length!==Object.keys(PUBLIC_ROOTS).length*10)throw Error('Missing or invalid six-family branding contract');
 for(const row of contract.assets)if(!files.has(row.path)||sha(files.get(row.path))!==row.sha256)throw Error('Branding asset missing or changed: '+row.path);
 for(const check of contract.palette.checks){const text=read(files,check.path);if(check.field){const rule=PALETTES.find(r=>r.key===check.path.split('/')[0]);if(scalar(text,check.field,rule.start).value!==check.value)throw Error('Template palette override after branding: '+check.path);}else if(sha(JSON.stringify(cssColors(text)))!==check.colorSequenceSha256)throw Error('Template CSS colours changed after branding: '+check.path);}
 for(const [name,wanted]of Object.entries(contract.facts))if(sha(files.get(name))!==wanted)throw Error('Factual source changed since branding: '+name);return contract;
}
