/** Public advertisement snapshot, 2026-09-09; not a live or independently verified stock feed. */
export type StockRecord = {
  id:number; sourceId:string; slug:string; title:string; make:string; model:string;
  year:number; date:string; mileageKm:number; priceEur:number; fuel:string;
  transmission:string; body:string; bodyBg:string; color:string; powerHp:number;
  engineCc:number|null; features:string[]; sourceUrl:string; observedAt:string;
  taxLabel:string; availability:'advertised-unconfirmed'; image:string; gallery:string[]; sourceNote:string;
};
export const dealer = {
  slug:'sunny-varna', name:'СЪНИ', shortName:'СЪНИ', city:'Варна', country:'България',
  addressLine:'бул. „Цар Освободител“ 256, Кайсиева градина',
  address:'бул. „Цар Освободител“ 256, Кайсиева градина, Варна',
  phone:'0898 644 464', phoneE164:'+359898644464', phoneHref:'tel:+359898644464',
  secondaryPhone:'+359893430054', hours:'Всеки ден 08:00–19:00 — потвърдете преди посещение',
  sourceUrl:'https://sunny.mobile.bg/', observedAt:'2026-09-09', accent:'#C78916', ink:'#182522',
  tagline:'Автомобили във Варна. Изберете обява и попитайте за оглед.',
  logo:'/brand/logo.svg', logoDark:'/brand/logo-dark.svg', hero:'/brand/brand-scene.svg',
  stockNotice:'Демонстрационна извадка от публични обяви към 09.09.2026 г. Цените, пробегът и оборудването са по данни на продавача. Наличността се потвърждава по телефона.',
  mediaNotice:'Снимките на автомобилите не са включени в този преглед. Вижте оригиналната обява.',
  logoStatus:'custom-vector-demo-concept-not-dealer-approved'
} as const;
const catalogueNote = 'Данни от каталожната карта; индивидуалната страница не бе достъпна.';
type SourceRecord = Omit<StockRecord,'sourceUrl'|'observedAt'|'taxLabel'|'availability'|'image'|'gallery'>;
const records:SourceRecord[] = [
  {id:1,sourceId:'11785246205747169',slug:'vw-beetle-gaz-benzin',title:'VW Beetle 1.6 Газ/Бензин',make:'VW',model:'Beetle 1.6 Газ/Бензин',year:2004,date:'април 2004 г.',mileageKm:230000,priceEur:1699,fuel:'Бензин / Газ',transmission:'Ръчна',body:'Hatchback',bodyBg:'Хечбек',color:'Черен',powerHp:102,engineCc:1600,features:[],sourceNote:'Индивидуална обява; структурираното гориво е бензин, заглавието и описанието посочват газ/бензин.'},
  {id:2,sourceId:'21742745404828023',slug:'suzuki-grand-vitara-4x4-diesel',title:'Suzuki Grand Vitara 4x4',make:'Suzuki',model:'Grand Vitara 4x4',year:2009,date:'април 2009 г.',mileageKm:203000,priceEur:6390,fuel:'Дизел',transmission:'Ръчна',body:'SUV',bodyBg:'Джип',color:'Бял',powerHp:131,engineCc:1900,features:['4x4','Навигация'],sourceNote:catalogueNote},
  {id:3,sourceId:'11753359500914380',slug:'smart-fortwo-eq-executive',title:'Smart Fortwo EQ Executive',make:'Smart',model:'Fortwo EQ Executive',year:2021,date:'юли 2021 г.',mileageKm:105000,priceEur:12500,fuel:'Електрически',transmission:'Автоматик',body:'Hatchback',bodyBg:'Хечбек',color:'Бордо',powerHp:82,engineCc:null,features:['Навигация','Парктроник','Подгряване на седалки'],sourceNote:'Индивидуална обява. Посочените 18 kWh / 150 км са твърдения в обявата, не измерен капацитет или пробег.'},
  {id:4,sourceId:'21742571140983319',slug:'peugeot-4007-4x4-7-mestna',title:'Peugeot 4007 4x4 7 места',make:'Peugeot',model:'4007 4x4 7 места',year:2010,date:'юни 2010 г.',mileageKm:201000,priceEur:6544,fuel:'Дизел',transmission:'Ръчна',body:'SUV',bodyBg:'Джип',color:'Черен',powerHp:156,engineCc:2200,features:['4x4','Навигация','Парктроник','Подгряване на седалки'],sourceNote:catalogueNote},
  {id:5,sourceId:'11756481171645307',slug:'peugeot-2008-suv',title:'Peugeot 2008 SUV',make:'Peugeot',model:'2008 SUV',year:2016,date:'юли 2016 г.',mileageKm:170000,priceEur:8589,fuel:'Бензин',transmission:'Ръчна',body:'SUV',bodyBg:'Джип',color:'Графит',powerHp:90,engineCc:1200,features:['Навигация','Парктроник'],sourceNote:catalogueNote},
  {id:6,sourceId:'11767106522243743',slug:'opel-meriva-automatic',title:'Opel Meriva Automatic',make:'Opel',model:'Meriva Automatic',year:2014,date:'август 2014 г.',mileageKm:180000,priceEur:7668.87,fuel:'Дизел',transmission:'Автоматик',body:'Hatchback',bodyBg:'Хечбек',color:'Тъмно сив',powerHp:110,engineCc:1700,features:['Навигация','Парктроник','Подгряване на седалки'],sourceNote:'Каталожната категория Хечбек е запазена, без преоценка на купето. Индивидуалната страница не бе достъпна.'},
  {id:7,sourceId:'21758614493706426',slug:'opel-antara-4x4-cosmo',title:'Opel Antara 4x4 Cosmo',make:'Opel',model:'Antara 4x4 Cosmo',year:2013,date:'юли 2013 г.',mileageKm:181000,priceEur:7618,fuel:'Дизел',transmission:'Автоматик',body:'SUV',bodyBg:'Джип',color:'Перла',powerHp:184,engineCc:2200,features:['4x4','Навигация','Парктроник','Подгряване на седалки'],sourceNote:catalogueNote},
  {id:8,sourceId:'21742139197389610',slug:'mitsubishi-outlander-facelift',title:'Mitsubishi Outlander Facelift',make:'Mitsubishi',model:'Outlander Facelift',year:2011,date:'юни 2011 г.',mileageKm:175000,priceEur:7925,fuel:'Дизел',transmission:'Ръчна',body:'SUV',bodyBg:'Джип',color:'Бронз',powerHp:177,engineCc:2200,features:['Парктроник'],sourceNote:'Данни от каталожната карта; индивидуалната страница върна грешка при декодиране.'}
];
export const stock:StockRecord[] = records.map(record => ({
  ...record, sourceUrl:`https://sunny.mobile.bg/obiava-${record.sourceId}-${record.slug}`,
  observedAt:dealer.observedAt, taxLabel:'Не се начислява ДДС', availability:'advertised-unconfirmed',
  image:'/brand/stock-unavailable.svg', gallery:['/brand/stock-unavailable.svg']
}));
export const mapQuery = `${dealer.name}, ${dealer.address}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
