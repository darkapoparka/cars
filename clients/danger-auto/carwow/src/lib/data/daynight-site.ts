import stock from './dealer-stock.json';

// Retain the master's public export names and route composition.
// Public contacts corroborated on 2026-09-09:
// https://dangerauto.mobile.bg/contacts
const location = 'гр. София, Горубляне, бул. Самоковско шосе 1, автоборса Джани до комплекс Боила';
export const daynightSite = {
  name: 'DANGER AUTO',
  shortName: 'DANGER AUTO',
  phone: '+359878842409',
  phoneLabel: '0878 842 409',
  secondaryPhone: '+359888000055',
  secondaryPhoneLabel: '0888 000 055',
  email: '',
  location,
  locationShort: 'Горубляне, София',
  hoursLabel: 'Потвърдете работното време и огледа по телефона',
  mapEmbedSrc: 'https://maps.google.com/maps?q=42.6425458,23.4007179&z=16&output=embed',
  mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`DANGER AUTO, ${location}`)}`,
  mapLabel: 'DANGER AUTO, Горубляне, София',
  sourceInventory: 'https://dangerauto.mobile.bg/',
  inventoryCount: stock.listings.length,
  inventoryCountMeaning: 'Брой обяви в датираната демо извадка, не потвърдена текуща наличност',
  logoLight: '/brand/identity-pending.svg',
  logoDark: '/brand/identity-pending.svg',
  primaryCta: 'Разгледай обявите',
  sellCarCta: 'Попитай за замяна',
  accountCta: 'Контакт с дилъра',
  phoneCta: 'Обади се за оглед',
  heroTitle: 'DANGER AUTO',
  heroSubtitle: 'Употребявани автомобили в Горубляне. Наличността и огледът се потвърждават по телефона.',
  reviewCount: 0,
  reviewCountLabel: 'Без потвърдени отзиви в тази демо версия',
  reviewLinkLabel: 'Информация за отзивите',
} as const;

export const publicNavItems = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory' },
  { label: 'Замяна', href: '/sell-your-car' },
  { label: 'Услуги', href: '/services' },
  { label: 'За нас', href: '/about' },
  { label: 'Блог', href: '/blog' },
  { label: 'Контакти', href: '/contact' },
] as const;

export const publicNavGroups = [
  { label: 'Начало', href: '/' },
  { label: 'Автомобили', href: '/inventory', children: [
    { label: 'Всички обяви', href: '/inventory' },
    { label: 'Карта', href: '/inventory/map' },
    { label: 'Сравнение', href: '/compare' },
    { label: 'Калкулатор', href: '/calculator' },
  ] },
  { label: 'Замяна', href: '/sell-your-car', children: [
    { label: 'Обсъди замяна', href: '/sell-your-car' },
    { label: 'Подготви информация', href: '/sell-your-car/request' },
  ] },
  { label: 'Услуги', href: '/services', children: [
    { label: 'Дилърски услуги', href: '/services' },
    { label: 'Банково финансиране', href: '/financing' },
    { label: 'ЧЗВ', href: '/faq' },
  ] },
  { label: 'За нас', href: '/about', children: [
    { label: 'За DANGER AUTO', href: '/about' },
    { label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },
    { label: 'Екип', href: '/team' },
    { label: 'Отзиви', href: '/reviews' },
    { label: 'Блог', href: '/blog' },
    { label: 'Условия', href: '/terms' },
  ] },
  { label: 'Контакти', href: '/contact' },
] as const;

export const footerNavItems = [
  { label: 'Обявени автомобили', href: '/inventory' },
  { label: 'Карта на автомобили', href: '/inventory/map' },
  { label: 'Банково финансиране', href: '/financing' },
  { label: 'Калкулатор', href: '/calculator' },
  { label: 'Обсъди замяна', href: '/sell-your-car' },
  { label: 'Подготви информация', href: '/sell-your-car/request' },
  { label: 'Услуги', href: '/services' },
  { label: 'ЧЗВ', href: '/faq' },
] as const;
