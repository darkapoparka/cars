
async function launch(args){return new Promise((resolve,reject)=>{const proc=spawn('powershell.exe',args,{stdio:['ignore','pipe','pipe']});let output='';const timer=setTimeout(()=>reject(Error('Runtime launch timed out: '+output)),30000);proc.stdout.on('data',chunk=>{output+=chunk;try{JSON.parse(output);clearTimeout(timer);proc.stdout.destroy();proc.stderr.destroy();proc.unref();(async()=>{const result=JSON.parse(output);for(let n=0;n<45;n++){try{if((await fetch(result.Url,{signal:AbortSignal.timeout(2000)})).ok){resolve({stdout:output});return;}}catch{}await new Promise(r=>setTimeout(r,500));}reject(Error('Runtime did not become ready: '+result.Url));})();}catch{}});proc.on('error',reject);});}
import fs from 'node:fs/promises';
import {execFile,spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const rawExec=promisify(execFile),exec=(file,args)=>rawExec(file,args,{timeout:30000}), runtime='J:/cars/audits/2026-09-08/verify/runtime.ps1';

async function capture(p,file){try{await p.screenshot({path:file,timeout:12000,animations:'disabled'});}catch(error){if(!/font/i.test(error.message))throw error;const cdp=await p.context().newCDPSession(p);try{const result=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await fs.writeFile(file,Buffer.from(result.data,'base64'));await fs.writeFile(file+'.capture.json',JSON.stringify({fallback:'CDP viewport capture after Playwright font-ready timeout',error:error.message},null,2));}finally{await cdp.detach();}}}
const b=await chromium.launch({channel:'chrome',headless:true});
try {
 for(const [c,t,port] of [['champion-auto-pro','carwow',6633]]) {
  const dir=`J:/cars/clients/${c}/qa-final/supplement`;await fs.mkdir(dir,{recursive:true});let owned;const rows=[];
  try {
   owned=JSON.parse((await launch(['-NoProfile','-File',runtime,'-Client',c,'-Template',t,'-Port',String(port)])).stdout);
   await new Promise(r=>setTimeout(r,2000));
   for(const width of [390,1440]) {
    const p=await b.newPage({viewport:{width,height:900}});p.setDefaultTimeout(15000);const r={template:t,width,errors:[]};p.on('pageerror',e=>r.errors.push(e.message));
    const homeResponse=await p.goto(`http://127.0.0.1:${port}/`,{waitUntil:'networkidle',timeout:90000});await p.locator('a[href]').filter({visible:true}).first().waitFor({state:'visible',timeout:45000});await p.waitForTimeout(1500);r.home=await p.evaluate(()=>({title:document.title,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,broken:[...document.images].filter(i=>i.complete&&i.getBoundingClientRect().width>0&&!i.naturalWidth).map(i=>i.src)}));r.home.status=homeResponse.status();r.home.pass=r.home.status===200&&r.home.overflow<=0&&!r.home.broken.length;await capture(p,`${dir}/${t}-${width}-home.png`);
    if(t==='modern') { r.logoReviewCapture=true; } else if(c==='astracar') {
     await p.goto(`http://127.0.0.1:${port}/listing-detail-v1/1`,{waitUntil:'networkidle'});const img=p.locator('.dn-detail-gallery > img');const before=await img.getAttribute('src');
     await p.getByRole('button',{name:'Следваща снимка',exact:true}).click();r.galleryChanged=before!==await img.getAttribute('src');
     await p.getByRole('button',{name:'Предишна снимка',exact:true}).click();r.galleryPrevious=before===await img.getAttribute('src');
     await capture(p,`${dir}/${t}-${width}-gallery.png`);
    } else if(t==='auto-best') {
     r.budgetLabels=await p.getByText('До 10 000 €',{exact:true}).count()>0;
     await p.goto(`http://127.0.0.1:${port}/listing-grid?price_min=10000&price_max=20000`,{waitUntil:'networkidle'});r.budgetResults=await p.locator('a[href*="/listing-detail-v1/"]').count()>0;
    } else {
     await p.goto(`http://127.0.0.1:${port}/financing`,{waitUntil:'networkidle'});r.phones=await p.locator('a[href^="tel:"]').evaluateAll(es=>es.map(a=>a.getAttribute('href')));if(c==='champion-auto-pro'&&width===390){await p.goto(`http://127.0.0.1:${port}/inventory/renault-captur-512292`,{waitUntil:'networkidle',timeout:45000});const pic=p.locator('.mobile-detail__media-photo');const before=await pic.getAttribute('src');await p.getByRole('button',{name:'Снимка 2',exact:true}).click();await p.waitForTimeout(500);r.galleryChanged=before!==await pic.getAttribute('src');await capture(p,`${dir}/carwow-390-gallery.png`);}const allowed=c==='champion-auto-pro'?['tel:0885072555','tel:+359885072555']:['tel:0877800921','tel:+359877800921','tel:0896391615','tel:+359896391615'];r.phoneCorrect=r.phones.length>0&&r.phones.every(v=>allowed.includes(v));
    }
    r.pass=r.home.pass&&!r.errors.length&&r.galleryChanged!==false&&r.galleryPrevious!==false&&r.budgetLabels!==false&&r.budgetResults!==false&&r.phoneCorrect!==false;rows.push(r);await p.close();
   }
  } catch(e) {rows.push({pass:false,error:e.message});}
  finally {if(owned)await exec('powershell.exe',['-NoProfile','-File',runtime,'-StopPid',String(owned.PID),'-Port',String(port)]);await fs.writeFile(`${dir}/${t}.json`,JSON.stringify(rows,null,2));console.log(c,t,JSON.stringify(rows));}
 }
} finally {await b.close();}



