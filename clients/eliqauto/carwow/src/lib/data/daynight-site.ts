import { eliqStock } from './eliq-stock';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = 'ул. Свобода, на гърба на Гробищен парк, Пазарджик';
export const daynightSite = {
  name: 'ELIQ AUTO', shortName: 'ELIQ AUTO', phone: '0896781662', phoneLabel: '0896 781 662', email: '',
  location, locationShort: 'Пазарджик · ул. Свобода',
  hoursLabel: 'Пон.–пет. 09:30–19:00 · Съб.–нед. 09:30–17:00',
  mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
  mapLabel: 'ELIQ AUTO, Пазарджик', sourceInventory: 'https://eliqauto.mobile.bg/',
  inventoryCount: eliqStock.length,
  logoLight: '/assets/eliqauto/brand/eliq-auto-wordmark-clean.png',
  logoDark: '/assets/eliqauto/brand/eliq-auto-wordmark-header.png',
  primaryCta: 'Разгледай автомобилите', sellCarCta: 'Предложи автомобил',
  accountCta: 'Свържи се с екипа', phoneCta: 'Обади се за оглед',
  heroTitle: 'ELIQ AUTO', heroSubtitle: 'Пазарджик · Демонстрационна селекция по архивни обяви',
  reviewCount: daynightReviewCount, reviewCountLabel: daynightReviewCountLabel, reviewLinkLabel: daynightReviewLinkLabel
} as const;
export const publicNavItems = [
  { label: 'Начало', href: '/' }, { label: 'Автомобили', href: '/inventory' },
  { label: 'Продай', href: '/sell-your-car' }, { label: 'Услуги', href: '/services' },
  { label: 'За нас', href: '/about' }, { label: 'Блог', href: '/blog' }, { label: 'Контакти', href: '/contact' }
] as const;
export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory', children: [
    { label: 'Всички автомобили', href: '/inventory' }, { label: 'Карта', href: '/inventory/map' },
    { label: 'Сравнение', href: '/compare' }, { label: 'Калкулатор', href: '/calculator' }
  ] },
  { label: 'Продай', href: '/sell-your-car', children: [
    { label: 'Продай или замени', href: '/sell-your-car' }, { label: 'Заявка за оценка', href: '/sell-your-car/request' }
  ] },
  { label: 'Услуги', href: '/services', children: [
    { label: 'Дилърски услуги', href: '/services' }, { label: 'Финансиране', href: '/financing' }, { label: 'ЧЗВ', href: '/faq' }
  ] },
  { label: 'За нас', href: '/about', children: [
    { label: 'За ELIQ AUTO', href: '/about' }, { label: 'Контакти и огледи', href: '/contact' },
    { label: 'Екип', href: '/team' }, { label: 'Отзиви', href: '/reviews' },
    { label: 'Блог', href: '/blog' }, { label: 'Условия', href: '/terms' }
  ] },
  { label: 'Контакти', href: '/contact' }
] as const;
export const footerNavItems = [
  { label: 'Автомобили', href: '/inventory' }, { label: 'Карта на автомобили', href: '/inventory/map' },
  { label: 'Финансиране', href: '/financing' }, { label: 'Калкулатор', href: '/calculator' },
  { label: 'Продай или замени', href: '/sell-your-car' }, { label: 'Заявка за оценка', href: '/sell-your-car/request' },
  { label: 'Услуги', href: '/services' }, { label: 'ЧЗВ', href: '/faq' }
] as const;
