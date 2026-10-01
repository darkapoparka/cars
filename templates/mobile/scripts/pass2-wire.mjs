import fs from 'node:fs';
function patch(p,a,b){let t=fs.readFileSync(p,'utf8');if(!t.includes(a))throw Error('Missing '+a+' in '+p);fs.writeFileSync(p,t.replace(a,b));}
const f='src/components/FilterFields.tsx';let t=fs.readFileSync(f,'utf8');const i=t.indexOf('const years =');if(i<0)throw Error('Missing old fields');fs.writeFileSync(f,t.slice(0,i)+"export { ConditionFields, FinancialFields, TechnicalFields, LocationFields } from './NativeFilterFields';\n");
patch('src/components/SearchScreen.tsx','setOpen(open.includes(title) ? open.filter((v) => v !== title) : [...open, title]);','setOpen(open.includes(title) ? [] : [title]);');
patch('src/lib/filter-fields.ts',"{id:'condition',label:'Condition',options:['New','Used','Demonstration vehicle',\"Employee's Car\",'Pre-Registration','Classic vehicle']}","{id:'condition',label:'Condition',kind:'single',options:['New','Used']}");
fs.writeFileSync('src/app/search/filters/page.tsx',"import { AdvancedFilters } from '@/components/AdvancedFilters';\nexport default function Page(){ return <AdvancedFilters/>; }\n");
console.log('Connected native expanded fields and full advanced-filter route.');
