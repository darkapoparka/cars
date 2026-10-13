/** Compose reviewed compiled applications through the existing single-Worker provider.
 * Proposal is read-only. This command never generates dealer source, builds or deploys.
 *
 * Input JSON: {schemaVersion:1, client, repository, sourceRepository, reviewed,
 * reviewedAt, publicOrigin, workerName, variants:[six key/base/entry rows],
 * inputs:{[familyOrRouter]:{directory, artifactDigest, compiledDigest}}}.
 * Directories are absolute or relative to this JSON file; all digests are SHA-256.
 */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {ROOT,inside,json,sha256} from './lib/workflow.mjs';
import {assertSixDesignSelection,SIX_DESIGN_KEYS} from './lib/six-design-release.mjs';
import {assertIndependentCheckout} from './lib/dealer-source.mjs';
import * as provider from './package-uk-single-worker.mjs';

export const COMPOSITION_KEYS=Object.freeze([...SIX_DESIGN_KEYS,'router']);
const hex=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const sameVariants=(a,b)=>JSON.stringify(a.map(({key,base,entry})=>({key,base,entry})))===JSON.stringify(b.map(({key,base,entry})=>({key,base,entry})));
const readGit=(root,args)=>execFileSync('git',['--no-optional-locks','-C',root,...args],{encoding:'utf8',windowsHide:true}).trim();

export function parseCompositionArgs(argv) {
 const result={write:false};
 for(let i=0;i<argv.length;i++) {
  const key=argv[i];
  if(key==='--write'){if(result.write)throw Error('Repeated --write');result.write=true;continue;}
  if(!['--client','--inputs','--out'].includes(key))throw Error('Unknown argument: '+key);
  const name=key.slice(2);
  if(result[name]||!argv[i+1]||argv[i+1].startsWith('--'))throw Error('Missing or repeated '+key+' value');
  result[name]=argv[++i];
 }
 if(!result.client||!result.inputs||!result.out)throw Error('Use --client SLUG --inputs JSON --out Cars/runtime/OUTPUT [--write]');
 return result;
}

export function registeredCompositionIdentity(registry,client,review) {
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(client||''))throw Error('Invalid client slug');
 const records=registry?.dealers?.filter(d=>d.slug===client)||[];
 if(records.length!==1)throw Error('Expected exactly one registered client: '+client);
 const record=records[0];
 if(review.schemaVersion!==1||review.client!==client||review.repository!==record.repository||!/^[-\w.]+\/[-\w.]+$/.test(record.repository||''))throw Error('Reviewed client/repository differs from registry');
 if(typeof review.reviewed!=='boolean'||(review.reviewed&&!Number.isFinite(Date.parse(review.reviewedAt))))throw Error('Explicit reviewed state and review date required');
 assertSixDesignSelection(review.variants);
 const previous=record.variants?.find(v=>v.base==='/variant-2'||v.entry?.startsWith('/variant-2'));
 if(!previous||!['modern','import'].includes(previous.key)||review.variants[1].key!==previous.key)throw Error('Preserve the registered variant-2 family');
 const workerName=record.cloudflare?.workerName||record.delivery?.workerName||record.repository.split('/')[1];
 if(!/^[a-z][a-z0-9-]{0,62}$/.test(workerName)||review.workerName!==workerName)throw Error('Reviewed Worker differs from established dealer identity');
 let origin;
 try{origin=new URL(review.publicOrigin);}catch{throw Error('Invalid reviewed public origin');}
 if(origin.origin!==review.publicOrigin||origin.protocol!=='https:'||origin.username||origin.password||!origin.hostname.startsWith(workerName+'.')||!/^[-a-z0-9]+\.[-a-z0-9]+\.workers\.dev$/.test(origin.hostname))throw Error('Expected exact dealer workers.dev HTTPS origin');
 const registeredOrigin=record.cloudflare?.publicOrigin||record.delivery?.configuredPublicOrigin||(record.delivery?.provider==='cloudflare'?record.delivery?.publicUrl||record.delivery?.url:null);
 if(registeredOrigin&&new URL(registeredOrigin).origin!==review.publicOrigin)throw Error('Reviewed origin differs from registered Cloudflare origin');
 return {record,workerName,publicOrigin:review.publicOrigin};
}

/** Only the frozen JSON argument is read; generated router code is never executed. */
export function reviewedRouterVariants(directory,deploy) {
 const file=inside(directory,deploy.mainPath,{mustExist:true});
 const source=fs.readFileSync(file,'utf8');
 const match=source.match(/export default createDealerRouter\((\{[\s\S]*\})\);\s*$/);
 if(!match)throw Error('Frozen router shape requires review');
 const plan=JSON.parse(match[1]);
 assertSixDesignSelection(plan.variants);
 return plan.variants;
}

