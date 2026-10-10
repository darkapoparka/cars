import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('public/icons/native', { recursive: true });
const jobs = [
  ['home','17-home',92,2628,72,72,[255,255,255]],
  ['search','17-home',348,2628,72,72,[255,255,255]],
  ['searches','17-home',604,2628,72,72,[255,255,255]],
  ['heart','17-home',860,2628,72,72,[255,255,255]],
  ['tag','17-home',1116,2628,72,72,[255,255,255]],
  ['car','02-search-cars',80,372,96,96,[255,255,255]],
  ['bike','02-search-cars',336,372,96,96,[255,255,255]],
  ['electric','02-search-cars',584,364,112,112,[255,255,255]],
  ['motorhome','02-search-cars',848,372,96,96,[255,255,255]],
  ['truck','02-search-cars',1104,372,96,96,[255,255,255]],
  ['message','17-home',884,216,72,72,[255,255,255]],
  ['user','17-home',1172,216,72,72,[255,255,255]],
  ['smartSearch','02-search-cars',120,216,72,72,[230,233,239]],
  ['mic','02-search-cars',992,216,72,72,[230,233,239]],
  ['reset','02-search-cars',1172,216,72,72,[255,255,255]],
];
for (const [name,source,left,top,width,height,bg] of jobs) {
 const {data,info} = await sharp('reference/android/'+source+'.png').extract({left,top,width,height}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const rgba=Buffer.alloc(width*height*4); const contrasts=[];
 for(let i=0;i<data.length;i+=info.channels) contrasts.push(Math.max(...bg.map((channel,j)=>Math.abs(channel-data[i+j]))));
 const max=Math.max(...contrasts);
 for(let i=0;i<contrasts.length;i++) rgba[i*4+3]=Math.round(255*Math.max(0,(contrasts[i]-1)/(max-1)));
 await sharp(rgba,{raw:{width,height,channels:4}}).png().toFile('public/icons/native/'+name+'.png');
}
await fs.writeFile('reference/web/pass2/icon-provenance.json',JSON.stringify(jobs,null,2));
const names=jobs.map(job=>job[0]);
const styles=names.map(name=>`  ${name}: { maskImage: 'url(/icons/native/${name}.png)' },`).join('\n');
const component = `import * as stylex from '@stylexjs/stylex';
const s=stylex.create({
  base: { display: 'inline-block', flexShrink: 0, backgroundColor: 'currentColor', maskSize: 'contain', maskPosition: 'center', maskRepeat: 'no-repeat', verticalAlign: 'middle' },
  size: (size:number) => ({width:size,height:size}),
${styles}
});
const names = ${JSON.stringify(names)} as const;
export type NativeIconName=typeof names[number];
export function isNativeIcon(name:string):name is NativeIconName {return (names as readonly string[]).includes(name);}
export function NativeIcon({name,size=24}:{name:NativeIconName;size?:number}){return <span aria-hidden="true" {...stylex.props(s.base,s[name],s.size(size))}/>;}
`;
await fs.writeFile('src/components/NativeIcon.tsx',component);
let icon=await fs.readFile('src/components/Icon.tsx','utf8');icon="import { NativeIcon, isNativeIcon } from './NativeIcon';\n"+icon;
icon=icon.replace("  if (name === 'smartSearch')", "  if (!filled && isNativeIcon(name)) return <NativeIcon name={name} size={size}/>;\n  if (name === 'smartSearch')");
await fs.writeFile('src/components/Icon.tsx',icon);
console.log('Integrated native-alpha reference icons without rasterizing screen layouts.');
