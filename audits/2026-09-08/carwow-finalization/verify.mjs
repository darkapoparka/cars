import { chromium } from '../../../templates/carwow/node_modules/playwright/index.mjs';
import { strict as assert } from 'node:assert';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
const base='http://127.0.0.1:6463';
const mobile={viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce',userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'};
async function check(name,run){try{await run();results.push({name,pass:true});console.log('PASS',name)}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL',name,e.message)}}
try {
 const ctx=await browser.newContext(mobile);const p=await ctx.newPage();
 await check('Sell direct/reload cannot confirm; failed/valid fixture responses drive actual outcomes',async()=>{
  let sent=0;
  await p.route('**/api/leads',async r=>{sent++;await r.fulfill({status:sent===1?503:201,contentType:'application/json',body:JSON.stringify(sent===1?{message:'Тест: временна грешка'}:{leadId:'fixture-lead',conversationId:'fixture-conversation',status:'new'})})});
  await p.goto(base+'/sell-your-car/request',{waitUntil:'networkidle'});
  assert.equal(await p.locator('#ms-confirm-title').count(),0);
  await p.reload({waitUntil:'networkidle'});assert.equal(await p.locator('#ms-confirm-title').count(),0);assert.equal(sent,0);
  await p.getByRole('button',{name:'Към контакт',exact:true}).click();
  await p.locator('dialog[open] input[type="tel"]').fill('0888000000');
  await p.getByRole('button',{name:'Изпрати за оценка',exact:true}).click();
  await p.getByText('Тест: временна грешка',{exact:true}).waitFor();assert.equal(await p.locator('#ms-confirm-title').count(),0);
  await p.getByRole('button',{name:'Изпрати за оценка',exact:true}).click();await p.locator('#ms-confirm-title').waitFor();assert.equal(sent,2);
  assert.equal(await p.locator('#ms-confirm-title').textContent(),'Получихме данните');
  await p.reload({waitUntil:'networkidle'});assert.equal(await p.locator('#ms-confirm-title').count(),0);
  await p.goto(base+'/inventory',{waitUntil:'networkidle'});await p.goBack({waitUntil:'networkidle'});assert.equal(await p.locator('#ms-confirm-title').count(),0);
 });
 await check('Mobile filter draft cancel, Apply URL, reload and focus trap',async()=>{
  await p.goto(base+'/inventory',{waitUntil:'networkidle'});
  const brand=p.getByRole('button',{name:'Марка',exact:true});await brand.click();
  const d=p.locator('dialog.mobile-fullsheet');await d.waitFor();
  const first=d.locator('button').first();await first.focus();await p.keyboard.press('Shift+Tab');
  assert(await p.evaluate(()=>document.activeElement?.closest('dialog.mobile-fullsheet')!==null));
  await d.getByRole('button',{name:/BMW/}).first().click();
  await p.keyboard.press('Escape');await d.waitFor({state:'detached'});assert(!p.url().includes('brand=BMW'));
  assert.equal(await p.evaluate(()=>document.activeElement?.textContent?.trim()),'Марка');
  await brand.click();await d.getByRole('button',{name:/BMW/}).first().click();
  await d.getByRole('button',{name:/Покажи/}).click();await d.waitFor({state:'detached'});
  assert(p.url().includes('brand=BMW'));await p.reload({waitUntil:'networkidle'});assert(p.url().includes('brand=BMW'));
  assert((await p.locator('.mobile-inventory').innerText()).includes('BMW'));
 });
 await check('Calculator recalculates, rejects invalid input, preserves detail handoff',async()=>{
  await p.goto(base+'/calculator',{waitUntil:'networkidle'});
  const before=await p.locator('.calculator-page').innerText();
  await p.locator('#calculatePrice').fill('20000');await p.locator('[name="КалкулаторInterestRate"]').fill('12');
  await p.waitForTimeout(150);
  const after=await p.locator('.calculator-page').innerText();assert.notEqual(after,before);
  await p.locator('#calculatePrice').fill('-1');await p.getByRole('alert').waitFor();
  await p.goto(base+'/calculator?FinancingCalculatorCarPrice=26699&FinancingCalculatorLoanTerm=60',{waitUntil:'networkidle'});
  assert.equal(await p.locator('#calculatePrice').inputValue(),'26699');
 });
 await ctx.close();
 for(const width of [320,390,430,1440]) {
  const c=await browser.newContext({...mobile,viewport:{width,height:844},isMobile:width<992,hasTouch:width<992});
  await c.addInitScript(()=>localStorage.setItem('daynight:compare',JSON.stringify(['mercedes-benz-gla-45-amg-405323','audi-a8-574112'])));
  const page=await c.newPage();
  await check(`Compare identify/remove and modal chat focus ${width}`,async()=>{
   await page.goto(base+'/compare',{waitUntil:'networkidle'});
   const selections=page.locator('.compare-selection');await selections.waitFor();assert((await selections.innerText()).includes('Audi A8'));
   assert.equal(await page.locator('h1:visible').count(),1);
   const geometry=await page.locator('.card-details').evaluate(e=>({x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right,w:innerWidth}));assert(geometry.x>=0&&geometry.right<=geometry.w);
   await selections.getByRole('button',{name:'Премахни Audi A8',exact:true}).click();assert(!(await selections.innerText()).includes('Audi A8'));
   await page.locator('.chat-launcher').click();await page.locator('.chat-dialog[open]').waitFor();
   assert(!(await page.locator('.chat-thread').innerText()).includes('Онлайн'));
   await page.locator('.chat-close').focus();await page.keyboard.press('Shift+Tab');assert(await page.evaluate(()=>Boolean(document.activeElement?.closest('.chat-dialog'))));
   await page.keyboard.press('Escape');await page.locator('.chat-dialog[open]').waitFor({state:'hidden'});assert(await page.locator('.chat-launcher').evaluate(e=>e===document.activeElement));
  });
  await c.close();
 }
 const desktop=await browser.newContext({viewport:{width:1440,height:1050},reducedMotion:'reduce'});const dp=await desktop.newPage();
 await check('Photo/video enquiry retains vehicle context and no live send',async()=>{
  await dp.goto(base+'/inventory/mercedes-benz-gla-45-amg-405323',{waitUntil:'networkidle'});
  await dp.getByRole('link',{name:'Заяви още снимки',exact:true}).click();await dp.waitForURL(/contact/);
  assert(dp.url().includes('vehicle=mercedes-benz-gla-45-amg-405323'));
  assert((await dp.locator('textarea').first().inputValue()).includes('снимки'));
  assert((await dp.locator('body').innerText()).includes('Mercedes-Benz GLA 45 AMG'));
 });await desktop.close();
} finally {await browser.close();await fs.writeFile(new URL('./verification.json',import.meta.url),JSON.stringify(results,null,2));}
if(results.some(r=>!r.pass))process.exitCode=1;
