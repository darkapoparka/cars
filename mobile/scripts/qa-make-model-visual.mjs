import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import sharp from 'sharp';
import { pickerLandmarks } from './picker-landmarks.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:6426';
const out=process.env.QA_OUTPUT||'reference/web/make-model/visual'; await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}); const report=[];
const specs=[
 ['bmw-partial','BMW','437-bmw-partial-group',async p=>{await p.getByRole('checkbox',{name:'1 Series',exact:true}).check();await p.getByRole('button',{name:'Expand 1 Series',exact:true}).click();await p.getByRole('checkbox',{name:'114',exact:true}).uncheck();}],
 ['mini','MINI','441-mini-model-catalog'],
 ['mini-filtered','MINI','442-mini-filtered-models',async p=>p.getByLabel('Search models').fill('Aceman E')],
 ['make-search',null,'440-mini-models',async p=>p.getByLabel('Search makes').fill('MINI')],
 ['make-empty',null,'443-make-no-results',async p=>p.getByLabel('Search makes').fill('ZZZ999')],
 ['mercedes','Mercedes-Benz','421-mercedes-models'],
 ['mercedes-190','Mercedes-Benz','422-mercedes-190-selected',async p=>p.getByRole('checkbox',{name:'190',exact:true}).check()],
 ['mercedes-two','Mercedes-Benz','424-mercedes-two-models',async p=>{await p.getByRole('checkbox',{name:'190',exact:true}).check();await p.getByRole('checkbox',{name:'200',exact:true}).check();}],
 ['mercedes-excluded','Mercedes-Benz','423-mercedes-excluded',async p=>{await p.getByRole('checkbox',{name:'190',exact:true}).check();await p.getByRole('switch',{name:'Exclude make'}).click();}],
 ['makes',null,'428-all-makes'],
 ['bmw','BMW','430-bmw-models'],
 ['bmw-family','BMW','432-bmw-group-selected',async p=>p.getByRole('checkbox',{name:'1 Series',exact:true}).check()],
 ['bmw-expanded','BMW','434-bmw-selected-expanded',async p=>{await p.getByRole('checkbox',{name:'1 Series',exact:true}).check();await p.getByRole('button',{name:'Expand 1 Series',exact:true}).click();}],
 ['mercedes-narrow','Mercedes-Benz','436-mercedes-narrow',null,{width:355,height:709}],
];
try {for(const [name,make,native,setup,viewport={width:427,height:872}] of specs){
 const context=await browser.newContext({viewport,deviceScaleFactor:3,isMobile:true,hasTouch:true});const page=await context.newPage();page.setDefaultTimeout(60000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{await page.goto(base+'/search',{waitUntil:'networkidle',timeout:90000});await page.locator('[data-hydrated="true"]').waitFor();if(make==='MINI'){await page.getByRole('button',{name:'All Makes',exact:true}).click();await page.getByLabel('Search makes').fill('MINI');await page.getByRole('dialog').getByRole('button',{name:'MINI',exact:true}).click();}else await page.getByRole('button',{name:make||'All Makes',exact:true}).click();if(setup)await setup(page);await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(200);
 const screenshot=await sharp(await page.screenshot()).resize(viewport.width,viewport.height).png().toBuffer();await fs.writeFile(out+'/'+name+'.png',screenshot);
 const reference=await sharp('reference/android/normalized/'+native+'.png').resize(viewport.width,viewport.height).png().toBuffer();await sharp({create:{width:viewport.width*2,height:viewport.height,channels:3,background:'white'}}).composite([{input:reference,left:0,top:0},{input:screenshot,left:viewport.width,top:0}]).png().toFile(out+'/compare-'+name+'.png');
 const geometry=await page.getByRole('dialog').evaluate(el=>({rect:el.getBoundingClientRect().toJSON(),scroll:el.scrollHeight-el.clientHeight,children:[...el.children].map(child=>({tag:child.tagName,rect:child.getBoundingClientRect().toJSON()}))}));const landmarks=await pickerLandmarks(page,native); report.push({name,native,viewport,errors,geometry,landmarks,pass:errors.length===0 && landmarks.length>=2 && landmarks.every(check=>check.pass)});console.log('CAPTURE',name,errors.length);
 }catch(error){report.push({name,pass:false,error:error.message});console.error('FAIL',name,error.message);}finally{await context.close();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));}
}}finally{await browser.close();}if(report.some(item=>!item.pass))process.exitCode=1;
