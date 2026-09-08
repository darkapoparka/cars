import fs from 'node:fs';import path from 'node:path';import {spawnSync} from 'node:child_process';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const changed=walk('src').filter(f=>f.endsWith('.svelte')&&fs.readFileSync(f,'utf8')!==fs.readFileSync(path.join('../../../templates/auto-best',f),'utf8'));
let out='';for(const f of changed){const r=spawnSync(process.execPath,['C:/Users/radev/AppData/Local/npm-cache/_npx/0ff2b174d795ade9/node_modules/@sveltejs/mcp/dist/index.mjs','svelte-autofixer',f],{encoding:'utf8'});out+='\n'+f+'\n'+r.stdout+r.stderr;}
fs.writeFileSync('.client/svelte-autofixer.txt',out);console.log({checked:changed.length,log:'.client/svelte-autofixer.txt'});
