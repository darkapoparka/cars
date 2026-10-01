import fs from 'node:fs';
const p='scripts/native-parity.mjs';let t=fs.readFileSync(p,'utf8');
const a=t.indexOf('function hierarchy(){');const b=t.indexOf('\nfor(const action',a);if(a<0||b<0)throw Error('Hierarchy function not found');
t=t.slice(0,a)+`function hierarchy(){
 for(let attempt=0;attempt<5;attempt++){
  try{
   run('shell','rm','-f','/sdcard/mobile-parity.xml');
   run('shell','uiautomator','dump','/sdcard/mobile-parity.xml');
   const xml=run('shell','cat','/sdcard/mobile-parity.xml');
   if(!xml.includes('<hierarchy'))throw Error('No fresh Android hierarchy');
   const nodes=[...xml.matchAll(/<node\\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
   return {xml,nodes};
  }catch(error){if(attempt===4)throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,800);}
 }
}
`+t.slice(b);fs.writeFileSync(p,t);
fs.writeFileSync('reference/android/capture-quality-notes.json',JSON.stringify({invalidOrMislabeled:[{file:'filter-options/parking-0.xml',reason:'Stale Android hierarchy during native ANR; exclude this field from integration until recaptured.'},{file:'115-reference-restarted.xml',reason:'Stale hierarchy after native restart. PNG shows native loading skeleton, not ANR. Do not use XML for this frame.'}],reader:'Fresh temporary XML is required; failed dumps cannot reuse prior XML.'},null,2));
