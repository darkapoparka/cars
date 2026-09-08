import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import {copySource} from './copy-source.mjs';
const allowed=path.resolve(import.meta.dirname,'../audits/2026-09-06');
test('source copies preserve edited pages, omit secrets/bindings, refuse overwrite and do not follow junctions',async()=>{
  const temp=await fs.mkdtemp(path.join(allowed,'.copy-helper-'));
  try {
    const source=path.join(temp,'source');await fs.mkdir(path.join(source,'src'),{recursive:true});
    await fs.writeFile(path.join(source,'package.json'),'{}');
    await fs.writeFile(path.join(source,'src/home02.svelte'),'locally edited variant');
    await fs.writeFile(path.join(source,'src/inventory-credentials.ts'),'export const validation = true;');
    await fs.writeFile(path.join(source,'credentials.json'),'{"secret":"never-copy"}');
    await fs.writeFile(path.join(source,'.env'),'TEST_SECRET=never-copy');
    await fs.writeFile(path.join(source,'.env.example'),'TEST_SECRET=');
    await fs.writeFile(path.join(source,'.nvmrc'),'22.23.2');
    await fs.writeFile(path.join(source,'.gitignore'),'node_modules/');
    await fs.writeFile(path.join(source,'.npmrc'),'engine-strict=true');
    for(const dir of ['node_modules','.vercel','.agency-os']){await fs.mkdir(path.join(source,dir));await fs.writeFile(path.join(source,dir,'binding.json'),'source-only');}
    const dest=path.join(temp,'client');await copySource(source,dest,{key:'fixture'});
    assert.equal(await fs.readFile(path.join(dest,'src/home02.svelte'),'utf8'),'locally edited variant');
    assert.equal(await fs.readFile(path.join(dest,'src/inventory-credentials.ts'),'utf8'),'export const validation = true;');
    assert.equal(await fs.readFile(path.join(dest,'.env.example'),'utf8'),'TEST_SECRET=');
    assert.equal(await fs.readFile(path.join(dest,'.nvmrc'),'utf8'),'22.23.2');
    assert.equal(await fs.readFile(path.join(dest,'.gitignore'),'utf8'),'node_modules/');
    assert.equal(await fs.readFile(path.join(dest,'.npmrc'),'utf8'),'engine-strict=true');
    for(const entry of ['.env','credentials.json','node_modules','.vercel','.agency-os'])assert.equal(await fs.access(path.join(dest,entry)).then(()=>true).catch(()=>false),false);
    await fs.writeFile(path.join(dest,'owner.txt'),'keep');
    await assert.rejects(copySource(source,dest,{key:'fixture'}),/existing destination/);
    assert.equal(await fs.readFile(path.join(dest,'owner.txt'),'utf8'),'keep');
    await fs.symlink(allowed,path.join(source,'external'),'junction');
    await assert.rejects(copySource(source,path.join(temp,'escape'),{key:'fixture'}),/symlinks need review/);
    assert.equal(await fs.access(path.join(temp,'escape')).then(()=>true).catch(()=>false),false);
  }finally {
    // Delete only this verified generated fixture directory, never a source or client project.
    const physical=await fs.realpath(temp);
    assert.ok(physical.startsWith(allowed+path.sep+'.copy-helper-'));
    await fs.rm(temp,{recursive:true,force:true});
  }
});
