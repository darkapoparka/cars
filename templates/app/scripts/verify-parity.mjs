import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const root=path.resolve(process.env.QA_REPORT_DIR??'reference/2026-09-26-parity/verification');
await mkdir(root,{recursive:true});
const base=process.env.QA_BASE_URL??'http://127.0.0.1:4173';
const profile=await mkdtemp(path.join(os.tmpdir(),'cars24-parity-qa-'));
const browser=spawn(process.env.CHROME_PATH??'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--disable-extensions','--disable-background-networking','--hide-scrollbars','--no-first-run','--no-default-browser-check','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore',windowsHide:true});
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const checks=[],captures=[],errors=[];
let socket,id=1,route='';
const pending=new Map();
function check(name,condition,details){checks.push({name,passed:!!condition,...(details?{details}:{})});console.log(`${condition?'PASS':'FAIL'} ${name}${details?' '+JSON.stringify(details):''}`);}
try{
 let port;
 for(let i=0;i<120;i++){try{port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split(/\r?\n/)[0];break;}catch{await sleep(100);}}
 if(!port)throw Error('Chrome did not start');
 const target=await(await fetch(`http://127.0.0.1:${port}/json/new?about:blank`,{method:'PUT'})).json();
 socket=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
 socket.addEventListener('message',event=>{
  const data=JSON.parse(String(event.data));
  if(data.method==='Runtime.exceptionThrown')errors.push({route,type:'exception',...data.params.exceptionDetails});
  if(data.method==='Runtime.consoleAPICalled'&&data.params.type==='error')errors.push({route,type:'console',message:data.params.args.map(arg=>arg.value??arg.description).join(' ')});
  if(data.method==='Network.responseReceived'&&data.params.response.status>=400)errors.push({route,type:'http',url:data.params.response.url,status:data.params.response.status});
  if(!data.id)return;
  const item=pending.get(data.id);if(!item)return;
  clearTimeout(item.timer);pending.delete(data.id);
  if(data.error)item.reject(Error(`${item.method}: ${data.error.message}`));else item.resolve(data.result);
 });
 function send(method,params={}){const key=id++;return new Promise((resolve,reject)=>{const timer=setTimeout(()=>{pending.delete(key);reject(Error(`CDP timeout ${method}`));},45000);pending.set(key,{resolve,reject,method,timer});socket.send(JSON.stringify({id:key,method,params}));});}
 async function evaluate(expression){const response=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(response.exceptionDetails)throw Error(response.exceptionDetails.exception?.description??response.exceptionDetails.text);return response.result?.value;}
 async function waitFor(expression,description){for(let i=0;i<100;i++){try{if(await evaluate(expression))return;}catch{}await sleep(100);}throw Error(`Timed out: ${description}`);}
 async function viewport(width=427,height=952){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768,screenWidth:width,screenHeight:height});}
 async function navigate(next){
  route=next;await send('Page.navigate',{url:base+next});
  await waitFor(`document.readyState==='complete' && location.pathname===${JSON.stringify(next.split('?')[0])} && !!document.querySelector('main,section')`,'page navigation');
  await waitFor(`!![...document.querySelectorAll('button,a')].find(e=>Object.keys(e).some(k=>k.startsWith('__reactProps$')))`,'React hydration');
  await evaluate('document.fonts.ready.then(()=>true)');await sleep(200);
 }
 async function click(expression){await evaluate(`(()=>{const element=${expression};if(!element)throw Error('Missing click target');element.click();})()`);await sleep(250);}
 async function input(selector,value){await evaluate(`(()=>{const element=document.querySelector(${JSON.stringify(selector)});if(!element)throw Error('Missing input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(element,${JSON.stringify(value)});element.dispatchEvent(new Event('input',{bubbles:true}));})()`);await sleep(200);}
 async function escape(){await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await sleep(180);}
 async function capture(name){
  await evaluate('document.fonts.ready.then(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))');
  await sleep(750);
  const metrics=await evaluate(`({path:location.pathname,width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,dialogs:[...document.querySelectorAll('[role=dialog]')].map(e=>({name:e.getAttribute('aria-label')||e.getAttribute('aria-labelledby'),rect:e.getBoundingClientRect().toJSON()})),headings:[...document.querySelectorAll('h1,h2')].slice(0,12).map(e=>({text:e.textContent,rect:e.getBoundingClientRect().toJSON(),font:getComputedStyle(e).font})),brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.getAttribute('src')),activeNavigation:[...document.querySelectorAll('[aria-current=page]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.trim())})`);
  const image=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await writeFile(path.join(root,`${name}.png`),Buffer.from(image.data,'base64'));captures.push({name,...metrics});
  check(`${name}: no horizontal overflow`,metrics.scrollWidth<=metrics.width,metrics.scrollWidth>metrics.width?metrics:undefined);
  check(`${name}: images loaded`,!metrics.brokenImages.length,metrics.brokenImages.length?metrics.brokenImages:undefined);
 }
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await viewport();
 await navigate('/');await evaluate('localStorage.clear()');await navigate('/');await capture('home-mobile');
 for(const [name,url] of [['inventory-mobile','/cars'],['sell-mobile','/sell'],['finance-mobile','/finance'],['service-mobile','/service'],['stores-mobile','/stores'],['luxe-mobile','/luxe'],['menu-mobile','/more'],['detail-mobile','/cars/2024-toyota-fortuner-exr']]){await navigate(url);await capture(name);}
 await navigate('/cars');
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Filter')`);
 check('Filter opens',await evaluate(`!!document.querySelector('[aria-label="Car filters"]')`));
 check('All 13 filter categories available',await evaluate(`document.querySelector('[aria-label="Filter categories"]').querySelectorAll('button').length===13`));
 await capture('filters-brand-mobile');
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='BUDGET')`);await capture('budget-mobile');
 await click(`[...document.querySelectorAll('label')].find(e=>e.textContent==='Less than AED 40K')`);
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent.startsWith('SHOW '))`);await sleep(300);
 check('Budget filters actual local cars',await evaluate(`document.querySelectorAll('article').length===1 && document.querySelector('article')?.textContent.includes('CIAZ')`));
 await navigate('/cars');await click(`[...document.querySelectorAll('button')].find(e=>e.textContent.trim()==='Sort')`);await capture('sort-mobile');
 await click(`document.querySelector('input[aria-label="PRICE: LOW TO HIGH"]')`);await sleep(300);
 check('Price sorting',await evaluate(`document.querySelector('article')?.textContent.includes('CIAZ')`));
 await click(`document.querySelector('article button[aria-label^="Save "]')`);await navigate('/saved');
 check('Saved car persists across routes',await evaluate(`document.body.textContent.includes('CIAZ') && JSON.parse(localStorage.getItem('drive24:saved')||'[]').includes('2023-suzuki-ciaz-glx')`));await capture('saved-mobile');
 await navigate('/cars');await input('input[aria-label="Search cars"]','BMW');
 check('Text search filters live',await evaluate(`document.querySelectorAll('article').length===1&&document.querySelector('article')?.textContent.includes('BMW')`));
 await navigate('/more');await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='LOGIN')`);await capture('login-mobile');
 await input('#login-phone','123');await click(`document.querySelector('button[type="submit"]')`);check('Invalid phone validation',await evaluate(`document.querySelector('#phone-error')?.textContent.includes('valid')`));
 await input('#login-phone','501234567');await click(`document.querySelector('button[type="submit"]')`);check('No fabricated OTP delivery',await evaluate(`document.querySelector('[role=status]')?.textContent.includes('No OTP is sent')`));
 await escape();check('Escape closes login',await evaluate(`!document.querySelector('[aria-labelledby="login-title"]')`));check('Modal scroll lock released',await evaluate(`document.body.style.overflow!=='hidden'`));
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent.includes('Car finance'))`);check('Finance accordion works',await evaluate(`!![...document.querySelectorAll('a')].find(e=>e.textContent==='Car loan assistance')`));
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Change')`);await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Abu Dhabi')`);check('Location selection updates',await evaluate(`document.body.innerText.includes('Abu Dhabi')&&!document.querySelector('[aria-labelledby="location-title"]')`));
 for(const page of ['/sell','/service']){
  await navigate(page);await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Toyota')`);
  check(`${page}: brand journey opens`,await evaluate(`!!document.querySelector('[aria-labelledby="journey-title"]')`));await escape();check(`${page}: journey Escape closes`,await evaluate(`!document.querySelector('[aria-labelledby="journey-title"]')`));
 }
 await navigate('/cars/2024-toyota-fortuner-exr');await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Interiors')`);
 check('Detail uses this car’s interior',await evaluate(`document.querySelector('button[aria-label="Open vehicle photo gallery"] img')?.getAttribute('src')==='/reference-assets/fortuner-interior.jpg'`));
 await click(`document.querySelector('button[aria-label="Open vehicle photo gallery"]')`);check('Photo gallery opens',await evaluate(`!!document.querySelector('[aria-label="Vehicle photo gallery"]')`));await click(`document.querySelector('button[aria-label="Next photo"]')`);await escape();
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='Price breakdown')`);check('Price breakdown opens',await evaluate(`document.querySelector('[aria-label="Price breakdown"]')?.textContent.includes('97,599')`));await capture('price-breakdown-mobile');await escape();
 await click(`[...document.querySelectorAll('button')].find(e=>e.textContent==='EMI plans')`);await input('input[aria-label="Downpayment percentage"]','20');check('EMI estimate responds',await evaluate(`document.querySelector('[aria-label="EMI plans"]')?.textContent.includes('1,144')`));await escape();
 await click(`[...document.querySelectorAll('footer button')].find(e=>e.textContent==='Free test drive')`);check('Test drive enters login flow',await evaluate(`!!document.querySelector('[aria-labelledby="login-title"]')`));await escape();
 for(const [width,height] of [[390,844],[768,1024],[1440,1000]]){await viewport(width,height);for(const [name,url] of [['home','/'],['inventory','/cars'],['sell','/sell'],['detail','/cars/2024-toyota-fortuner-exr']]){await navigate(url);await capture(`${name}-${width}`);if(name==='home'||name==='sell'){const label=width<1100?'App navigation':'Primary navigation';check(`${name}-${width}: primary navigation visible`,await evaluate(`document.querySelector('[aria-label="${label}"]')?.getClientRects().length>0`));}}}
 check('No browser exceptions, console errors or HTTP failures',errors.length===0,errors);
}catch(error){check('QA completed',false,error.stack);}finally{
 await writeFile(path.join(root,'results.json'),JSON.stringify({createdAt:new Date().toISOString(),base,checks,captures,errors},null,2));
 if(socket?.readyState===WebSocket.OPEN)socket.close();browser.kill();
 for(const item of pending.values()){clearTimeout(item.timer);item.reject(Error('QA closed'));}
 await sleep(500);await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:250}).catch(()=>{});
}
console.log(JSON.stringify({passed:checks.filter(check=>check.passed).length,failed:checks.filter(check=>!check.passed).length,captures:captures.length,report:path.join(root,'results.json')}));
process.exitCode=checks.some(check=>!check.passed)?1:0;
