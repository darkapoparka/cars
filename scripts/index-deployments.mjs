import { isEntrypoint } from './lib/cli-entrypoint.mjs';
import fs from 'node:fs';
import { assertIndependentCheckout } from './lib/dealer-source.mjs';
import path from 'node:path';
import { clientSourceGuide } from './lib/client-source-guide.mjs';
import {ROOT,json,writeJson,validateManifest,git} from './lib/workflow.mjs';
import {listDealerPacks} from './lib/dealer-pack-index.mjs';

const supported=['auto-best','modern','import','carwow','app','mobile','karento-best','rencar','autodeal','showroom','boxcar','motoria','nusavo'];
const read = file => fs.existsSync(file) ? json(file) : null;
export function validateIndexedManifest(manifest,record){
 const legacy=record?.publishingException;
 const allowed=record?.delivery?.gitIntegration==='unlinked-cli'&&record.canonicalSourceRef==='main'&&legacy?.canonicalSourceRepository==='darkapoparka/cars'&&legacy.canonicalSourceRef==='main'&&legacy.legacyManifestRepository===manifest.repository&&legacy.legacyManifestRef===manifest.defaultBranch;
 return validateManifest(manifest,{allowLegacyPublishingReference:allowed,allowDealerPackSource:record?.sourceFormat==='dealer-pack'});
}
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
    if(prior.sourceOwnership==='independent-repository') { assertIndependentCheckout(root, prior, dir); records.set(slug, {...prior, localPresent:true}); continue; }
    if(fs.existsSync(path.join(dir,'.git')) || manifest?.sourceOwnership==='independent-repository') throw new Error('Register independent source ownership before indexing: '+slug);
    if(manifest)validateIndexedManifest(manifest,prior);
    const facts=read(path.join(dir,'business-facts.json'));
    const keys=supported.filter(v=>{
      const version=manifest?.packaging?.version;
      if(v==='app'&&!['3','5'].includes(version))return false;
      if(['mobile','karento-best'].includes(v)&&version!=='5')return false;
      return fs.existsSync(path.join(dir,v,'package.json'));
    });
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
  for(const d of records.values())if(d.sourceOwnership!=='independent-repository'&&!fs.existsSync(path.join(root,d.localPath||'clients/'+d.slug)))d.localPresent=false;
  return{...previous,schemaVersion:2,model:'One canonical dealer folder; one publishing repository and Vercel project; actual variants declared per dealer.',dealers:[...records.values()].sort((a,b)=>a.slug.localeCompare(b.slug))};
}
export function validateRegistry(registry,root=null,{preserveSourceRecords=[],onPreservedSourceWarning=()=>{}}={}) {
 const preserved=new Map(preserveSourceRecords.map(row=>[row.slug,row]));
 const slugs=new Set(),repositories=new Map();
 for(const d of registry.dealers){if(slugs.has(d.slug))throw new Error('Duplicate dealer slug '+d.slug);slugs.add(d.slug);
  const pack=d.sourceFormat==='dealer-pack';
  if(pack){
   if(d.repository!=='darkapoparka/cars'||d.canonicalSourceRepository!==d.repository||d.sourcePath!=='dealers/'+d.slug||d.localPath!==d.sourcePath||!/^[a-f0-9]{40}$/.test(d.canonicalSourceCommit||'')||d.canonicalSourceRef!==d.canonicalSourceCommit||!/^[a-f0-9]{40}$/.test(d.canonicalSourceTree||'')||d.evidence?.source?.commit!==d.canonicalSourceCommit||d.evidence?.source?.path!==d.sourcePath||d.evidence?.source?.remoteVerified!==true||!/^[a-f0-9]{64}$/.test(d.newPackDeployment?.receiptSha256||'')||d.newPackDeployment?.queueBranch!=='cars-deploy-queue')throw new Error('Dealer pack registry needs exact published source and queue receipt: '+d.slug);
   validateManifest({schemaVersion:1,slug:d.slug,repository:d.repository,defaultBranch:'main',sourceFormat:'dealer-pack',sourcePath:d.sourcePath,variants:d.variants,packaging:{version:d.packagingVersion}},{allowDealerPackSource:true});
  }
  if(d.repository){const previous=repositories.get(d.repository)||[];if(previous.length&&!(pack&&previous.every(row=>row.sourceFormat==='dealer-pack')))throw new Error('Repository reused by '+d.slug+' and '+previous[0].slug);previous.push(d);repositories.set(d.repository,previous);}
  const keys=d.variants.map(v=>v.key);if(new Set(keys).size!==keys.length)throw new Error('Duplicate variant '+d.slug);
  if(d.evidence?.ownerReview?.state==='passed'&&!d.evidence.ownerReview.reviewedBy)throw new Error('Owner review needs owner attribution: '+d.slug);
  if(d.sourceOwnership==='independent-repository'){if(d.localPath!==null||d.canonicalSourceRepository!==d.repository)throw new Error('Independent source cannot also be Cars-owned: '+d.slug);
   try{validateManifest({schemaVersion:1,slug:d.slug,repository:d.repository,defaultBranch:'main',variants:d.variants,packaging:{version:d.packagingVersion||'1'}});}catch(error){
    // Receipt integration must not rewrite old dealer records to repair stale
    // source-version labels. Only an exactly unchanged prior row may retain
    // that prior mismatch; identity, duplicate and alias checks still apply.
    if(JSON.stringify(preserved.get(d.slug))!==JSON.stringify(d))throw error;
    onPreservedSourceWarning({slug:d.slug,reason:error.message,recordUnchanged:true});
   }
  }
  // Published pack records describe their receipt commit. Current research may
  // already differ, so views/checks never substitute today's pack manifest.
  if(root&&!pack&&d.sourceOwnership!=='independent-repository'&&fs.existsSync(path.join(root,d.localPath,'dealer.json'))){const m=validateIndexedManifest(json(path.join(root,d.localPath,'dealer.json')),d);if(d.repository!==m.repository)throw new Error('Registry manifest identity drift: '+d.slug);for(const v of m.variants)if(!d.variants.some(x=>x.key===v.key&&x.entry===v.entry))throw new Error('Registry variant/entry drift: '+d.slug);}
 }
 for(const[alias,target]of Object.entries(registry.aliases||{}))if(alias===target||!slugs.has(target))throw new Error('Unresolved registry alias '+alias);
 return true;
}
export function registryViews(registry) {
 const esc=v=>String(v??'unknown').replaceAll('|','/').replaceAll('\n',' ');
 const lines=['# Dealer deployment inventory','','Generated from [DEPLOYMENT-INVENTORY.json](DEPLOYMENT-INVENTORY.json). Source, build, deployment, browser verification and owner review remain separate. This file is not a live Vercel audit.','','| Dealer | Source | Offered designs / routes | Deployment evidence | Browser / owner review |','| --- | --- | --- | --- | --- |'];
 for(const d of registry.dealers){const route=d.variants.map(v=>v.key+(v.entry?' '+v.entry:' (entry unrecorded)')).join(' / ')||'Research only';const source=d.sourceFormat==='dealer-pack'?'[Published pack](https://github.com/'+d.canonicalSourceRepository+'/tree/'+d.canonicalSourceCommit+'/'+d.sourcePath+'/)':d.sourceOwnership==='independent-repository'?(d.evidence?.source?.remoteVerified?'[Independent source](https://github.com/'+d.repository+'/tree/main/)':'Independent source — GitHub publication pending'):d.localPresent&&d.variants.every(v=>v.localPresent!==false)?'[Local source](../'+d.localPath+'/)':d.canonicalSourceRef==='main'?'[Source on main](https://github.com/darkapoparka/cars/tree/main/'+d.localPath+'/)':'Preserved source evidence';lines.push('| '+[esc(d.name),source,esc(route),d.delivery.url?'['+esc(d.delivery.state)+']('+d.delivery.url+')':esc(d.evidence?.deployment?.state),esc(d.evidence?.browser?.state)+' / '+esc(d.evidence?.ownerReview?.state)].join(' | ')+' |');}
 lines.push('','[Registry contract](REGISTRY.md) · [Owner review](MANUAL-REVIEW.md)','');
 const projects=registry.dealers.map(d=>({slug:d.slug,name:d.name,path:d.sourceOwnership==='independent-repository'?d.checkoutPath:d.localPath,variants:d.variants.map(v=>v.key),sourceState:d.sourceOwnership==='independent-repository'?'independent-source':d.localPresent&&d.variants.every(v=>v.localPresent!==false)?'source-present':d.canonicalSourceRef==='main'?'source-on-main':'source-not-local',reviewState:d.evidence?.ownerReview?.state||'unknown',...(d.id?{leadId:d.id}:{}),...(d.sourceFormat==='dealer-pack'?{sourceFormat:'dealer-pack',sourceRepository:d.canonicalSourceRepository,sourceCommit:d.canonicalSourceCommit,sourcePath:d.sourcePath}:{})}));
 return{clientGuide:clientSourceGuide(registry),deployments:lines.join('\n'),index:{schemaVersion:2,source:'docs/DEPLOYMENT-INVENTORY.json',projects,campaignCandidatesWithoutFolders:registry.campaignCandidatesWithoutFolders||[]}};
}
export function writeRegistryViews(root=ROOT,options={}) {
 const registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'));
 validateRegistry(registry,null,options);
 const views=registryViews(registry);
 fs.writeFileSync(path.join(root,'docs/DEPLOYMENTS.md'),views.deployments);
 fs.writeFileSync(path.join(root,'clients/README.md'),views.clientGuide);
 writeJson(path.join(root,'clients/index.json'),views.index);
 return registry;
}
function main(){
 if(process.argv.length===3&&process.argv[2]==='--packs'){console.log(JSON.stringify({schemaVersion:1,sourceFormat:'dealer-pack',projects:listDealerPacks(ROOT),providerWrites:false},null,2));return;}
 if(process.argv.includes('--help')){console.log('Usage: node scripts/index-deployments.mjs [--write | --check | --views-only | --packs]\nDefault: preview local indexing; write: preserve registry evidence and regenerate views; check: validate without mutation; views-only: regenerate views from saved registry without scanning potentially stale dealer files; packs: list compact source inputs without claiming deployments.');return;}
 const options=process.argv.slice(2);if(options.some(x=>!['--write','--check','--views-only'].includes(x))||options.length>1)throw new Error('Use --write, --check or --views-only.');
 if(options.includes('--views-only')){const registry=writeRegistryViews();console.log(JSON.stringify({mode:'--views-only',dealers:registry.dealers.length,source:'saved-registry',dealerFilesScanned:false}));return;}
 const inventory=indexDeployments();validateRegistry(inventory,ROOT);
 const views=registryViews(inventory);
 if(options.includes('--check')){
  const saved=json(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'));validateRegistry(saved,ROOT);
  if(fs.readFileSync(path.join(ROOT,'clients/README.md'),'utf8').replaceAll('\r\n','\n')!==registryViews(saved).clientGuide)throw new Error('Client source guide differs; run --views-only.');
  const actualIndex=json(path.join(ROOT,'clients/index.json'));if(JSON.stringify(actualIndex.projects)!==JSON.stringify(registryViews(saved).index.projects))throw new Error('Generated client index differs; run --write.');
  if(fs.readFileSync(path.join(ROOT,'docs/DEPLOYMENTS.md'),'utf8').replaceAll('\r\n','\n')!==registryViews(saved).deployments)throw new Error('Generated deployment list differs; run --write.');
 }else if(options.includes('--write')){
  writeJson(path.join(ROOT,'docs/DEPLOYMENT-INVENTORY.json'),inventory);
  fs.writeFileSync(path.join(ROOT,'docs/DEPLOYMENTS.md'),views.deployments);
  fs.writeFileSync(path.join(ROOT,'clients/README.md'),views.clientGuide);
  writeJson(path.join(ROOT,'clients/index.json'),views.index);
  fs.writeFileSync(path.join(ROOT,'docs/PROJECTS.md'),'# Cars projects\n\nStart with [dealer folders, repositories and public sites](../clients/README.md). Full generated project index: [deployment inventory](DEPLOYMENTS.md). Machine-readable view: [clients/index.json](../clients/index.json), derived from the [technical registry](DEPLOYMENT-INVENTORY.json).\n\nUse node scripts/index-deployments.mjs --write to refresh local presence. Prior branch/source recovery evidence remains in [LEAD-RECOVERY.md](LEAD-RECOVERY.md). Source presence is not build success, hosted verification or owner review.\n');
 }
 console.log(JSON.stringify({mode:options[0]||'preview',dealers:inventory.dealers.length,applications:inventory.dealers.reduce((n,d)=>n+d.variants.length,0),importTrios:inventory.dealers.filter(d=>d.variants.some(v=>v.key==='import')).map(d=>d.slug)}));
}
if(isEntrypoint(import.meta.url)){try{main();}catch(e){console.error(e.message);process.exitCode=1;}}
