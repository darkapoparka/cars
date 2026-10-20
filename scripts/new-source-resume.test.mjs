import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {sourceMutationWrite,withSourceMutationWriter} from './lib/source-mutation-writer.mjs';
import {materializeTemplateSource} from './lib/template-source.mjs';
import {createNewClient} from './new-client.mjs';
import {fingerprint,POLICY} from './lib/workflow.mjs';
import {NEW_SOURCE_RESUME_STAGES,NEW_SOURCE_RESUME_LIMITS,createNewSourceResume,openNewSourceResume,captureNewSourceResumeState,atomicNewSourceResumeWrite,continueNewSourceResume,ownedNewSourceCandidate} from './lib/new-source-resume.mjs';

const hash=b=>createHash('sha256').update(b).digest('hex');
const sourceKeys=['auto-best','modern','import','app','mobile','karento-best'];
function fixture(t){
 const temp=fs.realpathSync(os.tmpdir()),root=fs.mkdtempSync(path.join(temp,'cars-source-resume-'));
 t.after(()=>{
  const physical=fs.realpathSync(root),relative=path.relative(temp,physical);assert(relative.startsWith('cars-source-resume-')&&path.dirname(relative)==='.'&&!path.isAbsolute(relative));
  const unlinkAliases=dir=>{for(const name of fs.readdirSync(dir)){const file=path.join(dir,name),s=fs.lstatSync(file);if(s.isSymbolicLink())fs.unlinkSync(file);else if(s.isDirectory())unlinkAliases(file);}};
  unlinkAliases(physical);fs.rmSync(physical,{recursive:true});
 });
 const dealer='owned-test-cars',area='runtime/new-dealer-source/local-test-1/'+dealer,candidate=path.join(root,'clients',dealer);
 const files={'docs/source-request.json':'{"reviewed":true}\n','docs/source-facts.json':'{"dealer":"owned-test-cars"}\n','templates.lock.json':'{"templates":"reviewed"}\n','scripts/prepare-new-dealer-source.mjs':'// maintained fixture orchestration\n','scripts/lib/new-source-resume.mjs':'// maintained fixture helper\n'};
 for(const [name,bytes]of Object.entries(files)){const file=path.join(root,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,bytes);}
 fs.mkdirSync(path.join(root,'clients'));
 const pin=name=>({path:name,sha256:hash(files[name])});
 const pins={identity:{dealer,dealerId:'us-fixture-owned',repository:'darkapoparka/owned-test-cars',workerName:'cars-owned-test',publicOrigin:'https://cars-owned-test.darkapoparka1.workers.dev'},
  request:pin('docs/source-request.json'),base:{commit:'1'.repeat(40),rootTree:'2'.repeat(40)},approvedLockSha256:hash(files['templates.lock.json']),registrySha256:'3'.repeat(64),clientIndexSha256:'4'.repeat(64),
  sourceReleases:Object.fromEntries(sourceKeys.map(key=>[key,{repository:'darkapoparka/cars',revision:'5'.repeat(40),path:'templates/'+key,tree:'6'.repeat(40),digest:'7'.repeat(64)}])),inputLeaseSha256:'8'.repeat(64),branchAbsenceSha256:'9'.repeat(64),
  inputs:[pin('docs/source-facts.json'),pin('templates.lock.json')],orchestration:[pin('scripts/prepare-new-dealer-source.mjs'),pin('scripts/lib/new-source-resume.mjs')]};
 return {root,dealer,area,candidate,pins,options:{root,dealer,area,pins}};
}
function created(f,run){const writer=run.begin('create-client');writer.writeMap(new Map([['dealer.json',Buffer.from('{"fixture":true}\n')]]));run.checkpoint('create-client',{creationReceiptSha256:'a'.repeat(64),applications:6});}
const reopen=(f,ownerId)=>openNewSourceResume({...f.options,ownerId});

