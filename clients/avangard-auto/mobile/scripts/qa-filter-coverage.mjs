import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { filterSections } from '../.qa/domain/native-filter-fields.mjs';
const base=process.env.QA_URL||'http://127.0.0.1:6424';
const out=process.env.QA_OUTPUT||'reference/web/filter-coverage';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const page=await browser.newPage({viewport:{width:427,height:872},isMobile:true,hasTouch:true});
page.setDefaultTimeout(20000);const report=[];const errors=[];
page.on('pageerror',error=>errors.push(error.message));
try{
 await page.goto(base+'/search/filters',{waitUntil:'networkidle',timeout:90000});
 await page.locator('[data-hydrated="true"]').waitFor();
 await page.getByRole('button',{name:'Show all filters',exact:true}).click();
 for(const field of filterSections.flatMap(section=>section.fields)){
  const row=page.locator('[data-filter-id="'+field.id+'"]');
  try{
   if(field.kind==='toggle'){
    const control=row.getByRole('checkbox');await control.check();assert.equal(await control.isChecked(),true);await control.uncheck();
   }else{
    await row.click();await page.getByRole('dialog').last().waitFor();
    if(['fuel','color','price','seats'].includes(field.id))await page.screenshot({path:out+'/'+field.id+'.png'});
    await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
    assert.notEqual(await page.evaluate(()=>document.body.style.overflow),'hidden');
   }
   report.push({ id: field.id, label: field.label, pass: true });
   console.log('PASS', field.id);
  } catch (error) {
   report.push({ id: field.id, label: field.label, pass: false, error: error.message });
   console.error('FAIL', field.id, error.message);
   await page.screenshot({ path: out + '/failure-' + field.id + '.png' });
   if (await page.getByRole('dialog').count()) await page.keyboard.press('Escape');
  }
 }
} finally {
 await browser.close();
}
await fs.writeFile(out + '/report.json', JSON.stringify({ at: new Date().toISOString(), base, report, errors }, null, 2));
console.log('FILTER_COVERAGE', report.filter(row => row.pass).length + '/' + report.length, 'PAGE_ERRORS', errors.length);
if (report.some(row => !row.pass) || errors.length) process.exitCode = 1;
