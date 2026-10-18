import { isEntrypoint } from './lib/cli-entrypoint.mjs';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT, json, validateManifest, writeJson} from './lib/workflow.mjs';

export const journeys = {
  'auto-best': {inventory:'/listing-grid', detail:'/listing-detail-v1/', contact:'/contact'},
  modern: {inventory:'/cars', detail:'/listing/', contact:'/contact'},
  import: {inventory:'/inventory', detail:'/inventory/', contact:'/contact'},
  carwow: {inventory:'/inventory', detail:'/inventory/', contact:'/contact'},
  app: {inventory:'/cars', detail:'/cars/', contact:'/stores'},
  mobile: {inventory:'/results', detail:'/vehicle/', contact:'/contact'},
  'karento-best': {inventory:'/vehicles', detail:'/vehicle', contact:'/contact'},
};

const nativePreview = manifest => ['2','3','5'].includes(manifest.packaging?.version) && Boolean(manifest.localization);
const queryLocale = key => ['mobile','karento-best'].includes(key);
const routeOrigin = 'https://dealer-preview.invalid';

/** Apply the maintained switcher's path/query locale convention to a family route. */
function mountedPath(manifest, variant, route, {detail=false}={}) {
  const url=new URL(variant.base+route,routeOrigin);
  if(nativePreview(manifest)) {
    const language=manifest.localization.defaultLocale;
    if(queryLocale(variant.key)){if(!detail)url.searchParams.set('lang',language);}
    else url.pathname=variant.base+'/'+language+(url.pathname.slice(variant.base.length)==='/'?'':url.pathname.slice(variant.base.length));
  }
  return url.pathname+url.search+url.hash;
}

/** Overrides are exact public paths, including any locale/query, never guessed dealer facts. */
export function previewJourney(manifest, variant) {
  const defaults=journeys[variant.key],overrides=manifest.qa?.journeys?.[variant.key]??{};
  if(!defaults||!overrides||Array.isArray(overrides)||typeof overrides!=='object'||Object.keys(overrides).some(key=>!Object.hasOwn(defaults,key)))throw new Error('Unsupported journey for '+variant.key);
  return Object.fromEntries(Object.entries(defaults).map(([name,route])=>{
    if(name==='contact'&&variant.key==='modern'&&!nativePreview(manifest))route=(manifest.language?.startsWith('en')?'/en':'/bg')+route;
    const value=overrides[name]??mountedPath(manifest,variant,route,{detail:name==='detail'});
    if(typeof value!=='string'||!value.startsWith('/')||value.startsWith('//')||value.includes('\\'))throw new Error('Journey must be an exact public path: '+variant.key+'/'+name);
    const url=new URL(value,routeOrigin),owner=manifest.variants.find(v=>v.base&&(url.pathname===v.base||url.pathname.startsWith(v.base+'/')));
    if(url.origin!==routeOrigin||(owner?.key??'auto-best')!==variant.key)throw new Error('Journey escaped its design mount: '+variant.key+'/'+name);
    return [name,value];
  }));
}

function samePublicRoute(actual, expected, origin) {
  const left=new URL(actual,origin),right=new URL(expected,origin);
  return left.origin===right.origin&&left.pathname.replace(/\/$/,'')===right.pathname.replace(/\/$/,'')&&left.search===right.search&&left.hash===right.hash;
}

export function previewDetail(hrefs, inventoryUrl, detailPath) {
  const inventory=new URL(inventoryUrl),expected=new URL(detailPath,inventory);
  return hrefs.find(href=>{
    let url;try{url=new URL(href,inventory);}catch{return false;}
    return url.origin===inventory.origin&&!url.username&&!url.password&&
      (expected.pathname.endsWith('/')?url.pathname.startsWith(expected.pathname)&&url.pathname!==expected.pathname:url.pathname===expected.pathname)&&
      [...expected.searchParams].every(([key,value])=>url.searchParams.get(key)===value);
  });
}

export function previewAccess(origin, shareUrl=null) {
  const site=new URL(origin);
  if(!['http:','https:'].includes(site.protocol)||site.pathname!=='/'||site.search||site.hash||site.username||site.password)throw new Error('Use the origin without a path, query, fragment or credentials.');
  if(shareUrl){const shared=new URL(shareUrl);if(shared.origin!==site.origin||!shared.searchParams.get('_vercel_share')||shared.username||shared.password)throw new Error('Share access must target this exact origin and contain the Vercel share parameter.');}
  return {site,access:{mode:shareUrl?'temporary-share-link':'anonymous',publicWithoutShareLink:shareUrl?false:null}};
}

