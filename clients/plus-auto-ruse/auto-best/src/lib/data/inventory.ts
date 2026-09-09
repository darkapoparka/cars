import dealer from './dealer-records.json';
export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment = '4x4' | '360° камера' | 'Панорамен покрив' | 'Подгряване на седалки' | 'Навигация' | 'Парктроник' | 'Безключов достъп' | 'Адаптивен круиз контрол';
export type Vehicle = { id:number; verification:'sample'|'verified'; evidenceUrl:string; sourceId:string; image:string; images:string[]; category:string; body:string; make:string; title:string; year:string; yearNumber:number; mileage:string; mileageKm:number; fuel:string; transmission:string; equipment:readonly VehicleEquipment[]; condition:VehicleCondition; priceEur:number; href:`/listing-detail-v1/${number}`; taxNote:string; availability:string; description:string; location:string; };
const bodyMap:Record<string,string>={'Джип':'SUV','Седан':'Sedan','Хечбек':'Hatchback','Комби':'Wagon','Миниван':'Minivan','Купе':'Coupe','Кабрио':'Convertible'};
// Dated seller-advertised sample, not a live or independently verified stock feed.
export const featuredVehicles:Vehicle[]=dealer.vehicles.map(v=>({
 id:v.id, sourceId:v.sourceId, verification:'sample', evidenceUrl:v.sourceUrl,
 image:v.images[0], images:v.images, category:v.body, body:bodyMap[v.body]??v.body,
 make:v.make,title:v.title,year:String(v.year),yearNumber:v.year,
 mileage:`${new Intl.NumberFormat('bg-BG').format(v.mileageKm)} км`,mileageKm:v.mileageKm,
 fuel:({Дизелов:'Дизел',Бензинов:'Бензин',Хибриден:'Хибрид'} as Record<string,string>)[v.fuel]??v.fuel,
 transmission:v.transmission==='Автоматична'?'Автоматик':v.transmission,
 equipment:v.equipment as VehicleEquipment[],condition:'used',priceEur:v.price,href:`/listing-detail-v1/${v.id}`,
 taxNote:v.taxNote,availability:v.availability,description:v.description,location:v.location
}));
export const formatVehiclePrice=(value:number|null)=>value===null?'Цена при запитване':`${new Intl.NumberFormat('bg-BG').format(value)} €`;
