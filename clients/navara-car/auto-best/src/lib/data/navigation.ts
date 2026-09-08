import { brand } from '$config/brand';
import source from './navara-data.json';

export type NavigationHref =
  | '/'
  | '/about-us'
  | `/about-us#${string}`
  | `/blog-detail/${number}`
  | '/blog'
  | `/blog?${string}`
  | '/contact'
  | `/contact?${string}`
  | '/listing-grid'
  | `/listing-grid?${string}`
  | `tel:${string}`;
export type InternalNavigationHref = Exclude<NavigationHref, `tel:${string}`>;
export type NavigationLink = { id: string; label: string; href: NavigationHref };
export type NavigationGroup = { id: string; title: string; links: NavigationLink[] };
export type NavigationFeature = { id: string; title: string; detail: string; image: string; href: InternalNavigationHref };
export type MegaMenu = {
  title: string;
  description: string;
  features: NavigationFeature[];
  groups: NavigationGroup[];
  cta: Omit<NavigationLink, 'href'> & { href: InternalNavigationHref; detail: string };
};
export type NavigationItem = Omit<NavigationLink, 'href'> & { href: InternalNavigationHref; menu?: MegaMenu };

export const navigation: NavigationItem[] = [
  { id: 'home', label: 'Начало', href: '/' },
  {
    id: 'vehicles', label: 'Автомобили', href: '/listing-grid',
    menu: {
      title: 'Автомобили от обявите',
      description: 'Селекция към 08.09.2026 г. Филтрирайте по купе, марка и гориво.',
      features: [
        { id: 'vehicles-suv', title: 'SUV', detail: 'Qashqai, e-2008 и Mokka', image: source.vehicles[3].images[0], href: '/listing-grid?body=SUV' },
        { id: 'vehicles-crossover', title: 'Комби', detail: 'Audi A4 quattro', image: source.vehicles[6].images[0], href: '/listing-grid?body=Wagon' },
        { id: 'vehicles-premium-suv', title: 'Градски автомобили', detail: 'Micra, Polo, B 250 e и Fortwo', image: source.vehicles[0].images[0], href: '/listing-grid?body=Hatchback' }
      ],
      groups: [
        { id: 'vehicles-browse', title: 'Разгледайте', links: [
          { id: 'vehicles-all', label: 'Всички автомобили', href: '/listing-grid' },
          { id: 'vehicles-new', label: 'Подреждане по година', href: '/listing-grid?sort=newest' },
          { id: 'vehicles-used', label: 'Употребявани', href: '/listing-grid?condition=used' }
        ] },
        { id: 'vehicles-body', title: 'По тип купе', links: [
          { id: 'vehicles-body-suv', label: 'SUV', href: '/listing-grid?body=SUV' },
          { id: 'vehicles-body-sedan', label: 'Комби', href: '/listing-grid?body=Wagon' },
          { id: 'vehicles-body-coupe', label: 'Хечбек', href: '/listing-grid?body=Hatchback' }
        ] }
      ],
      cta: { id: 'vehicles-cta', label: 'Вижте всички автомобили', href: '/listing-grid', detail: 'Обявените цени и наличността се потвърждават с продавача.' }
    }
  },
  {
    id: 'about', label: 'За нас', href: '/about-us',
    menu: {
      title: brand.name,
      description: 'Публикувани данни за автокъщата във Варна и следващи стъпки за оглед.',
      features: [
        { id: 'about-showroom', title: 'Автокъща във Варна', detail: 'Кайсиева градина, бул. „Цар Освободител“.', image: source.vehicles[4].images[1], href: '/about-us' },
        { id: 'about-import', title: 'Регистрация и документи', detail: 'Попитайте за посоченото съдействие.', image: source.vehicles[1].images[0], href: '/contact?topic=import' },
        { id: 'about-leasing', title: 'Лизинг по запитване', detail: 'Условията не са предварително потвърдени.', image: source.vehicles[2].images[0], href: '/contact?topic=leasing' }
      ],
      groups: [
        { id: 'about-company', title: 'Автокъщата', links: [
          { id: 'about-company-overview', label: `За ${brand.shortName}`, href: '/about-us' },
          { id: 'about-company-process', label: 'Преди оглед', href: '/about-us#process' },
          { id: 'about-company-contact', label: 'Контакти', href: '/contact' }
        ] },
        { id: 'about-contact', title: 'Свържете се', links: [
          { id: 'about-contact-inspection', label: 'Уточнете оглед', href: '/contact?topic=inspection' },
          { id: 'about-contact-address', label: 'Адрес и посещение', href: '/contact' },
          { id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }
        ] }
      ],
      cta: { id: 'about-cta', label: 'Контакт с продавача', href: '/contact', detail: 'Наличност, оглед, регистрация и въпроси по обявите.' }
    }
  },
  {
    id: 'guides', label: 'Полезно', href: '/blog',
    menu: {
      title: 'Полезно преди оглед',
      description: 'Как да използвате селекцията и какво да потвърдите с продавача.',
      features: [
        { id: 'guides-inspection', title: 'Обява и наличност', detail: 'Какво означава датата на селекцията.', image: source.vehicles[0].images[1], href: '/blog-detail/1' },
        { id: 'guides-import', title: 'Регистрация и документи', detail: 'Въпроси за публикуваното съдействие.', image: source.vehicles[1].images[1], href: '/blog-detail/2' },
        { id: 'guides-leasing', title: 'Лизинг и условия', detail: 'Без предварително обещани лихви и срокове.', image: source.vehicles[4].images[0], href: '/blog-detail/3' }
      ],
      groups: [
        { id: 'guides-library', title: 'Ръководства', links: [
          { id: 'guides-all', label: 'Всички статии', href: '/blog' },
          { id: 'guides-choice', label: 'Избор на автомобил', href: '/blog?q=избор' },
          { id: 'guides-finance', label: 'Лизинг и условия', href: '/blog?category=Лизинг' }
        ] },
        { id: 'guides-help', title: 'Помощ', links: [
          { id: 'guides-import-help', label: 'Регистрация и документи', href: '/blog?category=Документи' },
          { id: 'guides-contact', label: 'Контакти', href: '/contact' },
          { id: 'guides-ask', label: 'Попитайте продавача', href: '/contact' }
        ] }
      ],
      cta: { id: 'guides-cta', label: 'Вижте всички статии', href: '/blog', detail: 'Контекст към обявите, а не гаранция за състояние или финансова оферта.' }
    }
  },
  { id: 'contact', label: 'Контакти', href: '/contact' }
];
