// A provider-only composition of already built, verified UK artifacts. No application source regeneration.
import fs from 'node:fs';import path from 'node:path';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';import {fileURLToPath} from 'node:url';
import {verifyArtifactDirectory} from './lib/uk-cloudflare-artifacts.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
const SVELTE=['auto-best','import','karento-best'],NEXT=['modern','app','mobile'];
const assert=(ok,message)=>{if(!ok)throw Error(message);};
export function compactWorkerSource(){return [
 'import router from "./router-original.mjs";',
 'import autoBest from "./auto-best.mjs";',
 'import importDesign from "./import.mjs";',
 'import signature from "./karento-best.mjs";',
 'export default {async fetch(request, env, ctx) {',
 ' const services={...env,CARS_AUTO_BEST:{fetch:r=>autoBest.fetch(r,env,ctx)},CARS_IMPORT:{fetch:r=>importDesign.fetch(r,env,ctx)},CARS_KARENTO_BEST:{fetch:r=>signature.fetch(r,env,ctx)}};',
 ' return router.fetch(request,services);',
 '}};',''].join('\n');}
function walk(root,relative='',out=[]){for(const e of fs.readdirSync(path.join(root,relative),{withFileTypes:true})){assert(!e.isSymbolicLink(),'Linked compact input refused');const n=relative?relative+'/'+e.name:e.name;if(e.isDirectory())walk(root,n,out);else if(e.isFile())out.push(n);else throw Error('Special compact input refused');}return out.sort();}
export function packageUkCompact({inputs,destination,expectedDealer}){
 assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(expectedDealer),'Exact UK dealer required');
 assert(!fs.existsSync(destination),'Compact destination must be fresh');
 const inspected={};for(const key of [...SVELTE,'router']){const folder=inputs[key];assert(folder&&fs.existsSync(folder),'Missing compiled artifact '+key);const inventory=verifyArtifactDirectory(folder),deploy=JSON.parse(fs.readFileSync(path.join(folder,'deploy.json'),'utf8'));
 assert(inventory.status==='passed'&&inventory.kind==='compiled-worker'&&inventory.dealer===expectedDealer&&deploy.dealer===expectedDealer&&deploy.key===key&&deploy.compiled===true&&deploy.sourcePayloadUnchanged===true,'Compiled identity mismatch '+key);
 inspected[key]={folder,inventory,deploy};}
 const identity=inspected.router.deploy;
 for(const {deploy} of Object.values(inspected))for(const f of ['sourceCommit','packageTree','packageDigest','payloadDigest','publicOrigin','runId','attempt'])assert(String(deploy[f])===String(identity[f]),'Mixed compiled package: '+f);
 const base=path.resolve(destination);fs.mkdirSync(path.join(base,'public'),{recursive:true});const linked=[],headerParts=[];
 const copy=(source,name)=>{assert(!path.isAbsolute(name)&&!name.split('/').some(p=>p==='..'),'Unsafe output name');const to=path.join(base,name),bytes=fs.readFileSync(source);if(fs.existsSync(to)){assert(fs.readFileSync(to).equals(bytes),'Asset collision: '+name);return;}fs.mkdirSync(path.dirname(to),{recursive:true});try{fs.linkSync(source,to);linked.push(name);}catch{fs.writeFileSync(to,bytes,{flag:'wx'});}};
 for(const [key,{folder,deploy}] of Object.entries(inspected)){
  const main=key==='router'?deploy.mainPath:`compiled/${key}/.cars-cloudflare/worker/index.js`;
  assert(inspected[key].inventory.files.some(f=>f.path===main),'Standalone compiled module absent');copy(path.join(folder,main),'server/'+(key==='router'?'router-original.mjs':key+'.mjs'));
  const assets=path.join(folder,deploy.assetPath);for(const name of walk(assets)){if(name==='_headers'){headerParts.push(fs.readFileSync(path.join(assets,name),'utf8'));continue;}copy(path.join(assets,name),'public/'+name);}
 }
 fs.writeFileSync(path.join(base,'public/_headers'),'/*\n  X-Robots-Tag: noindex, nofollow\n\n'+headerParts.join('\n\n')+'\n',{flag:'wx'});
 fs.writeFileSync(path.join(base,'server/worker.mjs'),compactWorkerSource(),{flag:'wx'});
 const config={name:identity.workerName,main:'server/worker.mjs',base_dir:'server',compatibility_date:'2026-10-10',compatibility_flags:['nodejs_compat'],workers_dev:true,preview_urls:false,no_bundle:true,find_additional_modules:true,rules:[{type:'ESModule',globs:['**/*.mjs'],fallthrough:true}],observability:{enabled:true},assets:{directory:'./public',binding:'ASSETS',run_worker_first:false},services:NEXT.map(key=>({binding:'CARS_'+key.toUpperCase(),service:identity.workerName+'-'+key}))};
 fs.writeFileSync(path.join(base,'wrangler.json'),JSON.stringify(config,null,2)+'\n',{flag:'wx'});
 const files=walk(base).map(name=>{const b=fs.readFileSync(path.join(base,name));return {path:name,bytes:b.length,sha256:hash(b)};});
 const workerFiles=files.filter(f=>f.path.endsWith('.mjs'));const compressedBytes=workerFiles.reduce((s,f)=>s+gzipSync(fs.readFileSync(path.join(base,f.path))).length,0);
 assert(compressedBytes<3*1024**2,'Combined Worker exceeds conservative Free compressed-size bound');
 const report={schemaVersion:1,type:'cars-uk-compact-provider-package',dealer:expectedDealer,sourceCommit:identity.sourceCommit,packageTree:identity.packageTree,packageDigest:identity.packageDigest,runId:identity.runId,attempt:identity.attempt,publicOrigin:identity.publicOrigin,workerName:identity.workerName,applicationCount:6,workerCount:4,composition:{inProcess:SVELTE,serviceBindings:NEXT},compressedBytes,assetFiles:files.filter(f=>f.path.startsWith('public/')).length,artifacts:Object.fromEntries(Object.entries(inspected).map(([k,v])=>[k,{digest:v.inventory.digest,compiledDigest:v.deploy.compiledDigest}])),files,outputDigest:hash(JSON.stringify(files)),linkedFiles:linked.length,compiledApplicationBytesChanged:false,hostedVerified:false};
 fs.writeFileSync(path.join(base,'compact-receipt.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'});return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const [input,output,slug]=process.argv.slice(2);const report=packageUkCompact({inputs:Object.fromEntries([...SVELTE,'router'].map(k=>[k,path.join(input,k)])),destination:output,expectedDealer:slug});console.log(JSON.stringify({dealer:report.dealer,workerCount:report.workerCount,applicationCount:report.applicationCount,compressedBytes:report.compressedBytes,assetFiles:report.assetFiles,outputDigest:report.outputDigest}));}
