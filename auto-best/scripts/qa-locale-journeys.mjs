/**
 * Read-only Phase 2 browser journeys, against EXISTING servers only.
 * PowerShell (current worker scope):
 * $env:LOCALE_QA_DESIGNS='auto-best,carwow'
 * $env:LOCALE_QA_OUT='runtime/phase2/journeys-worker/run-20260920'
 * node scripts/qa-locale-journeys.mjs
 * Optional: DEALER_BASE_URL, LOCALE_QA_WIDTHS=320,390,1440,
 * LOCALE_QA_LOCALES=en,bg, LOCALE_QA_ONLY=<case-name substring>.
 * Default matrix includes Modern; the initial worker run explicitly excludes it.
 * No valid business form is submitted. APIRequestContext is deliberately unused:
 * every browser request goes through the context's deny-by-default write guard.
 */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const root = path.resolve(import.meta.dirname, '..');
const base = new URL(process.env.DEALER_BASE_URL || process.env.BASE_URL);
assert(['http:', 'https:'].includes(base.protocol));
assert(!base.username && !base.password, 'Credentials are not accepted in DEALER_BASE_URL');
const out = path.resolve(root, process.env.LOCALE_QA_OUT || `runtime/phase2/journeys-${Date.now()}`);
const designs = (process.env.LOCALE_QA_DESIGNS || 'auto-best').split(',');
const widths = (process.env.LOCALE_QA_WIDTHS || '320,390,1440').split(',').map(Number);
const locales = (process.env.LOCALE_QA_LOCALES || 'en,bg').split(',');
const only = process.env.LOCALE_QA_ONLY || '';
const fullNarrow = process.env.LOCALE_QA_FULL_NARROW !== '0';
assert(designs.every(x => ['auto-best', 'modern', 'carwow'].includes(x)));
assert(widths.every(x => Number.isInteger(x) && x >= 320 && x <= 2560));
assert(locales.every(x => ['en', 'bg'].includes(x)));
fs.mkdirSync(out, { recursive: true });
const config = {
  'auto-best': { mount: '', home: '', preference: '/contact?topic=import&qa=locale-journey#contact-intent', menu: '[aria-controls="dn-mobile-menu"]', menuPanel: '#dn-mobile-menu', catalog: 'src/lib/locale/catalog.ts' },
  modern: { mount: '/variant-2', home: '/cars', preference: '/contact?topic=import&qa=locale-journey#main-content', menu: '[data-slot="dealer-bottom-nav-menu"]', menuPanel: '[data-slot="dealer-mobile-menu"]', catalog: 'modern/packages/internationalization/catalog.ts' },
  carwow: { mount: '/variant-3', home: '', preference: '/contact?intent=import&qa=locale-journey#main-content', menu: '[aria-controls="mobile-menu-sheet"]', menuPanel: '#mobile-menu-sheet', catalog: 'carwow/src/lib/locale/catalog.ts' },
};
const source = (file, needle = '') => {
  const lines = fs.readFileSync(path.join(root, file), 'utf8').split(/\r?\n/);
  const index = Math.max(0, lines.findIndex(line => line.includes(needle)));
  return { file, line: index + 1, excerpt: lines.slice(Math.max(0, index - 2), index + 5).join('\n') };
};
const sources = {
 preferences:[source('src/lib/locale/LocalePreferences.svelte','async function submit')],fab:[],
 autoSell:[source('src/lib/components/company/TradeInEnquiry.svelte','async function move'),source('src/lib/components/company/EnquiryEntryField.svelte','function save')],
 autoImport:[source('src/lib/components/company/VehicleEnquiry.svelte','async function open'),source('src/lib/components/company/EnquiryEntryField.svelte','function save')],
 autoFinance:[source('src/lib/components/company/ContactIntent.svelte'),source('src/lib/components/vehicles/VehicleFinanceCalculator.svelte')],
 menus:[source('src/lib/components/layout/MobileMenu.svelte','LocaleTrigger fullLabel')],
 filters:[source('src/lib/components/listing/ListingFilters.svelte','dn-listing-filter-dialog')]
};
const inventoryCurrency='EUR';
// Parse the JSON object literals in the generated TYPED catalog; never execute app code.
const catalogs = Object.fromEntries(designs.map(design => {
  const text = fs.readFileSync(path.join(root, config[design].catalog), 'utf8');
  const parse = name => {
    const match = text.match(new RegExp(`export const ${name} = (\\{[\\s\\S]*?\\}) as const;`));
    assert(match, `Typed catalog ${design}/${name} could not be parsed`);
    return JSON.parse(match[1]);
  };
  return [design, { en: parse('en'), bg: parse('bg'), sourceKeys: parse('sourceKeys') }];
}));
const results = [];
const sessions = [];
const startedAt = new Date().toISOString();
const omissions = [
  'Interaction acceptance only: no builds, guards, complete route crawl, real enquiries, AI, payments, Admin interaction, external contact clicks, or production run.',
  fullNarrow ? '320px includes the complete mobile journey interaction suite, not only preference target-fit.' : '320px exercises preference and target-fit smoke; complete journey interactions run at every configured width above 320px.',
  ...(!designs.includes('modern') ? ['Modern not selected: its browser journeys and the full Auto → Modern → Carwow chain remain unexecuted.'] : []),
  'No-JS, blocked storage and server isolation belong to the root owner’s separate suites.',
];
let activeName = '';
const rel = file => path.relative(root, file).replaceAll('\\', '/');
function save() {
  const summary = { checks: results.length, passed: results.filter(x => x.status === 'passed').length, failed: results.filter(x => x.status === 'failed').length, blocked: results.filter(x => x.status === 'blocked').length, skipped: results.filter(x => x.status === 'skipped').length };
  fs.writeFileSync(path.join(out, 'RESULTS.json'), JSON.stringify({ startedAt, updatedAt: new Date().toISOString(), base: base.origin, configuration: { designs, widths, locales, only, fullNarrow }, scope: omissions, summary, results, sessions }, null, 2));
}
const slug = name => name.replace(/[^a-zA-Z0-9-]+/g, '-').slice(0,170);
async function check(s, name, refs, fn) {
  const fullName = `${s.name} / ${name}`;
  activeName = fullName;
  const result = { name: fullName, design: s.design, locale: s.locale, width: s.width, status: 'running', sources: refs, startedAt: new Date().toISOString(), detail: {} };
  const filename = `${String(results.length + 1).padStart(4, '0')}-${slug(fullName)}.png`;
  try { if(s.environmentBlocked)throw new Error(s.environmentBlocked);await fn(result.detail); result.status = 'passed'; }
  catch (error) { result.status = s.environmentBlocked?'blocked':'failed'; result.error = error.message; result.category = s.environmentBlocked?'environment-preview-unavailable':error.name === 'TimeoutError' ? 'interaction-or-readiness-failure' : 'acceptance-assertion'; }
  finally {
    result.url = s.page.url();
    try { await s.page.screenshot({ path: path.join(out, filename), timeout: 6000 }); result.screenshot = rel(path.join(out, filename)); }
    catch (error) { result.screenshotError = error.message; }
    result.finishedAt = new Date().toISOString(); results.push(result); save();
    console.log(`${result.status.toUpperCase()} ${fullName}${result.error ? ': ' + result.error.slice(0,300) : ''}`);
  }
  return result.status === 'passed';
}
function skip(s, name, reason) { results.push({ name: `${s.name} / ${name}`, status: 'skipped', reason }); save(); }
const route = (design, locale, suffix = config[design].home) => `${config[design].mount}/${locale}${suffix}`;
const opposite = locale => locale === 'en' ? 'bg' : 'en';
const prefs = page => page.locator('[data-locale-dialog]');
async function ready(page) { await page.locator('[data-locale-ready="true"]').waitFor({ state: 'attached' }); }
async function go(s, suffix, locale = s.locale) {
  const response = await s.page.goto(base.origin + route(s.design, locale, suffix), { waitUntil: 'domcontentloaded' });
  if(response?.status()>=500)s.environmentBlocked=`Existing preview unavailable: HTTP ${response.status()} at ${s.page.url()}. No server action taken.`;
  assert(response && response.status() < 400, `Public page HTTP ${response?.status()}`);
  await ready(s.page);
  assert.equal(await s.page.locator('html').getAttribute('lang'), locale);
  assert.equal(await s.page.locator('html').getAttribute('dir'), 'ltr');
}
async function dismiss(s) {
  if (await prefs(s.page).isVisible()) {
    const response = s.page.waitForResponse(r => r.url() === base.origin + '/api/preferences' && r.request().method() === 'POST');
    await s.page.keyboard.press('Escape'); await response; await prefs(s.page).waitFor({ state: 'hidden' });
  }
}
async function fit(page, locator, minTarget = false) {
  // A dialog can be inside an animated drawer. Flush its scheduled intro and
  // await finite animations on both the measured subtree and its ancestors.
  await locator.evaluate(async el => {
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const animations = new Set(el.getAnimations({ subtree: true }));
    for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
      for (const animation of ancestor.getAnimations()) animations.add(animation);
    }
    await Promise.all([...animations]
      .filter(animation => animation.effect?.getComputedTiming().iterations !== Infinity)
      .map(animation => animation.finished.catch(() => {})));
  });
  const geometry = await locator.evaluate(el => {
    const r = el.getBoundingClientRect();
    return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom, innerWidth, innerHeight, scrollWidth:el.scrollWidth, clientWidth:el.clientWidth };
  });
  assert(geometry.x >= -1 && geometry.y >= -1 && geometry.right <= geometry.innerWidth + 1 && geometry.bottom <= geometry.innerHeight + 1, `Outside viewport: ${JSON.stringify(geometry)}`);
  assert(geometry.scrollWidth <= geometry.clientWidth + 1, `Horizontal overflow in target: ${JSON.stringify(geometry)}`);
  if (minTarget) assert(geometry.width >= 44 && geometry.height >= 44, `Target below 44px: ${JSON.stringify(geometry)}`);
  return geometry;
}
async function noOverflow(page) {
  const result = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, offenders: [...document.querySelectorAll('body *')].filter(e => { const r=e.getBoundingClientRect(); return e.checkVisibility() && r.width > 1 && (r.right > innerWidth+1 || r.left < -1) && !e.closest('[aria-hidden="true"]'); }).slice(0,15).map(e=>({ tag:e.tagName, cls:e.className, text:e.textContent?.slice(0,80) })) }));
  assert(result.scrollWidth <= result.width + 1, `Page horizontal overflow: ${JSON.stringify(result)}`);
  return result;
}
async function trap(page, dialog) {
  const controls = dialog.locator('button:enabled:visible,select:enabled:visible,input:enabled:visible:not([type=hidden]),textarea:enabled:visible,a[href]:visible');
  const count = await controls.count(); assert(count > 0);
  await controls.first().focus();
  const trace = [];
  for (const key of ['Shift+Tab', ...Array(count + 2).fill('Tab'), 'Shift+Tab']) {
    await page.keyboard.press(key);
    const state = await dialog.evaluate(el => ({ contained: el.contains(document.activeElement), active: document.activeElement?.outerHTML.slice(0,300) }));
    trace.push({ key, ...state });
  }
  assert(trace.every(state=>state.contained), `Focus escaped dialog: ${JSON.stringify(trace)}`);
  return trace;
}
async function copyCheck(s, locator = s.page.locator('body'), locale = s.locale) {
  const strings = await locator.evaluate(rootNode => {
    const list = []; const walk = document.createTreeWalker(rootNode, NodeFilter.SHOW_TEXT);
    while (walk.nextNode()) { const n=walk.currentNode, e=n.parentElement;
      if (!e || e.closest('script,style,option,textarea,[aria-hidden="true"]') || !e.checkVisibility()) continue;
      const value=n.textContent.replace(/\s+/g,' ').trim(); if(value) list.push({value,tag:e.tagName});
    }
    for(const e of rootNode.querySelectorAll('[aria-label],input[placeholder],textarea[placeholder]')) if(e.checkVisibility()) for(const a of ['aria-label','placeholder']) if(e.getAttribute(a)) list.push({value:e.getAttribute(a),tag:e.tagName,attribute:a});
    return list;
  });
  const catalog = catalogs[s.design];
  const knownWrong = new Map(Object.entries(catalog.en).filter(([k,v]) => v !== catalog.bg[k] && v.length >= 3 && !v.includes('{')).map(([k,v]) => [v.replace(/\s+/g,' ').trim(), k]));
  const hits = strings.filter(({value}) => locale === 'en' ? /[\u0400-\u04ff]/.test(value.replaceAll('Български','')) : knownWrong.has(value) && !['English'].includes(value)).map(x=>({...x,key:knownWrong.get(x.value)}));
  assert.deepEqual(hits, [], `Wrong-language visible catalog copy: ${JSON.stringify(hits.slice(0,20))}`);
  return { visibleStringsChecked: strings.length, typedCatalog: config[s.design].catalog };
}
function localError(s, text) {
  assert(text?.trim(), 'Expected a visible/native validation error');
  if(s.locale === 'bg') assert(/[\u0400-\u04ff]/.test(text), `Bulgarian validation rendered in another language: ${text}`);
  else assert(!/[\u0400-\u04ff]/.test(text), `English validation contains Cyrillic: ${text}`);
  const c=catalogs[s.design];
  const wrong=Object.entries(c.en).find(([k,v])=>s.locale==='bg' && v===text && v!==c.bg[k]);
  assert(!wrong, `English catalog error in BG: ${text}`);
  return text;
}
async function invalid(s, control) {
  const state = await control.evaluate(el => ({ valid:el.reportValidity(), message:el.validationMessage, name:el.name, labels:[...(el.labels||[])].map(l=>l.innerText.trim()), required:el.required }));
  assert.equal(state.valid,false); localError(s,state.message); assert(state.labels.some(Boolean) || await control.getAttribute('aria-label'), 'Invalid field has no label');
  return state;
}
async function alertText(s, within) { const alert = within.locator('[role=alert]:visible').first(); await alert.waitFor(); return localError(s, await alert.innerText()); }
async function noSuccess(s) {
  assert.equal(await s.page.locator('.sell-success:visible,.import-success:visible,[data-slot="import-request-success"]:visible,[data-slot="mobile-financing-success"]:visible,.daynight-form-status--success:visible').count(),0, 'False successful enquiry state');
}
async function notice(s) {
  const text=await s.page.locator('body').innerText();
  // Entry states may use a concise explicit demo label; the HTTP suite independently proves business writes remain blocked.
  const pattern=s.locale==='en' ? /(?:demo|demonstration|concept|illustrative)|(?:no |not )[\s\S]{0,120}(?:sent|verified|offer|stock)/i : /(?:демо|демонстрац|концепция|примерн)|(?:не |няма)[\s\S]{0,120}(?:изпращ|изпрат|потвърден|оферта)/i;
  assert(pattern.test(text), 'Explicit visible demo/unavailable/no-send notice absent');
  await noSuccess(s); return text.match(pattern)?.[0];
}
async function menuOpen(s) {
  const trigger = s.page.locator(config[s.design].menu + ':visible').first();
  await trigger.click(); const panel=s.page.locator(config[s.design].menuPanel); await panel.waitFor({state:'visible'}); return {trigger,panel};
}
async function manualOpen(s) {
  // Header first. The mobile menu is a real source-backed alternative to an obscured footer.
  const header=s.page.locator('header [data-locale-selector]:visible').first();
  let trigger;
  if(await header.count()) trigger=header;
  else if(s.width<992) { const {panel}=await menuOpen(s); trigger=panel.locator('[data-locale-selector]'); }
  else trigger=s.page.locator('[data-locale-selector]:visible').first();
  await trigger.click(); await prefs(s.page).waitFor({state:'visible'});
  return trigger;
}
async function cookieContract(s, expected) {
  const cookies=(await s.context.cookies(base.origin)).filter(c=>c.name.startsWith('cars_'));
  assert.deepEqual(Object.fromEntries(cookies.map(c=>[c.name,c.value])),expected);
  for(const c of cookies) {
    assert.equal(c.path,'/'); assert.equal(c.domain,base.hostname); assert.equal(c.httpOnly,true); assert.equal(c.sameSite,'Lax'); assert.equal(c.secure,base.protocol==='https:');
    const remaining=c.expires-Date.now()/1000; assert(remaining>179*86400 && remaining<=180*86400+5,`Cookie expiry: ${c.name} ${remaining}`);
  }
  return cookies;
}
let browser;
async function scenario(design,locale,width,kind,fn) {
  const name=`${design} ${locale} ${width} ${kind}`; if(only && !name.includes(only)) return;
  const context=await browser.newContext({locale:opposite(locale)==='en'?'en-US':'bg-BG',viewport:{width,height:width>=1000?1000:844},serviceWorkers:'block'});
  const s={name,design,locale,width,context,page:null,network:[],pageErrors:[],hydrationErrors:[],thirdParty:[],safeClicksBlocked:[]};
  const record={name,network:s.network,pageErrors:s.pageErrors,hydrationErrors:s.hydrationErrors,thirdParty:s.thirdParty,safeClicksBlocked:s.safeClicksBlocked}; sessions.push(record);
  try {
    await context.route('**/*',async r=>{
      const req=r.request(), url=new URL(req.url()), method=req.method();
      if(['GET','HEAD','OPTIONS'].includes(method)) return r.continue();
      const allowed=method==='POST' && url.origin===base.origin && url.pathname==='/api/preferences' && !url.search;
      const mapsRead=/google\.[^/]+$|googleapis\.com$/.test(url.hostname) && url.pathname.includes('GetViewportInfo');
      const event={check:activeName,url:url.href,method,category:allowed?'preference':mapsRead?'blocked-third-party-read-rpc':'blocked-business-or-other-write',blocked:!allowed};
      if(allowed) { try { event.body=req.postDataJSON(); } catch { event.body='non-json'; } }
      s.network.push(event); save();
      if(!allowed)return r.abort('blockedbyclient');
      // Capture the preference response BEFORE delivering it: save immediately
      // full-navigates, so CDP can discard response bodies after waitForResponse.
      const response=await r.fetch({maxRedirects:0});
      event.responseStatus=response.status();event.responseHeaders=response.headersArray();
      try {event.response=await response.json();}catch{event.response=null;}
      save();await r.fulfill({response});await response.dispose();
    });
    // Defense in depth against accidental external contact/Admin activation; no such click is planned.
    await context.addInitScript(({origin})=>{
      document.addEventListener('click',event=>{const a=event.composedPath().find(e=>e instanceof HTMLAnchorElement);if(!a)return;const u=new URL(a.href,location.href);if(u.origin!==origin || !['http:','https:'].includes(u.protocol) || /\/(?:api|admin)(?:\/|$)/.test(u.pathname)){event.preventDefault();event.stopImmediatePropagation();console.warn('QA_EXTERNAL_CLICK_BLOCKED '+a.href);}},true);
    },{origin:base.origin});
    s.page=await context.newPage();s.page.setDefaultTimeout(20000);s.page.setDefaultNavigationTimeout(20000);
    s.page.on('response',response=>{if(response.request().isNavigationRequest()&&response.status()>=500&&new URL(response.url()).origin===base.origin)s.environmentBlocked=`Existing preview unavailable: HTTP ${response.status()} at ${response.url()}. No server action taken.`;});
    s.page.on('pageerror',error=>s.pageErrors.push({check:activeName,url:s.page.url(),message:error.message}));
    s.page.on('console',message=>{const text=message.text();if(/hydration|hydrating|Hydration failed|Minified React error/i.test(text))s.hydrationErrors.push({check:activeName,text});if(text.startsWith('QA_EXTERNAL_CLICK_BLOCKED'))s.safeClicksBlocked.push({check:activeName,text});});
    s.page.on('requestfailed',req=>{if(new URL(req.url()).origin!==base.origin)s.thirdParty.push({check:activeName,url:req.url(),error:req.failure()?.errorText});});
    await fn(s);
  } catch(error) {
    if(s.page) await check(s,'scenario continuation',[],async()=>{throw error;});
    else {results.push({name,status:'failed',error:error.message});save();}
  } finally {
    if(s.page) {
      await check(s,'no page/hydration errors',[],async d=>{d.pageErrors=s.pageErrors;d.hydrationErrors=s.hydrationErrors;assert.deepEqual(s.pageErrors,[]);assert.deepEqual(s.hydrationErrors,[]);});
      await check(s,'read-only network boundary',[],async d=>{d.mapsReadRPCs=s.network.filter(x=>x.category==='blocked-third-party-read-rpc');d.otherBlocked=s.network.filter(x=>x.category==='blocked-business-or-other-write');d.thirdParty=s.thirdParty;assert.deepEqual(d.otherBlocked,[],'A non-preference write was attempted and blocked');assert.deepEqual(s.safeClicksBlocked,[],'Unexpected external click was prevented');});
    }
    await context.close();save();
  }
}

