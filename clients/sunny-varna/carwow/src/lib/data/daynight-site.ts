import { dealer, stock, mapsEmbedUrl, mapsUrl } from './dealer';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';

export const daynightSite = {
  name:dealer.name,shortName:dealer.shortName,phone:dealer.phoneE164,phoneLabel:dealer.phone,email:'',
  location:dealer.address,locationShort:dealer.city,hoursLabel:dealer.hours,
  mapEmbedSrc:mapsEmbedUrl,mapUrl:mapsUrl,mapLabel:`${dealer.name}, ${dealer.city}, ${dealer.country}`,
  sourceInventory:dealer.sourceUrl,inventoryCount:stock.length,
  logoLight:dealer.logo,logoDark:dealer.logoDark,
  primaryCta:'Разгледай обявите',sellCarCta:'Въпрос за автомобил',accountCta:'Свържи се с автокъщата',phoneCta:'Попитай за оглед',
  heroTitle:dealer.name,heroSubtitle:dealer.tagline,
  reviewCount:daynightReviewCount,reviewCountLabel:daynightReviewCountLabel,reviewLinkLabel:daynightReviewLinkLabel
} as const;

export const publicNavItems = [
  {label:'Начало',href:'/'},{label:'Автомобили',href:'/inventory'},
  {label:'Твоят автомобил',href:'/sell-your-car'},{label:'Информация',href:'/services'},
  {label:'За нас',href:'/about'},{label:'Полезно',href:'/blog'},{label:'Контакти',href:'/contact'}
] as const;
export const publicNavGroups = [
  {label:'Начало',href:'/'},
  {label:'Автомобили',href:'/inventory',children:[
    {label:'Всички обяви',href:'/inventory'},{label:'Адрес и карта',href:'/inventory/map'},
    {label:'Сравнение',href:'/compare'},{label:'Калкулатор — пример',href:'/calculator'}
  ]},
  {label:'Твоят автомобил',href:'/sell-your-car',children:[
    {label:'Въпрос за продажба',href:'/sell-your-car'},{label:'Подготви запитване',href:'/sell-your-car/request'}
  ]},
  {label:'Информация',href:'/services',children:[
    {label:'Покупка и оглед',href:'/services'},{label:'Начини на плащане',href:'/financing'},
    {label:'Въпроси и отговори',href:'/faq'}
  ]},
  {label:'За нас',href:'/about',children:[
    {label:`За ${dealer.name}`,href:'/about'},
    {label:'Профил на автокъщата',href:'/about/daynight-auto-plovdiv'},
    {label:'Контакт с екипа',href:'/team'},{label:'Информация за отзивите',href:'/reviews'},
    {label:'Полезно',href:'/blog'},{label:'За демонстрацията',href:'/terms'}
  ]},
  {label:'Контакти',href:'/contact'}
] as const;
export const footerNavItems = [
  {label:'Обяви за автомобили',href:'/inventory'},{label:'Адрес и карта',href:'/inventory/map'},
  {label:'Начини на плащане',href:'/financing'},{label:'Калкулатор — пример',href:'/calculator'},
  {label:'Въпрос за продажба',href:'/sell-your-car'},
  {label:'Подготви запитване',href:'/sell-your-car/request'},
  {label:'Покупка и оглед',href:'/services'},{label:'Въпроси и отговори',href:'/faq'}
] as const;
