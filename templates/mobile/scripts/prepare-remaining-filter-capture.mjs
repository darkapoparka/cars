import fs from 'node:fs';
const p='scripts/capture-native-filter-options.mjs';let t=fs.readFileSync(p,'utf8');
t=t.replace("const root='reference/android/filter-options';", "const root='reference/android/filter-options-remaining';");
const a=t.indexOf('function read(){');const b=t.indexOf('\nasync function seek',a);if(a<0||b<0)throw Error('Reader missing');
t=t.slice(0,a)+`function read(){
 for(let attempt=0;attempt<5;attempt++){
  try{
   run('shell','rm','-f','/sdcard/filter-options.xml');
   run('shell','uiautomator','dump','/sdcard/filter-options.xml');
   const xml=run('shell','cat','/sdcard/filter-options.xml');
   if(!xml.includes('<hierarchy'))throw Error('No fresh hierarchy');
   const nodes=[...xml.matchAll(/<node\\s+([^>]+)>/g)].map(m=>Object.fromEntries([...m[1].matchAll(/([\\w-]+)="([^"]*)"/g)].map(a=>[a[1],decode(a[2])])));
   if(nodes.some(n=>n.text?.includes("isn't responding")))throw Error('REFERENCE_APP_NOT_RESPONDING');
   return {xml,nodes};
  }catch(error){if(error.message==='REFERENCE_APP_NOT_RESPONDING'||attempt===4)throw error;Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,750);}
 }
}
`+t.slice(b);
t=t.replace('const result={};',"const result={};let started=false;");
t=t.replace(" if(sectionIndex===1)await seek('Show all filters');",'');
t=t.replace("  if(field.kind==='toggle')continue;", "  if(field.id==='parking')started=true; if(!started||field.kind==='toggle')continue;");
t=t.replace('await wait(500);return;', 'await wait(1200);return;');
t=t.replace('await seek(field.label);let current=read();await capture',"await seek(field.label);let current=read();if(current.nodes.some(n=>n.text==='Search Filters')){await wait(1500);current=read();if(current.nodes.some(n=>n.text==='Search Filters'))throw Error('Native dialog did not open: '+field.id);}await capture");
fs.writeFileSync('scripts/capture-remaining-native-filters.mjs',t);
