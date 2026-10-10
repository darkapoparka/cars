import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ROOT, json, writeJson, git, sha256, filesAt} from './lib/workflow.mjs';
import {MANIFEST_PATH, FAMILIES, selectDealers, assertPinnedReleases, assertManualCi, assertMutationScope} from './build-uk-dealers.mjs';
import {runUpdateDealerTemplate} from './dealer-updates/update-dealer-template.mjs';
import {collectSource} from './package-dealer.mjs';
import {assertNativeAdoption} from './lib/native-localization.mjs';
import {baseNativeManifest, assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';

const REVIEW_ROOT = 'docs/qa/uk-refresh-latest-2026-10-10';
const RECEIPT = '.client/uk-source-creation.json';
const encode = value => JSON.stringify(value, null, 2) + '\n';
export function protectedInputFiles(client) {
  const names = ['business-facts.json','locale-config.json','stock.json'];
  for (const folder of ['assets','branding','dealer-brand','dealer-stock']) {
    if (!fs.existsSync(path.join(client,folder))) throw Error('Missing retained dealer asset directory: '+folder);
    names.push(...filesAt(path.join(client,folder)).map(name=>folder+'/'+name));
  }
  return names.sort().map(name=>({path:name,sha256:sha256(fs.readFileSync(path.join(client,name)))}));
}
export function assertPreservedInputs(before, candidate) {
  for (const file of before) if (sha256(fs.readFileSync(path.join(candidate,file.path)))!==file.sha256) {
    throw Error('Refresh changed protected business, stock, locale or branding input: '+file.path);
  }
}
export function validateRefreshReview(review, dealer, sourceTree, batch) {
  if (review?.schemaVersion!==1 || review.dealer!==dealer.slug || review.sourceTree!==sourceTree ||
      JSON.stringify(review.sourceReleases)!==JSON.stringify(batch.sourceReleases) ||
      !review.resolutions || typeof review.resolutions!=='object' || Array.isArray(review.resolutions)) {
    throw Error('Exact source tree and latest-release conflict review required for '+dealer.slug);
  }
}
async function checkSource(client, manifest) {
  const files=await collectSource(client,manifest);
  assertNativeAdoption(files,baseNativeManifest(manifest));
  assertAppVariant(files,manifest); assertExtendedVariantSources(files,manifest);
}
function commitSource(dealer, batch, beforeHead, area) {
  const prefix='clients/'+dealer.slug;
  if (git(ROOT,['rev-parse','HEAD'])!==beforeHead || git(ROOT,['diff','--cached','--name-only'])) throw Error('Source checkout/index changed before scoped commit.');
  git(ROOT,['add','--all','--sparse','--',prefix]);
  const changed=git(ROOT,['diff','--cached','--name-only','-z'],{encoding:null}).toString('utf8').split('\0').filter(Boolean);
  assertMutationScope(changed,dealer.slug);
  const identity={GIT_AUTHOR_NAME:'github-actions[bot]',GIT_COMMITTER_NAME:'github-actions[bot]',
    GIT_AUTHOR_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com',GIT_COMMITTER_EMAIL:'41898282+github-actions[bot]@users.noreply.github.com'};
  git(ROOT,['commit','-m','Refresh UK six-design templates for '+dealer.name],{env:identity});
  git(ROOT,['fetch','--filter=blob:none','--no-tags','origin','main']);
  const remote=git(ROOT,['rev-parse','origin/main']);
  if(remote!==beforeHead) {
    const guarded=[prefix,'scripts',MANIFEST_PATH,'templates.lock.json',REVIEW_ROOT,'.github/workflows/build-uk-dealers.yml'];
    if(git(ROOT,['merge-base','--is-ancestor',beforeHead,remote],{allowFailure:true})===null ||
       git(ROOT,['diff','--name-only',beforeHead,remote,'--',...guarded])) throw Error('Relevant source changed concurrently; refreshed commit retained without push.');
    git(ROOT,['rebase','origin/main'],{env:identity});
  }
  const commit=git(ROOT,['rev-parse','HEAD']);
  const record={schemaVersion:1,dealer:dealer.slug,commit,parent:remote,sourceReleases:batch.sourceReleases,paths:changed.length,pushed:false};
  writeJson(path.join(area,'commit.json'),record);
  git(ROOT,['push','origin','HEAD:refs/heads/main']);
  const observed=git(ROOT,['ls-remote','origin','refs/heads/main']).split(/\s+/)[0];
  if(observed!==commit)throw Error('Remote changed after source push; verify ancestry before continuing.');
  writeJson(path.join(area,'commit.json'),{...record,pushed:true}); return commit;
}
export async function refreshUkDealer(dealer, {apply=false}={}) {
  assertManualCi();
  const batch=json(path.join(ROOT,MANIFEST_PATH)),lock=json(path.join(ROOT,'templates.lock.json'));
  assertPinnedReleases(batch,lock);
  const prefix='clients/'+dealer.slug, client=path.join(ROOT,prefix);
  const beforeHead=git(ROOT,['rev-parse','HEAD']),sourceTree=git(ROOT,['rev-parse','HEAD:'+prefix]);
  const guarded=[prefix,'scripts',MANIFEST_PATH,'templates.lock.json',REVIEW_ROOT,'.github/workflows/build-uk-dealers.yml'];
  if(git(ROOT,['merge-base','--is-ancestor',process.env.GITHUB_SHA,beforeHead],{allowFailure:true})===null ||
     git(ROOT,['diff','--name-only',process.env.GITHUB_SHA,beforeHead,'--',...guarded])) throw Error('Refresh inputs changed after dispatch; re-review the exact current source.');
  const area=path.join(ROOT,'runtime/uk-refresh-reports',process.env.GITHUB_RUN_ID+'-'+process.env.GITHUB_RUN_ATTEMPT,dealer.slug);
  fs.mkdirSync(area,{recursive:true});
  const manifest=json(path.join(client,'dealer.json')),receipt=json(path.join(client,RECEIPT));
  if(manifest.slug!==dealer.slug || manifest.repository!==dealer.repository || manifest.cloudflare?.workerPrefix!==dealer.workerName ||
     manifest.shareIdentity?.publicOrigin!==dealer.publicOrigin || manifest.packaging?.version!=='5') throw Error('Existing UK publication identity differs.');
  if(git(ROOT,['status','--porcelain','--',prefix]))throw Error('Dealer source is not a clean committed checkout.');
  const protectedInputs=protectedInputFiles(client);
  const selected=FAMILIES.filter(key=>manifest.templateRevisions[key]!==batch.sourceReleases[key].revision);
  const snapshot={schemaVersion:1,dealer:dealer.slug,sourceCommit:beforeHead,sourceTree,sourceReleases:batch.sourceReleases,selected,protectedInputs};
  writeJson(path.join(area,'input.json'),snapshot);
  if(!selected.length){await checkSource(client,manifest);writeJson(path.join(area,'result.json'),{...snapshot,status:'already-current',hosted:false});return;}
  const args=['plan','--dealer-root',client,'--cars-root',ROOT,'--variants',selected.join(',')];
  if(apply){
    const reviewPath=path.join(ROOT,REVIEW_ROOT,'resolutions',dealer.slug+'.json');
    const reviewed=json(reviewPath);validateRefreshReview(reviewed,dealer,sourceTree,batch);
    args.push('--resolutions-file',reviewPath);
  }
  const plan=await runUpdateDealerTemplate(args);
  for(const name of ['review.json','run.json'])fs.copyFileSync(path.join(plan.runDirectory,name),path.join(area,name));
  writeJson(path.join(area,'result.json'),{...snapshot,status:plan.ready?'candidate-ready':'conflicts-require-review',summary:plan.summary,conflicts:plan.conflicts,hosted:false});
  console.log(JSON.stringify({dealer:dealer.slug,ready:plan.ready,summary:plan.summary,conflicts:plan.conflicts}));
  if(!apply)return;
  if(!plan.ready)throw Error('Reviewed resolution set did not resolve all conflicts.');
  assertPreservedInputs(protectedInputs,plan.candidateDirectory);
  const candidateManifest=json(path.join(plan.candidateDirectory,'dealer.json'));
  for(const key of FAMILIES)if(candidateManifest.templateRevisions[key]!==batch.sourceReleases[key].revision)throw Error('Candidate is not on the exact latest selection: '+key);
  await checkSource(plan.candidateDirectory,candidateManifest);
  const installed=await runUpdateDealerTemplate(['install','--run-dir',plan.runDirectory]);
  assertPreservedInputs(protectedInputs,client);
  await checkSource(client,json(path.join(client,'dealer.json')));
  writeJson(path.join(client,RECEIPT),{...receipt,workflowCommit:beforeHead,sourceReleases:batch.sourceReleases,
    sourceMaterialized:true,personalizationApplied:true,sourceSealsVerified:true,build:false,hosted:false,readyToPublish:false,
    refresh:{at:new Date().toISOString(),sourceTree,previousReceiptSha256:sha256(Buffer.from(encode(receipt))),
      previousSourceReleases:receipt.sourceReleases,reviewSha256:sha256(fs.readFileSync(path.join(area,'review.json'))),
      protectedInputsPreserved:true,runId:process.env.GITHUB_RUN_ID,selected}});
  writeJson(path.join(client,'.client/uk-latest-refresh.json'),{...snapshot,installed:true,sourceSealsVerified:true,protectedInputsPreserved:true,build:false,hosted:false});
  const commit=commitSource(dealer,batch,beforeHead,area);
  writeJson(path.join(area,'result.json'),{...snapshot,status:'refreshed-and-committed',commit,installed:true,build:false,hosted:false});
  console.log(JSON.stringify({dealer:dealer.slug,status:'refreshed-and-committed',commit}));
}
async function main(){
  const [mode,selection]=process.argv.slice(2);
  if(!['plan','apply'].includes(mode)||!selection)throw Error('Usage: refresh-uk-dealers.mjs plan|apply SLUG');
  const dealers=selectDealers(json(path.join(ROOT,MANIFEST_PATH)),selection);
  if(dealers.length!==1)throw Error('Use one isolated runner per dealer.');
  await refreshUkDealer(dealers[0],{apply:mode==='apply'});
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.stack);process.exitCode=1;});