export async function verifyPreview({slug, origin, output, manifest, chromium, expectedCommit=null, widths=[390,1440], shareUrl=null}) {
  validateManifest(manifest);
  if(manifest.slug!==slug)throw new Error('Manifest does not match the requested dealer.');
  if(!Array.isArray(widths)||!widths.length||widths.some(width=>!Number.isSafeInteger(width)||width<=0))throw new Error('At least one positive viewport width is required.');
  const {site,access}=previewAccess(origin,shareUrl);
  const native=nativePreview(manifest),language=native?manifest.localization.defaultLocale:manifest.switcher?.language||manifest.language||'bg';
  const messages=native?json(new URL('./publishing/switcher-messages.json',import.meta.url)):null;
  const labelsFor=(href,variant)=>{
    const url=new URL(href),requested=queryLocale(variant.key)?url.searchParams.get('lang'):url.pathname.slice(variant.base.length).split('/')[1];
    const locale=native&&manifest.localization.enabledLocales.includes(requested)?requested:language;
    return native?messages[locale]:manifest.switcher?.labels||(locale.startsWith('bg')?{design:'Дизайн',choose:'Избор на дизайн'}:{design:'Design',choose:'Choose a design'});
  };
  const total=manifest.variants.length,entries=manifest.variants.map(v=>mountedPath(manifest,v,v.entry.slice(v.base.length)));
  const routes=new Map(manifest.variants.map(v=>[v.key,previewJourney(manifest,v)]));
  // Dealer-specific identity checks belong to the fact pack; a real dealer may
  // legitimately be Excellent Cars or Day & Night. Never blacklist it globally.
  const staleTerms=manifest.qa?.forbiddenIdentity||[];
  const results=[];
  const evidence={schemaVersion:1,slug,origin:site.origin,access,expectedCommit,commitVerification:'Confirm separately against the provider deployment record.',startedAt:new Date().toISOString(),variants:manifest.variants,results};
  fs.mkdirSync(output,{recursive:true});
  const save=()=>writeJson(path.join(output,'results.json'),evidence);
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try {
    for(const width of widths) for(const [index,variant] of manifest.variants.entries()) {
      const page=await browser.newPage({viewport:{width,height:900}});
      const errors=[],consoleErrors=[];
      page.on('pageerror',e=>errors.push(e.message));
      page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text());});
      const record={key:variant.key,width,routes:[],errors,consoleErrors}; results.push(record);
      try {
        const buttonFor=(current,currentIndex)=>page.getByRole('button',{name:`${labelsFor(page.url(),current).design} ${currentIndex+1} / ${total}`,exact:true});
        const menuFor=current=>page.getByRole('navigation',{name:labelsFor(page.url(),current).choose,exact:true});
        if(shareUrl){await page.goto(shareUrl,{waitUntil:'domcontentloaded',timeout:60000});if(new URL(page.url()).origin!==site.origin)throw new Error('Temporary preview share access did not reach the intended origin.');}
        const inspect=async (href,label)=>{
          if(new URL(href,site).origin!==site.origin)throw new Error('Journey must stay on the dealer origin.');
          const response=await page.goto(new URL(href,site).href,{waitUntil:'domcontentloaded',timeout:60000});
          if(new URL(page.url()).origin!==site.origin)throw new Error('Unexpected redirect: '+page.url());
          await page.waitForLoadState('networkidle',{timeout:15000}).catch(()=>{});
          const metrics=await page.evaluate(terms=>({
            title:document.title,bodyLength:document.body.innerText.trim().length,
            overflow:document.documentElement.scrollWidth-innerWidth,
            broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getClientRects().length).map(i=>i.src),
            phones:[...new Set([...document.querySelectorAll('a[href^="tel:"]')].map(a=>a.getAttribute('href')))],
            staleIdentity:terms.filter(t=>document.body.innerText.toLowerCase().includes(t.toLowerCase())),
          }),staleTerms);
          record.routes.push({label,status:response?.status(),url:page.url(),...metrics});
          await page.screenshot({path:path.join(output,`${variant.key}-${width}-${label}.png`),timeout:20000});save();
          if(!response?.ok()||metrics.bodyLength<100||metrics.overflow>1||metrics.broken.length||metrics.staleIdentity.length)throw new Error(`Route failed: ${label}`);
        };
        await inspect(variant.entry,'home');
        const button=buttonFor(variant,index);
        await button.waitFor({state:'visible',timeout:15000});await button.click();
        const menu=menuFor(variant);
        await menu.waitFor({state:'visible'});
        const designLinks=menu.locator('a[data-design-key]:not([data-home-id])');
        const choices=await designLinks.evaluateAll(links=>links.map(a=>({key:a.getAttribute('data-design-key'),href:a.getAttribute('href')})));
        record.designChoices=choices.map(choice=>choice.href);
        if(choices.length!==total||choices.some((choice,i)=>choice.key!==manifest.variants[i].key||!samePublicRoute(choice.href,entries[i],site)))throw new Error('FAB choices differ from the dealer manifest.');
        const admin=page.locator('a[data-cars-admin]');
        if(await admin.count()!==1)throw new Error('Exactly one shared Admin demo link is required.');
        record.admin=await admin.evaluate(link=>({href:link.getAttribute('href'),target:link.getAttribute('target'),rel:link.getAttribute('rel')}));
        const adminUrl=new URL(record.admin.href,site);
        if(adminUrl.origin!=='https://cars-admin-blue.vercel.app'||adminUrl.pathname!=='/'||adminUrl.username||adminUrl.password||record.admin.target!=='_blank'||!['noopener','noreferrer'].every(value=>record.admin.rel?.split(/\s+/).includes(value)))throw new Error('Shared Admin demo destination or new-tab attributes differ.');
        const originalPage=page.url();
        const [popup]=await Promise.all([page.waitForEvent('popup',{timeout:15000}),admin.click()]);
        try{await popup.waitForLoadState('domcontentloaded',{timeout:60000});record.adminOpened=samePublicRoute(popup.url(),adminUrl.href,site)&&page.url()===originalPage;}
        finally{await popup.close();}
        if(!record.adminOpened)throw new Error('Shared Admin demo did not open the expected new tab.');
        await page.keyboard.press('Escape');
        record.switcherDismissed=await button.getAttribute('aria-expanded')==='false';
        record.focusReturned=await button.evaluate(e=>e===(e.getRootNode().activeElement||document.activeElement));
        await button.click();const next=(index+1)%total;await designLinks.nth(next).click();
        await buttonFor(manifest.variants[next],next).waitFor({state:'visible',timeout:60000});
        record.switchedTo=page.url();
        if(!samePublicRoute(page.url(),entries[next],site))throw new Error('Design switch navigated to the wrong entry.');
        const journey=routes.get(variant.key);
        await inspect(journey.inventory,'inventory');
        const search=page.locator('input[type="search"], input[placeholder*="Търс"], input[placeholder*="Search"], input[placeholder*="Марка"]').filter({visible:true}).first();
        if(await search.count()) {
          await search.fill('BMW');
          record.search={value:await search.inputValue(),tested:'input accepts and clears a query'};
          await search.fill('');
        } else record.search={state:'manual-review-required',reason:'No visible text search; inspect this template filter controls.'};
        const detailHrefs=await page.locator('a[href]').filter({visible:true}).evaluateAll(links=>links.map(link=>link.getAttribute('href')));
        const detailHref=previewDetail(detailHrefs,page.url(),journey.detail);
        if(!detailHref)throw new Error('No visible vehicle detail link.');
        await inspect(new URL(detailHref,page.url()).href,'detail');
        await inspect(journey.contact,'contact');
        if(!record.routes.at(-1).phones.length)throw new Error('No telephone enquiry destination on contact.');
        await page.setViewportSize({width:320,height:760});
        await buttonFor(variant,index).click();
        record.switcher320=await menuFor(variant).evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;});
        await page.keyboard.press('Escape');
        record.passed=!errors.length&&!consoleErrors.length&&record.switcherDismissed&&record.focusReturned&&record.switcher320;
      } catch(error) {record.failure=error.message;record.passed=false;}
      save();console.log(JSON.stringify({key:record.key,width,passed:record.passed,failure:record.failure,routes:record.routes.length,errors:errors.length,consoleErrors:consoleErrors.length}));
      await page.close();
    }
  } finally {await browser.close();evidence.finishedAt=new Date().toISOString();evidence.passed=results.length===widths.length*total&&results.every(r=>r.passed);evidence.access.publicWithoutShareLink=evidence.passed&&!shareUrl;save();}
  return evidence;
}

