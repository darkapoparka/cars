import fs from 'node:fs/promises';import path from 'node:path';
const root=import.meta.dirname,f=JSON.parse(await fs.readFile(`${root}/business-facts.json`));
async function walk(dir){let out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink()||['node_modules','.next','.svelte-kit','.git'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p);}return out;}
async function edit(p,fn){const s=await fs.readFile(`${root}/${p}`,'utf8');await fs.writeFile(`${root}/${p}`,fn(s));}
for(const file of await walk(`${root}/carwow/src`)){if(!/\.(svelte|ts)$/.test(file))continue;let s=await fs.readFile(file,'utf8');
s=s.replace(/const (stars|starIndexes) = \[[\d, ]+\] as const;/g,'const $1: number[] = [];');
s=s.replaceAll('Понеделник–петък: 9:00–18:00','Понеделник–събота: 09:00–17:30').replaceAll('Понеделник–петък 9:00 – 18:00','Понеделник–събота 09:00–17:30').replaceAll('Огледи през уикенда с уговорка','Неделя: почивен ден').replaceAll('Делнични дни: 9:00 - 18:00 · Неделя: по уговорка','Понеделник–събота: 09:00–17:30 · Неделя: почивен ден');
s=s.replaceAll('в Варна','във Варна').replaceAll('Оценка, замяна или директно изкупуване на автомобил.','Разгледайте предложенията и потвърдете наличността.').replaceAll("title: 'Бартер'","title: 'Налични автомобили'").replaceAll('Съдействие при договор, регистрация и предаване.','Обсъдете документите за конкретния автомобил.').replaceAll('Съдействаме с регистрацията, документите и вариантите за финансиране на избрания автомобил.','За документите и условията за покупка се свържете с автокъщата.');
s=s.replace(/const demoNames = \[[^\]]+\];/,"const demoNames = ['LEGEND AUTO', 'LEGEND AUTO', 'LEGEND AUTO', 'LEGEND AUTO'];").replace(/const teamLabels = \[[^\]]+\];/,"const teamLabels = ['Автомобили', 'Оглед', 'Условия за покупка', 'Контакт'];");
// Do not render social-brand links to unrelated channels or disguise contact links as social channels.
s=s.replace(/<a\b[^>]*(?:href="https:\/\/legendauto1\.mobile\.bg\/contacts"[^>]*(?:Facebook|Instagram)|(?:Facebook|Instagram)[^>]*href="https:\/\/legendauto1\.mobile\.bg\/contacts")[^>]*>[\s\S]*?<\/a>/g,'');
if(file.endsWith('daynight-current-inventory.ts'))s=s.replaceAll('\u00a0',' ');
await fs.writeFile(file,s);
}
await edit('carwow/src/lib/data/daynight-faq.ts',s=>s.replace(/text: 'Изберете автомобил от наличността[^']+'/g,"text: 'Изберете автомобил и се обадете на 0899 877 305 за наличност, оглед и конкретните условия за покупка.'").replace(/text: 'Условията зависят[^']+'/g,"text: 'Не са потвърдени общи условия за финансиране, бартер или гаранции. Обадете се на LEGEND AUTO за конкретния автомобил. Транспорт в страната е посочен в обявите.'"));
await edit('carwow/src/lib/styles/tokens.css',s=>s.replace('--sa-red: #d71920;',`--sa-red: ${f.accent};`));
for(const file of await walk(`${root}/modern/apps/web/app`)){if(!file.endsWith('.tsx')||file.includes('.test.'))continue;let s=await fs.readFile(file,'utf8');
s=s.replaceAll('Премиум автомобили. Внос. Лизинг.','Автомобили. Огледи. Варна.').replaceAll('Premium vehicles. Imports. Leasing.','Vehicles. Viewings. Varna.').replaceAll('In-house leasing','Purchase enquiries').replaceAll('in-house leasing','purchase enquiries').replaceAll('Един телефон за автомобил, внос или финансиране. Шоурум в бул. Цар Освободител 289.','За автомобил и оглед: 0899 877 305. Варна, бул. Цар Освободител 289, срещу МАКАО.').replaceAll('One phone number for vehicles, imports, or finance. Showroom in Tsar Osvoboditel 289.','Call 0899 877 305 about vehicles and viewings. Tsar Osvoboditel 289, Varna, opposite Macau.').replaceAll('Нощен автомобилен шоурум','Автомобил от обявите на LEGEND AUTO').replaceAll('Night-time automotive showroom','Vehicle advertised by LEGEND AUTO');
await fs.writeFile(file,s);
}
console.log('Corrected contact hours, omitted ratings, removed unverified social controls, normalized inventory number spacing.');
