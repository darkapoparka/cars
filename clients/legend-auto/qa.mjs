import fs from 'node:fs/promises';
import {chromium} from '../../templates/boxcar/node_modules/playwright/index.mjs';
const root=import.meta.dirname,variant=process.argv[2];const configs={'auto-best':{port:6666,entry:'/',inventory:'/listing-grid',detail:'/listing-detail-v1/1',contact:'/contact',about:'/about-us'},modern:{port:6667,entry:'/cars',inventory:'/bg/cars',detail:'/bg/listing/legend-11774263732166588',contact:'/bg/contact',about:'/bg/contact'},carwow:{port:6668,entry:'/',inventory:'/inventory',detail:'/inventory/audi-q4-166588',contact:'/contact',about:'/about'}};
const cfg=configs[variant];if(!cfg)throw Error('Unknown variant');const out=`${root}/qa/${variant}`;await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true,args:[`--explicitly-allowed-ports=${cfg.port}`,'--renderer-process-limit=2']});const report={variant,startedAt:new Date().toISOString(),pages:[],interactions:[]};
try{
const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
async function capture(key,width){await page.screenshot({path:`${out}/${width}-${key}.png`});return await page.evaluate(()=>({url:location.href,title:document.title,text:document.body.innerText,viewport:{width:innerWidth,documentWidth:document.documentElement.scrollWidth},images:[...document.images].filter(i=>i.getBoundingClientRect().width>0).map(i=>({src:i.currentSrc||i.src,alt:i.alt,loaded:i.complete&&i.naturalWidth>0})),links:[...document.querySelectorAll('a[href]')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({text:(e.innerText||e.getAttribute('aria-label')||'').trim(),href:e.getAttribute('href')})),buttons:[...document.querySelectorAll('button,input,select')].filter(e=>e.getBoundingClientRect().width>0).map(e=>({tag:e.tagName,text:(e.innerText||e.getAttribute('aria-label')||'').trim(),type:e.getAttribute('type'),placeholder:e.getAttribute('placeholder'),name:e.getAttribute('name')}))}));}
for(const width of [390,1440]){
await page.setViewportSize({width,height:900});
for(const [key,route] of Object.entries(cfg).filter(([key])=>key!=='port')){
const startError=errors.length;const res=await page.goto(`http://127.0.0.1:${cfg.port}${route}`,{waitUntil:'networkidle',timeout:90000});await page.locator('body').waitFor();await page.waitForTimeout(500);
await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,70));}scrollTo(0,0);});await page.waitForTimeout(350);
const state=await capture(key,width);report.pages.push({key,width,status:res?.status(),...state,errors:errors.slice(startError)});console.log(`${width} ${key}: ${res?.status()} ${state.title} overflow=${state.viewport.documentWidth>width}`);
if(key==='entry'){
 const menu=page.getByRole('button',{name:/^(Отвори(те)? меню(то)?|Меню|Open menu|Още)$/i}).filter({visible:true}).first();
 if(await menu.count()){await menu.click();await page.waitForTimeout(200);await capture('menu-open',width);await page.keyboard.press('Escape');await page.waitForTimeout(200);report.interactions.push({width,kind:'menu-escape',performed:true,triggerExpanded:await menu.getAttribute('aria-expanded'),focusReturned:await menu.evaluate(e=>e===document.activeElement)});}
}
if(key==='inventory'){
 if(variant==='auto-best'&&width===390){await page.getByRole('button',{name:'Марка или модел',exact:true}).click();await page.waitForTimeout(200);}
 const search=page.locator('input[type="search"],input[placeholder*="Търс"],input[placeholder*="марка"],input[placeholder*="Search"]').filter({visible:true}).first();
 if(await search.count()){await search.fill('Toyota');await search.press('Enter');await page.waitForTimeout(1200);report.interactions.push({width,kind:'search',value:'Toyota',state:await capture('search',width)});}else{
 const selects=page.locator('select').filter({visible:true});let used=false;for(let i=0;i<await selects.count();i++){const select=selects.nth(i);const option=await select.locator('option').evaluateAll(os=>os.find(o=>o.textContent?.includes('Toyota'))?.value);if(option){await select.selectOption(option);await page.waitForTimeout(600);const submit=page.getByRole('button',{name:/Търси|Покажи|Приложи/}).filter({visible:true}).first();if(await submit.count())await submit.click();report.interactions.push({width,kind:'make-filter',value:'Toyota',state:await capture('filter',width)});used=true;break;}}if(!used)report.interactions.push({width,kind:'filter',performed:false,reason:'No matching visible input; inspect captured controls.'});
 }
}
if(key==='detail'){
 const next=page.getByRole('button',{name:/^(Снимка 2|Следваща снимка|Next image|Следващ слайд)$/i}).filter({visible:true}).first();if(await next.count()){await next.click();report.interactions.push({width,kind:'gallery',state:await capture('gallery-2',width)});}
 report.interactions.push({width,kind:'enquiry-path',telephoneLinks:state.links.filter(l=>l.href?.startsWith('tel:')),contactLinks:state.links.filter(l=>/contact|enquir/.test(l.href||''))});
}
if(key==='contact')report.interactions.push({width,kind:'contact-destinations',telephone:state.links.filter(l=>l.href?.startsWith('tel:')),maps:state.links.filter(l=>/maps/.test(l.href||'')),externalEnquirySubmitted:false});
}
}
}catch(error){report.error=error.stack;console.error(error.stack);process.exitCode=1;}finally{await browser.close();report.finishedAt=new Date().toISOString();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));}
