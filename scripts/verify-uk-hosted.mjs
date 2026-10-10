import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const TOOLING = Object.freeze({
  commit: '2afd974c23d4f4cfb290ed99a00f46074793be3a',
  node: '22.23.2',
  playwright: '1.62.1',
  packageSha256: '5225f62da4a676df3129ca35cd5277cb0ff46a829473c2fd1314d3f124eba233',
  lockSha256: 'de0dafd0d699f3872c1a462936e369dd3304d088654ee26f2f8b2d63f74e5fb2',
});
export const DEALERS = Object.freeze([
  'batley-as-motor-group', 'birmingham-square-one-motors',
  'birmingham-trade-car-sales-grasmere', 'bradford-cherry-tree-cars',
  'dewsbury-car-market-yorkshire', 'motherwell-motors-castle',
  'north-norfolk-car-sales', 'nottingham-s-a-motors',
  'stockport-broadbent-car-and-servicing', 'stockton-norton-grange-trade-cars',
]);
export const JOURNEYS = Object.freeze({
  'auto-best': {base: '', inventory: '/cars', contact: '/contact', queryKey: 'q', detail: /^\/listing-detail-v1\/([^/]+)\/?$/},
  modern: {base: '/variant-2', inventory: '/cars', contact: '/contact', queryKey: 'q', detail: /^\/(?:en\/)?listing\/([^/]+)\/?$/},
  import: {base: '/variant-3', inventory: '/inventory', contact: '/contact', queryKey: 'keyword', detail: /^\/(?:en\/)?inventory\/([^/]+)\/?$/},
  app: {base: '/variant-4', inventory: '/en/cars', contact: '/en/stores', queryKey: 'q', detail: /^\/en\/cars\/([^/]+)\/?$/},
  mobile: {base: '/variant-5', inventory: '/', contact: '/contact', queryKey: 'query', detail: /^\/vehicle\/([^/]+)\/?$/},
  'karento-best': {base: '/variant-6', inventory: '/vehicles', contact: '/contact', queryKey: 'q', detail: /^\/vehicle\/?$/},
});
const SHA = /^[a-f0-9]{40}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalized = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('en-GB').replace(/\s+/g, ' ').trim();
export function phoneDigits(value) {
  const digits=String(value ?? '').replace(/^tel:/i, '').replace(/\D/g, '').replace(/^00/, '');
  return /^0\d{10}$/.test(digits) ? '44' + digits.slice(1) : digits;
}
const git = args => execFileSync('git', ['-C', ROOT, ...args], {maxBuffer: 8 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe']});
const gitFile = (commit, file) => git(['show', commit + ':' + file]);

export function validateIdentity({dealer, sourceCommit, publishedCommit, packageDigest}, manifest) {
  assert(DEALERS.includes(dealer), 'Unknown UK dealer.');
  assert(SHA.test(sourceCommit) && SHA.test(publishedCommit) && SHA256.test(packageDigest), 'Exact source/private commit and package digest are required.');
  assert(manifest.slug === dealer && manifest.repository === 'darkapoparka/cars-uk-' + dealer, 'Dealer repository does not match the selected UK project.');
  assert(manifest.defaultBranch === 'main', 'The dealer must use main.');
  const keys = Object.keys(JOURNEYS);
  assert(Array.isArray(manifest.variants) && manifest.variants.length === keys.length, 'All six variants are required.');
  for (const [index, key] of keys.entries()) {
    const variant = manifest.variants[index];
    assert(variant.key === key && variant.base === JOURNEYS[key].base, 'Variant order or mount differs: ' + key);
    assert(typeof variant.entry === 'string' && withinFamily(variant.entry, key), 'Invalid variant entry: ' + key);
  }
  const origin = 'https://cars-uk-' + dealer + '.darkapoparka1.workers.dev';
  assert(manifest.cloudflare?.workerPrefix === 'cars-uk-' + dealer && manifest.shareIdentity?.publicOrigin === origin, 'Unexpected Cloudflare origin.');
  assert(manifest.localization?.defaultLocale === 'en' && manifest.localization?.inventoryCurrency === 'GBP', 'UK browser contract requires English and GBP.');
  return {dealer, sourceCommit, publishedCommit, packageDigest, repository: manifest.repository, origin};
}

export function withinFamily(href, key, origin = 'https://qa.invalid') {
  try {
    const u = new URL(href, origin);
    if (u.origin !== origin || u.username || u.password) return false;
    const base = JOURNEYS[key]?.base;
    if (base === undefined) return false;
    return base ? u.pathname === base || u.pathname.startsWith(base + '/') : !/^\/variant-[2-6](?:\/|$)/.test(u.pathname);
  } catch { return false; }
}

export function listingIdentity(href, key, origin, records) {
  if (!withinFamily(href, key, origin)) return null;
  const u = new URL(href, origin);
  const local = u.pathname.slice(JOURNEYS[key].base.length) || '/';
  const match = local.match(JOURNEYS[key].detail);
  if (!match) return null;
  const token = key === 'karento-best' ? u.searchParams.get('id') : decodeURIComponent(match[1]);
  let record;
  if (key === 'auto-best' && /^[1-9]\d*$/.test(token ?? '')) record = records[Number(token) - 1];
  else record = records.find(row => row.id === token || row.slug === token);
  return {href: u.pathname + u.search, token, id: record?.id ?? null, make: record?.make ?? null, model: record?.model ?? null};
}

export function chooseFilter(records, baseline) {
  const shown = new Set(baseline.map(row => row.id));
  const makes = [...new Set(records.filter(row => shown.has(row.id)).map(row => row.make))];
  const choices = makes.map(query => ({
    query, ids: records.filter(row => shown.has(row.id) && normalized(row.make) === normalized(query)).map(row => row.id),
  })).filter(choice => choice.ids.length > 0 && choice.ids.length < shown.size);
  choices.sort((a, b) => b.ids.length - a.ids.length || a.query.localeCompare(b.query));
  assert(choices.length, 'The visible inventory needs at least two makes to prove that a keyword filter narrows results.');
  return choices[0];
}

export function checkFiltered(rows, baseline, choice) {
  const ids = [...new Set(rows.map(row => row.id))].sort();
  const expected = [...new Set(choice.ids)].sort();
  assert(rows.length && rows.every(row => row.id), 'Filtered inventory contains no known vehicle or an unknown source identity.');
  assert(JSON.stringify(ids) === JSON.stringify(expected), 'Rendered filtered vehicles differ from the known inventory subset.');
  assert(ids.length < new Set(baseline.map(row => row.id)).size, 'Filter did not narrow visible inventory.');
  return ids;
}

export function shouldBlockRequest({method, url, mainDocument}, origin) {
  if (!['GET', 'HEAD'].includes(method)) return 'non-read HTTP method';
  if (mainDocument && new URL(url).origin !== origin) return 'external top-level navigation';
  return null;
}

export function diagnosticFailures(metrics) {
  const failures = [];
  if (metrics.bodyLength < 100) failures.push('Nearly empty rendered page');
  if (metrics.overflow > 1) failures.push('Horizontal overflow');
  if (metrics.broken.length) failures.push('Broken or unloaded rendered image');
  if (metrics.staleIdentity.length) failures.push('Inherited dealer identity');
  if (metrics.errorUi) failures.push('Rendered application error');
  if (metrics.lang && !metrics.lang.toLowerCase().startsWith('en')) failures.push('Unexpected default page language');
  return failures;
}

export function stockRecords(stock) {
  assert(stock.kind === 'dated-listing-snapshot' && Array.isArray(stock.records) && stock.records.length > 1, 'A dated source stock snapshot is required.');
  const records = stock.records.map((record, index) => {
    assert(record.id && record.slug && record.make && record.model && record.currency === 'GBP' && Number.isFinite(record.price), 'Incomplete source vehicle at index ' + index);
    return {id: String(record.id), slug: String(record.slug), make: String(record.make), model: String(record.model), year: record.year, price: record.price};
  });
  assert(new Set(records.map(row => row.id)).size === records.length, 'Duplicate source vehicle ID.');
  return records;
}

function ciIdentity(env = process.env) {
  assert(env.GITHUB_REPOSITORY === 'darkapoparka/cars' && env.GITHUB_EVENT_NAME === 'workflow_dispatch' && env.GITHUB_REF === 'refs/heads/main', 'Hosted QA runs only as a manual Cars/main workflow.');
  assert(SHA.test(env.GITHUB_SHA ?? '') && /^\d+$/.test(env.GITHUB_RUN_ID ?? '') && /^\d+$/.test(env.GITHUB_RUN_ATTEMPT ?? ''), 'Missing exact workflow identity.');
  assert(process.platform === 'linux', 'Install and browser work belong on the ephemeral Linux runner.');
  return {repository: env.GITHUB_REPOSITORY, commit: env.GITHUB_SHA, runId: env.GITHUB_RUN_ID, attempt: env.GITHUB_RUN_ATTEMPT};
}

function outputRoot(dealer, ci) {
  return path.join(ROOT, 'runtime', 'uk-hosted-qa', ci.runId + '-' + ci.attempt, dealer);
}

function verifyToolingFiles(directory) {
  assert(hash(fs.readFileSync(path.join(directory, 'package.json'))) === TOOLING.packageSha256, 'Approved browser tooling package changed.');
  assert(hash(fs.readFileSync(path.join(directory, 'package-lock.json'))) === TOOLING.lockSha256, 'Approved browser tooling lock changed.');
}

export function prepare({dealer, sourceCommit, publishedCommit, packageDigest}) {
  const ci = ciIdentity();
  assert(DEALERS.includes(dealer) && SHA.test(sourceCommit), 'Invalid source selector.');
  const prefix = 'clients/' + dealer + '/';
  const sourceFiles = {};
  const read = file => {
    const bytes = gitFile(sourceCommit, prefix + file);
    sourceFiles[file] = {sha256: hash(bytes), bytes: bytes.length};
    return JSON.parse(bytes);
  };
  const manifest = read('dealer.json'), stock = read('stock.json'), facts = read('business-facts.json');
  const identity = validateIdentity({dealer, sourceCommit, publishedCommit, packageDigest}, manifest);
  assert(facts.slug === dealer && facts.currency === 'GBP' && facts.countryCode === 'GB', 'Facts belong to another dealer or market.');
  const records = stockRecords(stock);
  const root = outputRoot(dealer, ci), tooling = path.join(root, 'tooling'), output = path.join(root, 'evidence');
  fs.mkdirSync(tooling, {recursive: true}); fs.mkdirSync(output, {recursive: true});
  for (const file of ['package.json', 'package-lock.json']) fs.writeFileSync(path.join(tooling, file), gitFile(TOOLING.commit, 'templates/auto-best/' + file));
  verifyToolingFiles(tooling);
  const plan = {
    schemaVersion: 1, ...identity, ci, sourceFiles, variants: manifest.variants,
    tooling: TOOLING, sourceObservedAt: stock.observedAt, records,
    facts: {name: facts.name, phone: facts.phone, email: facts.email, previewNotice: facts.previewNotice, inventoryNotice: facts.inventoryNotice},
    forbiddenIdentity: manifest.qa?.forbiddenIdentity ?? [],
    deploymentIdentityVerification: 'Expected commits and digest are supplied by the operator. This secret-free browser job does not authenticate Cloudflare versions or private repository heads.',
    ownerVisualReview: 'pending',
  };
  writeJson(path.join(root, 'plan.json'), plan);
  writeJson(path.join(output, 'plan.json'), plan);
  if (process.env.GITHUB_ENV) fs.appendFileSync(process.env.GITHUB_ENV, 'UK_QA_ROOT=' + root + '\n');
  return plan;
}

async function until(check, message, timeout = 15000) {
  const end = Date.now() + timeout;
  while (Date.now() < end) { if (await check()) return; await new Promise(resolve => setTimeout(resolve, 150)); }
  throw new Error(message);
}
const visible = locator => locator.filter({visible: true});
async function oneVisible(locator, label) {
  const found = visible(locator);
  await found.first().waitFor({state: 'visible', timeout: 15000});
  assert(await found.count() === 1, 'Ambiguous visible control: ' + label);
  return found.first();
}
async function settle(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 5000))]);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function inventoryRows(page, key, plan) {
  const candidates = await page.locator('main a[href], #showroom-results a[href], .dn-listing-results a[href], .mobile-catalog-results a[href], .content-right a[href]').evaluateAll(links =>
    links.filter(a => a.getClientRects().length && getComputedStyle(a).visibility !== 'hidden').map(a => ({href: a.href, text: (a.innerText || a.getAttribute('aria-label') || '').trim().slice(0,500)})));
  const result = candidates.map(row => { const identity = listingIdentity(row.href, key, plan.origin, plan.records); return identity && {...identity, text: row.text}; }).filter(Boolean);
  const unique = [...new Map(result.map(row => [row.href, row])).values()];
  assert(unique.length, 'No visible native vehicle detail links.');
  assert(unique.every(row => row.id), 'Inventory includes a detail URL absent from the exact stock snapshot.');
  return unique;
}

