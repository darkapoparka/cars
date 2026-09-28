import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyAndPrune} from './storage-assets.mjs';

export async function pruneService(service,{packageRoot=path.resolve(import.meta.dirname,'..'),dryRun=false}={}){
 const receipt=JSON.parse(await fs.readFile(path.join(packageRoot,'.cars-shared-media.json'),'utf8'));
 const pkg=JSON.parse(await fs.readFile(path.join(packageRoot,'.cars-package.json'),'utf8'));
 const dealer=JSON.parse(await fs.readFile(path.join(packageRoot,'dealer.json'),'utf8'));
 if(receipt.schemaVersion!==1||receipt.dealer!==dealer.slug||pkg.manifest.slug!==dealer.slug)throw Error('Expected a generated dealer media package');
 const variants=dealer.variants.filter(v=>v.key===service);if(variants.length!==1)throw Error('Unknown service');
 const base=variants[0].base.replace(/^\//,'');
 const next=service==='modern'||service==='app';
 const root=path.join(packageRoot,next?(service==='modern'?'modern/apps/web/public':'app/public'):`${service}/.vercel/output/static`);
 const entries=[];
 for(const e of receipt.entries.filter(e=>e.service===service)){
  const candidates=next?[e.relative]:[...new Set([e.relative,...(base?[base+'/'+e.relative]:[])])];
  let found=false;
  for(const outputPath of candidates){
   try{await fs.lstat(path.join(root,outputPath));found=true;entries.push({outputPath,sha256:e.sha256,bytes:e.bytes,remoteUrl:e.remoteUrl});}
   catch(error){if(error.code!=='ENOENT')throw error;}
  }
  if(!found)throw Error('Missing expected shared output '+e.relative);
 }
 const result=await verifyAndPrune({root,entries,dryRun});
 console.log(JSON.stringify({sharedMedia:service,checkedFiles:result.checkedFiles,prunedFiles:result.prunedFiles,prunedBytes:result.prunedBytes}));return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))pruneService(process.argv[2]).catch(e=>{console.error(e.message);process.exitCode=1;});
