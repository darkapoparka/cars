import { brandArtwork, volkswagenArtwork } from './make-artwork';
import { featuredVehicles } from './inventory';
import { bodyLabel } from './listing';
import { blogPosts } from './editorial';
import { leadSite } from '$config/lead-site';

// Visible vehicle bounds align the cutouts without painting a background behind them.
const bodyArtwork = [
  { label: 'Седан', query: 'Sedan', image: '/assets/images/template/body-sedan-v2.webp', width: 768, height: 384, bounds: [14, 24, 754, 361] },
  { label: 'Хечбек', query: 'Hatchback', image: '/assets/images/template/body-hatchback-v2.webp', width: 768, height: 384, bounds: [13, 4, 750, 381] },
  { label: 'Пикап', query: 'Pickup Truck', image: '/assets/images/template/body-pickup-v2.webp', width: 768, height: 384, bounds: [6, 14, 764, 377] },
  { label: 'SUV', query: 'SUV', image: leadSite.artwork.vehicleCutouts.urus, width: 1000, height: 667, bounds: [18, 156, 983, 495] },
  { label: 'Кросоувър', query: 'Crossover', image: '/assets/images/icon-box/car-list5.png', width: 206, height: 95, bounds: [0, 0, 206, 95] },
  { label: 'Миниван', query: 'Minivan', image: '/assets/images/icon-box/car-list6.png', width: 140, height: 80, bounds: [0, 0, 140, 80] },
  { label: 'Комби', query: 'Wagon', image: '/assets/images/template/body-wagon-v2.webp', width: 915, height: 429, bounds: [11, 69, 901, 358] },
  { label: 'Кабриолет', query: 'Convertible', image: '/assets/images/template/body-convertible-v2.webp', width: 768, height: 320, bounds: [18, 50, 756, 301] },
  { label: 'Купе', query: 'Coupe', image: leadSite.artwork.vehicleCutouts.porsche, width: 1000, height: 667, bounds: [12, 169, 987, 480] },
  { label: 'Спортбек', query: 'Sportback', image: leadSite.artwork.vehicleCutouts.amggt, width: 1000, height: 667, bounds: [14, 169, 980, 473] }
] as const;

// Mobile artwork overrides retain their supplied geometry and source colors.
// Audi's measured rings bounds omit its inherited wordmark in compact cards.
export const mobileBrandArtwork: Record<string, {
  image: string; width: number; height: number; bounds: readonly [number, number, number, number];
}> = {
  Audi: { image: '/assets/images/brand-curated/audi-rings-chrome-mobile.webp', width: 1800, height: 1200, bounds: [73, 90, 1726, 672] },
  BMW: { image: '/assets/images/brand-curated/bmw-roundel-cardog-mobile.svg', width: 512, height: 512, bounds: [78, 78, 434, 434] }
};

export const mobileBrandLabels: Record<string, string> = { 'Mercedes-Benz': 'Mercedes' };

// Desktop discovery retains the full template catalog.
const enabledBodyTypes = new Set(['Sedan', 'Hatchback', 'Pickup Truck', 'SUV', 'Wagon', 'Convertible', 'Coupe', 'Sportback']);
export const desktopBodyTypes = bodyArtwork.filter(item => enabledBodyTypes.has(item.query)).map(item => ({
  ...item, label: bodyLabel(item.query), count: featuredVehicles.filter(vehicle => vehicle.body === item.query).length
}));
export const desktopBrands = brandArtwork.map(item => ({
  ...item, count: featuredVehicles.filter(vehicle => vehicle.make === item.label).length
}));
export const bodyTypes = desktopBodyTypes.filter(item => item.count > 0);
export const brands = desktopBrands.filter(item => item.count > 0);

// Mobile Home features three round emblems; the full inventory remains available.
export const mobileFeaturedBrandLabels = ['Mercedes-Benz', 'BMW', 'Volkswagen'] as const;
export const homeBrandCards = [
  ...desktopBrands,
  {
    ...volkswagenArtwork,
    count: featuredVehicles.filter(vehicle => vehicle.make === 'Volkswagen').length
  }
];

const editorialSummaries: Record<number, string> = {
  1: 'История, документи и техническо състояние.',
  2: 'Търсене, транспорт и подготовка за регистрация.',
  3: 'Срок, първоначална вноска и обща цена.'
};

export const editorial = blogPosts.slice(0, 3).map(post => ({
  title: post.title, text: editorialSummaries[post.id] ?? post.text, image: post.image,
  href: `/blog-detail/${post.id}`, meta: 'Полезно', category: post.category
}));
