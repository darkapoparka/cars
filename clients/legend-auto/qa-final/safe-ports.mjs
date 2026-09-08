import fs from 'node:fs/promises';
const root='J:/cars/clients/legend-auto';for(const name of ['validate-modern.ps1','qa-modern.ps1','qa-auto.ps1','qa-carwow.ps1']){const p=root+'/'+name;let s=await fs.readFile(p,'utf8');s=s.replaceAll('6666','6671').replaceAll('6667','6672').replaceAll('6668','6673').replaceAll('6669','6674').replaceAll('6670','6675');await fs.writeFile(p,s);}
const p=root+'/qa-final/results.json';const rows=JSON.parse(await fs.readFile(p));await fs.writeFile(p,JSON.stringify(rows.filter(r=>r.template!=='auto-best'),null,2));