export function resolveExistingEsbuild(root=ROOT) {
 const candidates=[process.env.CARS_ESBUILD_RESOLVE_FROM,path.join(root,'runtime/uk-cloudflare-next-adapter-20261010/qualification/mobile/package.json'),path.join(root,'templates/karento-best/package.json'),path.join(root,'package.json')].filter(Boolean);
 for(const candidate of candidates) {
  if(!path.isAbsolute(candidate)||!fs.existsSync(candidate))continue;
  try{const esbuild=createRequire(candidate)('esbuild');if(typeof esbuild.transformSync==='function'&&typeof esbuild.version==='string')return esbuild;}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}
 }
 throw Error('Existing esbuild unavailable; set CARS_ESBUILD_RESOLVE_FROM to the existing tool package.json. No dependency install was attempted.');
}

export function planDealerSingleWorker({client,inputsFile,out,root=ROOT,registry=json(path.join(root,'docs/DEPLOYMENT-INVENTORY.json')),inspect=provider.inspectSingleWorkerInputs,gitRead=readGit}) {
 const inputFile=path.resolve(inputsFile),review=json(inputFile),registered=registeredCompositionIdentity(registry,client,review);
 const runtime=inside(root,'runtime',{mustExist:true}),destination=inside(runtime,path.relative(runtime,path.resolve(out)));
 if(fs.existsSync(destination))throw Error('Fresh Cars runtime output required; existing output is retained');
 if(!review.inputs||Object.keys(review.inputs).length!==COMPOSITION_KEYS.length||COMPOSITION_KEYS.some(k=>!Object.hasOwn(review.inputs,k)))throw Error('Exactly six family inputs and one router are required');
 const inputs={};
 for(const key of COMPOSITION_KEYS) {
  const row=review.inputs[key];
  if(!row||typeof row.directory!=='string'||!hex(row.artifactDigest)||!hex(row.compiledDigest))throw Error('Reviewed directory and exact artifact digests required: '+key);
  const directory=path.resolve(path.dirname(inputFile),row.directory);
  if(!fs.existsSync(directory)||!fs.lstatSync(directory).isDirectory()||fs.lstatSync(directory).isSymbolicLink())throw Error('Compiled input must be an existing unlinked directory: '+key);
  inputs[key]=fs.realpathSync(directory);
  const child=path.relative(inputs[key],destination);
  if(!child||(!child.startsWith('..'+path.sep)&&child!=='..'&&!path.isAbsolute(child)))throw Error('Output must not be inside a reviewed compiled input');
 }
 if(new Set(Object.values(inputs)).size!==COMPOSITION_KEYS.length)throw Error('Compiled input directories must be distinct');
 if(typeof inspect!=='function')throw Error('Reviewed composer input inspection is unavailable');
 const {inspected,identity,inputKind}=inspect({inputs,expectedDealer:client,componentReuse:review.componentReuse??null});
 if(identity.workerName!==registered.workerName||identity.publicOrigin!==registered.publicOrigin)throw Error('Compiled public Worker/origin differs from reviewed identity');
 for(const key of COMPOSITION_KEYS) {
  const {inventory,deploy}=inspected[key],pin=review.inputs[key];
  if(inventory.digest!==pin.artifactDigest||deploy.compiledDigest!==pin.compiledDigest)throw Error('Compiled artifact differs from reviewed digest: '+key);
 }
 const variants=reviewedRouterVariants(inputs.router,inspected.router.deploy);
 if(!sameVariants(variants,review.variants))throw Error('Compiled router mounts differ from reviewed family selection');
 for(const variant of variants) {
  const worker=registered.workerName+'-'+(variant.key==='karento-best'?'signature':variant.key);
  if(variant.binding!=='CARS_'+variant.key.toUpperCase().replaceAll('-','_')||variant.worker!==worker||inspected[variant.key].deploy.workerName!==worker)throw Error('Compiled family binding differs from stable dealer identity: '+variant.key);
 }
 const checkout=path.join(root,'clients',client),independent=registered.record.sourceOwnership==='independent-repository'||fs.existsSync(path.join(checkout,'.git'));
 const sourceRepository=independent?registered.record.repository:registered.record.canonicalSourceRepository||'darkapoparka/cars';
 if(review.sourceRepository!==sourceRepository)throw Error('Reviewed source repository differs from dealer ownership');
 if(independent) {
  assertIndependentCheckout(root,registered.record,checkout,gitRead);
  if(gitRead(checkout,['rev-parse',identity.sourceCommit+'^{commit}'])!==identity.sourceCommit)throw Error('Independent source commit must exist in its own repository');
  if(inputKind==='existing-fleet'&&gitRead(checkout,['rev-parse',identity.sourceCommit+'^{tree}'])!==identity.sourceTree)throw Error('Independent compiled source tree differs from its own repository');
 }
 const publicPlan={schemaVersion:1,type:'cars-dealer-single-worker-proposal',client,repository:registered.record.repository,sourceRepository,sourceCommit:identity.sourceCommit,inputKind,sourceIdentity:inputKind==='existing-fleet'?{sourceTree:identity.sourceTree,inputDigest:identity.inputDigest,sourceReleases:identity.sourceReleases}:{packageTree:identity.packageTree,packageDigest:identity.packageDigest,payloadDigest:identity.payloadDigest},reviewed:review.reviewed,reviewedAt:review.reviewedAt||null,reviewFile:inputFile,reviewSha256:sha256(fs.readFileSync(inputFile)),destination,publicOrigin:identity.publicOrigin,workerName:identity.workerName,variants:review.variants,applicationCount:6,workerCount:1,serviceBindings:[],independentSource:independent,artifacts:Object.fromEntries(COMPOSITION_KEYS.map(k=>[k,{directory:inputs[k],artifactDigest:inspected[k].inventory.digest,compiledDigest:inspected[k].deploy.compiledDigest}])),...(review.componentReuse?{componentReuse:review.componentReuse}:{}),readyToCompose:review.reviewed,compositionWritten:false,builds:0,deployments:0,hostedVerified:false};
 return {plan:publicPlan,inputs};
}

