export const brand = {
  name: 'Ден и Нощ Ауто Груп', shortName: 'Day & Night', latinName: 'Day & Night Auto Group',
  phone: '0877 733 110', phoneHref: 'tel:+359877733110',
  city: 'София', address: 'ул. „Атанас Манчев“ 18, Студентски град, София',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=1700+%D0%A1%D0%BE%D1%84%D0%B8%D1%8F+%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81+%D0%9C%D0%B0%D0%BD%D1%87%D0%B5%D0%B2+18',
  listingsUrl: 'https://daynight.mobile.bg/',
  contactUrl: 'https://daynight.mobile.bg/contacts',
  instagramUrl: 'https://www.instagram.com/dayandnight_autogroup/',
  facebookUrl: 'https://www.facebook.com/deninoshtautogroup/',
};
const image = name => `/daynight/${name}`;
export const assets = {
  logo: image('day-night-logo.png'), hero: image('day-night-home-black-v1.webp'),
  cutoutSilver: image('day-night-cutout-silver-v1.webp'), cutoutGraphite: image('day-night-cutout-graphite-v1.webp'),
  cutoutGclass: image('day-night-cutout-gclass-v1.webp'), cutoutUrus: image('day-night-cutout-urus-v1.webp'),
  showroom: image('day-night-showroom-color-v1.webp'), aboutDetail: image('day-night-studio-keys-v1.webp'),
  importBanner: image('day-night-import-banner-v1.webp'), sellBanner: image('day-night-sell-banner-v1.webp'),
};
// Model showcase: images retained from the owner's 5173 concept. These are not live stock records.
export const vehicles = [
  {id:'audi-rs6-avant',make:'Audi',title:'Audi RS 6 Avant',body:'Комби',fuel:'Бензин',image:image('day-night-stock-04.webp'),description:'Спортен характер и практичност в един силует. Обсъдете с екипа актуалните предложения за Audi RS 6 Avant.'},
  {id:'mercedes-gle-coupe',make:'Mercedes-Benz',title:'Mercedes-Benz GLE Coupé',body:'SUV купе',fuel:'Дизел',image:image('day-night-stock-01.webp'),description:'Присъствието на SUV с изразена купе линия. Потърсете екипа за наличните версии, оборудване и условия.'},
  {id:'bmw-x6',make:'BMW',title:'BMW X6',body:'SUV купе',fuel:'Дизел',image:image('day-night-stock-02.webp'),description:'Отличителен силует и комфорт за всеки ден. Разкажете ни каква конфигурация търсите.'},
  {id:'audi-rsq8',make:'Audi',title:'Audi RS Q8',body:'SUV',fuel:'Бензин',image:image('day-night-stock-06.webp'),description:'Пространство и спортно излъчване. Свържете се с екипа за конкретни предложения за Audi RS Q8.'},
  {id:'range-rover-sport',make:'Land Rover',title:'Range Rover Sport',body:'SUV',fuel:'Дизел',image:image('day-night-stock-05.webp'),description:'Комфорт и характерен британски дизайн. Уточнете предпочитаната версия и бюджет с екипа.'},
  {id:'mercedes-amg-gt',make:'Mercedes-Benz',title:'Mercedes-AMG GT 4-Door',body:'Спортбек',fuel:'Бензин',image:image('day-night-stock-03.webp'),description:'Спортен автомобил с четири врати и собствен характер. Попитайте за актуални предложения и възможностите за внос.'},
].map(v=>({...v,transmission:'Автоматик',priceLabel:'По запитване'}));
export const services = [
  {id:'inspection',title:'Оглед в София',description:'Изберете автомобил и уговорете удобно време за среща с екипа.',href:'/contact.html?topic=inspection',icon:'car'},
  {id:'import',title:'Внос по заявка',description:'Обсъдете модел, бюджет и предпочитания за следващия си автомобил.',href:'/contact.html?topic=import',icon:'globe'},
  {id:'leasing',title:'Собствен лизинг',description:'Получете индивидуални условия за конкретния автомобил.',href:'/contact.html?topic=leasing',icon:'file-invoice-dollar'},
];
export const homeVariants = [
 {id:1,route:'/index.html',title:'Кинематографичен',description:'Широка фотография и силно първо впечатление.'},
 {id:2,route:'/index-2.html',title:'Баланс',description:'Текст и автомобил в ясна, отворена композиция.'},
 {id:3,route:'/index-3.html',title:'Открий своя модел',description:'Търсенето е част от първото впечатление.'},
 {id:4,route:'/index-4.html',title:'Директен избор',description:'Автомобил и търсене в една рамка.'},
 {id:5,route:'/index-5.html',title:'Автомобилът отпред',description:'Голям силует и кратко, уверено послание.'},
];
export const modelNote='Илюстративни снимки на представени модели. Актуалните автомобили, цени и конфигурации се потвърждават с екипа.';
export const detailUrl=(vehicle,returnTo='/car.html')=>`/car-single.html?id=${encodeURIComponent(vehicle.id)}&from=${encodeURIComponent(returnTo)}`;
export function safeCatalogReturn(value){
 try{const url=new URL(value||'/car.html','http://local');return url.origin==='http://local'&&['/car.html','/car-2.html'].includes(url.pathname)?url.pathname+url.search:'/car.html';}catch{return '/car.html';}
}
