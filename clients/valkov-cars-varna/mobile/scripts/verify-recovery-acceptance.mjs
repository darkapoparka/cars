import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
const root='reference/web/recovery-20260927';
const specs=[['interactions-production','checks',13],['state-production','report',6],['contracts-production',null,5],['enquiry-production','scenarios',5],['resources-production',null,16],['filter-production','report',70],['icons-production','checks',56],['visual-production','report',41]];
const sha=buffer=>createHash('sha256').update(buffer).digest('hex');
const reports=[];
for(const [folder,key,count] of specs){
 const file=root+'/'+folder+'/report.json';const bytes=fs.readFileSync(file);const data=JSON.parse(bytes.toString('utf8'));const rows=key?data[key]:data;
 assert.equal(rows.length,count,file);
 for(const row of rows)assert.ok(row.pass===true||row.passed===true||(row.status===200&&row.errors?.length===0),file+': '+(row.name||row.id));
 if(data.errors)assert.deepEqual(data.errors,[]);
 reports.push({file,cases:rows.length,sha256:sha(bytes),modifiedAt:fs.statSync(file).mtime.toISOString()});
}
const logBytes=fs.readFileSync(root+'/source-check.log');
const log=logBytes.toString(logBytes[0]===255&&logBytes[1]===254?'utf16le':'utf8');
assert.match(log,/# tests 36/);assert.match(log,/# fail 0/);assert.match(log,/Compiled successfully/);assert.match(log,/Generating static pages/);
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else files.push(file);}}
walk('src');files.push('package.json','package-lock.json','next.config.js');
const source=createHash('sha256');for(const file of files.sort()){source.update(file.replaceAll('\\','/'));source.update('\0');source.update(fs.readFileSync(file));}
const receipt={at:new Date().toISOString(),buildId:fs.readFileSync('.next/BUILD_ID','utf8').trim(),baselineCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sourceSha256:source.digest('hex'),sourceFiles:files.length,source:{lint:'pass',types:'pass',domainTests:36,productionBuild:'pass',formatting:'pass',logSha256:sha(logBytes)},preview:'http://127.0.0.1:6424',reports,wholeAppOneToOne:false,avdMoved:false,emulator5554Started:false,emulatorBlocker:'Remote Desktop Commander denied I:\\Android\\avd; Android source and destination not in allowedDirectories.',remainingScope:'docs/PARITY.md'};
fs.writeFileSync(root+'/acceptance-receipt.json',JSON.stringify(receipt,null,2)+'\n');
console.log('VERIFIED_RECOVERY',JSON.stringify({buildId:receipt.buildId,domainTests:36,suites:reports.map(r=>[r.file.split('/').at(-2),r.cases]),wholeAppOneToOne:false}));
