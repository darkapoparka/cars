import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT,json} from './lib/workflow.mjs';

export function checkLinks(file){
 const text=fs.readFileSync(file,'utf8').replace(/```[\s\S]*?```/g,'');const failures=[];
 for(const match of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)){const raw=match[1].replace(/^<|>$/g,'').split('#')[0];if(!raw||/^(?:https?:|mailto:|tel:|app:|codex:)/.test(raw))continue;const target=path.resolve(path.dirname(file),decodeURIComponent(raw));if(!fs.existsSync(target))failures.push(`${file}: missing ${raw}`);}
 return failures;
}
export function inspectSkills(root=ROOT){
 const dir=path.join(root,'.agents/skills'),skills=[];for(const name of fs.readdirSync(dir)){const file=path.join(dir,name,'SKILL.md');if(!fs.existsSync(file))continue;const text=fs.readFileSync(file,'utf8');const match=text.match(/^---\r?\n([\s\S]*?)\r?\n---/);if(!match)throw new Error(`Missing skill frontmatter: ${name}`);const skillName=match[1].match(/^name:\s*(.+)$/m)?.[1]?.trim(),description=match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();if(skillName!==name||!description||description.length>1024)throw new Error(`Invalid skill metadata: ${name}`);if(/TODO|\[insert|TBD/.test(text))throw new Error(`Unfinished skill scaffold: ${name}`);skills.push({name,path:file,description});}
 if(skills.length!==3)throw new Error('Expected the three scoped Cars skills.');return skills;
}
export function checkWorkflow(root=ROOT,{help=true}={}){
 const docs=['README.md','AGENTS.md','docs/README.md','docs/WORKFLOW.md','docs/TEMPLATE-PROMOTION.md','docs/LEAD-PUBLISHING.md','docs/QA.md','docs/COORDINATION.md','docs/REGISTRY.md','docs/LOCAL-SETUP.md'];
 const skills=inspectSkills(root),failures=[...docs.map(f=>path.join(root,f)),...skills.map(s=>s.path)].flatMap(checkLinks);
 const lock=json(path.join(root,'templates.lock.json'));for(const key of ['auto-best','modern','carwow','import']){const e=lock.templates[key];if(e?.repository!==`darkapoparka/cars-template-${key}`||e.snapshotPath!==`templates/${key}`)failures.push('Invalid lock identity '+key);if(e.status==='approved'&&!/^[a-f0-9]{40}$/.test(e.commit||''))failures.push('Approved release lacks immutable commit '+key);}
 if(help)for(const script of ['new-client','template-release','package-dealer','export-dealer','index-deployments','verify-dealer-preview']){const r=spawnSync(process.execPath,[path.join(root,'scripts',script+'.mjs'),'--help'],{encoding:'utf8',windowsHide:true,timeout:15000});if(r.status!==0||!r.stdout.includes('Usage:'))failures.push(`Command help failed: ${script}: ${r.stderr}`);}
 if(failures.length)throw new Error(failures.join('\n'));return{activeDocuments:docs.length,skills:skills.map(({name,path})=>({name,path})),commandHelp:help?'passed':'not-run',discovery:'Repository-scoped .agents/skills validated; app-server skills/list supplies host discovery proof.'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename){try{console.log(JSON.stringify(checkWorkflow(),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
