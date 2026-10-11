// Identity overlays must not replace a template's surface palette.
export function bindCurrentImportLogoAssets(source, paths) {
 const marker='export const daynightAssets';
 const start=source.indexOf(marker);
 const end=source.indexOf('} as const;',start);
 if(start<0||end<start)throw Error('Current Import asset contract changed');
 let block=source.slice(start,end);
 for(const [key,value]of [['logoLight',paths.onLight],['logoDark',paths.onDark]]){
  if(!/^\/dealer-brand\/[^/]+\.webp$/.test(value||''))throw Error('Expected reviewed Import raster asset');
  const re=new RegExp('((?:["\x27])?'+key+'(?:["\x27])?\\s*:\\s*)(["\x27])[^"\x27]*\\2','g');
  let count=0;
  block=block.replace(re,(_all,prefix)=>{count++;return prefix+JSON.stringify(value);});
  if(count!==1)throw Error('Expected one current Import '+key+' slot');
 }
 return source.slice(0,start)+block+source.slice(end);
}
