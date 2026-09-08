import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';

type CompanyService = {
  index: string;
  icon: CompanyServiceIcon;
  title: string;
  description: string;
  href: string;
  cta: string;
};

type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';

export type ContactTopic = {
  id: ContactTopicId;
  label: string;
  title: string;
  description: string;
  mobileDescription?: string;
};

/** Conversation prompts, not a promise of service or a submitted enquiry. */
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': {
    title: 'Подгответе за разговора',
    items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява']
  },
  import: {
    title: 'Какъв автомобил търсите?',
    items: ['Марка, модел и предпочитания', 'Бюджет за покупката и вноса', 'Линк към обява, ако вече сте избрали']
  },
  leasing: {
    title: 'Обсъдете с екипа',
    items: ['Автомобилът, който сте избрали', 'Първоначална вноска и срок', 'Актуални условия за конкретната сделка']
  },
  inspection: {
    title: 'Уговорете посещението',
    items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение от екипа по телефона']
  }
};

/** Validate a user-provided listing link without fetching or inspecting its destination. */
export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

export const companyServices: CompanyService[] = [
  {
    "index": "01",
    "icon": "inspection",
    "title": "Оглед във Варна",
    "description": "Обадете се за наличност и удобен час.",
    "href": "/contact?topic=inspection",
    "cta": "Уговорете оглед"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Транспорт в страната",
    "description": "В обявите е посочен транспорт до всяка точка на страната. Уточнете условията.",
    "href": "/contact",
    "cta": "Попитайте за транспорт"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Условия за покупка",
    "description": "Обсъдете конкретната цена и документите за автомобила.",
    "href": "/contact",
    "cta": "Свържете се с нас"
  },
  {
    "index": "04",
    "icon": "trade-in",
    "title": "Избор на автомобил",
    "description": "Сравнете публикуваните автомобили и техните характеристики.",
    "href": "/listing-grid",
    "cta": "Вижте автомобилите"
  }
];

export const contactTopics: ContactTopic[] = [
  {
    id: 'general',
    label: 'Общ въпрос',
    title: 'Разговор с екипа',
    description: `За наличност, следващи стъпки или друг въпрос за ${brand.name}.`
  },
  {
    id: 'inspection',
    label: 'Оглед',
    title: `Оглед в ${brand.city}`,
    description: 'Уговорете посещение предварително, за да подготвим конкретния автомобил и да отделим нужното време.'
  },
  {
    id: 'import',
    label: 'Внос',
    title: 'Запитване за автомобил',
    description: 'Демонстрационна заявка. Внос по поръчка не е потвърден като услуга. Обадете се за наличните автомобили.',
    mobileDescription: 'Добавете обява или опишете какво търсите.'
  },
  {
    id: 'leasing',
    label: 'Лизинг',
    title: 'Условия за покупка',
    description: 'Получете актуални условия според избрания автомобил и конкретната сделка.'
  },
  {
    id: 'trade-in',
    label: 'Бартер',
    title: 'Бартер и оценка',
    description: 'Демонстрационна заявка. Изкупуване и бартер не са потвърдени като услуги. Свържете се с автокъщата.',
    mobileDescription: 'Услугата не е потвърдена. Обадете се за информация.'
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];


