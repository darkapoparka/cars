import fs from 'node:fs/promises';import path from 'node:path';
import {svelteAutofixer} from 'C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/handlers.mjs';
const root='J:/cars/clients/excellent-cars',results=[];
for(const variant of ['auto-best','carwow']){
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(e.name.endsWith('.svelte')){const source=await fs.readFile(p,'utf8'),relative=path.relative(`${root}/${variant}`,p).replaceAll('\\','/'),original=await fs.readFile(`J:/cars/templates/${variant}/${relative}`,'utf8');if(source.replaceAll('\r\n','\n').trim()===original.replaceAll('\r\n','\n').trim())continue;const result=await svelteAutofixer({code:source,async:false,desired_svelte_version:5,filename:p});results.push({variant,file:relative,result});}}}await walk(`${root}/${variant}/src`);
}
await fs.writeFile(`${root}/qa/svelte-autofixer.json`,JSON.stringify(results,null,2));console.log({analyzed:results.length});
