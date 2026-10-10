import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const category=process.argv[2];
if(!['bike','electric-bike','motorhome','truck'].includes(category))throw Error('Pass a supported vehicle category');
const root='reference/android/category-makes/'+category;
await fs.mkdir(root,{recursive:true});await fs.mkdir('public/images/category-makes/'+category,{recursive:true});
const adb='I:/Android/Sdk/platform-tools/adb.exe';
const run=(...a)=>execFileSync(adb,['-s','emulator-5554',...a],{encoding:'utf8',timeout:25000,windowsHide:true});
const wait=ms=>new Promise(r=>setTimeout(r,ms));const names=new Map();let previous='';
for(let page=0;page<40;page++){
 run('shell','rm','-f','/sdcard/category-makes.xml');run('shell','uiautomator','dump','/sdcard/category-makes.xml');
 const xml=run('shell','cat','/sdcard/category-makes.xml');if(!xml.includes('text="Make"'))throw Error('Expected native Make picker');
 const nodes=[...xml.matchAll(/<node\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a=>[a[1],a[2].replaceAll('&amp;','&').replaceAll('&quot;','"')])));
 const rows=nodes.filter(n=>n.text&&!['Any','Other','Cancel','Make'].includes(n.text)&&(nodes.some(node=>node.text==='Make'&&node.bounds?.startsWith('[72,')) ? /^\[72,/.test(n.bounds||'') && n.text.length>1 : /^\[(344|224),/.test(n.bounds||'')&&n.bounds.includes('[1056,')));
 const signature=rows.map(n=>n.text).join('|');if(!signature||signature===previous)break;previous=signature;
 const name=String(page).padStart(2,'0');await fs.writeFile(root+'/'+name+'.xml',xml);
 run('shell','screencap','-p','/sdcard/category-makes.png');run('pull','/sdcard/category-makes.png',root+'/'+name+'.png');
 for(const row of rows){const b=row.bounds.match(/\d+/g).map(Number);const top=Math.round((b[1]+b[3])/2-60);let image=names.get(row.text)?.image;
  if(b[0]===344&&top>=625&&top+120<=2485&&!image){const slug=row.text.toLowerCase().replace(/[^a-z0-9]+/g,'-');image='/images/category-makes/'+category+'/'+slug+'.webp';await sharp(root+'/'+name+'.png').extract({left:200,top,width:120,height:120}).webp({quality:95}).toFile('public'+image);}
  names.set(row.text,{name:row.text,...(image?{image}:{})});
 }
 await fs.writeFile(root+'/manifest.json',JSON.stringify({category,at:new Date().toISOString(),makes:[...names.values()]},null,2));console.log(category,page,names.size,signature);
 run('shell','input','swipe','800','2210','800','1160','430');await wait(550);
}
console.log('CAPTURED_CATEGORY_MAKES',category,names.size);
