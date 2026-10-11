/**
 * Prepare ten real six-family dealer candidates using immutable Git objects.
 * Never checks out another branch or touches a template/client working tree.
 * Canonical source blobs are reused; only text inputs and dealer media need a
 * temporary filesystem for the existing personalization adapters. The resulting
 * independent Git tree contains every retained template file, not a sparse demo.
 * This is NOT the approved publisher: no native approval or hosted QA is forged.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {ROOT,POLICY,json,writeJson,git,gitFiles,filesAt,sha256,normalized,validateManifest} from './lib/workflow.mjs';
import {normalizeDealerLocale} from './lib/dealer-locale.mjs';
import {loadDealerProfile} from './lib/client-refresh-normalize.mjs';
import {retainDealerVariantAssets,applyExtendedRefreshAdapter,sealExtendedVariant} from './lib/client-refresh-six.mjs';
import {applyRefreshAdapter} from './lib/client-refresh-adapters.mjs';
import {prepareAppDealer,sealAppDealerSource} from './lib/app-dealer-adapter.mjs';
import {packageRetainsPath} from './package-dealer.mjs';
import {applyNativeMounts} from './publishing/native-mounts.mjs';
import {baseNativeManifest,assertAppVariant} from './publishing/app-variant.mjs';
import {assertExtendedVariantSources} from './publishing/six-variant.mjs';
import {applyDealerIcons} from './lib/uk-dealer-icons.mjs';

export const FAMILIES=Object.freeze(['auto-best','modern','import','app','mobile','karento-best']);
const SELF=fileURLToPath(import.meta.url), GiB=1024**3;
const safeRelative=s=>typeof s==='string'&&s.length>0&&!/[\\:\0\r\n]/.test(s)&&!s.startsWith('/')&&s.split('/').every(p=>p&&p!=='.'&&p!=='..');
const encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const safeWrite=(root,name,bytes)=>{if(!safeRelative(name))throw Error('Unsafe output path');const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);};
const textSource=name=>!/(?:^|\/)[^/]+\.(?:png|jpe?g|webp|avif|gif|ico|bmp|tiff?|woff2?|ttf|otf|eot|mp4|webm|mov|mp3|ogg|wav|pdf|zip|gz|br|wasm|glb|gltf|psd|ai)$/i.test(name);

export function sourceManifest(dealer,sources,locale){
 return validateManifest({schemaVersion:1,slug:dealer.slug,dealerId:dealer.slug,repository:dealer.proposedRepository,
  defaultBranch:'main',sourceBranch:'varna',sourceOwnership:'cars-canonical',language:'bg',
  variants:FAMILIES.map((key,i)=>({key,base:i?'/variant-'+(i+1):'',entry:i?(key==='modern'?'/variant-2/cars':'/variant-'+(i+1)+'/'):'/'})),
  packaging:{version:'5'},
    branding: { schemaVersion: 1, required: true, policy: 'template-default', contract: '.cars-branding.json' },extraAssets:['assets','branding','dealer-brand'],
  localization:normalizeDealerLocale(locale,dealer.slug),
  templateRevisions:Object.fromEntries(FAMILIES.map(k=>[k,sources[k].revision])),templateSources:sources,
  switcher:{language:'bg',accent:'#2563eb'},candidate:{approved:false,releaseSelection:'exact-latest-committed-snapshots',nativeReleaseQualification:false,build:false,hosted:false,admin:'https://cars-admin-blue.vercel.app/'}});
}

function readBlobs(records,visit){
 for(let start=0;start<records.length;start+=32){
  const batch=records.slice(start,start+32),bytes=git(ROOT,['cat-file','--batch'],{input:batch.map(r=>r.blob).join('\n')+'\n',encoding:null});let offset=0;
  for(const record of batch){const end=bytes.indexOf(10,offset),head=bytes.subarray(offset,end).toString('ascii').split(' '),size=Number(head[2]);
   if(end<0||head[0]!==record.blob||head[1]!=='blob'||!Number.isSafeInteger(size)||size<0||end+size+1>=bytes.length)throw Error('Invalid immutable blob response: '+record.path);
   const content=Buffer.from(bytes.subarray(end+1,end+1+size));offset=end+size+2;visit(record,content);
  }
  if(offset!==bytes.length)throw Error('Unexpected blob stream suffix');
 }
}

function loadTemplates(base){
 const sources={},sourceRecords={},sourceHashes={},files=new Map();let bytes=0;
 for(const key of FAMILIES){
  const revision=git(ROOT,['log','-1','--format=%H',base,'--','templates/'+key]),prefix='templates/'+key;
  const records=gitFiles(ROOT,revision,{prefix}),hashes=[];
  readBlobs(records,(row,content)=>{files.set(key+'/'+row.path,content);bytes+=content.length;hashes.push({path:row.path,sha256:sha256(normalized(content))});});
  sources[key]={repository:'darkapoparka/cars',revision,path:prefix,tree:git(ROOT,['rev-parse',revision+':'+prefix]),digest:sha256(JSON.stringify(hashes))};
  sourceRecords[key]=records;sourceHashes[key]=hashes;
  console.log(JSON.stringify({phase:'template-loaded',key,revision,files:records.length,retainedMiB:Math.round(bytes/1024**2)}));
 }
 return {sources,sourceRecords,sourceHashes,files,bytes};
}

async function prepareDealer(dealer,context){
 const {base,area,templates}=context,client=path.join(area,dealer.slug);
 if(fs.existsSync(client))throw Error('Candidate attempt path already exists: '+dealer.slug);
 if(git(ROOT,['ls-tree',base,'--','clients/'+dealer.slug]))throw Error('Existing canonical dealer must not be replaced: '+dealer.slug);
 fs.mkdirSync(client);const initialText=new Set();
 for(const [name,bytes]of templates.files){if(textSource(name)){safeWrite(client,name,bytes);initialText.add(name);}}
 const packRecords=gitFiles(ROOT,base,{prefix:dealer.packPath,filter:()=>true}),packHashes=[];
 readBlobs(packRecords,(record,bytes)=>{safeWrite(client,record.path,bytes);packHashes.push({path:record.path,sha256:sha256(bytes)});});
 const manifest=sourceManifest(dealer,templates.sources,json(path.join(client,'locale.json')));
 writeJson(path.join(client,'dealer.json'),manifest);writeJson(path.join(client,'localization/contract.json'),manifest.localization);
 const common={state:'candidate-personalized-needs-build',publicUrl:null,qa:{desktop:false,mobile:false,identity:false,contactPath:false},
  crm:{leadId:dealer.id,demoProjectId:null,registered:false},hosting:{provider:'vercel',status:'not-deployed'},readyToPublish:false};
 for(const key of FAMILIES){
  writeJson(path.join(client,key,'.template/source-manifest.json'),{schemaVersion:2,exportPolicy:POLICY,source:templates.sources[key],files:templates.sourceHashes[key],candidate:true,approved:false,workflowCommit:base});
  writeJson(path.join(client,key,'.client/project.json'),{schemaVersion:1,client:dealer.slug,templateKey:key,templateVersion:templates.sources[key].revision,templateSource:templates.sources[key],createdAt:new Date().toISOString(),...common});
 }
 writeJson(path.join(client,'.client/project.json'),{schemaVersion:1,client:dealer.slug,repository:dealer.proposedRepository,sourceBranch:'varna',workflowCommit:base,designSet:'six',...common});
 fs.writeFileSync(path.join(client,'AGENTS.md'),'# Dealer candidate ownership\n\nCanonical source is Cars / varna / clients/'+dealer.slug+'. Read dealer.json, CLIENT.md and .client/varna-source-candidate.json first. Never modify template masters from this client. Business-facts.json, stock.json and the retained raster asset pack are shared across all six applications. Use existing Cars adapters and qualified packaging, not copied handwritten layouts. This candidate has no native approval, production build, hosted QA or permission for outreach. Preserve source attribution, honest unknown facts, privacy and demo write blocking.\n');
 const profile=loadDealerProfile(client,dealer.slug),nativeChanges={};
 if(profile.listings.length!==8||profile.business.countryCode!=='BG'||profile.business.currency!=='EUR')throw Error('Unexpected dealer facts or inventory');
 for(const key of FAMILIES.slice(0,3)){
  const assets=new Map();retainDealerVariantAssets(assets,key,profile,client);for(const [name,bytes]of assets)safeWrite(client,name,bytes);
  const candidate=path.join(client,key);nativeChanges[key]=applyRefreshAdapter({key,oldVariant:candidate,candidate,profile});
 }
 let files=new Map([...templates.files].filter(([name])=>packageRetainsPath(name)));
 const deleted=[];for(const name of initialText)if(!fs.existsSync(path.join(client,name))){files.delete(name);deleted.push(name);}
 for(const name of filesAt(client,{filter:()=>true}))if(packageRetainsPath(name))files.set(name,fs.readFileSync(path.join(client,name)));
 const appFiles=new Map([...files].filter(([name])=>name.startsWith('app/')).map(([name,bytes])=>[name.slice(4),bytes]));
 const app=await prepareAppDealer(client,manifest,{appFiles});for(const [name,bytes]of app.files)files.set('app/'+name,bytes);
 files.set('app/public/dealer-app/icon.png',fs.readFileSync(path.join(client,'assets/app-icon.png')));
 const adaptations={};for(const key of ['mobile','karento-best'])adaptations[key]=applyExtendedRefreshAdapter({files,key,profile,client});
 const icons=applyDealerIcons({files,manifest,profile,png:fs.readFileSync(path.join(client,'assets/app-icon.png')),ico:fs.readFileSync(path.join(client,'assets/favicon.ico'))});
 // The reusable icon helper was originally introduced for UK clients. Bind the actual locale.
 for(const [name,bytes]of files)if(name.endsWith('/dealer-brand/site.webmanifest')){const webmanifest=JSON.parse(bytes.toString('utf8'));webmanifest.lang='bg';files.set(name,encode(webmanifest));}
 files=applyNativeMounts(files,baseNativeManifest(manifest));
 sealAppDealerSource({files,manifest,provenance:app.provenance});
 for(const key of ['mobile','karento-best'])sealExtendedVariant({files,key,manifest,profile,adaptation:adaptations[key]});
 assertAppVariant(files,manifest);assertExtendedVariantSources(files,manifest);
 for(const [name,bytes]of files){const before=templates.files.get(name);if(before&&(before===bytes||before.equals(bytes)))continue;safeWrite(client,name,bytes);}
 // Reconstruct the complete retained source from immutable originals plus materialized overlays.
 const overlayNames=filesAt(client,{filter:()=>true});let retainedFiles=0;
 for(const key of FAMILIES)retainedFiles+=templates.sourceRecords[key].length;
 const finalHashRows=[...files].sort(([a],[b])=>a.localeCompare(b,'en')).map(([name,bytes])=>({path:name,sha256:sha256(normalized(bytes))}));
 const receipt={schemaVersion:1,dealer:dealer.slug,createdAt:new Date().toISOString(),workflowCommit:base,sourceBranch:'varna',
  kind:'personalized-source-candidate-not-an-approved-release',inputPackDigest:sha256(JSON.stringify(packHashes)),
  sourceReleases:templates.sources,sourceMaterializedInGit:true,sharedTemplateBlobs:true,independentTemplateFiles:retainedFiles,
  personalizationApplied:true,appAndExtendedInputSealsVerified:true,candidateSourceDigest:sha256(JSON.stringify(finalHashRows)),
  nativeChanges,icons,inventory:{records:profile.listings.length,photos:profile.listings.reduce((n,l)=>n+l.images.length,0),mode:'dated-listing-snapshot'},
  nativeReleaseQualification:{approved:false,adoptionReceiptCreated:false,reason:'Root approved pins are older than the chosen masters; source candidates do not fabricate template release approvals.'},
  logoVisualQa:false,frameworkBuilds:0,hosted:false,readyToPublish:false};
 writeJson(path.join(client,'.client/varna-source-candidate.json'),receipt);
 fs.writeFileSync(path.join(client,'CLIENT.md'),'# '+dealer.name+'\n\nSix real, independently materialized template applications share this sourced fact, stock and raster asset pack.\n\nExact current committed masters are retained in dealer.json and .client/varna-source-candidate.json. This is a candidate on the Varna branch, not an approved release. Native release qualification, framework compilation, final logo work and hosted mobile/desktop/FAB/contact QA remain pending. No Vercel site was published and no dealership was contacted by this preparation.\n\nThe main Cars working tree was not switched or modified to install these files. Git stores the complete independent client trees while reusing unchanged source blobs.\n');
 return {client,receipt,deleted,overlayNames:filesAt(client,{filter:()=>true})};
}

function installTreeEntries(index,parent,dealer,prepared,templates){
 const env={GIT_INDEX_FILE:index};
 const rows=[];for(const key of FAMILIES)for(const file of templates.sourceRecords[key])rows.push(file.mode+' '+file.blob+'\tclients/'+dealer.slug+'/'+key+'/'+file.path);
 for(const name of prepared.deleted)rows.push('0 '+ '0'.repeat(40)+'\tclients/'+dealer.slug+'/'+name);
 git(ROOT,['-c','core.sparseCheckout=false','update-index','-z','--index-info'],{env,input:Buffer.from(rows.join('\0')+'\0')});
 const modes=Object.fromEntries(FAMILIES.flatMap(key=>templates.sourceRecords[key].map(file=>[key+'/'+file.path,file.mode])));
 const names=prepared.overlayNames,paths=names.map(name=>JSON.stringify(path.join(prepared.client,name).replaceAll('\\','/'))).join('\n')+'\n';
 const hashes=git(ROOT,['hash-object','-w','--no-filters','--stdin-paths'],{input:paths}).split('\n');
 if(hashes.length!==names.length||hashes.some(s=>!/^[a-f0-9]{40}$/.test(s)))throw Error('Overlay hashing mismatch');
 git(ROOT,['-c','core.sparseCheckout=false','update-index','-z','--index-info'],{env,input:Buffer.from(names.map((name,i)=>(modes[name]||'100644')+' '+hashes[i]+'\tclients/'+dealer.slug+'/'+name).join('\0')+'\0')});
 const tree=git(ROOT,['write-tree'],{env});
 return {tree,canonicalPath:'clients/'+dealer.slug,files:git(ROOT,['ls-tree','-r','--name-only',tree,'--','clients/'+dealer.slug]).split('\n').filter(Boolean).length};
}

export async function prepareBatch({selection='all',attempt,base}){
 if(!/^[a-z0-9][a-z0-9-]{0,70}$/.test(attempt||''))throw Error('Provide a unique lowercase attempt name.');
 if(git(ROOT,['remote','get-url','origin']).replace(/\.git$/,'')!=='https://github.com/darkapoparka/cars')throw Error('Wrong repository');
 if(!/^[a-f0-9]{40}$/.test(base||'')||git(ROOT,['rev-parse',base+'^{commit}'])!==base)throw Error('Use an exact committed base SHA.');
 if(os.freemem()<5*GiB)throw Error('At least 5 GiB of currently free memory is needed; do not interrupt another process to obtain it.');
 const disk=fs.statfsSync(ROOT);if(Number(disk.bavail)*Number(disk.bsize)<2*GiB)throw Error('Less than 2 GiB free for bounded overlays and new Git objects.');
 const selected=JSON.parse(git(ROOT,['show',base+':leads/varna/selected-10.json'])).leads;
 const dealers=selection==='all'?selected:selected.filter(d=>d.slug===selection);if(!dealers.length||selection==='all'&&dealers.length!==10)throw Error('Unknown selected dealer set');
 const existing=JSON.parse(git(ROOT,['show',base+':leads/varna/all-leads.json'])).leads;
 for(const dealer of dealers)if(existing.find(r=>r.selectedSlug===dealer.slug)?.existingClientPaths.length)throw Error('Selected dealer matches an existing source');
 const area=path.join(ROOT,'runtime/varna-candidates',attempt);if(fs.existsSync(area))throw Error('Attempt exists; retain it and select a new name.');fs.mkdirSync(area,{recursive:true});
 const index=path.join(area,'candidate.index'),env={GIT_INDEX_FILE:index};
 git(ROOT,['-c','core.sparseCheckout=false','read-tree',base],{env});
 const templates=loadTemplates(base),report={schemaVersion:1,kind:'varna-source-candidate-preparation',base,attempt,startedAt:new Date().toISOString(),sourceReleases:templates.sources,dealers:[],failures:[],builds:0,deployments:0,readyToPublish:false};
 writeJson(path.join(area,'source-selection.json'),report);
 for(const dealer of dealers){
  try {console.log(JSON.stringify({phase:'dealer-start',dealer:dealer.slug}));
   const prepared=await prepareDealer(dealer,{base,area,templates});const tree=installTreeEntries(index,base,dealer,prepared,templates);
   report.dealers.push({slug:dealer.slug,repository:dealer.proposedRepository,...tree,receipt:prepared.receipt});
   console.log(JSON.stringify({phase:'dealer-prepared',dealer:dealer.slug,...tree}));
  }catch(error){report.failures.push({slug:dealer.slug,error:error.message,stack:error.stack});console.error(dealer.slug+': '+error.stack);}
  writeJson(path.join(area,'preparation.json'),report);
 }
 if(!report.dealers.length)throw Error('No source candidate passed personalization; failure evidence retained.');
 const reportName='leads/varna/candidates/'+attempt+'.json';report.finishedAt=new Date().toISOString();
 const reportHash=git(ROOT,['hash-object','-w','--stdin'],{input:encode(report)});
 git(ROOT,['-c','core.sparseCheckout=false','update-index','-z','--index-info'],{env,input:Buffer.from('100644 '+reportHash+'\t'+reportName+'\0')});
 const tree=git(ROOT,['write-tree'],{env});
 const changed=git(ROOT,['diff-tree','--no-commit-id','--name-only','-r','--no-renames','-z',base,tree],{encoding:null}).toString('utf8').split('\0').filter(Boolean);
 if(changed.some(name=>name!==reportName&&!report.dealers.some(d=>name.startsWith('clients/'+d.slug+'/'))))throw Error('Candidate tree changed an out-of-scope path');
 const commit=git(ROOT,['commit-tree',tree,'-p',base],{input:'feat(varna): personalize '+report.dealers.length+' six-template source candidates\n\nExact committed sources; original assets retained; native release and hosted QA remain pending.\n'});
 const ref='refs/cars-candidates/varna/'+attempt;git(ROOT,['update-ref',ref,commit,'0'.repeat(40)]);
 Object.assign(report,{tree,commit,ref,changedFiles:changed.length});writeJson(path.join(area,'preparation.json'),report);
 console.log(JSON.stringify({phase:'candidate-commit-created',commit,ref,dealers:report.dealers.length,failures:report.failures.map(r=>({slug:r.slug,error:r.error})),changedFiles:changed.length,worktreeBranch:git(ROOT,['branch','--show-current']),builds:0,deployments:0}));
 return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===SELF){
 const [command,selection,attempt,base]=process.argv.slice(2);
 if(command!=='prepare'||!selection||!attempt||!base||process.argv.length!==6){console.error('Usage: node scripts/prepare-varna-candidates.mjs prepare all|SLUG ATTEMPT EXACT_BASE_SHA');process.exitCode=1;}
 else try{const report=await prepareBatch({selection,attempt,base});if(report.failures.length)process.exitCode=2;}catch(error){console.error(error.stack);process.exitCode=1;}
}
