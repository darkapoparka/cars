import {
  daynightReviewCount,
  daynightReviewCountLabel,
  daynightReviewLinkLabel
} from './daynight-reviews';

const location = 'Пловдив · точен адрес при потвърждение';

export const daynightSite = {
  previewMode: true,
  name: 'GOLDENDREAMS AUTO',
  shortName: 'GoldenDreams',
  phone: '0878979712',
  phoneLabel: '0878 979 712',
  email: '',
  location,
  locationShort: 'Пловдив',
  hoursLabel: 'Оглед след потвърждение по телефона',
  mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent('GoldenDreams AUTO, Пловдив')}&z=13&output=embed`,
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=GoldenDreams%20AUTO%20Plovdiv',
  mapLabel: 'GoldenDreams AUTO, Пловдив',
  sourceInventory: 'https://bazar.bg/obiava-55965789/mercedes-benz-cla-180-96000km',
  inventoryCount: 1,
  logoLight: '/dealer/brand/logo-dark.svg',
  logoDark: '/dealer/brand/logo-light.svg',
  primaryCta: 'Разгледай обявата',
  sellCarCta: 'Продай или замени',
  accountCta: 'Свържи се с екипа',
  phoneCta: 'Обади се',
  heroTitle: 'GOLDENDREAMS AUTO',
  heroSubtitle: 'Пловдив · бърз демо проект с публично потвърден контакт и текуща Bazar.bg обява. Точният адрес се потвърждава по телефона.',
  reviewCount: daynightReviewCount,
  reviewCountLabel: daynightReviewCountLabel,
  reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Продай', href: '/sell-your-car' },
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
  ]},
  { label: 'Продай', href: '/sell-your-car', children: [
    { label: 'Продай или замени', href: '/sell-your-car' },
    { label: 'Заявка за оценка', href: '/sell-your-car/request' }
  ]},
  { label: 'Услуги', href: '/services', children: [
    { label: 'Дилърски услуги', href: '/services' },
    { label: 'Финансиране', href: '/financing' },
    { label: 'ЧЗВ', href: '/faq' }
  ]},
  { label: 'За нас', href: '/about', children: [
    { label: 'За GoldenDreams AUTO', href: '/about' },
    { label: 'Екип', href: '/team' },
    { label: 'Отзиви', href: '/reviews' },
    { label: 'Блог', href: '/blog' },
    { label: 'Условия', href: '/terms' }
  ]},
  { label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Карта на автомобили', href: '/inventory/map' },
  { label: 'Финансиране', href: '/financing' },
  { label: 'Калкулатор', href: '/calculator' },
  { label: 'Продай или замени', href: '/sell-your-car' },
  { label: 'Заявка за оценка', href: '/sell-your-car/request' },
  { label: 'Услуги', href: '/services' },
  { label: 'ЧЗВ', href: '/faq' }
] as const;
