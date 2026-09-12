import { dealerFacts, dealerStock } from './dealer';
export type Car = {
 slug:string;title:string;shortTitle:string;brand:string;model:string;year:number;
 mileage:string;mileageValue:number;fuel:string;transmission:string;body:string;doors:number|null;
 engine:string;power:string;drive:string;color:string;price:number;priceEur:string;priceBgn:string;
 monthly:string;image:string;gallery:string[];badges:string[];conditionLine:string;description:string;
 features:string[];highlights:string[];lot:string;sourceUrl:string;currency?:string;distanceUnit?:string;
};
/** Retained field priceEur is a compatibility label, not a converted EUR amount. */
export const cars:Car[]=dealerStock.map(record=>({
 slug:`${record.make}-${record.model}-${record.year}-${record.id}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
 title:`${record.year} ${record.make} ${record.model} ${record.trim}`,shortTitle:`${record.make} ${record.model} ${record.trim}`,
 brand:record.make,model:record.model,year:record.year,
 mileage:`${new Intl.NumberFormat(dealerFacts.locale).format(record.mileage)} ${record.distanceUnit==='mi'?'miles':'km'}`,
 mileageValue:record.mileage,fuel:record.fuel,transmission:record.transmission,
 body:record.body==='SUV/Crossover'?'SUV':record.body,doors:record.doors,
 engine:'Not listed',power:'Not listed',drive:record.features.find(feature=>/4x2|4x4|all-wheel|front-wheel|rear-wheel/i.test(feature))??'Not listed',
 color:record.color??'Not listed',price:record.price,currency:record.currency,distanceUnit:record.distanceUnit,
 priceEur:new Intl.NumberFormat(dealerFacts.locale,{style:'currency',currency:record.currency,maximumFractionDigits:0}).format(record.price),priceBgn:'',
 monthly:'No finance quote is provided by this preview',image:record.image,gallery:record.photos,
 badges:['Dated sample'],conditionLine:dealerFacts.locationNote,
 description:`${record.description} ${dealerFacts.locationNote} Source: ${record.sourceUrl}. Observed ${record.observedAt}.`,
 features:record.features,highlights:['Advertised; confirm availability'],lot:`Source ${record.id}`,sourceUrl:record.sourceUrl
}));
export const daynightVehicles=cars;
export type DayNightVehicle=Car;
export type DayNightVehicleCondition='new'|'used';
export type DayNightVehicleAvailability='available'|'incoming';
export const getDayNightVehicleCondition=(_vehicle:Pick<Car,'mileageValue'>):DayNightVehicleCondition=>'used';
export const getDayNightVehicleAvailability=(_vehicle:Pick<Car,'highlights'>):DayNightVehicleAvailability=>'available';
export const getDayNightVehicleBySlug=(slug:string)=>cars.find(car=>car.slug===slug);
export const placeholderImageSlugs=new Set<string>();
export const featuredDayNightVehicles=cars.slice(0,6);
