import { dealerStock } from './dealer';
import { brand } from '$config/brand';
export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = string;
export type Vehicle = {
 id: number; sourceId: string; verification: 'sample' | 'verified'; evidenceUrl?: string;
 image: string; gallery: string[]; category: string; body: string; make: string; title: string;
 year: string; yearNumber: number; mileage: string; mileageValue: number; distanceUnit: string;
 fuel: string; transmission: string; equipment: readonly VehicleEquipment[]; condition: VehicleCondition;
 priceAmount: number | null; currency: string; description: string; viewingLocation: string;
 sourceUrl: string; observedAt: string; href: `/listing-detail-v1/${number}`;
};
export const featuredVehicles: Vehicle[] = dealerStock.map((record,index) => ({
 id:index+1,sourceId:record.id,verification:'sample',evidenceUrl:record.sourceUrl,
 image:record.image,gallery:record.photos,category:record.body,body:record.body,make:record.make,
 title:record.title,year:String(record.year),yearNumber:record.year,
 mileage:`${new Intl.NumberFormat(brand.locale).format(record.mileage)} ${brand.distanceUnit === 'mi' ? 'miles' : 'km'}`,
 mileageValue:record.mileage,distanceUnit:record.distanceUnit,fuel:record.fuel,
 transmission:record.transmission,equipment:record.features,condition:'used',priceAmount:record.price,
 currency:record.currency,description:record.description,viewingLocation:record.viewingLocation,
 sourceUrl:record.sourceUrl,observedAt:record.observedAt,href:`/listing-detail-v1/${index+1}`
}));
export const formatVehiclePrice = (value:number|null) => value === null || !Number.isFinite(value)
 ? 'Price on request' : new Intl.NumberFormat(brand.locale,{style:'currency',currency:brand.currency,maximumFractionDigits:0}).format(value);
