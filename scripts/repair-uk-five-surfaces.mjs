import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
import {collectSource} from './package-dealer.mjs';import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';import {applyDealerLogoContract} from './lib/client-logo-contract.mjs';
import {sealNativeAdoption,assertNativeAdoption} from './lib/native-localization.mjs';import {baseNativeManifest,assertAppVariant} from './publishing/app-variant.mjs';import {sealAppDealerSource} from './lib/app-dealer-adapter.mjs';import {sealExtendedVariant} from './lib/client-refresh-six.mjs';
export const UK_FIVE=['batley-as-motor-group','stockport-broadbent-car-and-servicing','motherwell-motors-castle','birmingham-trade-car-sales-grasmere','birmingham-square-one-motors'];
const ROOT=path.resolve(fileURLToPath(new URL('..',import.meta.url))),hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p,'utf8')),write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof v==='string'||Buffer.isBuffer(v)?v:JSON.stringify(v,null,2)+'\n');};
const assert=(ok,message)=>{if(!ok)throw Error(message);};
export function repairModernPublicSchema(source){
 const old='(value) => new URL(value).protocol === "https:"';
 assert(source.includes(old),'Review the actual HTTPS schema before adapting it');
 source=source.replace(old,'(value) => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password; } catch { return false; } }');
 const phone='phoneDisplay: z.string().trim().min(1).max(40),\n      phoneHref,\n      contactUrl: z.union([phoneHref, httpsUrl]),';
 assert(source.includes(phone),'Review the actual public contact schema before adapting it');
 source=source.replace(phone,'phoneDisplay: z.string().trim().max(40),\n      phoneHref: z.union([phoneHref, z.literal("")]),\n      contactUrl: z.union([phoneHref, httpsUrl]),');
 const guard='  .superRefine((site, context) => {';assert(source.includes(guard),'Public config validation boundary changed');
 source=source.replace(guard,guard+'\n    if (Boolean(site.contact.phoneDisplay) !== Boolean(site.contact.phoneHref)) { context.addIssue({code: "custom", path: ["contact", "phoneHref"], message: "Published phone label and destination must be provided together"}); }');
 return source;
}
export function replaceConfigString(source,key,value){
 const pattern=new RegExp('(^[ \\t]*'+key+':\\s*)(?:"(?:[^"\\\\]|\\\\.)*"|\'(?:[^\'\\\\]|\\\\.)*\')','gm');
 const matches=[...source.matchAll(pattern)];assert(matches.length===1,'Expected one configuration value: '+key);
 return source.replace(pattern,(_m,prefix)=>prefix+JSON.stringify(value));
}
export async function prepareTransparentMarks(sharp,input){
 const {data,info}=await sharp(input).removeAlpha().raw().toBuffer({resolveWithObject:true});
 assert(info.channels===3&&info.width>=512,'Expected the retained raster dealer lockup');
 const mask=Buffer.alloc(info.width*info.height),black=Buffer.alloc(info.width*info.height*4),white=Buffer.alloc(black.length);let minX=info.width,minY=info.height,maxX=-1,maxY=-1,foreground=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=y*info.width+x,min=Math.min(data[i*3],data[i*3+1],data[i*3+2]);const a=min>=250?0:Math.min(255,Math.round((250-min)*255/40));mask[i]=a;if(a>16){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);foreground++;}black.set([24,24,27,a],i*4);white.set([255,255,255,a],i*4);}
 assert(foreground>1000&&foreground<mask.length*0.8,'Unexpected raster background; do not guess its separation');
 const pad=8,left=Math.max(0,minX-pad),top=Math.max(0,minY-pad),width=Math.min(info.width-left,maxX-minX+1+pad*2),height=Math.min(info.height-top,maxY-minY+1+pad*2);
 const encode=buffer=>sharp(buffer,{raw:{width:info.width,height:info.height,channels:4}}).extract({left,top,width,height}).webp({lossless:true}).toBuffer();
 return {onLight:await encode(black),onDark:await encode(white),width,height,sourceSha256:hash(input),foregroundPixels:foreground,method:'Exact retained emblem and lettering; deterministic white-background alpha separation and monochrome raster encoding. No new generative model call succeeded or is claimed.'};
}
async function repair(slug){
 assert(UK_FIVE.includes(slug),'Dealer outside the requested five');
 const client=path.join(ROOT,'clients',slug),manifest=read(client+'/dealer.json'),facts=read(client+'/business-facts.json');
 assert(manifest.localization.dealerCountry==='GB'&&manifest.localization.inventoryCurrency==='GBP'&&manifest.variants.length===6,'UK six-design identity required');
 const protectedNames=['business-facts.json','stock.json','locale-config.json'],protectedHashes=Object.fromEntries(protectedNames.map(n=>[n,hash(fs.readFileSync(client+'/'+n))]));
 const existing=read(client+'/branding/logo-contract.json'),original=fs.readFileSync(client+existing.assets.onLight.publicPath);
 const require=createRequire(path.join(ROOT,'runtime/uk-surface-tools/package.json')),sharp=require('sharp');assert(sharp.versions.sharp==='0.35.5','Use the existing reviewed image encoding tool version');
 const logos=await prepareTransparentMarks(sharp,original),paths={onLight:'/dealer-brand/logo-on-light-20261011.webp',onDark:'/dealer-brand/logo-on-dark-20261011.webp',onAccent:'/dealer-brand/logo-on-accent-20261011.webp'};
 for(const [surface,p] of Object.entries(paths))write(client+p,surface==='onLight'?logos.onLight:logos.onDark);
 const contract={...existing,assets:Object.fromEntries(Object.entries(paths).map(([surface,publicPath])=>[surface,{publicPath,sha256:hash(fs.readFileSync(client+publicPath)),width:logos.width,height:logos.height,background:'transparent',foreground:surface==='onLight'?'dark':'white'}])),surfacePreparation:{...logos,onLight:undefined,onDark:undefined,preparedAt:new Date().toISOString()},rules:'Use exact dark mark on light surfaces; exact white mark on dark and neutral accent surfaces. Never use CSS inversion, white plates or crop the emblem.'};write(client+'/branding/logo-contract.json',contract);
 const profile=loadDealerProfile(client,slug),changed=[];
 for(const key of ['auto-best','modern','import'])changed.push(...applyDealerLogoContract({key,oldVariant:client+'/'+key,candidate:client+'/'+key,profile}).map(n=>key+'/'+n));
 const modern=client+'/modern/packages/marketplace/lead-site.ts';let config=fs.readFileSync(modern,'utf8');
 for(const [key,value] of Object.entries({accent:'#18181B',desktopAccent:'#4b5057',address:facts.address||facts.city,country:'United Kingdom',tagline:facts.tagline||('Explore used cars in '+facts.city+'.'),phoneDisplay:facts.phoneDisplay||'',phoneHref:facts.phoneHref||'',contactUrl:facts.phoneHref||manifest.shareIdentity.publicOrigin+'/variant-2/en/contact',email:facts.email||'',logoPath:paths.onLight}))config=replaceConfigString(config,key,value);
 if(config.includes('logoInversePath:'))config=replaceConfigString(config,'logoInversePath',paths.onDark);else config=config.replace('  logoPath:', '  logoInversePath: '+JSON.stringify(paths.onDark)+',\n  logoPath:');
 config=config.replace('"AED" | "BGN" | "EUR" | "USD"','"AED" | "BGN" | "EUR" | "GBP" | "USD"');write(modern,config);
 const domain=client+'/modern/packages/marketplace-domain/site-config.ts';write(domain,repairModernPublicSchema(fs.readFileSync(domain,'utf8')));
 const publicRoots={mobile:'mobile/public',app:'app/public','karento-best':'karento-best/static'};
 for(const prefix of Object.values(publicRoots))for(const p of Object.values(paths))write(client+'/'+prefix+p,fs.readFileSync(client+p));
 const mobile=client+'/mobile/src/lib/showroom-config.ts';let mobileSource=fs.readFileSync(mobile,'utf8');assert(mobileSource.includes('/dealer-brand/logo.webp'),'Expected original Mobile logo binding');write(mobile,mobileSource.replace(/(?:\/variant-5)?\/dealer-brand\/logo\.webp/g,'/variant-5'+paths.onLight));
 const sig=client+'/karento-best/src/lib/content.ts';let signature=fs.readFileSync(sig,'utf8');for(const [key,p]of [['light',paths.onLight],['footer',paths.onDark],['archivedDark',paths.onDark]]){const re=new RegExp('("'+key+'":\\s*)"(?:/variant-6)?/dealer-brand/logo\\.webp"');assert(re.test(signature),'Signature logo boundary changed '+key);signature=signature.replace(re,(_m,start)=>start+JSON.stringify('/variant-6'+p));}write(sig,signature);
 const app=read(client+'/app/lib/dealer.json');app.logo.light=paths.onLight;app.logo.dark=paths.onDark;write(client+'/app/lib/dealer.json',app);
 const appReceipt=read(client+'/.cars-app.json');appReceipt.provenance.assets=appReceipt.provenance.assets.filter(a=>!['logo-light','logo-dark'].includes(a.role));for(const [role,p] of [['logo-light',paths.onLight],['logo-dark',paths.onDark]])appReceipt.provenance.assets.push({source:'auto-best/static'+p,output:'public'+p,sha256:hash(fs.readFileSync(client+p)),role});appReceipt.provenance.logoPolicy=contract.rules;
 const currentProfile=loadDealerProfile(client,slug),files=await collectSource(client,manifest),before=new Map(files);
 sealNativeAdoption(files,baseNativeManifest(manifest),read(ROOT+'/templates.lock.json').templates);assertNativeAdoption(files,baseNativeManifest(manifest));
 sealAppDealerSource({files,manifest,provenance:appReceipt.provenance});assertAppVariant(files,manifest);
 for(const [key,file] of [['mobile','.cars-mobile.json'],['karento-best','.cars-signature.json']]){const previous=read(client+'/'+file),adaptation={...previous.personalization,profileSha256:undefined,logoPaths:Object.values(paths),nativeFacts:previous.personalization.nativeDealerFacts};sealExtendedVariant({files,key,manifest,profile:currentProfile,adaptation});}
 for(const [name,bytes]of files)if(!before.get(name)?.equals(bytes))write(client+'/'+name,bytes);
 for(const n of protectedNames)assert(hash(fs.readFileSync(client+'/'+n))===protectedHashes[n],'Factual inputs changed '+n);
 const repairReceipt={schemaVersion:1,type:'uk-five-surface-contact-repair',dealer:slug,at:new Date().toISOString(),originalLogoSha256:logos.sourceSha256,logoAssets:contract.assets,protectedInputsPreserved:protectedHashes,modernNeutralHeroAccent:'#18181B',modernNeutralDesktopAccent:'#4b5057',optionalPhoneSupported:true,unknownPhonesInvented:false,country:'GB',currency:'GBP',allSixSourceSealsRefreshed:true,hostedVerified:false};write(client+'/.client/surface-repair-20261011.json',repairReceipt);console.log(JSON.stringify({dealer:slug,repaired:true,protectedInputsPreserved:true,logoWidth:logos.width,logoHeight:logos.height}));
}

