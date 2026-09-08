import fs from 'node:fs/promises';
const r='J:/cars/clients/priselci/modern';
for(const name of ['listing-truth.ts','marketplace-control-copy.ts','vehicle-card-view-policy.ts']){const rel=`packages/marketplace-ui/lib/${name}`;const s=await fs.readFile(`J:/cars/templates/modern/${rel}`,'utf8');await fs.writeFile(`${r}/${rel}`,s);}
const p=`${r}/packages/marketplace-domain/testing/mock-data.ts`;await fs.writeFile(p,(await fs.readFile(p,'utf8')).replaceAll('"bodyType": "minivan"','"bodyType": "van"'));
const a='J:/cars/clients/priselci/carwow/src/lib/data/agents.ts';await fs.writeFile(a,(await fs.readFile(a,'utf8')).replace(/rating: 4\.[89]/g,'rating: 0').replace('sales: daynightSite.inventoryCount','sales: 0'));
