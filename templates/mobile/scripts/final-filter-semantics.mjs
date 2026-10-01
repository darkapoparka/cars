import fs from 'node:fs';
function patch(p,a,b){const t=fs.readFileSync(p,'utf8');if(!t.includes(a))throw Error('Missing '+p+' '+a.slice(0,60));fs.writeFileSync(p,t.replace(a,b));}
patch('src/lib/types.ts','  excludeDamaged: boolean;','  excludeDamaged: boolean;\n  damagedOnly: boolean;');
patch('src/lib/types.ts','  excludeDamaged: true,','  excludeDamaged: true,\n  damagedOnly: false,');
patch('src/lib/filters.ts',"['Any', 'Dealer', 'Private seller']","['Any', 'Dealer', 'Private seller', 'Company vehicles']");
patch('src/components/AdvancedFilters.tsx',"return [f.excludeDamaged ? 'Do not show' : 'Show also'];","return f.damagedOnly ? ['Show only'] : f.excludeDamaged ? ['Do not show'] : [];");
patch('src/components/AdvancedFilters.tsx',"updateFilters({ excludeDamaged: values[0] !== 'Show also' })","updateFilters({ excludeDamaged: values[0] === 'Do not show', damagedOnly: values[0] === 'Show only' })");
patch('src/lib/search.ts','(!f.excludeDamaged || !v.damaged) &&','(!f.excludeDamaged || !v.damaged) &&\n      (!f.damagedOnly || Boolean(v.damaged)) &&');
patch('src/lib/search.ts',"f.seller !== 'Private seller'","f.seller !== 'Private seller' && f.seller !== 'Company vehicles'");
const p='src/lib/search.ts';let text=fs.readFileSync(p,'utf8');text=text.replace("const attr=v.attributes?.[base];","const attr=base==='rating'?String(v.rating):v.attributes?.[base];");fs.writeFileSync(p,text);
