import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { applyCarwowSafeContent, applyImportSafeContent, personalizeImportOfferCopy, personalizeModernSellCopy, personalizeModernMobileSellCopy, applyModernSafeContent } from './lib/client-refresh-safe-content.mjs';
import { runInNewContext } from 'node:vm';
import { readTypeScriptCatalog } from './lib/catalog-literal.mjs';
import {readRegisteredPersonalization,originalListingIdRecorded} from './lib/client-refresh-normalize.mjs';
import {tinyArea,writeFixture} from './test-fixtures/fleet-single-worker.mjs';

const profile = (countryCode) => ({
  business: {
    countryCode,
    shortName: 'Fixture Auto',
    name: 'Fixture Auto',
    phoneDisplay: '+359 88 000 0000',
    email: 'fixture@example.com',
    observedAt: '2026-09-21',
    city: 'Sofia',
    address: 'Fixture Street 1',
    inventoryNotice: 'Confirm current inventory.',
    previewNotice: 'Independent demonstration.'
  }
});

for (const countryCode of ['BG', 'AE']) {
  test('Carwow safe review copy is catalog-backed for ' + countryCode, () => {
    const candidate = fs.mkdtempSync(path.join(os.tmpdir(), 'cars-safe-copy-'));
    applyCarwowSafeContent({ candidate, profile: profile(countryCode), logo: '/dealer-brand/logo.webp' });
    const generated = fs.readFileSync(path.join(candidate, 'src/lib/data/daynight-reviews.ts'), 'utf8');
    assert.match(generated, /Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения./);
    assert.doesNotMatch(generated, /No verified customer reviews are included in this independent preview/);
    assert.doesNotMatch(generated, /В този независим преглед не са включени потвърдени клиентски отзиви/);
  });
}

test('ordinary profile reads require no registered overlay and unsafe overlay paths fail closed',t=>{
 const root=tinyArea(t);writeFixture(path.join(root,'business-facts.json'),{business:{name:'Original',unknown:null}});
 assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained'});assert.equal(readRegisteredPersonalization(root,'retained'),null);
 writeFixture(path.join(root,'dealer.json'),{slug:'retained',registeredSourceAdoption:{receipt:{path:'../outside.json',sha256:'1'.repeat(64)},personalization:{path:'.client/registered-personalization.json',sha256:'2'.repeat(64)}}});
 assert.throws(()=>readRegisteredPersonalization(root,'retained'),/exact bounded path\/hash/);
 assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root,'business-facts.json'))),{business:{name:'Original',unknown:null}});
});
test('listing provenance requires the exact recorded ID field, never a substring in copy',()=>{
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12345","description":"123"}'),'123'),false);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"123"}'),'123'),true);
 assert.equal(originalListingIdRecorded(Buffer.from("{sourceId: '12.3'}"),'12.3'),true);
 assert.equal(originalListingIdRecorded(Buffer.from('{"id":"12x3"}'),'12.3'),false);
});

