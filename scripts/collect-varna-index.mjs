import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const dir=path.join(root,'leads/varna');
const read=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
const hash=s=>createHash('sha256').update(s).digest('hex');
const phone=s=>{let p=String(s||'').replace(/[^\d+]/g,'');if(/^0[1-9]\d{7,8}$/.test(p))p='+359'+p.slice(1);return /^\+[1-9]\d{6,14}$/.test(p)?p:null;};
const name=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const mobile=s=>{try{let u=new URL(s);return /^[a-z0-9_-]+\.mobile\.bg$/.test(u.hostname)&&u.hostname!=='www.mobile.bg'?u.hostname:null;}catch{return null;}};
const original=read('mobile-directory-2026-10-10.json');
const selection=read('selected-10.json');
const registry=JSON.parse(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8'));
const existing=(registry.dealers||[]).map(d=>({slug:d.slug,path:d.localPath||'clients/'+d.slug,name:d.name,phones:[],profiles:[]}));
function scan(v,k,out){if(typeof v==='string'){if(/phone|mobile|telephone|tel/i.test(k)){const p=phone(v.replace(/^tel:/,''));if(p)out.phones.push(p);}const p=mobile(v);if(p)out.profiles.push(p);}else if(v&&typeof v==='object')for(const [key,value]of Object.entries(v))scan(value,key,out);}
for(const client of existing){for(const f of ['business-facts.json','FACTS-AND-INVENTORY.json']){const p=path.join(root,client.path,f);if(fs.existsSync(p)&&fs.statSync(p).size<500000)scan(JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'')),'',client);}client.phones=[...new Set(client.phones)];client.profiles=[...new Set(client.profiles)];}
let rows=structuredClone(original.leads).map(l=>({...l,sources:[{kind:'mobile-directory',url:l.sourceUrl,profileUrl:l.profileUrl,observedAt:l.observedAt}],googleObservations:[]}));
for(const lead of selection.leads)if(!rows.some(l=>mobile(l.profileUrl)===mobile(lead.profileUrl)))rows.push({...lead,sources:[{kind:'direct-dealer-profile',url:lead.profileUrl,observedAt:lead.observedAt}],googleObservations:[]});
const google=[],excludedGoogle=[];
const dealerCategory=s=>/Автокъща|Автооказион|dealer|Търговец на (?:употребявани автомобили|автомобили|Audi|Volkswagen)|Брокер на автомобили/i.test(s||'');
for(const file of ['google-initial-2026-10-10.json','google-browser-2026-10-10.json'])if(fs.existsSync(path.join(dir,file))){const doc=read(file);for(const item of doc.observations||doc.businesses||[])google.push({...item,captureFile:file,queryUrl:doc.queryUrl||doc.sourceUrl,observedAt:doc.observedAt});}
for(const item of google){const categoryLine=(item.visibleText||'').split('\n').find(s=>s.includes(' · ')&&!/^(Open|Closed)/.test(s));const parts=categoryLine?.split(' · ').filter(s=>!/[\uE000-\uF8FF]/.test(s))||[];item.category=parts[0]||null;item.address||=parts.slice(1).join(' · ')||null;const phones=[...new Set([item.phone,...(item.publicPhones||[])].map(phone).filter(Boolean))];const exact=rows.filter(l=>(phones.length&&l.phones?.some(p=>phones.includes(p.e164)))||name(l.name)===name(item.name));if(exact.length===1){exact[0].googleObservations.push(item);continue;}
 if(!exact.length&&((item.category&&!dealerCategory(item.category))||(!item.category&&!/авто|кар|мотор|auto|car|porsche|odess|odise|kapitol|капитол|спринт|кат/i.test(item.name)))){excludedGoogle.push({...item,reason:item.category?'non-dealership-result-category':'unclear-non-automotive-result'});continue;}
 if(/с\.\s*Баново|Banovo|Аксаково|Aksakovo|с\.\s*Тополи|с\.\s*Звездица|с\.\s*Казашко|Игнатиево/i.test(item.address||'')){excludedGoogle.push({...item,reason:'outside-Varna-city'});continue;}
 const sameGoogle=rows.find(l=>l.googleOnly&&name(l.name)===name(item.name));if(sameGoogle){sameGoogle.googleObservations.push(item);continue;}
 rows.push({id:'bg-varna-google-'+hash(item.name).slice(0,12),name:item.name,country:'BG',city:'Varna',address:item.address||null,phones:phones.map(e164=>({display:e164,e164})),profileUrl:item.verifiedProfileUrl||null,qualification:'needs-city-and-business-type-review',website:{url:item.website||null,status:item.website?'observed':'not-researched'},outreachApproved:false,googleOnly:true,potentialDirectoryMatches:exact.map(l=>l.id),sources:[{kind:'google-maps',url:item.googleMapsUrl||item.queryUrl,observedAt:item.observedAt}],googleObservations:[item]});}
