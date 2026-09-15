import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';

// Visible vehicle bounds align mobile artwork; the opaque wagon uses its visible silhouette.
const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/icon-box/car-list1.png', width: 180, height: 80, bounds: [9, 11, 171, 70] },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/icon-box/car-list2.png', width: 180, height: 80, bounds: [12, 8, 168, 71] },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/icon-box/car-list3.png', width: 180, height: 80, bounds: [11, 13, 170, 71] },
  { label: 'SUV', query: 'SUV', image: '/assets/images/lead/day-night-cutout-urus-v1.webp', width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95, bounds: [0, 0, 206, 95] },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80, bounds: [0, 0, 140, 80] },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/template/body-wagon-v1.png', width: 1832, height: 858, bounds: [22, 138, 1800, 716] },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/icon-box/car-list8.png', width: 180, height: 80, bounds: [11, 15, 170, 63] },
  { label: 'Купе', query: 'Coupe', image: '/assets/images/lead/day-night-cutout-porsche-v1.webp', width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  { label: 'Спортбек', query: 'Sportback', image: '/assets/images/lead/day-night-cutout-amggt-v1.webp', width: 1000, height: 667, bounds: [14, 169, 980, 473] }
] as const;

const brandArtwork = [
  { label: 'Land Rover', image: '/assets/images/partner/partner1.png', width: 210, height: 183, bounds: [13, 43, 197, 140] },
  { label: 'Kia', image: '/assets/images/partner/partner2.png', width: 210, height: 120, bounds: [3, 36, 207, 85] },
  { label: 'Toyota', image: '/assets/images/partner/partner3.png', width: 160, height: 80, bounds: [8, 20, 152, 59] },
  { label: 'Jeep', image: '/assets/images/partner/partner4.png', width: 210, height: 120, bounds: [20, 27, 190, 95] },
  { label: 'Nissan', image: '/assets/images/partner/partner5.png', width: 216, height: 156, bounds: [36, 20, 177, 138] },
  { label: 'Ford', image: '/assets/images/partner/partner6.png', width: 210, height: 120, bounds: [3, 24, 207, 96] },
  { label: 'Foton', image: '/assets/images/partner/parner7.png', width: 184, height: 104, bounds: [42, 23, 142, 81] },
  { label: 'Mercedes-Benz', image: '/assets/images/partner/parner8.png', width: 140, height: 80, bounds: [33, 3, 107, 77] },
  { label: 'Dongfeng', image: '/assets/images/partner/parner9.png', width: 140, height: 80, bounds: [12, 10, 128, 70] },
  { label: 'Isuzu', image: '/assets/images/partner/parner10.png', width: 140, height: 80, bounds: [11, 10, 129, 70] },
  { label: 'Audi', image: '/assets/images/partner/parner11.png', width: 140, height: 80, bounds: [8, 18, 132, 62] },
  { label: 'BMW', image: '/assets/images/partner/parner12.png', width: 140, height: 80, bounds: [33, 3, 107, 77] }
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
  href: `/blog-detail/${post.id}`, meta: 'Полезно', category: post.category
}));