async function preferences(s) {
  const p=s.page, dialog=prefs(p), refs=sources.preferences;
  if(!await check(s,'first visit / URL overrides browser / suggestion / enabled choices',refs,async d=>{
    await go(s,config[s.design].preference);await dialog.waitFor({state:'visible'});
    d.country=await dialog.locator('[name=country]').inputValue();
    d.firstOption=await dialog.locator('[name=country] option').first().getAttribute('value');
    // Fresh no-cookie visit: the suggested first country must be the selected default, even with trusted geo headers on a future alias.
    assert.equal(d.firstOption,d.country);
    if(['127.0.0.1','localhost','[::1]'].includes(base.hostname))assert.equal(d.country,'BG','Localhost without geo hints must suggest the neutral dealer country');
    d.locales=await dialog.locator('[name=locale] option:enabled').evaluateAll(es=>es.map(e=>e.value));assert.deepEqual(d.locales,['en','bg']);
    assert.equal(await dialog.locator('[name=locale]').inputValue(),s.locale);d.copy=await copyCheck(s,dialog);
  })) return;
  await check(s,'first dialog fits / controls at least 44px',refs,async d=>{
    d.dialog=await fit(p,dialog);d.controls=[];for(const c of await dialog.locator('button:visible,select:visible').all())d.controls.push(await fit(p,c,true));d.page=await noOverflow(p);
  });
  await check(s,'keyboard Tab and Shift+Tab contained',refs,async d=>{d.trace=await trap(p,dialog);});
  await check(s,'country alone does not select a different language',refs,async d=>{
    await dialog.locator('[name=country]').selectOption('DE');assert.equal(await dialog.locator('[name=locale]').inputValue(),s.locale);d.country='DE';d.locale=s.locale;
  });
  if(s.width===320) {
    await check(s,'Escape safely dismisses without accepting preferences',refs,async d=>{await dismiss(s);d.cookies=await cookieContract(s,{cars_prompt:'v1'});await p.reload({waitUntil:'domcontentloaded'});await ready(p);assert.equal(await dialog.isVisible(),false);});
    return;
  }
  const next=opposite(s.locale);
  const saved=await check(s,'save opposite locale / exact path query hash / server cookie contract',refs,async d=>{
    const before=new URL(p.url());const destination=route(s.design,next,config[s.design].preference);
    await dialog.locator('[name=locale]').selectOption(next);
    const response=p.waitForResponse(r=>r.url()===base.origin+'/api/preferences'&&r.request().method()==='POST');
    await dialog.locator('button[type=submit]').click();const res=await response;
    d.post=res.request().postDataJSON();assert.deepEqual(d.post,{action:'save',locale:next,country:'DE',returnTo:before.pathname+before.search+before.hash});
    assert.equal(res.status(),200);d.response=s.network.filter(x=>x.category==='preference').at(-1)?.response;assert.equal(d.response?.destination,destination);
    await p.waitForURL(base.origin+destination);await ready(p);assert.equal(await dialog.isVisible(),false);assert.equal(await p.locator('html').getAttribute('lang'),next);
    d.cookies=await cookieContract(s,{cars_locale:next,cars_country:'DE',cars_prompt:'v1'});
    d.setCookie=s.network.filter(x=>x.category==='preference').at(-1)?.responseHeaders.filter(h=>h.name.toLowerCase()==='set-cookie').map(h=>h.value);assert.equal(d.setCookie.length,3);assert(d.setCookie.every(x=>/Max-Age=15552000/i.test(x)&&!/;\s*Domain=/i.test(x)));
    d.navigationType=await p.evaluate(()=>performance.getEntriesByType('navigation')[0]?.type);assert.equal(d.navigationType,'navigate','Save must perform full navigation');
  });
  if(!saved)return;
  await check(s,'save mirrors explicit prompt completion without choosing language from storage',refs,async d=>{d.storage=await p.evaluate(()=>localStorage.getItem('cars.prompt.v1'));assert.equal(d.storage,'dismissed','Explicit save completes the prompt; locale still comes from URL/server preference');});
  await check(s,'reload retains preferences / no repeat popup',refs,async d=>{await p.reload({waitUntil:'domcontentloaded'});await ready(p);assert.equal(await dialog.isVisible(),false);assert.equal(await p.locator('html').getAttribute('lang'),next);d.cookies=await cookieContract(s,{cars_locale:next,cars_country:'DE',cars_prompt:'v1'});});
  await check(s,'manual header/menu selector / no overlay stacking',refs,async d=>{
    await manualOpen(s);d.country=await dialog.locator('[name=country]').inputValue();assert.equal(d.country,'DE');assert.equal(await dialog.locator('[name=locale]').inputValue(),next);
    await p.locator(config[s.design].menuPanel).waitFor({state:'hidden'});assert.equal(await p.locator(config[s.design].menuPanel+':visible').count(),0,'Menu remains visible behind preference dialog');d.dialog=await fit(p,dialog);d.copy=await copyCheck(s,dialog,next);
  });
  await check(s,'Escape restores focus to visible selector or menu',refs,async d=>{
    if(!await dialog.isVisible())await manualOpen(s);await dismiss(s);
    d.focus=await p.evaluate(()=>{const el=document.activeElement;const r=el?.getBoundingClientRect();return{html:el?.outerHTML.slice(0,500),visible:!!el?.checkVisibility()&&!!r&&r.width>0&&r.height>0,inViewport:!!r&&r.bottom>0&&r.top<innerHeight,valid:!!el?.matches('[data-locale-selector],[aria-controls="dn-mobile-menu"],[aria-controls="mobile-menu-sheet"],[data-slot="dealer-bottom-nav-menu"]')};});
    assert(d.focus.visible&&d.focus.inViewport&&d.focus.valid,`Bad focus restoration: ${JSON.stringify(d.focus)}`);
  });
  await check(s,'unsaved draft resets on next manual open',refs,async d=>{
    await manualOpen(s);await dialog.locator('[name=country]').selectOption('BG');await dialog.locator('[name=locale]').selectOption(s.locale);await dismiss(s);await manualOpen(s);
    d.country=await dialog.locator('[name=country]').inputValue();d.locale=await dialog.locator('[name=locale]').inputValue();assert.equal(d.country,'DE');assert.equal(d.locale,next);await dismiss(s);
  });
  await check(s,'explicit URL beats opposite saved locale',refs,async d=>{await go(s,config[s.design].preference);assert.equal(await dialog.isVisible(),false);d.copy=await copyCheck(s);d.savedCookie=(await s.context.cookies()).find(c=>c.name==='cars_locale')?.value;assert.equal(d.savedCookie,next);});
  await check(s,'country preference does not change the dealer phone',refs,async d=>{
    const before=await p.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert(before.length>0);
    await manualOpen(s);await dialog.locator('[name=country]').selectOption('DE');await dialog.locator('button[type=submit]').click();await ready(p);await dialog.waitFor({state:'hidden'});
    const after=await p.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.deepEqual(after,before);d.phones=after;
  });
}

