import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
import source from './navara-data.json';

const business = source.business;
const location = business.address;
const mapQuery = encodeURIComponent(`${business.name}, ${location}`);
// Internal export names are retained for the master component contracts, not dealer identity.
export const daynightSite = {
  name: business.name,
  shortName: business.name,
  phone: business.phoneE164,
  phoneLabel: business.phoneDisplay,
  email: '',
  location,
  locationShort: 'Кайсиева градина, Варна',
  hoursLabel: 'Работно време не е публикувано. Уточнете посещението по телефона.',
  mapEmbedSrc: `https://www.google.com/maps?q=${mapQuery}&z=14&hl=bg&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  mapLabel: `${business.name} — търсене по публикувания адрес; точният вход се уточнява`,
  sourceInventory: business.marketplaceUrl,
  inventoryCount: source.vehicles.length,
  logoLight: '/navara/wordmark-light.svg',
  logoDark: '/navara/wordmark.svg',
  primaryCta: 'Виж автомобилите от обявите',
  sellCarCta: 'Въпрос за автомобил',
  accountCta: 'Контакт с продавача',
  phoneCta: 'Уточни оглед по телефона',
  heroTitle: business.name,
  heroSubtitle: 'Автомобили въвъв Варна · Селекция от обяви към 08.09.2026 г.',
  reviewCount: daynightReviewCount,
  reviewCountLabel: daynightReviewCountLabel,
  reviewLinkLabel: daynightReviewLinkLabel,
  inventoryNotice: source.inventoryNotice,
  previewNotice: source.previewNotice,
  observedAt: source.observedAt,
  directions: business.directions
} as const;

export const publicNavItems = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Друг автомобил', href: '/sell-your-car' },
  { label: 'Услуги', href: '/services' },
  { label: 'За нас', href: '/about' },
  { label: 'Полезно', href: '/blog' },
  { label: 'Контакти', href: '/contact' }
] as const;
export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory', children: [
    { label: 'Автомобили от обявите', href: '/inventory' },
    { label: 'Адрес на автокъщата', href: '/inventory/map' },
    { label: 'Сравнение', href: '/compare' },
    { label: 'Калкулатор', href: '/calculator' }
  ] },
  { label: 'Друг автомобил', href: '/sell-your-car', children: [
    { label: 'Попитай за възможността', href: '/sell-your-car' },
    { label: 'Подготви въпрос — демо', href: '/sell-your-car/request' }
  ] },
  { label: 'Услуги', href: '/services', children: [
    { label: 'Публикувани услуги', href: '/services' },
    { label: 'Лизинг по запитване', href: '/financing' },
    { label: 'Въпроси и отговори', href: '/faq' }
  ] },
  { label: 'За нас', href: '/about', children: [
    { label: `За ${business.name}`, href: '/about' },
    { label: 'Контакт с екипа', href: '/team' },
    { label: 'За отзивите', href: '/reviews' },
    { label: 'Полезно преди оглед', href: '/blog' },
    { label: 'За демонстрацията', href: '/terms' }
  ] },
  { label: 'Контакти', href: '/contact' }
] as const;
export const footerNavItems = [
  { label: 'Автомобили от обявите', href: '/inventory' },
  { label: 'Адрес на автокъщата', href: '/inventory/map' },
  { label: 'Лизинг по запитване', href: '/financing' },
  { label: 'Калкулатор', href: '/calculator' },
  { label: 'Въпрос за друг автомобил', href: '/sell-your-car' },
  { label: 'Подготви въпрос — демо', href: '/sell-your-car/request' },
  { label: 'Публикувани услуги', href: '/services' },
  { label: 'Въпроси и отговори', href: '/faq' }
] as const;