function phaseFixture(f,calls,{failBefore=null,partial=null}={}){
 return Object.fromEntries(NEW_SOURCE_RESUME_STAGES.map(stage=>[stage,async(summaries,writer)=>{
  calls.push(stage);
  if(stage===failBefore){if(partial){const base=partial==='output'?path.join(f.root,f.area,'output'):f.candidate;fs.mkdirSync(base,{recursive:true});fs.writeFileSync(path.join(base,'partial.json'),'retained partial work');}throw Error('Injected interruption at '+stage);}
  if(stage==='create-client'){writer.writeMap(new Map([['dealer.json',Buffer.from('creator source')]]));return {creationReceiptSha256:'a'.repeat(64),applications:6};}
  if(stage==='emit-proposal'){assert.equal(summaries['create-client'].applications,6);assert.equal(summaries['adapt-extended'].appProvenance.source,'actual prior stage');assert.equal(summaries['adapt-primary'].changes.modern,'retained');assert.equal(summaries['adapt-extended'].adaptations.mobile.nativeFacts,true);const output=path.join(f.root,f.area,'output');writer.writeFile(path.join(output,'receipt.json'),Buffer.from('final proposal'));return {result:{preparedTree:'b'.repeat(40),published:false}};}
  writer.writeFile(path.join(f.candidate,stage+'.json'),Buffer.from(JSON.stringify({stage})));
  return stage==='adapt-primary'?{changes:{modern:'retained'}}:stage==='adapt-extended'?{appProvenance:{source:'actual prior stage'},adaptations:{mobile:{nativeFacts:true},'karento-best':{nativeFacts:true}}}:{stage};
 }]));
}

test('production continuation resumes each checkpoint without repeating creator or losing seal summaries',async t=>{
 for(const interrupted of NEW_SOURCE_RESUME_STAGES.slice(1)){
  const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId,calls=[];
  await assert.rejects(continueNewSourceResume(run,phaseFixture(f,calls,{failBefore:interrupted})),/Injected interruption/);run.close();
  const before=[...calls],resumed=reopen(f,owner),result=await continueNewSourceResume(resumed,phaseFixture(f,calls));assert.equal(result.result.preparedTree,'b'.repeat(40));assert.equal(calls.filter(x=>x==='create-client').length,1);for(const completed of NEW_SOURCE_RESUME_STAGES.slice(0,NEW_SOURCE_RESUME_STAGES.indexOf(interrupted)))assert.equal(calls.filter(x=>x===completed).length,1,completed);assert.equal(calls.filter(x=>x===interrupted).length,2);assert(before.includes(interrupted));resumed.close();
  const complete=reopen(f,owner);assert.deepEqual(await continueNewSourceResume(complete,Object.fromEntries(NEW_SOURCE_RESUME_STAGES.map(stage=>[stage,()=>{throw Error('Completed stage repeated');}]))),result);complete.close();
 }
});

test('continuation retains partially written candidate/proposal files and refuses automatic recovery',async t=>{
 for(const [failBefore,partial]of [['adapt-primary','candidate'],['emit-proposal','output']]){const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;await assert.rejects(continueNewSourceResume(run,phaseFixture(f,[],{failBefore,partial})),/Injected interruption/);run.close();assert.throws(()=>reopen(f,owner),/partial|changed/);const file=path.join(partial==='output'?path.join(f.root,f.area,'output'):f.candidate,'partial.json');assert.equal(fs.readFileSync(file,'utf8'),'retained partial work');}
});

test('only a live owned controller with exact current files can exempt its completed creator candidate',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options);assert.equal(ownedNewSourceCandidate(run,{root:f.root,dealer:f.dealer}),null);assert.throws(()=>ownedNewSourceCandidate({...run},{root:f.root,dealer:f.dealer}),/Owned source controller/);created(f,run);assert.equal(ownedNewSourceCandidate(run,{root:f.root,dealer:f.dealer}).path,'clients/'+f.dealer);assert.throws(()=>ownedNewSourceCandidate(run,{root:f.root,dealer:'another-dealer'}),/Owned source controller/);fs.appendFileSync(path.join(f.candidate,'dealer.json'),'user change');assert.throws(()=>ownedNewSourceCandidate(run,{root:f.root,dealer:f.dealer}),/changed/);run.close();assert.throws(()=>ownedNewSourceCandidate(run,{root:f.root,dealer:f.dealer}),/closed/);
});

test('the full production code inventory fits its explicit bound and an oversized inventory fails before ownership writes',t=>{
 const f=fixture(t);for(let index=0;index<127;index++){const relative='scripts/pinned-helper-'+index+'.mjs',bytes='// exact source '+index;fs.writeFileSync(path.join(f.root,relative),bytes);if(f.pins.orchestration.length<128)f.pins.orchestration.push({path:relative,sha256:hash(bytes)});}
 assert.equal(f.pins.orchestration.length,128);const run=createNewSourceResume(f.options);run.close();const overflow=structuredClone(f.pins),relative='scripts/overflow.mjs';fs.writeFileSync(path.join(f.root,relative),'overflow');overflow.orchestration.push({path:relative,sha256:hash('overflow')});assert.throws(()=>openNewSourceResume({...f.options,pins:overflow,ownerId:run.ownerId}),/Bounded resume input\/code/);
});