async function dismissedSetup(s,suffix) {await go(s,suffix);await dismiss(s);assert.equal(await prefs(s.page).isVisible(),false);}
async function autoJourney(s,kind) {
  const p=s.page,ref=kind==='sell'?sources.autoSell:sources.autoImport;
  if(!await check(s,'entry copy and read-only boundary',ref,async d=>{
    await dismissedSetup(s,`/contact?topic=${kind==='sell'?'trade-in':'import'}`);
    d.copy=await copyCheck(s);
    d.fit=await noOverflow(p);
    await noSuccess(s);
    d.fallback='The owner intentionally removed the global demo banner. Disabled business writes are asserted by the per-scenario network boundary and HTTP suites.';
  })) {
    // Entry-copy failures must not hide subsequent validation coverage.
    if(await prefs(p).isVisible())await dismiss(s);
  }
  await check(s,'entry editor custom invalid URL/VIN error',ref,async d=>{
    await p.locator('.dn-entry-editor-trigger:visible').click();const dialog=p.locator('dialog.dn-entry-editor[open]');await dialog.waitFor();
    await dialog.locator('[name=entry-value]').fill('QA_INVALID_REFERENCE');await dialog.locator('button[type=submit]').click();d.error=await alertText(s,dialog);d.copy=await copyCheck(s,dialog);d.fit=await fit(p,dialog);await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
  });
  if(kind==='sell') {
    await check(s,'blank required vehicle fields / localized native validation',ref,async d=>{
      await p.locator('.dn-tradein-start').click();const dialog=p.locator('dialog.dn-tradein-dialog[open]');await dialog.waitFor();await dialog.locator('.dn-tradein-primary').click();d.invalid=await invalid(s,dialog.locator('[name=make]'));d.copy=await copyCheck(s,dialog);d.fit=await fit(p,dialog);
    });
    await check(s,'invalid year and negative mileage / no send',ref,async d=>{
      const dialog=p.locator('dialog.dn-tradein-dialog[open]');await dialog.locator('[name=make]').fill('QA Demo');await dialog.locator('[name=model]').fill('QA Model');await dialog.locator('[name=year]').fill('0000');await dialog.locator('.dn-tradein-primary').click();d.year=await invalid(s,dialog.locator('[name=year]'));
      await dialog.locator('[name=year]').fill('2020');await dialog.locator('[name=mileage]').fill('-1');await dialog.locator('.dn-tradein-primary').click();d.mileage=await invalid(s,dialog.locator('[name=mileage]'));await noSuccess(s);await p.keyboard.press('Escape');
    });
  } else {
    await check(s,'criteria editor negative configured-currency budget custom error',ref,async d=>{
      await p.locator('.dn-enquiry-import-segments button').nth(1).click();await p.locator('.dn-entry-editor-trigger:visible').click();const dialog=p.locator('dialog.dn-entry-editor[open]');await dialog.locator('[name=entry-value]').fill('QA dummy car criteria');await dialog.locator('[name=entry-budget]').fill('-1');await dialog.locator('button[type=submit]').click();d.error=await alertText(s,dialog);assert(d.error.includes(inventoryCurrency));d.copy=await copyCheck(s,dialog);
      await dialog.locator('[name=entry-budget]').fill('40000');await dialog.locator('button[type=submit]').click();await dialog.waitFor({state:'hidden'});
    });
    await check(s,'available import request sheet / invalid year / Escape',ref,async d=>{
      await p.locator('.dn-enquiry-import-go').click();const dialog=p.locator('dialog.dn-enquiry[open]');await dialog.waitFor();await dialog.locator('[name=year]').fill('0000');await dialog.locator('footer .dn-enquiry-primary').click();d.error=await invalid(s,dialog.locator('[name=year]'));d.copy=await copyCheck(s,dialog);d.fit=await fit(p,dialog);await noSuccess(s);await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
    });
  }
}

