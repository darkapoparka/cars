import { dealerStock } from './dealer-stock';
/** All numeric prices are USD and odometer values are original miles. No currency or unit conversion. */
export type Car = {
  slug:string;title:string;shortTitle:string;brand:string;model:string;year:number;
  mileage:string;mileageValue:number;mileageUnit:'mi';fuel:string;transmission:string;body:string;
  doors:number|null;engine:string;power:string;drive:string;color:string;
  price:number;priceUsd:number;priceLabel:string;secondaryPrice:string;monthly:string;
  image:string;gallery:string[];badges:string[];conditionLine:string;description:string;
  features:string[];highlights:string[];lot:string;sourceUrl:string;sourceId:string;sourceObservedAt:string;
  titleStatus:string|null;vin:string|null;
};
export const formatStockPrice=(price:number|null)=>price===null||!Number.isFinite(price)?'Price on request':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(price);
export const cars:Car[]=dealerStock.map(record=>{
  const shortTitle=`${record.make} ${record.model}`;
  const warning=record.titleStatus?'REBUILT TITLE — inspect the title documents before purchase.':'Title status and condition have not been independently verified.';
  const conditionLine='Dated listing sample — confirm price and availability directly with Texas Drive Auto.';
  return {slug:`${record.year}-${record.make}-${record.model}-${record.sourceId}`.toLowerCase().replace(/[^a-z0-9-]/g,'-'),title:[record.year,record.make,record.model,record.trim,record.titleStatus].filter(Boolean).join(' '),shortTitle,brand:record.make,model:record.model,year:record.year,mileage:new Intl.NumberFormat('en-US').format(record.mileageMiles)+' mi',mileageValue:record.mileageMiles,mileageUnit:'mi',fuel:record.fuel??'Not published',transmission:record.transmission,body:record.body,doors:null,engine:record.engine,power:'Not published',drive:record.drivetrain,color:record.exteriorColor??'Not published',price:record.priceUsd,priceUsd:record.priceUsd,priceLabel:formatStockPrice(record.priceUsd),secondaryPrice:'',monthly:'No dealer financing',image:record.image,gallery:[record.image],badges:['Dated listing sample',...(record.titleStatus?['REBUILT TITLE']:[])],conditionLine,description:`${record.year} ${shortTitle} ${record.trim}. ${record.engine}; ${record.transmission}; ${record.drivetrain}. ${conditionLine} ${warning} Advertised price in USD; taxes, title and licensing are excluded. No dealer financing or payment plans. Buyer-arranged financing is separate. Contact the dealer for applicable payment terms.`,features:[record.engine,record.drivetrain],highlights:['Dated listing sample',record.drivetrain,record.titleStatus??'Title status not verified'],lot:record.sourceId,sourceUrl:record.sourceUrl,sourceId:record.sourceId,sourceObservedAt:record.observedAt,titleStatus:record.titleStatus??null,vin:record.vin??null};
});
export const daynightVehicles=cars;
export type DayNightVehicle=Car;
export type DayNightVehicleCondition='new'|'used';
/** Compatibility browsing buckets, not independently verified stock availability. Public labels disclose samples. */
export type DayNightVehicleAvailability='available'|'incoming';
export const getDayNightVehicleCondition=(_vehicle:Pick<Car,'mileageValue'>):DayNightVehicleCondition=>'used';
export const getDayNightVehicleAvailability=(_vehicle:Pick<Car,'highlights'>):DayNightVehicleAvailability=>'available';
export const getDayNightVehicleBySlug=(slug:string)=>daynightVehicles.find(car=>car.slug===slug);
export const placeholderImageSlugs=new Set(cars.filter(car=>car.image.includes('photo-unavailable')).map(car=>car.slug));
export const featuredDayNightVehicles=daynightVehicles.slice(0,6);
