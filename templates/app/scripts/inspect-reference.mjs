import fs from 'node:fs/promises';
import sharp from 'sharp';

const root = 'reference/2026-09-26-parity';
const html = await fs.readFile(`${root}/public-site.html`, 'utf8');
const urls = [...new Set([...html.matchAll(/(?:https:)?\/\/[^"<>\s]+/g)].map(m => m[0].replaceAll('&amp;', '&')))];
console.log('ARTWORK URLS', JSON.stringify(urls.filter(u => /\.(png|webp|svg|woff|jpg)/i.test(u) && !/masked-images|hello-ar/i.test(u)), null, 2));
console.log('SCRIPTS', JSON.stringify([...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map(m => m[1]), null, 2));
console.log('CSS', JSON.stringify([...html.matchAll(/<link[^>]*href="([^"]+\.css[^\"]*)"/g)].map(m => m[1]), null, 2));
for (const term of ['FORTUNER','94,099','94099','window.__','return-guarantee','30-day']) {
 const i = html.toLowerCase().indexOf(term.toLowerCase());
 console.log(term, i >= 0 ? html.slice(Math.max(0,i-300),i+550) : 'not present');
}
const input = `${root}/android-initial.png`;
const {data,info}=await sharp(input).removeAlpha().raw().toBuffer({resolveWithObject:true});
console.log('ANDROID SIZE',info.width,info.height);
for (const [x,y] of [[1,1],[600,700],[900,120],[10,1300]]) {
 const i=(y*info.width+x)*info.channels;
 console.log('PIXEL',x,y,'#'+data.subarray(i,i+3).toString('hex'));
}
await sharp(input).resize(427,952).png().toFile(`${root}/android-home-427.png`);
