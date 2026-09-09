import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = 'гр. София, в.з. Врана – Лозен, ул. Стар Лозенски път 45';
export const daynightSite = {
  name:'TROYA AUTO', shortName:'Troya Auto', phone:'0886067006', phoneLabel:'0886 067 006', email:'', location,
  locationShort:'Врана – Лозен, София', hoursLabel:'Пон–Пет 09:30–18:00 · Съб 10:00–17:00 · Неделя почивен ден',
  mapEmbedSrc:`https://www.google.com/maps?q=${encodeURIComponent(location)}&z=16&output=embed`, mapUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
  mapLabel:'TROYA AUTO, София, България', sourceInventory:'https://troya-auto.mobile.bg/', inventoryCount:108,
  logoLight:'/brand/logo.svg', logoDark:'/brand/logo.svg', primaryCta:'Виж автомобилите', sellCarCta:'Предложи автомобил', accountCta:'Свържи се', phoneCta:'Обади се за оглед',
  heroTitle:'TROYA AUTO', heroSubtitle:'Употребявани автомобили от Швейцария, Германия и Холандия. Наличността се потвърждава по телефона.',
  reviewCount:daynightReviewCount, reviewCountLabel:daynightReviewCountLabel, reviewLinkLabel:daynightReviewLinkLabel
} as const;
export const publicNavItems=[{label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory'},{label:'Продай',href:'/sell-your-car'},{label:'Услуги',href:'/services'},{label:'За нас',href:'/about'},{label:'Блог',href:'/blog'},{label:'Контакти',href:'/contact'}] as const;
export const publicNavGroups=[{label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory',children:[{label:'Всички автомобили',href:'/inventory'},{label:'Карта',href:'/inventory/map'},{label:'Сравнение',href:'/compare'},{label:'Калкулатор',href:'/calculator'}]},{label:'Продай',href:'/sell-your-car',children:[{label:'Продай или замени',href:'/sell-your-car'},{label:'Заявка за оценка',href:'/sell-your-car/request'}]},{label:'Услуги',href:'/services',children:[{label:'Дилърски услуги',href:'/services'},{label:'Финансиране',href:'/financing'},{label:'ЧЗВ',href:'/faq'}]},{label:'За нас',href:'/about',children:[{label:'За TROYA AUTO',href:'/about'},{label:'Профил на автокъщата',href:'/about/daynight-auto-plovdiv'},{label:'Екип',href:'/team'},{label:'Отзиви',href:'/reviews'},{label:'Блог',href:'/blog'},{label:'Условия',href:'/terms'}]},{label:'Контакти',href:'/contact'}] as const;
export const footerNavItems=[{label:'Налични автомобили',href:'/inventory'},{label:'Карта на автомобили',href:'/inventory/map'},{label:'Финансиране',href:'/financing'},{label:'Калкулатор',href:'/calculator'},{label:'Продай или замени',href:'/sell-your-car'},{label:'Заявка за оценка',href:'/sell-your-car/request'},{label:'Услуги',href:'/services'},{label:'ЧЗВ',href:'/faq'}] as const;
