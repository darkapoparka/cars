import {createBrowser,sleep} from './lib/browser-qa.mjs';
const browser=await createBrowser('reference/2026-09-26-final-pass/offer-debug');
try {
 await browser.navigate('/cars/2024-toyota-fortuner-exr');
 const state=`(() => {const node=document.querySelector('[aria-label="Vehicle offers"]');return {hidden:document.hidden,visible:node.dataset.offerVisible,index:node.dataset.offerIndex,hover:node.matches(':hover'),hoverCapable:matchMedia('(hover: hover)').matches,reducedMotion:matchMedia('(prefers-reduced-motion: reduce)').matches,focused:node.contains(document.activeElement),keyboardFocus:document.activeElement.matches(':focus-visible'),dialogs:document.querySelectorAll('[aria-modal=true]').length};})()`;
 console.log('BEFORE',await browser.evaluate(state));
 await sleep(5500);console.log('AFTER',await browser.evaluate(state));
 await browser.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 await browser.navigate('/cars/2024-toyota-fortuner-exr');console.log('MOTION ENABLED',await browser.evaluate(state));
 await sleep(5500);console.log('AFTER MOTION',await browser.evaluate(state));
} finally {await browser.close();}
