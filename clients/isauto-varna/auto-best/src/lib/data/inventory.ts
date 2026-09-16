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
};

const inventoryRecords: Omit<Vehicle, 'year' | 'mileage' | 'href' | 'verification'>[] = [
  { id: 1, image: '/dealer/inventory-1.webp', category: 'Купе', body: 'Coupe', make: 'Audi', title: 'Audi R8 Performance V10', yearNumber: 2021, mileageKm: 75000, fuel: 'Бензин', transmission: 'Автоматик', equipment: [], condition: 'used', priceEur: 148224, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-r8-perfomance-v10-bang-olufsen-audi-keramik-carbon-10' },
  { id: 2, image: '/dealer/inventory-2.webp', category: 'SUV', body: 'SUV', make: 'Audi', title: 'Audi Q7 50 TDI', yearNumber: 2022, mileageKm: 57500, fuel: 'Дизел', transmission: 'Автоматик', equipment: ["4x4","360° камера","Подгряване на седалки","Навигация","Парктроник"], condition: 'used', priceEur: 67439, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-q7-50tdi-virtual-podgrev-4-zoni-kamera360-9' },
  { id: 3, image: '/dealer/inventory-3.webp', category: 'Седан', body: 'Sedan', make: 'BMW', title: 'BMW M5', yearNumber: 2018, mileageKm: 61000, fuel: 'Бензин', transmission: 'Автоматик', equipment: ["4x4","Навигация","Парктроник","Безключов достъп"], condition: 'used', priceEur: 71530, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-m5-keramika-xdrive-m-sport-bowers-wilk-adaptiveled-8' },
  { id: 4, image: '/dealer/inventory-4.webp', category: 'SUV', body: 'SUV', make: 'BMW', title: 'BMW X5 xDrive', yearNumber: 2014, mileageKm: 196000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ["4x4","Панорамен покрив","Подгряване на седалки"], condition: 'used', priceEur: 24491, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-x5-xdrive-sport-podgrev-panorama-6-1-7' },
  { id: 5, image: '/dealer/inventory-5.webp', category: 'Седан', body: 'Sedan', make: 'BMW', title: 'BMW 750 M Performance', yearNumber: 2019, mileageKm: 167000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ["Навигация","Парктроник","Безключов достъп"], condition: 'used', priceEur: 61304, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/bmw-750-m-perfomance-laser-alkantar-virtual-harman-kardon-3' },
  { id: 6, image: '/dealer/inventory-6.webp', category: 'Спортбек', body: 'Sportback', make: 'Audi', title: 'Audi A5 Sportback 2.0 TDI', yearNumber: 2018, mileageKm: 175000, fuel: 'Дизел', transmission: 'Автоматик', equipment: ["Подгряване на седалки","Навигация","Парктроник"], condition: 'used', priceEur: 19900, evidenceUrl: 'https://www.isauto.net/avtomobili-i-djipove/audi-a5-sportback-2-0tdi-sline-ambient-virtual-podgrev-pdc-f1-745' }
];

export const featuredVehicles: Vehicle[] = inventoryRecords.map(record => ({
  ...record,
  verification: 'verified',
  year: String(record.yearNumber),
  mileage: `${new Intl.NumberFormat('bg-BG').format(record.mileageKm)} км`,
  href: `/listing-detail-v1/${record.id}`
}));

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
