import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,sha256} from './lib/workflow.mjs';
import {inspectBrief} from './build-uk-dealers.mjs';
import {patchAutoBestLocale} from './lib/client-refresh-adapters.mjs';
import {dealerLocalizedCopy} from './lib/dealer-localized-copy.mjs';
import {finalizeAutoBestLocales,AUTO_BEST_LOCALE_INPUTS} from './lib/uk-auto-best-locales.mjs';

const PIN='2afd974c23d4f4cfb290ed99a00f46074793be3a';
const GIT=process.platform==='win32'?'L:/Toolchains/Git/2.54.0/cmd/git.exe':'git';
const jsonBytes=value=>Buffer.from(JSON.stringify(value,null,2)+'\n');
function native(name){
 const result=spawnSync(GIT,['show',PIN+':templates/auto-best/'+name],
  {cwd:ROOT,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},windowsHide:true,maxBuffer:4*1024**2});
 assert.equal(result.status,0,'Exact approved native source must exist locally; this test never fetches missing blobs: '+name);
 return result.stdout;
}
const names=[...AUTO_BEST_LOCALE_INPUTS,'src/lib/config/locale.ts'];
const base=new Map(names.map(name=>[name,native(name)]));
const batch=JSON.parse(fs.readFileSync(path.join(ROOT,'leads/uk-2026-10-10-build-manifest.json'),'utf8'));
const rowKeys=['dealer.city','dealer.addressLine','dealer.address','dealer.appointment'];
const blankDealers=['birmingham-trade-car-sales-grasmere','bradford-cherry-tree-cars','dewsbury-car-market-yorkshire','nottingham-s-a-motors','stockton-norton-grange-trade-cars'];
function fixture(){
 const parent=path.join(ROOT,'runtime/uk-locale-copy-tests');fs.mkdirSync(parent,{recursive:true});
 return fs.mkdtempSync(path.join(parent,'producer-'));
}
function prepare(candidate){
 for(const [name,bytes]of base){const file=path.join(candidate,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}
}
function sourceMap(candidate){
 return new Map(AUTO_BEST_LOCALE_INPUTS.map(name=>['auto-best/'+name,fs.readFileSync(path.join(candidate,name))]));
}

test('all ten actual dealer-copy producers use published location text and pass the strict pinned compiler',()=>{
 const candidate=fixture(),reports=[];let cityOnly=0;
 for(const dealer of batch.dealers){
  prepare(candidate);
  const brief=inspectBrief(ROOT,dealer),profile=brief.profile,business=profile.business;
  const before=JSON.stringify(profile),copy=dealerLocalizedCopy(profile);
  const facts=path.join(ROOT,dealer.brief,'business-facts.json'),stock=path.join(ROOT,dealer.brief,'stock.json');
  const factsHash=sha256(fs.readFileSync(facts)),stockHash=sha256(fs.readFileSync(stock));
  const changed=patchAutoBestLocale(candidate,profile);
  assert.deepEqual(changed,['src/lib/config/locale.ts','localization/dealer.reviewed.json']);
  for(const [name,bytes]of base)if(!changed.includes(name))assert.deepEqual(fs.readFileSync(path.join(candidate,name)),bytes);
  const rows=JSON.parse(fs.readFileSync(path.join(candidate,'localization/dealer.reviewed.json'),'utf8'));
  const selected=rowKeys.map(key=>{const matches=rows.filter(row=>row.key===key);assert.equal(matches.length,1);return matches[0];});
  for(const row of selected)for(const field of ['source','en','bg'])assert.equal(typeof row[field]==='string'&&Boolean(row[field].trim()),true,dealer.slug+' '+row.key+' '+field);
  assert.equal(selected[0].source,business.city);
  assert.equal(selected[1].source,business.addressLine||business.address||business.city);
  assert.equal(selected[2].source,business.address||business.addressLine||business.city);
  assert.equal(selected[3].source,business.hours);
  assert.equal(selected[1].en,copy.en.addressLine);assert.equal(selected[1].bg,copy.bg.addressLine);
  assert.equal(selected[2].en,copy.en.address);assert.equal(selected[2].bg,copy.bg.address);
  const unpublished=!business.addressLine&&!business.address;
  assert.equal(unpublished,blankDealers.includes(dealer.slug));
  if(unpublished){cityOnly++;for(const row of selected.slice(1,3))assert.match(row.notes,/city-only/);}
  else {assert.equal(selected[1].notes,'Dealer-owned address line; physical location and destination remain unchanged.');assert.equal(selected[2].notes,'Dealer-owned full address; physical location and destination remain unchanged.');}
  const files=sourceMap(candidate),profileBytes=jsonBytes(profile);files.set('auto-best/src/lib/data/dealer-profile.json',profileBytes);
  const receipt=finalizeAutoBestLocales({files});
  assert.equal(receipt.nativeCheckPassed,true);assert.equal(receipt.authoritativeInputsUnchanged,true);
  assert.deepEqual(files.get('auto-best/src/lib/data/dealer-profile.json'),profileBytes);
  assert.equal(JSON.stringify(profile),before);assert.equal(sha256(fs.readFileSync(facts)),factsHash);assert.equal(sha256(fs.readFileSync(stock)),stockHash);
  reports.push({dealer:dealer.slug,cityOnly:unpublished,sources:Object.fromEntries(selected.map(row=>[row.key,row.source])),factsSha256:factsHash,stockSha256:stockHash,nativeLocaleCheck:true,authoritativeInputsUnchanged:true,outputHashes:receipt.outputHashes});
 }
 assert.equal(reports.length,10);assert.equal(cityOnly,5);
 fs.writeFileSync(path.join(candidate,'verification.json'),JSON.stringify({schemaVersion:1,pin:PIN,checkedDealerRows:40,cityOnly:5,reports,factsAndStockUnchanged:true,hosted:false,readyToPublish:false},null,2)+'\n');
 console.log(JSON.stringify({evidence:path.relative(ROOT,path.join(candidate,'verification.json')).replaceAll('\\','/'),dealers:10,checkedDealerRows:40,cityOnly:5,nativeLocaleCheck:true}));
});

test('the approved generator still refuses blank source values and missing city facts',()=>{
 const candidate=fixture();prepare(candidate);
 const profile=structuredClone(inspectBrief(ROOT,batch.dealers.find(row=>row.slug==='birmingham-trade-car-sales-grasmere')).profile);
 patchAutoBestLocale(candidate,profile);
 const files=sourceMap(candidate),rows=JSON.parse(files.get('auto-best/localization/dealer.reviewed.json'));
 rows.find(row=>row.key==='dealer.addressLine').source='';
 files.set('auto-best/localization/dealer.reviewed.json',jsonBytes(rows));
 assert.throws(()=>finalizeAutoBestLocales({files}),/Missing source: dealer.addressLine/);
 profile.business.city='';prepare(candidate);patchAutoBestLocale(candidate,profile);
 assert.throws(()=>finalizeAutoBestLocales({files:sourceMap(candidate)}),/Incomplete translation|Missing source/);
 assert.equal(profile.business.address,'');assert.equal(profile.business.addressLine,'');
});
