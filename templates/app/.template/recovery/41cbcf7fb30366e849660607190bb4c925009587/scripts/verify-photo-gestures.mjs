import {createBrowser, sleep} from './lib/browser-qa.mjs';
const b = await createBrowser('reference/2026-09-26-continuation/resume/gesture-verification');
try {
  await b.send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
  await b.navigate('/cars/2024-toyota-fortuner-exr/gallery');
  await b.click(`document.querySelector('[data-photo-index="5"]')`);
  await b.waitFor(`!!document.querySelector('[aria-label="Vehicle photo viewer"]')`);
  await b.capture('native-matched-console-viewer');
  const label=await b.evaluate(`document.querySelector('[aria-label="Vehicle photo viewer"] img').alt`);
  await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:330,y:480,id:0}]});
  for(let x=300;x>=80;x-=20){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:480,id:0}]});await sleep(20);}
  await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(300);
  b.check('Physical touch swipe advances the photograph',await b.evaluate(`document.querySelector('[aria-label="Vehicle photo viewer"] img').alt!==${JSON.stringify(label)}`));
  await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:480,id:0},{x:270,y:480,id:1}]});
  for(let delta=10;delta<=70;delta+=10){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:150-delta,y:480,id:0},{x:270+delta,y:480,id:1}]});await sleep(20);}
  await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await sleep(300);
  b.check('Two-finger pinch zooms the image',await b.evaluate(`new DOMMatrix(getComputedStyle(document.querySelector('[aria-label="Vehicle photo viewer"] img')).transform).a>1.6`));
  await b.capture('pinch-zoomed');
  await b.back();
  b.check('Back closes a pinched viewer and restores scrolling',await b.evaluate(`!document.querySelector('[role=dialog]')&&location.pathname.endsWith('/gallery')&&document.body.style.overflow!=='hidden'`));
  b.check('No gesture runtime or image errors',b.errors.length===0,b.errors);
} catch(error) {b.check('Gesture scenario completed',false,error.stack);} finally {
  const result=await b.report();await b.close();process.exitCode=result.failed||result.browserErrors?1:0;
}
