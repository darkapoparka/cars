import {readFile,writeFile,mkdir,readdir,stat,open} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import path from 'node:path';
const root='reference/2026-09-26-finish';
await mkdir(root,{recursive:true});
const buildId=(await readFile('.next/BUILD_ID','utf8')).trim(),buildTime=(await stat('.next/BUILD_ID')).mtimeMs;
async function sourceFiles(directory){const all=[];for(const entry of await readdir(directory,{withFileTypes:true})){const file=directory+'/'+entry.name;if(entry.isDirectory())all.push(...await sourceFiles(file));else if(/\.(tsx?|css|json)$/.test(file))all.push(file);}return all;}
const files=[...(await Promise.all(['app','components','lib'].map(sourceFiles))).flat(),'package.json','next.config.js','babel.config.js'].sort();
async function fingerprints(){return Promise.all(files.map(async file=>({path:file,sha256:createHash('sha256').update(await readFile(file)).digest('hex')})));}
for(const file of files)if((await stat(file)).mtimeMs>buildTime)throw Error('Source newer than build: '+file);
const before=await fingerprints();await writeFile(root+'/source-before-tests.json',JSON.stringify({buildId,createdAt:new Date().toISOString(),sourceHashes:before},null,2));
const results=[];
async function run(name,command,args){const log=await open(`${root}/${name}.log`,'w');console.log('START '+name);const env={...process.env,PATH:`${path.dirname(process.execPath)};${process.env.PATH}`,QA_REPORT_DIR:`${root}/${name}`};const exit=await new Promise((resolve,reject)=>{const child=spawn(command,args,{cwd:process.cwd(),env,stdio:['ignore',log.fd,log.fd],windowsHide:true});child.once('error',reject);child.once('exit',code=>resolve(code??1));}).finally(()=>log.close());results.push({name,exit});console.log('EXIT '+name+' '+exit);}
await run('lint-types','cmd.exe',['/d','/c','npm.cmd run lint && npm.cmd run typecheck']);
await run('visuals',process.execPath,['scripts/verify-finish-visuals.mjs']);
await run('regression',process.execPath,['scripts/verify-continuation.mjs']);
await run('new-flows',process.execPath,['scripts/verify-final-pass.mjs']);
await run('vehicle-coverage',process.execPath,['scripts/verify-captured-detail-coverage.mjs']);
await run('gestures',process.execPath,['scripts/verify-photo-gestures.mjs']);
await run('loan',process.execPath,['--experimental-strip-types','--test','scripts/test-reference-loan.mjs']);
const after=await fingerprints();if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Application source changed during tests');if((await readFile('.next/BUILD_ID','utf8')).trim()!==buildId)throw Error('Build changed during tests');
const suites={};for(const name of ['visuals','regression','new-flows','vehicle-coverage','gestures']){const r=JSON.parse(await readFile(`${root}/${name}/results.json`,'utf8'));if(Date.parse(r.createdAt)<buildTime)throw Error('Stale report: '+name);suites[name]={passed:r.checks.filter(c=>c.passed).length,failed:r.checks.filter(c=>!c.passed),screenshots:r.captures.length,browserErrors:r.errors,report:`${root}/${name}/results.json`};}
const report={createdAt:new Date().toISOString(),buildId,sourceUnchanged:true,results,suites,sourceHashes:after};await writeFile(root+'/run.json',JSON.stringify(report,null,2));console.log(JSON.stringify({buildId,sourceUnchanged:true,results,suites}));process.exitCode=results.some(r=>r.exit!==0)?1:0;
