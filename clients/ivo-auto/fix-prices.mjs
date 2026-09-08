import fs from 'node:fs/promises';
const root='J:/cars/clients/ivo-auto';
const data=JSON.parse(await fs.readFile(root+'/evidence/stock.json'));
const stock=JSON.parse(await fs.readFile(root+'/stock.json'));
for(let i=0;i<stock.length;i++) {
 const top=data.cards[i].parts.find(p=>p.cls==='zaglavie').text;
 stock[i].priceEur=Number(top.slice(top.indexOf('\n')).match(/([\d ]+)\s*€/)[1].replaceAll(' ',''));
}
await fs.writeFile(root+'/stock.json',JSON.stringify(stock,null,2));
for(const rel of ['auto-best/src/lib/data/inventory.ts','modern/packages/marketplace-domain/testing/mock-data.ts','modern/packages/marketplace/mock-directory.ts']) {
 const p=root+'/'+rel;let s=await fs.readFile(p,'utf8');
 s=s.replace(/("(?:priceEur|amount)": )(113900|13999|530000)/g,(_,prefix,price)=>prefix+({113900:13900,13999:3999,530000:30000})[price]);
 await fs.writeFile(p,s);
}
const p=root+'/carwow/src/lib/data/daynight-current-inventory.ts';let s=await fs.readFile(p,'utf8');
const start=s.indexOf('= [')+2;const current=JSON.parse(s.slice(start).trim().replace(/;$/,''));
for(let i=0;i<stock.length;i++) {current[i].priceEur=stock[i].priceEur.toLocaleString('bg-BG')+' €';current[i].priceBgn=(stock[i].priceEur*1.95583).toLocaleString('bg-BG',{maximumFractionDigits:2})+' лв.';}
await fs.writeFile(p,s.slice(0,start)+JSON.stringify(current,null,2)+';');
console.log(stock.map(v=>[v.title,v.priceEur]));
