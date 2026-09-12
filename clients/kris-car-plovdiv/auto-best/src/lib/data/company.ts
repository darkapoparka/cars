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
    "description": "Потвърдете избрания автомобил и удобен час по телефона.",
    "href": "/contact?topic=inspection",
    "cta": "Уговорете оглед"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "История и документи",
    "description": "Поискайте сервизната история и документите за конкретната обява.",
    "href": "/contact?topic=import",
    "cta": "Попитайте за документите"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Финансиране",
    "description": "Обявите посочват лизингови възможности. Условията и одобрението са индивидуални.",
    "href": "/contact?topic=leasing",
    "cta": "Обсъдете условията"
  },
  {
    "index": "04",
    "icon": "trade-in",
    "title": "Други въпроси",
    "description": "Попитайте дали е възможна замяна или предложение за вашия автомобил.",
    "href": "/contact?topic=trade-in",
    "cta": "Свържете се"
  }
];

export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "Общ въпрос",
    "title": "Свържете се с Крис Кар",
    "description": "Попитайте за наличност, адрес или конкретна обява."
  },
  {
    "id": "inspection",
    "label": "Оглед",
    "title": "Оглед в Пловдив",
    "description": "Изберете автомобил и потвърдете удобен час с автокъщата. Формата не прави резервация."
  },
  {
    "id": "import",
    "label": "Документи / внос",
    "title": "Въпрос за история и документи",
    "description": "Поискайте информация за произход, сервизна история и възможност за внос. Не се обещава непотвърдена услуга."
  },
  {
    "id": "leasing",
    "label": "Финансиране",
    "title": "Въпрос за лизинг",
    "description": "Поискайте актуални писмени условия от финансиращото дружество. Калкулаторът не е одобрение или оферта."
  },
  {
    "id": "trade-in",
    "label": "Замяна / продажба",
    "title": "Въпрос за вашия автомобил",
    "description": "Попитайте дали автокъщата приема предложения за замяна или продажба. Не се извършва оценка в този преглед."
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

export const showroomCoordinates = {"latitude":42.1485358,"longitude":24.8280636};
