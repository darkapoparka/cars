import stock from './dealer-stock.json';

export type VehicleEquipment =
  | 'Apple CarPlay' | 'Android Auto' | '360° камера' | '4x4' | 'Кожен салон'
  | 'Камера за заден ход' | 'Парктроник' | 'Навигация' | 'Климатроник'
  | 'Подгрев на седалките' | 'Адаптивен круиз контрол' | 'Панорамен покрив'
  | 'Въздушно окачване' | 'Head-up дисплей' | 'ISOFIX' | 'LED фарове'
  | 'Ел. седалки с памет' | 'Асистент мъртва зона';
export type VehicleTransmission = 'Automatic' | 'Manual';
export type VehicleBody = 'SUV' | 'Sedan' | 'Wagon' | 'Coupe' | 'Hatchback';
export type VehicleVerificationStatus = 'sample' | 'verified' | 'unverified';
export type Vehicle = {
  id: number; slug: string; name: string; category: string; year: string; mileage: string; fuel: string;
  transmission: VehicleTransmission; body: VehicleBody; price: number; priceCurrency: 'EUR';
  image: string; imageAlt: string; gallery: string[]; description: string; equipment: VehicleEquipment[];
  verification: { status: VehicleVerificationStatus; sourceId: string; evidenceUrl: string; verifiedAt: string };
  availabilityLabel: string; priceQualification: string;
};
const bodyMap: Record<string, VehicleBody> = { SUV: 'SUV', Sedan: 'Sedan', Wagon: 'Wagon', Coupe: 'Coupe', Hatchback: 'Hatchback' };
const allowedEquipment = new Set<VehicleEquipment>(['Apple CarPlay','Android Auto','360° камера','4x4','Кожен салон','Камера за заден ход','Парктроник','Навигация','Климатроник','Подгрев на седалките','Адаптивен круиз контрол','Панорамен покрив','Въздушно окачване','Head-up дисплей','ISOFIX','LED фарове','Ел. седалки с памет','Асистент мъртва зона']);
const placeholder = '/brand/inventory-photo-pending.svg';
const slug = (title: string, sourceId: string) => `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${sourceId}`;
export const vehicles: Vehicle[] = stock.listings.map((record, index) => ({
  id: index + 1,
  slug: slug(record.title, record.sourceId),
  name: record.title,
  category: 'cars',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  fuel: record.fuel,
  transmission: record.transmission === 'Автоматик' ? 'Automatic' : 'Manual',
  body: bodyMap[record.category] ?? 'Sedan',
  price: record.priceEur,
  priceCurrency: 'EUR',
  image: placeholder,
  imageAlt: `Няма интегрирана разрешена снимка за ${record.title}; вижте източника на обявата.`,
  gallery: [placeholder],
  description: `${record.description} Данни от обява към ${record.observedAt}; наличността и състоянието не са независимо потвърдени.`,
  equipment: record.equipment.filter((value): value is VehicleEquipment => allowedEquipment.has(value as VehicleEquipment)),
  verification: { status: 'sample', sourceId: record.sourceId, evidenceUrl: record.evidenceUrl, verifiedAt: record.observedAt },
  availabilityLabel: record.availability === 'sold-reserved' ? 'Продаден/капариран по обявата' : 'Обявен автомобил — потвърдете наличността',
  priceQualification: record.priceQualification,
}));
export const inventorySource = { observedAt: stock.observedAt, source: stock.source, meaning: stock.meaning } as const;
export const findVehicle = (id: number) => vehicles.find((vehicle) => vehicle.id === id);
export const findVehicleBySlug = (value: string) => vehicles.find((vehicle) => vehicle.slug === value);
export const formatVehiclePrice = (vehicle: Pick<Vehicle, 'price'>) => vehicle.price > 0 ? `${new Intl.NumberFormat('bg-BG').format(vehicle.price)} €` : 'Цена при запитване';
