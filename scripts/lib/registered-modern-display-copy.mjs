import {createHash} from 'node:crypto';
import {buildModernDealerInventoryCopy} from './modern-dealer-inventory-copy.mjs';
const sha=value=>createHash('sha256').update(value).digest('hex');
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function registeredModernInputRows(profile){
 return profile.listings.map(item=>({slug:item.slug,description:item.description||profile.business.inventoryNotice,images:item.images.map(url=>({url,alt:item.title}))}));
}
/** Copy companions preserve all original descriptions, listing facts, URLs and factual image alts. */
export function validateRegisteredModernDisplayCopy(value,profile){
 if(value?.schemaVersion!==1||value.kind!=='cars-registered-modern-display-copy'||value.dealer!==profile.slug||value.reviewed!==true||!Number.isFinite(Date.parse(value.reviewedAt)))throw Error('Explicit dealer-scoped registered display-copy review required');
 const rows=registeredModernInputRows(profile);
 if(value.inputRowsSha256!==sha(JSON.stringify(rows))||!same(Object.keys(value.reviewedCopy??{}).sort(),rows.map(x=>x.slug).sort()))throw Error('Registered display-copy source rows changed');
 const copy=buildModernDealerInventoryCopy(rows,{reviewedCopy:value.reviewedCopy});
 for(const row of rows)for(const locale of ['en','bg'])if(!same(copy[row.slug][locale].imageAlts,row.images.map(x=>x.alt)))throw Error('Registered display copy changed factual image alts');
 return copy;
}

