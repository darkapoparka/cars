import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
test('separate package index ignores source sparsity without modifying the source index',()=>{
 const area=fs.mkdtempSync(path.join(os.tmpdir(),'cars-package-index-test-')),repo=path.join(area,'repo'),pack=path.join(area,'package');
 fs.mkdirSync(repo);fs.mkdirSync(pack);const g=(args,options={})=>execFileSync('git',args,{cwd:repo,encoding:'utf8',stdio:['pipe','pipe','pipe'],...options}).trim();
 try{
 g(['init']);g(['config','user.name','Cars Test']);g(['config','user.email','test@example.invalid']);
 fs.mkdirSync(path.join(repo,'clients'));fs.writeFileSync(path.join(repo,'clients/source.json'),'{}\n');g(['add','clients']);g(['commit','-m','fixture']);g(['sparse-checkout','init','--cone']);g(['sparse-checkout','set','clients']);
 const sourceIndex=fs.readFileSync(path.join(repo,'.git/index')),expected=['app/package.json','.cars-media/dealer/image.webp','modern/packages/dealer.ts'];
 for(const p of expected){fs.mkdirSync(path.dirname(path.join(pack,p)),{recursive:true});fs.writeFileSync(path.join(pack,p),'fixture\n');}
 const env={...process.env,GIT_INDEX_FILE:path.join(area,'package.index')};g(['read-tree','--empty'],{env});
 const add=['--work-tree',pack,'--literal-pathspecs','add','--force','--pathspec-from-file=-','--pathspec-file-nul'],input=expected.join('\0')+'\0';
 const rejected=spawnSync('git',add,{cwd:repo,env,input,encoding:'utf8'});assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/sparse-checkout/);
 g(['-c','core.sparseCheckout=false',...add],{env,input});assert.deepEqual(g(['-c','core.sparseCheckout=false','ls-files'],{env}).split('\n'),expected.slice().sort());assert.deepEqual(fs.readFileSync(path.join(repo,'.git/index')),sourceIndex);assert.equal(g(['config','core.sparseCheckout']),'true');
 }finally{fs.rmSync(area,{recursive:true,force:true});}
});
