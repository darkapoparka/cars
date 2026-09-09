import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Купе', query: 'Coupe', image: '/assets/images/lead/day-night-cutout-porsche-v1.webp', width: 1000, height: 667 },
  { label: 'Спортбек', query: 'Sportback', image: '/assets/images/lead/day-night-cutout-amggt-v1.webp', width: 1000, height: 667 }
] as const;

const brandArtwork = [
  { label: 'Land Rover', image: '/assets/images/partner/partner1.png' },
  { label: 'Kia', image: '/assets/images/partner/partner2.png' },
  { label: 'Toyota', image: '/assets/images/partner/partner3.png' },
  { label: 'Jeep', image: '/assets/images/partner/partner4.png' },
  { label: 'Nissan', image: '/assets/images/partner/partner5.png' },
  { label: 'Ford', image: '/assets/images/partner/partner6.png' },
  { label: 'Foton', image: '/assets/images/partner/parner7.png' },
  { label: 'Mercedes-Benz', image: '/assets/images/partner/parner8.png' },
  { label: 'Dongfeng', image: '/assets/images/partner/parner9.png' },
  { label: 'Isuzu', image: '/assets/images/partner/parner10.png' },
  { label: 'Audi', image: '/assets/images/partner/parner11.png' },
  { label: 'BMW', image: '/assets/images/partner/parner12.png' }
] as const;

export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});
export const brands = brandArtwork.filter(item => featuredVehicles.some(vehicle => vehicle.make === item.label))
  .map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));

// Copy only: preserve the master's three-card composition and illustration slots.
// Source: https://dangerauto.mobile.bg/contacts and the dated dealer advertisements.
// Illustrations retained from the master are not photographs of this dealership.
export const editorial = [
  {
    title: `Как да уговорите оглед в ${brand.city}?`,
    text: `${brand.name} е в Горубляне. Потвърдете наличността, адреса и часа за посещение по телефона преди пътуване.`,
    image: '/assets/images/lead/day-night-guide-inspection.webp',
    href: '/contact?topic=inspection',
    meta: 'Посещение',
    category: 'Полезно'
  },
  {
    title: 'Какво да уточните преди покупка?',
    text: 'Поискайте документи за историята и състоянието на избрания автомобил и обсъдете възможност за независим оглед.',
    image: '/assets/images/lead/day-night-guide-import.webp',
    href: '/blog-detail/1',
    meta: 'Преди оглед',
    category: 'Ръководство'
  },
  {
    title: 'Предлага ли се собствен лизинг?',
    text: 'Дилърът посочва финансиране през банка, а не собствен лизинг. Поискайте индивидуална писмена оферта с всички разходи и условия.',
    image: '/assets/images/lead/day-night-guide-leasing.webp',
    href: '/contact?topic=leasing',
    meta: 'Банково финансиране',
    category: 'Полезно'
  }
] as const;
