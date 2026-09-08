import fs from 'node:fs/promises';import path from 'node:path';
const root=import.meta.dirname;async function walk(dir){let files=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
for(const file of await walk(`${root}/carwow/src`)){if(!/\.(svelte|ts)$/.test(file))continue;let s=await fs.readFile(file,'utf8');s=s.replaceAll('Финансиране · бартер · съдействие с документите','Автомобили · огледи · транспорт в страната').replaceAll('Лизинг и замяна','Условия за покупка').replaceAll('уговориш оглед и да обсъдиш продажба или бартер на твоя автомобил.','уговориш оглед и да уточниш характеристиките на избрания автомобил.').replaceAll('Примерни профили за демонстрация','Телефон за наличност и оглед: 0899 877 305').replaceAll('Екипът зад твоя избор','Контакт с автокъщата').replaceAll('Демо портрет: ','Автомобили от ');
s=s.replaceAll('/assets/images/home-promos/phone-portrait-generated-v7.webp','/assets/legend-auto/vehicle-03-1.webp');
s=s.replace("value: '4',\n\t\t\tlabel: 'директни канала за контакт'","value: '1',\n\t\t\tlabel: 'телефон за контакт'");
if(file.endsWith('DayNightFooter.svelte'))s=s.replace(/<a\b[^>]*\{\.\.\.(?:facebook|instagram)LinkProps\}[^>]*>[\s\S]*?<\/a>/g,'');
if(file.endsWith('DesktopHomeWhyDayNight.svelte'))s=s.replaceAll("href: '/financing'","href: '/contact'").replaceAll("resolve('/financing')","resolve('/contact')");
if(file.includes('/contact/')||file.includes('\\contact\\'))s=s.replace('type LeadSubmitState',"// Contact forms are local demonstrations; use the verified telephone for a real enquiry.\n\ttype LeadSubmitState");
await fs.writeFile(file,s);}
console.log('Carwow contact and homepage claims finalized.');
