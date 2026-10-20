import {createHash} from 'node:crypto';
import {readCatalogLiteral,readTypeScriptCatalog} from './catalog-literal.mjs';
const datedBg='Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.';
const datedEn='Dated listing samples; confirm price and availability directly with the dealership.';
const datedSnapshotEn='Dated listing snapshot; confirm the price and availability directly with the dealership.';
const alReefEn='Illustrative demo inventory and sample AED prices — not verified Al Reef stock. Contact the showroom for current vehicles.';
const alReefBg='Илюстративни автомобили и примерни цени в AED — не са потвърдени наличности на Al Reef. Свържете се с шоурума за актуалните автомобили.';
// Exact dated illustration descriptions retained in the reviewed Bradford stock snapshot.
// Companion translations preserve the observed date and the Mini bodywork caveat.
const bradfordIllustrationEn="Illustration — not the advertised vehicle. These are dated listing details observed on 10 October 2026. Confirm the original advert, price, condition and availability with the dealer.";
const bradfordIllustrationBg="Илюстрация — не показва обявения автомобил. Това са датирани данни от обяви, наблюдавани на 10 октомври 2026 г. Потвърдете оригиналната обява, цената, състоянието и наличността с автокъщата.";
const bradfordBodyworkEn="Illustration — not the advertised vehicle. These are dated listing details observed on 10 October 2026. Confirm the original advert, price, condition and availability with the dealer. The source advert reports cosmetic imperfections to the bodywork.";
const bradfordBodyworkBg="Илюстрация — не показва обявения автомобил. Това са датирани данни от обяви, наблюдавани на 10 октомври 2026 г. Потвърдете оригиналната обява, цената, състоянието и наличността с автокъщата. В оригиналната обява са посочени козметични дефекти по каросерията.";
const known=new Map([[datedBg,{bg:datedBg,en:datedSnapshotEn}],[datedEn,{bg:datedBg,en:datedEn}],[alReefEn,{bg:alReefBg,en:alReefEn}],[alReefBg,{bg:alReefBg,en:alReefEn}],[bradfordIllustrationEn,{en:bradfordIllustrationEn,bg:bradfordIllustrationBg}],[bradfordBodyworkEn,{en:bradfordBodyworkEn,bg:bradfordBodyworkBg}]]);
// Root reviewed exact51 scalar source keys; raw inventory values stay unchanged.
// Review SHA256: 441c1e23539fa1db7e52b0a47dc9aa205481df9f50083603a9938dc003ec06b9
// Additional exact seven native-dealer terms reviewed by root; no feed values change.
const scalarTerms=new Map([
  ["color:Тъмно син металик",{"bg":"Тъмно син металик","en":"Dark metallic blue"}],
  ["feature:360° камера",{"bg":"360° камера","en":"360° camera"}],
  ["feature:4x4",{"bg":"4x4","en":"4x4"}],
  ["feature:Адаптивен круиз контрол",{"bg":"Адаптивен круиз контрол","en":"Adaptive cruise control"}],
  ["feature:Безключово палене",{"bg":"Безключово палене","en":"Keyless start"}],
  ["feature:Навигация",{"bg":"Навигация","en":"Navigation"}],
  ["feature:Панорамен покрив",{"bg":"Панорамен покрив","en":"Panoramic sunroof"}],
  ["feature:Парктроник",{"bg":"Парктроник","en":"Parking sensors"}],
  ["color:Light grey",{"bg":"Светло сив","en":"Light grey"}],
  ["color:Light blue",{"bg":"Светло син","en":"Light blue"}],
  ["feature:Apple CarPlay / Android Auto",{"bg":"Apple CarPlay / Android Auto","en":"Apple CarPlay / Android Auto"}],
  ["feature:Bluetooth",{"bg":"Bluetooth","en":"Bluetooth"}],
  ["feature:ISOFIX",{"bg":"ISOFIX","en":"ISOFIX"}],
  ["feature:Камера за заден ход",{"bg":"Камера за заден ход","en":"Rear-view camera"}],
  ["feature:Ел. стъкла",{"bg":"Ел. стъкла","en":"Electric windows"}],
  ["color:Перла",{"bg":"Перла","en":"Pearlescent"}],
  ["color:Керемиден",{"bg":"Керемиден","en":"Terracotta color"}],
  [
    "feature:American specification",
    {
      "bg": "Американска спецификация",
      "en": "American specification"
    }
  ],
  [
    "feature:GCC specification",
    {
      "bg": "Спецификация за GCC",
      "en": "GCC specification"
    }
  ],
  [
    "feature:Bluetooth \\ handsfree система",
    {
      "bg": "Bluetooth / handsfree система",
      "en": "Bluetooth / hands-free system"
    }
  ],
  [
    "feature:Buy back",
    {
      "bg": "Обратно изкупуване",
      "en": "Buy back"
    }
  ],
  [
    "feature:audio\\video",
    {
      "bg": "Аудио / видео",
      "en": "Audio / video"
    }
  ],
  [
    "feature:IN\\AUX изводи",
    {
      "bg": "IN / AUX изводи",
      "en": "IN / AUX inputs"
    }
  ],
  [
    "feature:Бартер",
    {
      "bg": "Бартер",
      "en": "Part exchange"
    }
  ],
  [
    "feature:Лизинг",
    {
      "bg": "Лизинг",
      "en": "Leasing"
    }
  ],
  [
    "feature:Хладилна жабка",
    {
      "bg": "Хладилна жабка",
      "en": "Cooled glove box"
    }
  ],
  [
    "feature:Климатик",
    {
      "bg": "Климатик",
      "en": "Air conditioning"
    }
  ],
  [
    "feature:Термопомпа",
    {
      "bg": "Термопомпа",
      "en": "Heat pump"
    }
  ],
  [
    "feature:360 camera \\ Задна камера",
    {
      "bg": "360 камера / задна камера",
      "en": "360 camera / rear camera"
    }
  ],
  [
    "feature:Apple CarPlay \\ Android Auto",
    {
      "bg": "Apple CarPlay / Android Auto",
      "en": "Apple CarPlay / Android Auto"
    }
  ],
  [
    "feature:OFFROAD пакет",
    {
      "bg": "Пакет OFFROAD",
      "en": "Off-road package"
    }
  ],
  [
    "feature:Бързи \\ бавни скорости",
    {
      "bg": "Бързи / бавни скорости",
      "en": "High / low range gears"
    }
  ],
  [
    "feature:Светъл салон",
    {
      "bg": "Светъл салон",
      "en": "Light-coloured interior"
    }
  ],
  [
    "feature:Хомологация N1",
    {
      "bg": "Хомологация N1",
      "en": "N1 homologation"
    }
  ],
  [
    "feature:Безключово палене ",
    {
      "bg": "Безключово палене",
      "en": "Keyless start"
    }
  ],
  [
    "feature:Велурен салон",
    {
      "bg": "Велурен салон",
      "en": "Velour interior"
    }
  ],
  [
    "feature:Газова уредба",
    {
      "bg": "Газова уредба",
      "en": "Gas fuel system"
    }
  ],
  [
    "feature:Тунинг",
    {
      "bg": "Тунинг",
      "en": "Tuning"
    }
  ],
  [
    "feature:Дълга база",
    {
      "bg": "Дълга база",
      "en": "Long wheelbase"
    }
  ],
  [
    "feature:Подгряване на седалки",
    {
      "bg": "Подгряване на седалки",
      "en": "Heated seats"
    }
  ],
  [
    "feature:Безключов достъп",
    {
      "bg": "Безключов достъп",
      "en": "Keyless entry"
    }
  ],
  [
    "color:Ultra White",
    {
      "bg": "Ultra White",
      "en": "Ultra White"
    }
  ],
  [
    "color:Cloudburst Gray",
    {
      "bg": "Cloudburst Gray",
      "en": "Cloudburst Gray"
    }
  ],
  [
    "color:Royal Black",
    {
      "bg": "Royal Black",
      "en": "Royal Black"
    }
  ],
  [
    "color:Iridium Silver",
    {
      "bg": "Iridium Silver",
      "en": "Iridium Silver"
    }
  ],
  [
    "color:Brown",
    {
      "bg": "Кафяв",
      "en": "Brown"
    }
  ],
  [
    "color:Grey",
    {
      "bg": "Сив",
      "en": "Grey"
    }
  ],
  [
    "color:Gold",
    {
      "bg": "Златист",
      "en": "Gold"
    }
  ],
  [
    "color:White",
    {
      "bg": "Бял",
      "en": "White"
    }
  ],
  [
    "color:Silver",
    {
      "bg": "Сребрист",
      "en": "Silver"
    }
  ],
  [
    "color:Black",
    {
      "bg": "Черен",
      "en": "Black"
    }
  ],
  [
    "color:Blue",
    {
      "bg": "Син",
      "en": "Blue"
    }
  ],
  [
    "color:",
    {
      "bg": "Не е посочен",
      "en": "Not specified"
    }
  ],
  [
    "color:Охра",
    {
      "bg": "Охра",
      "en": "Ochre"
    }
  ],
  [
    "color:Тъмно сив",
    {
      "bg": "Тъмно сив",
      "en": "Dark grey"
    }
  ],
  [
    "color:Кафяв",
    {
      "bg": "Кафяв",
      "en": "Brown"
    }
  ],
  [
    "color:Банан",
    {
      "bg": "Банан",
      "en": "Banana"
    }
  ],
  [
    "color:Светло сив",
    {
      "bg": "Светло сив",
      "en": "Light grey"
    }
  ],
  [
    "color:Tъмно син",
    {
      "bg": "Тъмно син",
      "en": "Dark blue"
    }
  ],
  [
    "color:Графит",
    {
      "bg": "Графит",
      "en": "Graphite"
    }
  ],
  [
    "color:Бордо",
    {
      "bg": "Бордо",
      "en": "Burgundy"
    }
  ],
  [
    "color:Тъмно Сив",
    {
      "bg": "Тъмно сив",
      "en": "Dark grey"
    }
  ],
  [
    "color:Светло Сив",
    {
      "bg": "Светло сив",
      "en": "Light grey"
    }
  ],
  [
    "color:Тъмно Син Мет.",
    {
      "bg": "Тъмно син металик",
      "en": "Dark blue metallic"
    }
  ],
  [
    "color:Сребърен",
    {
      "bg": "Сребърен",
      "en": "Silver"
    }
  ],
  [
    "color:Син",
    {
      "bg": "Син",
      "en": "Blue"
    }
  ],
  [
    "color:Светло син",
    {
      "bg": "Светло син",
      "en": "Light blue"
    }
  ],
  [
    "color:Т.зелен",
    {
      "bg": "Тъмно зелен",
      "en": "Dark green"
    }
  ],
  [
    "color:Gray",
    {
      "bg": "Сив",
      "en": "Gray"
    }
  ],
  [
    "color:Red",
    {
      "bg": "Червен",
      "en": "Red"
    }
  ]
]);
const nonempty=x=>typeof x==='string'&&x.trim().length>0&&x.length<=32768;
const tokens=x=>[...new Set(x.match(/\{[a-zA-Z][a-zA-Z0-9_]*\}/g)||[])].sort().join(',');
const digest=x=>createHash('sha256').update(x).digest('hex');
const fail=message=>{throw Error('Import inventory companion copy: '+message);};
/** This is the exact maintained Import listing-description normalization. */
export const cleanImportDealerDescription=text=>text.replaceAll('Бъглария','България').replaceAll('Клиентси','Клиентски').replaceAll('Кометар','Коментар').replaceAll('желатено','желателно').replaceAll('исинтиски','истински').replaceAll('шифоране','шофиране').replaceAll('обудхване','обдухване').replaceAll('вакум','вакуум').trim();
function binding(source,name){const rows=[...source.matchAll(new RegExp('^export\\s+const\\s+'+name+'(?:\\s*:[^=]+)?\\s*=\\s*','gm'))];if(rows.length!==1)fail('static '+name+' boundary changed');const start=rows[0].index+rows[0][0].length,parsed=readCatalogLiteral(source,start);return{start,end:parsed.end,value:readTypeScriptCatalog(source,name)};}
function append(source,name,rows){if(!Object.keys(rows).length)return source;const item=binding(source,name);if(source[item.end-1]!=='}')fail('object '+name+' boundary changed');const inside=source.slice(item.start+1,item.end-1),comma=inside.trim()&&!inside.trimEnd().endsWith(',')?',':'';const text=JSON.stringify(rows,null,'\t').slice(1,-1);return source.slice(0,item.end-1)+comma+text+'\n'+source.slice(item.end-1);}
/** Add only companion display keys required by the exact generated feed.
 * Existing catalogs, listing facts/IDs/URLs/prices/media and source descriptions
 * are retained. Unknown missing terms require separately reviewed translation.
 */
