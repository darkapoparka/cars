import fs from 'node:fs';
for(const c of ['avangard-auto','champion-auto-pro']) {
 const dir=`J:/cars/clients/${c}/qa-final`; fs.mkdirSync(dir,{recursive:true});
 const baseline=JSON.parse(fs.readFileSync('J:/cars/audits/2026-09-08/verify/results.json','utf8'));
 const reuse=baseline.filter(r=>r.client===c&&r.pass&&((c==='avangard-auto'&&r.template==='carwow')||(c==='champion-auto-pro'&&r.template==='auto-best')));
 fs.writeFileSync(`${dir}/results.json`,JSON.stringify(reuse,null,2));
}
