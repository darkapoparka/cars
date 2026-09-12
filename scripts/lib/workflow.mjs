import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';

export const ROOT=path.resolve(import.meta.dirname,'../..');
export const POLICY='cars-source-v1';
export const sha256=bytes=>createHash('sha256').update(bytes).digest('hex');
export const json=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,''));
export function writeJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(value,null,2)+'\n');}
export function git(root,args,{input,env,encoding='utf8',allowFailure=false}={}){
 const r=spawnSync('git',['-C',root,...args],{input,encoding,env:{...process.env,...env},windowsHide:true,maxBuffer:256*1024*1024});
 if(r.status!==0){if(allowFailure)return null;throw new Error(`git ${args[0]} failed: ${r.stderr?.toString()||r.error?.message||r.stdout}`);}
 return encoding?r.stdout.trimEnd():r.stdout;
}
export function args(argv,values=[],flags=[]){
 const result={};for(let i=0;i<argv.length;i++){const key=argv[i].replace(/^--/,'');if(!argv[i].startsWith('--')||(!values.includes(key)&&!flags.includes(key)))throw new Error(`Unknown argument: ${argv[i]}`);if(flags.includes(key))result[key]=true;else{if(!argv[i+1]||argv[i+1].startsWith('--'))throw new Error(`Missing --${key} value`);result[key]=argv[++i];}}return result;
}
export function inside(root,relative,{mustExist=false}={}){
 const base=fs.realpathSync(root),full=path.resolve(base,relative),rel=path.relative(base,full);
 if(!rel||rel.startsWith('..'+path.sep)||rel==='..'||path.isAbsolute(rel))throw new Error(`Expected a path inside ${base}: ${relative}`);
 let current=full;while(!fs.existsSync(current))current=path.dirname(current);
 const physical=fs.realpathSync(current),physicalRel=path.relative(base,physical);
 if(physicalRel.startsWith('..'+path.sep)||physicalRel==='..'||path.isAbsolute(physicalRel))throw new Error(`Path escapes through a link: ${relative}`);
 if(mustExist&&!fs.existsSync(full))throw new Error(`Missing path: ${full}`);
 return full;
}
const omitted=new Set(['.git','.github','.vercel','.netlify','.agency-os','.auth','.codex','.claude','.agents','.openai','.template','.client','node_modules','.svelte-kit','.next','.turbo','.vite','.cache','.pnpm-store','dist','build','coverage','runtime','artifacts','audits','qa','test-results','playwright-report','blob-report','.vscode','.idea']);
export function excluded(relative){
 const parts=relative.replaceAll('\\','/').split('/'),name=parts.at(-1);
 return parts.some(p=>omitted.has(p)||p.startsWith('.next-'))||/^(AGENTS(?:\.override)?|CLAUDE)\.md$/i.test(name)||(/^\.env/.test(name)&&!/^\.env\.(example|sample|template)$/.test(name))||/\.(log|tsbuildinfo|pem|key|pfx|pid)$/i.test(name)||/(credentials|service-account|license-certificate|purchase-code)/i.test(name)&&! /\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(name);
}
// Normalize text line endings, never binary bytes. Git snapshots and Windows checkouts compare identically.
export function normalized(bytes){if(bytes.includes(0))return bytes;const text=bytes.toString('utf8');return Buffer.from(text,'utf8').equals(bytes)?Buffer.from(text.replaceAll('\r\n','\n')):bytes;}
export function filesAt(directory,{filter=relative=>!excluded(relative)}={}){
 const result=[];function walk(dir,relative=''){for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){const rel=relative?`${relative}/${e.name}`:e.name;if(!filter(rel,e.isDirectory()))continue;if(e.isSymbolicLink())throw new Error(`Retained link requires review: ${rel}`);if(e.isDirectory())walk(path.join(dir,e.name),rel);else if(e.isFile())result.push(rel);}}walk(directory);return result.sort();
}
export function fingerprint(directory,options){const files=filesAt(directory,options).map(p=>({path:p,sha256:sha256(normalized(fs.readFileSync(path.join(directory,p))))}));return{digest:sha256(JSON.stringify(files)),files};}
export function gitFiles(repo,commit,{prefix='',filter=relative=>!excluded(relative)}={}){
 if(!/^[a-f0-9]{40}$/.test(commit))throw new Error('Use an immutable 40-character commit SHA.');
 if(git(repo,['rev-parse',`${commit}^{commit}`])!==commit)throw new Error('Commit did not resolve exactly.');
 const raw=git(repo,['ls-tree','-r','-z',commit,...(prefix?['--',prefix]:[])],{encoding:null}).toString('utf8');
 return raw.split('\0').filter(Boolean).map(line=>{const[meta,p]=line.split('\t'),[mode,type,blob]=meta.split(' ');return{mode,type,blob,path:prefix?p.slice(prefix.replace(/\/$/,'').length+1):p};}).filter(f=>filter(f.path)).map(f=>{if(f.type!=='blob'||!['100644','100755'].includes(f.mode))throw new Error(`Unsupported tracked link/submodule: ${f.path}`);return f;});
}
export function exportCommit(repo,commit,destination,{prefix=''}={}){
 if(fs.existsSync(destination))throw new Error(`Destination already exists: ${destination}`);
 const files=gitFiles(repo,commit,{prefix});fs.mkdirSync(destination,{recursive:true});
 for(let i=0;i<files.length;i+=48){const batch=files.slice(i,i+48),bytes=git(repo,['cat-file','--batch'],{input:batch.map(f=>f.blob).join('\n')+'\n',encoding:null});let offset=0;for(const f of batch){const end=bytes.indexOf(10,offset),header=bytes.subarray(offset,end).toString(),size=Number(header.split(' ')[2]);if(!Number.isFinite(size))throw new Error(`Cannot read ${f.path}`);const content=bytes.subarray(end+1,end+1+size);offset=end+size+2;const target=inside(destination,f.path);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,content);if(f.mode==='100755'&&process.platform!=='win32')fs.chmodSync(target,0o755);}}
 return fingerprint(destination);
}
export function validateManifest(m){
 if(m.schemaVersion!==1||!/^[a-z0-9][a-z0-9-]{0,63}$/.test(m.slug||''))throw new Error('Invalid dealer manifest identity.');
 if(!/^[\w.-]+\/(?:cars-[a-z0-9]+|excellent-cars|day-and-night-[\w-]+)$/.test(m.repository||''))throw new Error('Record the exact owner/repository identity.');
 const keys=m.variants?.map(v=>v.key)||[],standard=['auto-best','modern','carwow'],imported=['auto-best','import','carwow'];
 if(![standard,imported].some(a=>JSON.stringify(a)===JSON.stringify(keys)))throw new Error('Supported trios: auto-best,modern,carwow or auto-best,import,carwow (ordered).');
 const routes=keys[1]==='modern'?['/','/variant-2/cars','/variant-3/']:['/','/variant-2/','/variant-3/'];
 m.variants.forEach((v,i)=>{if(v.entry!==routes[i]||v.base!==['','/variant-2','/variant-3'][i])throw new Error(`Unexpected route for ${v.key}`);});
 for(const asset of m.extraAssets||[])if(!/^[\w.-]+(?:\/[\w.-]+)*$/.test(asset)||asset.split('/').some(p=>p==='..'||p==='.'))throw new Error('Invalid extra asset path.');
 if(!/^[\w][\w/.-]*$/.test(m.defaultBranch||'main')||m.defaultBranch?.includes('..'))throw new Error('Invalid branch name.');return m;
}
export function resolveIdentity(root,slug,requestedId=null){
 if(!/^[a-z0-9][a-z0-9-]{0,63}$/.test(slug||''))throw new Error('Use a lowercase dealer slug.');
 const registryFile=path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),registry=fs.existsSync(registryFile)?json(registryFile):{dealers:[],aliases:{}};
 const normalizedKey=value=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
 const canonical=registry.aliases?.[slug]||slug;
 const existing=(registry.dealers||[]).find(d=>d.slug===canonical||d.aliases?.includes(slug)||normalizedKey(d.slug)===normalizedKey(slug)||(requestedId&&[d.id,d.dealerId,d.researchId].includes(requestedId)));
 const dirs=fs.existsSync(path.join(root,'clients'))?fs.readdirSync(path.join(root,'clients'),{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>e.name):[];
 const folder=dirs.find(s=>normalizedKey(s)===normalizedKey(canonical));
 return{slug:existing?.slug||folder||canonical,existing:existing||null,exists:Boolean(existing||folder||canonical!==slug)};
}
