import dealerPack from './dealer-pack.json';

export type VehicleCondition = 'new' | 'used';
export type VehicleEquipment =
  | '4x4'
  | '360° камера'
  | 'Панорамен покрив'
  | 'Подгряване на седалки'
  | 'Навигация'
  | 'Парктроник'
  | 'Безключов достъп'
  | 'Адаптивен круиз контрол'
  | 'Климатроник'
  | 'ISOFIX'
  | 'Камера заден ход'
  | 'LED фарове';

export type Vehicle = {
  id: number;
  verification: 'sample' | 'verified';
  evidenceUrl: string;
  sourceId: string;
  observedAt: string;
  availability: string;
  images: readonly string[];
  powerHp: number | null;
  engineCc: number | null;
  euro: string;
  color: string;
  seats: number | null;
  vatLabel: string;
  notes: readonly string[];
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


// Dated seller advertisements, not a live feed or independently verified stock.
export const featuredVehicles: Vehicle[] = dealerPack.inventory.map((record) => ({
  id: record.id,
  verification: 'sample' as const,
  evidenceUrl: record.sourceUrl,
  sourceId: record.sourceId,
  observedAt: record.observedAt,
  availability: 'Потвърдете наличността с продавача',
  image: record.thumbnail || record.photos[0],
  images: record.photos,
  category: record.bodyLabel,
  body: record.body,
  make: record.make,
  title: record.title,
  year: String(record.year),
  yearNumber: record.year,
  mileage: new Intl.NumberFormat('bg-BG').format(record.mileage) + ' км',
  mileageKm: record.mileage,
  fuel: record.fuelLabel,
  transmission: record.transmissionLabel,
  equipment: record.equipment as VehicleEquipment[],
  condition: 'used' as const,
  priceEur: record.price,
  powerHp: record.powerHp,
  engineCc: record.engineCc,
  euro: record.euro,
  color: record.color,
  seats: record.seats,
  vatLabel: record.vat === 'included' ? 'ДДС е включен според обявата' : 'ДДС не се начислява според обявата',
  notes: record.notes,
  href: ('/listing-detail-v1/' + record.id) as Vehicle['href']
}));

export const inventoryNotice = dealerPack.dealer.stockNotice;
export const formatVehiclePrice = (priceEur: number | null | undefined) =>
  priceEur == null || !Number.isFinite(priceEur) ? 'Цена при запитване' :
  new Intl.NumberFormat('bg-BG', { maximumFractionDigits: 2 }).format(priceEur) + ' €';
