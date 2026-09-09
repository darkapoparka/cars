import stock from './dealer-stock.json';
import { stockGallery } from './dealer-stock-media';
export type CurrentDayNightListing={id:string;title:string;sourceUrl:string;priceEur:string;priceBgn:string;status:string;date:string;mileage:string;color:string;fuel:string;power:string;transmission:string;body:string;features:string[];image:string};
const number=new Intl.NumberFormat('bg-BG');
export const currentDayNightListings:CurrentDayNightListing[]=stock.listings.map(record=>({
 id:record.sourceId,title:record.title,sourceUrl:record.evidenceUrl,priceEur:record.priceEur>0?`${number.format(record.priceEur)} €`:'Цена при запитване',priceBgn:'',status:'Наличността се потвърждава',date:String(record.yearNumber),mileage:`${number.format(record.mileageKm)} км`,color:record.color,fuel:record.fuel,power:record.powerHp===null?'Не е посочена':`${record.powerHp} к.с.`,transmission:record.transmission,body:record.category,features:[...record.equipment],image:stockGallery(record.localImages)[0]
}));
