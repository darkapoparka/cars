import { readFile } from 'node:fs/promises';
import { serviceAction,fillServiceEntry } from './service-entry-fixture.mjs';

const image=await readFile(new URL('../static/assets/images/lead/day-night-stock-01.webp',import.meta.url));

// These checks exercise local demo UI without copying data or opening a share target.
export async function stubCardStateDelivery(context) {
  await context.addInitScript(()=>{
    Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{}}});
    Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{}});
    Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});
  });
}

export async function inspectCardOverlays(page,{locale,width,navigate,record}) {
async function openImport(page,locale,width) {
  await navigate(page,locale,'/contact?topic=import');
  await fillServiceEntry(page,{link:'https://example.com/car?id=12'});
  await serviceAction(page).click();
  const dialog=page.locator('.dn-enquiry');await dialog.waitFor({state:'visible'});
  await record(page,locale,width,'import-enquiry');
  await dialog.locator('textarea').fill('Regular maintenance.');
  await dialog.locator('input[autocomplete="name"]').fill('Radius Test');
  await dialog.locator('input[type="tel"]').fill('+359 88 123 4567');
  await dialog.locator('footer .dn-enquiry-primary').click();
  await dialog.locator('.dn-enquiry-summary').waitFor({state:'visible'});
  await record(page,locale,width,'import-review');
  await dialog.locator('.dn-enquiry-copy').click();
  await record(page,locale,width,'import-feedback',{screenshot:true});
  await dialog.locator('footer .dn-enquiry-primary').click();
  await record(page,locale,width,'import-completion');
  await page.keyboard.press('Escape');
}
async function openSell(page,locale,width) {
  await navigate(page,locale,'/contact?topic=trade-in');
  if(width<768) {
    await page.locator('.dn-tradein-info-drawer--inline .dn-tradein-info-drawer__peek').click();
    await page.locator('.dn-tradein-info-dialog[open]').waitFor({state:'visible'});
    await record(page,locale,width,'sell-guide');
    await page.keyboard.press('Escape');
  }
  await fillServiceEntry(page,{make:'Audi',model:'A6 Avant',year:'2020',mileage:'85000'});
  await serviceAction(page).click();
  const dialog=page.locator('.dn-tradein-dialog');await dialog.waitFor({state:'visible'});
  await dialog.locator('input[type="file"]').setInputFiles({name:'car.webp',mimeType:'image/webp',buffer:image});
  await dialog.locator('textarea').fill('Regular maintenance.');
  await dialog.locator('input[autocomplete="name"]').fill('Radius Test');
  await dialog.locator('input[type="tel"]').fill('+359 88 123 4567');
  await record(page,locale,width,'sell-photos');
  await dialog.locator('.dn-tradein-primary').click();
  await dialog.locator('.dn-tradein-review-card').waitFor({state:'visible'});
  await record(page,locale,width,'sell-review');
  await dialog.locator('.dn-tradein-copy').click();
  await record(page,locale,width,'sell-feedback',{screenshot:true});
  await page.keyboard.press('Escape');
}
async function overlays(page,locale,width) {
  await navigate(page,locale,'');
  if(width<992) {
    await page.locator('button[aria-controls="dn-mobile-menu"]:visible').first().click();
    const trigger=page.locator('.dn-banner-picker-trigger:visible');
    if(await trigger.count()) {
      await trigger.click();await page.locator('.dn-banner-picker[open]').waitFor({state:'visible'});
      await record(page,locale,width,'banner-picker',{screenshot:true});
      await page.keyboard.press('Escape');
    }
    await page.keyboard.press('Escape');
  }
  await navigate(page,locale,'/contact?topic=import');
  if(width<768) {
    await page.locator('.dn-import-info-drawer--inline .dn-import-info-drawer__peek').click();
    await page.locator('.dn-import-info-dialog[open]').waitFor({state:'visible'});
    await record(page,locale,width,'import-guide');await page.keyboard.press('Escape');
  }
  await openImport(page,locale,width);
  await openSell(page,locale,width);
  await navigate(page,locale,'/listing-detail-v1/1');
  const finance=page.locator('.dn-detail-finance-trigger button:visible');
  if(await finance.count()) {
    await finance.click();await page.locator('.dn-detail-finance-dialog[open]').waitFor({state:'visible'});
    await record(page,locale,width,'finance-results');await page.keyboard.press('Escape');
  }
}
  await overlays(page,locale,width);
}