async function keywordFilter(page, key, width, query, capture) {
  let input, panel, submit, direct = false;
  if (key === 'auto-best') {
    const selector = width < 768 ? '.dn-listing-filter__mobile-keyword' : '.dn-discovery__keyword';
    await (await oneVisible(page.locator(selector), 'Auto Best keyword trigger')).click();
    panel = await oneVisible(page.locator('#dn-listing-filter-dialog'), 'Auto Best filter dialog');
    input = await oneVisible(panel.locator('input[name="q"]'), 'Auto Best keyword');
    submit = await oneVisible(panel.locator('.dn-listing-filter__dialog-submit'), 'Auto Best apply');
  } else if (key === 'modern') {
    await (await oneVisible(page.locator(width < 768 ? '[data-slot="mobile-discovery-search"]' : '[data-slot="dealer-inventory-search-open"]'), 'Modern search trigger')).click();
    panel = await oneVisible(page.locator(width < 768 ? '[data-slot="mobile-inventory-search"]' : '[data-slot="desktop-focused-filter-dialog"]'), 'Modern search dialog');
    input = await oneVisible(panel.getByRole('searchbox'), 'Modern keyword');
    if (width < 768) direct = true;
    else submit = await oneVisible(panel.getByRole('button', {name: 'Show results', exact: true}), 'Modern show results');
  } else if (key === 'import') {
    if (width < 768) {
      await (await oneVisible(page.locator('.daynight-inventory-mobile__search-field'), 'Import search trigger')).click();
      panel = await oneVisible(page.locator('#daynight-inventory-mobile-search-drawer'), 'Import search drawer');
      input = await oneVisible(panel.locator('input[name="keyword"]'), 'Import keyword');
      submit = await oneVisible(panel.locator('button[type="submit"]'), 'Import show results');
    } else {
      panel = await oneVisible(page.locator('form.inventory-search'), 'Import desktop search');
      input = await oneVisible(panel.getByRole('searchbox'), 'Import keyword');
      direct = true;
    }
  } else if (key === 'app') {
    await (await oneVisible(page.locator('[data-search-field] button[aria-labelledby="inventory-search-prompt"]'), 'App search trigger')).click();
    panel = await oneVisible(page.locator('[data-showroom-search-sheet]'), 'App search sheet');
    input = await oneVisible(panel.locator('[data-search-input]'), 'App keyword');
    submit = await oneVisible(panel.locator('button[type="submit"]'), 'App apply search');
  } else if (key === 'mobile') {
    await (await oneVisible(page.getByRole('button', {name: 'Search make or model', exact: true}), 'Mobile search trigger')).click();
    panel = await oneVisible(page.getByRole('dialog'), 'Mobile search dialog');
    input = await oneVisible(panel.locator('[data-showroom-search-input]'), 'Mobile keyword');
    submit = await oneVisible(panel.getByRole('button', {name: /^Show \d+ (?:car|cars|van|vans|vehicle|vehicles)$/i}), 'Mobile show results');
  } else {
    await (await oneVisible(page.locator(width < 768 ? '.mobile-filter-trigger' : '.catalog-open-filters'), 'Signature filters')).click();
    panel = await oneVisible(page.getByRole('dialog'), 'Signature filter dialog');
    input = await oneVisible(panel.getByRole('searchbox'), 'Signature keyword');
    submit = await oneVisible(panel.locator(width < 768 ? '.mobile-filter-apply' : 'button[type="submit"]'), 'Signature apply');
  }
  await input.fill(query);
  await capture('filter-editor', false);
  if (direct) await input.press('Enter'); else await submit.click();
  await until(() => new URL(page.url()).searchParams.get(JOURNEYS[key].queryKey) === query, 'Filter query did not reach the native URL.');
  await settle(page);
}

