import { brand } from '$config/brand';
import { dealer } from './dealer';

export type NavigationHref='/'|'/about-us'|`/about-us#${string}`|`/blog-detail/${number}`|'/blog'|`/blog?${string}`|'/contact'|`/contact?${string}`|'/listing-grid'|`/listing-grid?${string}`|`tel:${string}`;
export type InternalNavigationHref=Exclude<NavigationHref,`tel:${string}`>;
export type NavigationLink={id:string;label:string;href:NavigationHref};
export type NavigationGroup={id:string;title:string;links:NavigationLink[]};
export type NavigationFeature={id:string;title:string;detail:string;image:string;href:InternalNavigationHref};
export type MegaMenu={title:string;description:string;features:NavigationFeature[];groups:NavigationGroup[];cta:Omit<NavigationLink,'href'>&{href:InternalNavigationHref;detail:string}};
export type NavigationItem=Omit<NavigationLink,'href'>&{href:InternalNavigationHref;menu?:MegaMenu};

export const navigation:NavigationItem[]=[
  {id:'home',label:'Начало',href:'/'},
  {id:'vehicles',label:'Автомобили',href:'/listing-grid',menu:{
    title:'Автомобили',description:'Разгледайте демонстрационната извадка по марка и основни характеристики.',
    features:[
      {id:'vehicles-suv',title:'SUV',detail:'Простор и комфорт',image:'/assets/images/icon-box/car-list4.png',href:'/listing-grid?body=SUV'},
      {id:'vehicles-crossover',title:'Хечбек',detail:'За ежедневните маршрути',image:'/assets/images/icon-box/car-list2.png',href:'/listing-grid?body=Hatchback'},
      {id:'vehicles-premium-suv',title:'Всички обяви',detail:'Сравнете предложенията',image:'/assets/images/icon-box/car-list1.png',href:'/listing-grid'}
    ],groups:[
      {id:'vehicles-browse',title:'Разгледайте',links:[{id:'vehicles-all',label:'Всички автомобили',href:'/listing-grid'},{id:'vehicles-new',label:'По година',href:'/listing-grid?sort=newest'},{id:'vehicles-used',label:'Употребявани',href:'/listing-grid?condition=used'}]},
      {id:'vehicles-body',title:'По тип купе',links:[{id:'vehicles-body-suv',label:'SUV',href:'/listing-grid?body=SUV'},{id:'vehicles-body-sedan',label:'Хечбек',href:'/listing-grid?body=Hatchback'},{id:'vehicles-body-coupe',label:'Комби',href:'/listing-grid?body=Wagon'}]}
    ],cta:{id:'vehicles-cta',label:'Вижте всички автомобили',href:'/listing-grid',detail:'Филтрирайте данните от публикуваните обяви.'}
  }},
  {id:'about',label:'За нас',href:'/about-us',menu:{
    title:brand.name,description:'Публикуван адрес, контакт и подготовка за разговор с автокъщата.',
    features:[
      {id:'about-showroom',title:`Автомобили в ${brand.city}`,detail:'Потвърдете наличност преди посещение.',image:dealer.hero,href:'/about-us'},
      {id:'about-import',title:'Произход и документи',detail:'Въпроси за конкретната обява.',image:dealer.hero,href:'/contact?topic=import'},
      {id:'about-leasing',title:'Начини на плащане',detail:'Възможностите се уточняват с продавача.',image:dealer.hero,href:'/contact?topic=leasing'}
    ],groups:[
      {id:'about-company',title:'Автокъщата',links:[{id:'about-company-overview',label:`За ${brand.shortName}`,href:'/about-us'},{id:'about-company-process',label:'Подготовка за оглед',href:'/about-us#process'},{id:'about-company-contact',label:'Контакти',href:'/contact'}]},
      {id:'about-contact',title:'Свържете се',links:[{id:'about-contact-inspection',label:'Попитайте за оглед',href:'/contact?topic=inspection'},{id:'about-contact-address',label:'Адрес и посещение',href:'/contact'},{id:'about-contact-phone',label:brand.phone,href:brand.phoneHref}]}
    ],cta:{id:'about-cta',label:'Свържете се с автокъщата',href:'/contact',detail:'Наличност, адрес, оглед и въпроси за автомобила.'}
  }},
  {id:'guides',label:'Полезно',href:'/blog',menu:{
    title:'Полезно',description:'Общи насоки за сравняване на обяви и подготовка за оглед.',
    features:[
      {id:'guides-inspection',title:'Преди оглед',detail:'Въпроси за история и документи.',image:dealer.hero,href:'/blog-detail/1'},
      {id:'guides-import',title:'Сравняване на обяви',detail:'Цена, пробег и основни характеристики.',image:dealer.hero,href:'/blog-detail/2'},
      {id:'guides-leasing',title:'Плащане и условия',detail:'Какво да уточните с продавача.',image:dealer.hero,href:'/blog-detail/3'}
    ],groups:[
      {id:'guides-library',title:'Ръководства',links:[{id:'guides-all',label:'Всички статии',href:'/blog'},{id:'guides-choice',label:'Избор на автомобил',href:'/blog?q=избор'},{id:'guides-finance',label:'Плащане и условия',href:'/blog?category=Лизинг'}]},
      {id:'guides-help',title:'Помощ',links:[{id:'guides-import-help',label:'Произход и документи',href:'/blog?category=Внос'},{id:'guides-contact',label:'Контакти',href:'/contact'},{id:'guides-ask',label:'Попитайте продавача',href:'/contact'}]}
    ],cta:{id:'guides-cta',label:'Вижте всички статии',href:'/blog',detail:'Информационни материали, не гаранции или финансови оферти.'}
  }},
  {id:'contact',label:'Контакти',href:'/contact'}
];
