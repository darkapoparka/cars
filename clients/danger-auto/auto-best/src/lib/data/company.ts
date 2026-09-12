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

/** Public dealer statements checked on 2026-09-09; not a live service feed. */
export const companySources = {
  observedAt: '2026-09-09',
  inventory: 'https://dangerauto.mobile.bg/',
  contacts: 'https://dangerauto.mobile.bg/contacts',
  map: 'https://www.mobile.bg/pcgi/mapgs.cgi?lat=42.6425458&lng=23.4007179&s=1',
  financing: 'The seller explicitly states bank financing, not in-house leasing. No bank, rate, term or approval promise is represented here.'
} as const;

/** Preparation for a conversation; this application does not send enquiries. */
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': {
    title: 'Подгответе за разговора',
    items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява']
  },
  import: {
    title: 'Уточнете търсения автомобил',
    items: ['Марка, модел и предпочитания', 'Бюджет и желан срок', 'Потвърждение дали конкретната заявка може да бъде изпълнена']
  },
  leasing: {
    title: 'Въпроси за банково финансиране',
    items: ['Избран автомобил и обявена цена', 'Коя банка предлага финансирането', 'Писмена индивидуална оферта с всички разходи и условия']
  },
  inspection: {
    title: 'Уговорете посещението',
    items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение на наличност, адрес и работно време по телефона']
  }
};

/** Validate a supplied listing URL without fetching its destination. */
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
    index: '01',
    icon: 'inspection',
    title: `Оглед в ${brand.city}`,
    description: 'Уточнете наличността и часа за посещение в Горубляне по телефона.',
    href: '/contact?topic=inspection',
    cta: 'Уговорете оглед'
  },
  {
    index: '02',
    icon: 'import',
    title: 'Внос на автомобили',
    description: 'Дилърът публикува автомобили нов внос. Обсъдете възможностите за конкретно търсене.',
    href: '/contact?topic=import',
    cta: 'Попитайте за внос'
  },
  {
    index: '03',
    icon: 'leasing',
    title: 'Банково финансиране',
    description: 'DANGER AUTO посочва финансиране през банка, а не собствен лизинг. Условията се потвърждават индивидуално.',
    href: '/contact?topic=leasing',
    cta: 'Уточнете условията'
  },
  {
    index: '04',
    icon: 'trade-in',
    title: 'Възможност за замяна',
    description: 'В обявите е посочена възможност за замяна. Приемането и оценката се договарят за конкретния автомобил.',
    href: '/contact?topic=trade-in',
    cta: 'Попитайте за замяна'
  }
];

export const contactTopics: ContactTopic[] = [
  {
    id: 'general',
    label: 'Общ въпрос',
    title: 'Разговор с дилъра',
    description: `Уточнете наличност, цена и следващи стъпки с ${brand.name}.`
  },
  {
    id: 'inspection',
    label: 'Оглед',
    title: `Оглед в ${brand.city}`,
    description: 'Потвърдете наличността на избрания автомобил, работното време и точния час за посещение преди пътуване.'
  },
  {
    id: 'import',
    label: 'Внос',
    title: 'Въпрос за внос',
    description: 'Опишете търсения автомобил и уточнете с дилъра дали може да предложи подходящ вариант.',
    mobileDescription: 'Добавете обява или опишете търсения автомобил.'
  },
  {
    id: 'leasing',
    label: 'Банково финансиране',
    title: 'Финансиране през банка',
    description: 'Дилърът не предлага собствен лизинг. Поискайте индивидуална оферта от посочената банка; този демо сайт не приема заявления и не обещава одобрение.'
  },
  {
    id: 'trade-in',
    label: 'Замяна',
    title: 'Обсъдете замяна',
    description: 'Представете автомобила си и попитайте за индивидуална оценка. Няма автоматична оферта или гарантирано приемане.',
    mobileDescription: 'Уточнете възможностите за конкретния автомобил.'
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

/** Coordinates from the map embedded in this dealer’s current contacts page. */
export const showroomCoordinates = {
  latitude: 42.6425458,
  longitude: 23.4007179
} as const;
