import {
  daynightReviewCount,
  daynightReviewCountLabel,
  daynightReviewLinkLabel
} from './daynight-reviews';

const location = 'ул. „Сребърна“ 6, Промишлена зона Север, Бургас';

export const daynightSite = {
  name: 'FIVE AUTO',
  previewMode: true as boolean,
  shortName: 'FIVE AUTO',
  phone: '+359887555255',
  phoneLabel: '0887 555 255',
  email: '',
  location,
  locationShort: 'Промишлена зона Север, Бургас',
  hoursLabel: 'Понеделник–петък 08:30–17:00; събота и неделя — почивни дни',
  mapEmbedSrc: `https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
  mapLabel: 'FIVE AUTO, Бургас',
  sourceInventory: 'https://fiveauto.mobile.bg/',
  inventoryCount: 8,
  logoLight: '/brand/logo.png',
  logoDark: '/brand/logo.png',
  primaryCta: 'Разгледай автомобилите',
  sellCarCta: 'Запитване за автомобил',
  accountCta: 'Свържи се с автокъщата',
  phoneCta: 'Обади се за оглед',
  heroTitle: 'FIVE AUTO',
  heroSubtitle: 'Подбрани публикувани автомобили в Бургас. Потвърдете наличност, цена и условия преди оглед.',
  reviewCount: daynightReviewCount,
  reviewCountLabel: daynightReviewCountLabel,
  reviewLinkLabel: daynightReviewLinkLabel
} as const;

export const publicNavItems = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Запитване', href: '/sell-your-car' },
  { label: 'Информация', href: '/services' },
  { label: 'За нас', href: '/about' },
  { label: 'Ръководства', href: '/blog' },
  { label: 'Контакти', href: '/contact' }
] as const;

export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  {
    label: 'Автомобили',
    href: '/inventory',
    children: [
      { label: 'Всички автомобили', href: '/inventory' },
      { label: 'Карта', href: '/inventory/map' },
      { label: 'Сравнение', href: '/compare' },
      { label: 'Калкулатор', href: '/calculator' }
    ]
  },
  {
    label: 'Запитване',
    href: '/sell-your-car',
    children: [
      { label: 'Запитване за автомобил', href: '/sell-your-car' },
      { label: 'Контакти', href: '/contact' }
    ]
  },
  {
    label: 'Информация',
    href: '/services',
    children: [
      { label: 'Информация за покупка', href: '/services' },
      { label: 'Финансиране по запитване', href: '/financing' },
      { label: 'ЧЗВ', href: '/faq' }
    ]
  },
  {
    label: 'За нас',
    href: '/about',
    children: [
      { label: 'За FIVE AUTO', href: '/about' },
      { label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },
      { label: 'Ръководства', href: '/blog' },
      { label: 'Условия', href: '/terms' }
    ]
  },
  { label: 'Контакти', href: '/contact' }
] as const;

export const footerNavItems = [
  { label: 'Налични автомобили', href: '/inventory' },
  { label: 'Карта', href: '/inventory/map' },
  { label: 'Финансиране по запитване', href: '/financing' },
  { label: 'Калкулатор', href: '/calculator' },
  { label: 'Запитване', href: '/sell-your-car' },
  { label: 'Информация', href: '/services' },
  { label: 'ЧЗВ', href: '/faq' }
] as const;
