import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import * as native from './android-reference.mjs';
const [id,countText,startText='1']=process.argv.slice(2);const count=Number(countText),start=Number(startText);
if(!/^bmw-(540|x3|120)$/.test(id)||!Number.isInteger(count)||count<1||count>50)throw Error('Invalid gallery fixture');
const folder='reference/web/live-final-20260928/gallery-'+id;await fs.mkdir(folder,{recursive:true});
const entries=start>1?JSON.parse(await fs.readFile(folder+'/manifest.json','utf8')).entries:[];
for(let i=start;i<=count;i++){
 let data=await native.read();for(let skip=0;skip<2&&data.nodes.some(n=>n.text==='Advertisement');skip++){native.run('shell','input','tap','1160','2688');await native.wait(700);data=await native.read();}if(!data.nodes.some(n=>n.text===i+' / '+count))throw Error('Incorrect gallery counter '+i+': '+native.signature(data.nodes));
 await fs.writeFile(folder+'/'+i+'.xml',data.xml);
 const bytes=execFileSync(native.adb,['-s','emulator-5554','exec-out','screencap','-p'],{windowsHide:true,timeout:15000,maxBuffer:15e6});
 await fs.writeFile(folder+'/'+i+'.png',bytes);
 const {data:p,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});
 let rows=[];for(let y=360;y<2500;y++){let lit=0;for(let x=0;x<info.width;x+=8){let off=(y*info.width+x)*3;if(Math.max(p[off],p[off+1],p[off+2])>18)lit++;}if(lit>info.width/8*.18)rows.push(y);}
 if(rows.length<100)throw Error('Empty/loading gallery image '+i);
 const crop={left:0,top:rows[0],width:info.width,height:rows.at(-1)-rows[0]+1};
 const asset='/images/'+id+'-gallery-'+String(i).padStart(2,'0')+'.webp';
 await sharp(bytes).extract(crop).webp({quality:94}).toFile('public'+asset);
 entries.push({index:i,asset,crop,source:folder+'/'+i+'.png',sha256:createHash('sha256').update(await fs.readFile('public'+asset)).digest('hex')});
 console.log(id,i+'/'+count,JSON.stringify(crop));
 await fs.writeFile(folder+'/manifest.json',JSON.stringify({count,entries},null,2));
 if(i<count){native.run('shell','input','tap','1160','2688');await native.wait(700);}
}
console.log('GALLERY_CAPTURE_COMPLETE',id,count);
