import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const omittedDirectories = new Set(['.git','.github','.vercel','.netlify','.agency-os','.template','.client','.agents','.claude','.codex','.openai','.svelte-kit','node_modules','dist','build','coverage','.next','.turbo','.cache','.vite','.tmp','tmp','temp','artifacts','audits','.audit','qa','test-results','playwright-report','blob-report','.codex-artifacts','.impeccable','.superdesign','.vscode','.getrich-dev-5302','skills']);
const omittedNames = new Set(['AGENTS.md','AGENTS.override.md','CLAUDE.md','AGENCY_BRIEF.md','OUTREACH_DRAFT.md','QA.md','PROJECT_PLAN.md','tasks.md','SVELTE_TASKS.md','FINALIZE_BRIEF.md']);
function excludedFileName(name) {
  return omittedNames.has(name) || /\.(log|tsbuildinfo|pid)$/i.test(name)
    || (name.startsWith('.env') && !/\.(example|sample|template)$/.test(name))
    || (/(?:credentials|service-account)/i.test(name) && !/\.(?:[cm]?[jt]sx?|svelte|vue|py|sh|ps1)$/i.test(name))
    || /(?:license-certificate|purchase-code)/i.test(name)
    || /\.(pem|key|pfx)$/i.test(name);
}
export function excluded(name,relative,isDirectory) {
  if(isDirectory) return omittedDirectories.has(name) || name.startsWith('.next-');
  if(excludedFileName(name)) return true;
  if(!relative.includes('/') && !/^[.\w-]+\.[\w]+$/.test(name) && !/^\.[\w.-]+$/.test(name) && !['LICENSE','Dockerfile','Makefile'].includes(name)) return true;
  return false;
}
const git = (cwd,args) => { try{return execFileSync('git',['-C',cwd,...args],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();}catch{return null;} };
export async function copySource(source,destination,{key,sourceUrl=null}={}) {
  const from=await fs.realpath(source),to=path.resolve(destination);
  if(to===from || to.startsWith(from+path.sep)) throw new Error('Destination must be independent of the source.');
  if(await fs.lstat(to).then(()=>true).catch(()=>false)) throw new Error(`Refusing existing destination: ${to}`);
  const manifest={schemaVersion:1,key,source:from,destination:to,copiedAt:new Date().toISOString(),sourceUrl,
    git:{root:git(from,['rev-parse','--show-toplevel']),branch:git(from,['branch','--show-current']),head:git(from,['rev-parse','HEAD']),remote:git(from,['remote','get-url','origin']),status:git(from,['status','--porcelain=v1'])},
    files:[],excluded:[],links:[],bytes:0};
  // Preflight the complete retained tree before creating a destination. Reject links rather than following external paths.
  const items=[];
  async function walk(dir,rel='') {
    for(const e of await fs.readdir(dir,{withFileTypes:true})) {
      const r=rel?`${rel}/${e.name}`:e.name;
      // A junction is not a regular extensionless root file. Reject retained links
      // explicitly, while still omitting known dependency/cache/secret links.
      if(e.isSymbolicLink()) {
        if(omittedDirectories.has(e.name) || e.name.startsWith('.next-') || excludedFileName(e.name)) manifest.excluded.push(r);
        else manifest.links.push(r);
        continue;
      }
      if(excluded(e.name,r,e.isDirectory())) {manifest.excluded.push(r);continue;}
      if(e.isDirectory()) await walk(path.join(dir,e.name),r);
      else if(e.isFile()) items.push(r);
    }
  }
  await walk(from);
  if(manifest.links.length) throw new Error(`Retained symlinks need review: ${manifest.links.join(', ')}`);
  await fs.mkdir(to,{recursive:false});
  for(const relative of items) {
    const src=path.join(from,relative),dst=path.join(to,relative);
    await fs.mkdir(path.dirname(dst),{recursive:true});
    const bytes=await fs.readFile(src);
    await fs.writeFile(dst,bytes,{flag:'wx'});
    const hash=createHash('sha256').update(bytes).digest('hex');
    const written=createHash('sha256').update(await fs.readFile(dst)).digest('hex');
    if(hash!==written) throw new Error(`Copy mismatch: ${relative}`);
    manifest.files.push({path:relative,bytes:bytes.length,sha256:hash});manifest.bytes+=bytes.length;
  }
  manifest.git.headAfterCopy=git(from,['rev-parse','HEAD']);
  const metadata=path.join(to,'.template');await fs.mkdir(metadata,{recursive:true});
  await fs.writeFile(path.join(metadata,'source-manifest.json'),JSON.stringify(manifest,null,2));
  return {key,source:from,destination:to,files:manifest.files.length,bytes:manifest.bytes,head:manifest.git.head,dirty:!!manifest.git.status,excluded:manifest.excluded.length};
}
if(process.argv[1] && path.resolve(process.argv[1])===path.resolve(import.meta.filename)) {
  const list=JSON.parse(await fs.readFile(process.argv[2],'utf8'));
  for(const item of list) console.log(JSON.stringify(await copySource(item.source,item.destination,item)));
}
