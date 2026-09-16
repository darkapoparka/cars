import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string; };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string; };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': { title: 'Подгответе за разговора', items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява'] },
  import: { title: 'Какъв автомобил търсите?', items: ['Марка, модел и предпочитания', 'Бюджет за покупката и вноса', 'Линк към обява, ако вече сте избрали'] },
  leasing: { title: 'Обсъдете с екипа', items: ['Автомобилът, който сте избрали', 'Първоначална вноска и срок', 'Актуални условия за конкретната сделка'] },
  inspection: { title: 'Уговорете посещението', items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение от екипа по телефона'] }
};

export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null; }
  catch { return null; }
}

export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: `Оглед в ${brand.city}`, description: 'Посещение в шоурума с предварителна уговорка.', href: '/contact?topic=inspection', cta: 'Запазете оглед' },
  { index: '02', icon: 'import', title: 'Внос и автомобил по поръчка', description: 'Обсъдете критерии, бюджет и следващи стъпки с екипа.', href: '/contact?topic=import', cta: 'Попитайте за внос' },
  { index: '03', icon: 'leasing', title: 'Лизинг и разсрочване', description: 'Условията се потвърждават за конкретния автомобил и клиент.', href: '/contact?topic=leasing', cta: 'Обсъдете условия' },
  { index: '04', icon: 'trade-in', title: 'Продажба или замяна', description: 'Предложете своя автомобил за индивидуален преглед и оценка.', href: '/contact?topic=trade-in', cta: 'Поискайте оценка' }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с екипа', description: `За наличност, оглед или друг въпрос към ${brand.name}.` },
  { id: 'inspection', label: 'Оглед', title: `Оглед в ${brand.city}`, description: 'Уговорете посещение предварително, за да бъде подготвен конкретният автомобил.' },
  { id: 'import', label: 'Внос', title: 'Автомобил по поръчка', description: 'Изпратете обява или посочете марка, модел, година и бюджет.', mobileDescription: 'Изпратете обява или задайте модел и бюджет.' },
  { id: 'leasing', label: 'Лизинг', title: 'Лизинг и разсрочване', description: 'Получете актуални условия според избрания автомобил и конкретната сделка.' },
  { id: 'trade-in', label: 'Замяна', title: 'Продажба или замяна', description: 'Разкажете ни за автомобила, който искате да предложите, и поискайте индивидуална оценка.' }
];
export const resolveContactTopic = (value: string | null) => contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = { latitude: 43.2279192, longitude: 27.8574313 } as const;