test('interruption before any creator writes resumes exactly; no implicit adoption follows an interrupted creation',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;run.begin('create-client');run.close();
 const resumed=reopen(f,owner);assert.equal(resumed.nextStage,'create-client');resumed.begin('create-client');fs.mkdirSync(f.candidate);fs.writeFileSync(path.join(f.candidate,'retained.txt'),'partial creator output');resumed.close();
 assert.throws(()=>reopen(f,owner),/partial|changed/);assert.equal(fs.readFileSync(path.join(f.candidate,'retained.txt'),'utf8'),'partial creator output');
 assert.throws(()=>createNewSourceResume(f.options),/Existing source attempt/);
});

test('completed checkpoint resumes the next maintained stage and retains adapter/seal summaries',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);run.close();let current=reopen(f,owner);
 assert.equal(current.nextStage,'stage-inputs');assert.equal(current.state.summaries['create-client'].applications,6);
 for(const stage of NEW_SOURCE_RESUME_STAGES.slice(1)){
  const writer=current.begin(stage);if(stage!=='emit-proposal')writer.writeFile(path.join(f.candidate,stage+'.txt'),Buffer.from(stage));
  if(stage==='emit-proposal'){const output=path.join(f.root,f.area,'output');writer.writeFile(path.join(output,'source-patch.json'),Buffer.from('proposal fixture'));}
  current.checkpoint(stage,{changes:[stage],appProvenance:{profileSha256:'b'.repeat(64)},adaptations:{mobile:{contentPaths:['mobile/data.json']},'karento-best':{nativeFacts:true}}});
  current.close();current=reopen(f,owner);
 }
 assert.equal(current.nextStage,null);assert.equal(current.state.history.length,7);assert.equal(current.state.summaries['adapt-extended'].adaptations['karento-best'].nativeFacts,true);assert.throws(()=>current.begin(undefined),/stage order/);assert.throws(()=>current.checkpoint(undefined,{}),/active owned stage/);
 const exposed=current.state;exposed.summaries['create-client'].applications=0;assert.equal(current.state.summaries['create-client'].applications,6);current.close();
});

test('an in-memory-only stage failure can resume; partial candidate or proposal writes cannot',t=>{
 for(const kind of ['no-disk-write','candidate-write','output-write']){
  const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);run.begin('stage-inputs');
  if(kind==='candidate-write')fs.writeFileSync(path.join(f.candidate,'new-facts.json'),'partial');
  if(kind==='output-write'){const output=path.join(f.root,f.area,'output');fs.mkdirSync(output);fs.writeFileSync(path.join(output,'partial.json'),'partial');}
  run.close();if(kind==='no-disk-write'){const resumed=reopen(f,owner);assert.equal(resumed.nextStage,'stage-inputs');resumed.begin('stage-inputs');resumed.close();}else assert.throws(()=>reopen(f,owner),/partial|changed/);
 }
});

test('modified, added, deleted, case-renamed and linked candidate files are held with original work preserved',t=>{
 const mutations={modified:f=>fs.appendFileSync(path.join(f.candidate,'dealer.json'),'user edit'),added:f=>fs.writeFileSync(path.join(f.candidate,'user-note.txt'),'user note'),deleted:f=>fs.unlinkSync(path.join(f.candidate,'dealer.json')),
  emptyDirectory:f=>fs.mkdirSync(path.join(f.candidate,'user-directory')),caseRenamed:f=>fs.renameSync(path.join(f.candidate,'dealer.json'),path.join(f.candidate,'DEALER.json')),
  hardLinked:f=>fs.linkSync(path.join(f.candidate,'dealer.json'),path.join(f.candidate,'linked.json')),symbolicFile:f=>fs.symlinkSync(path.join(f.root,'docs/source-facts.json'),path.join(f.candidate,'facts-link.json'),'file'),
  junction:f=>fs.symlinkSync(path.join(f.root,'docs'),path.join(f.candidate,'other-inputs'),process.platform==='win32'?'junction':'dir')};
 for(const mutate of Object.values(mutations)){const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);run.close();mutate(f);assert.throws(()=>reopen(f,owner),/changed|partial|[Ll]ink|regular file|alias/);assert(fs.existsSync(f.candidate));}
});

