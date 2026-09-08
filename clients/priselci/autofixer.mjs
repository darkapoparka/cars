import fs from 'node:fs/promises';import path from 'node:path';
import {svelteAutofixer} from 'file:///C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/handlers.mjs';
const root='J:/cars/clients/priselci',variant=process.argv[2],reports=[];
async function walk(d){let out=[];for(const e of await fs.readdir(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())out.push(...await walk(p));else if(/\.svelte(?:\.ts)?$/.test(p))out.push(p);}return out;}
for(const p of await walk(`${root}/${variant}/src`)){const code=await fs.readFile(p,'utf8'),rel=path.relative(`${root}/${variant}`,p),original=await fs.readFile(`J:/cars/templates/${variant}/${rel}`,'utf8').catch(()=>null);if(code===original)continue;const report=await svelteAutofixer({code,filename:path.basename(p),desired_svelte_version:5,async:false});reports.push({file:rel,...report});}
await fs.writeFile(`${root}/evidence/${variant}-autofixer.json`,JSON.stringify(reports,null,2));console.log(JSON.stringify({variant,files:reports.length,issues:reports.filter(r=>r.issues.length).map(r=>({file:r.file,issues:r.issues}))}));
