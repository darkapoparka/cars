import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import sharp from 'sharp';
export const adb='I:/Android/Sdk/platform-tools/adb.exe';
export const run=(...args)=>execFileSync(adb,['-s','emulator-5554',...args],{encoding:'utf8',timeout:25000,windowsHide:true,stdio:['ignore','pipe','pipe']});
export const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export const decode=value=>value.replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(Number(v))).replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
export const parse=xml=>[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
export const box=n=>(n.bounds?.match(/\d+/g)||[]).map(Number);
export async function read(){
 for(let attempt=0;attempt<4;attempt++){
  try{run('shell','rm','-f','/sdcard/reference-pass4.xml');run('shell','uiautomator','dump','/sdcard/reference-pass4.xml');const xml=run('shell','cat','/sdcard/reference-pass4.xml');if(!xml.includes('<hierarchy'))throw Error('No fresh hierarchy');return {xml,nodes:parse(xml)};}
  catch(error){if(attempt===3)throw error;await wait(600);}
 }
}
export async function tap(n){const [l,t,r,b]=box(n);if(!(r>l&&b>t&&t>=0&&b<=2856))throw Error('Invalid control bounds');run('shell','input','tap',String(Math.round((l+r)/2)),String(Math.round((t+b)/2)));await wait(450);}
export async function click(label){const data=await read();const node=data.nodes.find(n=>(n.text===label||n['content-desc']===label)&&box(n)[3]>box(n)[1]&&box(n)[1]>=168&&box(n)[3]<=2784);if(!node)throw Error('Control absent: '+label);await tap(node);}
export async function back(){run('shell','input','keyevent','4');await wait(400);}
export async function swipe(x=1160,from=2330,to=850){run('shell','input','swipe',String(x),String(from),String(x),String(to),'420');await wait(350);}
export async function capture(path,current){await fs.mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});const data=current||await read();await fs.writeFile(path+'.xml',data.xml);run('shell','screencap','-p','/sdcard/reference-pass4.png');run('pull','/sdcard/reference-pass4.png',path+'.png');await sharp(path+'.png').extract({left:0,top:168,width:1280,height:2616}).resize(427,872).toFile(path+'-small.png');return data;}
export const signature=nodes=>nodes.filter(n=>n.text).map(n=>n.text).join('|');
