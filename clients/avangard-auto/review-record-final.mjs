import fs from 'node:fs';
const root='J:/cars/clients/';
const reviewed={
'avangard-auto':[
['qa-final/logo-final/390.png','Modern 390: white dealer wordmark readable on dark header, compact stock cards and bottom navigation intact.'],
['qa-final/logo-final/1440.png','Modern 1440: white dealer wordmark readable, four-column real inventory grid and search hierarchy intact.'],
['qa-final/supplement/auto-best-390-home.png','Auto Best 390: corrected stock budget bands and compact source geometry visible.'],
['qa-final/supplement/carwow-390-home.png','Carwow 390: light dealer logo legible; numeric budget counts populated; source card geometry retained.']],
'champion-auto-pro':[
['../../audits/2026-09-08/verify/champion-auto-pro/auto-best/390-0.png','Auto Best 390: source compact composition retained; actual dealer logo and stock budget previews visible.'],
['../../audits/2026-09-08/verify/champion-auto-pro/auto-best/1440-0.png','Auto Best 1440: dealer header, phone, address and stock-search composition visible.']],
'astracar':[
['qa-final/modern-final/astracar/modern/390-0.png','Modern 390: dealer logo readable, real inventory compact and bottom navigation intact.'],
['qa-final/modern-final/astracar/modern/1440-0.png','Modern 1440: real inventory cards and dealer header render without overlap.'],
['qa-final/carwow-final/astracar/carwow/390-0.png','Carwow 390: light logo and stock-derived numeric budget counts visible.'],
['qa-final/carwow-final/astracar/carwow/1440-0.png','Carwow 1440: source yellow desktop layout and real stock visible.'],
['qa-final/astracar/auto-best/1440-0.png','Auto Best 1440: original desktop composition retained with Astracar identity.']]};
for(const [c,list] of Object.entries(reviewed)) fs.writeFileSync(root+c+'/qa-final/visual-review.json',JSON.stringify(list.map(([p,finding])=>({path:new URL(p,'file:///'+root+c+'/').pathname.slice(1),finding,reviewedAt:new Date().toISOString()})),null,2));
