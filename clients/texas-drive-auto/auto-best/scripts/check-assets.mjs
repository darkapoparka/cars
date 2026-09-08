import { readFile, readdir, lstat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const root=process.cwd(),staticRoot=path.join(root,'static');
const manifest=JSON.parse(await readFile(path.join(root,'.client/public-assets.json'),'utf8'));
const expected=new Map(manifest.assets.map(asset=>[asset.path,asset]));
const mediaExtension=/\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?|webmanifest)$/i;
const sourceExtension=/\.(?:css|html|js|svelte|ts)$/i;
const localReference=/["'`]((?:\/(?!\/))[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?|webmanifest))(?:[?#][^"'`]*)?["'`]/g;
const retiredNames=['best-home.css','best-home.js','day-night-desktop.css','day-night-desktop.js','day-night-header-bootstrap.js','day-night-site.css','day-night-site.js'];
const errors=[],referenced=new Set();
async function walk(directory){const files=[];for(const entry of await readdir(directory,{withFileTypes:true})){const p=path.join(directory,entry.name);if(entry.isSymbolicLink())throw new Error(`Symlink is not permitted in app assets: ${p}`);if(entry.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
for(const file of await walk(path.join(root,'src'))){if(!sourceExtension.test(file))continue;const source=await readFile(file,'utf8');for(const m of source.matchAll(localReference))referenced.add(m[1]);for(const name of retiredNames)if(source.toLowerCase().includes(name))errors.push(`${path.relative(root,file)} references retired runtime ${name}`);}
const found=new Set();
for(const file of await walk(staticRoot)){const publicPath='/'+path.relative(staticRoot,file).split(path.sep).join('/');found.add(publicPath);if(!mediaExtension.test(publicPath))errors.push(`Unexpected static file ${publicPath}`);if(retiredNames.some(name=>publicPath.toLowerCase().endsWith('/'+name))||/\/(?:_next|legacy-pages)\//i.test(publicPath))errors.push(`Retired runtime remains: ${publicPath}`);const entry=expected.get(publicPath);if(!entry){errors.push(`Uninventoried static asset: ${publicPath}`);continue;}const bytes=await readFile(file);if(bytes.length!==entry.bytes||createHash('sha256').update(bytes).digest('hex')!==entry.sha256)errors.push(`Asset bytes differ from client manifest: ${publicPath}`);}
for(const publicPath of expected.keys())if(!found.has(publicPath))errors.push(`Inventoried asset is missing: ${publicPath}`);
for(const publicPath of referenced)if(!found.has(publicPath))errors.push(`Missing local asset referenced by source: ${publicPath}`);
if(!referenced.has('/favicon.ico'))errors.push('No local favicon consumer found');
if(!referenced.has('/brand/logo-on-light.png'))errors.push('No local published brand consumer found');
if(errors.length){console.error(errors.sort().join('\n'));process.exit(1);}
console.log(`Client asset integrity passed: ${found.size} files with checked SHA-256, ${referenced.size} local source references. This does not establish photo licensing or visual acceptance.`);
