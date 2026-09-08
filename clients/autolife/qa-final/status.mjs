import fs from 'node:fs';
for(const c of ['autolife','priselci','ivo-auto']){const base=`J:/cars/clients/${c}`;const results=JSON.parse(fs.readFileSync(`${base}/qa-final/results.json`));console.log(c,results.map(x=>({t:x.template,pass:x.pass,console:x.routes.flatMap(r=>r.consoleErrors||[]).slice(0,4)})));}
