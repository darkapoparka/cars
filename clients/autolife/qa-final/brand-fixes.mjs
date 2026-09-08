import fs from 'node:fs';
for(const f of ['MobileBudget.svelte','SearchBox.svelte']){const p=`J:/cars/clients/autolife/auto-best/src/lib/components/home/${f}`;fs.writeFileSync(p,fs.readFileSync(p,'utf8').replaceAll('60–20 000 €','10–20 000 €'));}
for(const c of ['autolife','priselci','ivo-auto']){const p=`J:/cars/clients/${c}/carwow/src/lib/components/chat/ChatLauncher.svelte`;fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('/assets/images/chat/daynight-helper-helmet-v1.png',`/assets/${c}/wordmark-light.svg`));}
let rp='J:/cars/clients/autolife/qa-final/results.json';let r=JSON.parse(fs.readFileSync(rp));r.find(x=>x.template==='auto-best').pass=false;fs.writeFileSync(rp,JSON.stringify(r,null,2));
