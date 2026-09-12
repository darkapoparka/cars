import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { brand } from '$config/brand';

const bodyArtwork = [
  { label: 'Sedan', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Hatchback', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Pickup', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Crossover', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Minivan', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Wagon', query: 'Wagon', image: '/assets/images/icon-box/car-list7.png', width: 140, height: 80 },
  { label: 'Convertible', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Body style', query: 'Coupe', image: '/assets/images/lead/day-night-cutout-porsche-v1.webp', width: 1000, height: 667 },
  { label: 'Sportback', query: 'Sportback', image: '/assets/images/lead/day-night-cutout-amggt-v1.webp', width: 1000, height: 667 }
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

export const editorial = [
  {
    title: `Visit Texas Drive Auto in ${brand.city}`,
    text: `${brand.address}. ${brand.appointment}. Call to confirm the vehicle and your visit.`,
    image: '/office.webp',
    href: '/contact',
    meta: 'Resources',
    category: 'Guide'
  },
  {
    title: 'What can we check before buying?',
    text: 'Ask which vehicle history records and documents are available, and whether an independent inspection can be arranged before you decide.',
    image: '/stock/127361925-1.webp',
    href: '/blog-detail/1',
    meta: 'Resources',
    category: 'Guide'
  },
  {
    title: 'Can a vehicle be imported to order?',
    text: 'Custom import services are not confirmed in this preview. Ask whether any options are available for your model, budget and feature preferences.',
    image: '/stock/127361904-1.webp',
    href: '/blog-detail/2',
    meta: 'Resources',
    category: 'Guide'
  }
] as const;
