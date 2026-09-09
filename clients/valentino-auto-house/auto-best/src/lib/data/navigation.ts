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
  {
    "id": "home",
    "label": "Начало",
    "href": "/"
  },
  {
    "id": "vehicles",
    "label": "Автомобили",
    "href": "/listing-grid",
    "menu": {
      "title": "Автомобили",
      "description": "Датирана селекция по обяви. Наличността се потвърждава с продавача.",
      "features": [
        {
          "id": "vehicles-suv",
          "title": "SUV",
          "detail": "Nissan Qashqai от селекцията",
          "image": "/media/stock/21724767264834325-card.webp",
          "href": "/listing-grid?body=SUV"
        },
        {
          "id": "vehicles-wagon",
          "title": "Комби",
          "detail": "Audi и Renault от обявите",
          "image": "/media/stock/11785220779595617-card.webp",
          "href": "/listing-grid?body=Wagon"
        },
        {
          "id": "vehicles-hatchback",
          "title": "Хечбек",
          "detail": "Градски предложения",
          "image": "/media/stock/11780736224961272-card.webp",
          "href": "/listing-grid?body=Hatchback"
        }
      ],
      "groups": [
        {
          "id": "vehicles-browse",
          "title": "Разгледайте",
          "links": [
            {
              "id": "vehicles-all",
              "label": "Всички обяви",
              "href": "/listing-grid"
            },
            {
              "id": "vehicles-newest",
              "label": "По година",
              "href": "/listing-grid?sort=newest"
            },
            {
              "id": "vehicles-used",
              "label": "Употребявани",
              "href": "/listing-grid?condition=used"
            }
          ]
        },
        {
          "id": "vehicles-body",
          "title": "По тип купе",
          "links": [
            {
              "id": "vehicles-body-suv",
              "label": "SUV",
              "href": "/listing-grid?body=SUV"
            },
            {
              "id": "vehicles-body-wagon",
              "label": "Комби",
              "href": "/listing-grid?body=Wagon"
            },
            {
              "id": "vehicles-body-hatchback",
              "label": "Хечбек",
              "href": "/listing-grid?body=Hatchback"
            },
            {
              "id": "vehicles-body-van",
              "label": "Ван / миниван",
              "href": "/listing-grid?body=Minivan"
            }
          ]
        }
      ],
      "cta": {
        "id": "vehicles-cta",
        "label": "Вижте всички обяви",
        "href": "/listing-grid",
        "detail": "Цена в евро, пробег в километри и данни от източника."
      }
    }
  },
  {
    "id": "about",
    "label": "За нас",
    "href": "/about-us",
    "menu": {
      "title": "VALENTINO AUTO HOUSE",
      "description": "гр. София, Горубляне, ул. „Самоковско шосе“ 1",
      "features": [
        {
          "id": "about-showroom",
          "title": "Оглед в Горубляне",
          "detail": "Потвърдете автомобил и час по телефона.",
          "image": "/media/stock/11785220779595617-card.webp",
          "href": "/contact?topic=inspection"
        },
        {
          "id": "about-documents",
          "title": "Документи и регистрация",
          "detail": "Уточнете публикуваното съдействие.",
          "image": "/media/stock/21724767264834325-card.webp",
          "href": "/contact?topic=import"
        },
        {
          "id": "about-finance",
          "title": "Финансиране по запитване",
          "detail": "Индивидуални условия от външен доставчик.",
          "image": "/media/stock/11768394188936705-card.webp",
          "href": "/contact?topic=leasing"
        }
      ],
      "groups": [
        {
          "id": "about-company",
          "title": "Автокъщата",
          "links": [
            {
              "id": "about-overview",
              "label": "За Valentino",
              "href": "/about-us"
            },
            {
              "id": "about-process",
              "label": "Преди покупката",
              "href": "/about-us#process"
            },
            {
              "id": "about-contact",
              "label": "Контакти",
              "href": "/contact"
            }
          ]
        },
        {
          "id": "about-visit",
          "title": "Свържете се",
          "links": [
            {
              "id": "about-inspection",
              "label": "Уговорете оглед",
              "href": "/contact?topic=inspection"
            },
            {
              "id": "about-address",
              "label": "Адрес и работно време",
              "href": "/contact"
            },
            {
              "id": "about-phone",
              "label": "0884 525 249",
              "href": "tel:+359884525249"
            }
          ]
        }
      ],
      "cta": {
        "id": "about-cta",
        "label": "Контакт с продавача",
        "href": "/contact",
        "detail": "Потвърдете наличност, цена, документи и посещение."
      }
    }
  },
  {
    "id": "guides",
    "label": "Полезно",
    "href": "/blog",
    "menu": {
      "title": "Насоки за купувача",
      "description": "Редакционни демо материали; не представляват обещани услуги на дилъра.",
      "features": [
        {
          "id": "guide-inspection",
          "title": "Преди огледа",
          "detail": "Кои факти да уточните.",
          "image": "/media/stock/11785220779595617-card.webp",
          "href": "/blog-detail/1"
        },
        {
          "id": "guide-documents",
          "title": "Документи по обявата",
          "detail": "Какви въпроси да подготвите.",
          "image": "/media/stock/21724767264834325-card.webp",
          "href": "/blog-detail/2"
        },
        {
          "id": "guide-finance",
          "title": "Въпроси за финансиране",
          "detail": "Преди индивидуална оферта.",
          "image": "/media/stock/11768394188936705-card.webp",
          "href": "/blog-detail/3"
        }
      ],
      "groups": [
        {
          "id": "guides-library",
          "title": "Ръководства",
          "links": [
            {
              "id": "guides-all",
              "label": "Всички статии",
              "href": "/blog"
            },
            {
              "id": "guides-choice",
              "label": "Избор на автомобил",
              "href": "/blog?q=избор"
            },
            {
              "id": "guides-finance",
              "label": "Финансиране",
              "href": "/blog?category=Лизинг"
            }
          ]
        },
        {
          "id": "guides-help",
          "title": "Следващи стъпки",
          "links": [
            {
              "id": "guides-viewing",
              "label": "Оглед",
              "href": "/blog?category=Оглед"
            },
            {
              "id": "guides-contact",
              "label": "Контакти",
              "href": "/contact"
            },
            {
              "id": "guides-ask",
              "label": "Задайте въпрос",
              "href": "/contact"
            }
          ]
        }
      ],
      "cta": {
        "id": "guides-cta",
        "label": "Всички статии",
        "href": "/blog",
        "detail": "Практични въпроси преди решение за покупка."
      }
    }
  },
  {
    "id": "contact",
    "label": "Контакти",
    "href": "/contact"
  }
];
