import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('Usage: node scripts/check-live-fab.mjs [--dealer SLUG] [--out DIRECTORY]\nRead-only anonymous browser checks of the registered live designs at 1440, 390 and 320 px. Uses Playwright installed in the sibling Cars Admin checkout. Writes only QA evidence under runtime by default; never submits forms or deploys.');process.exit(0);}
let selected=null;let out=path.join(root,'runtime','fab-qa-'+new Date().toISOString().replace(/[:.]/g,'-'));
for(let i=0;i<args.length;i++){if(!['--dealer','--out'].includes(args[i])||!args[i+1]||args[i+1].startsWith('--'))throw Error('Use --help for valid arguments'); if(args[i]==='--dealer')selected=args[++i];else out=path.resolve(args[++i]);}
const workspace=JSON.parse(fs.readFileSync(path.join(root,'workspace.json'),'utf8'));
const admin=workspace.repositories.find(r=>r.key==='admin');
const browserModule=path.resolve(root,admin.path,'node_modules/playwright/index.mjs');
if(!fs.existsSync(browserModule))throw Error('Install the Cars Admin checkout dependencies before browser QA.');
const {chromium}=await import(pathToFileURL(browserModule).href);
const registry=JSON.parse(fs.readFileSync(path.join(root,'docs/DEPLOYMENT-INVENTORY.json'),'utf8'));
const canonical=registry.aliases?.[selected]||selected;
const dealers=registry.dealers.filter(d=>d.delivery?.url&&(!canonical||d.slug===canonical)).map(d=>({slug:d.slug,url:d.delivery.url,variants:d.variants.filter(v=>v.entry)}));
if(!dealers.length)throw Error('No registered live dealer matched.');
for(const d of dealers){const url=new URL(d.url);if(url.protocol!=='https:'||url.username||url.password||url.search)throw Error('Expected an anonymous HTTPS dealer URL: '+d.slug);if(d.variants.length!==3)throw Error('Expected exactly three declared design entries: '+d.slug);}
fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
async function inspect(dealer){
 const context=await browser.newContext(); const page=await context.newPage();
 await page.route('**/*',route=>route.request().resourceType()==='media'?route.abort():route.continue());
 try {
  for(const variant of dealer.variants){
   const url=new URL(variant.entry,dealer.url).href;
   let response;
   try {response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});await page.locator('dealer-design-switcher, excellent-design-switcher').waitFor({state:'attached',timeout:10000});}
   catch(error){results.push({dealer:dealer.slug,url,error:error.message.slice(0,160)});continue;}
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:width===1440?1000:844});
    const host=page.locator('dealer-design-switcher, excellent-design-switcher');
    try {
     const button=host.locator('button').first(); await button.click({timeout:5000});
     const detail=await host.evaluate(h=>{const s=h.shadowRoot; const nav=s.querySelector('nav');const rect=nav.getBoundingClientRect();const b=s.querySelector('button').getBoundingClientRect();return {links:[...nav.querySelectorAll('a')].map(a=>({text:a.textContent.trim(),href:a.href,target:a.target,rel:a.rel,height:a.getBoundingClientRect().height})),bounds:{x:rect.x,y:rect.y,right:rect.right,bottom:rect.bottom},button:{width:b.width,height:b.height},viewport:{width:innerWidth,height:innerHeight}};});
     await page.keyboard.press('Escape');
     detail.escape=await host.evaluate(h=>h.shadowRoot.querySelector('nav').hidden&&h.shadowRoot.activeElement===h.shadowRoot.querySelector('button'));
     const admin=detail.links.filter(l=>new URL(l.href).origin===new URL(workspace.adminDemo.url).origin);
     const expected=dealer.variants.map(v=>new URL(v.entry,dealer.url).href);
     detail.routesMatch=expected.every((url,i)=>detail.links[i]?.href===url);
     const pass=detail.routesMatch && response.status()<400 && detail.links.length===4 && admin.length===1 && admin[0].target==='_blank' && /noopener/.test(admin[0].rel) && /noreferrer/.test(admin[0].rel) && detail.bounds.x>=0 && detail.bounds.y>=0 && detail.bounds.right<=width+1 && detail.bounds.bottom<=detail.viewport.height+1 && detail.button.width>=44 && detail.button.height>=44 && detail.links.every(l=>l.height>=44) && detail.escape;
     results.push({dealer:dealer.slug,url,status:response.status(),width,pass,...detail});
     if(dealer===dealers[0]&&variant.entry==='/'&&[390,1440].includes(width)){await button.click();await page.screenshot({path:path.join(out,dealer.slug+'-fab-'+width+'.png')});await page.keyboard.press('Escape');}
    } catch(error){results.push({dealer:dealer.slug,url,width,error:error.message.slice(0,180)});}
   }
  }
 } finally {await context.close();fs.writeFileSync(path.join(out,'fab-browser-checks.json'),JSON.stringify({checkedAt:new Date().toISOString(),scope:'FAB navigation and route availability only; not full template/logo QA',results},null,2)); console.log(dealer.slug+': '+results.filter(r=>r.dealer===dealer.slug&&r.pass).length+'/9 FAB checks');}
}
try {for(let i=0;i<dealers.length;i+=2)await Promise.all(dealers.slice(i,i+2).map(inspect));}
finally{await browser.close();}
console.log(JSON.stringify({checks:results.length,pass:results.filter(r=>r.pass).length,fail:results.filter(r=>!r.pass).length}));

if(results.some(result=>!result.pass))process.exitCode=1;
