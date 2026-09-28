import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const exec=promisify(execFile);
const adb=process.env.ADB_PATH??'I:/Android/Sdk/platform-tools/adb.exe';
const serial=process.env.ANDROID_SERIAL??'emulator-5554';
const output=path.resolve('reference/2026-09-26-continuation');
await mkdir(output,{recursive:true});
const call=(...args)=>exec(adb,['-s',serial,...args],{timeout:30000,windowsHide:true,maxBuffer:8*1024*1024});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const actions=(process.argv[2]??'capture,current').split('|').map(action=>action.split(','));
const scaled=value=>String(Math.round(Number(value)*1280/427));
for(const [action,...args] of actions){
 if(action==='tap')await call('shell','input','tap',...args.slice(0,2).map(scaled));
 else if(action==='taptext'||action==='waittext'){
  const wanted=args.join(',').toLowerCase();let target;
  for(let attempt=0;attempt<8;attempt++){
   await call('shell','uiautomator','dump','/sdcard/cars-parity-ui.xml');
   const {stdout}=await call('shell','cat','/sdcard/cars-parity-ui.xml');
   const nodes=[...stdout.matchAll(/<node\b[^>]+>/g)].map(match=>Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]])));
   target=nodes.find(node=>[node.text,node['content-desc']].some(text=>text?.replaceAll('&amp;','&').toLowerCase()===wanted)&&node.bounds!=='[0,0][0,0]');
   if(target)break;await wait(700);
  }
  if(!target)throw Error(`Native control not visible: ${wanted}`);
  if(action==='taptext'){
   const coordinates=target.bounds.match(/\d+/g).map(Number);
   await call('shell','input','tap',String(Math.round((coordinates[0]+coordinates[2])/2)),String(Math.round((coordinates[1]+coordinates[3])/2)));
  }
  console.log(action,args.join(','),target.bounds);
 }
 else if(action==='swipe')await call('shell','input','swipe',...args.slice(0,4).map(scaled),String(args[4]??600));
 else if(action==='back')await call('shell','input','keyevent','4');
 else if(action==='link'){const url=new URL(args[0]);if(!['www.cars24.ae','cars24.ae'].includes(url.hostname))throw Error('Only the reference app links are allowed');await call('shell',`am start -a android.intent.action.VIEW -d '${url.href}' -p com.cars24.uaeusedcars`);}
 else if(action==='wait')await wait(Number(args[0]));
 else if(action==='text')await call('shell','input','text',String(args[0]).replaceAll(' ','%s'));
 else if(action==='capture'){
  const name=String(args[0]);if(!/^[a-z0-9-]+$/.test(name))throw Error('Invalid capture name');
  await wait(800);
  const {stdout}=await exec(adb,['-s',serial,'exec-out','screencap','-p'],{encoding:'buffer',timeout:30000,maxBuffer:12*1024*1024,windowsHide:true});
  await writeFile(path.join(output,`${name}.png`),stdout);
  await sharp(stdout).resize(427,952,{fit:'fill'}).png().toFile(path.join(output,`${name}-427.png`));
  await call('shell','uiautomator','dump','/sdcard/cars-parity-ui.xml');
  await call('pull','/sdcard/cars-parity-ui.xml',path.join(output,`${name}.xml`));
  const xml=await readFile(path.join(output,`${name}.xml`),'utf8');
  const nodes=[...xml.matchAll(/<node\b[^>]+>/g)].map(match=>Object.fromEntries([...match[0].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]])));
  const visible=nodes.filter(n=>n.text||n['content-desc']).map(n=>({text:n.text||n['content-desc'],bounds:n.bounds,clickable:n.clickable}));
  await writeFile(path.join(output,`${name}.json`),JSON.stringify(visible,null,2));
  console.log(JSON.stringify({name,text:visible.filter(n=>n.text.length<400),image:path.join(output,`${name}-427.png`)}));
 }else throw Error(`Unknown action ${action}`);
 if(!['wait','capture'].includes(action))await wait(1000);
}
