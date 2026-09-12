import fs from 'node:fs';
import path from 'node:path';
import {ROOT,json,writeJson,validateManifest,git} from './lib/workflow.mjs';

const supported=['auto-best','modern','import','carwow','rencar','autodeal','showroom','boxcar','motoria','nusavo'];
const read = file => fs.existsSync(file) ? json(file) : null;
export function indexDeployments(root=ROOT) {
  const previous=read(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'))||{schemaVersion:2,aliases:{},dealers:[]};
  const records=new Map(previous.dealers.map(d=>[d.slug,structuredClone(d)]));
  const oldIndex=read(path.join(root,'clients/index.json'));
  if(oldIndex?.schemaVersion===1) {
    previous.campaignCandidatesWithoutFolders ??= oldIndex.campaignCandidatesWithoutFolders||[];
    for(const entry of oldIndex.projects||[]) {
      if(entry.aliasOf){previous.aliases[entry.slug]??=entry.aliasOf;continue;}
      const record=records.get(entry.slug)||{slug:entry.slug,variants:[],delivery:{state:'unknown'}};
      record.id??=entry.leadId||null;record.legacyIndex??=entry;records.set(entry.slug,record);
    }
  }
  for(const entry of fs.readdirSync(path.join(root,'clients'),{withFileTypes:true}).filter(e=>e.isDirectory())) {
    if(previous.aliases?.[entry.name])continue;
    const slug=entry.name,dir=path.join(root,'clients',slug),prior=records.get(slug)||{},manifest=read(path.join(dir,'dealer.json'));
    if(manifest)validateManifest(manifest);
    const facts=read(path.join(dir,'business-facts.json'));
    const keys=supported.filter(v=>fs.existsSync(path.join(dir,v,'package.json')));
    const ordered=[...keys,...(prior.variants||[]).map(v=>v.key).filter(k=>!keys.includes(k))];
    const variants=ordered.map(key=>{
      const metadata=read(path.join(dir,key,'.client/project.json'))||{},old=prior.variants?.find(v=>v.key===key)||{},offered=manifest?.variants.find(v=>v.key===key);
      return {...old,key,localPresent:keys.includes(key),state:metadata.state||metadata.status||old.state||'unknown',entry:offered?.entry??old.entry??null,publicUrl:metadata.publicUrl||old.publicUrl||null,templateSource:metadata.templateSource||old.templateSource||null,qaRecorded:metadata.qa?['desktop','mobile','identity','contactPath'].every(k=>metadata.qa[k]===true):old.qaRecorded??null};
    });
    const evidence={source:{state:keys.length?'present':'research-only',commit:prior.canonicalSourceCommit||null},personalization:{state:'unknown'},build:{state:'unknown'},deployment:{state:'unknown'},browser:{state:'unknown'},ownerReview:{state:'unknown'},...prior.evidence};
    const record={...prior,slug,id:prior.id||manifest?.dealerId||null,name:facts?.name||facts?.business?.name||prior.name||slug,localPath:'clients/'+slug,localPresent:true,aliases:prior.aliases||[],variants,branchSources:prior.branchSources||[],repository:manifest?.repository||prior.repository||null,packagingVersion:manifest?.packaging.version||prior.packagingVersion||null,delivery:prior.delivery||{state:'unknown'},evidence};
    // A dated prior not-deployed label is retained as historical evidence, never asserted live by a scan.
    if(['not-deployed','research-only'].includes(record.delivery.state)){record.delivery={...record.delivery,legacyState:record.delivery.state,state:'unknown',note:record.delivery.note||'Historical source inventory; hosting has not been refreshed by indexing.'};}
    records.set(slug,record);
  }
  for(const d of records.values())if(!fs.existsSync(path.join(root,d.localPath||'clients/'+d.slug)))d.localPresent=false;
  return{...previous,schemaVersion:2,model:'One canonical dealer folder; one publishing repository and Vercel project; actual variants declared per dealer.',dealers:[...records.values()].sort((a,b)=>a.slug.localeCompare(b.slug))};
}
export function validateRegistry(registry,root=null) {
 const slugs=new Set(),repositories=new Map();
 for(const d of registry.dealers){if(slugs.has(d.slug))throw new Error('Duplicate dealer slug '+d.slug);slugs.add(d.slug);if(d.repository){if(repositories.has(d.repository))throw new Error('Repository reused by '+d.slug+' and '+repositories.get(d.repository));repositories.set(d.repository,d.slug);}
  const keys=d.variants.map(v=>v.key);if(new Set(keys).size!==keys.length)throw new Error('Duplicate variant '+d.slug);
  if(d.evidence?.ownerReview?.state==='passed'&&!d.evidence.ownerReview.reviewedBy)throw new Error('Owner review needs owner attribution: '+d.slug);
  if(root&&fs.existsSync(path.join(root,d.localPath,'dealer.json'))){const m=validateManifest(json(path.join(root,d.localPath,'dealer.json')));if(d.repository!==m.repository)throw new Error('Registry manifest identity drift: '+d.slug);for(const v of m.variants)if(!d.variants.some(x=>x.key===v.key&&x.entry===v.entry))throw new Error('Registry variant/entry drift: '+d.slug);}
 }
 for(const[alias,target]of Object.entries(registry.aliases||{}))if(alias===target||!slugs.has(target))throw new Error('Unresolved registry alias '+alias);
 return true;
}
export function registryViews(registry) {
 const esc=v=>String(v??'unknown').replaceAll('|','/').replaceAll('\n',' ');
 const lines=['# Dealer deployment inventory','','Generated from [DEPLOYMENT-INVENTORY.json](DEPLOYMENT-INVENTORY.json). Source, build, deployment, browser verification and owner review remain separate. This file is not a live Vercel audit.','','| Dealer | Source | Offered designs / routes | Deployment evidence | Browser / owner review |','| --- | --- | --- | --- | --- |'];
 for(const d of registry.dealers){const route=d.variants.map(v=>v.key+(v.entry?' '+v.entry:' (entry unrecorded)')).join(' / ')||'Research only';lines.push('| '+[esc(d.name),d.localPresent&&d.variants.every(v=>v.localPresent!==false)?'[Local source](../'+d.localPath+'/)':d.canonicalSourceRef==='main'?'[Source on main](https://github.com/darkapoparka/cars/tree/main/'+d.localPath+'/)':'Preserved source evidence',esc(route),d.delivery.url?'['+esc(d.delivery.state)+']('+d.delivery.url+')':esc(d.evidence?.deployment?.state),esc(d.evidence?.browser?.state)+' / '+esc(d.evidence?.ownerReview?.state)].join(' | ')+' |');}
 lines.push('','[Registry contract](REGISTRY.md) · [Owner review](MANUAL-REVIEW.md)','');
 const projects=registry.dealers.map(d=>({slug:d.slug,name:d.name,path:d.localPath,variants:d.variants.map(v=>v.key),sourceState:d.localPresent?'source-present':d.canonicalSourceRef==='main'?'source-on-main':'source-not-local',reviewState:d.evidence?.ownerReview?.state||'unknown',...(d.id?{leadId:d.id}:{})}));
 return{deployments:lines.join('\n'),index:{schemaVersion:2,source:'docs/DEPLOYMENT-INVENTORY.json',projects,campaignCandidatesWithoutFolders:registry.campaignCandidatesWithoutFolders||[]}};
}
function main(){
 if(process.argv.includes('--help')){console.log('Usage: node scripts/index-deployments.mjs [--write | --check]\nDefault: preview local indexing; write: preserve registry evidence and regenerate views; check: validate without mutation.');return;}
 const options=process.argv.slice(2);if(options.some(x=>!['--write','--check'].includes(x))||options.length>1)throw new Error('Use --write or --check.');
 const inventory=indexDeployments();validateRegistry(inventory,ROOT);
 const views=registryViews(inventory);
 if(options.includes('--check')){
  const saved=json(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'));validateRegistry(saved,ROOT);
  const actualIndex=json(path.join(ROOT,'clients/index.json'));if(JSON.stringify(actualIndex.projects)!==JSON.stringify(registryViews(saved).index.projects))throw new Error('Generated client index differs; run --write.');
  if(fs.readFileSync(path.join(ROOT,'docs/DEPLOYMENTS.md'),'utf8').replaceAll('\r\n','\n')!==registryViews(saved).deployments)throw new Error('Generated deployment list differs; run --write.');
 }else if(options.includes('--write')){
  writeJson(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'),inventory);
  fs.writeFileSync(path.join(ROOT,'docs/DEPLOYMENTS.md'),views.deployments);
  writeJson(path.join(ROOT,'clients/index.json'),views.index);
  fs.writeFileSync(path.join(ROOT,'docs/PROJECTS.md'),'# Cars projects\n\nGenerated project index: [deployment inventory](DEPLOYMENTS.md). Machine-readable view: [clients/index.json](../clients/index.json), derived from the [technical registry](DEPLOYMENT-INVENTORY.json).\n\nUse node scripts/index-deployments.mjs --write to refresh local presence. Prior branch/source recovery evidence remains in [LEAD-RECOVERY.md](LEAD-RECOVERY.md). Source presence is not build success, hosted verification or owner review.\n');
 }
 console.log(JSON.stringify({mode:options[0]||'preview',dealers:inventory.dealers.length,applications:inventory.dealers.reduce((n,d)=>n+d.variants.length,0),importTrios:inventory.dealers.filter(d=>d.variants.some(v=>v.key==='import')).map(d=>d.slug)}));
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}