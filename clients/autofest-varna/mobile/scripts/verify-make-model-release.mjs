import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='reference/web/make-model-release';
const json=relative=>JSON.parse(fs.readFileSync(path.join(root,relative),'utf8'));
const hash=buffer=>crypto.createHash('sha256').update(buffer).digest('hex');
const suite=json('suite-status.json'),buildId=fs.readFileSync('.next/BUILD_ID','utf8').trim();
assert.equal(suite.buildId,buildId);assert.equal(suite.results.length,15);
const retry=fs.existsSync(root+'/retry-status.json')?json('retry-status.json'):{buildId,results:[]};assert.equal(retry.buildId,buildId);
assert(suite.results.every(item=>item.exitCode===0||retry.results.some(result=>result.name===item.name&&result.exitCode===0)));
for(const result of retry.results){const report=json(result.reportDirectory+'/report.json').report;assert(report.length>0&&report.every(item=>item.pass));}

const flows=json('make-model/report.json').report,catalog=json('make-catalog/report.json').report,visual=json('make-visual/report.json');
assert.equal(flows.length,14);assert(flows.every(item=>item.pass));assert.equal(catalog.length,182);assert(catalog.every(item=>item.pass));assert.equal(visual.length,14);assert(visual.every(item=>item.pass));
const landmarks=visual.flatMap(item=>item.landmarks);assert(landmarks.length>=28);assert(landmarks.every(item=>item.pass));
const sourceLog=fs.readFileSync(root+'/source-check.log','utf8');assert(/# pass 46/.test(sourceLog));assert(/# fail 0/.test(sourceLog));assert(sourceLog.includes('Generating static pages'));assert(fs.readFileSync(root+'/format-check.log','utf8').includes('All matched files use Prettier'));
const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else files.push(file);}}walk('src');walk('tests');walk('scripts');
files.push('package.json','package-lock.json','next.config.js','tsconfig.json');files.sort();
const sourceFiles=files.map(file=>({path:file.replaceAll('\\','/'),sha256:hash(fs.readFileSync(file))}));
const reports={};for(const name of suite.results.map(item=>item.name)){const folder=path.join(root,name);for(const entry of fs.readdirSync(folder)){if(entry.endsWith('.json'))reports[name+'/'+entry]=hash(fs.readFileSync(path.join(folder,entry)));}}
for(const item of retry.results){reports[item.reportDirectory+'/report.json']=hash(fs.readFileSync(root+'/'+item.reportDirectory+'/report.json'));}
const receipt={initialFailures:suite.results.filter(item=>item.exitCode!==0),verifiedRetries:retry.results,at:new Date().toISOString(),buildId,sourceFingerprint:hash(JSON.stringify(sourceFiles)),sourceFiles,reportHashes:reports,domainTests:46,releaseSuites:15,makeCatalogs:182,pickerFlowScenarios:14,nativeComparisonStates:14,nativeControlLandmarks:landmarks.length,landmarkToleranceCSSPixels:3,wholeAppOneToOne:false,scope:'docs/MAKE-MODEL-REPAIR.md'};
if (process.argv.includes('--check')) { const previous=json('acceptance-receipt.json'); assert.equal(previous.buildId,receipt.buildId); assert.equal(previous.sourceFingerprint,receipt.sourceFingerprint); assert.deepEqual(previous.reportHashes,receipt.reportHashes); } else { fs.writeFileSync(root+'/acceptance-receipt.json',JSON.stringify(receipt,null,2)+'\n'); }
console.log('VERIFIED_MAKE_MODEL_RELEASE',JSON.stringify({buildId,suites:15,domain:46,catalogs:182,flows:14,states:14,landmarks:landmarks.length,wholeAppOneToOne:false}));
