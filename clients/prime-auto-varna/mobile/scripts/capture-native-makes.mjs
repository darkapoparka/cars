import {execFileSync} from 'node:child_process';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/android/makes-complete';await fs.mkdir(root,{recursive:true});await fs.mkdir('public/images/makes',{recursive:true});
const adb='I:/Android/Sdk/platform-tools/adb.exe';const run=(...args)=>execFileSync(adb,['-s','emulator-5554',...args],{encoding:'utf8',timeout:25000,windowsHide:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));const names=new Map();let previous='';
for(let page=0;page<35;page++){
 run('shell','rm','-f','/sdcard/makes-reference.xml');run('shell','uiautomator','dump','/sdcard/makes-reference.xml');const xml=run('shell','cat','/sdcard/makes-reference.xml');if(!xml.includes('text="Make"'))throw Error('Unexpected native page');
 const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(match=>Object.fromEntries([...match[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2].replace(/&amp;/g,'&').replace(/&quot;/g,'"')])));
 const rows=nodes.filter(n=>n.text&&n.bounds?.startsWith('[344,')&&n.bounds.includes('[1056,'));
 const signature=rows.map(n=>n.text).join('|');if(signature===previous)break;previous=signature;
 const id=String(page).padStart(2,'0');await fs.writeFile(root+'/'+id+'.xml',xml);run('shell','screencap','-p','/sdcard/makes-reference.png');run('pull','/sdcard/makes-reference.png',root+'/'+id+'.png');
 for(const row of rows){const bounds=row.bounds.match(/\d+/g).map(Number);const top=Math.round((bounds[1]+bounds[3])/2-60);if(top<780&&page===0||top<625||top+120>2485)continue;
  if(names.has(row.text))continue;const slug=row.text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');const asset='/images/makes/'+slug+'.webp';
  await sharp(root+'/'+id+'.png').extract({left:200,top,width:120,height:120}).webp({quality:95}).toFile('public'+asset);names.set(row.text,{name:row.text,image:asset,source:root+'/'+id+'.png'});
 }
 await fs.writeFile(root+'/manifest.json',JSON.stringify({at:new Date().toISOString(),makes:[...names.values()]},null,2));console.log(page,names.size,signature);
 run('shell','input','swipe','700','2320','700','850','480');await wait(650);
}
console.log('NATIVE_MAKES_CAPTURED',names.size);