async function carJourney(s,kind) {
  const p=s.page,ref=kind==='sell'?sources.carSell:sources.carImport,mobile=s.width<992;
  await check(s,'entry and explicit demo notice',ref,async d=>{await dismissedSetup(s,kind==='sell'?'/sell-your-car':'/contact?intent=import');d.notice=await notice(s);d.copy=await copyCheck(s);d.fit=await noOverflow(p);});
  if(kind==='sell') {
    if(!await check(s,'sell entry opens actual lead form (not locale dialog)',ref,async d=>{
      if(mobile) {await p.locator('.mobile-lead-hero__tabs [role=tab]').nth(1).click();await p.locator('.mobile-lead-hero__manual').click();}
      else {await p.locator('a[href*="/sell-your-car/request"][aria-haspopup=dialog]:visible').first().click();}
      await p.locator(mobile?'.lead-sheet:visible':'.desktop-sell-form:visible').waitFor();assert.equal(await prefs(p).isVisible(),false);d.copy=await copyCheck(s,p.locator(mobile?'.lead-sheet:visible':'.desktop-sell-form:visible'));
    }))return;
    const form=p.locator(mobile?'.lead-sheet:visible':'.desktop-sell-form:visible');
    await check(s,'blank sell form errors / labeled fields',ref,async d=>{
      await form.locator('button[type=submit]').click();
      if(mobile)d.error=await alertText(s,form);else d.error=await invalid(s,form.locator('[name=phone]'));
      d.copy=await copyCheck(s,form);
    });
    await check(s,'invalid sell input custom error / no successful send',ref,async d=>{
      if(mobile) {await form.locator('[name=vin]').fill('QA_BAD_VIN');await form.locator('button[type=submit]').click();d.error=await alertText(s,form);}
      else {await form.locator('[name=phone]').fill('QA_INVALID_PHONE');await form.locator('button[type=submit]').click();d.error=await alertText(s,form);d.fallback='Desktop source validates blank phone only; invalid dummy phone must produce explicit public-demo error, with no network business write.';}
      await noSuccess(s);d.copy=await copyCheck(s,form);
    });
    if(mobile) await check(s,'sell contact step / blank and invalid contact validation',ref,async d=>{
      await form.locator('[name=vin]').fill('');await form.locator('[name=make]').fill('QA Demo');await form.locator('[name=model]').fill('QA Model');await form.locator('button[type=submit]').click();const contact=form.locator('[name=contact]');await contact.waitFor();await form.locator('button[type=submit]').click();d.blank=await alertText(s,form);await contact.fill('QA_INVALID_PHONE');await form.locator('button[type=submit]').click();d.invalid=await alertText(s,form);await noSuccess(s);
    });
    await check(s,'lead sheet keyboard containment and viewport',ref,async d=>{const dialog=p.locator('dialog[open]:not([data-locale-dialog]),[role=dialog]:visible').filter({has:form}).first();d.fit=await fit(p,dialog);d.trace=await trap(p,dialog);});
    await check(s,'lead sheet Escape closes',ref,async()=>{await p.keyboard.press('Escape');await form.waitFor({state:'hidden'});});
    await check(s,'direct sell/request route preserves locale and lead availability',ref,async d=>{
      await go(s,'/sell-your-car/request');assert.equal(await prefs(p).isVisible(),false);
      if(mobile)await p.locator('.lead-sheet:visible').waitFor();else {await p.locator('a[href*="/sell-your-car/request"][aria-haspopup=dialog]:visible').first().click();await p.locator('.desktop-sell-form:visible').waitFor();}
      d.copy=await copyCheck(s);d.leadFormVisible=true;
    });
  } else if(mobile) {
    if(!await check(s,'open import request sheet',ref,async d=>{
      await p.locator('.mobile-lead-hero__filters').click();await p.locator('.lead-sheet:visible').waitFor();assert.equal(await prefs(p).isVisible(),false);d.copy=await copyCheck(s,p.locator('.lead-sheet:visible'));
    }))return;
    const form=p.locator('.lead-sheet:visible');
    await check(s,'blank import custom validation',ref,async d=>{await form.locator('button[type=submit]').click();d.error=await alertText(s,form);});
    await check(s,'invalid URL and negative configured-currency budget custom validation',ref,async d=>{
      await form.locator('[name=sourceUrl]').fill('QA_BAD_URL');await form.locator('button[type=submit]').click();d.url=await alertText(s,form);await form.locator('[name=sourceUrl]').fill('');await form.locator('[name=query]').fill('QA dummy import car');await form.locator('[name=budget]').fill('-1');await form.locator('button[type=submit]').click();d.budget=await alertText(s,form);assert(d.budget.includes(inventoryCurrency));d.copy=await copyCheck(s,form);
    });
    await check(s,'import contact step custom invalid error / no send',ref,async d=>{
      await form.locator('[name=budget]').fill('40000');await form.locator('button[type=submit]').click();await form.locator('[name=contact]').waitFor();await form.locator('[name=contact]').fill('QA_BAD_EMAIL');await form.locator('button[type=submit]').click();d.error=await alertText(s,form);await noSuccess(s);await p.keyboard.press('Escape');await form.waitFor({state:'hidden'});
    });
  } else {
    const form=p.locator('form[data-daynight-import-request="true"]');
    await check(s,'desktop import blank required validation',ref,async d=>{await form.locator('button[type=submit]').click();d.invalid=await invalid(s,form.locator('[name=phone]'));d.copy=await copyCheck(s,form);});
    await check(s,'desktop import invalid email constraint',ref,async d=>{const email=form.locator('[name=email]');await email.fill('QA_BAD_EMAIL');d.invalid=await invalid(s,email);await noSuccess(s);d.fallback='Desktop source has native constraints and no pre-submit custom domain validator; no valid submission is attempted.';});
  }
}

