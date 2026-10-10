/** Build-only Varna candidate harness. Never changes release approval or publishes. */
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {createRequire} from 'node:module';import {spawnSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
import {ROOT,git,normalized,writeJson} from './lib/workflow.mjs';
import {collectSource,vercelConfiguration,switcherConfiguration,validatePackagingManifest} from './package-dealer.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources,applySixVariantMounts,sealSixVariantBuild} from './publishing/six-variant.mjs';
import {legacyDetailArtifact} from './publishing/legacy-detail-routes.mjs';
import {applyDealerShare} from './publishing/dealer-share.mjs';
import {applySharedMedia} from './publishing/shared-media.mjs';
import {applyVercelAssets,SERVICE_NAMES} from './publishing/vercel-asset-plan.mjs';
export const FAMILIES=['auto-best','modern','import','app','mobile','karento-best'];
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),encode=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
function identity(slug){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error('Invalid dealer slug');const selected=read(path.join(ROOT,'leads/varna/selected-10.json')).leads.find(d=>d.slug===slug);if(!selected)throw Error('Not in selected Varna batch');return selected;}
function dependency(name){for(const item of ['runtime/varna-tools/package.json','templates/karento-best/package.json'])try{return createRequire(path.join(ROOT,item))(name);}catch(error){if(error.code!=='MODULE_NOT_FOUND')throw error;}throw Error('Install the exact isolated Varna tool dependencies first: '+name);}
const location=slug=>path.join(ROOT,'runtime/varna-ci',slug);
export function buildMatrix(request){
 if(request?.schemaVersion!==1||!Array.isArray(request.dealers)||!Array.isArray(request.families)||!request.dealers.length||!request.families.length)throw Error('Invalid build request');
 if(new Set(request.dealers).size!==request.dealers.length||new Set(request.families).size!==request.families.length)throw Error('Repeated requested builds');
 for(const slug of request.dealers)identity(slug);for(const key of request.families)if(!FAMILIES.includes(key))throw Error('Unknown family');
 return {include:request.dealers.flatMap(slug=>request.families.map(key=>({slug,key,node:key==='karento-best'?'24.21.0':'22.23.2'})))};
}
export async function assemble(slug,sourceCommit){
 identity(slug);if(!/^[a-f0-9]{40}$/.test(sourceCommit)||git(ROOT,['rev-parse','HEAD'])!==sourceCommit)throw Error('Build must use its exact checked-out commit');
 const source=path.join(ROOT,'clients',slug),out=location(slug),manifest=read(path.join(source,'dealer.json'));
 const candidate=read(path.join(source,'.client/varna-source-candidate.json'));
 if(candidate.dealer!==slug||candidate.kind!=='personalized-source-candidate-not-an-approved-release'||candidate.nativeReleaseQualification.approved!==false)throw Error('Expected an explicit unapproved Varna candidate');
 if(fs.existsSync(out))throw Error('Fresh derived package required; do not overwrite');validatePackagingManifest(manifest);
 let files=await collectSource(source,manifest);files.set('dealer.json',encode(manifest));
 assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);
 const profile=loadDealerProfile(source,slug),logoPath='branding/logo-on-light.png';
 manifest.shareIdentity={name:profile.business.name,publicOrigin:'https://'+manifest.repository.split('/')[1]+'.vercel.app',description:profile.business.name+' — демонстрационен автомобилен каталог. Наличността и условията се потвърждават с търговеца.',logo:{sourcePath:logoPath,sha256:hash(files.get(logoPath)),faviconSourcePath:'assets/app-icon.png',faviconSha256:hash(files.get('assets/app-icon.png'))}};
 files=applySixVariantMounts(files,manifest,{provider:'vercel'});
 await applyDealerShare(files,manifest,{sharp:dependency('sharp'),typescript:dependency('typescript')});
 files.set('dealer.json',encode(manifest));files.set('vercel.json',encode(vercelConfiguration(manifest,legacyDetailArtifact(files,manifest))));
 for(const helper of ['fix-svelte-service-output.mjs','build-native-service.mjs','build-app-service.mjs','prune-shared-media.mjs','storage-assets.mjs','vercel-service-assets.mjs','vercel-output-budget.mjs'])files.set('scripts/'+helper,fs.readFileSync(path.join(ROOT,'scripts/publishing',helper)));
 const messages=read(path.join(ROOT,'scripts/publishing/switcher-messages.json'));
 const config=switcherConfiguration(manifest,messages,files);
 const switcher=fs.readFileSync(path.join(ROOT,'scripts/publishing/preview-switcher.js'),'utf8').replace('__CARS_SWITCHER_CONFIG__',()=>JSON.stringify(config).replace(/</g,'\\u003c'));
 files.set('auto-best/static/preview-switcher.js',Buffer.from(switcher));
 applySharedMedia(files,read(path.join(ROOT,'scripts/publishing/shared-media-catalog.json')));
 const assetPlan=applyVercelAssets(files);sealSixVariantBuild(files,manifest,{provider:'vercel'});
 files.set('.cars-varna-candidate-package.json',encode({schemaVersion:1,kind:'build-only-six-design-candidate',sourceCommit,dealer:slug,sourceCandidate:candidate.candidateSourceDigest,nativeReleaseApproval:false,buildVerified:false,hostedVerified:false,outreachApproved:false,productionPublisherUntouched:true}));
 const payload=[...files].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([name,bytes])=>({path:name,sha256:hash(normalized(bytes))}));
 files.set('.cars-package.json',encode({schemaVersion:1,manifest,sourceCommit,packagingVersion:'5',payloadDigest:hash(JSON.stringify(payload)),payload,candidate:true,approved:false}));
 // The existing asset build wrappers need a byte seal, not a made-up native approval.
 const plannedRoot=path.resolve(out);fs.mkdirSync(out,{recursive:true});
 for(const [name,bytes]of files){if(name.startsWith('/')||name.includes('\\')||name.split('/').some(p=>!p||p==='..'||p==='.'))throw Error('Unsafe derived file');const target=path.join(plannedRoot,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes);}
 const receipt={schemaVersion:1,dealer:slug,sourceCommit,sourceTree:git(ROOT,['rev-parse',sourceCommit+':clients/'+slug]),packageDigest:hash(JSON.stringify(payload)),families:FAMILIES,files:files.size,assetPlan:assetPlan.summary,switcher:config,nativeApproval:false,compiled:false,deployed:false};
 writeJson(path.join(ROOT,'runtime/varna-ci-evidence',slug,'assembly.json'),receipt);console.log(JSON.stringify({phase:'assembled',dealer:slug,files:files.size,digest:receipt.packageDigest,outputPublicMiB:Math.round(assetPlan.summary.outputBytes/1024**2),nativeApproval:false}));return receipt;
}
export function build(slug,key){
 identity(slug);if(!FAMILIES.includes(key))throw Error('Unknown family');
 const out=location(slug),config=read(path.join(out,'vercel.json')),manifest=read(path.join(out,'dealer.json')),service=config.services[SERVICE_NAMES[key]],evidence=path.join(ROOT,'runtime/varna-ci-evidence',slug);
 const expected=key==='modern'?'modern/apps/web':key;if(service?.root!==expected)throw Error('Unexpected service build root');
 const assembly=read(path.join(evidence,'assembly.json'));if(manifest.slug!==slug||!service.installCommand||!service.buildCommand)throw Error('Missing generated build contract');
 const receipt={schemaVersion:1,dealer:slug,key,node:process.version,sourceCommit:assembly.sourceCommit,packageDigest:assembly.packageDigest,startedAt:new Date().toISOString(),steps:[],passed:false,nativeApproval:false,hosted:false};
 try{for(const [phase,command]of [['install',service.installCommand],['build',service.buildCommand]]){
   console.log('\nVARNA '+slug+' '+key+' '+phase+': '+command);
   const result=spawnSync('bash',['-eo','pipefail','-c',command],{cwd:path.join(out,expected),env:{...process.env,CI:'1',NEXT_TELEMETRY_DISABLED:'1'},stdio:'inherit',windowsHide:true});
   receipt.steps.push({phase,command,exitCode:result.status,error:result.error?.message||null});if(result.error||result.status!==0)throw Error(key+' '+phase+' failed');
  }receipt.passed=true;
 }finally{receipt.finishedAt=new Date().toISOString();writeJson(path.join(evidence,key+'-build.json'),receipt);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,'## '+slug+' / '+key+'\n\nBuild: **'+(receipt.passed?'PASS':'FAIL')+'**. Source `'+receipt.sourceCommit+'`; package `'+receipt.packageDigest+'`. Native approval and hosted acceptance are not implied.\n');}
 return receipt;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{const [command,a,b]=process.argv.slice(2);if(command==='matrix')console.log('matrix='+JSON.stringify(buildMatrix(read(path.join(ROOT,'leads/varna/candidates/build-request.json')))));else if(command==='assemble')await assemble(a,b);else if(command==='build')build(a,b);else throw Error('Usage: matrix | assemble SLUG COMMIT | build SLUG FAMILY');}catch(error){console.error(error.stack);process.exitCode=1;}