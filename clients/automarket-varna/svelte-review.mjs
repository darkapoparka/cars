import fs from 'node:fs/promises';import path from 'node:path';
import {svelteAutofixer} from 'C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/handlers.mjs';
const root=import.meta.dirname,variant=process.argv[2];const results=[];
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else if(e.name.endsWith('.svelte'))out.push(p)}return out}
for(const p of await walk(root+'/'+variant+'/src')){const relative=path.relative(root+'/'+variant,p),source=await fs.readFile(p,'utf8'),baseline=await fs.readFile(root+'/../../templates/'+variant+'/'+relative,'utf8').catch(()=>null);if(source===baseline)continue;const result=await svelteAutofixer({code:source,desired_svelte_version:5,filename:path.basename(p)});results.push({file:relative,...result});}
await fs.writeFile(root+`/evidence/${variant}-svelte-autofixer.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({reviewed:results.length,withIssues:results.filter(r=>r.issues.length).length,withSuggestions:results.filter(r=>r.suggestions.length).length}));
