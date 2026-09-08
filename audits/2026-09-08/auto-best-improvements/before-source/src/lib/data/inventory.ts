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

// Equipment facets are limited to recurring features published in Day & Night's
// current adverts for these model families (daynight.mobile.bg, checked 2026-08-30).
export const featuredVehicles: Vehicle[] = [
  { id: 1, image: '/assets/images/lead/day-night-stock-04.webp', category: 'Комби', body: 'Wagon', make: 'Audi', title: 'Audi RS 6 Avant', year: '2024', yearNumber: 2024, mileage: '99 701 км', mileageKm: 99701, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 68804, href: '/listing-detail-v1/1' },
  { id: 2, image: '/assets/images/lead/day-night-stock-01.webp', category: 'SUV купе', body: 'SUV', make: 'Mercedes-Benz', title: 'Mercedes-Benz GLE Coupé', year: '2021', yearNumber: 2021, mileage: '96 865 км', mileageKm: 96865, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 55403, href: '/listing-detail-v1/2' },
  { id: 3, image: '/assets/images/lead/day-night-stock-06.webp', category: 'SUV', body: 'SUV', make: 'Audi', title: 'Audi RS Q8', year: '2021', yearNumber: 2021, mileage: '94 709 км', mileageKm: 94709, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп', 'Адаптивен круиз контрол'], condition: 'used', priceEur: 57480, href: '/listing-detail-v1/3' },
  { id: 4, image: '/assets/images/lead/day-night-stock-02.webp', category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 M Sport', year: '2021', yearNumber: 2021, mileage: '62 485 км', mileageKm: 62485, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 54223, href: '/listing-detail-v1/4' },
  { id: 5, image: '/assets/images/lead/day-night-stock-05.webp', category: 'SUV', body: 'SUV', make: 'Land Rover', title: 'Range Rover Sport', year: '2019', yearNumber: 2019, mileage: '84 426 км', mileageKm: 84426, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 68313, href: '/listing-detail-v1/5' },
  { id: 6, image: '/assets/images/lead/day-night-stock-03.webp', category: 'Спортбек', body: 'Sportback', make: 'Mercedes-Benz', title: 'Mercedes-AMG GT 4-Door', year: '2020', yearNumber: 2020, mileage: '72 812 км', mileageKm: 72812, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 61069, href: '/listing-detail-v1/6' },
  { id: 7, image: '/assets/images/lead/day-night-stock-02.webp', category: 'SUV купе', body: 'SUV', make: 'BMW', title: 'BMW X6 xDrive', year: '2020', yearNumber: 2020, mileage: '76 346 км', mileageKm: 76346, fuel: 'Дизел', transmission: 'Автоматик', equipment: ['4x4', '360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 85635, href: '/listing-detail-v1/7' },
  { id: 8, image: '/assets/images/lead/day-night-stock-03.webp', category: 'Спортбек', body: 'Coupe', make: 'Mercedes-Benz', title: 'Mercedes-AMG GT Coupé', year: '2023', yearNumber: 2023, mileage: '49 584 км', mileageKm: 49584, fuel: 'Бензин', transmission: 'Автоматик', equipment: ['360° камера', 'Панорамен покрив', 'Подгряване на седалки', 'Навигация', 'Парктроник', 'Безключов достъп'], condition: 'used', priceEur: 51365, href: '/listing-detail-v1/8' }
];

export const formatVehiclePrice = (priceEur: number) => `${new Intl.NumberFormat('bg-BG').format(priceEur)} €`;