test('changed request, source/base/lock, ownership and orchestration pins never rebind an owned candidate',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);run.close();
 const changes=[p=>p.request.sha256='f'.repeat(64),p=>p.base.commit='f'.repeat(40),p=>p.base.rootTree='f'.repeat(40),p=>p.approvedLockSha256='f'.repeat(64),p=>p.sourceReleases.mobile.revision='f'.repeat(40),p=>p.inputLeaseSha256='f'.repeat(64),p=>p.branchAbsenceSha256='f'.repeat(64),p=>p.identity.repository='darkapoparka/another',p=>p.orchestration[0].sha256='f'.repeat(64)];
 for(const change of changes){const pins=structuredClone(f.pins);change(pins);assert.throws(()=>openNewSourceResume({...f.options,ownerId:owner,pins}),/changed|differ|identity/);}
 assert.throws(()=>reopen(f,'ffffffff-ffff-4fff-8fff-ffffffffffff'),/ownership/);
 fs.appendFileSync(path.join(f.root,'scripts/prepare-new-dealer-source.mjs'),'// new stage code');assert.throws(()=>reopen(f,owner),/orchestration bytes changed/);
});

test('live stage ownership rechecks inputs, code, checkpoint and exact lock bytes before proceeding',t=>{
 for(const kind of ['input','code','journal','lock']){
  const f=fixture(t),run=createNewSourceResume(f.options);created(f,run);
  const file=kind==='input'?path.join(f.root,'docs/source-facts.json'):kind==='code'?path.join(f.root,'scripts/prepare-new-dealer-source.mjs'):kind==='journal'?path.join(f.root,f.area,'source-progress.json'):path.join(f.root,'runtime/locks/new-dealer-source',f.dealer,'owner.json');
  const original=fs.readFileSync(file);fs.appendFileSync(file,'changed');assert.throws(()=>run.begin('stage-inputs'),/changed|ownership/);fs.writeFileSync(file,original);run.close();
 }
});

test('existing per-dealer locks are never taken over, including same-owner or stale-looking files',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;
 assert.throws(()=>reopen(f,owner),/no takeover/);assert.throws(()=>createNewSourceResume({...f.options,ownerId:owner}),/no takeover/);
 const file=path.join(f.root,'runtime/locks/new-dealer-source',f.dealer,'owner.json'),original=fs.readFileSync(file);fs.writeFileSync(file,'{"pid":99999999,"startedAt":"2000-01-01"}');
 assert.throws(()=>run.close(),/ownership changed/);assert(fs.existsSync(file));fs.writeFileSync(file,original);run.close();assert.equal(fs.existsSync(path.dirname(file)),false);
});

test('checkpoint rename failure preserves the prior checkpoint and pending bytes and holds resume',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);run.close();const file=path.join(f.root,f.area,'source-progress.json'),before=fs.readFileSync(file);
 assert.throws(()=>atomicNewSourceResumeWrite(file,Buffer.from('new checkpoint bytes'),{rename(){throw Error('simulated disk/rename failure');}}),/simulated/);
 assert(fs.readFileSync(file).equals(before));const pending=fs.readdirSync(path.dirname(file)).filter(n=>n.startsWith('source-progress.json.pending-'));assert.equal(pending.length,1);assert.equal(fs.readFileSync(path.join(path.dirname(file),pending[0]),'utf8'),'new checkpoint bytes');
 assert.throws(()=>reopen(f,owner),/Uncertain checkpoint/);assert(fs.existsSync(f.candidate));
});

test('summary and journal bounds reject unsupported or oversized data without advancing the stage',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options);created(f,run);run.begin('stage-inputs');
 assert.throws(()=>run.checkpoint('stage-inputs',{unsupported:new Map()}),/plain JSON/);assert.throws(()=>run.checkpoint('stage-inputs',{oversized:'x'.repeat(NEW_SOURCE_RESUME_LIMITS.summaryBytes)}),/summary exceeds/);
 assert.equal(run.state.completed,0);assert.throws(()=>run.begin('brand-and-seal'),/stage order/);assert.throws(()=>atomicNewSourceResumeWrite(path.join(f.root,f.area,'oversized.json'),Buffer.alloc(NEW_SOURCE_RESUME_LIMITS.stateBytes+1)),/bounded journal/);run.close();
});

