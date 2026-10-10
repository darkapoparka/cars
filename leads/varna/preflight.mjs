import fs from 'node:fs';
import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const folder=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(folder,'../..');
const selected=JSON.parse(fs.readFileSync(path.join(folder,'selected-10.json'),'utf8'));
const runtime=process.env.CARS_RELEASE_NODE||process.execPath;
const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true}).trim();
const env={...process.env,GCM_INTERACTIVE:'never',GIT_TERMINAL_PROMPT:'0'};
if(process.platform==='win32'){env.GIT_CONFIG_COUNT='1';env.GIT_CONFIG_KEY_0='credential.helper';env.GIT_CONFIG_VALUE_0='manager';}
const results=[];
for(const lead of selected.leads){
 const args=['scripts/new-client.mjs','--client',lead.slug,'--repository',lead.proposedRepository,'--design-set','six','--locale-config',path.relative(root,path.join(folder,'packs',lead.slug,'locale.json')),'--dry-run'];
 const child=spawnSync(runtime,args,{cwd:root,env,encoding:'utf8',timeout:120000,maxBuffer:16*1024*1024,windowsHide:true});
 const text=[child.stderr,child.error?.message].filter(Boolean).join('\n').trim();
 const result={slug:lead.slug,command:['node',...args],exitCode:child.status,passed:child.status===0,error:child.status===0?null:text.slice(0,5000),clientCreated:fs.existsSync(path.join(root,'clients',lead.slug))};
 results.push(result);console.log(lead.slug,result.passed?'PASS':'BLOCKED',result.error?.replace(/\s+/g,' ')||'');
}
const report={schemaVersion:1,checkedAt:new Date().toISOString(),sourceHead:git('rev-parse','HEAD'),branch:git('branch','--show-current'),releaseInputStatus:git('status','--porcelain','--','catalog.json','templates.lock.json'),scope:'Read-only execution of the existing six-design new-client CLI. Does not approve sources, create clients, install dependencies, build, publish repositories or deploy.',canCreateCandidates:results.every(x=>x.passed),results};
if(process.argv.includes('--write'))fs.writeFileSync(path.join(folder,'preflight.json'),JSON.stringify(report,null,2)+'\n');
if(!report.canCreateCandidates)process.exitCode=1;