export function repairUkDealerLabelFallback(source){
 const before="const value = compact ? labels[\x60\x24{field}Short\x60] ?? labels[field] : labels[field];";
 const after="const value = (compact ? labels[\x60\x24{field}Short\x60] ?? labels[field] : labels[field]) ?? (field.endsWith('Short') ? labels[field.slice(0, -5)] : undefined);";
 assert(source.split(before).length===2,'Reviewed native dealer label boundary changed');
 return source.replace(before,after);
}
async function repairContactOnly(slug){
 assert(UK_FIVE.includes(slug),'Dealer outside five-source repair');
 const client=path.join(ROOT,'clients',slug),manifest=read(client+'/dealer.json');
 const factual=hash(fs.readFileSync(client+'/business-facts.json')),stock=hash(fs.readFileSync(client+'/stock.json'));
 const labels=client+'/auto-best/src/lib/locale/messages.ts';write(labels,repairUkDealerLabelFallback(fs.readFileSync(labels,'utf8')));
 const about=client+'/auto-best/src/lib/components/company/AboutProcess.svelte';let text=fs.readFileSync(about,'utf8');
 for(const key of ['title','description','cta']){const before='i18n.text(service.'+key+')';assert(text.split(before).length===2,'Expected the precise dealer-owned service text consumer');text=text.replace(before,'service.'+key);}
 write(about,text);
 const files=await collectSource(client,manifest),before=new Map(files);
 sealNativeAdoption(files,baseNativeManifest(manifest),read(ROOT+'/templates.lock.json').templates);assertNativeAdoption(files,baseNativeManifest(manifest));
 for(const [name,bytes]of files)if(!before.get(name)?.equals(bytes))write(client+'/'+name,bytes);
 assert(factual===hash(fs.readFileSync(client+'/business-facts.json'))&&stock===hash(fs.readFileSync(client+'/stock.json')),'Factual stock or identity changed');
 write(client+'/.client/contact-repair-20261011.json',{schemaVersion:1,dealer:slug,at:new Date().toISOString(),missingShortAddressUsesVerifiedFullAddress:true,unknownDealerFieldsStillThrow:true,aboutServiceTextUsesDealerDataDirectly:true,strictTemplateCopyValidationUnchanged:true,factsSha256:factual,stockSha256:stock,hostedVerified:false});
 console.log(JSON.stringify({dealer:slug,contactAndAboutRepaired:true,factsPreserved:true}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))(process.argv.includes('--contact-only')?repairContactOnly(process.argv[2]):repair(process.argv[2])).catch(error=>{console.error(error.stack);process.exitCode=1;});

