import { brand } from '$config/brand';

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

export type NavigationLink = {
  id: string;
  label: string;
  href: NavigationHref;
};

export type NavigationGroup = {
  id: string;
  title: string;
  links: NavigationLink[];
};

export type NavigationFeature = {
  id: string;
  title: string;
  detail: string;
  image: string;
  href: InternalNavigationHref;
};

export type MegaMenu = {
  title: string;
  description: string;
  features: NavigationFeature[];
  groups: NavigationGroup[];
  cta: Omit<NavigationLink, 'href'> & { href: InternalNavigationHref; detail: string };
};

export type NavigationItem = Omit<NavigationLink, 'href'> & {
  href: InternalNavigationHref;
  menu?: MegaMenu;
};

export const navigation: NavigationItem[] = [
  { id: 'home', label: 'Начало', href: '/' },
  {
    id: 'vehicles',
    label: 'Автомобили',
    href: '/listing-grid',
    menu: {
      title: 'Автомобили',
      description: 'Разгледайте наличностите по състояние, тип купе или марка.',
      features: [
        { id: 'vehicles-suv', title: 'SUV', detail: 'Простор и комфорт', image: '/assets/images/section/car-slide1.png', href: '/listing-grid?body=SUV' },
        { id: 'vehicles-crossover', title: 'Комби', detail: 'Място за всеки ден', image: '/assets/images/section/car-slide2.png', href: '/listing-grid?body=Wagon' },
        { id: 'vehicles-premium-suv', title: 'Премиум SUV', detail: 'Премиум изпълнение', image: '/assets/images/section/car-slide3.png', href: '/listing-grid?body=SUV' }
      ],
      groups: [
        {
          id: 'vehicles-browse',
          title: 'Разгледайте',
          links: [
            { id: 'vehicles-all', label: 'Всички автомобили', href: '/listing-grid' },
            { id: 'vehicles-new', label: 'Най-нови предложения', href: '/listing-grid?sort=newest' },
            { id: 'vehicles-used', label: 'Употребявани', href: '/listing-grid?condition=used' }
          ]
        },
        {
          id: 'vehicles-body',
          title: 'По тип купе',
          links: [
            { id: 'vehicles-body-suv', label: 'SUV', href: '/listing-grid?body=SUV' },
            { id: 'vehicles-body-sedan', label: 'Комби', href: '/listing-grid?body=Wagon' },
            { id: 'vehicles-body-coupe', label: 'Купе', href: '/listing-grid?body=Coupe' }
          ]
        }
      ],
      cta: { id: 'vehicles-cta', label: 'Вижте всички автомобили', href: '/listing-grid', detail: 'Филтрирайте по тип, гориво и състояние.' }
    }
  },
  {
    id: 'about',
    label: 'За нас',
    href: '/about-us',
    menu: {
      title: brand.name,
      description: 'Научете повече за екипа, процеса на работа и начините за покупка.',
      features: [
        { id: 'about-showroom', title: 'Шоурум и подбор', detail: `Подбрани автомобили в ${brand.city}.`, image: '/inventory/21776348634522888-1.webp', href: '/about-us' },
        { id: 'about-import', title: 'Внос по заявка', detail: 'Доставка по ваши критерии.', image: '/inventory/11749039399452266-1.webp', href: '/contact?topic=import' },
        { id: 'about-leasing', title: 'Въпроси за финансиране', detail: 'Обсъдете условията директно с екипа.', image: '/inventory/21787335344586615-1.webp', href: '/contact?topic=leasing' }
      ],
      groups: [
        {
          id: 'about-company',
          title: 'Компания',
          links: [
            { id: 'about-company-overview', label: `За ${brand.shortName}`, href: '/about-us' },
            { id: 'about-company-process', label: 'Как работим', href: '/about-us#process' },
            { id: 'about-company-contact', label: 'Контакти', href: '/contact' }
          ]
        },
        {
          id: 'about-contact',
          title: 'Свържете се',
          links: [
            { id: 'about-contact-inspection', label: 'Запазете оглед', href: '/contact?topic=inspection' },
            { id: 'about-contact-address', label: 'Адрес и посещение', href: '/contact' },
            { id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }
          ]
        }
      ],
      cta: { id: 'about-cta', label: 'Свържете се с екипа', href: '/contact', detail: 'Наличност, оглед, внос и условия по запитване.' }
    }
  },
  {
    id: 'guides',
    label: 'Полезно',
    href: '/blog',
    menu: {
      title: 'Полезно',
      description: 'Практична информация за избора, проверката и финансирането на автомобил.',
      features: [
        { id: 'guides-inspection', title: 'Проверка преди покупка', detail: 'История, документи и състояние.', image: '/inventory/11749039399452266-1.webp', href: '/blog-detail/1' },
        { id: 'guides-import', title: 'Внос и документи', detail: 'Основните стъпки преди регистрация.', image: '/inventory/11749039399452266-1.webp', href: '/blog-detail/2' },
        { id: 'guides-leasing', title: 'Лизинг и условия', detail: 'Какво да уточните преди финансиране.', image: '/inventory/11749039399452266-1.webp', href: '/blog-detail/3' }
      ],
      groups: [
        {
          id: 'guides-library',
          title: 'Ръководства',
          links: [
            { id: 'guides-all', label: 'Всички статии', href: '/blog' },
            { id: 'guides-choice', label: 'Избор на автомобил', href: '/blog?q=избор' },
            { id: 'guides-finance', label: 'Лизинг и условия', href: '/blog?category=Лизинг' }
          ]
        },
        {
          id: 'guides-help',
          title: 'Помощ',
          links: [
            { id: 'guides-import-help', label: 'Внос в България', href: '/blog?category=Внос' },
            { id: 'guides-contact', label: 'Контакти', href: '/contact' },
            { id: 'guides-ask', label: 'Попитайте екипа', href: '/contact' }
          ]
        }
      ],
      cta: { id: 'guides-cta', label: 'Вижте всички статии', href: '/blog', detail: 'Насоки за избор, покупка, лизинг и внос.' }
    }
  },
  { id: 'contact', label: 'Контакти', href: '/contact' }
];
