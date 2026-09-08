import fs from 'node:fs';import path from 'node:path';
for(const c of ['avangard-auto','champion-auto-pro','astracar']){
 const roots=[`auto-best/src`,`carwow/src`,`modern/apps/web/app`,`modern/packages/marketplace`,`modern/packages/marketplace-ui`];const hits=[];
 function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){if(e.isDirectory())walk(path.join(p,e.name));else if(/\.(svelte|tsx?|css)$/.test(e.name)&&!e.name.includes('.test.')){const file=path.join(p,e.name);let s=fs.readFileSync(file,'utf8');try{s=decodeURIComponent(s)}catch{}for(const [i,line]of s.split('\n').entries())if(/Day\s*(?:&|and|и)\s*Night|Спартак Ауто|АСКО\s*96|ELIQ|Кристиян Кирилов|359888626117/.test(line))hits.push({file,line:i+1,text:line.trim().slice(0,240)});}}}
 roots.forEach(r=>walk(`J:/cars/clients/${c}/${r}`));fs.writeFileSync(`J:/cars/clients/${c}/qa-final/source-identity-scan.json`,JSON.stringify({scope:roots,hits},null,2));console.log(c,hits.length,hits.slice(0,4));
}
