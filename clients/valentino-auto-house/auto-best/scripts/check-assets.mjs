import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = process.cwd();
const media = /\.(avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|eot|mp4|webm)$/i;
const local = /["'\x60](\/(?!\/)[A-Za-z0-9._@%+~/-]+\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|eot|mp4|webm))(?:\?[^"'\x60\s]*)?["'\x60]/g;
async function walk(dir) { const out=[]; for(const entry of await readdir(dir,{withFileTypes:true})) { const file=path.join(dir,entry.name); if(entry.isDirectory()) out.push(...await walk(file)); else out.push(file); } return out; }
const sourceFiles=(await walk(path.join(root,'src'))).filter(file=>/\.(css|html|js|json|svelte|ts)$/.test(file));
const staticFiles=await walk(path.join(root,'static'));
const publicFiles=new Set(staticFiles.map(file=>'/'+path.relative(path.join(root,'static'),file).split(path.sep).join('/')));
const refs=new Set(); const errors=[];
for(const file of sourceFiles){const text=await readFile(file,'utf8'); for(const match of text.matchAll(local))refs.add(match[1]); if(/day-night-[^\s]+\.(webp|png|jpg)|daynight\.mobile\.bg|kristiankirilov1355|Атанас Манчев|Студентски град/.test(text))errors.push('Inherited public content: '+path.relative(root,file));}
for(const ref of refs)if(!publicFiles.has(ref))errors.push('Missing asset '+ref);
for(const file of publicFiles)if(!media.test(file)&&!['/brand/provenance.json','/manifest.webmanifest'].includes(file))errors.push('Unexpected static file '+file);
const pack=JSON.parse(await readFile('src/lib/data/dealer-pack.json','utf8'));
for(const record of [...pack.media.assets,...(pack.media.derivatives??[])]){const bytes=await readFile(path.join(root,'static',record.path.slice(1)));if(createHash('sha256').update(bytes).digest('hex')!==record.sha256)errors.push('Asset hash mismatch '+record.path);}
for(const vehicle of pack.inventory){if(vehicle.photos.length<3)errors.push('Incomplete gallery '+vehicle.sourceId);if(!publicFiles.has(vehicle.thumbnail))errors.push('Missing thumbnail '+vehicle.sourceId);}
for(const required of ['/brand/logo.webp','/brand/logo-light.webp','/brand/logo-dark.webp','/favicon.ico','/favicon.png','/apple-touch-icon.png','/icon-192.png','/icon-512.png'])if(!publicFiles.has(required))errors.push('Missing brand export '+required);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log('Asset check passed: '+publicFiles.size+' public files, '+refs.size+' local references, '+pack.inventory.length+' source-linked galleries; hashes match the dated manifest.');
