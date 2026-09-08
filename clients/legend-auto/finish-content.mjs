import fs from 'node:fs/promises';import path from 'node:path';
const root=import.meta.dirname,f=JSON.parse(await fs.readFile(`${root}/business-facts.json`)),stock=JSON.parse(await fs.readFile(`${root}/stock.json`));
const read=p=>fs.readFile(`${root}/${p}`,'utf8'),write=(p,s)=>fs.writeFile(`${root}/${p}`,s);async function edit(p,fn){await write(p,fn(await read(p)));}
async function files(dir){let all=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink()||['node_modules','.next','.svelte-kit','.git'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())all.push(...await files(p));else all.push(p);}return all;}
for(const variant of ['auto-best','carwow','modern']){
const dirs=variant==='modern'?['apps/web','packages/marketplace','packages/marketplace-ui','packages/marketplace-domain','packages/seo']:['src'];
for(const dir of dirs)for(const file of await files(`${root}/${variant}/${dir}`)){
if(!/\.(svelte|tsx?|html|css|svg|json)$/.test(file)||/\.(test|spec)\./.test(file))continue;let s=await fs.readFile(file,'utf8');
s=s.replaceAll('Day Night',f.name).replaceAll('Кристиан Кирилов',f.name);
// Old dealer channel links must never survive as this dealer's destinations.
s=s.replace(/https:\/\/www\.(facebook\.com\/61566304063141\/|instagram\.com\/daynight\.auto\.plovdiv\/)/g,f.contactUrl);
s=s.replace(/\/brand\/daynight-(?:logo-generated|favicon)\.png/g,f.logo);
s=s.replace(/\/assets\/[\w./-]*(?:kristian|team-sales|team-evaluation|team-documents|team-customer|showroom-entrance|about-showroom|showroom-color|portrait-color)[\w./-]*\.(?:webp|png|jpg)/g,stock[0].images[0]);
s=s.replaceAll('Отзиви от клиенти','Информация за покупката').replaceAll('Виж всички отзиви','Полезна информация').replaceAll("label: 'Отзиви'","label: 'Информация'").replaceAll('>Отзиви<','>Информация<');
s=s.replaceAll('Понеделник - Събота: 9:00 - 18:00',f.hours).replaceAll('Понеделник - Събота: 09:00 - 18:00',f.hours);
s=s.replaceAll('Автомобили в {brand.city} · Внос · Условия за покупка','Автомобили в {brand.city} · Оглед по уговорка');
await fs.writeFile(file,s);
}
}
await edit('auto-best/src/app.html',s=>s.replace('/favicon.ico',f.logo));
// Stock and contact facts replace fictitious team and partner profiles in the same cards.
await edit('auto-best/src/lib/data/demo-content.ts',s=>s.replace(/export const demoContentLabel = '[^']+';/,"export const demoContentLabel = 'LEGEND AUTO';").replace(/export const demoTeamIntro =[\s\S]*?;/,"export const demoTeamIntro = 'За наличност, оглед и подробности: 0899 877 305.';").replace(/export const demoTeamMembers: DemoTeamMember\[\] = \[[\s\S]*?\n\];/,`export const demoTeamMembers: DemoTeamMember[] = ${JSON.stringify(['Налични автомобили','Оглед във Варна','Транспорт в страната','Контакт с автокъщата'].map((name,i)=>({id:`contact-${i}`,name,role:'LEGEND AUTO · 0899 877 305',image:stock[i].images[0]})),null,2)};`).replace(/export const demoPartners: DemoPartner\[\] = \[[\s\S]*?\n\];/,'export const demoPartners: DemoPartner[] = [];'));
await edit('auto-best/src/lib/components/company/AboutTeam.svelte',s=>s.replace('>Екипът<','>Свържете се с нас<').replace('Демо профил: ','').replace("const socialIcons = ['facebook', 'twitter', 'linkedin', 'instagram'] as const;","const socialIcons: ('facebook' | 'twitter' | 'linkedin' | 'instagram')[] = [];"));
await edit('auto-best/src/lib/components/company/AboutPartners.svelte',s=>s.replace('Партньори','Автомобилни марки'));
await edit('carwow/src/lib/data/daynight-team.ts',s=>s.replace(/export const daynightTeam: DayNightTeamMember\[\] = \[[\s\S]*?\n\];/,`export const daynightTeam: DayNightTeamMember[] = ${JSON.stringify(['prodazhbi-showroom','barter-i-ocenka','dokumenti-finansirane','klientski-zapitvania'].map((slug,i)=>({slug,name:'LEGEND AUTO',role:['Продажба на автомобили','Въпрос за автомобил','Условия за покупка','Уговорете оглед'][i],phone:f.phone,email:'',image:stock[i].images[0],bio:'Автокъща във Варна. За информация се обадете на 0899 877 305.',detail:`${f.address}, ${f.city}. ${f.hours}. Потвърдете наличността преди посещение.`})),null,2)};`));
// No invented ratings or testimonial quotes.
await edit('carwow/src/lib/components/detail/desktop/desktop-detail-reviews-data.ts',s=>s.slice(0,s.indexOf('export const desktopDetailStarIndexes'))+`export const desktopDetailStarIndexes: number[] = [];\nexport const desktopDetailRatingRows: {id: string; label: string; percent: string}[] = [];\nexport const desktopDetailReviews: DesktopDetailReview[] = [];\n`);
for(const file of await files(`${root}/carwow/src/lib/components`))if(file.endsWith('.svelte')&&!/Icon|icons/.test(file)){let s=await fs.readFile(file,'utf8');s=s.replaceAll('<span class="rating-box__score">4.8</span>','<span class="rating-box__score">—</span>').replaceAll('Отзивите се потвърждават от екипа преди публикуване.','Демонстрационна форма. Публикуване на отзиви не е свързано.').replace(/const stars = \[1, 2, 3, 4, 5\](?: as const)?;/,'const stars: number[] = [];');await fs.writeFile(file,s);}
// Preserve unsupported service routes, but make their status explicit before the content.
const notice='Демонстрационна страница. LEGEND AUTO не е потвърдил тази услуга. За реални условия се обадете на 0899 877 305. Формите не изпращат съобщение до автокъщата.';
await edit('carwow/src/routes/+layout.svelte',s=>s.replace('{@render children()}',`{#if /^\\/(financing|calculator|sell-your-car|services|reviews|team)/.test(page.url.pathname)}<p role="note" class="client-service-note">${notice}</p>{/if}\n{@render children()}\n<style>.client-service-note { margin: 0; padding: 12px 24px; background: #fff4e5; color: #573700; font-size: 14px; }</style>`));
for(const route of ['imports','sell','lease'])await edit(`modern/apps/web/app/[locale]/${route}/page.tsx`,s=>s.replace(/(<main\b[^>]*>)/,`$1\n<p role="note" className="px-6 py-3 text-sm">${notice}</p>`));
// Shared media is local; overwrite only known copied dealer image aliases.
for(const name of ['lead-logo.png'])await fs.copyFile(`${root}/assets/logo-original.png`,`${root}/modern/apps/web/public/${name}`);
await fs.copyFile(`${root}/assets/vehicle-01-1.webp`,`${root}/modern/apps/web/public/lead-hero.jpg`);
await edit('auto-best/src/app.css',s=>s.replace(/(--dn-red:\s*)#[a-fA-F0-9]+/,`$1${f.accent}`));
// Inventory every Auto Best public asset and preserve its exact guard, updated to this skin.
const refs=new Set();for(const file of await files(`${root}/auto-best/src`)){if(!/\.(css|html|js|svelte|ts)$/.test(file))continue;const s=await fs.readFile(file,'utf8');for(const m of s.matchAll(/\/(?:assets\/[A-Za-z0-9._@%+~/-]+\.(?:avif|eot|gif|ico|jpe?g|mp4|png|svg|ttf|webm|webp|woff2?)|favicon\.ico)/gi))refs.add(m[0]);}
const removed=[];for(const file of await files(`${root}/auto-best/static`)){const rel='/'+path.relative(`${root}/auto-best/static`,file).replaceAll('\\','/');if(!refs.has(rel)){removed.push(rel);await fs.unlink(file);}}
await edit('auto-best/scripts/check-assets.mjs',s=>s.replace(/const guardedMediaCount = \d+;/,`const guardedMediaCount = ${refs.size};`));
await write('asset-inventory.json',JSON.stringify({autoBestReferenced:[...refs],removedUnusedCopiedMedia:removed},null,2));console.log(`Content pass finished. Auto Best exact media guard: ${refs.size} referenced assets.`);
