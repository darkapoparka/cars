import {createHash} from 'node:crypto';

// Source-level surface selection. It never recolours template backgrounds or changes layout.
export const MODERN_LOGO_CONFIG='modern/packages/marketplace/lead-site.ts';
export const MOBILE_LOGO_HEADER='mobile/src/components/Header.tsx';
const MOBILE_LOGO_CONFIG='mobile/src/lib/showroom-config.ts';
const publicRoots={modern:'modern/apps/web/public',mobile:'mobile/public'};
const get=(files,p)=>{if(!files.has(p))throw Error('Missing logo consumer '+p);return Buffer.from(files.get(p)).toString('utf8');};
function once(text,from,to,label){if(text.split(from).length!==2)throw Error('Changed logo surface boundary '+label);return text.replace(from,to);}
// Only the reviewed literal leadSite object is a supported logo boundary.
// Mask values/comments, then fail closed on alternate declarations that could
// overwrite an earlier primary/inverse property. No dealer code is evaluated.
function unsupportedModernLogoDeclarations(text){
 const configs=[...text.matchAll(/^export const leadSite(?:[ \t]*:[ \t]*LeadSiteConfig)?[ \t]*=[ \t]*\{\r?\n([\s\S]*?)^\};/gm)];
 if(configs.length!==1)return true;
 const body=configs[0][1].replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\x60(?:\\.|[^\x60\\])*\x60|\/\*[\s\S]*?\*\/|\/\/[^\n]*/g,token=>token.startsWith('/')?token.replace(/[^\r\n]/g,' '):'""');
 let depth=0,declaration=true;
 for(let at=0;at<body.length;at++){
  const char=body[at];
  if(depth===0){
   if(/[ \t\r]/.test(char))continue;
   if(char==='\n'||char===',')declaration=true;
   else{
    if(declaration&&(char==='['||body.startsWith('...',at)||/^""[ \t\r\n]*:/.test(body.slice(at))))return true;
    declaration=false;
   }
  }
  if('{[('.includes(char))depth++;
  if('}])'.includes(char)&&--depth<0)return true;
 }
 return depth!==0;
}
function publicRaster(value){
 return typeof value==='string'&&/^\/[a-zA-Z0-9._/%+-]+\.(?:png|webp)$/.test(value)&&
  !value.startsWith('//')&&!value.slice(1).split('/').some(part=>!part||part==='.'||part==='..'||/%(?:2e|2f|5c)/i.test(part));
}
function surfaces(value){
 if(typeof value==='string'){
  if(!/^\/dealer-brand\/v2-[a-f0-9]{16}$/.test(value))throw Error('Versioned surface pack required');
  return {onLight:value+'/logo-on-light.webp',onDark:value+'/logo-on-dark.webp',retained:false};
 }
 if(!value||Object.keys(value).sort().join(',')!=='onDark,onLight'||!publicRaster(value.onLight)||!publicRaster(value.onDark))throw Error('Exact retained light/dark raster tuple required');
 return {...value,retained:true};
}
function familiesFor({families=['modern','mobile']}={}){
 if(!Array.isArray(families)||!families.length||new Set(families).size!==families.length||families.some(key=>!Object.hasOwn(publicRoots,key)))throw Error('Unsupported logo surface family selection');
 return families;
}
function assertRetainedMobile(files,pair){
 const mobile=get(files,MOBILE_LOGO_HEADER),pictures=[...mobile.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/g)].filter(match=>match[0].includes('src={showroom.logo}'));
 if(pictures.length!==1||mobile.includes('brightness(0) invert(1)')||!mobile.includes("filter: 'none'"))throw Error('Mobile hero must select the committed raster without inversion');
 const picture=pictures[0][0],source=picture.match(/\{overHeroDesktop\s*&&\s*!generatedDesktopLogo\s*&&\s*(?:\(\s*)?<source\s+media="\(min-width: 1024px\)"\s+srcSet=("(?:\\.|[^"\\])*")\s*\/>\s*(?:\)\s*)?\}/);
 if(!source||source[1]!==JSON.stringify(pair.onDark)||(picture.match(/<source\b/g)??[]).length!==1)throw Error('Mobile dark hero has no retained dark raster logo');
 const config=get(files,MOBILE_LOGO_CONFIG),logos=[...config.matchAll(/^[ \t]*(?:logo|"logo"|'logo')[ \t]*:[ \t]*(["'])([^"'\r\n]+)\1[ \t]*,?[ \t]*$/gm)];
 if(logos.length!==1||logos[0][2]!==pair.onLight)throw Error('Mobile light header has no retained light raster logo');
}
export function applyLogoSurfaceBindings(files,value,options){
 const pair=surfaces(value),families=familiesFor(options),draft=new Map(files),changes=[];
 if(families.includes('modern')){
  let modern=get(draft,MODERN_LOGO_CONFIG);const wanted=JSON.stringify(pair.onDark);
  const primary=modern.match(/^[ \t]*logoPath[ \t]*:/gm)??[],inverse=modern.match(/^[ \t]*logoInversePath[ \t]*:/gm)??[];
  const anchors=[...modern.matchAll(/^([ \t]*)logoPath[ \t]*:[ \t]*(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'),[ \t]*$/gm)];
  if(unsupportedModernLogoDeclarations(modern)||primary.length!==1||anchors.length!==1||inverse.length>1)throw Error('Changed logo surface boundary Modern inverse logo');
  if(inverse.length){
   const assigned=modern.match(/^([ \t]*logoInversePath[ \t]*:[ \t]*)("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')([ \t]*,?[ \t]*)$/m);
   if(!assigned)throw Error('Changed logo surface boundary Modern inverse logo');
   modern=once(modern,assigned[0],assigned[1]+wanted+assigned[3],'Modern inverse logo');
  }
  else if(modern.includes('  logoOnLight:')){modern=once(modern,'  logoOnLight:', '  logoInversePath: '+wanted+',\n  logoOnLight:','Modern inverse logo');}
  else{modern=once(modern,anchors[0][0],anchors[0][0]+'\n'+anchors[0][1]+'logoInversePath: '+wanted+',','Modern inverse logo');}
  if(pair.retained)modern=modern.replace(/^([ \t]*logoPath[ \t]*:[ \t]*)(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/m,(_,lead)=>lead+JSON.stringify(pair.onLight));
  draft.set(MODERN_LOGO_CONFIG,Buffer.from(modern));changes.push(MODERN_LOGO_CONFIG);
 }
 if(families.includes('mobile')){
  let mobile=get(draft,MOBILE_LOGO_HEADER);const newline=mobile.includes('\r\n')?'\r\n':'\n';
  if(pair.retained&&mobile.includes('<picture')&&!options?.reviewedPinnedTemplateReplacement)assertRetainedMobile(draft,pair);
  else if(mobile.includes('data-dealer-logo-surfaces')){
   const pictures=[...mobile.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/g)].filter(match=>match[0].includes('src={showroom.logo}'));
   if(pictures.length!==1||mobile.includes('brightness(0) invert(1)'))throw Error('Changed Mobile raster picture boundary');
   const picture=pictures[0][0],sources=[...picture.matchAll(/<source\b/g)];
   const selector=/srcSet=(?:"(?:\\.|[^"\\])*"|\{showroom\.logo\.replace\([^\r\n]*?\)\})/g,selected=[...picture.matchAll(selector)];
   if(sources.length!==1||selected.length!==1||!picture.includes('{overHeroDesktop && !generatedDesktopLogo && <source media="(min-width: 1024px)"'))throw Error('Changed Mobile raster selection boundary');
   const source=pair.retained?JSON.stringify(pair.onDark):'{showroom.logo.replace(/\\/logo-on-light\\.webp$/, "/logo-on-dark.webp")}';
   mobile=once(mobile,picture,picture.replace(selector,'srcSet='+source),'Mobile current raster surface');
  }
  else if(!mobile.includes('data-dealer-logo-surfaces')){
   mobile=once(mobile,"filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },","filter: 'none',",'Mobile unfiltered raster');
   mobile=mobile.replace('// Fallback for personalized artwork without its own light presentation.','// Select committed surface artwork; never manufacture a white logo with CSS.');
   const start=mobile.indexOf('              <Image'+newline+'                src={showroom.logo}');if(start<0)throw Error('Mobile native image boundary missing');const end=mobile.indexOf('              />',start);if(end<0)throw Error('Mobile native image end missing');
   const image=mobile.slice(start,end+'              />'.length);
   const source=pair.retained?JSON.stringify(pair.onDark):'{showroom.logo.replace(/\\/logo-on-light\\.webp$/, "/logo-on-dark.webp")}';
   mobile=mobile.slice(0,start)+'              <picture data-dealer-logo-surfaces style={{display: "contents"}}>'+newline+'                {overHeroDesktop && !generatedDesktopLogo && <source media="(min-width: 1024px)" srcSet='+source+' />}'+newline+image+newline+'              </picture>'+mobile.slice(end+'              />'.length);
  }
  if(pair.retained&&options?.reviewedPinnedTemplateReplacement){
   let config=get(draft,MOBILE_LOGO_CONFIG);const logos=[...config.matchAll(/^[ \t]*(?:logo|"logo"|'logo')[ \t]*:[ \t]*(["'])([^"'\r\n]+)\1[ \t]*,?[ \t]*$/gm)];
   if(logos.length!==1)throw Error('Changed Mobile primary raster boundary');
   config=once(config,logos[0][0],logos[0][0].replace(logos[0][1]+logos[0][2]+logos[0][1],JSON.stringify(pair.onLight)),'Mobile current light raster');
   draft.set(MOBILE_LOGO_CONFIG,Buffer.from(config));changes.push(MOBILE_LOGO_CONFIG);
  }
  draft.set(MOBILE_LOGO_HEADER,Buffer.from(mobile));changes.push(MOBILE_LOGO_HEADER);
 }
 assertLogoSurfaceBindings(draft,value,options);for(const name of changes)files.set(name,draft.get(name));return changes;
}
export function assertLogoSurfaceBindings(files,value,options){
 const pair=surfaces(value),families=familiesFor(options);
 if(families.includes('modern')){
  const modern=get(files,MODERN_LOGO_CONFIG),primary=[...modern.matchAll(/^[ \t]*logoPath[ \t]*:[ \t]*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'),[ \t]*$/gm)],inverse=[...modern.matchAll(/^[ \t]*logoInversePath[ \t]*:[ \t]*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')[ \t]*,?[ \t]*$/gm)];
  if(unsupportedModernLogoDeclarations(modern)||primary.length!==1||(modern.match(/^[ \t]*logoPath[ \t]*:/gm)??[]).length!==1||(modern.match(/^[ \t]*logoInversePath[ \t]*:/gm)??[]).length!==1||inverse.length!==1||inverse[0][1]!==JSON.stringify(pair.onDark))throw Error('Modern dark footer has no inverse raster logo');
  if(pair.retained&&primary[0][1]!==JSON.stringify(pair.onLight))throw Error('Modern light header has no retained light raster logo');
 }
 if(families.includes('mobile')){
  if(pair.retained){assertRetainedMobile(files,pair);return;}
  const mobile=get(files,MOBILE_LOGO_HEADER);
  const selection=pair.retained?'srcSet='+JSON.stringify(pair.onDark):'"/logo-on-dark.webp"';
  if(!mobile.includes('data-dealer-logo-surfaces')||!mobile.includes('{overHeroDesktop && !generatedDesktopLogo && <source media="(min-width: 1024px)"')||!mobile.includes(selection)||mobile.includes('brightness(0) invert(1)')||!mobile.includes('src={showroom.logo}'))throw Error('Mobile hero must select the committed raster without inversion');
 }
}
function verifiedRetainedTuple(files,contract,families){
 const tuple={};
 for(const surface of ['onLight','onDark']){
  const asset=contract?.assets?.[surface];
  if(!asset||!publicRaster(asset.publicPath)||!/^[a-f0-9]{64}$/.test(asset.sha256??''))throw Error('Missing verified retained '+surface+' raster');
  tuple[surface]=asset.publicPath;
  for(const key of families){
   const name=publicRoots[key]+asset.publicPath,bytes=files.get(name);
   if(!bytes||createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error('Retained logo member missing or changed: '+name);
  }
 }
 return tuple;
}
/** Apply only the verified retained members; never generate or alter their bytes. */
export function applyRetainedLogoSurfaceBindings(files,contract,options){
 const families=familiesFor(options),tuple=verifiedRetainedTuple(files,contract,families);
 return applyLogoSurfaceBindings(files,tuple,{families,reviewedPinnedTemplateReplacement:options?.reviewedPinnedTemplateReplacement===true});
}
/** Read-only guard for raw or already mounted retained consumers. */
export function assertRetainedLogoSurfaceBindings(files,contract,{mounts={},...options}={}){
 const families=familiesFor(options),tuple=verifiedRetainedTuple(files,contract,families);
 for(const key of families){
  try{assertLogoSurfaceBindings(files,tuple,{families:[key]});}
  catch(error){
   const base=mounts[key];
   if(typeof base!=='string'||!/^\/variant-[2-6]$/.test(base))throw error;
   assertLogoSurfaceBindings(files,{onLight:base+tuple.onLight,onDark:base+tuple.onDark},{families:[key]});
  }
 }
 return families;
}
/** Independent repositories keep their own accepted surface policy. */
export function assertRetainedDealerLogoSurfaces(files,manifest){
 if(manifest.sourceOwnership==='independent-repository'||manifest.packaging.version!=='5'||files.has('.cars-branding.json')||!files.has('branding/logo-contract.json'))return [];
 const families=manifest.variants.map(({key})=>key).filter(key=>Object.hasOwn(publicRoots,key));if(!families.length)return [];
 try{return assertRetainedLogoSurfaceBindings(files,JSON.parse(get(files,'branding/logo-contract.json')),{families,mounts:Object.fromEntries(manifest.variants.map(({key,base})=>[key,base]))});}
 catch(error){throw Error('Retained logo surface check failed: '+error.message+'. Use the maintained dealer template refresh to bind retained logos before packaging.');}
}

