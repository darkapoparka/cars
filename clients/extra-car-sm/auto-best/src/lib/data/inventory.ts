import dealer from './dealer-stock.json';
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
  sourceId: string;
  sourceStatus: string;
  taxNote: string;
  description: string;
  gallery: string[];
  observedAt: string;
  image: string;
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


const statusLabels: Record<string, string> = { incoming: 'Очакван внос', consignment: 'Клиентски автомобил', advertised: 'Обявен автомобил', 'status-unconfirmed': 'Статус за потвърждение', appointment: 'Оглед с уговорка' };
const equipmentOptions: VehicleEquipment[] = ['4x4','360° камера','Панорамен покрив','Подгряване на седалки','Навигация','Парктроник','Безключов достъп','Адаптивен круиз контрол'];
const bodyLabels: Record<string,string> = { SUV:'SUV', Sedan:'Седан', Wagon:'Комби', Hatchback:'Хечбек', Coupe:'Купе', Minivan:'Миниван', Convertible:'Кабриолет' };
export const featuredVehicles: Vehicle[] = dealer.inventory.map((record, index) => {
  if (!Number.isFinite(record.price) || record.price <= 0) throw new Error(`Missing advertised price: ${record.id}`);
  return {
    id: index + 1, sourceId: record.id, verification: 'sample', evidenceUrl: record.sourceUrl,
    image: record.image, gallery: record.gallery, make: record.make, title: record.title,
    body: record.body, category: bodyLabels[record.body] ?? record.body,
    year: String(record.year), yearNumber: record.year, mileageKm: record.mileage,
    mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileage)} км`,
    fuel: record.fuel, transmission: record.transmission, condition: 'used',
    equipment: record.features.filter((value): value is VehicleEquipment => equipmentOptions.includes(value as VehicleEquipment)),
    priceEur: record.price, href: `/listing-detail-v1/${index + 1}`,
    sourceStatus: statusLabels[record.sourceStatus] ?? 'Статус за потвърждение', taxNote: record.taxNote,
    description: record.note, observedAt: record.observedAt
  };
});
export const formatVehiclePrice = (priceEur: number | null) => typeof priceEur === 'number' && Number.isFinite(priceEur) && priceEur > 0 ? `${new Intl.NumberFormat('bg-BG').format(priceEur)} €` : 'Цена при запитване';
