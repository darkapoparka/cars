import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 }
] as const;

const brandArtwork = [
  { label: 'Mercedes-Benz', image: '/assets/images/partner/parner8.png' },
  { label: 'Jeep', image: '/assets/images/partner/partner4.png' },
  { label: 'Ford', image: '/assets/images/partner/partner6.png' },
  { label: 'BMW', image: '/assets/images/partner/parner12.png' },
  { label: 'Volkswagen', image: '/assets/images/partner/partner2.png' },
  { label: 'Renault', image: '/assets/images/partner/partner3.png' },
  { label: 'Subaru', image: '/assets/images/partner/partner5.png' }
] as const;

export const bodyTypes = [...new Set(featuredVehicles.map(vehicle => vehicle.body))].map(query => {
  const artwork = bodyArtwork.find(item => item.query === query) ?? bodyArtwork[0];
  return { ...artwork, query, label: bodyLabel(query), count: featuredVehicles.filter(vehicle => vehicle.body === query).length };
});
export const brands = brandArtwork.filter(item => featuredVehicles.some(vehicle => vehicle.make === item.label))
  .map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));

export const editorial = [
  {
    title: `Как да уговорите оглед в ${brand.city}?`,
    text: 'Изберете автомобил от демо каталога и потвърдете актуалната му наличност директно по телефона преди посещение.',
    image: '/assets/images/lead/day-night-guide-inspection.webp',
    href: '/contact',
    meta: 'Полезно',
    category: 'Ръководство'
  },
  {
    title: 'Какво да проверите преди покупка?',
    text: 'Пробег, документи, сервизна история и техническо състояние следва да се проверят за конкретния автомобил преди решение.',
    image: '/assets/images/blog/blog-1.jpg',
    href: '/blog-detail/1',
    meta: 'Полезно',
    category: 'Ръководство'
  }
] as const;
