import { dealer, stock } from './dealer';

export type Car = {
  slug:string;title:string;shortTitle:string;brand:string;model:string;year:number;
  mileage:string;mileageValue:number;fuel:string;transmission:string;body:string;
  doors:number;engine:string;power:string;drive:string;color:string;price:number;
  priceEur:string;priceBgn:string;monthly:string;image:string;gallery:string[];
  badges:string[];conditionLine:string;description:string;features:string[];
  highlights:string[];lot:string;sourceUrl:string;
};
const number = new Intl.NumberFormat('bg-BG',{maximumFractionDigits:2});

export const cars:Car[] = stock.map(record => ({
  slug:record.slug,title:record.title,shortTitle:record.title,brand:record.make,model:record.model,
  year:record.year,mileage:`${number.format(record.mileageKm)} км`,mileageValue:record.mileageKm,
  fuel:record.fuel,transmission:record.transmission,body:record.bodyBg,
  // Zero is the retained numeric unknown sentinel; it is not an advertised door count.
  doors:0,engine:record.engineCc ? `${number.format(record.engineCc)} см³` : 'Не е посочено',
  power:`${record.powerHp} к.с.`,drive:record.features.includes('4x4')?'4x4':'Не е посочено',
  color:record.color,price:record.priceEur,priceEur:`${number.format(record.priceEur)} €`,
  priceBgn:'',monthly:'',image:record.image,gallery:record.gallery,
  badges:['Публична обява'],conditionLine:'Наличността и състоянието се потвърждават от продавача.',
  description:[dealer.stockNotice,record.sourceNote,record.taxLabel,dealer.mediaNotice].join('\n\n'),
  features:record.features,highlights:[record.taxLabel,'Данни от публична обява',`Извадка: ${record.observedAt}`],
  lot:record.sourceId,sourceUrl:record.sourceUrl
}));
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming';
export const getDayNightVehicleCondition = (_vehicle:Pick<Car,'mileageValue'>):DayNightVehicleCondition => 'used';
// Retained filter bucket for advertised entries, not independent availability verification.
export const getDayNightVehicleAvailability = (vehicle:Pick<Car,'highlights'>):DayNightVehicleAvailability =>
  vehicle.highlights.some(value=>/очакван|предстоящо/i.test(value))?'incoming':'available';
export const getDayNightVehicleBySlug = (slug:string) => daynightVehicles.find(vehicle=>vehicle.slug===slug);
export const placeholderImageSlugs = new Set(daynightVehicles.map(vehicle=>vehicle.slug));
export const featuredDayNightVehicles = daynightVehicles.slice(0,6);
