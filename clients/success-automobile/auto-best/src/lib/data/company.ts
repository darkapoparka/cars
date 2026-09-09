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
    "title": "Оглед в Пловдив",
    "description": "Потвърдете автомобила, адреса и удобния час по телефона.",
    "href": "/contact?topic=inspection",
    "cta": "Уговорете посещение"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Документи за автомобила",
    "description": "Поискайте информация за произход, регистрация и документи преди решение.",
    "href": "/contact?topic=import",
    "cta": "Попитайте за документи"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Бюджет и условия",
    "description": "Потвърдете цялата цена и условията. Демо калкулаторът не е оферта или одобрение за кредит.",
    "href": "/contact?topic=leasing",
    "cta": "Уточнете условията"
  },
  {
    "index": "04",
    "icon": "trade-in",
    "title": "Въпрос за автомобила",
    "description": "Изберете обява и подгответе въпросите си. Този преглед не изпраща съобщения.",
    "href": "/contact?topic=trade-in",
    "cta": "Подгответе въпрос"
  }
];

export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "Общ въпрос",
    "title": "Контакт с Success Automobile",
    "description": "Автомобили в Пловдив. Разгледайте детайлите и уговорете оглед."
  },
  {
    "id": "inspection",
    "label": "Оглед",
    "title": "Оглед в Пловдив",
    "description": "Обадете се, за да потвърдите наличността и часа. Онлайн потвърждение за запазване не се изпраща."
  },
  {
    "id": "import",
    "label": "Документи",
    "title": "Въпрос за произход и документи",
    "description": "Уточнете произход, регистрация и налични документи за избрания автомобил."
  },
  {
    "id": "leasing",
    "label": "Условия",
    "title": "Цена и условия",
    "description": "Уточнете условията директно. Изчисленията в този демо сайт не са финансова оферта."
  },
  {
    "id": "trade-in",
    "label": "Друг въпрос",
    "title": "Въпрос към автосалона",
    "description": "Демонстрационна подготовка на запитване. Приемането на бартер или изкупуване не е потвърдено за всяка обява."
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

export const showroomCoordinates = null;
