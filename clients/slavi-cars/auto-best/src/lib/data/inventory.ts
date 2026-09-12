import stock from './dealer-stock.json';
export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключов достъп'
  | 'Адаптивен круиз контрол';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl?: string;
  image: string;
  gallery?: string[];
  disclosure?: string;
  taxText?: string;
  category: string;
  body: string;
  make: string;
  title: string;
  year: string;
  yearNumber: number;
  mileage: string;
  mileageKm: number;
  fuel: string;
  transmission: string;
  equipment: readonly VehicleEquipment[];
  condition: VehicleCondition;
  priceEur: number;
  href: `/listing-detail-v1/${number}`;
};


// Dated dealer advertisements, not independently verified available inventory.
export const featuredVehicles: Vehicle[] = stock.map(v => ({
 id:v.id,verification:'sample',evidenceUrl:v.sourceUrl,image:v.images[0].path,gallery:v.images.map(i=>i.path),category:v.bodyLabel,body:v.body,make:v.make,title:v.title,year:String(v.year),yearNumber:v.year,mileage:new Intl.NumberFormat('bg-BG').format(v.mileageKm)+' км',mileageKm:v.mileageKm,fuel:v.fuel,transmission:v.transmission,equipment:v.features.filter((f): f is VehicleEquipment => ['4x4','Навигация','Парктроник'].includes(f)),condition:'used',priceEur:v.priceEur,href:`/listing-detail-v1/${v.id}`,disclosure:v.notes,taxText:v.taxText ?? undefined
}));
export const formatVehiclePrice = (priceEur: number) => new Intl.NumberFormat('bg-BG').format(priceEur)+' €';