async function finance(s) {
  const p=s.page,auto=s.design==='auto-best',modern=s.design==='modern',refs=auto?sources.autoFinance:modern?sources.modern:sources.carFinance;
  await check(s,'finance entry / explicit demonstration fallback',refs,async d=>{
    await dismissedSetup(s,auto?'/contact?topic=leasing':modern?'/lease':'/financing');
    if(!auto)d.notice=await notice(s);
    d.copy=await copyCheck(s);d.fit=await noOverflow(p);
    if(!modern){assert.equal(await p.locator('main form:visible,main button[type=submit]:visible,.dn-contact-intent input:visible').count(),0);d.fallback=auto?'Leasing contact route is informational and exposes no form, submit control or calculator. The detail calculator and server write block are tested separately.':'Financing is an informational service route; no request form/numeric controls here. Desktop detail calculator is tested separately.';}
  });
  if(modern) {
    await check(s,'finance local supported term/deposit choices',refs,async d=>{
      if(s.width<992){const ctl=p.locator('[data-slot="lease-quick-rail"]');await ctl.waitFor();const trigger=ctl.locator('button[aria-haspopup=dialog]').first();const before=await trigger.innerText();await trigger.click();const picker=p.locator('[data-slot="lease-preference-picker"]');await picker.waitFor();d.copy=await copyCheck(s,picker);await picker.locator('button[aria-pressed=false]').first().click();await picker.waitFor({state:'hidden'});const after=await trigger.innerText();assert.notEqual(before,after);d.before=before;d.after=after;await trigger.click();await picker.locator('button[aria-pressed]').first().click();}
      else {
        const control=p.locator('#finance-deposit');const current=await control.inputValue();
        const before=await p.locator('[data-slot="lease-desktop-controls"]').innerText();
        const options=await control.locator('option').evaluateAll(es=>es.map(e=>e.value));
        const next=options.find(value=>value!==current);assert.notEqual(next,undefined,'No alternative deposit option');
        await control.selectOption(next);
        await p.waitForFunction(({next,before})=>document.querySelector('#finance-deposit')?.value===next&&document.querySelector('[data-slot="lease-desktop-controls"]')?.innerText!==before,{next,before});
        const after=await p.locator('[data-slot="lease-desktop-controls"]').innerText();
        assert.notEqual(before,after);assert.equal(await control.inputValue(),next);
        d.before=before;d.after=after;d.selection={from:current,to:next};await control.selectOption(current);
      }
      d.fallback='Finite select/button options prevent arbitrary negative numeric input; no invented text input or field validation claim.';
    });return;
  }
  if(!auto&&s.width<992){skip(s,'detail calculator numeric validation','Carwow DesktopDetailFinanceCalculator is desktop-only; mobile financing information fallback asserted above.');return;}
  if(!await check(s,'open real detail calculator',refs,async d=>{
    await go(s,auto?'/listing-detail-v1/1':'/inventory/audi-rs-6-avant-demo-1');
    if(auto&&s.width<992){await p.locator('.dn-detail-finance-trigger:visible').click();await p.locator('#dn-detail-finance-dialog[open]').waitFor();}
    else if(auto)await p.locator('.dn-detail-finance-inline').scrollIntoViewIfNeeded();
    else await p.locator('.financing-calculator').scrollIntoViewIfNeeded();
    d.copy=await copyCheck(s,auto?p.locator(s.width<992?'#dn-detail-finance-dialog':'.dn-detail-finance-inline'):p.locator('.financing-calculator'));
  }))return;
  const calcSelector=auto?(s.width<992?'#dn-detail-finance-dialog .dn-finance-calculator':'.dn-detail-finance-inline .dn-finance-calculator'):'.financing-calculator';
  const calc=p.locator(calcSelector);
  const input=calc.locator(auto?'input[type=number]':'[name=deposit]');
  const output=calc.locator(auto?'.dn-finance-calculator__result':'.font-weight-600');
  await check(s,'changing deposit updates configured-currency estimate',refs,async d=>{
    d.before=await output.allTextContents();await input.fill('10000');await p.waitForFunction(({selector,before})=>JSON.stringify([...document.querySelectorAll(selector)].map(e=>e.textContent))!==JSON.stringify(before),{selector:calcSelector+(auto?' .dn-finance-calculator__result':' .font-weight-600'),before:d.before});d.after=await output.allTextContents();assert.notDeepEqual(d.before,d.after);assert(d.after.join(' ').includes(inventoryCurrency));assert(!/\bBGN\b|\bAED\b/.test(d.after.join(' ')));
  });
  await check(s,'negative finance input rejected / localized error / reset',refs,async d=>{
    await input.fill('-1');if(auto)d.error=await invalid(s,input);else d.error=await alertText(s,calc);
    await input.fill('0');if(auto)await calc.locator('select').focus();await p.waitForFunction(selector=>!document.querySelector(selector)?.validationMessage,calcSelector+(auto?' input[type=number]':' [name=deposit]'));
    d.reset=await input.inputValue();assert.equal(d.reset,'0');d.copy=await copyCheck(s,calc);await noSuccess(s);
  });
}

