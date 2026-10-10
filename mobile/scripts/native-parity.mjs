import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root=path.resolve('reference/android');
const adb='I:/Android/Sdk/platform-tools/adb.exe';
const run=(...args)=>execFileSync(adb,['-s','emulator-5554',...args],{encoding:'utf8',timeout:20000,windowsHide:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const decode=s=>s.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&').replace(/&#10;/g,'\n').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function hierarchy(){
 for(let attempt=0;attempt<5;attempt++){
  try{
   run('shell','rm','-f','/sdcard/mobile-parity.xml');
   run('shell','uiautomator','dump','/sdcard/mobile-parity.xml');
   const xml=run('shell','cat','/sdcard/mobile-parity.xml');
   if(!xml.includes('<hierarchy'))throw Error('No fresh Android hierarchy');
   const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
   return {xml,nodes};
  }catch(error){if(attempt===4)throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,800);}
 }
}

for(const action of process.argv.slice(2)){
 const [kind,...parts]=action.split(':');const value=parts.join(':');
 if(kind==='tap'){run('shell','input','tap',...value.split(','));await sleep(600);}
 else if(kind==='back'){run('shell','input','keyevent','4');await sleep(500);}
 else if(kind==='swipe'){run('shell','input','swipe',...value.split(','));await sleep(600);}
 else if(kind==='wait'){await sleep(Number(value));}
 else if(kind==='text'){run('shell','input','text',value.replaceAll(' ','%s'));await sleep(500);}
 else if(kind==='click'){const {nodes}=hierarchy();const n=nodes.find(n=>n.text===value||n['content-desc']===value);if(!n)throw Error('Native control not found: '+value+'; visible: '+nodes.filter(n=>(n.text||n['content-desc'])&&(n['content-desc']||'').length<220&&n.bounds!=='[0,0][0,0]').map(n=>n.text||n['content-desc']).join(' | '));const [x,y,r,b]=n.bounds.match(/\d+/g).map(Number);run('shell','input','tap',String(Math.round((x+r)/2)),String(Math.round((y+b)/2)));await sleep(650);}
 else if(kind==='seek'){
  let found=false;
  for(let attempt=0;attempt<16;attempt++){
   const {nodes}=hierarchy();const n=nodes.find(n=>(n.text===value||n['content-desc']===value)&&Number(n.bounds.match(/\d+/g)?.[1])>360&&Number(n.bounds.match(/\d+/g)?.[3])<2600);
   if(n){const [x,y,r,b]=n.bounds.match(/\d+/g).map(Number);run('shell','input','tap',String(Math.round((x+r)/2)),String(Math.round((y+b)/2)));await sleep(800);found=true;break;}
   run('shell','input','swipe','1210','2350','1210','1050','450');await sleep(500);
  }
  if(!found)throw Error('Could not locate native row: '+value);
 } else if(kind==='capture'){
  if(!/^[a-zA-Z0-9_-]+$/.test(value))throw Error('Invalid capture name');if(existsSync(path.join(root,value+'.png')))throw Error('Preserve existing capture: '+value);
  const {xml,nodes}=hierarchy();writeFileSync(path.join(root,value+'.xml'),xml);run('shell','screencap','-p','/sdcard/mobile-parity.png');run('pull','/sdcard/mobile-parity.png',path.join(root,value+'.png'));
  mkdirSync(path.join(root,'normalized'),{recursive:true});await sharp(path.join(root,value+'.png')).extract({left:0,top:168,width:1280,height:2616}).resize(427,872).toFile(path.join(root,'normalized',value+'.png'));
  console.log('\n--- '+value+' ---');for(const n of nodes.filter(n=>n.text||n['content-desc']))console.log(JSON.stringify({text:n.text,label:n['content-desc'],bounds:n.bounds,checked:n.checked}));
 }else throw Error('Unknown native action '+kind);
}
