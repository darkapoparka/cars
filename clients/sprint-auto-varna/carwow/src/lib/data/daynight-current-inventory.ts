import { stock } from './dealer';
export type CurrentDayNightListing={id:string;title:string;sourceUrl:string;priceEur:string;priceBgn:string;status:string;date:string;mileage:string;color:string;fuel:string;power:string;transmission:string;body:string;features:string[];image:string};
const number=new Intl.NumberFormat('bg-BG',{maximumFractionDigits:2});
export const currentDayNightListings:CurrentDayNightListing[]=stock.map(record=>({
  id:record.sourceId||`preview-${record.slug}`,title:record.title,sourceUrl:record.sourceUrl,
  priceEur:`${number.format(record.priceEur)} €`,priceBgn:'',status:'Наличност за потвърждение',
  date:record.date,mileage:`${number.format(record.mileageKm)} км`,color:record.color,fuel:record.fuel,
  power:`${record.powerHp} к.с.`,transmission:record.transmission,body:record.bodyBg,features:record.features,image:record.image
}));
