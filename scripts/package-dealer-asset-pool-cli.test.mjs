import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=path.resolve(import.meta.dirname,'..');
const cli=path.join(root,'scripts/package-dealer.mjs');
test('package CLI advertises the existing derived asset pool option',()=>{
 const result=spawnSync(process.execPath,[cli,'--help'],{cwd:root,encoding:'utf8',windowsHide:true});
 assert.equal(result.status,0,result.stderr);
 assert.match(result.stdout,/\[--asset-pool PATH\]/);
});

test('package CLI rejects overlapping pools in plan and write without creating source, pool or output',()=>{
 const slug='pool-cli-'+randomUUID();
 const source=path.join(root,'clients',slug),out=path.join(root,'runtime','dealer-packages',slug);
 assert.equal(fs.existsSync(source),false);
 assert.equal(fs.existsSync(out),false);
 const pools=[path.relative(root,source),path.join(source,'static'),path.relative(root,out),path.join(out,'pool'),root];
 for(const mode of ['--dry-run','--write'])for(const pool of pools) {
  const result=spawnSync(process.execPath,[cli,'--client',slug,'--out',path.relative(root,out),'--asset-pool',pool,mode],{cwd:root,encoding:'utf8',windowsHide:true});
  assert.equal(result.status,1,result.stdout);
  assert.match(result.stderr,/Derived asset pool must be separate from source and package/);
  assert.equal(fs.existsSync(source),false);
  assert.equal(fs.existsSync(out),false);
 }
});
