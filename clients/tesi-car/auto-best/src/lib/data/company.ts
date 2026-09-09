import { brand } from '$config/brand';
import facts from './dealer-facts.json';

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

// Existing topic URLs are retained. These are questions, never service promises.
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': {
    title: 'Попитайте дали се разглежда бартер',
    items: ['Марка, модел и година на вашия автомобил', 'Пробег и състояние', 'Няма потвърдени условия за бартер в източника']
  },
  import: {
    title: 'Регистрация и документи',
    items: ['Конкретният автомобил и неговите документи', 'Регистрация или транзитни номера', 'Потвърдете обхвата, срока и таксите директно']
  },
  leasing: {
    title: 'Поискайте конкретни условия',
    items: ['Избраният автомобил и обявената цена', 'Първоначална вноска и срок', 'Доставчик, обща дължима сума и такси — няма потвърдени условия в демото']
  },
  inspection: {
    title: 'Уговорете оглед по телефона',
    items: ['Автомобилът от обявата', 'Удобен ден и час', 'Потвърдете наличността и точния вход преди пътуване']
  }
};

/** Accept a reference URL as text only; never request its destination. */
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
    index: '01', icon: 'inspection', title: `Оглед във ${brand.city}`,
    description: 'Потвърдете по телефона автомобила, удобния час и точния вход на автокъщата.',
    href: '/contact?topic=inspection', cta: 'Обсъдете оглед'
  },
  {
    index: '02', icon: 'import', title: 'Регистрация и транзитни номера',
    description: 'В обявите е посочено съдействие в КАТ Варна. Обхватът, срокът и таксите се уточняват директно.',
    href: '/contact?topic=import', cta: 'Попитайте за документи'
  },
  {
    index: '03', icon: 'leasing', title: 'Въпроси за финансиране',
    description: 'Обявите споменават лизинг, но няма потвърдени условия или собствено финансиране. Поискайте конкретна оферта.',
    href: '/contact?topic=leasing', cta: 'Попитайте за условия'
  },
  {
    index: '04', icon: 'inspection', title: 'Детайли за автомобила',
    description: 'Уточнете състоянието, документите и данните от конкретната обява преди решение.',
    href: '/contact?topic=general', cta: 'Задайте въпрос'
  }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с автокъщата', description: `За цена, наличност или данни от обява на ${brand.name}.` },
  { id: 'inspection', label: 'Оглед', title: `Оглед във ${brand.city}`, description: facts.appointment, mobileDescription: 'Обадете се преди посещение.' },
  { id: 'import', label: 'Документи', title: 'Регистрация и транзитни номера', description: 'Автокъщата посочва съдействие в КАТ Варна. Потвърдете конкретния обхват и такси директно. Внос по поръчка не е потвърден.', mobileDescription: 'Уточнете документите и възможното съдействие.' },
  { id: 'leasing', label: 'Финансиране', title: 'Индивидуални условия', description: 'Лизингът е споменат в обявите. Няма потвърдени условия, кредитор, одобрение или гаранция за финансиране в този проект.' },
  { id: 'trade-in', label: 'Въпрос за бартер', title: 'Възможен ли е бартер?', description: 'Няма потвърдена услуга или условия за бартер. Попитайте автокъщата, без да приемате, че предложение е одобрено.', mobileDescription: 'Възможността за бартер не е потвърдена.' }
];
export const resolveContactTopic = (value: string | null) =>
  contactTopics.find(topic => topic.id === value) ?? contactTopics[0];

// No source-backed coordinates were supplied; do not inherit the Sofia pin.
export const showroomCoordinates: { latitude: number; longitude: number } | null = facts.coordinates;
