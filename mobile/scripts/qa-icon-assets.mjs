import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const output=process.env.QA_OUTPUT||'reference/web/recovery-20260927/icons-production';
const names=(await fs.readdir('public/icons/native-vector')).filter(name=>name.endsWith('.svg'));
await fs.mkdir(output,{recursive:true});const browser=await chromium.launch({headless:true,channel:'chrome'});const checks=[];
try{
 const page=await browser.newPage();await page.goto(base+'/search',{waitUntil:'networkidle'});
 for(const name of names){
  const local=await fs.readFile('public/icons/native-vector/'+name);
  assert.match(local.toString('utf8'),/^<svg\s/,name+' must contain SVG XML, not decoded binary');
  await sharp(local).png().toBuffer();
  const request=await page.request.get(base+'/icons/native-vector/'+name);assert.equal(request.status(),200,name);
  const decoded=await page.evaluate(url=>new Promise(resolve=>{const image=new Image();image.onload=()=>resolve(image.naturalWidth>0&&image.naturalHeight>0);image.onerror=()=>resolve(false);image.src=url;}),base+'/icons/native-vector/'+name);
  assert.equal(decoded,true,name+' must decode in the browser');checks.push({name,pass:true});
 }
 console.log('NATIVE_ICON_ASSETS',checks.length+'/'+names.length);
}finally{await browser.close();await fs.writeFile(output+'/report.json',JSON.stringify({at:new Date().toISOString(),base,total:names.length,checks},null,2));}
