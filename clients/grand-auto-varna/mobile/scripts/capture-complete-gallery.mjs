import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const adb='I:/Android/Sdk/platform-tools/adb.exe';
const run=(...args)=>execFileSync(adb,['-s','emulator-5554',...args],{encoding:'utf8',timeout:20000,windowsHide:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const name=process.argv[2]||'x6';const total=Number(process.argv[3]||20);
if(!/^[a-z0-9-]+$/.test(name)||!Number.isInteger(total)||total>100)throw Error('Invalid gallery');
const out='reference/android/'+name+'-gallery-complete';await fs.mkdir(out,{recursive:true});const entries=[];
for(let i=Number(process.argv[4]||1);i<=total;i++){
 run('shell','uiautomator','dump','/sdcard/mobile-gallery.xml');let xml=run('shell','cat','/sdcard/mobile-gallery.xml');
 for(let ad=0;ad<3&&!xml.includes(`text="${i} / ${total}"`)&&xml.includes('Advertisement');ad++){run('shell','input','tap','1160','2688');await sleep(900);run('shell','uiautomator','dump','/sdcard/mobile-gallery.xml');xml=run('shell','cat','/sdcard/mobile-gallery.xml');}
 if(!xml.includes(`text="${i} / ${total}"`))throw Error('Unexpected native gallery state at '+i);
 const id=String(i).padStart(2,'0');await fs.writeFile(out+'/'+id+'.xml',xml);
 run('shell','screencap','-p','/sdcard/mobile-gallery.png');run('pull','/sdcard/mobile-gallery.png',out+'/'+id+'.png');
 const {data,info}=await sharp(out+'/'+id+'.png').removeAlpha().raw().toBuffer({resolveWithObject:true});
 const rows=[];for(let y=400;y<2450;y++){let lit=0;for(let x=32;x<info.width-32;x+=8){const p=(y*info.width+x)*info.channels;if(Math.max(data[p],data[p+1],data[p+2])>20)lit++;}if(lit>60)rows.push(y);}
 if(!rows.length)throw Error('No photograph found');const top=rows[0],height=rows.at(-1)-top+1;
 if(height<450||height>1800)throw Error('Unexpected photograph geometry');
 const asset='/images/'+name+'-gallery-'+id+'.webp';await sharp(out+'/'+id+'.png').extract({left:0,top,width:info.width,height}).webp({quality:95}).toFile('public'+asset);
 entries.push({index:i,asset,top,width:info.width,height,native:out+'/'+id+'.png'});console.log(i,total,asset,top,height);await fs.writeFile(out+'/capture-progress.json',JSON.stringify(entries,null,2));
 if(i<total){run('shell','input','tap','1160','2688');await sleep(850);}
}
await fs.writeFile(out+'/manifest.json',JSON.stringify({at:new Date().toISOString(),entries},null,2));
console.log('COMPLETE',entries.length);
