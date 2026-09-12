import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT, json, validateManifest, writeJson} from './lib/workflow.mjs';

export const journeys = {
  'auto-best': {inventory:'/listing-grid', detail:'/listing-detail-v1/', contact:'/contact'},
  modern: {inventory:'/cars', detail:'/listing/', contact:'/bg/contact'},
  import: {inventory:'/inventory', detail:'/inventory/', contact:'/contact'},
  carwow: {inventory:'/inventory', detail:'/inventory/', contact:'/contact'},
};

export async function verifyPreview({slug, origin, output, manifest, chromium, expectedCommit=null, widths=[390,1440]}) {
  validateManifest(manifest);
  if(manifest.slug!==slug)throw new Error('Manifest does not match the requested dealer.');
  const site=new URL(origin);
  if(!['http:','https:'].includes(site.protocol)||site.pathname!=='/'||site.search||site.hash)throw new Error('Use the origin without a path, query or fragment.');
  const language=manifest.switcher?.language||manifest.language||'bg';
  const labels=manifest.switcher?.labels|| (language.startsWith('bg')?{design:'Дизайн',choose:'Избор на дизайн'}:{design:'Design',choose:'Choose a design'});
  const staleTerms=manifest.qa?.forbiddenIdentity||['Excellent Cars','Day Night Auto','Дей енд Найт'];
  const results=[];
  const evidence={schemaVersion:1,slug,origin:site.origin,expectedCommit,commitVerification:'Confirm separately against the provider deployment record.',startedAt:new Date().toISOString(),variants:manifest.variants,results};
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
        const inspect=async (href,label)=>{
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
        const button=page.getByRole('button',{name:`${labels.design} ${index+1} / 3`,exact:true});
        await button.waitFor({state:'visible',timeout:15000});await button.click();
        const menu=page.getByRole('navigation',{name:labels.choose,exact:true});
        await menu.waitFor({state:'visible'});
        record.designChoices=await menu.getByRole('link').evaluateAll(links=>links.map(a=>a.getAttribute('href')));
        if(JSON.stringify(record.designChoices)!==JSON.stringify(manifest.variants.map(v=>v.entry)))throw new Error('FAB choices differ from the dealer manifest.');
        await page.keyboard.press('Escape');
        record.switcherDismissed=await button.getAttribute('aria-expanded')==='false';
        record.focusReturned=await button.evaluate(e=>e===document.activeElement);
        await button.click();const next=(index+1)%3;await menu.getByRole('link').nth(next).click();
        await page.getByRole('button',{name:`${labels.design} ${next+1} / 3`,exact:true}).waitFor({state:'visible',timeout:60000});
        record.switchedTo=page.url();
        if(new URL(page.url()).pathname!==manifest.variants[next].entry)throw new Error('Design switch navigated to the wrong entry.');
        const journey=journeys[variant.key];
        await inspect(variant.base+journey.inventory,'inventory');
        const search=page.locator('input[type="search"], input[placeholder*="Търс"], input[placeholder*="Search"], input[placeholder*="Марка"]').filter({visible:true}).first();
        if(await search.count()) {
          await search.fill('BMW');
          record.search={value:await search.inputValue(),tested:'input accepts and clears a query'};
          await search.fill('');
        } else record.search={state:'manual-review-required',reason:'No visible text search; inspect this template filter controls.'};
        const detail=page.locator(`a[href*="${journey.detail}"]`).filter({visible:true}).first();
        const detailHref=await detail.getAttribute('href',{timeout:15000});
        if(!detailHref)throw new Error('No visible vehicle detail link.');
        await inspect(new URL(detailHref,page.url()).href,'detail');
        await inspect(variant.base+(variant.key==='modern'&&manifest.language==='en'?'/en/contact':journey.contact),'contact');
        if(!record.routes.at(-1).phones.length)throw new Error('No telephone enquiry destination on contact.');
        await page.setViewportSize({width:320,height:760});
        await button.click();
        record.switcher320=await menu.evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight;});
        await page.keyboard.press('Escape');
        record.passed=!errors.length&&!consoleErrors.length&&record.switcherDismissed&&record.focusReturned&&record.switcher320;
      } catch(error) {record.failure=error.message;record.passed=false;}
      save();console.log(JSON.stringify({key:record.key,width,passed:record.passed,failure:record.failure,routes:record.routes.length,errors:errors.length,consoleErrors:consoleErrors.length}));
      await page.close();
    }
  } finally {await browser.close();evidence.finishedAt=new Date().toISOString();evidence.passed=results.length===widths.length*3&&results.every(r=>r.passed);save();}
  return evidence;
}

async function main() {
  if(process.argv.includes('--help')) {console.log('Usage: node scripts/verify-dealer-preview.mjs SLUG ORIGIN [OUTPUT] [--manifest PATH] [--commit SHA] [--playwright PATH]\nChecks the actual manifest trio at 390/1440 px and the deployed FAB at 320 px. No external enquiries are sent.');return;}
  const argv=process.argv.slice(2),slug=argv.shift(),origin=argv.shift();
  if(!/^[a-z0-9][a-z0-9-]*$/.test(slug||'')||!origin)throw new Error('Use --help for usage.');
  const output=argv[0]&&!argv[0].startsWith('--')?path.resolve(argv.shift()):path.join(ROOT,'runtime/dealer-qa',slug);
  const options={};while(argv.length){const key=argv.shift();if(!['--manifest','--commit','--playwright'].includes(key)||!argv[0])throw new Error('Unknown or incomplete option: '+key);options[key]=argv.shift();}
  const module=options['--playwright']||path.join(ROOT,'clients',slug,'auto-best/node_modules/playwright/index.mjs');
  const {chromium}=await import(pathToFileURL(path.resolve(module)));
  const manifest=json(options['--manifest']||path.join(ROOT,'clients',slug,'dealer.json'));
  const result=await verifyPreview({slug,origin,output,manifest,chromium,expectedCommit:options['--commit']||null});
  process.exitCode=result.passed?0:1;
}
if(process.argv[1]&&path.resolve(process.argv[1])===import.meta.filename)main().catch(e=>{console.error(e.message);process.exitCode=1;});