async function metrics(page, forbiddenIdentity, dealerName) {
  return page.evaluate(({terms,dealerName}) => {
    const body = document.body.innerText, rectVisible = e => !!e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
    const shownImages = [...document.images].filter(rectVisible);
    const normalize = value => value.toLowerCase().replace(/\s+/g,' ').trim();
    return {
      title: document.title, lang: document.documentElement.lang, bodyLength: body.trim().length,
      dealerIdentity: {title:normalize(document.title).includes(normalize(dealerName)), text:normalize(body).includes(normalize(dealerName)), imageAlt:shownImages.some(i=>normalize(i.alt).includes(normalize(dealerName)))},
      overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
      broken: shownImages.filter(i => { const r=i.getBoundingClientRect(); const inView=r.bottom>0 && r.top<innerHeight && r.right>0 && r.left<innerWidth; return (i.complete && !i.naturalWidth) || (!i.complete && (i.loading !== 'lazy' || inView)); }).map(i => ({src:i.currentSrc || i.src, alt:i.alt})),
      images: shownImages.map(i => ({src:i.currentSrc || i.src, alt:i.alt, loaded:i.complete && i.naturalWidth > 0, width:i.getBoundingClientRect().width, height:i.getBoundingClientRect().height})),
      phones: [...new Set([...document.querySelectorAll('a[href^="tel:"]')].filter(rectVisible).map(a=>a.getAttribute('href')))],
      emails: [...new Set([...document.querySelectorAll('a[href^="mailto:"]')].filter(rectVisible).map(a=>a.getAttribute('href')))],
      staleIdentity: terms.filter(term=>normalize(body).includes(normalize(term))),
      errorUi: /Application error: a (?:client|server)-side exception|Internal Server Error|Error 1102|Worker exceeded resource limits/i.test(body),
      demoDisclosure: /(?:forms? do(?:es)? not send|does not send|won.t send|not (?:sent|send)|nothing (?:has been|was) sent|demo.{0,70}(?:message|enquir|reserv|form)|preview.{0,100}(?:message|enquir|reserv|form))/i.test(body),
      illustrationDisclosure: /(?:generated illustration|not.{0,35}(?:advertised vehicle|vehicle photograph)|illustration.{0,35}(?:not|example))/i.test(body),
      forms: [...document.forms].filter(rectVisible).map(f=>({method:f.method, action:f.action, fields:[...f.elements].filter(e=>e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement).map(e=>({name:e.name,type:e.type,required:e.required,valid:e.validity.valid})), submitted:false})),
    };
  }, {terms:forbiddenIdentity,dealerName});
}