test('physical root, traversal and unjournaled old candidates fail closed',t=>{
 const f=fixture(t);fs.mkdirSync(f.candidate);fs.writeFileSync(path.join(f.candidate,'owner-work.txt'),'preserve old failure');assert.throws(()=>createNewSourceResume(f.options),/Unjournaled/);assert.equal(fs.readFileSync(path.join(f.candidate,'owner-work.txt'),'utf8'),'preserve old failure');
 assert.throws(()=>createNewSourceResume({...f.options,area:'runtime/new-dealer-source/../'+f.dealer}),/path/);const alias=path.join(f.root,'root-alias');fs.symlinkSync(f.root,alias,process.platform==='win32'?'junction':'dir');assert.throws(()=>captureNewSourceResumeState(alias,'clients/'+f.dealer),/physical workspace/);
});

test('a dangling link is an occupied unsafe path, never an absent candidate',t=>{
 const f=fixture(t);fs.symlinkSync(path.join(f.root,'missing-target'),f.candidate,process.platform==='win32'?'junction':'dir');
 assert.throws(()=>createNewSourceResume(f.options),/[Ll]ink|alias/);assert(fs.lstatSync(f.candidate).isSymbolicLink());
});

test('candidate stages cannot bless unexpected proposal files and proposal emission cannot bless candidate edits',t=>{
 for(const kind of ['early-output','late-candidate-edit']){
  const f=fixture(t),run=createNewSourceResume(f.options),owner=run.ownerId;created(f,run);
  if(kind==='late-candidate-edit')for(const stage of NEW_SOURCE_RESUME_STAGES.slice(1,-1)){run.begin(stage);run.checkpoint(stage,{});}
  const stage=run.nextStage;run.begin(stage);
  if(kind==='early-output'){const output=path.join(f.root,f.area,'output');fs.mkdirSync(output);fs.writeFileSync(path.join(output,'user-output.txt'),'preserve');}
  else fs.appendFileSync(path.join(f.candidate,'dealer.json'),'user edit');
  assert.throws(()=>run.checkpoint(stage,{}),/Unaccounted concurrent|outside its candidate\/output ownership/);run.close();assert.throws(()=>reopen(f,owner),/partial|changed/);
 }
});

test('asynchronous collected-map conflicts preserve touched edits and unrelated edits or additions',async t=>{
 for(const kind of ['touched','unrelated-edit','unrelated-add']){
  const f=fixture(t),run=createNewSourceResume(f.options);created(f,run);
  const initial=run.begin('stage-inputs');initial.writeFile(path.join(f.candidate,'other.txt'),Buffer.from('original other'));run.checkpoint('stage-inputs',{});
  const writer=run.begin('adapt-primary'),target=path.join(f.candidate,'dealer.json'),other=path.join(f.candidate,kind==='unrelated-add'?'user-note.txt':'other.txt'),before=new Map([['dealer.json',fs.readFileSync(target)]]);
  await Promise.resolve().then(()=>fs.writeFileSync(kind==='touched'?target:other,'concurrent owner work'));
  assert.throws(()=>writer.writeMap(new Map([['dealer.json',Buffer.from('planned adapter output')]]),before),/Unaccounted|preimage/);
  assert.equal(fs.readFileSync(kind==='touched'?target:other,'utf8'),'concurrent owner work');
  if(kind!=='touched')assert.equal(fs.readFileSync(target,'utf8'),before.get('dealer.json').toString());
  assert.throws(()=>run.checkpoint('adapt-primary',{}),/Unaccounted/);assert.equal(run.state.completed,1);run.close();
 }
});

test('direct writers reject stale preimages and checkpoints refuse mutations outside recorded writes',t=>{
 const f=fixture(t),run=createNewSourceResume(f.options);created(f,run);const writer=run.begin('stage-inputs'),target=path.join(f.candidate,'dealer.json');
 fs.writeFileSync(target,'concurrent current owner');assert.throws(()=>writer.writeFile(target,Buffer.from('overwriting output')),/preimage changed/);assert.equal(fs.readFileSync(target,'utf8'),'concurrent current owner');run.close();
 const other=fixture(t),owned=createNewSourceResume(other.options);created(other,owned);const active=owned.begin('stage-inputs');active.writeFile(path.join(other.candidate,'owned.txt'),Buffer.from('owned output'));fs.writeFileSync(path.join(other.candidate,'foreign.txt'),'foreign retained output');
 assert.throws(()=>owned.checkpoint('stage-inputs',{}),/Unaccounted concurrent/);assert.equal(owned.state.completed,0);assert.equal(fs.readFileSync(path.join(other.candidate,'foreign.txt'),'utf8'),'foreign retained output');owned.close();
});

