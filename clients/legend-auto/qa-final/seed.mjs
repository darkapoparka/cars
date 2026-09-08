import fs from 'node:fs/promises';
for(const slug of ['automarket-varna','elit-auto-import','legend-auto']){
const p=`J:/cars/clients/${slug}/qa-final/results.json`;const rows=JSON.parse(await fs.readFile(p));await fs.writeFile(p,JSON.stringify(rows.filter(r=>r.template==='auto-best'),null,2));
}
