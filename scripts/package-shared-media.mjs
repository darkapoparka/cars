import { runLocalMediaCommand } from './publishing/local-media-command.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,args,git,exportCommit,sha256,normalized,inside} from './lib/workflow.mjs';
import {packageFiles,verifyPackage} from './export-dealer.mjs';
import {applySharedMedia} from './publishing/shared-media.mjs';

/** Extend an exact existing publishing commit, preserving every application file. */
export function packageSharedMedia({root=ROOT,slug,publishingCommit,sourceCommit,out,catalog}){
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug??''))throw Error('Invalid dealer slug');
 const runtime=inside(root,'runtime');
 const relative=path.relative(runtime,path.resolve(out));
 if(!relative||relative==='..'||relative.startsWith('..'+path.sep)||path.isAbsolute(relative))throw Error('Output must be a new derived directory beneath runtime');
 out=inside(runtime,relative);
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'clients',slug,'dealer.json'),'utf8'));
 if(manifest.slug!==slug)throw Error('Dealer identity mismatch');
 if(!/^[a-f0-9]{40}$/.test(publishingCommit)||!/^[a-f0-9]{40}$/.test(sourceCommit))throw Error('Use exact source and publishing commits');
 git(root,['cat-file','-e',sourceCommit+'^{commit}']);
 exportCommit(root,publishingCommit,out,{filter:p=>p!=='.cars-publish.json'});
 const files=new Map(packageFiles(out).map(p=>[p,fs.readFileSync(path.join(out,p))]));
 const prior=JSON.parse(files.get('.cars-package.json').toString());
 const publishedManifest=JSON.parse(files.get('dealer.json').toString());
 if(publishedManifest.slug!==slug||publishedManifest.repository!==manifest.repository)throw Error('Publishing source identity mismatch');
 const result=applySharedMedia(files,catalog);
 for(const name of ['prune-shared-media.mjs','storage-assets.mjs'])files.set('scripts/'+name,fs.readFileSync(path.join(root,'scripts/publishing',name)));
 const original=new Map(packageFiles(out).map(p=>[p,fs.readFileSync(path.join(out,p))]));
 for(const [p,b]of original)if(!['vercel.json','.cars-package.json'].includes(p)&&!files.get(p)?.equals(b))throw Error('Original publishing source changed '+p);
 const payload=[...files].filter(([p])=>p!=='.cars-package.json').sort(([a],[b])=>a<b?-1:a>b?1:0).map(([p,b])=>({path:p,sha256:sha256(normalized(b))}));
 files.set('.cars-package.json',Buffer.from(JSON.stringify({...prior,sourceCommit,sourceMode:'shared-media-preserved-publishing',preservedPublishingCommit:publishingCommit,payload,payloadDigest:sha256(JSON.stringify(payload))},null,2)+'\n'));
 for(const [p,b]of files){const target=path.join(out,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);}
 verifyPackage(out);
 return{slug,publishingCommit,sourceCommit,out,files:result.entries.length,bytes:result.bytes};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){
 if(process.argv.includes('--local-assets')) {
  runLocalMediaCommand(ROOT,process.argv.slice(2)).catch(e=>{console.error(e.message);process.exitCode=1;});
 } else {
 try{
  if(process.argv.includes('--help'))console.log('Usage: node scripts/package-shared-media.mjs --client SLUG --publishing-commit SHA --source-commit SHA --out NEW-DERIVED-DIRECTORY --catalog JSON');
  else{const o=args(process.argv.slice(2),['client','publishing-commit','source-commit','out','catalog']);console.log(JSON.stringify(packageSharedMedia({slug:o.client,publishingCommit:o['publishing-commit'],sourceCommit:o['source-commit'],out:path.resolve(o.out),catalog:JSON.parse(fs.readFileSync(o.catalog,'utf8'))}),null,2));}
 }catch(e){console.error(e.message);process.exitCode=1;}
 }
}
