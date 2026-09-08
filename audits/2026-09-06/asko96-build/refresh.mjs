import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {excluded} from '../../../scripts/copy-source.mjs';
const out=path.resolve('audits/2026-09-06/asko96-build');
const digest=b=>createHash('sha256').update(b).digest('hex');
const bytes=p=>fs.readFile(p).catch(e=>{if(e.code==='ENOENT')return null;throw e});
const results=[];const plan=[];
for(const key of ['auto-best','modern','carwow']){
 const dst=path.resolve('templates',key);const mf=path.join(dst,'.template/source-manifest.json');const raw=await fs.readFile(mf);const m=JSON.parse(raw);const base=new Map(m.files.map(x=>[x.path,x.sha256]));const current=[];
 async function walk(dir,rel=''){for(const e of await fs.readdir(dir,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name;if(e.isSymbolicLink()){if(excluded(e.name,r,true))continue;throw Error('Review source symlink '+r)}if(excluded(e.name,r,e.isDirectory()))continue;if(e.isDirectory())await walk(path.join(dir,e.name),r);else if(e.isFile()){const b=await fs.readFile(path.join(dir,e.name));current.push({path:r,bytes:b.length,sha256:digest(b)})}}}
 await walk(m.source);const paths=new Set([...base.keys(),...current.map(x=>x.path)]);const changes=[];
 for(const r of paths){const [s,d]=await Promise.all([bytes(path.join(m.source,r)),bytes(path.join(dst,r))]);const sh=s?digest(s):null,dh=d?digest(d):null,bh=base.get(r)||null;if(sh===dh||sh===bh)continue;if(dh!==bh)throw Error('Independent edit conflict '+key+'/'+r);changes.push({path:r,before:dh,after:sh,sourceExists:!!s});}
 const git=a=>execFileSync('git',['-C',m.source,...a],{encoding:'utf8',windowsHide:true}).trim();
 const p={key,source:m.source,destination:dst,head:git(['rev-parse','HEAD']),branch:git(['branch','--show-current']),remote:git(['remote','get-url','origin']),dirty:git(['status','--porcelain=v1']),changes};plan.push(p);results.push({p,m,mf,raw,current});
}
await fs.writeFile(path.join(out,'refresh-plan.json'),JSON.stringify(plan,null,2));console.log(JSON.stringify(plan.map(p=>({key:p.key,head:p.head,branch:p.branch,files:p.changes.length})),null,2));
if(!process.argv.includes('--apply'))process.exit(0);
for(const {p,m,mf,raw,current} of results){
 const backup=path.join(out,'baseline',p.key);await fs.mkdir(path.join(backup,'.template'),{recursive:true});await fs.writeFile(path.join(backup,'.template/source-manifest.json'),raw,{flag:'wx'});
 for(const c of p.changes){const dst=path.join(p.destination,c.path);const d=await bytes(dst);if((d?digest(d):null)!==c.before)throw Error('Destination changed after plan '+dst);if(d){const b=path.join(backup,c.path);await fs.mkdir(path.dirname(b),{recursive:true});await fs.writeFile(b,d,{flag:'wx'});}if(c.sourceExists){const s=await fs.readFile(path.join(p.source,c.path));if(digest(s)!==c.after)throw Error('Source changed after plan '+c.path);await fs.mkdir(path.dirname(dst),{recursive:true});await fs.writeFile(dst,s)}else await fs.unlink(dst);}
 m.files=current;m.refreshedAt=new Date().toISOString();m.git={...m.git,head:p.head,branch:p.branch,remote:p.remote,status:p.dirty};m.refreshEvidence=path.relative(p.destination,out).replaceAll('\\','/');await fs.writeFile(mf,JSON.stringify(m,null,2));
 const t=path.join(p.destination,'TEMPLATE.md');let doc=await fs.readFile(t,'utf8');await fs.writeFile(path.join(backup,'TEMPLATE.md'),doc,{flag:'wx'});doc=doc.replace('2026.09.06-baseline','2026.09.06-refresh-1');doc+='\n## Source refresh 2026.09.06-refresh-1\n\nRefreshed from the owner-approved current source including uncommitted polish. See J:/cars/audits/2026-09-06/asko96-build/refresh-plan.json and baseline backups. Existing J: README and local runtime configuration are preserved.\n';await fs.writeFile(t,doc);
}
const catPath='catalog.json';const catRaw=await fs.readFile(catPath);await fs.writeFile(path.join(out,'catalog-before.json'),catRaw,{flag:'wx'});const cat=JSON.parse(catRaw);for(const t of cat.templates)if(results.some(r=>r.p.key===t.key))t.version='2026.09.06-refresh-1';await fs.writeFile(catPath,JSON.stringify(cat,null,2)+'\n');await fs.writeFile(path.join(out,'refresh-complete.json'),JSON.stringify({completedAt:new Date().toISOString(),plan},null,2));
