import {readCatalogLiteral,readTypeScriptCatalog} from './catalog-literal.mjs';

// Data-only provenance for the recorded legacy Row[] catalogs and the exact
// Sunny records.map URL expression. Never import, transpile or execute a dealer.
const schemas=[
 'slug:string,make:string,model:string,year:number,date:string,mileageKm:number,priceEur:number,fuel:string,transmission:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number,sourceId:string,sourceUrl:string,note:string',
 'slug:string,make:string,model:string,year:number,date:string,priceEur:number,fuel:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number,sourceId:string,sourceUrl:string,note:string',
 'slug:string,make:string,model:string,year:number,date:string,mileageKm:number,priceEur:number,fuel:string,transmission:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number|null,taxLabel:string,sourceId:string,sourceUrl:string,note:string'
];
function catalogText(bytes){
 if(!Buffer.isBuffer(bytes)||bytes.length>16*1024**2)throw Error('Bounded original catalog bytes required');
 return new TextDecoder('utf-8',{fatal:true}).decode(bytes).replace(/^\uFEFF/,'');
}
function sourceForms(source){
 let clean='',skeleton='',at=0;
 const blank=s=>s.replace(/[^\r\n]/g,' ');
 while(at<source.length){
  const c=source[at],pair=source.slice(at,at+2);
  if(pair==='//'||pair==='/*'){
   const begin=at;let end;
   if(pair==='//'){end=source.indexOf('\n',at+2);if(end<0)end=source.length;}
   else{end=source.indexOf('*/',at+2);if(end<0)throw Error('Unterminated catalog comment');end+=2;}
   const spaces=blank(source.slice(begin,end));clean+=spaces;skeleton+=spaces;at=end;
  }else if(c==='"'||c==="'"||c==='\u0060'){
   const begin=at++,quote=c;let closed=false;
   while(at<source.length){const next=source[at++];if(next==='\\'){if(at>=source.length)throw Error('Unterminated catalog escape');at++;}else if(next===quote){closed=true;break;}}
   if(!closed)throw Error('Unterminated catalog string');
   const literal=source.slice(begin,at);clean+=literal;skeleton+=blank(literal);
  }else{clean+=c;skeleton+=c;at++;}
 }
 return {clean,skeleton};
}
function oneMatch(source,pattern,label){const items=[...source.matchAll(pattern)];if(items.length!==1)throw Error('Exactly one '+label+' required');return items[0];}
export function readOriginalTupleListingRecords(bytes){
 const {clean,skeleton}=sourceForms(catalogText(bytes));
 const declaration=oneMatch(skeleton,/^type\s+Row\s*=\s*\[([^\]]+)\]\s*;/gm,'supported Row tuple type');
 const signature=declaration[1].replace(/\s/g,'');if(!schemas.includes(signature))throw Error('Unsupported original tuple schema');
 oneMatch(skeleton,/^const\s+rows\s*:\s*Row\[\]\s*=\s*/gm,'typed rows binding');
 const fields=signature.split(',').map(part=>{const [name,type]=part.split(':');return {name,type};});
 const rows=readTypeScriptCatalog(clean,'rows');if(!Array.isArray(rows)||!rows.length||rows.length>400)throw Error('Bounded original tuple rows required');
 const ids=new Set();return rows.map(row=>{
  if(!Array.isArray(row)||row.length!==fields.length)throw Error('Original tuple field count differs');
  const result=Object.create(null);
  fields.forEach(({name,type},i)=>{const value=row[i];if(!(type==='string'?typeof value==='string':type==='number'?typeof value==='number'&&Number.isFinite(value):value===null||typeof value==='number'&&Number.isFinite(value)))throw Error('Original tuple field type differs: '+name);result[name]=value;});
  if(result.sourceId&&ids.has(result.sourceId))throw Error('Duplicate original tuple source ID');
  if(result.sourceId)ids.add(result.sourceId);return result;
 });
}
function compactCode(source){
 let out='',at=0;
 while(at<source.length){const c=source[at++];if(c==='"'||c==="'"||c==='\u0060'){out+=c;let closed=false;while(at<source.length){const next=source[at++];out+=next;if(next==='\\'){out+=source[at++];}else if(next===c){closed=true;break;}}if(!closed)throw Error('Unterminated mapper string');}else if(!/\s/.test(c))out+=c;}
 return out;
}
const sunnyMapper='exportconststock:StockRecord[]=records.map(record=>({...record,sourceUrl:\u0060https://sunny.mobile.bg/obiava-${record.sourceId}-${record.slug}\u0060,observedAt:dealer.observedAt,taxLabel:\'Не се начислява ДДС\',availability:\'advertised-unconfirmed\',image:\'/brand/stock-unavailable.svg\',gallery:[\'/brand/stock-unavailable.svg\']}));';
export function readOriginalSunnyListingRecords(bytes){
 const {clean,skeleton}=sourceForms(catalogText(bytes));
 oneMatch(skeleton,/^const\s+records\s*:\s*SourceRecord\[\]\s*=\s*/gm,'Sunny literal records binding');
 const noteDeclaration=oneMatch(skeleton,/^const\s+catalogueNote\s*=/gm,'literal Sunny catalogue note');
 const note=readCatalogLiteral(clean,noteDeclaration.index+noteDeclaration[0].length);
 if(typeof note.value!=='string'||!/^\s*;/.test(clean.slice(note.end)))throw Error('Sunny note must be a literal string');
 const mapperStart=oneMatch(skeleton,/^export\s+const\s+stock\s*:\s*StockRecord\[\]\s*=\s*records\.map\(record\s*=>\s*\(\{/gm,'exact Sunny mapper');
 const mapperEnd=skeleton.indexOf('}));',mapperStart.index);if(mapperEnd<0)throw Error('Unterminated Sunny mapper');
 if(compactCode(clean.slice(mapperStart.index,mapperEnd+5))!==sunnyMapper)throw Error('Only the recorded safe Sunny source URL mapper is supported');
 const rows=readTypeScriptCatalog(clean,'records',{literalIdentifiers:new Map([['catalogueNote',note.value]])});
 if(!Array.isArray(rows)||!rows.length||rows.length>400)throw Error('Bounded Sunny records required');
 const ids=new Set();return rows.map(row=>{
  if(!row||Array.isArray(row)||typeof row.sourceId!=='string'||!/^\d{16,18}$/.test(row.sourceId)||typeof row.slug!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)||ids.has(row.sourceId)||Object.hasOwn(row,'sourceUrl'))throw Error('Distinct static Sunny source ID/slug pair required');
  ids.add(row.sourceId);return {...row,sourceUrl:'https://sunny.mobile.bg/obiava-'+row.sourceId+'-'+row.slug};
 });
}
// Legacy JSON and TypeScript object literals remain data-only. Comments and
// strings that merely describe an object are not records. A source pair must
// occur in one immediate literal record, never in unrelated objects or text.
function legacyListingRecords({clean,skeleton}){
 const records=[];let attempts=0;
 const collect=value=>{
  if(Array.isArray(value)){value.forEach(collect);return;}
  if(value&&typeof value==='object'){records.push(value);for(const child of Object.values(value))collect(child);}
 };
 for(let at=0;at<skeleton.length;at++){
  if(skeleton[at]!=='{')continue;
  if(++attempts>4096)return [];
  try{const parsed=readCatalogLiteral(clean,at);collect(parsed.value);at=parsed.end-1;}catch{}
  if(records.length>1600)return [];
 }
 return records;
}
const legacyIdFields=['id','sourceId','stockId','listingId','advertId'];
function recordIdMatches(record,id){
 return legacyIdFields.some(key=>Object.hasOwn(record,key)&&(typeof record[key]==='string'?record[key]===id:Number.isSafeInteger(record[key])&&String(record[key])===id));
}
function tuplesOrEmpty(bytes){try{return readOriginalTupleListingRecords(bytes);}catch{return [];}}
export function originalListingIdRecorded(bytes,id){
 if(typeof id!=='string'||!id.trim())return false;
 const forms=sourceForms(catalogText(bytes));
 if(/^const\s+rows\s*:\s*Row\[\]\s*=/m.test(forms.skeleton))return tuplesOrEmpty(bytes).some(row=>row.sourceId===id);
 if(/^const\s+records\s*:\s*SourceRecord\[\]\s*=/m.test(forms.skeleton)){try{return readOriginalSunnyListingRecords(bytes).some(row=>row.sourceId===id);}catch{return false;}}
 return legacyListingRecords(forms).some(row=>recordIdMatches(row,id));
}
export function originalListingSourceRecorded(bytes,id,sourceUrl){
 if(typeof id!=='string'||!id.trim()||typeof sourceUrl!=='string'||!sourceUrl)return false;
 const forms=sourceForms(catalogText(bytes));
 if(/^const\s+rows\s*:\s*Row\[\]\s*=/m.test(forms.skeleton))return tuplesOrEmpty(bytes).some(row=>row.sourceId===id&&row.sourceUrl===sourceUrl);
 if(/^const\s+records\s*:\s*SourceRecord\[\]\s*=/m.test(forms.skeleton)){try{return readOriginalSunnyListingRecords(bytes).some(row=>row.sourceId===id&&row.sourceUrl===sourceUrl);}catch{return false;}}
 return legacyListingRecords(forms).some(row=>recordIdMatches(row,id)&&Object.values(row).some(value=>typeof value==='string'&&value===sourceUrl));
}
