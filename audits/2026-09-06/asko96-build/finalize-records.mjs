import fs from 'node:fs/promises';import path from 'node:path';import {createHash} from 'node:crypto';
const out='audits/2026-09-06/asko96-build';const catalog=JSON.parse(await fs.readFile('catalog.json'));
const completed=JSON.parse(await fs.readFile(`${out}/refresh-complete.json`));const integrity=[];
for(const key of ['auto-best','modern','carwow']){
 const row=catalog.templates.find(t=>t.key===key);
 for(const prefix of ['templates']){
  const file=`${prefix}/${key}/.template/template.json`,meta=JSON.parse(await fs.readFile(file));
  const backup=`${out}/${prefix==='templates'?'master':'client'}-${key}-template-metadata-before.json`;
  await fs.writeFile(backup,JSON.stringify(meta,null,2),{flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e});
  meta.version=row.version;meta.refreshedAt=completed.completedAt;meta.refreshEvidence='J:/cars/audits/2026-09-06/asko96-build/refresh-complete.json';await fs.writeFile(file,JSON.stringify(meta,null,2)+'\n');
 }
 const plan=completed.plan.find(p=>p.key===key),mismatches=[];
 for(const change of plan.changes){const b=await fs.readFile(path.join(plan.destination,change.path)).catch(()=>null);const hash=b?createHash('sha256').update(b).digest('hex'):null;if(hash!==change.after)mismatches.push({path:change.path,expected:change.after,actual:hash});}
 integrity.push({key,version:row.version,refreshedFiles:plan.changes.length,mismatches});
}
await fs.writeFile(`${out}/refresh-integrity-final.json`,JSON.stringify(integrity,null,2));console.log(JSON.stringify(integrity));
const p='clients/asko-96/modern/.client/project.json',m=JSON.parse(await fs.readFile(p));Object.assign(m,{state:'local-review-ready',offeredHomes:[{id:'main',route:'/cars'}],previewUrl:'http://127.0.0.1:6612/cars',businessName:'АСКО 96',updatedAt:new Date().toISOString(),stockSnapshotDate:'2026-09-06',stockCount:16,changes:['Official logos, gold accent, Sofia contact/map/social destinations and localized copy','16 source-backed listings and 52 locally stored stock photographs','Actual ASKO96 showroom on the contact page; retained source layout, routes, navigation and generic decorative service artwork','Removed old supplier-directory demo stock dependencies from this independent dealer copy'],knownGaps:['Local review only; no public deployment or verified form delivery','Stock is a dated curated snapshot, not a live feed; dealer confirms availability and finance terms','Generic decorative vehicle/service artwork retained; internal filenames may retain provenance names','Source legal/guidance copy needs dealer review before publication','Official secondary logo includes its original 28-year medal','CRM unregistered; current Agency OS project inaccessible through connected account'],runtime:{project:'J:/cars/clients/asko-96/modern/apps/web',launcherPid:23820,port:6612,node:'22.23.2'}});
m.qa={desktop:true,mobile:true,identity:true,contactPath:true,widths:[390,1440],routes:'10 routes at each width, HTTP200, no broken visible images, horizontal overflow or browser errors',interactions:'Toyota search returns one car at both widths; detail/phone correct; browser Back retains query; mobile filters open and dismiss with Escape; menu opens and dismisses',validation:'Frozen pnpm install, Prisma client generation, web typecheck and final production build passed',artifacts:'J:/cars/audits/2026-09-06/results-asko-modern.json; asko96-build/modern-interactions.json; modern-interactions-desktop.json; modern-build-final.log'};await fs.writeFile(p,JSON.stringify(m,null,2)+'\n');
