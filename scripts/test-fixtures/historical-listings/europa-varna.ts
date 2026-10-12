/** Dated public-source snapshot, 2026-09-09. Not a live or independently verified stock feed. */
export type StockRecord={id:number;sourceId:string;slug:string;title:string;make:string;model:string;year:number;date:string;mileageKm:number;priceEur:number;fuel:string;transmission:string;body:string;bodyBg:string;color:string;powerHp:number;engineCc:number|null;features:string[];sourceUrl:string;observedAt:string;taxLabel:string;availability:'advertised-unconfirmed';image:string;gallery:string[];sourceNote:string};
export const dealer={slug:'europa-varna',name:'Европа',shortName:'ЕВРОПА',city:'Варна',country:'България',
 addressLine:'бул. „Христо Смирненски“, до Вятърна мелница, Победа',
 address:'Варна, Победа, бул. „Христо Смирненски“, до Вятърна мелница',
 phone:'0887 600 565',phoneE164:'+359887600565',phoneHref:'tel:+359887600565',secondaryPhone:'+359887616655',
 hours:'Потвърдете работното време и огледа по телефона',sourceUrl:'https://evropavarna.mobile.bg/',observedAt:'2026-09-09',
 accent:'#3D65A8',ink:'#182D47',tagline:'Автомобили във Варна. Сравнете обявите и попитайте за оглед.',
 logo:'/brand/logo.svg',logoDark:'/brand/logo-dark.svg',hero:'/brand/brand-scene.svg',
 stockNotice:'Демонстрационна извадка от публични обяви към 09.09.2026 г. Цената, пробегът и спецификациите са по данни на продавача. Наличността, историята и състоянието не са независимо проверени.',
 mediaNotice:'Снимките не са включени в този преглед. Вижте оригиналния каталог.',logoStatus:'custom-vector-demo-concept-not-dealer-approved'
} as const;
type Row=[slug:string,make:string,model:string,year:number,date:string,mileageKm:number,priceEur:number,fuel:string,transmission:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number|null,taxLabel:string,sourceId:string,sourceUrl:string,note:string];
const rows:Row[]=[
 ['mazda-cx3-2019','Mazda','CX-3 2.0 Automatic',2019,'март 2019 г.',27900,14500,'Бензин','Автоматик','SUV','Джип','Светло син',150,2000,'С включен ДДС','21781896273585445','https://evropavarna.mobile.bg/obiava-21781896273585445-mazda-cx-3-2-0i-150ks-automatic-navi','Индивидуална обява. Не е същият автомобил като отделната 2017/63000км обява в друг каталог.'],
 ['seat-leon-2010','Seat','Leon 1.9 TDI',2010,'март 2010 г.',190000,3890,'Дизел','Ръчна','Hatchback','Хечбек','Тъмно сив',90,1900,'С включен ДДС','11761848228910347','https://evropavarna.mobile.bg/obiava-11761848228910347-seat-leon-1-9tdi-90ks-fr-face','Индивидуална обява. Екологичният стандарт не е установен и не е добавен.'],
 ['seat-ibiza-2001','Seat','Ibiza 1.8T Sport',2001,'декември 2001 г.',162000,3267.16,'Бензин','Ръчна','Hatchback','Хечбек','Светло сив',156,null,'С включен ДДС','','','Обемът не е установен от отделно структурирано поле; означението 1.8T се запазва само в заглавието.'],
 ['peugeot-407-2007','Peugeot','407 1.8 16V',2007,'януари 2007 г.',135000,3299,'Бензин','Ръчна','Sedan','Седан','Светло сив',125,1800,'С включен ДДС','','',''],
 ['peugeot-107-2007','Peugeot','107 1.0',2007,'декември 2007 г.',140000,2500,'Бензин','Ръчна','Hatchback','Хечбек','Бял',68,1000,'Не се начислява ДДС','','',''],
 ['opel-astra-2010','Opel','Astra 1.4',2010,'февруари 2010 г.',136000,3490,'Бензин','Ръчна','Hatchback','Хечбек','Светло сив',100,1400,'С включен ДДС','','',''],
 ['mercedes-e200-cabrio-1996','Mercedes-Benz','E 200 124 Cabrio',1996,'юни 1996 г.',153000,10200.27,'Бензин','Ръчна','Convertible','Кабриолет','Светло сив',136,null,'С включен ДДС','','','Не е добавен предполагаем обем на двигателя от моделното означение.'],
 ['mazda-cx9-2016','Mazda','CX-9 2.5 SkyActive AWD Signature',2016,'юли 2016 г.',76000,18500,'Бензин','Автоматик','SUV','Джип','Тъмно сив',250,2500,'С включен ДДС','','','']
];
export const stock:StockRecord[]=rows.map(([slug,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,taxLabel,sourceId,sourceUrl,note],index)=>({
 id:index+1,sourceId,slug,title:`${make} ${model}`,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,taxLabel,
 features:model.includes('AWD')?['4x4']:[],sourceUrl:sourceUrl||dealer.sourceUrl,observedAt:dealer.observedAt,availability:'advertised-unconfirmed',
 image:'/brand/stock-unavailable.svg',gallery:['/brand/stock-unavailable.svg'],
 sourceNote:[sourceId?'':'Данни от каталожната карта. Външен ID не е установен; slug е вътрешен идентификатор.',note].filter(Boolean).join(' ')
}));
// The source's parts-only Mini, damaged/misclassified offer and conflicted Subaru are excluded.
export const mapQuery=`${dealer.name}, ${dealer.address}`;
export const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapsEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