export function repairImportDealerInventoryCatalog({source,feed,listingSlugs,reviewedCopy={}}){
 if(typeof source!=='string'||Buffer.byteLength(source)>16*1024**2||!Array.isArray(feed?.listings)||!feed.listings.length||feed.listings.length>1000||!Array.isArray(listingSlugs)||listingSlugs.length!==feed.listings.length)fail('bounded exact feed and listing slugs required');
 if(!reviewedCopy||typeof reviewedCopy!=='object'||Array.isArray(reviewedCopy))fail('reviewed description map required');
 const beforeFeed=JSON.stringify(feed),copy=binding(source,'inventoryCopy').value,keys=binding(source,'inventorySourceKeys').value,newCopy=Object.create(null),newKeys=Object.create(null),added=[];
 for(const [key,pair]of Object.entries(copy))if(!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)||!nonempty(pair?.bg)||!nonempty(pair?.en)||tokens(pair.bg)!==tokens(pair.en))fail('retained typed catalog row invalid: '+key);
 for(const [text,key]of Object.entries(keys))if(typeof key!=='string'||!Object.hasOwn(copy,key))fail('retained source key invalid');
 const slugs=new Set();
 function requireTerm(text,{kind,raw,slug}){
  if(typeof text!=='string'||text.length>32768)fail('invalid listing '+kind);
  if(Object.hasOwn(keys,text)||Object.hasOwn(newKeys,text))return;
  let pair=kind==='description'?known.get(text):scalarTerms.get(kind+':'+text);
  if(!pair&&kind==='description'){
   const row=reviewedCopy[slug];
   if(row&&row.sourceDescription===raw&&nonempty(row.en?.description)&&nonempty(row.bg?.description)&&tokens(row.en.description)===tokens(raw)&&tokens(row.bg.description)===tokens(raw))pair={en:row.en.description,bg:row.bg.description};
  }
  if(!pair)fail('missing '+kind+' requires explicit reviewed EN/BG copy: '+JSON.stringify(text));
  const key='dealerStock_'+digest(text);if(Object.hasOwn(copy,key)||Object.hasOwn(newCopy,key))fail('generated catalog key collision');
  newCopy[key]={bg:pair.bg,en:pair.en};newKeys[text]=key;added.push({source:text,key,kind,bg:pair.bg,en:pair.en});
 }
 for(let index=0;index<feed.listings.length;index++){
  const listing=feed.listings[index],slug=listingSlugs[index];if(!nonempty(slug)||['__proto__','prototype','constructor'].includes(slug)||slugs.has(slug)||!nonempty(listing?.shortDescription)||!Array.isArray(listing.features)||listing.features.length>256||typeof listing.color!=='string')fail('invalid exact personalized listing');slugs.add(slug);
  requireTerm(cleanImportDealerDescription(listing.shortDescription),{kind:'description',raw:listing.shortDescription,slug});
  for(const text of listing.features)requireTerm(text,{kind:'feature',slug});requireTerm(listing.color,{kind:'color',slug});
 }
 const after=append(append(source,'inventoryCopy',newCopy),'inventorySourceKeys',newKeys);
 const afterCopy=readTypeScriptCatalog(after,'inventoryCopy'),afterKeys=readTypeScriptCatalog(after,'inventorySourceKeys');
 for(const [key,value]of Object.entries(copy))if(JSON.stringify(afterCopy[key])!==JSON.stringify(value))fail('retained copy changed');
 for(const [key,value]of Object.entries(keys))if(afterKeys[key]!==value)fail('retained source key changed');
 if(JSON.stringify(feed)!==beforeFeed)fail('listing facts changed');
 return{source:after,added,listingCount:feed.listings.length,listingFactsUnchanged:true,nativeApproval:false,hostedApproval:false};
}

