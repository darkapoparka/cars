import {readFile,writeFile,copyFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {createHash} from 'node:crypto';
const edits=[];
async function edit(file,sha,change){const s=await readFile(file,'utf8');if(createHash('sha256').update(s).digest('hex')!==sha)throw Error('Concurrent source change: '+file);edits.push([file,change(s)]);}
function once(s,a,b){if(s.split(a).length!==2)throw Error('Nonunique icon replacement: '+a.slice(0,60));return s.replace(a,b);}
await edit('components/ReferenceUI.tsx','a6eb36eed6330a120184cb854627bbf90832bb56553c1308434307ca2704b485',s=>{
 s=once(s,"import { ChevronDown, ListFilter, SlidersHorizontal } from 'lucide-react';","import { ChevronDown } from 'lucide-react';\nimport NativeIcon from '@/components/NativeIcon';");
 s=once(s,'<SlidersHorizontal size={15}/>:<ListFilter size={17}/>','<NativeIcon name="filter" size={16}/>:<NativeIcon name="sort" size={16}/>');
 const start=s.indexOf('export function Dirham('),end=s.indexOf('export function WhatsAppIcon',start);
 if(start<0||end<0)throw Error('Dirham boundary missing');
 s=s.slice(0,start)+`export function Dirham({size=14}: {size?:number}) {\n  return <span aria-label="AED" role="img" style={{display:'inline-flex',verticalAlign:'-.12em',flexShrink:0}}><NativeIcon name="dirham" size={size}/></span>;\n}\n\n`+s.slice(end);
 s=s.split('\n').map(line=>line.startsWith("  if(name==='Home')")?`  if(name==='Home')return <NativeIcon name={active?'homeSelected':'home'}/>;`:line.startsWith("  if(name==='Menu')")?`  if(name==='Menu')return <NativeIcon name={active?'menuSelected':'menu'}/>;`:line.startsWith('  return <svg {...common}><path d="M4 10')?`  return <NativeIcon name={active?'storesSelected':'stores'}/>;`:line).join('\n');return s;
});
await edit('components/DiscoveryHeader.tsx','ec2eb669801f39e26d627a268f6c5d983dde44c8e9da8fda31a13e23aafd6fe0',s=>{
 s=once(s,"import {Heart, Search} from 'lucide-react';","import NativeIcon from '@/components/NativeIcon';");
 s=once(s,'<Search size={19} strokeWidth={1.5} />','<NativeIcon name="search" size={20} />');
 return once(s,'<Heart size={21} strokeWidth={1.5} />','<NativeIcon name="heart" size={20} />');
});
await edit('components/GuestBanner.tsx','ea46bedeb329456f34125677b82860161ce2b43fbf56fd0ff2d398480c8548ba',s=>once(once(s,"import {X} from 'lucide-react';","import NativeIcon from '@/components/NativeIcon';"),'<X size={18} strokeWidth={1.6} />','<NativeIcon name="close" size={18} />'));
await edit('app/app.css','0eb28d7987fc652ae9fae0f235d4d9f8a8fd78bb1ebef1022151e9cf2ee0ffc7',s=>`@font-face { font-family: Cars24ReferenceIcons; font-style: normal; font-weight: 400; font-display: block; src: url('/fonts/native-icons.ttf') format('truetype'); }\n`+s);
await copyFile('reference/2026-09-26-polish/dlsicons.ttf','public/fonts/native-icons.ttf',constants.COPYFILE_EXCL);
for(const[file,s]of edits){await writeFile(file,s);console.log('Updated',file);}
await writeFile('reference/2026-09-26-polish/native-icon-manifest.json',JSON.stringify({source:'reference/2026-09-26-parity/reference-base.apk',entry:'assets/fonts/dlsicons.ttf',sha256:createHash('sha256').update(await readFile('public/fonts/native-icons.ttf')).digest('hex'),observations:['polish-return.json','polish-stores.json','polish-menu.json'],component:'components/NativeIcon.tsx'},null,2));