async function menusAndFilter(s) {
  const p=s.page;
  await check(s,'home and public copy',[],async d=>{await dismissedSetup(s,config[s.design].home);d.copy=await copyCheck(s);d.fit=await noOverflow(p);});
  if(s.width<992) {
    await check(s,'mobile menu copy, fit, keyboard, Escape',sources.menus,async d=>{const {panel}=await menuOpen(s);try{d.fit=await fit(p,panel);d.copy=await copyCheck(s,panel);const dialog=p.locator('dialog[open],[role=dialog]:visible').filter({has:p.locator(config[s.design].menuPanel)});d.trace=await trap(p,(await dialog.count())?dialog.first():panel);}finally{await p.keyboard.press('Escape');await panel.waitFor({state:'hidden'});}});
    await check(s,'mobile menu opens preferences without overlay stack',sources.preferences,async d=>{if(await p.locator(config[s.design].menuPanel).isVisible())await p.keyboard.press('Escape');const {panel}=await menuOpen(s);await panel.locator('[data-locale-selector]').click();await prefs(p).waitFor({state:'visible'});await panel.waitFor({state:'hidden'});assert.equal(await panel.isVisible(),false);d.fit=await fit(p,prefs(p));await dismiss(s);});
    await check(s,'menu preference dismissal restores visible selector/menu focus',sources.menus,async d=>{d.focus=await p.evaluate(()=>{const e=document.activeElement,r=e?.getBoundingClientRect();return{html:e?.outerHTML.slice(0,500),visible:e?.checkVisibility(),inside:!!r&&r.width>0&&r.height>0&&r.top>=0&&r.bottom<=innerHeight,valid:!!e?.matches('[data-locale-selector],[aria-controls="dn-mobile-menu"],[aria-controls="mobile-menu-sheet"],[data-slot="dealer-bottom-nav-menu"]')};});assert(d.focus.visible&&d.focus.inside&&d.focus.valid,`Focus did not return to visible selector/menu: ${JSON.stringify(d.focus)}`);});
  }
  await check(s,'one inventory filter dialog / copy / viewport',sources.filters,async d=>{
    if(await prefs(p).isVisible())await dismiss(s);
    await go(s,s.design==='auto-best'?'/listing-grid':s.design==='carwow'?'/inventory':'/cars');
    let trigger;
    if(s.design==='auto-best')trigger=p.locator('[aria-controls="dn-listing-filter-dialog"]:visible').first();
    else if(s.design==='carwow')trigger=p.locator(s.width<992?'.mobile-inventory-quick button:visible':'.inventory-filter-triggers button:visible').first();
    else trigger=p.locator('[data-slot="mobile-discovery-filters"]:visible,[data-slot="desktop-primary-control"]:visible').first();
    await trigger.click();const dialog=p.locator('dialog[open]:not([data-locale-dialog]),[role=dialog]:visible').first();await dialog.waitFor();d.copy=await copyCheck(s,dialog);d.fit=await fit(p,dialog);d.page=await noOverflow(p);
  });
  await check(s,'filter keyboard containment',sources.filters,async d=>{const dialog=p.locator('dialog[open]:not([data-locale-dialog]),[role=dialog]:visible').first();await dialog.waitFor();d.trace=await trap(p,dialog);});
  await check(s,'filter Escape closes and restores visible trigger',sources.filters,async d=>{const dialog=p.locator('dialog[open]:not([data-locale-dialog]),[role=dialog]:visible').first();await dialog.waitFor();await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});d.focus=await p.evaluate(()=>({tag:document.activeElement?.tagName,visible:document.activeElement?.checkVisibility()}));assert.equal(d.focus.tag,'BUTTON');assert.equal(d.focus.visible,true);});
}

