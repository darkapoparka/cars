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
  note?: string;
};

const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
  { id: 1, evidenceUrl: 'https://kunchev-auto.mobile.bg/', image: '/assets/images/lead/day-night-stock-01.webp', category: 'Комби', body: 'Wagon', make: 'Mercedes-Benz', title: 'Mercedes-Benz E 220 D 4MATIC All-Terrain', yearNumber: 2017, mileageKm: 265000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4','Навигация','Парктроник'], condition: 'used', priceEur: 11900 },
  { id: 2, evidenceUrl: 'https://kunchev-auto.mobile.bg/', image: '/assets/images/lead/day-night-stock-02.webp', category: 'Хечбек', body: 'Hatchback', make: 'Subaru', title: 'Subaru Impreza 2.0D 150 к.с.', yearNumber: 2010, mileageKm: 241000, fuel: 'Дизел', transmission: 'Ръчна', equipment: ['Навигация','Парктроник'], condition: 'used', priceEur: 1600, note: 'Публикувано: има теч на масло.' },
  { id: 3, evidenceUrl: 'https://kunchev-auto.mobile.bg/', image: '/assets/images/lead/day-night-stock-03.webp', category: 'Комби', body: 'Wagon', make: 'Renault', title: 'Renault Clio 1.5 dCi 75 к.с.', yearNumber: 2017, mileageKm: 98000, fuel: 'Дизел', transmission: 'Ръчна', equipment: ['Навигация','Парктроник'], condition: 'used', priceEur: 5100 },
  { id: 4, evidenceUrl: 'https://kunchev-auto.mobile.bg/', image: '/assets/images/lead/day-night-stock-04.webp', category: 'SUV', body: 'SUV', make: 'Ford', title: 'Ford EcoSport 1.5 90 к.с.', yearNumber: 2014, mileageKm: 153000, fuel: 'Дизел', transmission: 'Ръчна', equipment: ['Парктроник'], condition: 'used', priceEur: 5900 },
  { id: 5, evidenceUrl: 'https://kunchev-auto.mobile.bg/', image: '/assets/images/lead/day-night-stock-05.webp', category: 'Комби', body: 'Wagon', make: 'Volkswagen', title: 'VW Passat 2.0 TDI 150 к.с.', yearNumber: 2017, mileageKm: 277000, fuel: 'Дизел', transmission: 'Ръчна', equipment: ['Навигация','Парктроник','Подгряване на седалки'], condition: 'used', priceEur: 9950 },
  { id: 6, evidenceUrl: 'https://kunchev-auto.mobile.bg/obiava-21768573613010445-jeep-grand-cherokee-3-0d-190k-s-4h4', image: '/assets/images/lead/day-night-stock-06.webp', category: 'SUV', body: 'SUV', make: 'Jeep', title: 'Jeep Grand Cherokee 3.0D 190 к.с. 4x4', yearNumber: 2013, mileageKm: 214000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4','Навигация'], condition: 'used', priceEur: 7900 },
  { id: 7, evidenceUrl: 'https://kunchev-auto.mobile.bg/obiava-21764858936024534-bmw-x5-3-0d-258k-s-x-drive-head-up-m-pack-panorama', image: '/assets/images/lead/day-night-stock-02.webp', category: 'SUV', body: 'SUV', make: 'BMW', title: 'BMW X5 3.0d 258 к.с. xDrive M-Pack', yearNumber: 2014, mileageKm: 214000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4','Панорамен покрив','Навигация','Парктроник','Подгряване на седалки'], condition: 'used', priceEur: 14500 },
  { id: 8, evidenceUrl: 'https://kunchev-auto.mobile.bg/obiava-11774000802983145-mercedes-benz-e-220-d-194k-s-business-sport', image: '/assets/images/lead/day-night-stock-01.webp', category: 'Седан', body: 'Sedan', make: 'Mercedes-Benz', title: 'Mercedes-Benz E 220 D 194 к.с. Business Sport', yearNumber: 2016, mileageKm: 198000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['Навигация','Парктроник','Безключов достъп','Подгряване на седалки'], condition: 'used', priceEur: 15100 }
];

export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'sample',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