for(const row of rows){const published=row.phones?.map(p=>p.e164)||[];const matches=existing.filter(c=>(mobile(row.profileUrl)&&c.profiles.includes(mobile(row.profileUrl)))||c.phones.some(p=>published.includes(p))||name(c.name)===name(row.name));row.existingClientPaths=[...new Set([...(row.existingClientPaths||[]),...matches.map(c=>c.path)])];row.existingMatchEvidence=matches.map(c=>({path:c.path,phone:c.phones.some(p=>published.includes(p)),profile:!!mobile(row.profileUrl)&&c.profiles.includes(mobile(row.profileUrl)),exactNormalizedName:name(c.name)===name(row.name)}));const selected=selection.leads.find(l=>l.id===row.id||mobile(l.profileUrl)&&mobile(l.profileUrl)===mobile(row.profileUrl));row.batch=selected?'varna-10-2026-10-10':null;row.selectedSlug=selected?.slug||null;row.lastQualifiedAt=null;}
rows.sort((a,b)=>a.name.localeCompare(b.name,'bg'));
const report={schemaVersion:1,market:'Bulgaria',city:'Varna',assembledAt:new Date().toISOString(),coverage:{mobileDirectory:original.coverage,observedMobileProfiles:original.leads.length,googleCapturedObservations:google.length,consolidatedRecords:rows.length,excludedGoogleObservations:excludedGoogle.length,existingClientMatches:rows.filter(l=>l.existingClientPaths.length).length,selected:10,claim:'Complete saved Mobile.bg city-filtered directory observation plus the retained Google result captures and direct dealer additions. This is not proof of every physical Varna dealership; Google-only city/type and websites remain individually qualified.'},privateContactHistory:'not-read; unknown',excludedGoogle,leads:rows};
fs.writeFileSync(path.join(dir,'all-leads.json'),JSON.stringify(report,null,2)+'\n');
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const columns=['name','phone','address','profile','google','existingClients','selectedSlug','qualification'];
const lines=rows.map(l=>[l.name,l.phones?.map(p=>p.e164).join(' | '),l.address,l.profileUrl,l.googleObservations?.find(g=>g.googleMapsUrl)?.googleMapsUrl||'',l.existingClientPaths.join(' | '),l.selectedSlug,l.qualification].map(csv).join(','));
fs.writeFileSync(path.join(dir,'all-leads.csv'),'\uFEFF'+[columns.map(csv).join(','),...lines].join('\r\n')+'\r\n');
const conflicts=selection.leads.map(l=>({slug:l.slug,existing:rows.find(r=>r.selectedSlug===l.slug)?.existingClientPaths||[]})).filter(l=>l.existing.length);
console.log(JSON.stringify({records:rows.length,mobileProfiles:original.leads.length,googleObservations:google.length,existingClientMatches:report.coverage.existingClientMatches,selectionConflicts:conflicts}));
if(conflicts.length)process.exitCode=2;