const homeFixture = `export type HomeFiveReview = {avatar:string;name:string;role:string;roleKind?:string;rating?:number;excerpt?:string;text:string};
export const unchangedBefore = 'native composition';
export const homeFiveReviewItems: HomeFiveReview[] = [
 {avatar:'/customer.webp',name:'Aleksandar Vytev',role:'Клиент на Day Night Auto',rating:5,text:'Actual purchase claim'},
 {avatar:'/customer2.webp',name:'Krasimir Georgiev',role:'Import customer',rating:4,text:'Actual delivery claim'},
 {avatar:'/customer3.webp',name:'Iliyan Petrov',role:'Sale customer',rating:5,text:'Actual sale claim'}
];
export const unchangedAfter = {palette:'native',layout:'three-card rail'};
`;
function importEditorialFixture(t) {
 const candidate=tinyArea(t);
 writeFixture(path.join(candidate,'src/lib/data/about-videos.ts'),"export type AboutVideo = { id:string;title:string };\nexport const youtubeChannelHref = 'https://www.youtube.com/@kristiankirilov1355/videos';\nexport const aboutVideos: AboutVideo[] = [{id:'6S3dLIgeAT8',title:'Lamborghini Urus'}];\n");
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture);
 writeFixture(path.join(candidate,'src/lib/content/extra-localized.ts'),"export const extraEnglish = {'Запазен текст':'Retained text'} as const;\n");
 // These are the selected S1 consumers' existing bindings and gates.
 const consumer="import {aboutVideos,youtubeChannelHref} from '$lib/data/about-videos';\n<YouTubeSection videos={aboutVideos} channelHref={youtubeChannelHref} />\n";
 writeFixture(path.join(candidate,'src/lib/components/home/HomePage.svelte'),consumer);
 writeFixture(path.join(candidate,'src/lib/components/home/HomeMobileEditorial.svelte'),consumer);
 return {candidate,consumer};
}
for (const countryCode of ['BG','AE']) {
 test('Import new native video/review consumers receive truthful localized examples for '+countryCode,t=>{
  const {candidate,consumer}=importEditorialFixture(t),dealer=profile(countryCode);
  const changed=applyImportSafeContent({candidate,profile:dealer});
  const videos=fs.readFileSync(path.join(candidate,'src/lib/data/about-videos.ts'),'utf8');
  assert.match(videos,/export type AboutVideo/);assert.match(videos,/youtubeChannelHref = "";/);
  assert.deepEqual(readTypeScriptCatalog(videos,'aboutVideos'),[]);
  assert.doesNotMatch(videos,/kristiankirilov|Lamborghini|6S3dLIgeAT8/);
  for(const page of ['HomePage','HomeMobileEditorial']) assert.equal(fs.readFileSync(path.join(candidate,'src/lib/components/home',page+'.svelte'),'utf8'),consumer);
  const home=fs.readFileSync(path.join(candidate,'src/lib/auxero/home-five.ts'),'utf8'),items=readTypeScriptCatalog(home,'homeFiveReviewItems');
  assert.equal(items.length,3);assert.deepEqual(items.map(r=>r.name),['№ 1','№ 2','№ 3']);
  assert.match(home,/unchangedBefore = 'native composition'/);assert.match(home,/unchangedAfter = \{palette:'native',layout:'three-card rail'\}/);
  assert.doesNotMatch(home,/Aleksandar|Krasimir|Iliyan|customer\.webp|purchase claim|delivery claim|sale claim|Day Night Auto/);
  const en=readTypeScriptCatalog(fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8'),'extraEnglish');
  assert.equal(en['Запазен текст'],'Retained text');
  for(const item of items){
   assert.equal(item.avatar,'');assert(!Object.hasOwn(item,'rating'));assert.match(item.text,/Измислен пример/);
   for(const field of ['role','excerpt','text']){assert.match(item[field],/[\u0400-\u04ff]/);assert.equal(typeof en[item[field]],'string');assert.doesNotMatch(en[item[field]],/[\u0400-\u04ff]/);}
   assert.match(en[item.text],/Fictional example/);assert.match(en[item.excerpt],/not a verified customer review/);
  }
  for(const name of ['src/lib/data/about-videos.ts','src/lib/auxero/home-five.ts','src/lib/content/extra-localized.ts'])assert(changed.includes(name));
  const first=[videos,home,fs.readFileSync(path.join(candidate,'src/lib/content/extra-localized.ts'),'utf8')];
  applyImportSafeContent({candidate,profile:dealer});
  assert.deepEqual(first,['src/lib/data/about-videos.ts','src/lib/auxero/home-five.ts','src/lib/content/extra-localized.ts'].map(name=>fs.readFileSync(path.join(candidate,name),'utf8')));
 });
}
test('Import new video boundary binds only an explicitly sourced dealer channel',t=>{
 const {candidate}=importEditorialFixture(t),dealer=profile('BG');dealer.business.socialLinks={youtube:'https://www.youtube.com/@verified-fixture'};
 applyImportSafeContent({candidate,profile:dealer});
 const videos=fs.readFileSync(path.join(candidate,'src/lib/data/about-videos.ts'),'utf8');
 assert.match(videos,/youtubeChannelHref = "https:\/\/www.youtube.com\/@verified-fixture";/);
 assert.deepEqual(readTypeScriptCatalog(videos,'aboutVideos'),[]);
});
test('Import review boundary fails closed when native source or its locale catalog changes',t=>{
 const {candidate}=importEditorialFixture(t);
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture.replace('homeFiveReviewItems','renamedUnreviewedItems'));
 assert.throws(()=>applyImportSafeContent({candidate,profile:profile('BG')}),/review export was not found exactly once/);
 writeFixture(path.join(candidate,'src/lib/auxero/home-five.ts'),homeFixture);
 writeFixture(path.join(candidate,'src/lib/content/extra-localized.ts'),"export const extraEnglish = {generated:computeTranslation()} as const;\n");
 assert.throws(()=>applyImportSafeContent({candidate,profile:profile('BG')}),/expected literal data/);
});

