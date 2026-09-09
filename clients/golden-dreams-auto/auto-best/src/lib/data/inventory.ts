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

export const featuredVehicles: Vehicle[] = [{
  id: 1,
  verification: 'sample',
  evidenceUrl: 'https://bazar.bg/obiava-55965789/mercedes-benz-cla-180-96000km',
  image: '/dealer/stock/cla-demo.svg',
  gallery: ['/dealer/stock/cla-demo.svg'],
  disclosure: 'Публичната обява е обновена на 09.09.2026 г. Наличността и точният адрес се потвърждават с GoldenDreams AUTO. Илюстрацията тук не е снимка на автомобила.',
  taxText: 'Не се начислява ДДС',
  category: 'Седан',
  body: 'Sedan',
  make: 'Mercedes-Benz',
  title: 'Mercedes-Benz CLA 180',
  year: '2013',
  yearNumber: 2013,
  mileage: '96 000 км',
  mileageKm: 96000,
  fuel: 'Бензин',
  transmission: 'Ръчна',
  equipment: ['Навигация', 'Парктроник'],
  condition: 'used',
  priceEur: 12500,
  href: '/listing-detail-v1/1'
}];

export const formatVehiclePrice = (priceEur: number) =>
  `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