export function runDealerSingleWorker({client,inputsFile,out,write=false,root=ROOT,registry,inspect,gitRead,compose=provider.packageUkSingleWorker,resolveEsbuild=resolveExistingEsbuild}) {
 const {plan,inputs}=planDealerSingleWorker({client,inputsFile,out,root,registry,inspect,gitRead});
 if(!write)return plan;
 if(!plan.readyToCompose)throw Error('Composition requires an explicit dated review of these exact inputs');
 const esbuild=resolveEsbuild(root);
 if(fs.existsSync(plan.destination)||sha256(fs.readFileSync(plan.reviewFile))!==plan.reviewSha256)throw Error('Review or fresh output changed before composition');
 const receipt=compose({inputs,destination:plan.destination,expectedDealer:client,esbuild,componentReuse:plan.componentReuse??null});
 for(const key of COMPOSITION_KEYS)if(receipt.artifacts?.[key]?.digest!==plan.artifacts[key].artifactDigest||receipt.artifacts?.[key]?.compiledDigest!==plan.artifacts[key].compiledDigest)throw Error('Composed output differs from reviewed input; retained output requires inspection');
 if(receipt.workerName!==plan.workerName||receipt.publicOrigin!==plan.publicOrigin||receipt.sourceCommit!==plan.sourceCommit||receipt.workerCount!==1)throw Error('Composed identity differs; retained output requires inspection');
 const result={...plan,type:'cars-dealer-single-worker-composition',compositionWritten:true,receipt:'single-worker-receipt.json',outputDigest:receipt.outputDigest,serverBytes:receipt.serverBytes,compressedBytes:receipt.compressedBytes,assetFiles:receipt.assetFiles,esbuildVersion:receipt.esbuildVersion};
 fs.writeFileSync(path.join(plan.destination,'dealer-composition-review.json'),JSON.stringify(result,null,2)+'\n',{flag:'wx'});
 return result;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
 try {
  if(process.argv.slice(2).includes('--help'))console.log('Usage: node scripts/package-dealer-single-worker.mjs --client SLUG --inputs reviewed-seven-targets.json --out runtime/OWNER/dealer [--write]\nDefault: verify input digests, ownership, stable public identity and six mounted families without writing. --write composes reviewed compiled inputs only; no build or deployment.\nUse existing esbuild, or set CARS_ESBUILD_RESOLVE_FROM to its existing package.json. See the input JSON contract at the top of this file.');
  else{const opts=parseCompositionArgs(process.argv.slice(2));console.log(JSON.stringify(runDealerSingleWorker({client:opts.client,inputsFile:opts.inputs,out:opts.out,write:opts.write}),null,2));}
 }catch(error){console.error(error.message);process.exitCode=1;}
}
