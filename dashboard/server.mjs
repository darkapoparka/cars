import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = path.join(root, 'dashboard', 'public');
const runtime = path.join(root, 'runtime', 'lead-dashboard');
const statePath = path.join(runtime, 'state.json');
const recordPath = path.join(runtime, 'server.json');
const regions = ['bulgaria.json','uae.json','usa.json','europe.json'];
const designs = ['auto-best','modern','carwow'];
const stages = ['research','qualified','building','qa','ready','contacted','replied','won','lost','archived'];
const port = Number(process.argv[process.argv.indexOf('--port') + 1] || process.env.PORT || 6620);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid port');

const readJson = async (p, fallback = null) => { try { return JSON.parse(await fsp.readFile(p,'utf8')); } catch (e) { if (e.code === 'ENOENT') return fallback; throw e; } };
const exists = async p => { try { return (await fsp.stat(p)).isFile(); } catch { return false; } };
const isDir = async p => { try { return (await fsp.stat(p)).isDirectory(); } catch { return false; } };
const safeRel = p => path.relative(root,p).split(path.sep).join('/');
const clientSlug = p => typeof p === 'string' && p.startsWith('clients/') ? p.split('/')[1] : null;

async function leads() {
  const out=[];
  for (const file of regions) {
    const doc=await readJson(path.join(root,'leads',file),{});
    for (const lead of doc.leads || []) out.push({...doc.defaults,...lead,market:doc.market || file.replace('.json',''),sourceFile:`leads/${file}`});
  }
  return out;
}
async function state() { return await readJson(statePath,{schemaVersion:1,leads:{}}); }
async function writeState(id, patch) {
  const doc=await state(); doc.leads ||= {}; const next={...(doc.leads[id]||{})};
  if ('stage' in patch) { if (!stages.includes(patch.stage)) throw new Error('Invalid stage'); next.stage=patch.stage; }
  if ('favorite' in patch) next.favorite=!!patch.favorite;
  if ('note' in patch) next.note=String(patch.note||'').slice(0,5000);
  if ('nextAction' in patch) next.nextAction=String(patch.nextAction||'').slice(0,2000);
  next.updatedAt=new Date().toISOString(); doc.leads[id]=next; doc.updatedAt=next.updatedAt;
  await fsp.mkdir(runtime,{recursive:true}); const tmp=`${statePath}.${process.pid}.tmp`;
  await fsp.writeFile(tmp,JSON.stringify(doc,null,2)+'\n'); await fsp.rename(tmp,statePath); return next;
}
async function project(slug,indexEntry={}) {
  const base=path.join(root,'clients',slug); const present=await isDir(base);
  if (!present) return {slug,exists:false,variants:[],variantCount:0,indexSynced:(indexEntry.variants||[]).length===0};
  const variants=[]; const meta={};
  for (const d of designs) if (await exists(path.join(base,d,'package.json'))) { variants.push(d); meta[d]=await readJson(path.join(base,d,'.client','project.json'),{}); }
  const facts=await readJson(path.join(base,'FACTS-AND-INVENTORY.json'),{}); const stock=Array.isArray(facts.stock)?facts.stock.length:null;
  const logos=[path.join(base,'auto-best','static','dealer','logo-light.png'),path.join(base,'modern','apps','web','public','dealer','logo-light.png'),path.join(base,'carwow','static','dealer','logo-light.png'),path.join(base,'auto-best','static','dealer','logo-light.svg')];
  let logo=null; for (const p of logos) if (await exists(p)) { logo=safeRel(p); break; }
  const stockDirs=[path.join(base,'auto-best','static','dealer','stock'),path.join(base,'modern','apps','web','public','dealer','stock'),path.join(base,'carwow','static','dealer','stock')];
  let hero=null, media=0;
  for (const dir of stockDirs) { try { const files=(await fsp.readdir(dir)).filter(x=>/\.(png|jpe?g|webp|avif)$/i.test(x)).sort(); media=Math.max(media,files.length); if (!hero && files[0]) hero=safeRel(path.join(dir,files[0])); } catch {} }
  const qa=variants.flatMap(d=>Object.values(meta[d]?.qa||{}).filter(v=>typeof v==='boolean')); const qaComplete=qa.length>0&&qa.every(Boolean);
  const indexed=(indexEntry.variants||[]).filter(v=>designs.includes(v)); const indexSynced=variants.length===indexed.length&&variants.every(v=>indexed.includes(v));
  const run=await readJson(path.join(root,'runtime',`review-${slug}.json`),[]); const runtimeRows=Array.isArray(run)?run.map(x=>({template:x.Template||x.template,pid:Number(x.PID||x.pid)||null,port:Number(x.Port||x.port)||null,url:x.Url||x.url||null,alive:isAlive(Number(x.PID||x.pid)||0)})):[];
  const variantMeta=Object.fromEntries(variants.map(d=>[d,{state:meta[d]?.state||null,templateVersion:meta[d]?.templateVersion||null,selectedHome:meta[d]?.selectedHome||null,publicUrl:meta[d]?.publicUrl||null}]));
  return {slug,exists:true,variants,variantCount:variants.length,variantMeta,stockCount:stock,mediaCount:media,business:facts.business||null,logoPath:logo,heroPath:hero,qaComplete,qaPassed:qa.filter(Boolean).length,qaChecked:qa.length,indexSynced,runtime:runtimeRows,path:`clients/${slug}`};
}
function isAlive(pid){ if(!pid)return false; try{process.kill(pid,0);return true}catch{return false} }
function repoInfo(){ const run=a=>spawnSync('git',['-C',root,...a],{encoding:'utf8'}).stdout?.trim()||''; return {branch:run(['branch','--show-current'])||'unknown',sha:run(['rev-parse','--short=12','HEAD'])||'unknown',dirtyFiles:run(['status','--porcelain=v1']).split(/\r?\n/).filter(Boolean).length}; }
function stageFor(p,l,s){ if(stages.includes(s?.stage))return s.stage; if(!p?.exists)return l?.buildApproved?'qualified':'research'; if(p.variantCount<3)return'building'; return p.qaComplete?'ready':'qa'; }
function statusFor(stage,p){ if(stage==='won')return['Won','green']; if(['contacted','replied'].includes(stage))return[stage==='replied'?'Replied':'Contacted','blue']; if(['lost','archived'].includes(stage))return[stage[0].toUpperCase()+stage.slice(1),'muted']; if(!p?.exists)return['Research','muted']; if(p.variantCount<3)return['Building','blue']; if(p.qaComplete)return['Ready','green']; return['Needs QA','amber']; }

