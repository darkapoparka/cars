import { stock, dealer } from './dealer';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = '4x4' | '360° камера' | 'Панорамен покрив' | 'Подгряване на седалки' | 'Навигация' | 'Парктроник' | 'Безключов достъп' | 'Адаптивен круиз контрол';
export type Vehicle = {
  id:number; verification:'sample'|'verified'; evidenceUrl?:string; image:string;
  category:string; body:string; make:string; title:string; year:string; yearNumber:number;
  mileage:string; mileageKm:number; fuel:string; transmission:string;
  equipment:readonly VehicleEquipment[]; condition:VehicleCondition; priceEur:number;
  href:`/listing-detail-v1/${number}`; sourceId:string; sourceNote:string; taxLabel:string;
  gallery:string[]; observedAt:string; mediaNote:string;
};
const equipmentValues = new Set<VehicleEquipment>(['4x4','360° камера','Панорамен покрив','Подгряване на седалки','Навигация','Парктроник','Безключов достъп','Адаптивен круиз контрол']);

// One source sample drives cards, filters, details and related vehicles.
export const featuredVehicles:Vehicle[] = stock.map(record => ({
  id:record.id, verification:'sample', evidenceUrl:record.sourceUrl,
  image:record.image, gallery:record.gallery, category:record.bodyBg, body:record.body,
  make:record.make, title:record.title, year:String(record.year), yearNumber:record.year,
  mileage:`${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  mileageKm:record.mileageKm, fuel:record.fuel, transmission:record.transmission,
  equipment:record.features.filter((value):value is VehicleEquipment => equipmentValues.has(value as VehicleEquipment)),
  condition:'used', priceEur:record.priceEur, href:`/listing-detail-v1/${record.id}`,
  sourceId:record.sourceId, sourceNote:record.sourceNote, taxLabel:record.taxLabel,
  observedAt:record.observedAt, mediaNote:dealer.mediaNotice
}));

export const formatVehiclePrice = (priceEur:number) => Number.isFinite(priceEur) && priceEur > 0
  ? `${new Intl.NumberFormat('bg-BG',{maximumFractionDigits:2}).format(priceEur)} €`
  : 'Цена при запитване';
