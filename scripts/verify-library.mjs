import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=await fs.realpath(path.resolve(import.meta.dirname,'..'));
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
const rows=[];
for(const t of catalog.templates) {
  const dir=path.join(root,t.path),row={key:t.key,requiredFiles:[],snapshotFilesVerified:0,runtimeGeneratedDifferences:[],mismatches:[],missing:[]};
  for(const file of ['package.json','README.md','TEMPLATE.md','AGENTS.md','.template/template.json']) {
    const exists=await fs.access(path.join(dir,file)).then(()=>true).catch(()=>false);
    row.requiredFiles.push({file,exists});if(!exists)row.missing.push(file);
  }
  let manifest=null;try{manifest=JSON.parse(await fs.readFile(path.join(dir,'.template/source-manifest.json'),'utf8'));}catch{}
  if(manifest) {
    for(const file of manifest.files) {
      // README was intentionally replaced by library instructions; its exact source is preserved in metadata.
      const actual=file.path==='README.md'?'.template/source-readme.md':file.path;
      const bytes=await fs.readFile(path.join(dir,actual)).catch(()=>null);
      if(!bytes){row.missing.push(actual);continue;}
      if(createHash('sha256').update(bytes).digest('hex')!==file.sha256) {
        // Next dev legitimately rewrites this generated route-type reference.
        // Keep and verify the exact copied original, and accept only this one transformation.
        const original=t.key==='modern' && file.path==='apps/web/next-env.d.ts'
          ? await fs.readFile(path.join(dir,'.template/source-next-env.d.ts')).catch(()=>null) : null;
        if(original && createHash('sha256').update(original).digest('hex')===file.sha256
          && bytes.toString()===original.toString().replace('./.next/types/routes.d.ts','./.next/dev/types/routes.d.ts')) {
          row.snapshotFilesVerified++;
          row.runtimeGeneratedDifferences.push({file:file.path,change:'Next dev route-type import',original:'.template/source-next-env.d.ts'});
        } else row.mismatches.push(file.path);
      }
      else row.snapshotFilesVerified++;
    }
  }
  rows.push(row);
}
const summary={checkedAt:new Date().toISOString(),templates:rows.length,snapshotFilesVerified:rows.reduce((n,r)=>n+r.snapshotFilesVerified,0),pass:rows.every(r=>!r.missing.length&&!r.mismatches.length),rows};
await fs.writeFile(path.join(root,'audits/2026-09-06/library-integrity.json'),JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary));
if(!summary.pass)process.exitCode=1;