async function main() {
  if(process.argv.includes('--help')) {console.log('Usage: node scripts/verify-dealer-preview.mjs SLUG ORIGIN [OUTPUT] [--manifest PATH] [--commit SHA] [--playwright PATH] [--share-file runtime/FILE.json]\nOptional share-file contains shareableUrl from Vercel; keep it untracked. Shared preview QA is recorded separately from anonymous public access. Checks 390/1440 px and the FAB at 320 px. No external enquiries are sent.');return;}
  const argv=process.argv.slice(2),slug=argv.shift(),origin=argv.shift();
  if(!/^[a-z0-9][a-z0-9-]*$/.test(slug||'')||!origin)throw new Error('Use --help for usage.');
  const output=argv[0]&&!argv[0].startsWith('--')?path.resolve(argv.shift()):path.join(ROOT,'runtime/dealer-qa',slug);
  const options={};while(argv.length){const key=argv.shift();if(!['--manifest','--commit','--playwright','--share-file'].includes(key)||!argv[0])throw new Error('Unknown or incomplete option: '+key);options[key]=argv.shift();}
  const module=options['--playwright']||path.join(ROOT,'clients',slug,'auto-best/node_modules/playwright/index.mjs');
  const {chromium}=await import(pathToFileURL(path.resolve(module)));
  const manifest=json(options['--manifest']||path.join(ROOT,'clients',slug,'dealer.json'));
  const result=await verifyPreview({slug,origin,output,manifest,chromium,expectedCommit:options['--commit']||null,shareUrl:options['--share-file']?json(options['--share-file']).shareableUrl:null});
  process.exitCode=result.passed?0:1;
}
if(isEntrypoint(import.meta.url))main().catch(e=>{console.error(e.message);process.exitCode=1;});