const offerFixture = `<script lang="ts">
 const retainedAction = '/admin/inventory';
 const stats = [
	{ value: '42', label: 'реални автомобила в каталога' },
	{ value: '18+', label: 'готови потребителски страници' }
	];
 const deliveredFeatures = [
	{ title: 'Каталог с реални автомобили', text: 'retained native card' }
	];
 const roadmap = [
	{ text: 'Работеща потребителска част, реални обяви, детайлни страници, сравнение, любими, услуги и контакт.' }
	];
 const stack = [
	{ value: 'Auxero template fidelity + Приселци визуална адаптация' }
	];
</script>
<svelte:head><title>Оферта за Приселци</title><meta content="Клиентска оферта за новия Приселци сайт: реален каталог, админ панел, услуги, SEO, технологии и следващи стъпки." /></svelte:head>
<header aria-label="Приселци offer header"><a aria-label="Приселци home" href="/same-action"><img alt="Приселци" /></a><a aria-label="Отвори Приселци сайта">Open</a></header>
<p>Предложение за Приселци</p><h1>Новият сайт не е идея. Той вече работи.</h1>
<p>Изградих реална версия на Приселци върху Auxero визуалната база: каталог с истински
автомобили, страници за услуги, админ зона, сравнение, любими, блог, SEO и ясна пътна
карта към production.</p>
<strong>SvelteKit + Auxero + Приселци data</strong><h2>Не е generic landing page. Това е Приселци продукт.</h2>
<p>Фокусът е практичен: клиентът намира автомобил, разбира услугата, праща запитване,
сравнява, запазва и Приселци може да управлява съдържанието.</p>
<h2>Ако Приселци иска, това може да стане официалният сайт.</h2>
<style>.native-card{color:#fff;gap:42px}</style>
`;
const offerCopy = (source, locale) => {
 const body=source.match(/\/\/ CARS_IMPORT_OFFER_COPY_START([\s\S]*?)\/\/ CARS_IMPORT_OFFER_COPY_END/)[1];
 return runInNewContext(body+';offerCopy',{page:{data:{locale}},$derived:value=>value});
};
test('Import offer uses the authenticated dated count and quote-safe identity in both native locales',()=>{
 const dealer=profile('BG');dealer.business.shortName='Fixture "Auto" </script> $$';dealer.business.latinName='Fixture Auto';
 dealer.listings=Array.from({length:16},(_,i)=>({id:String(i),sourceUrl:'https://official.example/listing/'+i,observedAt:'2026-09-07'}));
 for(const input of [offerFixture,offerFixture.replaceAll('\n','\r\n')]){
  const output=personalizeImportOfferCopy(input,dealer),bg=offerCopy(output,'bg'),en=offerCopy(output,'en');
  assert.equal(bg.count,'16');assert.equal(en.count,'16');assert.match(bg.inventoryLabel,/датирана извадка/);assert.match(en.inventoryLabel,/dated snapshot/);
  assert.match(bg.heroLead,/2026-09-07/);assert.match(en.heroLead,/2026-09-07/);assert.match(en.heroLead,/direct confirmation/);
  assert.match(bg.heroLead,/не изпращат запитвания/);assert.match(en.heroLead,/do not send enquiries/);
  assert.equal(bg.name,dealer.business.shortName);assert.equal(en.name,'Fixture Auto');
  assert.doesNotMatch(output,/реални автомобила в каталога|Каталог с реални автомобили|реални обяви|каталог с истински|value: '42'|Приселци/);
  assert.equal(output.split('</script>').length,2);assert.match(output,/\\u003c\/script>/);
  assert.equal(output.slice(output.indexOf('<style>')),input.slice(input.indexOf('<style>')));
  assert.match(output,/href="\/same-action"/);assert.match(output,/text: 'retained native card'/);assert.match(output,/value: '18\+'/);
  for(const array of ['stats','deliveredFeatures','roadmap','stack'])assert(output.includes('const '+array+' = $derived(['));
  assert.match(output,/import \{ page \} from '\$app\/state'/);assert.match(output,/page.data.locale === 'en'/);
  assert.equal(personalizeImportOfferCopy(output,dealer),output);
 }
});
test('Import offer demo or unknown provenance cannot become a dated or current stock claim',()=>{
 const dealer=profile('AE');dealer.stockKind='illustrative-not-dealer-stock';dealer.listings=[{id:'demo',sourceUrl:'',observedAt:''}];
 const output=personalizeImportOfferCopy(offerFixture,dealer);
 for(const locale of ['bg','en']){
  const copy=offerCopy(output,locale);assert.equal(copy.count,'1');
  assert.doesNotMatch(copy.heroLead,/2026-|dated listings|датирани обяви/);
 }
 assert.match(offerCopy(output,'bg').heroLead,/илюстративни обяви/);assert.match(offerCopy(output,'en').heroLead,/do not confirm dealer inventory or availability/);
 for(const explicitMode of ['pack','every-row']){
  dealer.stockKind=explicitMode==='pack'?'illustrative-not-dealer-stock':'';
  dealer.listings=[{id:'dated-demo',sourceUrl:'https://official.example/original-photo-source',observedAt:'2026-09-07',availability:explicitMode==='every-row'?'illustrative-not-dealer-stock':'unknown'}];
  const datedDemo=personalizeImportOfferCopy(offerFixture,dealer);
  for(const locale of ['bg','en']){
   const copy=offerCopy(datedDemo,locale);assert.equal(copy.count,'1');
   assert.doesNotMatch(JSON.stringify(copy),/2026-09-07|dated snapshot|датирана извадка/);
  }
  assert.equal(offerCopy(datedDemo,'en').catalogTitle,'Demonstration catalogue');
  assert.match(offerCopy(datedDemo,'bg').description,/илюстративни обяви/);
 }
 dealer.stockKind='';dealer.listings=[{id:'source',sourceUrl:'https://official.example/listing',observedAt:'2026-09-07'},{id:'demo',sourceUrl:'https://official.example/photo',observedAt:'2026-09-07',availability:'illustrative-not-dealer-stock'}];
 const mixed=offerCopy(personalizeImportOfferCopy(offerFixture,dealer),'en');
 assert.equal(mixed.inventoryLabel,'listings in this preview');assert.equal(mixed.catalogTitle,'Preview catalogue');assert.match(mixed.description,/availability is unconfirmed/);assert.doesNotMatch(mixed.heroLead,/2026-09-07|illustrative|dated/);
 dealer.stockKind='illustrative-not-dealer-stock';
 dealer.listings=[];assert.equal(offerCopy(personalizeImportOfferCopy(offerFixture,dealer),'en').count,'0');
 dealer.stockKind='';dealer.listings=[{id:'unknown',sourceUrl:'https://official.example/listing',observedAt:'2026-02-30'}];
 const unknown=offerCopy(personalizeImportOfferCopy(offerFixture,dealer),'en');
 assert.equal(unknown.inventoryLabel,'listings in this preview');assert.doesNotMatch(unknown.heroLead,/illustrative|2026-02-30|dated/);
 assert.equal(unknown.catalogTitle,'Preview catalogue');
});
test('Import offer rejects unknown or duplicated copy shape without inventing profile facts',()=>{
 const dealer=profile('BG');dealer.listings=[];
 assert.throws(()=>personalizeImportOfferCopy(offerFixture.replace('реални автомобила в каталога','custom unreviewed count'),dealer),/copy shape changed/);
 assert.throws(()=>personalizeImportOfferCopy(offerFixture.replace('<title>','<title>Unknown</title><title>'),dealer),/identity boundary changed/);
 assert.throws(()=>personalizeImportOfferCopy(offerFixture,{business:dealer.business}),/normalized listing pack/);
});

