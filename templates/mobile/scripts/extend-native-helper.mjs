import fs from 'node:fs';
const p='scripts/native-parity.mjs';let t=fs.readFileSync(p,'utf8');
const marker=" else if(kind==='capture'){";
if(!t.includes(marker))throw Error('Capture action missing');
t=t.replace(marker,` else if(kind==='seek'){
  let found=false;
  for(let attempt=0;attempt<16;attempt++){
   const {nodes}=hierarchy();const n=nodes.find(n=>(n.text===value||n['content-desc']===value)&&Number(n.bounds.match(/\\d+/g)?.[1])>360&&Number(n.bounds.match(/\\d+/g)?.[3])<2600);
   if(n){const [x,y,r,b]=n.bounds.match(/\\d+/g).map(Number);run('shell','input','tap',String(Math.round((x+r)/2)),String(Math.round((y+b)/2)));await sleep(800);found=true;break;}
   run('shell','input','swipe','1210','2350','1210','1050','450');await sleep(500);
  }
  if(!found)throw Error('Could not locate native row: '+value);
 }`+marker);
// Keep full hierarchies on disk; suppress only long advertising URLs in console output.
t=t.replace("nodes.filter(n=>n.text||n['content-desc'])","nodes.filter(n=>(n.text||n['content-desc'])&&(n['content-desc']||'').length<220&&n.bounds!=='[0,0][0,0]')");
fs.writeFileSync(p,t);
