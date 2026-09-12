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

type ContactTopicId = 'general' | 'inspection' | 'leasing';

export type ContactTopic = {
  id: ContactTopicId;
  label: string;
  title: string;
  description: string;
  mobileDescription?: string;
};

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  leasing: {
    title: 'Уточнете конкретната оферта',
    items: ['Автомобилът, който сте избрали', 'Предпочитан срок и бюджет', 'Актуални условия за конкретната обява']
  },
  inspection: {
    title: 'Уговорете оглед',
    items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение по телефона']
  }
};

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
    description: `Разгледайте избрания автомобил в ${brand.city} след предварителна уговорка.`,
    href: '/contact?topic=inspection',
    cta: 'Уговорете оглед'
  },
  {
    index: '02',
    icon: 'leasing',
    title: 'Лизинг по конкретна обява',
    description: 'Част от публикуваните автомобили са обозначени с възможност за лизинг; условията се уточняват индивидуално.',
    href: '/contact?topic=leasing',
    cta: 'Попитайте за условия'
  }
];

export const contactTopics: ContactTopic[] = [
  {
    id: 'general',
    label: 'Общ въпрос',
    title: 'Разговор с автокъщата',
    description: `За наличност, състояние, оглед или друг въпрос към ${brand.name}.`
  },
  {
    id: 'inspection',
    label: 'Оглед',
    title: `Оглед в ${brand.city}`,
    description: 'Свържете се предварително, за да потвърдите конкретния автомобил и удобен час.'
  },
  {
    id: 'leasing',
    label: 'Лизинг',
    title: 'Лизинг по конкретна обява',
    description: 'Попитайте за актуалните условия за автомобила, който сте избрали.'
  }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

// Kept only for compatibility; the client map renders from the published address string.
export const showroomCoordinates = { latitude: 43.4170, longitude: 24.6067 } as const;
