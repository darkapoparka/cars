import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
const root='reference/2026-09-26-final-pass';await mkdir(root+'/comparisons',{recursive:true});
const pairs=[['similar-entry','final-similar-entry-ready'],['similar-comparison','final-similar-top'],['exchange-coupon','final-offer-action'],['interest-offer','final-interest-sheet'],['customer-stories','final-customers']];
const header=Buffer.from('<svg width="854" height="28"><rect width="854" height="28" fill="white"/><text x="12" y="19" font-family="Arial" font-size="13" fill="#112244">Android reference</text><text x="439" y="19" font-family="Arial" font-size="13" fill="#112244">Browser reconstruction</text></svg>');
for(const[web,native]of pairs){const nativeImage=await sharp(`reference/2026-09-26-continuation/${native}.png`).resize(427,952).png().toBuffer();const browser=await sharp(`${root}/verification/${web}.png`).resize(427,952).png().toBuffer();await sharp({create:{width:854,height:980,channels:3,background:'#fff'}}).composite([{input:header,left:0,top:0},{input:nativeImage,left:0,top:28},{input:browser,left:427,top:28}]).png().toFile(`${root}/comparisons/${web}.png`);}
await writeFile(root+'/comparisons/pairs.json',JSON.stringify(pairs.map(([web,native])=>({browser:`${root}/verification/${web}.png`,native:`reference/2026-09-26-continuation/${native}.png`,comparison:`${root}/comparisons/${web}.png`})),null,2));
console.log('Wrote five paired visual comparisons.');
