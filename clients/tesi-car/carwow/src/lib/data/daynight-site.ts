import facts from './dealer-facts.json';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';

const location = `${facts.addressLine}, ${facts.city}`;
export const daynightSite = {
  name: facts.name,
  shortName: facts.shortName,
  phone: facts.primaryPhone,
  phoneLabel: facts.primaryPhoneDisplay,
  email: facts.email ?? '',
  location,
  locationShort: facts.city,
  hoursLabel: `По обявите: ${facts.hours.label}. Потвърдете по телефона.`,
  mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(facts.mapQuery)}&z=14&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facts.mapQuery)}`,
  mapLabel: `${facts.name}, ${facts.city} — потвърдете точния вход`,
  sourceInventory: facts.inventoryUrl,
  inventoryCount: facts.vehicles.length,
  logoLight: facts.logoPath,
  logoDark: facts.logoDarkPath,
  primaryCta: 'Разгледай автомобилите',
  sellCarCta: 'Запитване за ваш автомобил',
  accountCta: 'Контакти',
  phoneCta: 'Обади се за оглед',
  heroTitle: facts.latinName,
  heroSubtitle: facts.tagline,
  reviewCount: daynightReviewCount,
  reviewCountLabel: daynightReviewCountLabel,
  reviewLinkLabel: daynightReviewLinkLabel,
  demoNotice: facts.demoNotice,
  availabilityNotice: facts.availabilityNotice
} as const;

export const publicNavItems = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Запитване', href: '/sell-your-car' },
  { label: 'Услуги', href: '/services' },
  { label: 'За нас', href: '/about' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакти', href: '/contact' }
] as const;
export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory', children: [
    { label: 'Всички автомобили', href: '/inventory' },
    { label: 'Карта', href: '/inventory/map' },
    { label: 'Сравнение', href: '/compare' },
    { label: 'Калкулатор', href: '/calculator' }
  ] },
  { label: 'Запитване', href: '/sell-your-car', children: [
    { label: 'За вашия автомобил', href: '/sell-your-car' },
    { label: 'Подготовка на запитване', href: '/sell-your-car/request' }
  ] },
  { label: 'Услуги', href: '/services', children: [
    { label: 'Информация и услуги', href: '/services' },
    { label: 'Въпроси за финансиране', href: '/financing' },
    { label: 'ЧЗВ', href: '/faq' }
  ] },
  { label: 'За нас', href: '/about', children: [
    { label: `За ${facts.shortName}`, href: '/about' },
    { label: 'Екип', href: '/team' },
    { label: 'Отзиви', href: '/reviews' },
    { label: 'Блог', href: '/blog' },
    { label: 'За демонстрацията', href: '/terms' }
  ] },
  { label: 'Контакти', href: '/contact' }
] as const;
export const footerNavItems = [
  { label: 'Публикувани автомобили', href: '/inventory' },
  { label: 'Карта', href: '/inventory/map' },
  { label: 'Въпроси за финансиране', href: '/financing' },
  { label: 'Калкулатор', href: '/calculator' },
  { label: 'За вашия автомобил', href: '/sell-your-car' },
  { label: 'Подготовка на запитване', href: '/sell-your-car/request' },
  { label: 'Услуги', href: '/services' },
  { label: 'ЧЗВ', href: '/faq' }
] as const;
