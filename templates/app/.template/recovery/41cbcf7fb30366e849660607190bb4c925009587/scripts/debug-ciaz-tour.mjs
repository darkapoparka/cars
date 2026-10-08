import {createBrowser,sleep} from './lib/browser-qa.mjs';
const b=await createBrowser('reference/2026-09-26-final-pass/tour-debug');
try{
 await b.navigate('/cars/2023-suzuki-ciaz-glx');
 const point=await b.evaluate(`(()=>{const r=document.querySelector('[aria-label="Open vehicle video tour"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
 for(const type of ['mousePressed','mouseReleased'])await b.send('Input.dispatchMouseEvent',{type,button:'left',clickCount:1,...point});
 await sleep(3500);
 console.log('STATE',await b.evaluate(`(()=>{const v=document.querySelector('[aria-label="Vehicle video tour"] video');return{media:v?{src:v.currentSrc,paused:v.paused,ready:v.readyState,time:v.currentTime,duration:v.duration,error:v.error?.message,rect:v.getBoundingClientRect().toJSON()}:null,status:document.querySelector('[role="alert"]')?.textContent};})()`));
 await b.capture('physical-tour');
}finally{await b.report();await b.close();}