async function overview(){
  const [leadRows,index,local]=await Promise.all([leads(),readJson(path.join(root,'clients','index.json'),{projects:[],campaignCandidatesWithoutFolders:[]}),state()]);
  const byId=new Map((index.projects||[]).filter(x=>x.leadId).map(x=>[x.leadId,x])); const bySlug=new Map((index.projects||[]).map(x=>[x.slug,x])); const candidates=new Map((index.campaignCandidatesWithoutFolders||[]).map(x=>[x.leadId,x])); const used=new Set(); const rows=[];
  for(const l of leadRows){ const ie=byId.get(l.id)||null, c=candidates.get(l.id)||null; const slug=ie?.slug||clientSlug(l.existingClientPath)||clientSlug(c?.proposedClientPath); const p=slug?await project(slug,bySlug.get(slug)||ie||{}):null; if(p?.slug)used.add(p.slug); const loc=local.leads?.[l.id]||{}; const stage=stageFor(p,l,loc); const [label,tone]=statusFor(stage,p); rows.push({id:l.id,name:l.name,city:l.city||p?.business?.city||'',country:l.country||'',market:l.market,priority:l.priority||'',sourceUrl:l.inventory?.sourceUrl||l.businessContactSource||null,website:l.website||null,inventoryCount:p?.stockCount??l.inventory?.count??null,inventoryOrigin:p?.stockCount!=null?'project':'research',nextAction:loc.nextAction||l.nextAction||'',opportunity:l.opportunityHypothesis||'',project:p,local:{stage,favorite:!!loc.favorite,note:loc.note||'',nextAction:loc.nextAction||''},status:{label,tone}}); }
  for(const ie of index.projects||[]){ if(ie.aliasOf||used.has(ie.slug))continue; const p=await project(ie.slug,ie); const id=ie.leadId||`project:${ie.slug}`; const loc=local.leads?.[id]||{}; const stage=stageFor(p,null,loc); const [label,tone]=statusFor(stage,p); rows.push({id,name:p.business?.name||ie.name||ie.slug,city:p.business?.city||'',country:'',market:'Projects',priority:'project-only',sourceUrl:p.business?.sourceUrl||null,website:null,inventoryCount:p.stockCount,inventoryOrigin:'project',nextAction:loc.nextAction||'',opportunity:'',project:p,local:{stage,favorite:!!loc.favorite,note:loc.note||'',nextAction:loc.nextAction||''},status:{label,tone}}); }
  rows.sort((a,b)=>(b.local.favorite-a.local.favorite)||String(a.market).localeCompare(String(b.market))||String(a.city).localeCompare(String(b.city))||a.name.localeCompare(b.name));
  return {repo:repoInfo(),stages,rows,summary:{total:rows.length,full:rows.filter(r=>r.project?.variantCount===3).length,research:rows.filter(r=>!r.project?.exists).length,qa:rows.filter(r=>r.status.label==='Needs QA').length,ready:rows.filter(r=>['Ready','Won'].includes(r.status.label)).length,running:rows.reduce((n,r)=>n+(r.project?.runtime||[]).filter(x=>x.alive).length,0),markets:[...new Set(rows.map(r=>r.market).filter(Boolean))].sort()}};
}

