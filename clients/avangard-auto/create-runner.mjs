import fs from 'node:fs';
let s=fs.readFileSync('J:/cars/audits/2026-09-08/verify/run.mjs','utf8');
s=s.replace("'../../../templates/boxcar/node_modules/playwright/index.mjs'","'../../templates/boxcar/node_modules/playwright/index.mjs'");
s=s.replace("runtimeDir=import.meta.dirname","runtimeDir='J:/cars/audits/2026-09-08/verify'");
s=s.replace("async function shot(p,file){await p.screenshot", "async function shot(p,file){await p.evaluate(()=>scrollTo({top:0,left:0,behavior:'instant'}));await p.waitForTimeout(1200);await p.screenshot");
s=s.replace("if(process.argv[2]&&job.slug!==process.argv[2])continue;","if(process.argv[2]&&job.slug!==process.argv[2])continue;if(process.env.QA_TEMPLATE&&t!==process.env.QA_TEMPLATE)continue;");
s=s.replace("let detail=null;","const warm=await browser.newPage();await nav(warm,base+(t==='modern'?'/cars':t==='carwow'?'/inventory':'/listing-grid')).catch(()=>{});await warm.waitForTimeout(1800);await warm.close();let detail=null;");
fs.writeFileSync('J:/cars/clients/avangard-auto/verify-final.mjs',s);
