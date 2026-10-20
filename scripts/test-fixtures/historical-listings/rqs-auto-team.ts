/** Public-source snapshot observed 2026-09-09. Not a live stock feed. */
export type StockRecord={id:number;sourceId:string;slug:string;title:string;make:string;model:string;year:number;date:string;mileageKm:number;priceEur:number;fuel:string;transmission:string;body:string;bodyBg:string;color:string;powerHp:number;engineCc:number|null;features:string[];sourceUrl:string;observedAt:string;taxLabel:string;availability:'advertised-unconfirmed';image:string;gallery:string[];sourceNote:string};
export const dealer={
  slug:'rqs-auto-team',name:'R.Q.S. Auto – Team',shortName:'R.Q.S.',city:'Варна',country:'България',
  addressLine:'бул. „Цар Освободител“, Владислав Варненчик — уточнете точния вход',
  address:'бул. „Цар Освободител“, Владислав Варненчик, Варна — точният номер не е потвърден',
  phone:'0876 997 791',phoneE164:'+359876997791',phoneHref:'tel:+359876997791',secondaryPhone:'',
  hours:'Потвърдете работното време и огледа по телефона',sourceUrl:'https://rqsautoteam.mobile.bg/',observedAt:'2026-09-09',
  accent:'#C62631',ink:'#192126',tagline:'Автомобили във Варна. Сравнете обявите и попитайте за оглед.',
  logo:'/brand/logo.svg',logoDark:'/brand/logo-dark.svg',hero:'/brand/brand-scene.svg',
  stockNotice:'Демонстрационна извадка от публични обяви към 09.09.2026 г. Пробегът, цената и спецификациите са обявени от продавача, не независимо проверени. Наличността се потвърждава директно.',
  mediaNotice:'Снимките не са включени в този преглед. Вижте оригиналния каталог.',logoStatus:'custom-vector-demo-concept-not-dealer-approved'
} as const;
type Row=[slug:string,make:string,model:string,year:number,date:string,mileageKm:number,priceEur:number,fuel:string,transmission:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number,sourceId:string,sourceUrl:string,note:string];
const rows:Row[]=[
 ['toyota-auris-hybrid-2017','Toyota','Auris SW 1.8 Hybrid',2017,'февруари 2017 г.',202500,10200,'Хибрид','Автоматик','Wagon','Комби','Бял',99,1800,'11724246018394817','https://rqsautoteam.mobile.bg/obiava-11724246018394817-toyota-auris-sw-restyling-1-8-full-hybrid-hev-e-cvt-active','Индивидуална обява: структурирани 99 к.с. и 1800 см³; описанието отделно посочва 136 к.с. и 1798 см³. Конфликтът не е разрешен.'],
 ['honda-civic-elegance-2018','Honda','Civic 1.6 i-DTEC Elegance Navi',2018,'декември 2018 г.',110000,13700,'Дизел','Ръчна','Hatchback','Хечбек','Светло сив',120,1600,'11752568346883957','https://rqsautoteam.mobile.bg/obiava-11752568346883957-honda-civic-1-6-i-dtec-120kc-5vr-elegance-navi','Продавачът изрично посочва клиентски автомобил. Това не е потвърждение, че автомобилът е собственост на автокъщата.'],
 ['renault-megane-2018','Renault','Megane',2018,'май 2018 г.',244200,7500,'Дизел','Ръчна','Wagon','Комби','Тъмно сив',110,1500,'','',''],
 ['kia-sportage-2016','Kia','Sportage 1.7 CRDi Class Premium',2016,'март 2016 г.',162000,11400,'Дизел','Ръчна','SUV','Джип','Тъмно сив',116,1700,'','',''],
 ['citroen-c1-2012','Citroen','C1 1.0 VTi Automatic AirDream',2012,'юни 2012 г.',59900,6200,'Бензин','Автоматик','Hatchback','Хечбек','Светло син',69,998,'','',''],
 ['honda-civic-elegance-2016','Honda','Civic 1.6 i-DTEC Elegance',2016,'септември 2016 г.',189700,8900,'Дизел','Ръчна','Hatchback','Хечбек','Перла',120,1600,'','',''],
 ['hyundai-santa-fe-2017','Hyundai','Santa Fe 2.2 CRDi 4WD',2017,'ноември 2017 г.',166000,15900,'Дизел','Автоматик','SUV','Джип','Тъмно сив',200,2200,'','',''],
 ['seat-ateca-2018','Seat','Ateca 1.6 TDI Business DSG',2018,'октомври 2018 г.',213000,14300,'Дизел','Автоматик','SUV','Джип','Черен',115,1600,'','','Каталожната карта показва 115 к.с., а описанието 116 к.с.; не е независимо разрешено.']
];
export const stock:StockRecord[]=rows.map(([slug,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,sourceId,sourceUrl,note],index)=>({
 id:index+1,sourceId,slug,title:`${make} ${model}`,make,model,year,date,mileageKm,priceEur,fuel,transmission,body,bodyBg,color,powerHp,engineCc,features:[],
 sourceUrl:sourceUrl||dealer.sourceUrl,observedAt:dealer.observedAt,taxLabel:'Не се начислява ДДС',availability:'advertised-unconfirmed',
 image:'/brand/stock-unavailable.svg',gallery:['/brand/stock-unavailable.svg'],
 sourceNote:[sourceId?'Публична индивидуална обява.':'Данни от каталожната карта. Индивидуален ID не е установен; slug е вътрешен идентификатор на демонстрацията. Пробегът е обявената стойност, не нормализирано независимо измерване.',note].filter(Boolean).join(' ')
}));
export const mapQuery=`${dealer.name}, ${dealer.address}`;
export const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapsEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
