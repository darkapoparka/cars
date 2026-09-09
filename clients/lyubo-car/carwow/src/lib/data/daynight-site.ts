import { dealerProfile } from './dealer-profile';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = `${dealerProfile.address}, ${dealerProfile.city}`;
export const daynightSite = {
  name: dealerProfile.name,
  shortName: dealerProfile.shortName,
  phone: dealerProfile.phoneE164,
  phoneLabel: dealerProfile.phoneDisplay,
  secondaryPhone: dealerProfile.secondaryPhoneE164 ?? '',
  secondaryPhoneLabel: dealerProfile.secondaryPhoneDisplay ?? '',
  email: '',
  location,
  locationShort: dealerProfile.region,
  hoursLabel: dealerProfile.hoursLabel,
  mapEmbedSrc: dealerProfile.mapsEmbedUrl,
  mapUrl: dealerProfile.mapsUrl,
  mapLabel: `${dealerProfile.name}, ${dealerProfile.city}`,
  sourceInventory: dealerProfile.sourceInventory,
  inventoryCount: dealerProfile.sampleCount,
  inventoryCountMeaning: 'Брой обяви в датираната демо извадка, не потвърдена текуща наличност',
  logoLight: dealerProfile.logoWhite,
  logoDark: dealerProfile.logoInk,
  primaryCta: 'Разгледай обявите',
  sellCarCta: 'Попитай за замяна',
  accountCta: 'Контакт с дилъра',
  phoneCta: 'Обади се за оглед',
  heroTitle: dealerProfile.name,
  heroSubtitle: dealerProfile.tagline,
  reviewCount: daynightReviewCount,
  reviewCountLabel: daynightReviewCountLabel,
  reviewLinkLabel: daynightReviewLinkLabel,
} as const;
export const publicNavItems = [
 {label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory'},{label:'Замяна',href:'/sell-your-car'},{label:'Услуги',href:'/services'},{label:'За нас',href:'/about'},{label:'Блог',href:'/blog'},{label:'Контакти',href:'/contact'}
] as const;
export const publicNavGroups = [
 {label:'Начало',href:'/'},
 {label:'Автомобили',href:'/inventory',children:[{label:'Всички обяви',href:'/inventory'},{label:'Карта',href:'/inventory/map'},{label:'Сравнение',href:'/compare'},{label:'Калкулатор',href:'/calculator'}]},
 {label:'Замяна',href:'/sell-your-car',children:[{label:'Обсъди замяна',href:'/sell-your-car'},{label:'Подготви информация',href:'/sell-your-car/request'}]},
 {label:'Услуги',href:'/services',children:[{label:'Дилърски услуги',href:'/services'},{label:'Финансиране',href:'/financing'},{label:'ЧЗВ',href:'/faq'}]},
 {label:'За нас',href:'/about',children:[{label:`За ${dealerProfile.shortName}`,href:'/about'},{label:'Профил на автокъщата',href:'/about/daynight-auto-plovdiv'},{label:'Контакт',href:'/team'},{label:'Отзиви',href:'/reviews'},{label:'Блог',href:'/blog'},{label:'Условия',href:'/terms'}]},
 {label:'Контакти',href:'/contact'}
] as const;
export const footerNavItems = [
 {label:'Обявени автомобили',href:'/inventory'},{label:'Карта на автомобили',href:'/inventory/map'},{label:'Финансиране',href:'/financing'},{label:'Калкулатор',href:'/calculator'},{label:'Обсъди замяна',href:'/sell-your-car'},{label:'Подготви информация',href:'/sell-your-car/request'},{label:'Услуги',href:'/services'},{label:'ЧЗВ',href:'/faq'}
] as const;