/** The exact illustrative-stock disclosure used by maintained dealer facts.
 * Add only its faithful English editorial translation; unknown copy still fails
 * in contentText. Dated stock, preview wording and factual data are untouched. */
export function repairImportDealerDisclosureCatalog(source) {
  if (typeof source !== 'string') throw new Error('Import editorial source must be text');
  const marker = 'const generatedDealerEnglish =';
  const start = source.indexOf(marker);
  if (start < 0 || source.indexOf(marker, start + marker.length) >= 0)
    throw new Error('Exactly one generated Import editorial dictionary is required');
  const end = source.indexOf('\n};', start);
  if (end < 0) throw new Error('Import editorial dictionary boundary is missing');
  const block = source.slice(start, end);
  const anchor = "\t\t\t'Информация за автокъщата': 'Dealer information',";
  const addition = "\n\t\t\t\"Показаните демонстрационни автомобили са илюстративни и не представляват наличности на автокъщата. За действителните оферти и наличности се свържете директно с нея.\":\n\t\t\t\t\"The demo vehicles shown are illustrative and are not dealership stock. Contact the dealership directly for actual offers and availability.\",";
  if (block.includes(addition)) return {source, added: false};
  if (block.includes("Показаните демонстрационни автомобили са илюстративни и не представляват наличности на автокъщата. За действителните оферти и наличности се свържете директно с нея."))
    throw new Error('Conflicting illustrative-stock English translation');
  if (block.split(anchor).length !== 2)
    throw new Error('Import dealer information anchor must occur exactly once');
  const next = source.slice(0, start) + block.replace(anchor, anchor + addition) + source.slice(end);
  return {source: next, added: true};
}

