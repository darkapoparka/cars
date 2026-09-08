import fs from 'node:fs/promises';import path from 'node:path';
import {svelteAutofixer} from 'C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/handlers.mjs';
const root=import.meta.dirname,variant=process.argv[2];
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(p.endsWith('.svelte'))out.push(p);}return out;}
const results=[];
for(const file of await walk(`${root}/${variant}/src`)){const code=await fs.readFile(file,'utf8'),rel=path.relative(`${root}/${variant}`,file);const master=await fs.readFile(path.resolve(root,'../../templates',variant,rel),'utf8').catch(()=>'');if(code===master)continue;const result=await svelteAutofixer({code,filename:file,async:false,desired_svelte_version:5});results.push({file:rel,result});}
await fs.writeFile(`${root}/svelte-audit-${variant}.json`,JSON.stringify(results,null,2));console.log(`Svelte autofixer reviewed ${results.length} changed components in ${variant}.`);
