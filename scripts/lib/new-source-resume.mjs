import fs from 'node:fs';
import path from 'node:path';
import {createHash,randomUUID} from 'node:crypto';

export const NEW_SOURCE_RESUME_STAGES=Object.freeze(['create-client','stage-inputs','adapt-primary','adapt-extended','regenerate-catalogs','brand-and-seal','emit-proposal']);
export const NEW_SOURCE_RESUME_LIMITS=Object.freeze({files:50000,bytes:8*1024**3,fileBytes:256*1024**2,stateBytes:16*1024**2,summaryBytes:1024**2});
const families=['auto-best','modern','import','app','mobile','karento-best'];
const controllers=new WeakMap();
const fail=(value,message)=>{if(!value)throw Error(message);};
const hex=(v,n)=>typeof v==='string'&&new RegExp('^[a-f0-9]{'+n+'}$').test(v);
const uuid=v=>/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v??'');
const slug=v=>typeof v==='string'&&v.length<=64&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v);
const safe=v=>typeof v==='string'&&v.length<=4096&&!/[\\:\u0000-\u001f\u007f]/.test(v)&&!v.startsWith('/')&&v.split('/').every(p=>p&&p!=='.'&&p!=='..');
const canonical=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const digest=v=>createHash('sha256').update(typeof v==='string'||Buffer.isBuffer(v)?v:canonical(v)).digest('hex');
const same=(a,b)=>canonical(a)===canonical(b);
const encode=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const clone=v=>structuredClone(v);
function jsonValue(v){
 fail(v===null||['string','boolean'].includes(typeof v)||typeof v==='number'&&Number.isFinite(v)||Array.isArray(v)||v&&typeof v==='object'&&Object.getPrototypeOf(v)===Object.prototype,'Resume summaries must contain finite plain JSON values');
 if(v&&typeof v==='object')for(const x of Object.values(v))jsonValue(x);
}
function exactKeys(v,names,label){fail(v&&typeof v==='object'&&!Array.isArray(v)&&same(Object.keys(v).sort(),[...names].sort()),'Invalid resume '+label+' shape');}
function physicalRoot(root){const resolved=path.resolve(root);fail(fs.realpathSync(resolved)===resolved&&!fs.lstatSync(resolved).isSymbolicLink()&&fs.statSync(resolved).isDirectory(),'Resume requires the canonical physical workspace root');return resolved;}
function physicalPath(root,relative){
 fail(safe(relative),'Unsafe resume path');let current=root,missing=false;
 for(const part of relative.split('/')){current=path.join(current,part);let stat;try{stat=fs.lstatSync(current);}catch(error){if(error.code!=='ENOENT')throw error;missing=true;break;}fail(!stat.isSymbolicLink()&&fs.realpathSync(current)===current,'Linked or aliased resume path');}
 const target=path.join(root,...relative.split('/')),inside=path.relative(root,target);fail(inside&&!inside.startsWith('..')&&!path.isAbsolute(inside),'Resume path escaped workspace');return {target,missing};
}
function regularFile(file,max){const s=fs.lstatSync(file);fail(s.isFile()&&!s.isSymbolicLink()&&s.nlink===1&&s.size<=max,'Resume evidence must be a bounded unlinked regular file');return s;}
function fileHash(file,max){
 const before=regularFile(file,max),hash=createHash('sha256'),buffer=Buffer.alloc(64*1024),fd=fs.openSync(file,'r');let bytes=0;
 try{for(let count;(count=fs.readSync(fd,buffer,0,buffer.length,null))>0;){bytes+=count;fail(bytes<=max,'Resume file exceeded bound');hash.update(buffer.subarray(0,count));}}finally{fs.closeSync(fd);}
 const after=regularFile(file,max);fail(bytes===before.size&&['size','mode','ino','dev','mtimeMs','ctimeMs'].every(k=>before[k]===after[k]),'Resume file changed while being read');return {sha256:hash.digest('hex'),bytes,stat:after};
}
function metadata(s){return {mode:s.mode&0o777,ino:s.ino,dev:s.dev,mtimeMs:s.mtimeMs,ctimeMs:s.ctimeMs};}
/** Full candidate/output state, including empty directories and non-publisher files. */
export function captureNewSourceResumeState(root,relative,{budget={files:0,bytes:0}}={}){
 root=physicalRoot(root);const {target}=physicalPath(root,relative);if(!fs.existsSync(target))return {exists:false,entries:[]};
 fail(fs.lstatSync(target).isDirectory(),'Resume state root must be a directory');const entries=[],folded=new Set();
 function walk(directory,prefix=''){
  for(const name of fs.readdirSync(directory).sort()){
   const relativeName=prefix+name;fail(safe(relativeName)&&!folded.has(relativeName.toLowerCase()),'Unsafe or case-aliased resume entry');folded.add(relativeName.toLowerCase());
   const file=path.join(directory,name),s=fs.lstatSync(file);fail(!s.isSymbolicLink()&&fs.realpathSync(file)===file,'Linked or aliased candidate entry');
   if(s.isDirectory()){entries.push({path:relativeName,type:'directory',...metadata(s)});walk(file,relativeName+'/');}
   else{fail(++budget.files<=NEW_SOURCE_RESUME_LIMITS.files,'Resume file inventory exceeds bound');const h=fileHash(file,NEW_SOURCE_RESUME_LIMITS.fileBytes);budget.bytes+=h.bytes;fail(budget.bytes<=NEW_SOURCE_RESUME_LIMITS.bytes,'Resume bytes exceed bound');entries.push({path:relativeName,type:'file',bytes:h.bytes,sha256:h.sha256,...metadata(h.stat)});}
   fail(entries.length<=NEW_SOURCE_RESUME_LIMITS.files*2,'Resume entry inventory exceeds bound');
  }
 }
 walk(target);entries.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);return {exists:true,root:metadata(fs.statSync(target)),entries};
}
function pinsFor(root,dealer,pins){
 exactKeys(pins,['identity','request','base','approvedLockSha256','registrySha256','clientIndexSha256','sourceReleases','inputLeaseSha256','branchAbsenceSha256','inputs','orchestration'],'pins');
 exactKeys(pins.identity,['dealer','dealerId','repository','workerName','publicOrigin'],'identity');
 fail(pins.identity.dealer===dealer&&typeof pins.identity.dealerId==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(pins.identity.dealerId)&&/^darkapoparka\/[a-z0-9][a-z0-9.-]{0,99}$/.test(pins.identity.repository)&&pins.identity.repository!=='darkapoparka/cars'&&slug(pins.identity.workerName)&&pins.identity.publicOrigin==='https://'+pins.identity.workerName+'.darkapoparka1.workers.dev','Resume identity differs');
 exactKeys(pins.base,['commit','rootTree'],'base');fail(hex(pins.base.commit,40)&&hex(pins.base.rootTree,40),'Exact resume source base required');
 for(const k of ['approvedLockSha256','registrySha256','clientIndexSha256','inputLeaseSha256','branchAbsenceSha256'])fail(hex(pins[k],64),'Exact resume '+k+' required');
 exactKeys(pins.sourceReleases,families,'six sources');for(const key of families){const s=pins.sourceReleases[key];exactKeys(s,['repository','revision','path','tree','digest'],'source');fail(s.repository==='darkapoparka/cars'&&s.path==='templates/'+key&&hex(s.revision,40)&&hex(s.tree,40)&&hex(s.digest,64),'Exact resume template source required');}
 fail(Array.isArray(pins.inputs)&&pins.inputs.length>0&&pins.inputs.length<=450&&Array.isArray(pins.orchestration)&&pins.orchestration.length>0&&pins.orchestration.length<=128,'Bounded resume input/code inventories required');
 const seen=new Set();for(const [kind,rows]of [['request',[pins.request]],['inputs',pins.inputs],['orchestration',pins.orchestration]])for(const row of rows){exactKeys(row,['path','sha256'],'file pin');fail(safe(row.path)&&hex(row.sha256,64)&&!seen.has(row.path.toLowerCase()),'Invalid or duplicate resume file pin');seen.add(row.path.toLowerCase());fail(kind!=='orchestration'||row.path.startsWith('scripts/'),'Resume code pins must identify maintained scripts');const {target}=physicalPath(root,row.path);fail(fileHash(target,NEW_SOURCE_RESUME_LIMITS.fileBytes).sha256===row.sha256,'Current resume '+kind+' bytes changed: '+row.path);}
 return clone(pins);
}
function locations(root,area,dealer){
 root=physicalRoot(root);fail(slug(dealer)&&safe(area)&&area.split('/').length===4&&area.startsWith('runtime/new-dealer-source/')&&area.split('/')[3]===dealer&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(area.split('/')[2]),'Exact owned source attempt path required');
 return {root,area,areaPath:physicalPath(root,area).target,candidate:'clients/'+dealer,output:area+'/output',lock:'runtime/locks/new-dealer-source/'+dealer};
}
function mkdir(root,relative){const file=physicalPath(root,relative).target;fs.mkdirSync(file,{recursive:true});physicalPath(root,relative);return file;}
function lockFor(l,ownerId,pinsSha256){
 const parent=path.posix.dirname(l.lock);mkdir(l.root,parent);const lock=physicalPath(l.root,l.lock).target;
 try{fs.mkdirSync(lock);}catch(error){if(error.code==='EEXIST')throw Error('Existing source-resume lock requires owner reconciliation; no takeover');throw error;}
 const bytes=encode({schemaVersion:1,ownerId,leaseId:randomUUID(),pid:process.pid,area:l.area,pinsSha256}),file=path.join(lock,'owner.json');fs.writeFileSync(file,bytes,{flag:'wx'});
 const assertOwned=()=>{physicalPath(l.root,l.lock);regularFile(file,16384);fail(fs.readFileSync(file).equals(bytes),'Source-resume lock ownership changed; preserve lock');};
 const release=()=>{assertOwned();fs.unlinkSync(file);fs.rmdirSync(lock);};release.assertOwned=assertOwned;return release;
}
/** Same-directory fsync + rename; a failed temporary is retained as evidence. */
export function atomicNewSourceResumeWrite(file,bytes,{rename=fs.renameSync}={}){
 fail(Buffer.isBuffer(bytes)&&bytes.length>0&&bytes.length<=NEW_SOURCE_RESUME_LIMITS.stateBytes,'Resume state exceeds bounded journal size');
 if(fs.existsSync(file))regularFile(file,NEW_SOURCE_RESUME_LIMITS.stateBytes);
 const temporary=file+'.pending-'+randomUUID(),fd=fs.openSync(temporary,'wx');
 try{fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
 rename(temporary,file);return file;
}
function snapshot(l){const budget={files:0,bytes:0};return {candidate:captureNewSourceResumeState(l.root,l.candidate,{budget}),output:captureNewSourceResumeState(l.root,l.output,{budget})};}
const fileProof=row=>row?Object.fromEntries(['bytes','sha256','mode','ino','dev','mtimeMs','ctimeMs'].map(k=>[k,row[k]])):null;
function observedFile(file){if(!fs.existsSync(file))return null;const h=fileHash(file,NEW_SOURCE_RESUME_LIMITS.fileBytes);return {bytes:h.bytes,sha256:h.sha256,...metadata(h.stat)};}
function samePreimage(file,expected){const actual=observedFile(file);fail(same(actual,expected),'Source phase preimage changed; preserve concurrent work: '+file);}
function guardedWrite(file,bytes,expected){
 fail(Buffer.isBuffer(bytes)&&bytes.length<=NEW_SOURCE_RESUME_LIMITS.fileBytes,'Bounded owned phase bytes required');samePreimage(file,expected);
 const fd=fs.openSync(file,expected?'r+':'wx');let written;
 try{if(expected){const stat=fs.fstatSync(fd);fail(stat.isFile()&&stat.nlink===1&&same({...metadata(stat),bytes:stat.size,sha256:expected.sha256},expected),'Source phase file identity changed before write');}
  fs.writeFileSync(fd,bytes);fs.ftruncateSync(fd,bytes.length);written={bytes:bytes.length,sha256:digest(bytes),...metadata(fs.fstatSync(fd))};
 }finally{fs.closeSync(fd);}
 const after=observedFile(file);fail(same(after,written),'Source phase changed during write; preserve files');return after;
}
function phaseWriter(l,state,assertOwner){
 let expected=clone(state.snapshot),closed=false;const writes=[];
 const activeScope=state.activeStage==='emit-proposal'?'output':'candidate';
 const assertActive=()=>{fail(!closed,'Source phase writer is closed');assertOwner(false);};
 const locate=file=>{const full=path.resolve(file),base=path.join(l.root,...l[activeScope].split('/')),name=path.relative(base,full).split(path.sep).join('/');fail(safe(name)&&!name.startsWith('../')&&!path.isAbsolute(name),'Write escaped owned source phase');physicalPath(l.root,path.relative(l.root,full).split(path.sep).join('/'));return {full,base,name};};
 const rows=()=>new Map(expected[activeScope].entries.map(row=>[row.path,row]));
 function ownDirectory(file){
  const scopeRoot=path.join(l.root,...l[activeScope].split('/')),relative=path.relative(scopeRoot,file).split(path.sep).join('/');
  if(!relative){if(!expected[activeScope].exists){fail(!fs.existsSync(file),'Foreign phase directory appeared');fs.mkdirSync(file);expected[activeScope]={exists:true,root:metadata(fs.statSync(file)),entries:[]};}else fail(same(metadata(fs.statSync(file)),expected[activeScope].root),'Owned phase root directory changed');return;}
  fail(safe(relative),'Unsafe owned phase directory');ownDirectory(path.dirname(file));const map=rows(),prior=map.get(relative);
  if(prior){fail(prior.type==='directory'&&same(metadata(fs.statSync(file)),Object.fromEntries(Object.keys(metadata(fs.statSync(file))).map(k=>[k,prior[k]]))),'Owned phase directory changed');return;}
  fail(!fs.existsSync(file),'Foreign phase directory appeared');fs.mkdirSync(file);expected[activeScope].entries.push({path:relative,type:'directory',...metadata(fs.statSync(file))});refreshDirectory(path.dirname(file));
 }
 function refreshDirectory(file){const base=path.join(l.root,...l[activeScope].split('/')),name=path.relative(base,file).split(path.sep).join('/');if(!name)expected[activeScope].root=metadata(fs.statSync(file));else {const row=expected[activeScope].entries.find(r=>r.path===name);fail(row?.type==='directory','Unknown owned parent directory');Object.assign(row,metadata(fs.statSync(file)));}}
 const writer={
  writeFile(file,bytes){assertActive();bytes=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);const {full,name}=locate(file),prior=rows().get(name);fail(!prior||prior.type==='file','Owned phase target is not a file');
   const before=fileProof(prior);samePreimage(full,before);ownDirectory(path.dirname(full));const after=guardedWrite(full,bytes,before);if(!prior)refreshDirectory(path.dirname(full));
   expected[activeScope].entries=expected[activeScope].entries.filter(r=>r.path!==name);expected[activeScope].entries.push({path:name,type:'file',...after});expected[activeScope].entries.sort((a,b)=>a.path<b.path?-1:a.path>b.path?1:0);writes.push({scope:activeScope,path:name,before,after});return after;
  },
  writeMap(files,before=null){assertActive();fail(files instanceof Map&&(before===null||before instanceof Map),'Owned source maps required');fail(same(expected,snapshot(l)),'Unaccounted source phase change before map write; preserve work');for(const [name,bytes]of files){fail(safe(name),'Unsafe owned source map path');const old=before?.get(name);if(old?.equals(bytes))continue;const row=rows().get(name);if(before!==null)fail(old?row?.sha256===digest(old)&&row.bytes===old.length:!row,'Collected map preimage differs from owned source phase');writer.writeFile(path.join(l.root,...l[activeScope].split('/'),...name.split('/')),bytes);}return writer;},
  writeDetached(file,bytes,previous=null){assertActive();fail(state.activeStage==='create-client','Detached writes belong only to the maintained creator');const relative=path.relative(l.root,path.resolve(file)).split(path.sep).join('/');fail(safe(relative)&&relative.startsWith('runtime/new-clients/'+l.candidate.slice('clients/'.length)+'-'),'Detached creator write escaped its staging owner');physicalPath(l.root,relative);const actual=observedFile(file);fail(previous?actual?.sha256===previous.sha256:actual===null,'Creator metadata preimage changed; preserve work');fs.mkdirSync(path.dirname(file),{recursive:true});return guardedWrite(file,bytes,actual);},
  installTree(directory,declarations){assertActive();fail(state.activeStage==='create-client'&&!expected.candidate.exists&&declarations instanceof Map&&declarations.size>0,'Exact maintained creator install proof required');fail(same(expected,snapshot(l)),'Candidate/output changed before creator install');const relative=path.relative(l.root,directory).split(path.sep).join('/');fail(safe(relative)&&relative.startsWith('runtime/new-clients/'+l.candidate.slice(8)+'-')&&relative.endsWith('/dealer'),'Creator install escaped owned staging');const staged=captureNewSourceResumeState(l.root,relative),allowedDirectories=new Set();for(const name of declarations.keys()){fail(safe(name),'Unsafe creator declaration');for(let parent=path.posix.dirname(name);parent!=='.';parent=path.posix.dirname(parent))allowedDirectories.add(parent);}
   for(const row of staged.entries)if(row.type==='directory')fail(allowedDirectories.has(row.path),'Undeclared creator directory; preserve work');else {const wanted=declarations.get(row.path);fail(wanted&&wanted.sha256===row.sha256&&wanted.mode===row.mode,'Creator bytes/mode differ from immutable declared writes; preserve work');}
   fail(staged.entries.filter(r=>r.type==='file').length===declarations.size,'Creator declaration file set differs');physicalPath(l.root,l.candidate);fail(!fs.existsSync(path.join(l.root,...l.candidate.split('/'))),'Occupied creator destination');fs.renameSync(directory,path.join(l.root,...l.candidate.split('/')));const installedRoot=metadata(fs.statSync(path.join(l.root,...l.candidate.split('/'))));fail(['mode','ino','dev'].every(key=>installedRoot[key]===staged.root[key]),'Creator installed root identity changed');expected.candidate={...staged,root:installedRoot};writes.push({scope:'candidate',path:'@install',declarationSha256:digest([...declarations].sort(([a],[b])=>a.localeCompare(b)))});fail(same(expected,snapshot(l)),'Creator install changed outside its declared files; preserve work');
  },
  verify(){assertActive();fail(same(expected,snapshot(l)),'Unaccounted concurrent source phase mutations; preserve files and hold checkpoint');return {snapshot:clone(expected),writes:clone(writes)};},
  close(){closed=true;}
 };return Object.freeze(writer);
}
function readState(l,ownerId,pinsSha256){
 const names=fs.readdirSync(l.areaPath);fail(!names.some(n=>n.startsWith('source-progress.json.pending-')),'Uncertain checkpoint write requires manual reconciliation');
 const file=path.join(l.areaPath,'source-progress.json');regularFile(file,NEW_SOURCE_RESUME_LIMITS.stateBytes);const envelope=JSON.parse(fs.readFileSync(file,'utf8'));
 exactKeys(envelope,['state','sha256'],'checkpoint envelope');fail(hex(envelope.sha256,64)&&digest(envelope.state)===envelope.sha256,'Resume checkpoint bytes changed');const s=envelope.state;
 exactKeys(s,['schemaVersion','kind','ownerId','pinsSha256','completed','activeStage','snapshot','summaries','history'],'checkpoint');
 fail(s.schemaVersion===2&&s.kind==='cars-new-source-resume-checkpoint'&&s.ownerId===ownerId&&s.pinsSha256===pinsSha256&&Number.isInteger(s.completed)&&s.completed>=-1&&s.completed<NEW_SOURCE_RESUME_STAGES.length&&
  (s.activeStage===null||s.activeStage===NEW_SOURCE_RESUME_STAGES[s.completed+1])&&Array.isArray(s.history)&&s.history.length===s.completed+1,'Unrecognized owned source checkpoint');
 fail(same(Object.keys(s.summaries).sort(),NEW_SOURCE_RESUME_STAGES.slice(0,s.completed+1).sort()),'Resume stage summaries differ');
 for(let i=0;i<s.history.length;i++){const h=s.history[i];exactKeys(h,['stage','snapshotSha256','summarySha256','writes','writesSha256'],'history');fail(h.stage===NEW_SOURCE_RESUME_STAGES[i]&&hex(h.snapshotSha256,64)&&h.summarySha256===digest(s.summaries[h.stage])&&Array.isArray(h.writes)&&h.writes.length<=NEW_SOURCE_RESUME_LIMITS.files&&h.writesSha256===digest(h.writes),'Resume history or owned write proof changed');}
 if(s.completed>=0)fail(s.history.at(-1).snapshotSha256===digest(s.snapshot),'Resume checkpoint inventory changed');
 jsonValue(s);fail(same(s.snapshot,snapshot(l)),'Candidate/output changed or interrupted writes are partial; preserve files and review');return s;
}
function controller(l,ownerId,pinsSha256,state,release){
 const ownerFile=path.join(l.areaPath,'owner.json'),stateFile=path.join(l.areaPath,'source-progress.json'),ownerBytes=fs.readFileSync(ownerFile),owner=JSON.parse(ownerBytes);let stateBytes=fs.readFileSync(stateFile),closed=false,writer=null;
 const assertOwner=(verifyPins=true)=>{fail(!closed,'Source resume owner is closed');release.assertOwned();physicalPath(l.root,l.area);regularFile(ownerFile,NEW_SOURCE_RESUME_LIMITS.stateBytes);regularFile(stateFile,NEW_SOURCE_RESUME_LIMITS.stateBytes);
  fail(fs.readFileSync(ownerFile).equals(ownerBytes)&&fs.readFileSync(stateFile).equals(stateBytes),'Source journal ownership/checkpoint changed');fail(!fs.readdirSync(l.areaPath).some(n=>n.startsWith('source-progress.json.pending-')),'Uncertain checkpoint write requires manual reconciliation');if(verifyPins)pinsFor(l.root,owner.dealer,owner.pins);
 };
 function commit(next){assertOwner();const bytes=encode({state:next,sha256:digest(next)});atomicNewSourceResumeWrite(stateFile,bytes);state=next;stateBytes=bytes;}
 const run={ownerId,area:l.area,get nextStage(){return NEW_SOURCE_RESUME_STAGES[state.completed+1]??null;},get state(){return clone(state);},
  assertExactState(){assertOwner();fail(same(state.snapshot,snapshot(l)),'Candidate/output changed before owned resume use');return clone(state);},
  begin(stage){assertOwner();fail(typeof stage==='string'&&NEW_SOURCE_RESUME_STAGES.includes(stage)&&stage===NEW_SOURCE_RESUME_STAGES[state.completed+1]&&(!state.activeStage||state.activeStage===stage),'Resume stage order differs');fail(same(state.snapshot,snapshot(l)),'Candidate/output changed before owned stage');writer?.close();commit({...state,activeStage:stage});writer=phaseWriter(l,state,assertOwner);return writer;},
  checkpoint(stage,summary){assertOwner();fail(typeof stage==='string'&&NEW_SOURCE_RESUME_STAGES.includes(stage)&&stage===state.activeStage&&stage===NEW_SOURCE_RESUME_STAGES[state.completed+1]&&writer,'Only the active owned stage may checkpoint');jsonValue(summary);fail(encode(summary).length<=NEW_SOURCE_RESUME_LIMITS.summaryBytes,'Resume stage summary exceeds bound');const proof=writer.verify(),observed=proof.snapshot;if(stage==='create-client')fail(observed.candidate.exists,'Creator must install the canonical candidate before checkpoint');
   fail(stage==='emit-proposal'?same(observed.candidate,state.snapshot.candidate):same(observed.output,state.snapshot.output),'Stage changed files outside its candidate/output ownership');
   const next={...state,completed:state.completed+1,activeStage:null,snapshot:observed,summaries:{...state.summaries,[stage]:clone(summary)},history:[...state.history,{stage,snapshotSha256:digest(observed),summarySha256:digest(summary),writes:proof.writes,writesSha256:digest(proof.writes)}]};commit(next);writer.close();writer=null;},
  close(){if(!closed){release();writer?.close();closed=true;}}
 };controllers.set(run,{root:l.root,dealer:owner.dealer,candidate:l.candidate});return run;
}
/** An occupied candidate exemption requires a live controller minted here. */
export function ownedNewSourceCandidate(run,{root,dealer}){
 const owned=controllers.get(run);fail(owned&&owned.root===physicalRoot(root)&&owned.dealer===dealer,'Owned source controller required before candidate exemption');
 const state=run.assertExactState();return state.completed>=0&&state.snapshot.candidate.exists?{path:owned.candidate,state}:null;
}
export function createNewSourceResume({root,area,dealer,ownerId=randomUUID(),pins}){
 const l=locations(root,area,dealer);fail(uuid(ownerId),'Explicit source owner UUID required');const pinned=pinsFor(l.root,dealer,pins),pinsSha256=digest(pinned),release=lockFor(l,ownerId,pinsSha256);
 try{fail(!fs.existsSync(l.areaPath),'Existing source attempt is preserved; use explicit owned resume');fail(!fs.existsSync(physicalPath(l.root,l.candidate).target),'Unjournaled existing dealer cannot be adopted');mkdir(l.root,path.posix.dirname(area));fs.mkdirSync(l.areaPath);const owner={schemaVersion:2,kind:'cars-new-source-resume-owner',ownerId,dealer,area,pinsSha256,pins:pinned};fs.writeFileSync(path.join(l.areaPath,'owner.json'),encode(owner),{flag:'wx'});const state={schemaVersion:2,kind:'cars-new-source-resume-checkpoint',ownerId,pinsSha256,completed:-1,activeStage:null,snapshot:snapshot(l),summaries:{},history:[]};atomicNewSourceResumeWrite(path.join(l.areaPath,'source-progress.json'),encode({state,sha256:digest(state)}));return controller(l,ownerId,pinsSha256,state,release);}catch(error){release();throw error;}
}
export function openNewSourceResume({root,area,dealer,ownerId,pins}){
 const l=locations(root,area,dealer);fail(uuid(ownerId),'Explicit source owner UUID required');const pinned=pinsFor(l.root,dealer,pins),pinsSha256=digest(pinned);const ownerFile=path.join(l.areaPath,'owner.json');regularFile(ownerFile,NEW_SOURCE_RESUME_LIMITS.stateBytes);const owner=JSON.parse(fs.readFileSync(ownerFile,'utf8'));
 exactKeys(owner,['schemaVersion','kind','ownerId','dealer','area','pinsSha256','pins'],'owner');fail(owner.schemaVersion===2&&owner.kind==='cars-new-source-resume-owner'&&owner.ownerId===ownerId&&owner.dealer===dealer&&owner.area===area&&owner.pinsSha256===pinsSha256&&same(owner.pins,pinned),'Resume ownership/input/base/code pins differ; no silent rebind');
 const release=lockFor(l,ownerId,pinsSha256);try{return controller(l,ownerId,pinsSha256,readState(l,ownerId,pinsSha256),release);}catch(error){release();throw error;}
}

/** The production caller supplies its existing phase closures, never a generator.
 * Checkpoint summaries are the only context handed across an owned restart. */
export async function continueNewSourceResume(run,phases){
 fail(phases&&same(Object.keys(phases).sort(),[...NEW_SOURCE_RESUME_STAGES].sort())&&Object.values(phases).every(step=>typeof step==='function'),'Exact maintained source phases required');
 run.assertExactState();
 while(run.nextStage){const stage=run.nextStage,writer=run.begin(stage);const summary=await phases[stage](run.state.summaries,writer);run.checkpoint(stage,summary);}
 return run.state.summaries['emit-proposal'];
}