async function modernJourney(s,kind) {
  const p=s.page,refs=sources.modern;
  await check(s,'entry and explicit demo notice',refs,async d=>{await dismissedSetup(s,kind==='sell'?'/sell':kind==='import'?'/imports':kind==='listing-contact'?'/listing/demo-audi-1/contact':'/contact');d.notice=await notice(s);d.copy=await copyCheck(s);d.fit=await noOverflow(p);});
  if(kind==='sell')await check(s,'available local sell draft fields / blank and negative validation',refs,async d=>{
    let form=p.locator('[data-slot="sell-vehicle-start-form"]:visible');
    if(s.width<992){await p.locator('[data-slot="mobile-sell-manual-entry"]:visible').click();form=p.locator('[data-slot="mobile-sell-details-form"]');}
    await form.locator('button[type=submit]').click();const year=form.locator('[name=year]');await year.fill('-1');d.invalid=await invalid(s,year);d.copy=await copyCheck(s,form);await year.fill('2020');
  });
  else await check(s,'available form constraints or explicit unavailable fallback',refs,async d=>{
    const unavailable=p.locator('[data-slot="public-contact-unavailable"]:visible');const forms=p.locator('main form:visible');
    d.formCount=await forms.count();
    if(await unavailable.count()){assert.equal(await p.locator('main button[type=submit]:visible').count(),0,'Demo unavailable form exposes submit');d.fallback='PublicContactUnavailable shown; submission controls absent. Visible input constraints only are eligible.';}
    else if(!d.formCount){d.fallback='Source renders contact information and service links, with no enquiry form.';assert(await p.locator('a[href="tel:+971547707080"]').count()>0);}
    const required=p.locator('main input[required]:visible').first();if(await required.count()){await required.fill('');d.required=await invalid(s,required);}
    const email=p.locator('main input[type=email]:visible').first();if(await email.count()){await email.fill('QA_INVALID_EMAIL');d.email=await invalid(s,email);}
    d.copy=await copyCheck(s);await noSuccess(s);
  });
}