function action(slug,kind,p){ if(process.platform!=='win32')throw new Error('Controls require Windows'); if(!/^[a-z0-9][a-z0-9-]*$/.test(slug))throw new Error('Bad slug');
  if(kind==='open'){ spawn('explorer.exe',[path.join(root,'clients',slug)],{detached:true,stdio:'ignore'}).unref(); return {ok:true}; }
  if(kind==='stop'){ const stopped=[]; for(const x of (p.runtime||[]).filter(x=>x.alive&&x.pid&&x.port)){ const ps=`$l=@(Get-NetTCPConnection -State Listen -LocalPort ${x.port} -ErrorAction SilentlyContinue);if($l.Count-ne 1-or$l[0].OwningProcess-ne${x.pid}){throw 'ownership changed'};Stop-Process -Id ${x.pid} -ErrorAction Stop`; const r=spawnSync('powershell.exe',['-NoProfile','-Command',ps],{encoding:'utf8'}); if(r.status!==0)throw new Error((r.stderr||r.stdout||'stop failed').trim()); stopped.push(x); } return {ok:true,stopped}; }
  if(!p.indexSynced)throw new Error('clients/index.json is not synced with discovered designs'); const args=['-NoProfile','-ExecutionPolicy','Bypass','-File',path.join(root,'scripts','start-client.ps1'),'-Client',slug]; if(kind==='prepare')args.push('-Prepare'); if(!['prepare','start'].includes(kind))throw new Error('Unknown action'); const child=spawn('powershell.exe',args,{cwd:root,detached:true,stdio:'ignore'}); child.unref(); return {ok:true,started:true}; }
function json(res,code,data){res.writeHead(code,{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'});res.end(JSON.stringify(data));}
async function body(req){const chunks=[];for await(const c of req)chunks.push(c);return JSON.parse(Buffer.concat(chunks).toString('utf8')||'{}');}
async function asset(url,res){const rel=url.searchParams.get('path')?.replaceAll('\\','/').replace(/^\/+/, ''); if(!rel?.startsWith('clients/')||rel.includes('..'))return json(res,403,{error:'Bad asset path'}); const abs=path.resolve(root,rel); if(!abs.startsWith(path.join(root,'clients')+path.sep))return json(res,403,{error:'Bad asset path'}); try{const b=await fsp.readFile(abs); const ext=path.extname(abs).toLowerCase(); const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.avif':'image/avif'}[ext]||'application/octet-stream';res.writeHead(200,{'content-type':mime,'cache-control':'private,max-age=30'});res.end(b)}catch{json(res,404,{error:'Not found'})}}
async function staticFile(p,res){const name=p==='/'?'index.html':p.slice(1); const abs=path.resolve(pub,name); if(!abs.startsWith(pub+path.sep)&&abs!==path.join(pub,'index.html'))return json(res,403,{error:'Bad path'}); try{const b=await fsp.readFile(abs); const ext=path.extname(abs); const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[ext]||'application/octet-stream';res.writeHead(200,{'content-type':mime,'cache-control':ext==='.html'?'no-store':'private,max-age=60','content-security-policy':"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'"});res.end(b)}catch{json(res,404,{error:'Not found'})}}

const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://127.0.0.1:${port}`),p=url.pathname;if(req.method==='GET'&&p==='/api/overview')return json(res,200,{ok:true,...await overview()});if(req.method==='GET'&&p==='/api/asset')return asset(url,res);if(req.method==='POST'&&p.startsWith('/api/state/'))return json(res,200,{ok:true,state:await writeState(decodeURIComponent(p.slice(11)),await body(req))});if(req.method==='POST'&&p.startsWith('/api/action/')){const [, , ,slug,kind]=p.split('/');const idx=await readJson(path.join(root,'clients','index.json'),{projects:[]});const pr=await project(slug,(idx.projects||[]).find(x=>x.slug===slug)||{});if(!pr.exists)return json(res,404,{error:'Project not found'});return json(res,200,action(slug,kind,pr));}if(req.method==='GET'&&p==='/health')return json(res,200,{ok:true,root,port});if(req.method==='GET')return staticFile(p,res);json(res,405,{error:'Method not allowed'});}catch(e){console.error(e);json(res,500,{error:e.message||'Dashboard error'})}});
server.listen(port,'127.0.0.1',async()=>{await fsp.mkdir(runtime,{recursive:true});await fsp.writeFile(recordPath,JSON.stringify({pid:process.pid,port,url:`http://127.0.0.1:${port}`,startedAt:new Date().toISOString()},null,2));console.log(`Cars Lead Control http://127.0.0.1:${port}`)});
const close=()=>server.close(async()=>{try{await fsp.rm(recordPath,{force:true})}catch{}process.exit(0)});process.on('SIGINT',close);process.on('SIGTERM',close);
