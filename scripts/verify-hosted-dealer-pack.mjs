/** Read-only anonymous390px acceptance for each newly deployed dealer pack. */
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {isEntrypoint} from './lib/cli-entrypoint.mjs';
import {ROOT,sha256,json,writeJson} from './lib/workflow.mjs';
import {expectedPackHosting} from './lib/dealer-pack-identity.mjs';
import {previewJourney} from './verify-dealer-preview.mjs';
import {dealerPackFabPolicy,fleetDesignFabHashes} from './lib/dealer-pack-switcher-logo.mjs';
import {readDealerPackDom,observeDealerPackImages,assessPageSnapshot,completeDealerPackWelcome,prepareDealerPackScreenshot,verifyPackLogoAssets,loadFleetIdentities,stockIsDemo} from './verify-dealer-pack.mjs';

const assert=(ok,message)=>{if(!ok)throw Error(message);};

/** Keep hosted and native leak checks bound to the same reviewed stock records. */
export function assessHostedPackSnapshot({snapshot,pack,variant,fleet,label}) {
  assert(label==='home'||label==='contact','Hosted assessment requires home or contact');
  return assessPageSnapshot({snapshot,facts:pack.facts,stock:pack.stock,manifest:pack.manifest,variant,fleet,
    demoStock:stockIsDemo(pack),requireDisclosure:false,
    identityRequirements:{name:label==='home',logo:label==='home',phone:label==='contact'}});
}
const hex64=value=>/^[a-f0-9]{64}$/.test(value??'');
const dependency=(root,name)=>{
  for(const file of [process.env.CARS_QA_RESOLVE_FROM,path.join(root,'runtime/dealer-pack-tools/package.json'),path.join(root,'runtime/dealer-pack-preview-tools/package.json')].filter(Boolean))try{return createRequire(path.resolve(file))(name);}catch{}
  throw Error('Install the documented '+name+' QA dependency before hosted verification');
};

/** Anonymous HEAD chain: inspect every hop before following only this dealer's origin. */
export async function verifyHostedHead({origin,href,fetchImpl=fetch,maxRedirects=5}={}) {
  const result={method:'HEAD',status:'failed',httpStatus:null,bodyBytes:null,url:null,redirects:[],findings:[]};
  try{
    assert(Number.isSafeInteger(maxRedirects)&&maxRedirects>=0&&maxRedirects<=10,'Invalid HEAD redirect limit');
    let target=new URL(href,origin);const seen=new Set();
    for(;;){
      assert(target.origin===origin&&!target.username&&!target.password,'HEAD escaped the approved dealer origin');
      assert(!seen.has(target.href),'HEAD redirect loop');seen.add(target.href);result.url=target.href;
      const response=await fetchImpl(target.href,{method:'HEAD',redirect:'manual',signal:AbortSignal.timeout(60000)});
      result.httpStatus=response.status;result.bodyBytes=0;
      // A HEAD response is empty. Stop at its first unexpected chunk rather than
      // buffering an invalid or unbounded body; bodyBytes records observed bytes.
      if(response.body){
        const reader=response.body.getReader();
        try{for(;;){const {done,value}=await reader.read();if(done)break;result.bodyBytes+=value.byteLength;if(result.bodyBytes){await reader.cancel().catch(()=>{});break;}}}
        finally{reader.releaseLock();}
      }
      assert(result.bodyBytes===0,'HEAD returned a response body');
      if([301,302,303,307,308].includes(response.status)){
        const location=response.headers.get('location');assert(location,'HEAD redirect is missing Location');
        assert(result.redirects.length<maxRedirects,'HEAD exceeded the redirect limit');
        result.redirects.push({url:target.href,httpStatus:response.status,location});target=new URL(location,target);continue;
      }
      assert(response.status===200,'HEAD returned HTTP '+response.status);result.status='passed';break;
    }
  }catch(error){result.findings.push(error.message);}
  return result;
}

