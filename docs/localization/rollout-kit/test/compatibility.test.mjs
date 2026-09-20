import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import * as before from '../evidence/compiled-original/original-core.js';
import * as after from '../candidate/compiled/alreef-core.js';

test('candidate retains the deployed policy for valid locale-resolution combinations',()=>{
  let cases=0;
  for(const base of ['','/variant-2','/variant-3'])
  for(const language of ['','/en','/bg'])
  for(const query of ['','?lang=en','?lang=bg'])
  for(const cookie of [null,'cars_locale=en','cars_locale=bg','cars_locale=ar','cars_country=DE; cars_prompt=v1'])
  for(const acceptLanguage of [null,'en','bg','en-US;q=0.2,bg-BG;q=0.9','ar,de','bg;q=0,en;q=0.6'])
  for(const trustedCountry of [null,'AE','BG','DE','INVALID']) {
    const input={url:new URL(base+language+'/contact'+query,'https://dealer.example'),cookie,acceptLanguage,trustedCountry};
    assert.deepEqual(after.resolveLocale(input),before.resolveLocale(input));cases++;
  }
  assert.equal(cases,4050);
});
test('public API routes, formatting and active languages remain compatible',()=>{
  assert.deepEqual(after.localeContract.enabledLocales,before.localeContract.enabledLocales);
  for(const locale of ['en','bg']) {
    assert.equal(after.intlLocale(locale),before.intlLocale(locale));
    for(const amount of [0,12500,99800])assert.equal(after.formatPrice(amount,locale),before.formatPrice(amount,locale));
    for(const href of ['/','/contact?topic=trade-in#form','/variant-2/en/cars?q=BMW#results','/variant-3/bg/inventory/one','/variant-3/assets/photo.webp','/api/preferences','tel:+971547707080','https://outside.example'])assert.equal(after.localeHref(href,locale),before.localeHref(href,locale));
  }
});
test('valid save/dismiss responses retain current cookies, status, URL and cache headers',async()=>{
  for(const action of ['save','dismiss'])for(const locale of ['en','bg'])for(const type of ['application/json','application/x-www-form-urlencoded']) {
    const body={action,locale,country:'DE',returnTo:'/variant-2/en/cars?make=BMW#results'};
    const req=()=>new Request('https://dealer.example/api/preferences',{method:'POST',headers:{origin:'https://dealer.example','content-type':type},body:type==='application/json'?JSON.stringify(body):new URLSearchParams(body).toString()});
    const [a,b]=await Promise.all([before.preferenceResponse(req()),after.preferenceResponse(req())]);
    assert.equal(a.status,b.status);assert.deepEqual([...a.headers],[...b.headers]);assert.equal(await a.text(),await b.text());
  }
});
test('the existing FAB extraction can run without cookies, Requests, Responses or a server',()=>{
  const js=fs.readFileSync(new URL('../candidate/compiled/alreef-core.js',import.meta.url),'utf8');
  const boundary=js.indexOf('export function cookieValue(');
  assert.ok(boundary>0);
  const client=js.slice(0,boundary).replace(/^export /gm,'');
  assert.doesNotMatch(client,/Set-Cookie|preferenceResponse|request\.body/);
  const context={Intl,URL};
  vm.runInNewContext(client+'\nresult = [localeHref("/variant-2/cars", "bg"), localeContract.enabledLocales.join(","), isLocale("ar")];',context);
  assert.deepEqual(Array.from(context.result),['/variant-2/bg/cars','en,bg',false]);
});