test('creator installs only its immutable declared file set and retains unexpected staging work',t=>{
 for(const foreign of [false,true]){
  const f=fixture(t),run=createNewSourceResume(f.options),writer=run.begin('create-client'),staged=path.join(f.root,'runtime/new-clients',f.dealer+'-proof/dealer'),file=path.join(staged,'package.json');
  const bytes=Buffer.from('{"name":"pinned-tiny-source"}\n'),proof=writer.writeDetached(file,bytes),declared=new Map([['package.json',{sha256:hash(bytes),mode:proof.mode}]]);
  if(foreign){fs.writeFileSync(path.join(staged,'user-note.txt'),'keep this staging edit');assert.throws(()=>writer.installTree(staged,declared),/declared|declaration/);assert.equal(fs.readFileSync(path.join(staged,'user-note.txt'),'utf8'),'keep this staging edit');assert.equal(fs.existsSync(f.candidate),false);}
  else {writer.installTree(staged,declared);run.checkpoint('create-client',{applications:6});assert.equal(fs.readFileSync(path.join(f.candidate,'package.json'),'utf8'),bytes.toString());assert.equal(run.state.history[0].writes[0].path,'@install');}
  run.close();
 }
});

test('invocation-local mutation interfaces preserve ordinary writers and isolate asynchronous callers',async()=>{
 const calls=[],file='fixture-output',bytes=Buffer.from('fixture');
 assert.equal(sourceMutationWrite(file,bytes,()=> 'ordinary result'),'ordinary result');
 await Promise.all([withSourceMutationWriter({writeFile:(name,value)=>calls.push(['first',name,value.toString()])},async()=>{await Promise.resolve();sourceMutationWrite(file,bytes,()=>assert.fail('fallback inside owned scope'));}),withSourceMutationWriter({writeFile:(name,value)=>calls.push(['second',name,value.toString()])},async()=>{await Promise.resolve();sourceMutationWrite(file,bytes,()=>assert.fail('fallback inside owned scope'));})]);
 assert.deepEqual(calls.map(row=>row[0]).sort(),['first','second']);assert.equal(sourceMutationWrite(file,bytes,()=> 'still ordinary'),'still ordinary');
});

test('real immutable materialization declares raw Git bytes and installs through the owned creator seam',async t=>{
 const f=fixture(t),source=path.join(f.root,'templates/auto-best');fs.mkdirSync(source,{recursive:true});fs.writeFileSync(path.join(source,'package.json'),'{"name":"tiny-canonical-source"}\r\n');
 const git=args=>execFileSync('git',['-C',f.root,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}).trim();
 git(['init','-q']);git(['-c','core.autocrlf=false','add','--','templates/auto-best/package.json']);git(['-c','user.name=Source proof fixture','-c','user.email=fixture@example.invalid','commit','-qm','tiny immutable source fixture']);
 const revision=git(['rev-parse','HEAD']),tree=git(['rev-parse',revision+':templates/auto-best']),digest=fingerprint(source).digest,sourceRef={repository:'darkapoparka/cars',revision,path:'templates/auto-best',tree,digest},release={status:'approved',repository:sourceRef.repository,commit:revision,snapshotPath:sourceRef.path,exportPolicy:POLICY,digest,source:sourceRef};
 const run=createNewSourceResume(f.options),writer=run.begin('create-client'),staged=path.join(f.root,'runtime/new-clients',f.dealer+'-tiny/dealer');
 const materialized=await materializeTemplateSource({root:f.root,key:'auto-best',release,source:sourceRef,destination:path.join(staged,'auto-best'),mutationWriter:writer});
 const declarations=new Map(materialized.declaredFiles.map(row=>['auto-best/'+row.path,{sha256:row.sha256,mode:row.mode}]));writer.installTree(staged,declarations);run.checkpoint('create-client',{applications:6});
 assert.equal(fs.readFileSync(path.join(f.candidate,'auto-best/package.json'),'utf8'),'{"name":"tiny-canonical-source"}\r\n');assert.equal(run.state.completed,0);run.close();
});

