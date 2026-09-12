/** Public catalogue snapshot, 2026-09-09; no live or independently verified stock feed. */
export type StockRecord={id:number;sourceId:string;slug:string;title:string;make:string;model:string;year:number;date:string;mileageKm:number;priceEur:number;fuel:string;transmission:string;body:string;bodyBg:string;color:string;powerHp:number;engineCc:number|null;features:string[];sourceUrl:string;observedAt:string;taxLabel:string;availability:'advertised-unconfirmed';image:string;gallery:string[];sourceNote:string};
export const dealer={slug:'sprint-auto-varna',name:'Спринт ауто',shortName:'СПРИНТ',city:'Варна',country:'България',
 addressLine:'бул. „Цар Освободител“, втората автокъща след Тилком и Италмодалуче към Аксаково',
 address:'Варна, Владислав Варненчик, бул. „Цар Освободител“, втората автокъща след Тилком и Италмодалуче посока Аксаково',
 phone:'0888 006 224',phoneE164:'+359888006224',phoneHref:'tel:+359888006224',secondaryPhone:'',hours:'Потвърдете работното време и огледа по телефона',
 sourceUrl:'https://sprint.mobile.bg/',observedAt:'2026-09-09',accent:'#C62A23',ink:'#222529',tagline:'Автомобили във Варна. Разгледайте обявите и попитайте за оглед.',
 logo:'/brand/logo.svg',logoDark:'/brand/logo-dark.svg',hero:'/brand/brand-scene.svg',
 stockNotice:'Демонстрационна извадка от публични обяви към 09.09.2026 г. Спецификациите, цената и пробегът са по данни на продавача. Наличността и състоянието не са независимо проверени.',
 mediaNotice:'Снимките не са включени в този преглед. Вижте оригиналния каталог.',logoStatus:'custom-vector-demo-concept-not-dealer-approved'
} as const;
type Row=[slug:string,make:string,model:string,year:number,date:string,mileageKm:number,priceEur:number,fuel:string,transmission:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number,sourceId:string,sourceUrl:string,note:string];
const rows:Row[]=[
 ['toyota-rav4-2017','Toyota','RAV4 2.0 Executive',2017,'ноември 2017 г.',172000,13890,'Дизел','Ръчна','SUV','Джип','Тъмно сив',143,2000,'21766075081643432','https://sprint.mobile.bg/obiava-21766075081643432-toyota-rav4-2-0-executive-distronic-face-lift-keyless','Индивидуална обява и текущ каталожен прочит.'],
 ['suzuki-ignis-2021','Suzuki','Ignis 1.2 Black & Red',2021,'май 2021 г.',120000,8990,'Бензин','Ръчна','Hatchback','Хечбек','Червен',83,1200,'84641185','https://www.auto.bg/obiava/84641185/suzuki-ignis-1-2-hybrid-black-red-camera-navi-full-history','Отворена съпоставена обява в Auto.bg. Структурираното гориво е бензин, заглавието споменава HYBRID; конфигурацията не е независимо потвърдена.'],
 ['vw-golf-2024','VW','Golf IQ',2024,'юни 2024 г.',39000,19990,'Бензин','Ръчна','Wagon','Комби','Тъмно син',150,1500,'','',''],
 ['vw-passat-2015','VW','Passat 2.0 Highline BMT',2015,'март 2015 г.',177000,9990,'Дизел','Автоматик','Wagon','Комби','Светло син',150,2000,'','',''],
 ['vw-tiguan-2011','VW','Tiguan 2.0 4x4',2011,'ноември 2011 г.',159000,9700,'Дизел','Ръчна','SUV','Джип','Черен',170,2000,'','',''],
 ['suzuki-vitara-2016','Suzuki','Vitara 1.6 4x4',2016,'август 2016 г.',153000,8700,'Дизел','Ръчна','SUV','Джип','Тъмно сив',120,1600,'','',''],
 ['skoda-yeti-2012','Skoda','Yeti GreenLine',2012,'март 2012 г.',197000,6490,'Дизел','Ръчна','Hatchback','Хечбек','Бял',105,1600,'','','Купето Хечбек е класификацията в източника; не е променяно на друга категория.'],
 ['seat-tarraco-2020','Seat','Tarraco Xcellence',2020,'декември 2020 г.',61000,18880,'Бензин','Ръчна','SUV','Джип','Сив',150,1500,'','','']
];
export const stock:StockRecord[]=rows.map(([slug,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,sourceId,sourceUrl,note],index)=>({
 id:index+1,sourceId,slug,title:`${make} ${model}`,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,
 features:model.includes('4x4')?['4x4']:[],sourceUrl:sourceUrl||dealer.sourceUrl,observedAt:dealer.observedAt,taxLabel:'Не се начислява ДДС',availability:'advertised-unconfirmed',
 image:'/brand/stock-unavailable.svg',gallery:['/brand/stock-unavailable.svg'],sourceNote:[sourceId?'':'Данни от каталожната карта. Външен ID не е установен; slug е вътрешен идентификатор.',note].filter(Boolean).join(' ')
}));
export const mapQuery=`${dealer.name}, ${dealer.address}`;
export const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapsEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
