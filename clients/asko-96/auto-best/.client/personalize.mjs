import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const facts=JSON.parse(fs.readFileSync('../business-facts.json','utf8'));
const stock=JSON.parse(fs.readFileSync('../stock.json','utf8'));
const read=p=>fs.readFileSync(p,'utf8');const write=(p,s)=>fs.writeFileSync(p,s);const edit=(p,fn)=>write(p,fn(read(p)));
const dest='static/assets/asko96';fs.mkdirSync(dest,{recursive:true});
for(const file of fs.readdirSync('../assets')) if(/\.(png|jpg|webp)$/.test(file))fs.copyFileSync('../assets/'+file,dest+'/'+file);
write('src/lib/config/brand.ts',`const name = 'АСКО 96';\nconst shortName = 'АСКО 96';\nconst city = 'София';\nconst addressLine = 'бул. „Ботевградско шосе“ 300';\nexport const brand = { name, shortName, city, addressLine, address: \`\${addressLine}, \${city}\`, youtubeUrl: '${facts.youtube}', facebookUrl: '${facts.facebook}', phone: '${facts.phoneDisplay}', phoneHref: '${facts.phoneHref}', email: '${facts.email}', appointment: '${facts.hours.join(' · ')}', logo: '/assets/asko96/asko96-logo.png', darkLogo: '/assets/asko96/asko96-wordmark.png', mapsUrl: '${facts.mapsUrl}', mapsEmbedUrl: '${facts.mapsEmbedUrl}' } as const;\n`);
edit('src/lib/data/inventory.ts',s=>s.slice(0,s.indexOf('// Equipment facets'))+'// Source-backed ASKO96 advert snapshot, 2026-09-06. Availability requires confirmation.\nexport const featuredVehicles: Vehicle[] = '+JSON.stringify(stock.map((v,i)=>({id:i+1,image:v.images[0],category:({SUV:'SUV',Hatchback:'Хечбек',Sedan:'Седан',Wagon:'Комби',Coupe:'Купе'})[v.body]||v.body,body:v.body,make:v.make,title:v.title,year:String(v.year),yearNumber:v.year,mileage:new Intl.NumberFormat('bg-BG').format(v.mileageKm)+' км',mileageKm:v.mileageKm,fuel:v.fuel,transmission:v.transmission,equipment:[...(/360/.test(v.fullTitle)?['360° камера']:[]),...(/PANO/.test(v.fullTitle)?['Панорамен покрив']:[]),...(/ПОДГРЕВ/.test(v.fullTitle)?['Подгряване на седалки']:[]),...(/KEYLESS/.test(v.fullTitle)?['Безключов достъп']:[])],condition:'used',priceEur:v.priceEur,href:'/listing-detail-v1/'+(i+1)})),null,2)+';\nexport const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat(\'bg-BG\').format(priceEur)} €`;\n');
const changes={
'/assets/images/lead/day-night-guide-inspection.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-guide-import.webp':'/assets/asko96/vehicle-03-1.webp',
'/assets/images/lead/day-night-guide-leasing.webp':'/assets/asko96/vehicle-04-1.webp',
'/assets/images/lead/day-night-stock-01.webp':'/assets/asko96/vehicle-01-1.webp',
'/assets/images/lead/day-night-stock-03.webp':'/assets/asko96/vehicle-03-1.webp',
'/assets/images/lead/day-night-stock-06.webp':'/assets/asko96/vehicle-06-1.webp',
'/assets/images/lead/day-night-about-kristian-v1-light.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-contact-kristian-phone-v1-light.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-about-showroom-v1-light.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-showroom-color-v1.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-portrait-color-v1.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-contact-phone-red-v1.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/lead/day-night-editorial-banner-v2.webp':'/assets/asko96/asko96-showroom.jpg',
'/assets/images/section/bg-12.jpg':'/assets/asko96/asko96-showroom.jpg'};
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
for(const file of walk('src'))if(/\.(ts|svelte|html|css)$/.test(file))edit(file,s=>{for(const [a,b] of Object.entries(changes))s=s.replaceAll(a,b);return s.replaceAll('Студентски град','Ботевградско шосе 300').replaceAll('Избрани автомобилни видеа с Кристиан Кирилов.','Автомобилни видеа от официалния канал на АСКО 96.').replace(/\s*\{ name: 'instagram', label: 'Instagram', href: brand.instagramUrl \},/g,'').replace(/\s*<a \{\.\.\.\{ href: brand.instagramUrl \}\}[^\n]+\n/g,'\n');});
edit('src/lib/components/company/ShowroomMap.svelte',s=>s.replace("  import { showroomCoordinates } from '$data/company';",'').replace(/const mapEmbedUrl = .*;/,'const mapEmbedUrl = brand.mapsEmbedUrl;').replace(/const directionsUrl = .*;/,'const directionsUrl = brand.mapsUrl;'));
edit('src/lib/data/company.ts',s=>s.replace(/export const showroomCoordinates = \{[\s\S]*?\} as const;/,''));
edit('src/lib/components/layout/Header.svelte',s=>s.replace('src={brand.logo} alt={brand.name} width="220"','src={homeOverlayHeader ? brand.darkLogo : brand.logo} alt={brand.name} width="220"'));
edit('src/lib/components/layout/Footer.svelte',s=>s.replace('src={brand.logo}','src={brand.darkLogo}'));
edit('src/app.html',s=>s.replace('/favicon.ico','/assets/asko96/asko96-logo.png'));
edit('src/lib/data/listing.ts',s=>s.replace("makes: ['', 'Mercedes-Benz', 'Audi', 'BMW', 'Land Rover']","makes: ['', ...new Set(featuredVehicles.map((vehicle) => vehicle.make))]").replace("bodies: ['', 'SUV', 'Coupe', 'Wagon', 'Sportback']","bodies: ['', ...new Set(featuredVehicles.map((vehicle) => vehicle.body))]").replace("fuels: ['', 'Дизел', 'Бензин']","fuels: ['', 'Дизел', 'Бензин', 'Хибрид']").replace("years: ['', '2019', '2020', '2021', '2022', '2023', '2024']","years: ['', ...new Set(featuredVehicles.map((vehicle) => vehicle.year))]").replace("prices: ['', '50000', '55000', '60000', '70000', '80000', '90000', '100000']","prices: ['', '10000', '15000', '20000', '30000', '40000', '50000']").replace("mileages: ['', '50000', '75000', '100000']","mileages: ['', '50000', '100000', '150000', '200000', '250000']"));
edit('src/lib/components/home/MobileBudget.svelte',s=>s.replaceAll('60 000','20 000').replaceAll('60–70 000','20–30 000').replaceAll('70 000','30 000').replaceAll('60000','20000').replaceAll('70000','30000'));
// Retain the source card arrangement while using real business services, not invented staff.
write('src/lib/data/demo-content.ts',`export const demoContentLabel = 'АСКО 96';\nexport const demoTeamIntro = 'Продажба, замяна, внос и собствен лизинг. Уточнете условията с екипа.';\nexport const demoPartnerIntro = 'Марки в подбраните обяви. Наличността се потвърждава по телефона.';\nexport const demoTeamMembers = ${JSON.stringify([{id:'stock',name:'Продажба на автомобили',role:'Разгледайте селекцията',image:'/assets/asko96/vehicle-01-1.webp'},{id:'trade',name:'Замяна и изкупуване',role:'Оценка на вашия автомобил',image:'/assets/asko96/vehicle-02-1.webp'},{id:'import',name:'Внос по поръчка',role:'Автомобил по вашите критерии',image:'/assets/asko96/vehicle-03-1.webp'},{id:'lease',name:'Собствен лизинг',role:'Индивидуални условия',image:'/assets/asko96/vehicle-04-1.webp'}],null,2)};\nexport const demoPartners = ${JSON.stringify([{id:'toyota',name:'Toyota',image:'/assets/images/partner/partner3.png'},{id:'mercedes',name:'Mercedes-Benz',image:'/assets/images/partner/parner8.png'},{id:'audi',name:'Audi',image:'/assets/images/partner/parner11.png'},{id:'bmw',name:'BMW',image:'/assets/images/partner/parner12.png'}],null,2)};\n`);
edit('src/lib/components/company/AboutTeam.svelte',s=>s.replace('>Екипът<','>С какво съдействаме<').replace('alt={`Демо профил: ${member.name}`}','alt={member.name}'));
edit('src/lib/components/company/AboutPartners.svelte',s=>s.replace('>Партньори<','>Марки в селекцията<').replace('Демо партньорски лога','Автомобилни марки').replace('alt={`Демо лого: ${partner.name}`}','alt={partner.name}'));
edit('src/lib/data/editorial.ts',s=>s.replace(/\/assets\/images\/blog\/blog-(\d+)\.jpg/g,(_,n)=>'/assets/asko96/vehicle-'+String(Number(n)+1).padStart(2,'0')+'-1.webp'));
// Existing semantic color boundaries; distinguish accent fills from readable accent text.
for(const file of walk('src'))if(/\.(svelte|css)$/.test(file))edit(file,s=>s.replace(/([^{}]+)\{([^{}]+)\}/g,(whole,sel,body)=>{if(/background(?:-color)?:\s*var\(--dn-red(?:-hover)?\)/.test(body))body=body.replace(/color:\s*(?:#fff(?:fff)?|white);/g,'color: var(--dn-accent-ink);');body=body.replace(/(?<![-\w])color:\s*var\(--dn-red\)/g,'color: var(--dn-accent-text)');return sel+'{'+body+'}';}));
edit('src/app.css',s=>s.replace('--dn-red: #c40101;','--dn-red: #d7ae35;\n  --dn-accent-ink: #14171d;\n  --dn-accent-text: #8b6811;').replace('--dn-red-hover: #a90000;','--dn-red-hover: #c69a22;'));
console.log('Personalized identity, stock, copy, and gold semantic colors.');
