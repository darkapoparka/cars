import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 150, height: 80 },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 140, height: 80 },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 140, height: 80 },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list4.png', width: 166, height: 96 },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95 },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80 },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/template/body-wagon-v1.png', width: 1832, height: 858 },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 152, height: 92 },
  { label: 'Купе', query: 'Coupe', image: '/assets/images/lead/day-night-cutout-porsche-v1.webp', width: 1000, height: 667 },
  { label: 'Спортбек', query: 'Sportback', image: '/assets/images/lead/day-night-cutout-amggt-v1.webp', width: 1000, height: 667 }
] as const;

const brandArtwork = [{"label": "Audi", "image": "/dealer/makes/audi.svg"}, {"label": "Citroen", "image": "/dealer/makes/citroen.svg"}, {"label": "Opel", "image": "/dealer/makes/opel.svg"}, {"label": "Peugeot", "image": "/dealer/makes/peugeot.svg"}, {"label": "VW", "image": "/dealer/makes/volkswagen.svg"}] as const;

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
  href: `/blog-detail/${post.id}`, meta: 'Полезно', category: post.category
}));
