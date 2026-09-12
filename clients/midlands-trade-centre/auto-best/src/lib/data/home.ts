import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';

const bodyArtwork = [
  { label: 'Sedan', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Hatchback', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Pickup truck', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Crossover', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Minivan', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Estate', query: 'Wagon', image: '/assets/images/template/body-wagon-v1.png', width: 1832, height: 858 },
  { label: 'Convertible', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Coupe', query: 'Coupe', image: '/assets/images/lead/day-night-cutout-porsche-v1.webp', width: 1000, height: 667 },
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

// Template discovery is independent of the current sample inventory.
const enabledBodyTypes = new Set(['Sedan', 'Hatchback', 'Pickup Truck', 'SUV', 'Wagon', 'Convertible', 'Coupe', 'Sportback']);
export const bodyTypes = bodyArtwork.filter(item => enabledBodyTypes.has(item.query)).map(item => ({
  ...item, label: bodyLabel(item.query), count: featuredVehicles.filter(vehicle => vehicle.body === item.query).length
}));
export const brands = brandArtwork.map(item => ({
  ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length
}));

export const editorial = blogPosts.slice(0, 3).map(post => ({
  title: post.title, text: post.text, image: post.image,
  href: `/blog-detail/${post.id}`, meta: 'Advice', category: post.category
}));
