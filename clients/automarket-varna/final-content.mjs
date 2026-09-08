import fs from 'node:fs/promises';import path from 'node:path';
const root=import.meta.dirname;const stock=JSON.parse(await fs.readFile(root+'/stock.json'));
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.isDirectory())out.push(...await walk(path.join(dir,e.name)));else out.push(path.join(dir,e.name))}return out}
async function edit(rel,fn){const p=root+'/'+rel;await fs.writeFile(p,fn((await fs.readFile(p,'utf8')).replaceAll('\r\n','\n')))}
await edit('carwow/src/lib/components/layout/DayNightFooter.svelte',s=>s.replace(/\tconst (facebookLinkProps|instagramLinkProps) = \{[\s\S]*?\} as const;\n/g,'').replace(/<li>\s*<a\s*\{\.\.\.(?:facebookLinkProps|instagramLinkProps)\}[\s\S]*?<\/li>/g,''));
for(const p of await walk(root+'/carwow/src'))if(/\.(svelte|ts)$/.test(p))await edit(path.relative(root,p),s=>s.replaceAll('или Viber','по телефона').replaceAll(' / Viber','').replaceAll('пишете във Viber','се обадете').replaceAll('Отзиви','Информация').replaceAll('отзива','информация').replace('const stars = [0, 1, 2, 3, 4] as const;','const stars: number[] = [];'));
// Disclose retained forms locally, without pretending delivery or changing their flow.
for(const f of ['carwow/src/lib/components/contact/MobileContactPage.svelte','carwow/src/lib/components/contact/DesktopContactPage.svelte'])await edit(f,s=>s.replace('Използвайте формата за запитване','Демо форма — за реален контакт се обадете').replace(/(<form\b[^>]*>)/,'$1\n<p>Демо запитване. За реален оглед се обадете на 0886 424 400.</p>'));
await fs.appendFile(root+'/BUILD-STATUS.md','\n\nResource cleanup: Auto Best preview PID 70508 stopped; QA script PID 50436 and its exclusively owned Chromium tree terminated after system commit exhaustion. No owned preview/browser running. Further preview + browser + teardown will use the shared mutex, per parent coordination. Previous partial QA and errors preserved.\n');
console.log('Final content corrections recorded');
