// The mobile hero must choose its white raster before JavaScript hydration.
export const SIGNATURE_HEADER='karento-best/src/lib/components/Header.svelte';
export function applySignatureLogoSurface(files){
 if(!files.has(SIGNATURE_HEADER))return false;let s=files.get(SIGNATURE_HEADER).toString('utf8');
 if(s.includes('data-signature-logo-surfaces')){assertSignatureLogoSurface(files);return false;}
 const once=(from,to)=>{if(s.split(from).length!==2)throw Error('Signature header contract changed: '+from);s=s.replace(from,to);};
 once('  const heroHeader = $derived(\n    phone.current &&\n', '  const heroRoute = $derived(\n');
 once('  const preview = usePreview();','  const heroHeader = $derived(phone.current && heroRoute);\n  const preview = usePreview();');
 const start=s.indexOf('            <img\n              class="light-mode"'),end=s.indexOf('            />',start);if(start<0||end<start)throw Error('Missing native Signature primary logo');
 const img=s.slice(start,end+14);s=s.slice(0,start)+'            <picture data-signature-logo-surfaces style="display: contents">\n              <source media="(max-width: 767.98px)" srcset={heroRoute && scrollY <= 20 ? dealer.logo.archivedDark : dealer.logo.light} />\n'+img+'\n            </picture>'+s.slice(end+14);
 files.set(SIGNATURE_HEADER,Buffer.from(s));assertSignatureLogoSurface(files);return true;
}
export function assertSignatureLogoSurface(files){if(!files.has(SIGNATURE_HEADER))return;const s=files.get(SIGNATURE_HEADER).toString('utf8');if(!s.includes('data-signature-logo-surfaces')||!s.includes('srcset={heroRoute && scrollY <= 20 ? dealer.logo.archivedDark : dealer.logo.light}')||!s.includes('const heroHeader = $derived(phone.current && heroRoute);'))throw Error('Signature must bind responsive hero raster before hydration');}
