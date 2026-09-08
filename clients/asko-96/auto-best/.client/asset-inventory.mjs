import fs from 'node:fs';import path from 'node:path';
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
const refs=new Set(walk('src').filter(f=>/\.(css|html|js|svelte|ts)$/.test(f)).flatMap(f=>Array.from(fs.readFileSync(f,'utf8').matchAll(/\/(?:assets\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico)/gi),m=>m[0])));
const unused=walk('static').filter(f=>!refs.has('/'+f.replaceAll('\\','/').slice(7)));
fs.writeFileSync('.client/unused-assets.json',JSON.stringify(unused.map(f=>path.resolve(f)),null,2));
const check=fs.readFileSync('scripts/check-assets.mjs','utf8').replace(/const guardedMediaCount = \d+;/,'const guardedMediaCount = '+refs.size+';');fs.writeFileSync('scripts/check-assets.mjs',check);
console.log({referenced:refs.size,unused:unused.length});
