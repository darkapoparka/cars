import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = 'гр. София, Дружба 1, бул. Искърско шосе 13';
export const daynightSite = {
  name:'МАВЕРИК', shortName:'Маверик', phone:'0878754914', phoneLabel:'0878 754 914', email:'', location,
  locationShort:'Дружба 1, София', hoursLabel:'Потвърдете посещението по телефона',
  mapEmbedSrc:`https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`,
  mapUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
  mapLabel:'МАВЕРИК, София, България', sourceInventory:'https://maverik.mobile.bg/', inventoryCount:71,
  logoLight:'/brand/logo.svg', logoDark:'/brand/logo.svg', primaryCta:'Виж автомобилите', sellCarCta:'Предложи автомобил', accountCta:'Свържи се', phoneCta:'Обади се за оглед',
  heroTitle:'МАВЕРИК', heroSubtitle:'Автомобили в София; проверете локацията и наличността на конкретната обява.',
  reviewCount:daynightReviewCount, reviewCountLabel:daynightReviewCountLabel, reviewLinkLabel:daynightReviewLinkLabel
} as const;
export const publicNavItems=[{label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory'},{label:'Продай',href:'/sell-your-car'},{label:'Услуги',href:'/services'},{label:'За нас',href:'/about'},{label:'Блог',href:'/blog'},{label:'Контакти',href:'/contact'}] as const;
export const publicNavGroups=[{label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory',children:[{label:'Всички автомобили',href:'/inventory'},{label:'Карта',href:'/inventory/map'},{label:'Сравнение',href:'/compare'},{label:'Калкулатор',href:'/calculator'}]},{label:'Продай',href:'/sell-your-car',children:[{label:'Продай или замени',href:'/sell-your-car'},{label:'Заявка за оценка',href:'/sell-your-car/request'}]},{label:'Услуги',href:'/services',children:[{label:'Дилърски услуги',href:'/services'},{label:'Финансиране',href:'/financing'},{label:'ЧЗВ',href:'/faq'}]},{label:'За нас',href:'/about',children:[{label:'За МАВЕРИК',href:'/about'},{label:'Профил на автокъщата',href:'/about/daynight-auto-plovdiv'},{label:'Екип',href:'/team'},{label:'Отзиви',href:'/reviews'},{label:'Блог',href:'/blog'},{label:'Условия',href:'/terms'}]},{label:'Контакти',href:'/contact'}] as const;
export const footerNavItems=[{label:'Налични автомобили',href:'/inventory'},{label:'Карта на автомобили',href:'/inventory/map'},{label:'Финансиране',href:'/financing'},{label:'Калкулатор',href:'/calculator'},{label:'Продай или замени',href:'/sell-your-car'},{label:'Заявка за оценка',href:'/sell-your-car/request'},{label:'Услуги',href:'/services'},{label:'ЧЗВ',href:'/faq'}] as const;
