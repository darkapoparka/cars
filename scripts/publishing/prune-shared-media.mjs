import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {verifyAndPrune} from './storage-assets.mjs';

export async function pruneService(service,{packageRoot=path.resolve(import.meta.dirname,'..'),dryRun=false}={}){
 const receipt=JSON.parse(await fs.readFile(path.join(packageRoot,'.cars-shared-media.json'),'utf8'));
 const pkg=JSON.parse(await fs.readFile(path.join(packageRoot,'.cars-package.json'),'utf8'));
 const dealer=JSON.parse(await fs.readFile(path.join(packageRoot,'dealer.json'),'utf8'));
 if(receipt.schemaVersion!==1||receipt.dealer!==dealer.slug||pkg.manifest.slug!==dealer.slug)throw Error('Expected a generated dealer media package');
 const variants=dealer.variants.filter(v=>v.key===service);if(variants.length!==1)throw Error('Unknown service');
 const base=variants[0].base.replace(/^\//,'');
 const next=['modern','app','mobile'].includes(service);
 const root=path.join(packageRoot,next?(service==='modern'?'modern/apps/web/public':`${service}/public`):`${service}/.vercel/output/static`);
 const entries=[];
 const retentionFile=path.join(packageRoot,service,'.svelte-kit/cars-public-assets/retention.json');
 const retention=!next?await fs.readFile(retentionFile,'utf8').then(JSON.parse,e=>{if(e.code==='ENOENT')return null;throw e;}):null;
 let alreadyOmitted=0;
 for(const e of receipt.entries.filter(e=>e.service===service)){
  const candidates=next?[e.relative]:[...new Set([e.relative,...(base?[base+'/'+e.relative]:[])])];
  let found=false;
  for(const outputPath of candidates){
   try{await fs.lstat(path.join(root,outputPath));found=true;entries.push({outputPath,sha256:e.sha256,bytes:e.bytes,remoteUrl:e.remoteUrl});}
   catch(error){if(error.code!=='ENOENT')throw error;}
  }
  if(!found){
   const omitted=retention?.omitted?.find(o=>o.path===e.relative&&o.sha256===e.sha256&&o.bytes===e.bytes);
   if(!omitted)throw Error('Missing expected shared output '+e.relative);
   const original=await fs.readFile(path.join(packageRoot,service,'static',e.relative));
   if(original.length!==e.bytes||createHash('sha256').update(original).digest('hex')!==e.sha256)throw Error('Retained source differs from omission evidence '+e.relative);
   alreadyOmitted++;
  }
 }
 const result=await verifyAndPrune({root,entries,dryRun});
 console.log(JSON.stringify({sharedMedia:service,alreadyOmitted,checkedFiles:result.checkedFiles,prunedFiles:result.prunedFiles,prunedBytes:result.prunedBytes}));return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))pruneService(process.argv[2]).catch(e=>{console.error(e.message);process.exitCode=1;});