const modernSellFixture = "import {nativePalette} from './native';\nconst pageCopy = {\n  bg: {\n    categoryLabel: \"Категория\",\n    contactPrompt: \"Предпочитате директен разговор?\",\n    detailsHint: \"по желание\",\n    detailsLabel: \"Екстри и бележки\",\n    detailsPlaceholder:\n      \"Състояние, сервизна история, екстри или нещо важно за автомобила.\",\n    description:\n      \"Дайте ни основните данни за автомобила. Екипът ни ще се свърже с вас за оглед и конкретна оферта.\",\n    faqTitle: \"Как протича оценката\",\n    faqs: [\n      {\n        answer:\n          \"Не. Можете да предложите автомобила за директно изкупуване, без да купувате друг.\",\n        question: \"Задължителен ли е бартерът?\",\n      },\n      {\n        answer:\n          \"Марка, модел, година и пробег са достатъчни за първоначалния разговор. Подгответе и телефон за връзка.\",\n        question: \"Какви данни са необходими?\",\n      },\n      {\n        answer: `Финалната оценка се прави след оглед на място в шоурума ни в ${leadSite.district.bg}, София.`,\n        question: \"Може ли оценка само по снимки?\",\n      },\n      {\n        answer:\n          \"Регистрационните документи, сервизната история и информацията за ремонти помагат за по-бърза оценка.\",\n        question: \"Какво да подготвя за огледа?\",\n      },\n    ],\n    formDescription:\n      \"Без регистрация. Започнете с основните данни, а ние ще уточним следващата стъпка.\",\n    desktopFormDescription:\n      \"Посочете марка, модел, година и пробег. Добавете екстри и бележки, ако желаете.\",\n    formLabel: \"Заявете оценка на автомобил\",\n    makeLabel: \"Марка\",\n    mileageLabel: \"Пробег\",\n    mileagePlaceholder: \"62 000 км\",\n    modelLabel: \"Модел\",\n    modelPlaceholder: \"напр. Octavia\",\n    primaryAction: \"Продължи\",\n    changeVehicle: \"Променете автомобила\",\n    selectedVehicleLabel: \"Избран автомобил\",\n    title: \"Продайте ни автомобила си\",\n    yearLabel: \"Година\",\n    yearPlaceholder: \"2022\",\n  },\n  en: {\n    categoryLabel: \"Category\",\n    contactPrompt: \"Prefer a direct conversation?\",\n    detailsHint: \"optional\",\n    detailsLabel: \"Extras and notes\",\n    detailsPlaceholder:\n      \"Condition, service history, extras, or anything important about the vehicle.\",\n    description:\n      \"Give us the essentials about your vehicle. Our team will contact you to arrange an inspection and a concrete offer.\",\n    faqTitle: \"How the appraisal works\",\n    faqs: [\n      {\n        answer:\n          \"No. You can offer the vehicle for direct purchase without buying another car.\",\n        question: \"Is a trade-in required?\",\n      },\n      {\n        answer:\n          \"Make, model, year, and mileage are enough for the initial conversation. Please also leave a phone number.\",\n        question: \"What information do you need?\",\n      },\n      {\n        answer: `The final appraisal follows an in-person inspection at our showroom in ${leadSite.district.en}, Sofia.`,\n        question: \"Can you appraise it from photos only?\",\n      },\n      {\n        answer:\n          \"Registration documents, service history, and repair information help us appraise the car faster.\",\n        question: \"What should I prepare?\",\n      },\n    ],\n    formDescription:\n      \"No account required. Start with the essentials and we will agree the next step with you.\",\n    desktopFormDescription:\n      \"Enter the make, model, year and mileage. Add extras and notes if you wish.\",\n    formLabel: \"Request a vehicle appraisal\",\n    makeLabel: \"Make\",\n    mileageLabel: \"Mileage\",\n    mileagePlaceholder: \"62,000 km\",\n    modelLabel: \"Model\",\n    modelPlaceholder: \"e.g. Octavia\",\n    primaryAction: \"Continue\",\n    changeVehicle: \"Change vehicle\",\n    selectedVehicleLabel: \"Selected vehicle\",\n    title: \"Sell us your vehicle\",\n    yearLabel: \"Year\",\n    yearPlaceholder: \"2022\",\n  },\n} as const;\n\nconst retainedStyles='native grid h-11';\nexport function metadata(){\nreturn createPublicLocalizedMetadata({\n    baseUrl: getPublicWebBaseUrl(),\n    description: isBg\n      ? `Предложете автомобила си за изкупуване или бартер на ${leadSite.name}.`\n      : `Offer your vehicle to ${leadSite.name} for purchase or trade-in.`,\n    locale,\n    path: \"/sell\",\n    title: isBg ? \"Продайте ни автомобил\" : \"Sell us your vehicle\",\n  });\n}\n<form action={localize(\"/contact\")} method=\"get\" data-slot=\"sell-vehicle-start-form\"><Input/><button type=\"submit\">{copy.primaryAction}</button></form>\n<MobileSellVehicleExperience contactHref={localize(\"/contact\")} initialDraft={initialDraft}/>";
const modernMobileSellFixture = "export const mobileSellVehicleCategoryOptions = {bg:[],en:[]};\nexport const mobileSellVehicleCopy = {\n  bg: {\n    backToSell: \"Назад към продажбата\",\n    clearTitle: \"Изчистване на данните\",\n    clearConfirm: \"Да изчистим ли въведените данни?\",\n    clearAction: \"Изчисти данните\",\n    keepAction: \"Запази данните\",\n    resetAction: \"Изчисти въведените данни\",\n    modelExample: \"напр. X5\",\n    yearExample: \"напр. 2022\",\n    mileageExample: \"напр. 62 000\",\n    category: \"Категория\",\n    close: \"Затворете\",\n    description: \"Въведете VIN или добавете данни\",\n    directCall: \"Предпочитате разговор?\",\n    formDescription: \"Добавете VIN или марка, модел, година и пробег.\",\n    formTitle: \"Данни\",\n    howDescription: \"Три ясни стъпки от данните до конкретна оферта.\",\n    howEyebrow: \"Продажба на автомобил\",\n    howOpen: \"Как работи?\",\n    howStart: \"Въведете данните\",\n    howSteps: [\n      {\n        description:\n          \"VIN или марка, модел, година и пробег са достатъчни за начало.\",\n        title: \"Подготви данните\",\n      },\n      {\n        description:\n          \"Обади ни се с данните, за да обсъдим удобен час за оглед.\",\n        title: \"Организираме оглед\",\n      },\n      {\n        description:\n          \"След огледа получаваш конкретни условия за изкупуване или бартер.\",\n        title: \"Получаваш оферта\",\n      },\n    ],\n    howTitle: \"Как протича продажбата\",\n    inventory: \"Вижте наличностите\",\n    make: \"Марка\",\n    mileage: \"Пробег\",\n    model: \"Модел\",\n    noVin: \"Нямаш VIN? Въведи данните\",\n    noVinLabel: \"Нямаш VIN?\",\n    openForm: \"Отворете формата за оценка\",\n    submit: \"Преглед преди обаждане\",\n    title: \"Продай автомобил\",\n    vin: \"VIN номер\",\n    vinEntry: \"Въведи VIN номер\",\n    vinOptional: \"VIN номер (по желание)\",\n    year: \"Година\",\n  },\n  en: {\n    backToSell: \"Back to selling\",\n    clearTitle: \"Clear vehicle details\",\n    clearConfirm: \"Clear the details you entered?\",\n    clearAction: \"Clear details\",\n    keepAction: \"Keep details\",\n    resetAction: \"Clear entered details\",\n    modelExample: \"e.g. X5\",\n    yearExample: \"e.g. 2022\",\n    mileageExample: \"e.g. 62,000\",\n    category: \"Category\",\n    close: \"Close\",\n    description: \"Enter a VIN or add vehicle details\",\n    directCall: \"Prefer to speak directly?\",\n    formDescription: \"Add a VIN or the make, model, year and mileage.\",\n    formTitle: \"Details\",\n    howDescription:\n      \"Three clear steps from vehicle details to a concrete offer.\",\n    howEyebrow: \"Sell your vehicle\",\n    howOpen: \"How does it work?\",\n    howStart: \"Enter vehicle details\",\n    howSteps: [\n      {\n        description:\n          \"A VIN or make, model, year and mileage is enough to begin.\",\n        title: \"Prepare the essentials\",\n      },\n      {\n        description:\n          \"Call us with the details to discuss a convenient inspection time.\",\n        title: \"Arrange an inspection\",\n      },\n      {\n        description:\n          \"After inspection you receive concrete purchase or trade-in terms.\",\n        title: \"Receive an offer\",\n      },\n    ],\n    howTitle: \"How selling works\",\n    inventory: \"Browse inventory\",\n    make: \"Make\",\n    mileage: \"Mileage\",\n    model: \"Model\",\n    noVin: \"No VIN? Enter the details\",\n    noVinLabel: \"No VIN?\",\n    openForm: \"Open appraisal form\",\n    submit: \"Review before calling\",\n    title: \"Sell your vehicle\",\n    vin: \"VIN number\",\n    vinEntry: \"Enter VIN number\",\n    vinOptional: \"VIN number (optional)\",\n    year: \"Year\",\n  },\n} as const;\nexport const mobileSellInputClassName = 'h-12 native responsive options';";
const withoutModernCopy = source => source.replace(/(?:export )?const (?:pageCopy|mobileSellVehicleCopy) = [\s\S]*?} as const;/,'<reviewed-copy>').replace(/return createPublicLocalizedMetadata\([\s\S]*?  }\);/,'<reviewed-metadata>');
for(const stockKind of ['illustrative-not-dealer-stock','dated-published-advertisements',undefined]) {
 test('Modern sell EN/BG questions preserve native controls for '+String(stockKind),()=>{
  const p={...profile('BG'),stockKind,listings:[],unknown:{retain:'original'}};
  const desktop=personalizeModernSellCopy(modernSellFixture,p),mobile=personalizeModernMobileSellCopy(modernMobileSellFixture,p);
  assert.equal(withoutModernCopy(desktop),withoutModernCopy(modernSellFixture));assert.equal(withoutModernCopy(mobile),withoutModernCopy(modernMobileSellFixture));
  const copy=readTypeScriptCatalog(desktop,'pageCopy'),small=readTypeScriptCatalog(mobile,'mobileSellVehicleCopy');
  for(const lang of ['bg','en']){assert.equal(copy[lang].faqs.length,4);assert.equal(small[lang].howSteps.length,3);}
  assert.match(copy.bg.desktopFormDescription,/не изпраща заявка и не извършва оценка/);assert.match(copy.en.desktopFormDescription,/does not submit a request or perform an appraisal/);
  assert.match(copy.bg.faqs[0].answer,/не потвърждават/);assert.match(copy.en.faqs[0].answer,/does not confirm/);
  assert.match(small.bg.howSteps[2].description,/не са потвърдени услуги/);assert.match(small.en.howSteps[2].description,/services are unconfirmed/);
  assert.match(small.bg.formDescription,/не изпраща заявка/);assert.match(small.en.formDescription,/does not submit a request/);
  assert.doesNotMatch(desktop,/Финалната оценка се прави|final appraisal follows|Our team will contact you|Продайте ни|Sell us your/);
  assert.doesNotMatch(mobile,/След огледа получаваш|After inspection you receive|Организираме оглед|Receive an offer|Open appraisal form/);
  assert.equal(personalizeModernSellCopy(desktop,p),desktop);assert.equal(personalizeModernMobileSellCopy(mobile,p),mobile);
 });
}
test('Modern sell known factual slots, metadata and contact route fail closed',()=>{
 const p=profile('BG');
 assert.throws(()=>personalizeModernSellCopy(modernSellFixture.replace('Our team will contact you','Our certified assessor will contact you'),p),/unreviewed copy or factual shape/);
 assert.throws(()=>personalizeModernSellCopy(modernSellFixture.replace('path: "/sell"','path: "/unknown-service"'),p),/unreviewed copy or factual shape/);
 assert.throws(()=>personalizeModernSellCopy(modernSellFixture.replace('method="get"','method="post"'),p),/native preview contact route/);
 assert.throws(()=>personalizeModernSellCopy(modernSellFixture+'\n'+modernSellFixture,p),/known copy boundary/);
});
test('Modern mobile unknown promise, identity and duplicate boundary fail closed',()=>{
 assert.throws(()=>personalizeModernMobileSellCopy(modernMobileSellFixture.replace('Receive an offer','Guaranteed appraisal'),profile('BG')),/unreviewed copy or factual shape/);
 assert.throws(()=>personalizeModernMobileSellCopy(modernMobileSellFixture,{business:{name:''}}),/recorded dealer identity/);
 assert.throws(()=>personalizeModernMobileSellCopy(modernMobileSellFixture+'\n'+modernMobileSellFixture,profile('BG')),/known copy boundary/);
});
test('Modern two-path apply validates both before writes and reports only changed paths',t=>{
 const candidate=tinyArea(t),pagePath='apps/web/app/[locale]/sell/page.tsx',mobilePath='apps/web/app/[locale]/components/mobile-sell-vehicle-policy.ts';
 writeFixture(path.join(candidate,pagePath),modernSellFixture);writeFixture(path.join(candidate,mobilePath),modernMobileSellFixture.replace('Receive an offer','Unknown reviewed promise'));
 assert.throws(()=>applyModernSafeContent({candidate,profile:profile('BG')}),/unreviewed copy or factual shape/);assert.equal(fs.readFileSync(path.join(candidate,pagePath),'utf8'),modernSellFixture);
 writeFixture(path.join(candidate,mobilePath),modernMobileSellFixture);
 assert.deepEqual(applyModernSafeContent({candidate,profile:profile('BG')}),{changed:[pagePath,mobilePath]});
 assert.deepEqual(applyModernSafeContent({candidate,profile:profile('BG')}),{changed:[]});
 assert.equal(withoutModernCopy(fs.readFileSync(path.join(candidate,pagePath),'utf8')),withoutModernCopy(modernSellFixture));
});
