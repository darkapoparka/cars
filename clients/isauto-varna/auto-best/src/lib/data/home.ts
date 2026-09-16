import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';

const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 180, height: 80, bounds: [9, 11, 171, 70] },
  { label: 'SUV', query: 'SUV', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95, bounds: [0, 0, 206, 95] },
  { label: 'Купе', query: 'Coupe', image: '/assets/images/icon-box/car-list8.png', width: 180, height: 80, bounds: [11, 15, 170, 63] },
  { label: 'Спортбек', query: 'Sportback', image: '/assets/images/icon-box/car-list2.png', width: 180, height: 80, bounds: [12, 8, 168, 71] }
] as const;
const brandArtwork = [
  { label: 'Audi', image: '/assets/images/partner/parner11.png', width: 140, height: 80, bounds: [8, 18, 132, 62] },
  { label: 'BMW', image: '/assets/images/partner/parner12.png', width: 140, height: 80, bounds: [33, 3, 107, 77] }
] as const;
export const bodyTypes = bodyArtwork.map(item => ({ ...item, label: bodyLabel(item.query), count: featuredVehicles.filter(vehicle => vehicle.body === item.query).length }));
export const brands = brandArtwork.map(item => ({ ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length }));
export const editorial = blogPosts.slice(0, 3).map(post => ({ title: post.title, text: post.text, image: post.image, href: `/blog-detail/${post.id}`, meta: 'Полезно', category: post.category }));