test('maintained creator optional proof installs fresh pinned source and preserves an injected metadata edit',async t=>{
 for(const concurrent of [false,true]){
  const f=fixture(t),keys=['auto-best','modern','carwow'];
  for(const key of keys){const dir=path.join(f.root,'templates',key);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify({name:key})+'\n');}
  const git=args=>execFileSync('git',['-C',f.root,...args],{encoding:'utf8',windowsHide:true,env:{...process.env,GIT_NO_LAZY_FETCH:'1'}}).trim();git(['init','-q']);git(['-c','core.autocrlf=false','add','--','templates']);git(['-c','user.name=Creator proof fixture','-c','user.email=fixture@example.invalid','commit','-qm','tiny creator source']);const revision=git(['rev-parse','HEAD']);
  const releases=Object.fromEntries(keys.map(key=>{const source={repository:'darkapoparka/cars',revision,path:'templates/'+key,tree:git(['rev-parse',revision+':templates/'+key]),digest:fingerprint(path.join(f.root,'templates',key)).digest};return[key,{status:'approved',repository:source.repository,commit:revision,snapshotPath:source.path,exportPolicy:POLICY,digest:source.digest,source}];}));
  const lockBytes=Buffer.from(JSON.stringify({templates:releases}));fs.writeFileSync(path.join(f.root,'templates.lock.json'),lockBytes);f.pins.inputs.find(row=>row.path==='templates.lock.json').sha256=hash(lockBytes);f.pins.approvedLockSha256=hash(lockBytes);fs.writeFileSync(path.join(f.root,'workspace.json'),JSON.stringify({machinePaths:{[process.platform]:f.root}}));
  const manifest={schemaVersion:1,slug:f.dealer,dealerId:'us-fixture-owned',repository:'darkapoparka/cars-ownedtest',defaultBranch:'main',variants:keys.map((key,i)=>({key,base:i?'/variant-'+(i+1):'',entry:i?(key==='modern'?'/variant-2/cars':'/variant-3/'):'/'})),extraAssets:[],packaging:{version:'1'},templateSources:Object.fromEntries(keys.map(key=>[key,releases[key].source])),templateRevisions:Object.fromEntries(keys.map(key=>[key,revision]))};
  const plan={root:f.root,client:f.dealer,clientRoot:f.candidate,manifest,checkout:{head:revision},plans:keys.map(key=>({template:key,release:releases[key],sourceRef:releases[key].source,destination:path.join(f.candidate,key),homes:[{id:'home'}]}))};
  const readGit=(root,args)=>args[0]==='config'?'https://github.com/darkapoparka/cars.git':args[0]==='branch'?'main':args[0]==='ls-remote'?revision+'\trefs/heads/main':args[0]==='rev-parse'?revision:assert.fail('Unexpected fixture checkout read');
  const run=createNewSourceResume(f.options),writer=run.begin('create-client');let changedFile=null;
  const injected={...writer,writeDetached(file,bytes,previous){const proof=writer.writeDetached(file,bytes,previous);if(concurrent&&!changedFile&&file.endsWith(path.join('.template','source-manifest.json'))){changedFile=file;queueMicrotask(()=>fs.appendFileSync(file,'\nconcurrent creator metadata edit'));}return proof;}};
  if(concurrent){await assert.rejects(createNewClient(plan,{readGit,mutationWriter:injected}),/preimage changed/);assert.match(fs.readFileSync(changedFile,'utf8'),/concurrent creator metadata edit/);assert.equal(fs.existsSync(f.candidate),false);assert.equal(run.state.completed,-1);}
  else {const result=await createNewClient(plan,{readGit,mutationWriter:injected});run.checkpoint('create-client',{applications:result.applications});assert.equal(result.applications,3);assert(fs.existsSync(result.receipt));assert.equal(run.state.completed,0);}
  run.close();
 }
});

test('malformed optional proof interfaces hold before creator or materializer filesystem work',async()=>{
 await assert.rejects(createNewClient({}, {mutationWriter:{}}),/proof-capable creator writer/);
 await assert.rejects(materializeTemplateSource({mutationWriter:{}}),/proof-capable materializer writer/);
});
