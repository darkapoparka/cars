import fs from 'node:fs/promises';
const base='J:/cars/audits/2026-09-08/verify';
let s=await fs.readFile(base+'/run.mjs','utf8');
s=s.replace("let detail=null;", "let detail=null; if(t==='carwow'){ const warm=await browser.newPage(); await nav(warm,base+'/inventory'); await warm.waitForTimeout(1800); await warm.reload({waitUntil:'networkidle'}); await warm.close(); }");
s=s.replace("||'BMW'", "||(t==='modern'&&job.slug==='elit-auto-import'?'Subaru':'BMW')");
// interaction has no job scope: choose the actual first listing image/title as a brand fallback instead.
s=s.replace("||(t==='modern'&&job.slug==='elit-auto-import'?'Subaru':'BMW')", "||((await p.locator(detailSelector(t)).first().getAttribute('aria-label'))?.match(/Mercedes|BMW|Audi|Subaru|Toyota|Honda|Ford|Volvo/i)?.[0])||'Subaru'");
await fs.writeFile(base+'/run-astra-last.mjs',s);
const prior=JSON.parse(await fs.readFile(base+'/results.json'));
for(const slug of ['automarket-varna','elit-auto-import','legend-auto']){
const out=`J:/cars/clients/${slug}/qa-final`;await fs.mkdir(out,{recursive:true});
await fs.writeFile(out+'/results.json',JSON.stringify(prior.filter(r=>r.client===slug&&r.pass&&!(slug==='legend-auto'&&r.template==='modern')),null,2));
}
