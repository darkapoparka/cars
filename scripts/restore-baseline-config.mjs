// One-time correction to the 2026-09-06 snapshots; existing files are never overwritten.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {excluded} from './copy-source.mjs';
const root=await fs.realpath(path.resolve(import.meta.dirname,'../templates'));
const result=[];
for(const key of ['auto-best','modern','carwow','import','showroom','autodeal']) {
  const destination=await fs.realpath(path.join(root,key));
  if(!destination.startsWith(root+path.sep)) throw new Error('Unexpected template location');
  const file=path.join(destination,'.template/source-manifest.json');
  const manifest=JSON.parse(await fs.readFile(file,'utf8'));
  const restored=[];
  for(const relative of manifest.excluded) {
    if(excluded(path.basename(relative),relative,false))continue;
    const source=path.join(manifest.source,relative), stat=await fs.lstat(source);
    if(!stat.isFile() || stat.isSymbolicLink())continue;
    const bytes=await fs.readFile(source),target=path.join(destination,relative);
    if(!path.resolve(target).startsWith(destination+path.sep))throw new Error('Unexpected destination');
    if(relative==='.npmrc' && /(?:_auth|password|token)\s*=/i.test(bytes.toString()))throw new Error('Credential-bearing npm configuration requires selective extraction');
    await fs.writeFile(target,bytes,{flag:'wx'});
    const hash=value=>createHash('sha256').update(value).digest('hex');
    const sha256=hash(bytes);
    if(hash(await fs.readFile(target))!==sha256)throw new Error('Configuration copy mismatch');
    manifest.files.push({path:relative,bytes:bytes.length,sha256,supplementedAt:new Date().toISOString()});
    manifest.bytes+=bytes.length;
    restored.push(relative);
  }
  manifest.excluded=manifest.excluded.filter(x=>!restored.includes(x));
  manifest.configurationSupplement={at:new Date().toISOString(),files:[...new Set([...(manifest.configurationSupplement?.files||[]),...restored])]};
  await fs.writeFile(file,JSON.stringify(manifest,null,2));
  result.push({key,restored:manifest.configurationSupplement.files});
}
await fs.writeFile(path.join(root,'../audits/2026-09-06/config-restoration.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
