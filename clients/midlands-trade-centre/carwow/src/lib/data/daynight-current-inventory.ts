import { dealerFacts, dealerStock } from './dealer';
export type CurrentDayNightListing = {id:string;title:string;sourceUrl:string;priceEur:string;priceBgn:string;status:string;date:string;mileage:string;color:string;fuel:string;power:string;transmission:string;body:string;features:string[];image:string};
/** priceEur/priceBgn are retained template field identifiers; labels use the original source currency, with no conversion. */
export const currentDayNightListings: CurrentDayNightListing[] = dealerStock.map(record=>({
 id:record.id,title:`${record.make} ${record.model} ${record.trim}`,sourceUrl:record.sourceUrl,
 priceEur:new Intl.NumberFormat(dealerFacts.locale,{style:'currency',currency:record.currency,maximumFractionDigits:0}).format(record.price),priceBgn:'',
 status:'Dated listing sample',date:String(record.year),mileage:`${new Intl.NumberFormat(dealerFacts.locale).format(record.mileage)} ${record.distanceUnit==='mi'?'miles':'km'}`,
 color:record.color??'Not listed',fuel:record.fuel,power:'Not listed',transmission:record.transmission,
 body:record.body==='SUV/Crossover'?'SUV':record.body,features:record.features,image:record.image
}));
