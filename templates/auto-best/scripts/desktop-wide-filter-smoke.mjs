import { chooseListingOption, listingFormValue } from './filter-choice-fixture.mjs';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { launchBrowser, previewUrl } from './browser.mjs';
const base = previewUrl();
const output = process.env.FILTER_EVIDENCE_DIR || 'artifacts/desktop-filter-smoke';
const casePattern = process.env.FILTER_CASE ? new RegExp(process.env.FILTER_CASE) : undefined;
const matchesCase = name => !casePattern || casePattern.test(name);
await mkdir(output, { recursive: true });
const browser = await launchBrowser();
const results = [];
try {
 for (const locale of ['bg', 'en']) for (const [width, height] of [[992,700],[1024,600],[1280,720],[1440,900],[1920,1080]]) {
  if (!matchesCase(`${locale}-${width}`)) continue;
  const page = await browser.newPage({ viewport: { width, height }, locale, reducedMotion: 'reduce' });
  await page.context().addCookies([{name:'cars_prompt',value:'v1',url:base},{name:'cars_locale',value:locale,url:base}]);
  const errors=[]; page.on('pageerror', error=>errors.push(error.message));
  await page.goto(`${base}/${locale}/listing-grid?sort=price-asc`,{waitUntil:'networkidle'});
  try {
   await page.locator('.dn-discovery__facet-buttons').waitFor({state:'visible'});
  } catch (cause) {
   const state = await page.evaluate(() => ({ url: location.href, width: innerWidth,
    desktop: matchMedia('(min-width: 992px)').matches, title: document.title,
    facets: [...document.querySelectorAll('.dn-discovery__facet-buttons')].map(el => ({ display: getComputedStyle(el).display, rect: el.getBoundingClientRect().toJSON() })),
    text: document.body.innerText.slice(0, 1500) }));
   await writeFile(`${output}/opening-failure-${locale}-${width}.json`, JSON.stringify({ ...state, errors }, null, 2));
   await page.screenshot({ path: `${output}/opening-failure-${locale}-${width}.png` });
   throw new Error(`Desktop filter entry did not become visible: ${JSON.stringify(state)}`, { cause });
  }
  const trigger=page.locator('.dn-listing-results__filters');
  const dialog=page.locator('#dn-listing-filter-dialog');
  for (const field of ['type','make','model','body','price','year','mileage_max']) {
   const shortcut=page.locator(`[data-facet="${field}"]`);
   const label=await shortcut.getAttribute('aria-label');
   await shortcut.click(); await dialog.waitFor({state:'visible'});
   assert.equal(await dialog.getAttribute('data-compact'),'true',`${field} opens its own selector`);
   assert.equal(await dialog.getByRole('heading',{name:label,exact:true}).count(),1);
   assert.equal(await dialog.getByRole('tab').count(),0,'A shortcut never opens category navigation');
   assert.equal(await page.getByRole('dialog').count(),1,'A direct selector requires only one dialog');
   const choiceFrame=await dialog.boundingBox();
   const choiceFooter=await dialog.locator('.dn-search-footer').boundingBox();
   const anchor=await shortcut.boundingBox();
   assert.equal(choiceFrame.width,field === 'make' ? 840 : field === 'model' ? 640 : 480,'Inventory menus use a width suited to their content');
   assert.equal(await dialog.getAttribute('data-desktop-panel'),'true');
   const tiles=await dialog.locator('.dn-desktop-choice').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().width));
   assert(tiles.every(width=>width<=choiceFrame.width/2),'All and filtered choices retain compact tiles');
   if (field === 'make') {
    const logoTiles=await dialog.locator('.dn-desktop-choice--portrait').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().toJSON()));
    assert.equal(logoTiles.length,tiles.length,'Every make, including All makes, uses the logo grid');
    assert(logoTiles.every(box=>box.width<=choiceFrame.width/6 && box.height>=112),'Six-column brand tiles retain room for logos, labels and stock counts');
    await page.waitForFunction(()=>[...document.querySelectorAll('#dn-listing-filter-dialog .dn-make-logo img')].every(img=>img.complete && img.naturalWidth>0));
   }
   assert(choiceFrame.x>=15 && choiceFrame.y>=15 && choiceFrame.y+choiceFrame.height<=height-15);
   assert(choiceFrame.x<=anchor.x+anchor.width && choiceFrame.x+choiceFrame.width>=anchor.x,'The menu stays attached to its shortcut');
   const placementAnchor=anchor;
   const anchorGap=Math.min(Math.abs(choiceFrame.y-placementAnchor.y-placementAnchor.height),Math.abs(placementAnchor.y-choiceFrame.y-choiceFrame.height));
   assert(anchorGap<=10,'A direct selector opens beside its control, including collision flips');
   assert.equal(await page.locator('.dn-search-overlay').count(),0,'Quick menus leave the results visible');
   assert.notEqual(await page.evaluate(()=>getComputedStyle(document.body).position),'fixed','A shortcut does not lock page scrolling');
   assert(choiceFooter.y+choiceFooter.height<=choiceFrame.y+choiceFrame.height);
   if (await dialog.getByRole('searchbox').count()) {
    const heading=await dialog.getByRole('heading').boundingBox();
    const search=await dialog.getByRole('searchbox').boundingBox();
    const close=await dialog.locator('.dn-picker-close').boundingBox();
    assert(heading.width<=1,'The accessible title does not occupy desktop search space');
    assert(search.width>=choiceFrame.width-160,'Desktop search uses the available header width');
    assert(Math.abs(search.y+search.height/2-close.y-close.height/2)<1,'Search and close are vertically aligned');
   }
   if (width===1440) await page.screenshot({path:output+'/shortcut-'+locale+'-'+field+'-'+width+'.jpg',type:'jpeg',quality:90});
   await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
   assert(await shortcut.evaluate(el=>el===document.activeElement),'Escape returns focus to the exact shortcut');
   assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-asc','Cancelling selectors preserves the applied URL');
  }
  await page.locator('[data-facet=make]').click();
  await dialog.waitFor({state:'visible'});
  await dialog.getByRole('searchbox').fill('no-such-brand');
  await page.locator('[data-facet=model]').click();
  await dialog.waitFor({state:'visible'});
  assert.equal(await dialog.getByRole('searchbox').inputValue(),'','Switching shortcuts starts a fresh suggestion draft');
  assert.equal(await dialog.getByRole('heading',{name:await page.locator('[data-facet=model]').getAttribute('aria-label'),exact:true}).count(),1);
  assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-asc');
  await page.locator('#listing-title').click();
  await dialog.waitFor({state:'hidden'});
  assert.equal(await page.locator('[data-facet=model]').evaluate(el=>el===document.activeElement),false,'Outside dismissal does not steal focus back from the page');
  await trigger.click();
  await dialog.waitFor({state:'visible'});
  const frame=await dialog.boundingBox();
  assert.equal(await dialog.evaluate(el=>el.tagName),'DIALOG','Main Filters uses the Home form');
  assert.equal(await dialog.getByRole('tab').count(),0,'All criteria stay together in the restored form');
  assert.equal(Math.round(frame.width),Math.min(1200,width-48));
  assert(frame.x>=15 && frame.x+frame.width<=width-15 && frame.y>=23 && frame.y+frame.height<=height-23);
  const pane=dialog.locator('.dn-listing-filter__dialog-content');
  const footer=dialog.locator('.dn-listing-filter__dialog-footer');
  const fields=await dialog.locator('.dn-listing-filter__core-grid > label, .dn-listing-filter__core-grid > .dn-identity-field').evaluateAll(els=>els.map(el=>({top:el.getBoundingClientRect().top,height:el.getBoundingClientRect().height,control:el.querySelector('select,button').getBoundingClientRect().height})));
  assert.equal(fields.length,13);
  assert(fields.every(el=>el.control>=44),'Every restored field retains a usable standard target');
  assert(Math.max(...fields.map(el=>el.height))-Math.min(...fields.map(el=>el.height))<1,'Native fields and brand/model controls align');
  assert(Math.max(...fields.slice(0,4).map(el=>el.top))-Math.min(...fields.slice(0,4).map(el=>el.top))<1);
  assert(await pane.evaluate(el=>el.scrollWidth<=el.clientWidth),'The form has no horizontal overflow');
  const footerBox=await footer.boundingBox();
  assert(footerBox.y+footerBox.height<=frame.y+frame.height+1);
  if(height===600) assert(await pane.evaluate(el=>el.scrollHeight>el.clientHeight),'Short windows scroll the form internally');
  await page.screenshot({path:output+'/after-'+locale+'-'+width+'.jpg',type:'jpeg',quality:90});
  const identity=async(field,value,checked=true)=> {
   await dialog.locator('[data-field='+field+'] button').click();
   const popup=page.locator('.dn-filter-picker'); await popup.waitFor({state:'visible'});
   if (field === 'model') await popup.getByRole('searchbox').fill(value);
   const choice=popup.locator('input[value="'+value+'"]');
   await choice.setChecked(checked);
   await page.keyboard.press('Escape'); await popup.waitFor({state:'hidden'});
   assert(await dialog.isVisible(),'Nested Escape preserves the full draft');
  };
  await chooseListingOption(page, dialog, 'body', 'SUV');
  await identity('make','BMW'); await identity('model','X6 M Sport');
  assert.equal(await dialog.locator('input[name=make]').inputValue(),'BMW');
  await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
  assert(await trigger.evaluate(el=>el===document.activeElement));
  assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-asc');
  await trigger.click(); await dialog.waitFor({state:'visible'});
  assert.equal(await listingFormValue(dialog, 'body'),'','Cancel restores applied criteria');
  assert.equal(await dialog.locator('input[name=make]').count(),0);
  await chooseListingOption(page, dialog, 'price_min', '100000');
  await chooseListingOption(page, dialog, 'price_max', '5000');
  assert(await dialog.locator('.dn-listing-filter__dialog-submit').isDisabled());
  assert(await dialog.getByRole('alert').isVisible());
  await dialog.locator('.dn-listing-filter__clear').click();
  await chooseListingOption(page, dialog, 'year_min', '2024');
  await chooseListingOption(page, dialog, 'year_max', '2019');
  assert(await dialog.locator('.dn-listing-filter__dialog-submit').isDisabled());
  await dialog.locator('.dn-listing-filter__clear').click();
  await page.waitForFunction(()=>document.activeElement?.id==='dn-listing-filter-title');
  assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-asc','Clear changes only the local draft');
  await identity('make','Audi'); await identity('make','BMW');
  await identity('model','RS 6 Avant'); await identity('model','X6 M Sport');
  assert.deepEqual(await dialog.locator('input[name=model]').evaluateAll(els=>els.map(el=>el.value)),['RS 6 Avant','X6 M Sport']);
  await identity('make','BMW',false);
  assert.deepEqual(await dialog.locator('input[name=model]').evaluateAll(els=>els.map(el=>el.value)),['RS 6 Avant'],'Removing a brand clears only its incompatible model');
  await dialog.locator('input[name=q]').fill('Avant');
  for(const [field,value] of Object.entries({body:'Wagon',fuel:'Бензин',transmission:'Автоматик',price_max:'100000'})) await chooseListingOption(page, dialog, field, value);
  const equipment=dialog.locator('input[type=checkbox][name=equipment]');
  await equipment.nth(0).check(); await equipment.nth(1).check();
  assert.equal((await footer.boundingBox()).y,footerBox.y,'Selections keep the footer outside the scroll pane');
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle'}),dialog.locator('.dn-listing-filter__dialog-submit').click()]);
  const params=new URL(page.url()).searchParams;
  for(const [key,value] of Object.entries({make:'Audi',model:'RS 6 Avant',q:'Avant',body:'Wagon',fuel:'Бензин',transmission:'Автоматик',price_max:'100000',sort:'price-asc'})) assert.equal(params.get(key),value);
  assert.equal(params.getAll('equipment').length,2);
  assert(![...params.keys()].some(key=>key.startsWith('draft-')));
  assert.equal(await page.locator('.dn-listing-results .dn-vehicle-card').count(),1);
  await trigger.click(); await dialog.waitFor({state:'visible'});
  await dialog.locator('.dn-listing-filter__clear').click();
  assert(await dialog.locator('.dn-listing-filter__dialog-submit').isEnabled());
  await dialog.locator('.dn-listing-filter__dialog-submit').focus(); await page.keyboard.press('Tab');
  assert(await dialog.locator('.dn-listing-filter__close').evaluate(el=>el===document.activeElement));
  await page.keyboard.press('Shift+Tab');
  assert(await dialog.locator('.dn-listing-filter__dialog-submit').evaluate(el=>el===document.activeElement));
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle'}),dialog.locator('.dn-listing-filter__dialog-submit').click()]);
  assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-asc','Applying Clear retains the sort order');
  assert.deepEqual(errors,[]); results.push({locale,width,height,frame,passed:true}); await page.close();
 }
 for(const locale of ['bg','en']) {
  if(!matchesCase(locale+'-out-of-stock')) continue;
  const page=await browser.newPage({viewport:{width:1280,height:720},locale,reducedMotion:'reduce'});
  await page.context().addCookies([{name:'cars_prompt',value:'v1',url:base},{name:'cars_locale',value:locale,url:base}]);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  const requested={make:'Saab',model:'9-3',body:'Liftback',fuel:'Electric',transmission:'Manual',version:'Aero',price_max:'85123',year_min:'2018',sort:'price-desc'};
  await page.goto(base+'/'+locale+'/listing-grid?'+new URLSearchParams(requested),{waitUntil:'networkidle'});
  const dialog=page.locator('#dn-listing-filter-dialog');
  for(const opener of ['.dn-discovery__keyword','.dn-listing-results__filters']) {
   await page.locator(opener).click(); await dialog.waitFor({state:'visible'});
   for(const field of ['make','model']) {
    assert.equal(await dialog.locator('input[type=hidden][name='+field+']').inputValue(),requested[field]);
    await dialog.locator('[data-field='+field+'] button').click();
    assert(await page.locator('.dn-filter-picker input[value="'+requested[field]+'"]').isChecked());
    await page.keyboard.press('Escape'); assert(await dialog.isVisible());
   }
   for(const field of ['body','fuel','transmission','version','price_max','year_min']) assert.equal(await listingFormValue(dialog, ''+field+''),requested[field],'Applied values outside the catalog remain available');
   const submitted=new URLSearchParams(await dialog.locator('form').evaluate(form=>[...new FormData(form)]));
   for(const [key,value] of Object.entries(requested)) assert.equal(submitted.get(key),value);
   await page.keyboard.press('Escape'); await dialog.waitFor({state:'hidden'});
  }
  await page.locator('.dn-listing-results__filters').click();
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle'}),dialog.locator('.dn-listing-filter__dialog-submit').click()]);
  for(const [key,value] of Object.entries(requested)) assert.equal(new URL(page.url()).searchParams.get(key),value);
  await page.locator('.dn-listing-results__filters').click();
  await dialog.locator('.dn-listing-filter__clear').click();
  assert(await dialog.isVisible());
  assert.equal(new URL(page.url()).searchParams.get('make'),'Saab','Draft reset does not navigate early');
  await Promise.all([page.waitForNavigation({waitUntil:'networkidle'}),dialog.locator('.dn-listing-filter__dialog-submit').click()]);
  assert.equal(new URL(page.url()).searchParams.toString(),'sort=price-desc');
  assert.deepEqual(errors,[]); results.push({locale,scenario:'outside-stock values, exact numbers and local reset',passed:true}); await page.close();
 }
 // Development-only large-catalog fixture; reusable inventory stays unchanged.
 for(const locale of ['bg','en']) {
  if(!matchesCase(locale+'-equipment-catalog')) continue;
  const page=await browser.newPage({viewport:{width:1024,height:600},locale,reducedMotion:'reduce'});
  await page.context().addCookies([{name:'cars_prompt',value:'v1',url:base},{name:'cars_locale',value:locale,url:base}]);
  const errors=[]; page.on('pageerror',error=>errors.push(error.message));
  const additions=Array.from({length:60},(_,index)=>'QA extra '+String(index+1).padStart(2,'0'));
  let fixtureApplied=false;
  await page.route('**/src/lib/data/listing.ts*',async route=> {
   const response=await route.fetch({maxRetries:2}); const source=await response.text();
   const body=source.replace(/equipment:\s*\[([^\]]*)\]/,(_,values)=>'equipment: [...['+values+'], ...'+JSON.stringify(additions)+']');
   assert.notEqual(body,source); fixtureApplied=true; await route.fulfill({response,body});
  });
  await page.goto(base+'/'+locale+'/listing-grid',{waitUntil:'networkidle'}); assert(fixtureApplied);
  await page.locator('.dn-listing-results__filters').click();
  const dialog=page.locator('#dn-listing-filter-dialog'); await dialog.waitFor({state:'visible'});
  const pane=dialog.locator('.dn-listing-filter__dialog-content');
  const equipment=dialog.locator('input[type=checkbox][name=equipment]');
  assert.equal(await equipment.count(),68);
  assert(await pane.evaluate(el=>el.scrollHeight>el.clientHeight && el.scrollWidth<=el.clientWidth));
  const footer=dialog.locator('.dn-listing-filter__dialog-footer'); const footerBox=await footer.boundingBox();
  await dialog.locator('input[name=equipment][value="QA extra 60"]').check();
  assert.equal((await footer.boundingBox()).y,footerBox.y,'Large catalogs cannot push the action footer away');
  await page.screenshot({path:output+'/large-catalog-'+locale+'-1024.jpg',type:'jpeg',quality:90});
  await dialog.locator('.dn-listing-filter__clear').click();
  assert.equal(await equipment.evaluateAll(inputs=>inputs.filter(input=>input.checked).length),0);
  await page.waitForFunction(()=>document.activeElement?.id==='dn-listing-filter-title');
  assert.deepEqual(errors,[]); results.push({locale,scenario:'68 equipment choices, internal scrolling, footer and local reset',passed:true}); await page.close();
 }
 assert(results.length>0,'No desktop filter cases matched');
 console.log('Shared Home/listing filters: '+results.length+' locale/viewport and logic cases passed.');
} finally { await browser.close(); await writeFile(output+'/results.json',JSON.stringify(results,null,2)); }
