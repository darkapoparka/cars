// Source-level surface selection. It never recolours template backgrounds or changes layout.
export const MODERN_LOGO_CONFIG='modern/packages/marketplace/lead-site.ts';
export const MOBILE_LOGO_HEADER='mobile/src/components/Header.tsx';
const get=(files,p)=>{if(!files.has(p))throw Error('Missing logo consumer '+p);return Buffer.from(files.get(p)).toString('utf8');};
function once(text,from,to,label){if(text.split(from).length!==2)throw Error('Changed logo surface boundary '+label);return text.replace(from,to);}
export function applyLogoSurfaceBindings(files,publicBase){
 if(!/^\/dealer-brand\/v2-[a-f0-9]{16}$/.test(publicBase))throw Error('Versioned surface pack required');const changes=[];
 let modern=get(files,MODERN_LOGO_CONFIG);const wanted=JSON.stringify(publicBase+'/logo-on-dark.webp');
 if(/^\s*logoInversePath:\s*/m.test(modern)){modern=modern.replace(/^(\s*logoInversePath:\s*)["'][^"']+["']/m,(_,lead)=>lead+wanted);}else{modern=once(modern,'  logoOnLight:', '  logoInversePath: '+wanted+',\n  logoOnLight:','Modern inverse logo');}
 files.set(MODERN_LOGO_CONFIG,Buffer.from(modern));changes.push(MODERN_LOGO_CONFIG);
 let mobile=get(files,MOBILE_LOGO_HEADER);
 if(!mobile.includes('data-dealer-logo-surfaces')){
  mobile=once(mobile,"filter: { default: 'none', '@media (min-width: 1024px)': 'brightness(0) invert(1)' },","filter: 'none',",'Mobile unfiltered raster');
  mobile=mobile.replace('// Fallback for personalized artwork without its own light presentation.','// Select committed surface artwork; never manufacture a white logo with CSS.');
  const start=mobile.indexOf('              <Image\n                src={showroom.logo}');if(start<0)throw Error('Mobile native image boundary missing');const end=mobile.indexOf('              />',start);if(end<0)throw Error('Mobile native image end missing');
  const image=mobile.slice(start,end+'              />'.length);
  mobile=mobile.slice(0,start)+'              <picture data-dealer-logo-surfaces style={{display: "contents"}}>\n                {overHeroDesktop && !generatedDesktopLogo && <source media="(min-width: 1024px)" srcSet={showroom.logo.replace(/\\/logo-on-light\\.webp$/, "/logo-on-dark.webp")} />}\n'+image+'\n              </picture>'+mobile.slice(end+'              />'.length);
 }
 files.set(MOBILE_LOGO_HEADER,Buffer.from(mobile));changes.push(MOBILE_LOGO_HEADER);assertLogoSurfaceBindings(files,publicBase);return changes;
}
export function assertLogoSurfaceBindings(files,publicBase){
 const modern=get(files,MODERN_LOGO_CONFIG);if(!modern.includes('logoInversePath: '+JSON.stringify(publicBase+'/logo-on-dark.webp')))throw Error('Modern dark footer has no inverse raster logo');
 const mobile=get(files,MOBILE_LOGO_HEADER);if(!mobile.includes('data-dealer-logo-surfaces')||!mobile.includes('media="(min-width: 1024px)"')||!mobile.includes('"/logo-on-dark.webp"')||mobile.includes('brightness(0) invert(1)'))throw Error('Mobile hero must select the committed white raster without inversion');
}
