import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import ts from 'typescript';
import sharp from 'sharp';
const moduleText=ts.transpileModule(await fs.readFile('src/lib/filter-fields.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {filterSections}=await import('data:text/javascript;base64,'+Buffer.from(moduleText).toString('base64'));
const adb='I:/Android/Sdk/platform-tools/adb.exe';const root='reference/android/filter-options';await fs.mkdir(root,{recursive:true});
const run=(...args)=>execFileSync(adb,['-s','emulator-5554',...args],{encoding:'utf8',timeout:20000,windowsHide:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&').replace(/&#10;/g,'\n');
function read(){run('shell','uiautomator','dump','/sdcard/filter-options.xml');const xml=run('shell','cat','/sdcard/filter-options.xml');const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));return {xml,nodes};}
async function seek(label){
 for(let step=0;step<20;step++){
  const {nodes}=read();const node=nodes.find(n=>n.text===label&&Number(n.bounds.match(/\d+/g)?.[1])>=348&&Number(n.bounds.match(/\d+/g)?.[3])<2590);
  if(node){const [l,t,r,b]=node.bounds.match(/\d+/g).map(Number);run('shell','input','tap',String(Math.round((l+r)/2)),String(Math.round((t+b)/2)));await wait(500);return;}
  run('shell','input','swipe','1100','2310','1100','1000','450');await wait(400);
 }
 throw Error('Could not find native filter '+label);
}
async function capture(name,current){
 await fs.writeFile(root+'/'+name+'.xml',current.xml);run('shell','screencap','-p','/sdcard/filter-options.png');run('pull','/sdcard/filter-options.png',root+'/'+name+'.png');
 await sharp(root+'/'+name+'.png').extract({left:0,top:168,width:1280,height:2616}).resize(427,872).toFile(root+'/'+name+'-normalized.png');
}
const result={};
for(let sectionIndex=0;sectionIndex<filterSections.length;sectionIndex++){
 if(sectionIndex===1)await seek('Show all filters');
 for(const field of filterSections[sectionIndex].fields){
  if(field.kind==='toggle')continue;
  await seek(field.label);let current=read();await capture(field.id+'-0',current);
  const values=new Set();const files=[];let previous='';let multiple=current.nodes.some(n=>n.class?.endsWith('CheckBox'));
  for(let page=0;page<12;page++){
   const text=current.nodes.filter(n=>n.text&&![field.label,'Cancel','OK','Close'].includes(n.text)).map(n=>n.text);text.forEach(v=>values.add(v));files.push(field.id+'-'+page+'.xml');
   if(!field.options)break;
   const scroll=current.nodes.find(n=>n.scrollable==='true');if(!scroll)break;
   const signature=JSON.stringify(text);if(signature===previous)break;previous=signature;
   const [l,t,r,b]=scroll.bounds.match(/\d+/g).map(Number);if(b-t<100)break;
   const x=String(Math.round((l+r)/2));run('shell','input','swipe',x,String(Math.round(t+(b-t)*.82)),x,String(Math.round(t+(b-t)*.2)),'450');await wait(400);
   const next=read();if(JSON.stringify(next.nodes.filter(n=>n.text).map(n=>n.text))===JSON.stringify(current.nodes.filter(n=>n.text).map(n=>n.text)))break;
   current=next;await capture(field.id+'-'+(page+1),current);multiple ||= current.nodes.some(n=>n.class?.endsWith('CheckBox'));
  }
  result[field.id]={label:field.label,multiple,any:values.has('Any'),options:[...values].filter(v=>v!=='Any'),files};
  await fs.writeFile(root+'/manifest.json',JSON.stringify({at:new Date().toISOString(),fields:result},null,2));console.log('CAPTURED',field.id,[...values].join(' | '));
  for(let back=0;back<4;back++){run('shell','input','keyevent','4');await wait(400);const state=read();if(state.nodes.some(n=>n.text==='Search Filters'))break;if(back===3)throw Error('Did not return to native Search Filters');}
 }
}
console.log('FILTER_REFERENCE_COMPLETE',Object.keys(result).length);