async function fab(s) {
  const p=s.page;
  await check(s,'fresh dismissal accepts no locale or country',sources.preferences,async d=>{await go(s,config[s.design].home);await prefs(p).waitFor({state:'visible'});await dismiss(s);d.cookies=await cookieContract(s,{cars_prompt:'v1'});});
  await check(s,'required FAB host identity',sources.fab,async d=>{d.host=await p.evaluate(()=>document.querySelector('dealer-design-switcher')?.shadowRoot?.host.tagName||null);assert.equal(d.host,'DEALER-DESIGN-SWITCHER','Preserve the established native FAB host and shadow root');});
  // Keep host-contract failure above honest; actual native host permits independent link/navigation assertions.
  for(const target of designs.filter(x=>x!==s.design))await check(s,`FAB dismissal persistence → ${target}`,sources.fab,async d=>{
    const host=p.locator('dealer-design-switcher,excellent-design-switcher');await host.locator('button[aria-expanded]').click();assert.equal(await host.locator('button').getAttribute('aria-expanded'),'true');
    const links=host.locator('[data-design-key]');d.links=await links.evaluateAll(es=>es.map(e=>({key:e.dataset.designKey,href:e.getAttribute('href')})));assert.equal(d.links.length,3);
    for(const link of d.links)assert.equal(link.href,route(link.key,s.locale));
    const admin=host.locator('[data-cars-admin]');assert.equal(await admin.count(),1);assert.equal(await admin.getAttribute('target'),'_blank');const adminUrl=new URL(await admin.getAttribute('href'));assert(!adminUrl.searchParams.has('lang')&&!adminUrl.searchParams.has('locale'));assert(/English|английски/i.test((await admin.innerText())+' '+(await admin.getAttribute('aria-label'))));
    await host.locator(`[data-design-key="${target}"]`).click();await p.waitForURL(base.origin+route(target,s.locale));await ready(p);assert.equal(await prefs(p).isVisible(),false);d.cookies=await cookieContract(s,{cars_prompt:'v1'});d.finalUrl=p.url();
  });
  await check(s,'save country and opposite language before FAB chain',sources.preferences,async d=>{
    const actual=designs.filter(x=>x!==s.design).at(-1)||s.design;const shifted={...s,design:actual};await manualOpen(shifted);await prefs(p).locator('[name=country]').selectOption('BG');await prefs(p).locator('[name=locale]').selectOption(opposite(s.locale));await prefs(p).locator('button[type=submit]').click();await p.waitForURL(base.origin+route(actual,opposite(s.locale)));await ready(p);d.cookies=await cookieContract(s,{cars_prompt:'v1',cars_locale:opposite(s.locale),cars_country:'BG'});
  });
  for(const target of designs)await check(s,`FAB saved locale and country → ${target}`,sources.fab,async d=>{
    const host=p.locator('dealer-design-switcher,excellent-design-switcher');await host.locator('button[aria-expanded]').click();const links=await host.locator('[data-design-key]').evaluateAll(es=>es.map(e=>({key:e.dataset.designKey,href:e.getAttribute('href')})));for(const link of links)assert.equal(link.href,route(link.key,opposite(s.locale)));await host.locator(`[data-design-key="${target}"]`).click();await p.waitForURL(base.origin+route(target,opposite(s.locale)));await ready(p);assert.equal(await prefs(p).isVisible(),false);assert.equal(await p.locator('html').getAttribute('lang'),opposite(s.locale));d.cookies=await cookieContract(s,{cars_prompt:'v1',cars_locale:opposite(s.locale),cars_country:'BG'});d.finalUrl=p.url();
  });
}

save();
try {
  browser=await chromium.launch({channel:'chrome',headless:true});
  for(const design of designs)for(const locale of locales)for(const width of widths){
    await scenario(design,locale,width,'preferences',preferences);
    if(width===320 && !fullNarrow)continue;
    for(const kind of ['sell','import'])await scenario(design,locale,width,kind,s=>design==='auto-best'?autoJourney(s,kind):design==='carwow'?carJourney(s,kind):modernJourney(s,kind));
    await scenario(design,locale,width,'finance',finance);
    await scenario(design,locale,width,'menus-filter',menusAndFilter);
    if(design==='modern')for(const kind of ['contact','listing-contact'])await scenario(design,locale,width,kind,s=>modernJourney(s,kind));
  }
  if(process.env.LOCALE_QA_MODE==='mounted')for(const locale of locales)for(const width of widths.filter(x=>x!==320 || fullNarrow))await scenario(designs[0],locale,width,'FAB',fab);
  else for(const locale of locales)for(const width of widths)skip({name:`auto-best ${locale} ${width}`},'three-design FAB','Standalone master intentionally has no cross-application FAB. Mounted trio requires its separate actual deployment test.');
} catch(error){results.push({name:'browser runner',status:'failed',error:error.message});}
finally {if(browser)await browser.close();save();}
const summary=JSON.parse(fs.readFileSync(path.join(out,'RESULTS.json'),'utf8')).summary;
const noteLines=[`# Phase 2 journey run — ${startedAt}`, '', `Base: ${base.origin}`, `Output: ${rel(out)}`, `Selected: ${designs.join(', ')}; locales ${locales.join(', ')}; widths ${widths.join(', ')}`, '', `Checks: ${summary.passed} passed, ${summary.failed} failed, ${summary.blocked} environment-blocked, ${summary.skipped} explicitly skipped.`, '', 'Failures below retain their original assertions. Inspect screenshot and source before classifying a timeout as an application bug. Maps POST read RPCs and other third-party failures are recorded separately in RESULTS.json.', '', ...omissions.map(x=>'- '+x), '', ...results.filter(r=>r.status==='failed'||r.status==='blocked').flatMap(r=>[`## ${r.name} (${r.status})`, '', `URL: ${r.url||'n/a'}`, `Error: ${r.error}`, `Screenshot: ${r.screenshot||'not captured'}`, ...((r.sources||[]).map(x=>`Source: ${x.file}:${x.line}\n\n\`\`\`\n${x.excerpt}\n\`\`\``)), '']), '', '## Explicit skips', ...results.filter(r=>r.status==='skipped').map(r=>`- ${r.name}: ${r.reason}`)];
fs.writeFileSync(path.join(out,'NOTES.md'),noteLines.join('\n'));
console.log(JSON.stringify({out:rel(out),...summary}));
if(summary.failed||summary.blocked)process.exitCode=1;
