import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';
import { leadSite } from '$config/lead-site';

// Visible vehicle bounds align mobile artwork; the opaque wagon uses its visible silhouette.
const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/template/body-sedan-v2.webp', width: 768, height: 384, bounds: [14, 24, 754, 361] },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/template/body-hatchback-v2.webp', width: 768, height: 384, bounds: [13, 4, 750, 381] },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/template/body-pickup-v2.webp', width: 768, height: 384, bounds: [6, 14, 764, 377] },
  { label: 'SUV', query: 'SUV', image: leadSite.artwork.vehicleCutouts.urus, width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95, bounds: [0, 0, 206, 95] },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80, bounds: [0, 0, 140, 80] },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/template/body-wagon-v1.webp', width: 916, height: 429, bounds: [11, 69, 900, 358] },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/template/body-convertible-v2.webp', width: 768, height: 320, bounds: [18, 50, 756, 301] },
  { label: 'Купе', query: 'Coupe', image: leadSite.artwork.vehicleCutouts.porsche, width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  { label: 'Спортбек', query: 'Sportback', image: leadSite.artwork.vehicleCutouts.amggt, width: 1000, height: 667, bounds: [14, 169, 980, 473] }
] as const;

const brandArtwork = [
  { label: 'Land Rover', image: '/assets/images/brand-curated/land-rover-classic.png', width: 210, height: 183, bounds: [13, 43, 197, 140] },
  { label: 'Kia', image: '/assets/images/partner/partner2.png', width: 210, height: 120, bounds: [3, 36, 207, 85] },
  { label: 'Toyota', image: '/assets/images/partner/partner3.png', width: 160, height: 80, bounds: [8, 20, 152, 59] },
  { label: 'Jeep', image: '/assets/images/partner/partner4.png', width: 210, height: 120, bounds: [20, 27, 190, 95] },
  { label: 'Nissan', image: '/assets/images/partner/partner5.png', width: 216, height: 156, bounds: [36, 20, 177, 138] },
  { label: 'Ford', image: '/assets/images/partner/partner6.png', width: 210, height: 120, bounds: [3, 24, 207, 96] },
  { label: 'Foton', image: '/assets/images/partner/parner7.png', width: 184, height: 104, bounds: [42, 23, 142, 81] },
  { label: 'Mercedes-Benz', image: '/assets/images/brand-curated/mercedes-benz-star-chrome.webp', width: 240, height: 180, bounds: [40, 10, 200, 170] },
  { label: 'Dongfeng', image: '/assets/images/partner/parner9.png', width: 140, height: 80, bounds: [12, 10, 128, 70] },
  { label: 'Isuzu', image: '/assets/images/partner/parner10.png', width: 140, height: 80, bounds: [11, 10, 129, 70] },
  { label: 'Audi', image: '/assets/images/brand-curated/audi-rings-silver-cardog.svg', width: 424, height: 164, bounds: [0, 0, 424, 164] },
  { label: 'BMW', image: '/assets/images/partner/parner12.png', width: 140, height: 80, bounds: [33, 3, 107, 77] }
] as const;

// Mobile uses the inherited chrome rings alongside the chrome star and BMW roundel.
// The unchanged source includes a wordmark; measured rings bounds keep the card compact.
export const mobileBrandArtwork: Record<string, {
  image: string; width: number; height: number; bounds: readonly [number, number, number, number];
}> = {
  Audi: { image: '/assets/images/brand-curated/audi-rings-chrome-mobile.webp', width: 1800, height: 1200, bounds: [73, 90, 1726, 672] }
};

// Desktop discovery retains the full template catalog; mobile shortcuts follow stock.
const enabledBodyTypes = new Set(['Sedan', 'Hatchback', 'Pickup Truck', 'SUV', 'Wagon', 'Convertible', 'Coupe', 'Sportback']);
export const desktopBodyTypes = bodyArtwork.filter(item => enabledBodyTypes.has(item.query)).map(item => ({
  ...item, label: bodyLabel(item.query), count: featuredVehicles.filter(vehicle => vehicle.body === item.query).length
}));
export const desktopBrands = brandArtwork.map(item => ({
  ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length
}));
export const bodyTypes = desktopBodyTypes.filter(item => item.count > 0);
export const brands = desktopBrands.filter(item => item.count > 0);

const editorialSummaries: Record<number, string> = {
  1: 'История, документи и техническо състояние.',
  2: 'Търсене, транспорт и подготовка за регистрация.',
  3: 'Срок, първоначална вноска и обща цена.'
};

export const editorial = blogPosts.slice(0, 3).map(post => ({
  title: post.title, text: editorialSummaries[post.id] ?? post.text, image: post.image,
  href: `/blog-detail/${post.id}`, meta: 'Полезно', category: post.category
}));
