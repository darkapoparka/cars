// Explicit post-build provider mapping for retained UK raster-logo contracts.
// Original build artifacts remain immutable; all derived bytes and paths enter the provider receipt.
export const IMPORT_ASSET_DIRECTORY='_app-uk-brand-20261011';
export function bindImportSurfaceLogos(source){
 const slots={logoLight:'/dealer-brand/logo-on-light-20261011.webp',logoDark:'/dealer-brand/logo-on-dark-20261011.webp'};
 let changed=0;
 for(const [key,value]of Object.entries(slots)){
  const re=new RegExp('('+key+':\\s*)(["\x60])(?:/variant-3)?/dealer-brand/logo\\.webp\\2','g');
  source=source.replace(re,(_all,prefix,quote)=>{changed++;return prefix+quote+value+quote;});
 }
 if(changed!==0&&changed!==2)throw Error('Import logo configuration must contain one complete pair');
 return {source,changed};
}
export function namespaceImportAssets(source){
 return source.replaceAll('_app/',IMPORT_ASSET_DIRECTORY+'/').replaceAll('variant-3/_app"','variant-3/'+IMPORT_ASSET_DIRECTORY+'"').replaceAll('variant-3/_app\x60','variant-3/'+IMPORT_ASSET_DIRECTORY+'\x60').replace(/(appDir:\s*)(["\x60])_app\2/g,(_a,p,q)=>p+q+IMPORT_ASSET_DIRECTORY+q);
}
export function importAssetName(name){return name.replace(/^variant-3\/_app\//,'variant-3/'+IMPORT_ASSET_DIRECTORY+'/');}
