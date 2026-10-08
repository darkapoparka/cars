import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const path='scripts/verify-final-pass.mjs',source=await readFile(path,'utf8');
if(createHash('sha256').update(source).digest('hex')!=='d5788082c31037fb0a9b62d7b61c08c0e5266e8bd5e36d99983d255e007b1367')throw Error('QA script changed');
function one(s,a,b){if(s.split(a).length!==2)throw Error('Nonunique QA update');return s.replace(a,b);}
let next=one(source,"  await tap(labelled('Show vehicle offer 2'),{scroll:false});","  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});\n  await b.navigate(path);\n  await tap(labelled('Show vehicle offer 2'),{scroll:false});");
next=one(next,"  await check('Visible carousel advances without user input',`document.querySelector('[aria-label=\"Vehicle offers\"]').dataset.offerIndex!==${JSON.stringify(initial)}`);", "  await check('Visible carousel advances without user input',`document.querySelector('[aria-label=\"Vehicle offers\"]').dataset.offerIndex!==${JSON.stringify(initial)}`);\n  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.navigate(path);\n  await sleep(5500);await check('Reduced-motion mode prevents automatic offer rotation',`document.querySelector('[aria-label=\"Vehicle offers\"]').dataset.offerIndex==='0'`);\n  await tap(labelled('Show vehicle offer 2'),{scroll:false});await check('Reduced-motion mode retains manual offer selection',`document.querySelector('[aria-label=\"Vehicle offers\"]').dataset.offerIndex==='1'`);\n  await b.send('Emulation.setEmulatedMedia',{features:[]});");
next=one(next," await test('Customer stories and real testimonial video',async()=>{",` await test('Full inspection expansion uses the captured source',async()=>{
  await b.navigate(path+'/inspection');
  await tap("[...document.querySelectorAll('section')].find(e=>e.querySelector('h2')?.textContent==='Electricals, Controls & Lights')?.querySelector('button')");
  await check('Electrical inspection expands the AC and window checkpoints',"document.body.textContent.includes('AC System Leaks')&&document.body.textContent.includes('Power/ Manual Windows')");
  await b.capture('inspection-electrical-expanded');
 });
 await test('Customer stories and real testimonial video',async()=>{`);
await writeFile(path,next);
console.log('Added explicit normal/reduced-motion checks and complete inspection expansion tests.');
