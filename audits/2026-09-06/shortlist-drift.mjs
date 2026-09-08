import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {excluded} from '../../scripts/copy-source.mjs';
const keys=['auto-best','modern','carwow','import'];
const hash=async p=>fs.readFile(p).then(b=>createHash('sha256').update(b).digest('hex')).catch(()=>null);
const results=[];
for(const key of keys){
 const dest=path.resolve('templates',key),m=JSON.parse(await fs.readFile(path.join(dest,'.template/source-manifest.json'),'utf8'));
 const base=new Map(m.files.map(f=>[f.path,f.sha256])); const paths=new Set(base.keys());
 async function walk(p,rel=''){for(const e of await fs.readdir(p,{withFileTypes:true})){const r=rel?rel+'/'+e.name:e.name;if(e.isSymbolicLink()||excluded(e.name,r,e.isDirectory()))continue;if(e.isDirectory())await walk(path.join(p,e.name),r);else paths.add(r);}}
 await walk(m.source);
 const changes=[];
 for(const r of paths){const [s,d]=await Promise.all([hash(path.join(m.source,r)),hash(path.join(dest,r))]);if(s!==d)changes.push({path:r,sourceChanged:s!==(base.get(r)||null),libraryChanged:d!==(base.get(r)||null),sourceExists:!!s,libraryExists:!!d});}
 const git=args=>execFileSync('git',['-C',m.source,...args],{encoding:'utf8',windowsHide:true}).trim();
 const record={key,source:m.source,destination:dest,copiedAt:m.copiedAt,branch:git(['branch','--show-current']),head:git(['rev-parse','HEAD']),remote:git(['remote','get-url','origin']),dirty:git(['status','--porcelain=v1']).split('\n').filter(Boolean),changes};results.push(record);
 console.log(JSON.stringify({key,branch:record.branch,head:record.head,dirty:record.dirty.length,differences:changes.length,sourceChanges:changes.filter(x=>x.sourceChanged).length,libraryChanges:changes.filter(x=>x.libraryChanged).length,paths:changes.map(x=>x.path)}));
}
await fs.writeFile('audits/2026-09-06/shortlist-drift.json',JSON.stringify(results,null,2));

