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
    index: '01',
    icon: 'inspection',
    title: `Оглед в ${brand.city}`,
    description: `Посещение в ${brand.city} с предварителна уговорка.`,
    href: '/contact?topic=inspection',
    cta: 'Запазете оглед'
  },
  {
    index: '02',
    icon: 'import',
    title: 'Въпрос за автомобил',
    description: 'Обсъдете автомобил, бюджет и внос с екипа.',
    href: '/contact?topic=import',
    cta: 'Попитайте за внос'
  },
  {
    index: '03',
    icon: 'leasing',
    title: 'Запитване за лизинг',
    description: 'Условия според избрания автомобил.',
    href: '/contact?topic=leasing',
    cta: 'Обсъдете лизинг'
  },
  {
    index: '04',
    icon: 'trade-in',
    title: 'Въпрос за замяна',
    description: 'Попитайте дали е възможна замяна за избрания автомобил.',
    href: '/contact?topic=trade-in',
    cta: 'Поискайте оценка'
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
    title: 'Въпрос за автомобил',
    description: 'Обсъдете критериите си за автомобил, бюджет и предпочитания за внос с екипа.',
    mobileDescription: 'Добавете обява или опишете какво търсите.'
  },
  {
    id: 'leasing',
    label: 'Лизинг',
    title: 'Запитване за лизинг',
    description: 'Получете актуални условия според избрания автомобил и конкретната сделка.'
  },
  {
    id: 'trade-in',
    label: 'Бартер',
    title: 'Бартер и оценка',
    description: 'Разкажете ни за автомобила, който искате да предложите, и поискайте индивидуална оценка.',
    mobileDescription: 'Поискайте оценка за продажба или бартер.'
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

// Map uses verified address search; no unverified coordinates.
