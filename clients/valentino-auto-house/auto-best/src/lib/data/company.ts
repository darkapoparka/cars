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

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  "inspection": {
    "title": "За огледа",
    "items": [
      "Избраният автомобил и номерът на обявата",
      "Удобен ден и час",
      "Потвърждение по телефона"
    ]
  },
  "import": {
    "title": "За документите",
    "items": [
      "Линк или номер на обявата",
      "Какви документи са налични",
      "Какво съдействие и какви разходи се предвиждат"
    ]
  },
  "leasing": {
    "title": "Преди индивидуална оферта",
    "items": [
      "Избраният автомобил и обявената цена",
      "Желана първоначална вноска и срок",
      "Кой е доставчикът и какви са всички условия"
    ]
  },
  "trade-in": {
    "title": "За личната чернова",
    "items": [
      "Марка, модел и година",
      "Вашият въпрос и известните факти",
      "Първо потвърдете дали дилърът предлага такава услуга"
    ]
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
    "title": "Оглед в София",
    "description": "Потвърдете наличността и уговорете оглед в Горубляне.",
    "href": "/contact?topic=inspection",
    "cta": "Уговорете оглед"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Документи и регистрация",
    "description": "В обявите е посочено съдействие за регистрация. Уточнете обхвата и цената.",
    "href": "/contact?topic=import",
    "cta": "Попитайте за документите"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Финансиране по запитване",
    "description": "Публикувано е външно финансиране. Условията и одобрението се уточняват индивидуално.",
    "href": "/contact?topic=leasing",
    "cta": "Обсъдете условията"
  },
  {
    "index": "04",
    "icon": "trade-in",
    "title": "Наличност и покупка",
    "description": "Уточнете цената, оборудването и документите за конкретната обява.",
    "href": "/contact?topic=general",
    "cta": "Задайте въпрос"
  }
];

export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "Общ въпрос",
    "title": "Разговор с Valentino",
    "description": "За наличност, цена, документи или друг въпрос по публикуваните обяви."
  },
  {
    "id": "inspection",
    "label": "Оглед",
    "title": "Оглед в София",
    "description": "Обадете се за конкретния автомобил и потвърдете удобен ден и час. Този сайт не запазва посещение онлайн."
  },
  {
    "id": "import",
    "label": "Документи",
    "title": "Документи и регистрация",
    "description": "Уточнете наличните документи и публикуваното съдействие за регистрация. Внос по индивидуална поръчка не е потвърдена услуга.",
    "mobileDescription": "Подгответе въпрос по конкретна обява. Нищо не се изпраща автоматично."
  },
  {
    "id": "leasing",
    "label": "Финансиране",
    "title": "Финансиране по запитване",
    "description": "Попитайте за индивидуална оферта от външен доставчик. Няма обявена универсална лихва, собствен лизинг или гарантирано одобрение."
  },
  {
    "id": "trade-in",
    "label": "Вашият автомобил",
    "title": "Въпрос за вашия автомобил",
    "description": "Изкупуване и бартер не са потвърдени услуги. Формата подготвя лична чернова за разговор; не приема автомобил и не изпраща запитване.",
    "mobileDescription": "Само чернова за разговор. Бартер и изкупуване не са потвърдени."
  }
];

export const resolveContactTopic = (value: string | null) => contactTopics.find(topic => topic.id === value) ?? contactTopics[0];

// Exact coordinates were not established; the map consumer searches the published address.
export const showroomCoordinates = null;
