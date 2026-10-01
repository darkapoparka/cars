import fs from 'node:fs';
import ts from 'typescript';
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&').replace(/&#10;/g,'\n');
const nodes=file=>[...fs.readFileSync('reference/android/'+file+'.xml','utf8').matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
const sources=['85-x6-technical-expanded','92-x6-technical-remaining','93-x6-technical-last','94-x6-technical-end'];const data=new Map();
for(const source of sources){const items=nodes(source);for(let i=0;i<items.length;i++){const n=items[i];if(!n.text||!n.bounds.startsWith('[176,')||!n.bounds.includes('[616,'))continue;const value=items.slice(i+1).find(x=>x.text&&x.bounds.startsWith('[664,'));if(value)data.set(n.text,{value:value.text,source});}}
const featureSources=['88-x6-features-full','89-x6-features-2','90-x6-features-3','91-x6-features-4','95-x6-features-5','96-x6-features-6','97-x6-features-7'];const features=new Map();
for(const source of featureSources)for(const n of nodes(source))if(n.text&&n.bounds.startsWith('[176,')&&n.bounds.includes('[880,'))features.set(n.text,source);
const p='src/lib/catalog.ts';let text=fs.readFileSync(p,'utf8');const ast=ts.createSourceFile(p,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);let target;
function visit(n){if(ts.isObjectLiteralExpression(n)&&n.properties.some(p=>ts.isPropertyAssignment(p)&&p.name.getText(ast)==='id'&&p.initializer.getText(ast)==="'bmw-x6'"))target=n;ts.forEachChild(n,visit);}visit(ast);if(!target)throw Error('X6 fixture missing');
const extra={technicalData:[...data].map(([k,v])=>[k,v.value]),features:[...features.keys()],specialFeatures:['Comfort Paket Plus','Travel Paket','BMW Niere Iconic Glow'],attributes:{modelRange:'G06',trimLine:'M Sport Pro',origin:'German edition',capacity:'2993',owners:'1',emission:'Euro 6e',sticker:'4 (Green)',metallic:'Metallic',air:'Automatic air conditioning, 4 zones',cylinders:'6'}};
const additions=Object.entries(extra).map(([key,value])=>key+': '+JSON.stringify(value)).join(',\n');text=text.slice(0,target.end-1)+additions+',\n'+text.slice(target.end-1);fs.writeFileSync(p,text);
const types='src/lib/types.ts';let tt=fs.readFileSync(types,'utf8');tt=tt.replace('  attributes?: Record<string,string>;','  attributes?: Record<string,string>;\n  technicalData?: [string,string][];\n  specialFeatures?: string[];');if(!tt.includes('technicalData?'))throw Error('Type marker missing');fs.writeFileSync(types,tt);
fs.writeFileSync('reference/web/pass2/x6-detail-provenance.json',JSON.stringify({technical:[...data],features:[...features],sources,featureSources},null,2));
console.log('Captured technical rows',data.size,'features',features.size);
