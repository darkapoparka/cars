import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const adb = 'I:/Android/Sdk/platform-tools/adb.exe';
const out = 'reference/android/bmw-model-tree-complete';
const prior = JSON.parse(await fs.readFile('reference/android/bmw-model-tree/manifest.json','utf8')).groups;
await fs.mkdir(out, { recursive: true });
const run = (...a) => execFileSync(adb, ['-s', 'emulator-5554', ...a], { encoding: 'utf8', timeout: 25000, windowsHide: true });
const wait = ms => new Promise(r => setTimeout(r, ms));
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&apos;', "'");
async function read() {
  run('shell', 'rm', '-f', '/sdcard/model-tree.xml');
  run('shell', 'uiautomator', 'dump', '/sdcard/model-tree.xml');
  const xml = run('shell', 'cat', '/sdcard/model-tree.xml');
  if (!xml.includes('text="BMW"')) throw Error('Expected BMW model picker');
  const nodes = [...xml.matchAll(/<node\s+([^>]+)>/g)].map(m => Object.fromEntries([...m[1].matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], decode(a[2])])));
  return { xml, nodes, rows: nodes.filter(n => n.text && /^\[296,/.test(n.bounds) && n.bounds.includes('[1020,') && n.text !== 'Any') };
}
const center = n => { const b = n.bounds.match(/\d+/g).map(Number); return [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; };
async function tap(x, y) { run('shell', 'input', 'tap', String(Math.round(x)), String(Math.round(y))); await wait(450); }
async function scroll(up = false) { run('shell', 'input', 'swipe', '800', up ? '900' : '2280', '800', up ? '2300' : '980', '450'); await wait(450); }
let serial = 0;
async function capture(state, label) {
  const name = `${String(serial++).padStart(3,'0')}-${label}`;
  await fs.writeFile(`${out}/${name}.xml`, state.xml);
  run('shell','screencap','-p','/sdcard/model-tree.png'); run('pull','/sdcard/model-tree.png',`${out}/${name}.png`);
  await sharp(`${out}/${name}.png`).extract({left:0,top:168,width:1280,height:2616}).resize(427,872).toFile(`${out}/${name}-small.png`);
}
let state = await read();
const opened = state.nodes.find(n => n['content-desc'] === 'Hide models');
if (opened) await tap(...center(opened));
for (let i=0; i<12; i++) { state=await read(); if(state.rows.some(n=>n.text==='1 Series'))break; await scroll(true); }
const root = new Map(); let previous = '';
for (let i=0; i<15; i++) {
  state=await read(); const signature=state.rows.map(n=>n.text).join('|');
  if(signature===previous)break; previous=signature; await capture(state,'root');
  for(const n of state.rows){ const y=center(n)[1]; const expandable=state.nodes.some(a=>a['content-desc']==='Show all models'&&Math.abs(center(a)[1]-y)<30); root.set(n.text,{name:n.text,children:[],expandable}); }
  await scroll();
}
console.log('ROOT', [...root.keys()].join(' | '));
for(const group of [...root.values()].filter(x=>x.expandable)) {
  if(['1 Series','2 Series','3 Series'].includes(group.name)){group.children=prior.find(x=>x.name===group.name)?.children||[];continue;}
  for(let i=0;i<15;i++){ state=await read();if(state.rows.some(n=>n.text==='1 Series'))break;await scroll(true); }
  let row;
  for(let i=0;i<15;i++){state=await read();row=state.rows.find(n=>n.text===group.name&&center(n)[1]>700&&center(n)[1]<2340);if(row)break;await scroll();}
  if(!row)throw Error('Cannot locate '+group.name); await tap(228,center(row)[1]);
  let active=false, done=false, last=''; const children=new Set();
  for(let i=0;i<12&&!done;i++){
    state=await read();const signature=state.rows.map(n=>n.text).join('|');if(signature===last)break;last=signature;await capture(state,group.name.replaceAll(' ','-'));
    if(state.rows.some(n=>n.text===group.name))active=false;
    for(const n of state.rows){if(n.text===group.name){active=true;continue;}if(!active)continue;if(root.has(n.text)){done=true;break;}children.add(n.text);}
    if(!done)await scroll();
  }
  group.children=[...children];console.log('GROUP',group.name,group.children.join('|'));
  await fs.writeFile(out+'/manifest.json',JSON.stringify({at:new Date().toISOString(),make:'BMW',groups:[...root.values()]},null,2));
  for(let i=0;i<15;i++){state=await read();const toggle=state.nodes.find(n=>n['content-desc']==='Hide models');if(toggle){await tap(...center(toggle));break;}await scroll(true);}
}
console.log('MODEL_TREE_COMPLETE',root.size);
