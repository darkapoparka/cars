import {createHash} from 'node:crypto';
const sha=value=>createHash('sha256').update(value).digest('hex');
export const INVENTORY_NOTE_BG='Датирана извадка от публични обяви, не складова система в реално време. Потвърдете цената, ДДС и наличността. Обявите за очакван внос не означават наличен автомобил във Варна.';
export const INVENTORY_NOTE_EN='A dated snapshot of public listings, not a live inventory system. Confirm the price, VAT and availability. Listings for expected imports do not mean that the vehicle is available in Varna.';
/** Complete only generated dealer copy; preserve sourced facts and strict native lookups. */
export function repairVarnaCopyContracts(files){
 const pending=new Map(),changes=[];
 const localePath='auto-best/src/lib/config/locale.ts',contentPath='import/src/lib/content/localized.ts';
 for(const name of [localePath,contentPath]){
  const before=files.get(name);if(!before)throw Error('Missing Varna copy source: '+name);
  const source=String(before).replace(/\r\n/g,'\n');let output;
  if(name===localePath){
   const pattern=/export const dealerLocalizedText = (\{[\s\S]*?\n\}) as const;/g,matches=[...source.matchAll(pattern)];
   if(matches.length!==1)throw Error('Dealer bilingual object changed');
   const labels=JSON.parse(matches[0][1]);
   for(const locale of ['en','bg']){
    if(typeof labels[locale]?.addressLine!=='string'||!labels[locale].addressLine.trim())throw Error('Missing sourced address line');
    if(Object.hasOwn(labels[locale],'addressShort'))throw Error('Address short already defined; review instead of overwriting');
    labels[locale].addressShort=labels[locale].addressLine;
   }
   output=source.replace(matches[0][0],'export const dealerLocalizedText = '+JSON.stringify(labels,null,2)+' as const;');
  }else{
   const boundary='const generatedDealerEnglish = (value: string): string | undefined => {';
   if(source.split(boundary).length!==2||source.includes(JSON.stringify(INVENTORY_NOTE_BG)))throw Error('Import generated editorial boundary changed');
   output=source.replace(boundary,boundary+'\n\tif (value === '+JSON.stringify(INVENTORY_NOTE_BG)+') return '+JSON.stringify(INVENTORY_NOTE_EN)+';');
   if(!output.includes("throw new Error('Missing English editorial catalog entry: ' + value)"))throw Error('Strict translation lookup must remain');
  }
  pending.set(name,Buffer.isBuffer(before)?Buffer.from(output):output);
  changes.push({path:name,beforeSha256:sha(before),afterSha256:sha(output),factsPreserved:true});
 }
 for(const [name,bytes]of pending)files.set(name,bytes);
 return {schemaVersion:1,kind:'varna-bilingual-dealer-copy-completion',changes,templateMastersChanged:false};
}
