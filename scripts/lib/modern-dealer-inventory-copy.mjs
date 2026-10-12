const datedBg='Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.';
const datedEn='Dated listing samples; confirm price and availability directly with the dealership.';
const alReefEn='Illustrative demo inventory and sample AED prices — not verified Al Reef stock. Contact the showroom for current vehicles.';
const alReefBg='Илюстративни автомобили и примерни цени в AED — не са потвърдени наличности на Al Reef. Свържете се с шоурума за актуалните автомобили.';
const translations=new Map([[datedBg,{en:datedEn,bg:datedBg}],[datedEn,{en:datedEn,bg:datedBg}],[alReefEn,{en:alReefEn,bg:alReefBg}]]);
const tokens=s=>[...new Set(String(s).match(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)||[])].sort().join(',');
const nonempty=s=>typeof s==='string'&&s.trim().length>0;
/** Generates only companion display copy. IDs, slugs, facts, prices and image URLs are never edited. */
export function buildModernDealerInventoryCopy(listings,{reviewedCopy={}}={}){
 if(!Array.isArray(listings)||!listings.length||listings.length>1000)throw Error('Modern companion copy requires bounded personalized listings');
 const result={};
 for(const listing of listings){const {slug,description,images}=listing;if(!nonempty(slug)||['__proto__','constructor','prototype'].includes(slug)||Object.hasOwn(result,slug)||!nonempty(description)||!Array.isArray(images)||!images.length||images.some(x=>!nonempty(x?.url)||!nonempty(x?.alt)))throw Error('Invalid personalized Modern listing copy input: '+slug);
  let row=reviewedCopy[slug];
  if(row){if(row.sourceDescription!==description)throw Error('Reviewed Modern copy source changed: '+slug);row=structuredClone(row);}
  else {const pair=translations.get(description);if(!pair)throw Error('Modern inventory description requires explicit reviewed EN/BG copy: '+slug);row={sourceDescription:description,en:{description:pair.en,imageAlts:images.map(x=>x.alt)},bg:{description:pair.bg,imageAlts:images.map(x=>x.alt)}};}
  for(const locale of ['en','bg'])if(!nonempty(row[locale]?.description)||tokens(row[locale].description)!==tokens(description)||!Array.isArray(row[locale].imageAlts)||row[locale].imageAlts.length!==images.length||row[locale].imageAlts.some(s=>!nonempty(s)))throw Error('Invalid reviewed bilingual Modern inventory copy: '+slug);
  if(tokens(row.en.description)!==tokens(row.bg.description))throw Error('Modern inventory translation interpolation differs: '+slug);
  result[slug]=row;
 }
 return result;
}
export function renderModernDealerInventoryCopy(listings,options){return 'import type { DealerInventoryCopy } from "../lead-site";\n/** Dealer-owned display copy from the exact personalized listing set. */\nexport const inventoryCopy = '+JSON.stringify(buildModernDealerInventoryCopy(listings,options),null,2)+' satisfies DealerInventoryCopy;\n';}
/** Adapter output is JSON data inside the retained TypeScript declaration, never executable text. */
export function parseModernPersonalizedListings(source){const marker=/export const mockListings\s*:\s*VehicleListing\[\]\s*=\s*/.exec(source);if(!marker)throw Error('Personalized Modern listing declaration missing');const start=marker.index+marker[0].length;if(source[start]!=='[')throw Error('Personalized Modern listing JSON missing');let depth=0,string=false,escape=false,end=-1;for(let i=start;i<source.length;i++){const c=source[i];if(string){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')string=false;}else if(c==='"')string=true;else if(c==='['||c==='{')depth++;else if(c===']'||c==='}'){depth--;if(!depth){end=i+1;break;}}}if(end<0)throw Error('Personalized Modern listing JSON truncated');const rows=JSON.parse(source.slice(start,end));if(!Array.isArray(rows))throw Error('Personalized Modern listing JSON is not an array');return rows;}