async function switcher(page, variant, index, plan, width, height, record, capture) {
  const host = page.locator('dealer-design-switcher');
  const button = await oneVisible(host.locator('.fab'), 'six-design selector');
  assert(await button.getAttribute('aria-label') === 'Design ' + (index + 1) + ' / 6', 'Wrong active design label.');
  await button.click();
  const panel = await oneVisible(host.locator('.sheet'), 'design selector panel');
  const choices = await panel.locator('a.design').evaluateAll(a=>a.map(x=>({key:x.dataset.designKey,href:x.getAttribute('href')})));
  assert(JSON.stringify(choices) === JSON.stringify(plan.variants.map(v=>({key:v.key,href:v.entry}))), 'Design choices differ from the six-design manifest.');
  record.designChoices = choices;
  record.homeAlternatives = await panel.locator('a.home-choice').evaluateAll((links, key)=>links.filter(a=>a.dataset.designKey===key).map(a=>({label:a.innerText.trim(),href:a.getAttribute('href')})), variant.key);
  assert(record.homeAlternatives.length <= 3 && record.homeAlternatives.every(row=>withinFamily(row.href,variant.key,plan.origin)), 'Unexpected homepage alternative.');
  await capture('design-selector', false);
  await page.keyboard.press('Escape');
  await until(async()=>await button.getAttribute('aria-expanded')==='false','Design selector did not dismiss.');
  assert(await button.evaluate(e=>e.getRootNode().activeElement===e), 'Design selector did not restore focus.');
  await button.click();
  const next = plan.variants[(index+1)%6];
  await panel.locator('a.design[data-design-key="' + next.key + '"]').click();
  await until(()=>Promise.resolve(withinFamily(page.url(),next.key,plan.origin)), 'Design choice did not navigate to its own mount.', 30000);
  await until(async()=>await host.locator('.fab').getAttribute('aria-label') === 'Design ' + ((index+1)%6+1) + ' / 6', 'Design switch did not update the active identity.',30000);
  record.switchNavigation = {key:next.key,url:page.url()};
  await page.goto(new URL(variant.entry,plan.origin).href,{waitUntil:'domcontentloaded',timeout:45000});
  if (width === 390) {
    await page.setViewportSize({width:320,height:760});
    await host.locator('.fab').click();
    const rect = await host.locator('.sheet').boundingBox();
    assert(rect && rect.x>=-1 && rect.y>=-1 && rect.x+rect.width<=321 && rect.y+rect.height<=761,'320px design selector clips outside the viewport.');
    await capture('design-selector-320',false);
    await page.keyboard.press('Escape');
    await page.setViewportSize({width,height});
  }
  record.switcherPassed = true;
}

