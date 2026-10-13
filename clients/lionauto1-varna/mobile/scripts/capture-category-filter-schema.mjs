import fs from 'node:fs/promises';
import {read,capture,swipe,box,signature} from './android-reference.mjs';
const category=process.argv[2];if(!['bike','electric-bike','motorhome','truck'].includes(category))throw Error('Explicit category required');
const root='reference/android/pass4/filters-'+category;await fs.mkdir(root,{recursive:true});
const fields=[];const seen=new Set();let section='Basic Data',previous='';
for(let page=0;page<18;page++){
 const current=await read();if(!current.nodes.some(n=>n.text==='Search Filters'))throw Error('Expected expanded Search Filters');
 const sig=signature(current.nodes);if(sig===previous)break;previous=sig;await capture(root+'/list-'+String(page).padStart(2,'0'),current);
 for(const n of current.nodes){
  const b=box(n);if(!n.text||b[1]<348||b[3]>2784)continue;
  if(!n['resource-id']&&n.class==='android.widget.TextView'&&b[0]===48&&b[2]===1232){section=n.text;continue;}
  if(!/(filterName|checkboxFilterTitle)$/.test(n['resource-id']))continue;
  if(seen.has(n.text)){section=fields.find(f=>f.label===n.text).section;continue;}
  seen.add(n.text);fields.push({label:n.text,section,toggle:n['resource-id'].endsWith('checkboxFilterTitle')});
 }
 await fs.writeFile(root+'/schema.json',JSON.stringify({category,at:new Date().toISOString(),fields},null,2));
 console.log(category,page,fields.length,fields.slice(-6).map(f=>f.label).join(' | '));await swipe();
}
console.log('CAPTURED_SCHEMA',category,JSON.stringify(fields));
