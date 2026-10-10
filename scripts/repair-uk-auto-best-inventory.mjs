import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT,json,writeJson,inside,git,sha256} from './lib/workflow.mjs';
import {MANIFEST_PATH,FAMILIES,assertManualCi,assertPinnedReleases,inspectBrief,selectDealers} from './build-uk-dealers.mjs';
import {collectSource} from './package-dealer.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {repairAutoBestUkInventoryContract,UK_AUTO_BEST_INVENTORY_PATHS} from './lib/client-refresh-uk-auto-best.mjs';
import {baseNativeManifest,assertAppVariant} from './publishing/app-variant.mjs';
import {ADOPTION_FILE,assertNativeAdoption,sealNativeAdoption} from './lib/native-localization.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';

export const REPAIR_DEALER='stockport-broadbent-car-and-servicing';
export const REPAIR_SOURCES=Object.freeze({
 'stockport-broadbent-car-and-servicing':'bff7cfd4889a418d32851ce248e08ae2bba2dd2c',
 'batley-as-motor-group':'4631f7182ca575faec140f00962542fe42e2eb9d'
});
export const REPAIR_ID='gb-auto-best-inventory-contract-v1';
const SOURCE_RECEIPT='.client/uk-source-creation.json';
const SELF=fileURLToPath(import.meta.url),emit=value=>console.log(JSON.stringify(value));
const snapshot=files=>[...files].map(([name,bytes])=>({path:name,sha256:sha256(bytes)})).sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);
const digest=rows=>sha256(JSON.stringify(rows));
const familyState=rows=>Object.fromEntries(FAMILIES.map(key=>{const files=rows.filter(row=>row.path.startsWith(key+'/'));return [key,{files:files.length,sha256:digest(files)}];}));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function changedRows(before,after){
 const left=new Map(before.map(row=>[row.path,row.sha256])),right=new Map(after.map(row=>[row.path,row.sha256]));
 return [...new Set([...left.keys(),...right.keys()])].sort().filter(name=>left.get(name)!==right.get(name)).map(name=>({path:name,before:left.get(name)??null,after:right.get(name)??null}));
}
function assertSeals(files,manifest){
 assertNativeAdoption(files,baseNativeManifest(manifest));assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);
}
function writeSource(client,name,bytes){
 const file=inside(client,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);
}
function assertRepairChanges(changes){
 const allowed=new Set(UK_AUTO_BEST_INVENTORY_PATHS.map(name=>'auto-best/'+name));allowed.add(ADOPTION_FILE);
 if(!changes.length||changes.some(row=>!allowed.has(row.path)||row.after===null)||!changes.some(row=>row.path===ADOPTION_FILE))throw Error('Repair changed source beyond the reviewed Auto Best inventory contract and native adoption receipt.');
}
function commitSource({root,base,dealer,batch,paths,runtime}){
 if(git(root,['rev-parse','HEAD'])!==base||git(root,['diff','--cached','--name-only']))throw Error('Canonical source/index changed during repair.');
 const prefix='clients/'+dealer.slug+'/',allowed=paths.map(name=>prefix+name).sort();
 const actual=git(root,['diff','--name-only','-z','--',prefix],{encoding:null}).toString('utf8').split('\0').filter(Boolean).sort();
 if(!same(actual,allowed))throw Error('Actual tracked source diff differs from reviewed repair paths.');
 git(root,['diff','--check','--',...allowed]);
 git(root,['--literal-pathspecs','add','--sparse','--force','--pathspec-from-file=-','--pathspec-file-nul'],{input:Buffer.from(allowed.join('\0')+'\0')});
 const staged=git(root,['diff','--cached','--name-only','-z'],{encoding:null}).toString('utf8').split('\0').filter(Boolean).sort();
 if(!same(staged,allowed))throw Error('Unexpected staged changes; no repair commit was made.');
 const bot={GIT_AUTHOR_NAME:'github-actions[bot]',GIT_AUTHOR_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com',GIT_COMMITTER_NAME:'github-actions[bot]',GIT_COMMITTER_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com'};
 git(root,['commit','-m','Restore Auto Best inventory contract for '+dealer.slug],{env:bot});
 git(root,['fetch','--filter=blob:none','--no-tags','origin','main']);
 const remote=git(root,['rev-parse','refs/remotes/origin/main']);
 if(remote!==base){
  const guarded=[prefix,'scripts','.github/workflows/repair-uk-auto-best-inventory.yml',MANIFEST_PATH,'templates.lock.json','catalog.json','workspace.json','docs/DEPLOYMENT-INVENTORY.json',batch.selectionEvidence,dealer.brief];
  if(git(root,['merge-base','--is-ancestor',base,remote],{allowFailure:true})===null||git(root,['diff','--name-only',base,remote,'--',...guarded]))throw Error('Cars main changed relevant repair inputs; candidate retained without pushing.');
  git(root,['rebase','refs/remotes/origin/main'],{env:bot});
 }
 const commit=git(root,['rev-parse','HEAD']);
 const committed=git(root,['diff','--name-only','HEAD^','HEAD','-z'],{encoding:null}).toString('utf8').split('\0').filter(Boolean).sort();
 if(!same(committed,allowed))throw Error('Committed repair has unexpected paths.');
 if(git(root,['ls-remote','--exit-code','origin','refs/heads/main']).split(/\s+/)[0]!==remote)throw Error('Cars main advanced again; repair retained without force pushing.');
 writeJson(path.join(runtime,'commit.json'),{schemaVersion:1,dealer:dealer.slug,commit,parent:remote,workflowCommit:base,paths:allowed,pushed:false});
 git(root,['push','origin','HEAD:refs/heads/main']);
 if(git(root,['ls-remote','--exit-code','origin','refs/heads/main']).split(/\s+/)[0]!==commit)throw Error('Could not verify repaired canonical source at Cars main.');
 const result={...json(path.join(runtime,'commit.json')),pushed:true};writeJson(path.join(runtime,'commit.json'),result);return result;
}
export async function repairSource(root=ROOT,slug=REPAIR_DEALER){
 assertManualCi();
 const REPAIR_SOURCE=REPAIR_SOURCES[slug];
 if(!REPAIR_SOURCE)throw Error('This bounded repair is only for the two inspected existing UK sources.');
 const base=git(root,['rev-parse','HEAD']);
 if(base!==process.env.GITHUB_SHA||git(root,['diff','--cached','--name-only']))throw Error('Repair requires exact manual dispatch source and an empty index.');
 const runtime=inside(root,'runtime/uk-auto-best-inventory-repair/'+process.env.GITHUB_RUN_ID+'-'+process.env.GITHUB_RUN_ATTEMPT);fs.mkdirSync(runtime,{recursive:true});
 const prefix='clients/'+slug,client=inside(root,prefix,{mustExist:true});
 try{
  const batch=json(path.join(root,MANIFEST_PATH)),dealer=selectDealers(batch,slug)[0],lock=json(path.join(root,'templates.lock.json'));
  assertPinnedReleases(batch,lock);
  if(git(root,['merge-base','--is-ancestor',REPAIR_SOURCE,base],{allowFailure:true})===null||git(root,['diff','--name-only',REPAIR_SOURCE,base,'--',prefix])||git(root,['diff','--name-only','--',prefix]))throw Error('The inspected original UK dealer source changed; review a fresh repair instead.');
  const brief=inspectBrief(root,dealer),receiptFile=inside(client,SOURCE_RECEIPT,{mustExist:true}),prior=json(receiptFile),manifest=json(inside(client,'dealer.json',{mustExist:true}));
  if(prior.dealer!==slug||prior.inputPackDigest!==brief.snapshot.digest||!same(prior.sourceReleases,batch.sourceReleases)||prior.sourceSealsVerified!==true||!same((prior.repairs??[]).map(row=>row.id),slug===REPAIR_DEALER?['gb-modern-unpublished-transmission-v1']:[])||prior.build!==false||prior.hosted!==false||prior.readyToPublish!==false)throw Error('Original source creation receipt differs from the reviewed never-deployed candidate.');
  const profile=loadDealerProfile(client,slug);
  if(!same(profile.listings.map(row=>row.id),brief.profile.listings.map(row=>row.id)))throw Error('The factual stock identity/order changed from the verified brief.');
  emit({phase:'verify-original-six-source-seals',dealer:slug,sourceCommit:REPAIR_SOURCE,workflowCommit:base});
  let files=await collectSource(client,manifest);assertSeals(files,manifest);
  const before=snapshot(files),familiesBefore=familyState(before),nativeBefore=sha256(files.get(ADOPTION_FILE));
  const autoBest=new Map([...files].filter(([name])=>name.startsWith('auto-best/')).map(([name,bytes])=>[name.slice(10),bytes]));files.clear();files=null;
  const paths=repairAutoBestUkInventoryContract(autoBest,profile);
  if(!Array.isArray(paths)||!paths.length||new Set(paths).size!==paths.length||paths.some(name=>!UK_AUTO_BEST_INVENTORY_PATHS.includes(name)||!autoBest.has(name)))throw Error('Auto Best repair did not return the exact reviewed changed paths.');
  for(const name of paths)writeSource(client,'auto-best/'+name,autoBest.get(name));autoBest.clear();
  files=await collectSource(client,manifest);
  const beforeReseal=snapshot(files),familiesPatched=familyState(beforeReseal);
  for(const key of FAMILIES.filter(key=>key!=='auto-best'))if(!same(familiesBefore[key],familiesPatched[key]))throw Error('An unaffected dealer family changed: '+key);
  const expectedAutoBest=paths.map(name=>'auto-best/'+name).sort();
  if(!same(changedRows(before,beforeReseal).map(row=>row.path),expectedAutoBest))throw Error('Filesystem changes differ from the atomic Auto Best repair result.');
  sealNativeAdoption(files,baseNativeManifest(manifest),lock.templates);assertSeals(files,manifest);
  const after=snapshot(files),changes=changedRows(before,after);assertRepairChanges(changes);
  writeSource(client,ADOPTION_FILE,files.get(ADOPTION_FILE));
  const familiesAfter=familyState(after),nativeAfter=sha256(files.get(ADOPTION_FILE));files.clear();files=null;
  const repair={id:REPAIR_ID,at:new Date().toISOString(),workflowCommit:base,previousSourceCommit:REPAIR_SOURCE,
   reason:'Restore the native inventory formatting API required by stock cards and detail pages while preserving every factual stock row.',
   contract:'Auto Best approved inventory public exports',
   changedFiles:changes,sourceBefore:{files:before.length,sha256:digest(before)},sourceAfter:{files:after.length,sha256:digest(after)},
   familiesBefore,familiesAfter,nativeAdoptionBefore:nativeBefore,nativeAdoptionAfter:nativeAfter,
   verification:{originalSixSourceSeals:true,repairedSixSourceSeals:true,otherFiveFamiliesByteIdentical:true,factsAndSourcePinsUnchanged:true},
   build:false,hosted:false,dealerQa:false,readyToPublish:false};
  writeJson(receiptFile,{...prior,repairs:[...(prior.repairs??[]),repair]});
  files=await collectSource(client,manifest);assertSeals(files,manifest);
  if(!same(snapshot(files),after))throw Error('Source changed after repair receipt writeback.');files.clear();files=null;
  if(inspectBrief(root,dealer).snapshot.digest!==brief.snapshot.digest)throw Error('Facts changed during repair.');
  writeJson(path.join(runtime,'source-repair.json'),{schemaVersion:1,dealer:slug,...repair});
  const commit=commitSource({root,base,dealer,batch,paths:[...changes.map(row=>row.path),SOURCE_RECEIPT],runtime});
  const result={schemaVersion:1,dealer:slug,status:'canonical-source-repaired',sourceCommit:commit.commit,repair:REPAIR_ID,
   sourceSealsVerified:true,otherFiveFamiliesByteIdentical:true,pushed:true,build:false,hosted:false,dealerQa:false,readyToPublish:false};
  writeJson(path.join(runtime,'result.json'),result);return result;
 }catch(error){
  writeJson(path.join(runtime,'failure.json'),{schemaVersion:1,dealer:slug,error:error.message,workflowCommit:base,at:new Date().toISOString(),readyToPublish:false});
  const patch=git(root,['diff','--binary',base,'--',prefix],{allowFailure:true});if(patch)fs.writeFileSync(path.join(runtime,'candidate.patch'),patch+'\n');
  throw error;
 }
}
if(process.argv[1]&&path.resolve(process.argv[1])===SELF){try{if(process.argv.length!==3)throw Error('Usage: repair-uk-auto-best-inventory.mjs stockport-broadbent-car-and-servicing|batley-as-motor-group');emit(await repairSource(ROOT,process.argv[2]));}catch(error){console.error(error.message);process.exitCode=1;}}