export async function verifyHosted(plan, chromium, output) {
  fs.mkdirSync(output,{recursive:true});
  const evidence = {
    schemaVersion:1, dealer:plan.dealer, origin:plan.origin, ci:plan.ci,
    sourceCommit:plan.sourceCommit, publishedCommit:plan.publishedCommit, packageDigest:plan.packageDigest,
    sourceFiles:plan.sourceFiles, sourceObservedAt:plan.sourceObservedAt, tooling:{...TOOLING,actualNode:process.versions.node},
    startedAt:new Date().toISOString(), access:'anonymous public origin',
    deploymentIdentityVerified:false, deploymentIdentityVerification:plan.deploymentIdentityVerification,
    formScope:'Inspect actual destinations, disclosure and field validity. No enquiry form is submitted; non-GET/HEAD HTTP is blocked.',
    visualReview:'pending human inspection of the captured rendered pages', results:[],
  };
  const save=()=>writeJson(path.join(output,'results.json'),evidence);
  const browser=await chromium.launch({headless:true});
  evidence.tooling.chromium=browser.version(); save();
  try {
    for (const {width,height} of [{width:390,height:844},{width:1440,height:900}]) for (const [index,variant] of plan.variants.entries()) {
      const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:width===390,hasTouch:width===390,locale:'en-GB',timezoneId:'Europe/London',colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
      const page=await context.newPage(); page.setDefaultTimeout(15000);
      const record={key:variant.key,width,height,emulation:width===390?'Chromium phone viewport emulation':'Chromium desktop viewport',routes:[],screenshots:[],pageErrors:[],consoleErrors:[],networkErrors:[],blockedRequests:[],failures:[]};
      evidence.results.push(record);
      page.on('pageerror',error=>record.pageErrors.push(error.message));
      page.on('console',message=>{if(message.type()==='error')record.consoleErrors.push(message.text());});
      page.on('response',response=>{if(response.status()>=400)record.networkErrors.push({url:response.url(),status:response.status(),type:response.request().resourceType()});});
      await context.route('**/*', async route=>{
        const request=route.request();
        const reason=shouldBlockRequest({method:request.method(),url:request.url(),mainDocument:request.isNavigationRequest() && request.frame()===page.mainFrame()},plan.origin);
        if(reason){record.blockedRequests.push({method:request.method(),url:request.url(),reason});await route.abort('blockedbyclient');}
        else await route.continue();
      });
      const capture=async(label,fullPage=false)=>{
        const filename=variant.key+'-'+width+'-'+label+'.png';
        const documentHeight=await page.evaluate(()=>document.documentElement.scrollHeight);
        await page.screenshot({path:path.join(output,filename),fullPage:fullPage && documentHeight<=12000,timeout:20000,animations:'disabled'});
        record.screenshots.push({file:filename,url:page.url(),viewport:page.viewportSize(),fullPage:fullPage && documentHeight<=12000,documentHeight});
      };
      const inspect=async(label,href=null)=>{
        const response=href ? await page.goto(new URL(href,plan.origin).href,{waitUntil:'domcontentloaded',timeout:45000}) : null;
        await settle(page);
        assert(withinFamily(page.url(),variant.key,plan.origin),'Navigation escaped its design mount: '+page.url());
        if(href) assert(response?.ok(),'HTTP route failed: '+label+' ('+response?.status()+')');
        await page.waitForFunction(()=>[...document.images].filter(i=>i.getClientRects().length&&i.loading!=='lazy').every(i=>i.complete),null,{timeout:10000}).catch(()=>{});
        if(label==='home'||label==='contact') {
          const height=await page.evaluate(()=>document.documentElement.scrollHeight);
          if(height<=12000) {
            const step=Math.max(400,(page.viewportSize()?.height??844)-150);
            for(let y=0;y<height;y+=step) {await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(100);}
            await page.evaluate(()=>window.scrollTo(0,0));await settle(page);
          }
        }
        const measured=await metrics(page,plan.forbiddenIdentity,plan.facts.name);
        record.routes.push({label,url:page.url(),status:response?.status()??null,navigation:href?'document':'browser interaction',...measured});
        await capture(label,label==='home'||label==='contact');
        record.failures.push(...diagnosticFailures(measured).map(f=>label+': '+f)); save();
        return measured;
      };
      const step=async(label,fn)=>{try{return await fn();}catch(error){record.failures.push(label+': '+error.message);await capture(label+'-failure').catch(()=>{});save();return null;}};
      try {
        await step('home',async()=>{
          const m=await inspect('home',variant.entry);
          assert(m.images.some(i=>i.loaded),'Home has no successfully loaded visible imagery.');
          assert(Object.values(m.dealerIdentity).some(Boolean),'Home has no positive dealer identity in rendered text, title or image alt.');
          await switcher(page,variant,index,plan,width,height,record,capture);
          for(const [i,alternative]of(record.homeAlternatives??[]).entries()) if(alternative.href!==variant.entry) await inspect('home-alternative-'+(i+1),alternative.href);
        });
        await step('inventory-filter-detail',async()=>{
          await inspect('inventory',variant.base+JOURNEYS[variant.key].inventory);
          const baseline=await inventoryRows(page,variant.key,plan);
          record.inventory={baseline};
          const choice=chooseFilter(plan.records,baseline);
          await keywordFilter(page,variant.key,width,choice.query,capture);
          await until(async()=>{try{return checkFiltered(await inventoryRows(page,variant.key,plan),baseline,choice).length>0;}catch{return false;}},'Filtered results did not match the known source subset.');
          const filtered=await inventoryRows(page,variant.key,plan);
          const ids=checkFiltered(filtered,baseline,choice);
          record.inventory.filter={query:choice.query,queryKey:JOURNEYS[variant.key].queryKey,ids,url:page.url()};
          await inspect('filtered-inventory');
          await page.reload({waitUntil:'domcontentloaded',timeout:45000}); await settle(page);
          assert(JSON.stringify(checkFiltered(await inventoryRows(page,variant.key,plan),baseline,choice))===JSON.stringify(ids),'Reload changed the filtered results.');
          record.inventory.reloadPreserved=true;
          const chosen=filtered[0], links=page.locator('a[href]').filter({visible:true});
          const exact=await links.evaluateAll((anchors,href)=>anchors.findIndex(a=>new URL(a.href).pathname+new URL(a.href).search===href),chosen.href);
          assert(exact>=0,'Selected detail anchor disappeared.');
          await links.nth(exact).click();
          await until(()=>Promise.resolve(listingIdentity(page.url(),variant.key,plan.origin,plan.records)?.id===chosen.id),'Vehicle card did not open its exact detail.',30000);
          const detail=await inspect('detail');
          const body=normalized(await page.locator('body').innerText());
          assert(body.includes(normalized(chosen.make))&&body.includes(normalized(chosen.model)),'Detail content does not identify the selected source vehicle.');
          assert(detail.images.some(i=>i.loaded),'Detail has no successfully loaded visible imagery.');
          assert(record.routes.filter(r=>['inventory','filtered-inventory','detail'].includes(r.label)).some(r=>r.illustrationDisclosure),'Inventory/detail does not visibly disclose generated vehicle illustrations.');
          record.detail={id:chosen.id,url:page.url(),phones:detail.phones,emails:detail.emails,forms:detail.forms};
          const requestLinks=await page.locator('a[href]').evaluateAll(anchors=>anchors.filter(a=>a.getClientRects().length).map(a=>({href:a.getAttribute('href'),text:a.innerText.trim()})).filter(a=>/\/(?:contact|message|request)(?:\/|[?#]|$)/.test(a.href??'')));
          record.detail.enquiryLinks=requestLinks;
          await page.goBack({waitUntil:'domcontentloaded',timeout:45000}); await settle(page);
          checkFiltered(await inventoryRows(page,variant.key,plan),baseline,choice);
          record.inventory.backPreserved=true;
        });
        await step('contact',async()=>{
          const contact=await inspect('contact',variant.base+JOURNEYS[variant.key].contact);
          const destinations=[...contact.phones,...(record.detail?.phones??[])];
          if(plan.facts.phone) assert(destinations.some(href=>phoneDigits(href)===phoneDigits(plan.facts.phone)),'No contact destination matches the source business phone.');
          assert(destinations.every(href=>phoneDigits(href)===phoneDigits(plan.facts.phone)),'Contact exposes a phone different from the exact business facts.');
          for(const href of [...contact.emails,...(record.detail?.emails??[])]) assert(decodeURIComponent(href.slice(7).split('?')[0]).toLowerCase()===String(plan.facts.email??'').toLowerCase(),'Contact exposes an inherited email.');
          const hasForm=contact.forms.some(f=>f.fields.some(field=>field.type==='email'||field.type==='textarea')) || record.detail?.forms.some(f=>f.fields.some(field=>field.type==='email'||field.type==='textarea'));
          if(hasForm) assert(contact.demoDisclosure || record.routes.find(r=>r.label==='detail')?.demoDisclosure,'Visible enquiry form lacks a clear demo disclosure.');
          record.contact={matchedPhone:!!destinations.length,demoFormPresent:!!hasForm,formSubmission:'not performed',disclosure:contact.demoDisclosure};
        });
      } finally {
        if(record.pageErrors.length)record.failures.push('Uncaught page errors');
        if(record.consoleErrors.length)record.failures.push('Browser console errors require review');
        const ownErrors=record.networkErrors.filter(e=>new URL(e.url).origin===plan.origin && ['document','script','stylesheet','image','font','fetch','xhr'].includes(e.type));
        if(ownErrors.length)record.failures.push('Same-origin HTTP resource errors');
        record.passed=record.failures.length===0 && record.switcherPassed===true && record.inventory?.reloadPreserved===true && record.inventory?.backPreserved===true && !!record.contact;
        await context.close(); save();
        console.log(JSON.stringify({key:record.key,width,passed:record.passed,failures:record.failures}));
      }
    }
  } finally {
    await browser.close();
    evidence.finishedAt=new Date().toISOString();
    evidence.automatedPassed=evidence.results.length===12 && evidence.results.every(record=>record.passed);
    evidence.consoleReviewRequired=evidence.results.some(record=>record.consoleErrors.length);
    evidence.visualReview='pending human inspection; automated result does not approve visual design';
    evidence.artifacts=fs.readdirSync(output).filter(file=>file.endsWith('.png')).map(file=>{const b=fs.readFileSync(path.join(output,file));return {file,bytes:b.length,sha256:hash(b)};});
    const cards=evidence.results.map(record=>'<section><h2>'+escapeHtml(record.key+' · '+record.width+'px · '+(record.passed?'automated checks passed':'review failures'))+'</h2><pre>'+escapeHtml(record.failures.join('\n'))+'</pre><div>'+record.screenshots.map(s=>'<figure><a href="'+escapeHtml(s.file)+'"><img loading="lazy" src="'+escapeHtml(s.file)+'" alt="'+escapeHtml(s.file)+'"></a><figcaption>'+escapeHtml(s.file)+'<br>'+escapeHtml(s.url)+'</figcaption></figure>').join('')+'</div></section>').join('');
    fs.writeFileSync(path.join(output,'index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>UK hosted browser evidence</title><style>body{font:16px system-ui;margin:24px;color:#202329;background:#f4f5f7}section{margin:32px 0}section>div{display:flex;gap:16px;flex-wrap:wrap}figure{margin:0;width:300px;background:white;padding:12px}img{width:100%;height:360px;object-fit:contain;object-position:top}figcaption,pre{font-size:12px;overflow-wrap:anywhere;white-space:pre-wrap}</style><h1>'+escapeHtml(plan.facts.name)+' — hosted browser evidence</h1><p>'+escapeHtml(evidence.startedAt)+' · source '+escapeHtml(plan.sourceCommit)+'</p><p>Actual rendered screenshots. Human visual review and authenticated deployment-version verification remain separate.</p>'+cards+'</html>');
    save();
  }
  return evidence;
}

async function main() {
  const [command,...args]=process.argv.slice(2);
  if(command==='--help'){console.log('Manual CI only: prepare DEALER SOURCE_COMMIT PRIVATE_COMMIT PACKAGE_DIGEST; run PLAN_JSON. No local app builds or enquiry submissions.');return;}
  if(command==='prepare') {
    assert(args.length===4,'Expected dealer, source commit, private commit and package digest.');
    prepare({dealer:args[0],sourceCommit:args[1],publishedCommit:args[2],packageDigest:args[3]});
  } else if(command==='run') {
    assert(args.length===1,'Expected one prepared plan path.');
    const ci=ciIdentity(),plan=json(args[0]),root=outputRoot(plan.dealer,ci);
    assert(path.resolve(args[0])===path.join(root,'plan.json')&&JSON.stringify(plan.ci)===JSON.stringify(ci),'Plan does not belong to this exact workflow attempt.');
    assert(process.versions.node===TOOLING.node,'Use the approved Node version for browser tooling.');
    const tooling=path.join(root,'tooling');verifyToolingFiles(tooling);
    for(const name of ['playwright','playwright-core'])assert(json(path.join(tooling,'node_modules',name,'package.json')).version===TOOLING.playwright,'Installed browser tooling version differs: '+name);
    for(const [file,receipt]of Object.entries(plan.sourceFiles))assert(hash(gitFile(plan.sourceCommit,'clients/'+plan.dealer+'/'+file))===receipt.sha256,'Source evidence bytes changed: '+file);
    const {chromium}=await import(pathToFileURL(path.join(tooling,'node_modules/playwright/index.mjs')));
    const result=await verifyHosted(plan,chromium,path.join(root,'evidence'));
    verifyToolingFiles(tooling);
    process.exitCode=result.automatedPassed?0:1;
  } else throw new Error('Use --help for usage.');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main().catch(error=>{console.error(error.stack);process.exitCode=1;});