export async function verifyHostedDealerPack({root=ROOT,request,receipt,pack,candidate,registry,chromium,sharp,browser:sharedBrowser,reportFile,screenshotDirectory}={}) {
  const identity=expectedPackHosting(request.slug);assert(request.workerName===identity.workerName&&request.publicOrigin===identity.publicOrigin,'Hosted verification only accepts this pack canonical origin');
  if(!pack){const {loadPreparedDealerPack}=await import('./prepare-dealer-pack-logo.mjs');pack=await loadPreparedDealerPack(root,request.slug);}
  assert(pack.manifest.slug===request.slug&&pack.packDigest===request.packDigest&&pack.manifest.pack?.benchmarkOnly!==true,'Hosted pack differs or is a never-deploy benchmark');
  const directory=candidate?.directory;assert(directory&&path.isAbsolute(directory),'Retain the exact compiled bundle for hosted asset-byte checks');
  const result={schemaVersion:1,type:'cars-dealer-pack-hosted-qa',slug:request.slug,publicOrigin:identity.publicOrigin,packDigest:request.packDigest,outputDigest:request.outputDigest,
    versionId:receipt?.versionId??null,width:390,language:pack.manifest.localization?.defaultLocale??'en',startedAt:new Date().toISOString(),success:false,designs:[],routes:[],screenshots:[],providerWrites:0,ownerAccepted:false,
    scope:'Anonymous GET and bodyless HEAD home/contact journeys at390px; six FAB destinations and interaction, own business identity/logo bytes, known-fleet identity leaks, visible images and overflow. No enquiries or other write requests are sent.'};
  const fleet=loadFleetIdentities(root,registry);result.identityCoverage=fleet.coverage;
  sharp??=dependency(root,'sharp');const quality=await verifyPackLogoAssets({pack,sharp,bundleRoot:directory});assert(quality.status==='passed','Local logo inventory no longer passes');
  const hashes=row=>[row.sha256,row.sourceSha256,...(row.renderedSha256??[])].filter(hex64),logoHashes=new Set(quality.roles.flatMap(hashes)),fabLogoHashes=new Set(dealerPackFabPolicy(pack.manifest)==='fleet-design-mark-v1'?Object.values(fleetDesignFabHashes()):quality.roles.filter(row=>['onLight','mark'].includes(row.role)).flatMap(hashes));
  result.fabPolicy=dealerPackFabPolicy(pack.manifest);
  const files=candidate.files??json(path.join(directory,'single-worker-receipt.json')).files;
  const logoPaths=new Set(files.filter(row=>row.path.startsWith('public/')&&logoHashes.has(row.sha256)).map(row=>'/'+row.path.slice(7))),imageDigests=new Map();
  if(!chromium&&!sharedBrowser)({chromium}=dependency(root,'playwright'));
  const browser=sharedBrowser??await chromium.launch({headless:true});
  try{
    for(const variant of pack.manifest.variants){
      const page=await browser.newPage({viewport:{width:390,height:900}}),errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      await page.route('**/*',route=>['GET','HEAD'].includes(route.request().method())?route.continue():route.abort());
      const row={key:variant.key,status:'failed',httpStatus:null,headStatus:'failed',headHttpStatus:null,sixChoices:false,nameVisible:false,logoVisible:false,phoneStatus:'failed',foreignIdentityCount:0,findings:[]};result.designs.push(row);
      const inspect=async(href,label)=>{
        const target=new URL(href,identity.publicOrigin);assert(target.origin===identity.publicOrigin,'Hosted journey escaped the approved dealer origin');errors.length=0;
        const response=await page.goto(target.href,{waitUntil:'domcontentloaded',timeout:60000});assert(new URL(page.url()).origin===identity.publicOrigin,'Hosted redirect escaped the approved dealer origin');
        if(label==='home')row.httpStatus=response?.status()??null;
        await page.waitForLoadState('networkidle',{timeout:10000}).catch(()=>{});await completeDealerPackWelcome(page,variant);
        if(label==='home')await prepareDealerPackScreenshot(page);
        const snapshot=await page.evaluate(readDealerPackDom);
        await observeDealerPackImages(snapshot.images,{origin:identity.publicOrigin,logoHashes,fabLogoHashes,logoPaths,imageDigests});
        Object.assign(snapshot,{fabMarks:snapshot.images.filter(image=>image.consumer==='fab'),status:response?.status()??null,contentType:response?.headers()['content-type']??'',errors:[...errors]});
        const assessed=assessHostedPackSnapshot({snapshot,pack,variant,fleet,label});
        assessed.head=await verifyHostedHead({origin:identity.publicOrigin,href:target.href});
        if(assessed.head.status!=='passed'){assessed.status='failed';assessed.findings.push(...assessed.head.findings.map(finding=>'head: '+finding));}
        assessed.label=label;assessed.width=390;result.routes.push(assessed);
        return {snapshot,assessed};
      };
      try{
        const home=await inspect(variant.entry,'home');row.httpStatus=home.assessed.httpStatus;row.nameVisible=home.assessed.identity.observed.name;row.logoVisible=home.assessed.identity.observed.logo;
        row.headHttpStatus=home.assessed.head.httpStatus;
        row.sixChoices=home.snapshot.designChoices.length===6&&home.snapshot.designChoices.every((choice,index)=>choice.key===pack.manifest.variants[index].key);
        const fab=page.locator('dealer-design-switcher button.fab');await fab.click({timeout:10000});
        const opened=await page.locator('dealer-design-switcher #choices').evaluate(element=>{const box=element.getBoundingClientRect();return !element.hidden&&box.left>=0&&box.right<=innerWidth+1&&box.top>=0&&box.bottom<=innerHeight+1;});
        await page.keyboard.press('Escape');row.fabInteraction=opened&&await fab.getAttribute('aria-expanded')==='false';
        if(screenshotDirectory){fs.mkdirSync(screenshotDirectory,{recursive:true});const file=path.join(screenshotDirectory,variant.key+'-390-hosted.png');await page.screenshot({path:file,fullPage:true,animations:'disabled'});result.screenshots.push({key:variant.key,width:390,file,sha256:sha256(fs.readFileSync(file))});}
        const contact=await inspect(previewJourney(pack.manifest,variant).contact,'contact');row.phoneStatus=contact.assessed.phone==='not-provided'?'not-provided':contact.assessed.identity.observed.phone?'passed':'failed';
        row.headStatus=home.assessed.head.status==='passed'&&contact.assessed.head.status==='passed'?'passed':'failed';
        row.foreignIdentityCount=home.assessed.leaks.length+contact.assessed.leaks.length;row.findings=[...home.assessed.findings,...contact.assessed.findings,...(row.fabInteraction?[]:['fab-interaction'])];
        row.status=home.assessed.status==='passed'&&contact.assessed.status==='passed'&&row.fabInteraction?'passed':'failed';
      }catch(error){row.findings.push(error.message);row.runtimeErrors=[...errors];row.failedUrl=page.url();if(error.nativeWelcome)row.nativeWelcome=error.nativeWelcome;}finally{await page.close();}
      if(reportFile)writeJson(reportFile,result);
    }
    result.success=result.designs.length===6&&result.designs.every(row=>row.status==='passed');
  }finally{if(!sharedBrowser)await browser.close();result.finishedAt=new Date().toISOString();result.elapsedMs=Date.parse(result.finishedAt)-Date.parse(result.startedAt);if(reportFile)writeJson(reportFile,result);}
  return result;
}

if(isEntrypoint(import.meta.url)){
  const args=process.argv.slice(2);if(args.includes('--help'))console.log('Usage: verify-hosted-dealer-pack.mjs --request REQUEST.json --bundle DIRECTORY --receipt RECEIPT.json --report REPORT.json [--screenshots DIRECTORY]');
  else (async()=>{const allowed=new Set(['--request','--bundle','--receipt','--report','--screenshots']),options={};for(let i=0;i<args.length;i+=2){assert(allowed.has(args[i])&&args[i+1]&&!options[args[i]],'Invalid hosted verification arguments');options[args[i]]=args[i+1];}
    assert(options['--request']&&options['--bundle']&&options['--receipt']&&options['--report'],'Exact request, bundle, receipt and report paths required');
    const request=json(options['--request']),receipt=json(options['--receipt']),directory=path.resolve(options['--bundle']),result=await verifyHostedDealerPack({request,receipt,candidate:{directory},reportFile:options['--report'],screenshotDirectory:options['--screenshots']});console.log(JSON.stringify({slug:result.slug,success:result.success,designs:result.designs,elapsedMs:result.elapsedMs},null,2));if(!result.success)process.exitCode=1;
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
