import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
const root='reference/web/make-model-release';
const original=JSON.parse(fs.readFileSync(root+'/suite-status.json','utf8'));
const buildId=fs.readFileSync('.next/BUILD_ID','utf8').trim();
assert.equal(original.buildId,buildId);assert.equal(original.results.length,15,'Initial gate must finish before retries');
const scripts={'overlay-flows':'qa-overlay-interactions.mjs'};
const results=[];
for(const previous of original.results.filter(item=>item.exitCode!==0)){
 const script=scripts[previous.name];assert(script,'Investigate the failure before enabling a retry: '+previous.name);
 const folder=root+'/retry-'+previous.name;fs.mkdirSync(folder,{recursive:true});const fd=fs.openSync(folder+'/run.log','w');
 const run=spawnSync(process.execPath,['scripts/'+script],{env:{...process.env,QA_URL:original.base,QA_OUTPUT:folder,QA_ASSERT:'1'},stdio:['ignore',fd,fd],timeout:180000,windowsHide:true});fs.closeSync(fd);
 results.push({name:previous.name,previousExitCode:previous.exitCode,exitCode:run.status,error:run.error?.message,reportDirectory:'retry-'+previous.name});
 console.log('RERUN',previous.name,run.status===0?'PASS':'FAIL');
 if(run.status!==0)process.exitCode=1;
}
assert.equal(fs.readFileSync('.next/BUILD_ID','utf8').trim(),buildId);
fs.writeFileSync(root+'/retry-status.json',JSON.stringify({at:new Date().toISOString(),buildId,reason:'The old overlay scenario assumed excluded criteria left an empty make grid; it now follows and asserts the native populated exclusion card.',results},null,2)+'\n');
