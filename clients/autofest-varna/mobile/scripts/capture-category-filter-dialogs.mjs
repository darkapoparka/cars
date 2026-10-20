import fs from 'node:fs/promises';
import {read,capture,swipe,box,signature,tap,back,wait} from './android-reference.mjs';
const category=process.argv[2];const root='reference/android/pass4/filters-'+category;
const schema=JSON.parse(await fs.readFile(root+'/schema.json','utf8'));const results={};
for(let i=0;i<14;i++)await swipe(1200,650,2440);
for(const [index,field] of schema.fields.entries()){
 if(field.toggle||['Make, Model','Location and radius'].includes(field.label))continue;
 let found;
 for(let attempt=0;attempt<18;attempt++){const current=await read();found=current.nodes.find(n=>n.text===field.label&&box(n)[1]>=348&&box(n)[3]<2570);if(found)break;await swipe();}
 if(!found)throw Error('Cannot find '+category+' '+field.label);await tap(found);
 let current=await read();if(current.nodes.some(n=>n.text==='Search Filters'))throw Error('Failed to open '+field.label);
 const id=String(index).padStart(2,'0');await capture(root+'/dialog-'+id+'-0',current);
 const texts=new Set();let last='';const title=current.nodes.find(n=>n.text&&n.text!=='Cancel')?.text||field.label;
 const inputs=current.nodes.filter(n=>n.class?.endsWith('EditText')).length;
 const range=current.nodes.some(n=>n.class?.endsWith('NumberPicker'))||current.nodes.some(n=>['From','To'].includes(n.text));
 const multiple=current.nodes.some(n=>n.class?.endsWith('CheckBox'));
 for(let page=0;page<10;page++){
  current.nodes.filter(n=>n.text&&![title,field.label,'Cancel','OK','Close'].includes(n.text)).forEach(n=>texts.add(n.text));
  if(range||inputs)break;
  const scroll=current.nodes.find(n=>n.scrollable==='true');if(!scroll)break;
  const sig=signature(current.nodes);if(sig===last)break;last=sig;
  const [l,t,r,b]=box(scroll);await swipe(Math.round((l+r)/2),Math.round(b-120),Math.round(t+120));current=await read();if(signature(current.nodes)===last)break;
  await capture(root+'/dialog-'+id+'-'+(page+1),current);
 }
 results[field.label]={title,inputs,mode:range?(inputs>1?'range':'number'):inputs?'text':multiple?'multiple':'single',includeAny:texts.has('Any'),options:[...texts].filter(t=>t!=='Any')};
 await fs.writeFile(root+'/dialogs.json',JSON.stringify(results,null,2));console.log('DIALOG',category,field.label,results[field.label].mode,[...texts].join(' | '));await back();
 const restored=await read();if(!restored.nodes.some(n=>n.text==='Search Filters'))throw Error('Did not return to filters after '+field.label);
}
console.log('DIALOGS_COMPLETE',category,Object.keys(results).length);
