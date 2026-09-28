import {createBrowser} from './lib/browser-qa.mjs';
import {readFile,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const root='reference/2026-09-26-finish/font-study';
const b=await createBrowser(root);
const variants=['Geist','Roboto','Poppins'].flatMap(family=>[17.5,18,18.5].flatMap(size=>[500,600,700].map(weight=>({family,size,weight}))));
async function mask(bytes){const {data,info}=await sharp(bytes).removeAlpha().raw().toBuffer({resolveWithObject:true});let x0=info.width,y0=info.height,x1=0,y1=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const i=(y*info.width+x)*3;if(data[i]<120&&data[i+1]<140){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}}const w=x1-x0+1,h=y1-y0+1,a=[];for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)a.push(1-data[(y*info.width+x)*3]/255);return{w,h,a};}
function diff(a,b){let best=Infinity;for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++){let sum=0;for(let y=-2;y<Math.max(a.h,b.h)+2;y++)for(let x=-2;x<Math.max(a.w,b.w)+2;x++){const p=x>=0&&x<a.w&&y>=0&&y<a.h?a.a[y*a.w+x]:0,q=x+dx>=0&&x+dx<b.w&&y+dy>=0&&y+dy<b.h?b.a[(y+dy)*b.w+x+dx]:0;sum+=Math.abs(p-q);}best=Math.min(best,sum);}return best;}
try{
 await b.navigate('/cars/2024-toyota-fortuner-exr');
 await b.send('Emulation.setDeviceMetricsOverride',{width:427,height:952,deviceScaleFactor:3,mobile:true,screenWidth:427,screenHeight:952});
 await b.evaluate(`(()=>{const host=document.createElement('div');host.id='font-study';host.style.cssText='position:fixed;inset:0;background:white;z-index:9999;color:#001442;';const variants=${JSON.stringify(variants)};for(const item of variants){const row=document.createElement('div');row.textContent='2024 TOYOTA FORTUNER EXR';row.style.cssText='height:32px;line-height:32px;padding-left:22px;white-space:nowrap;font-family:'+item.family+';font-size:'+item.size+'px;font-weight:'+item.weight;host.append(row);}document.body.append(host);return document.fonts.ready;})()`);
 const image=Buffer.from((await b.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false})).data,'base64');
 const native=await sharp(await readFile('reference/2026-09-26-continuation/finish-native-detail.png')).extract({left:60,top:1103,width:1000,height:72}).png().toBuffer();
 const target=await mask(native),rank=[];
 for(let i=0;i<variants.length;i++){const raw=await sharp(image).extract({left:60,top:i*96,width:1000,height:96}).png().toBuffer();const candidate=await mask(raw);rank.push({...variants[i],width:candidate.w,height:candidate.h,difference:diff(target,candidate)});}
 rank.sort((a,b)=>a.difference-b.difference);
 await writeFile(root+'/result.json',JSON.stringify({target:{width:target.w,height:target.h},rank},null,2));
 console.log(JSON.stringify({target:{width:target.w,height:target.h},best:rank.slice(0,8)}));
}finally{await b.close();}
