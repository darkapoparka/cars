/** Public catalogue snapshot, 2026-09-09; not independently verified stock. */
export type StockRecord={id:number;sourceId:string;slug:string;title:string;make:string;model:string;year:number;date:string;mileageKm:number;priceEur:number;fuel:string;transmission:string;body:string;bodyBg:string;color:string;powerHp:number;engineCc:number|null;features:string[];sourceUrl:string;observedAt:string;taxLabel:string;availability:'advertised-unconfirmed';image:string;gallery:string[];sourceNote:string};
export const dealer={slug:'evrocar-varna-09',name:'ЕВРОКАР ВАРНА 09',shortName:'ЕВРОКАР 09',city:'Варна',country:'България',
 addressLine:'бул. „Цар Освободител“, след Метро, преди светофара за JUMBO',
 address:'Варна, Кайсиева градина, бул. „Цар Освободител“, след Метро, преди светофара за JUMBO',
 phone:'0897 002 225',phoneE164:'+359897002225',phoneHref:'tel:+359897002225',secondaryPhone:'',
 hours:'Потвърдете работното време и точния вход по телефона',sourceUrl:'https://evrocarvarna09.mobile.bg/',observedAt:'2026-09-09',
 accent:'#14899B',ink:'#152D43',tagline:'Автомобили във Варна. Изберете обява и попитайте за оглед.',
 logo:'/brand/logo.svg',logoDark:'/brand/logo-dark.svg',hero:'/brand/brand-scene.svg',
 stockNotice:'Демонстрационна извадка от публични обяви към 09.09.2026 г. Повтарящите се стойности за пробег са обявени от продавача, не независимо проверени. Цената, състоянието и наличността се потвърждават директно.',
 mediaNotice:'Снимките не са включени в този преглед. Вижте оригиналния каталог.',logoStatus:'custom-vector-demo-concept-not-dealer-approved'
} as const;
type Row=[slug:string,make:string,model:string,year:number,date:string,priceEur:number,fuel:string,body:string,bodyBg:string,color:string,powerHp:number,engineCc:number,sourceId:string,sourceUrl:string,note:string];
const rows:Row[]=[
 ['chevrolet-spark-2011','Chevrolet','Spark 1.0i LPG',2011,'юни 2011 г.',2450,'Бензин / Газ','Hatchback','Хечбек','Кафяв',68,1000,'11764956071799029','https://evrocarvarna09.mobile.bg/obiava-11764956071799029-chevrolet-spark-1-0i-lpg-bizhu','Структурираното гориво е бензин; LPG е посочено в заглавието и описанието.'],
 ['mazda-2-2011','Mazda','2',2011,'юни 2011 г.',3600,'Бензин / Газ','Hatchback','Хечбек','Черен',80,1400,'11751724444140717','https://evrocarvarna09.mobile.bg/obiava-11751724444140717-mazda-2-2011ta-kato-nova','Структурираното гориво е бензин; описанието посочва газов инжекцион.'],
 ['vw-passat-2016','VW','Passat 1.6 TDI',2016,'януари 2016 г.',9950,'Дизел','Wagon','Комби','Тъмно сив',120,1600,'','',''],
 ['vw-passat-2013','VW','Passat 1.6 TDI',2013,'януари 2013 г.',5999,'Дизел','Wagon','Комби','Кафяв',105,1600,'','',''],
 ['vw-passat-2014','VW','Passat 1.6 TDI',2014,'януари 2014 г.',5999,'Дизел','Wagon','Комби','Сив',105,1600,'','',''],
 ['vw-golf-2010','VW','Golf 1.4 TSI',2010,'януари 2010 г.',4899,'Бензин','Hatchback','Хечбек','Светло сив',122,1400,'','',''],
 ['seat-leon-2015','Seat','Leon 1.6 TDI',2015,'януари 2015 г.',6100,'Дизел','Wagon','Комби','Черен',105,1600,'','',''],
 ['renault-clio-2011','Renault','Clio 1.5 dCi',2011,'март 2011 г.',3476,'Дизел','Hatchback','Хечбек','Бял',75,1500,'','','']
];
export const stock:StockRecord[]=rows.map(([slug,make,model,year,date,priceEur,fuel,body,bodyBg,color,powerHp,engineCc,sourceId,sourceUrl,note],index)=>({
 id:index+1,sourceId,slug,title:`${make} ${model}`,make,model,year,date,mileageKm:100000,priceEur,fuel,transmission:'Ръчна',body,bodyBg,color,powerHp,engineCc,features:[],
 sourceUrl:sourceUrl||dealer.sourceUrl,observedAt:dealer.observedAt,taxLabel:'Не се начислява ДДС',availability:'advertised-unconfirmed',image:'/brand/stock-unavailable.svg',gallery:['/brand/stock-unavailable.svg'],
 sourceNote:[sourceId?'Данни от индивидуална обява и каталога.':'Данни от каталожната карта. Външен ID не е установен; slug е вътрешен идентификатор.', '100 000 км е стойността в обявата, не потвърден реален пробег.',note].filter(Boolean).join(' ')
}));
export const mapQuery=`${dealer.name}, ${dealer.address}`;
export const mapsUrl=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
export const mapsEmbedUrl=`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
