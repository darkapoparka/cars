import { brand } from '$config/brand';
export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string };
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': { title: 'Подгответе за разговора', items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява'] },
  import: { title: 'Какъв автомобил търсите?', items: ['Марка, модел и предпочитания', 'Бюджет за покупката и вноса', 'Линк към обява, ако вече сте избрали'] },
  leasing: { title: 'Обсъдете с екипа', items: ['Автомобилът, който сте избрали', 'Първоначална вноска и срок', 'Актуални условия за конкретната сделка'] },
  inspection: { title: 'Уговорете посещението', items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение от екипа по телефона'] }
};
export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try {
    const url = new URL(candidate);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    return url.href;
  } catch { return null; }
}
export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: `Оглед в ${brand.city}`, description: 'Потвърдете наличността и уговорете удобно посещение.', href: '/contact?topic=inspection', cta: 'Запазете оглед' },
  { index: '02', icon: 'import', title: 'Внос по заявка', description: 'Обсъдете автомобила, бюджета и възможностите за внос.', href: '/contact?topic=import', cta: 'Попитайте за внос' },
  { index: '03', icon: 'leasing', title: 'Лизинг по запитване', description: 'Поискайте актуално предложение за конкретния автомобил.', href: '/contact?topic=leasing', cta: 'Обсъдете лизинг' },
  { index: '04', icon: 'trade-in', title: 'Оценка за бартер', description: 'Предложете своя автомобил за индивидуална оценка.', href: '/contact?topic=trade-in', cta: 'Поискайте оценка' }
];
export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с екипа', description: `За наличност, следващи стъпки или друг въпрос за ${brand.name}.` },
  { id: 'inspection', label: 'Оглед', title: `Оглед в ${brand.city}`, description: 'Уговорете посещение предварително и потвърдете наличността на избрания автомобил.' },
  { id: 'import', label: 'Внос', title: 'Внос по заявка', description: 'Обсъдете критериите, бюджета и предпочитанията си с екипа.', mobileDescription: 'Добавете обява или опишете какво търсите.' },
  { id: 'leasing', label: 'Лизинг', title: 'Лизинг по запитване', description: 'Получете актуални условия според автомобила и конкретната сделка.' },
  { id: 'trade-in', label: 'Бартер', title: 'Бартер и оценка', description: 'Разкажете за автомобила, който искате да предложите, и поискайте оценка.', mobileDescription: 'Поискайте оценка за продажба или бартер.' }
];
export const resolveContactTopic = (value: string | null) => contactTopics.find(topic => topic.id === value) ?? contactTopics[0];
// Dealer showroom pin retained from the repository's ELIQ about-source capture (2026-09-06), not the registered office.
export const showroomCoordinates = { latitude: 42.2015364, longitude: 24.3126771 } as const;
