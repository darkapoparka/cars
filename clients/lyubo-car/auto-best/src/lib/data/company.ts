import { brand } from '$config/brand';
import { dealerProfile } from './dealer-profile';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string };

export const companySources = {
  observedAt: dealerProfile.observedAt,
  inventory: dealerProfile.sourceInventory,
  contacts: dealerProfile.sourceContacts,
  map: dealerProfile.mapsUrl,
  financing: dealerProfile.financingSummary,
} as const;

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  inspection: { title: 'Уговорете посещението', items: ['Автомобилът, който искате да видите', 'Удобен ден и час', 'Потвърждение на наличност и адрес по телефона'] },
  leasing: { title: 'Въпроси за финансиране', items: ['Избран автомобил и обявена кешова цена', 'Кой финансов партньор предлага конкретната оферта', 'Писмени условия, всички разходи и срокове'] },
  import: { title: 'Уточнете произхода', items: ['Конкретен автомобил или обява', 'Сервизна история и документи', 'Какво може да бъде потвърдено преди оглед'] },
  'trade-in': { title: 'Подгответе за разговора', items: ['Марка, модел и година', 'Пробег и състояние', 'Попитайте дали дилърът приема замяна за конкретната сделка'] },
};

export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try { const url = new URL(candidate); if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null; return url.href; } catch { return null; }
}

export const companyServices: CompanyService[] = [
  { index: '01', icon: 'inspection', title: `Оглед в ${brand.city}`, description: dealerProfile.inspectionSummary, href: '/contact?topic=inspection', cta: 'Уговорете оглед' },
  { index: '02', icon: 'import', title: 'Произход и история', description: dealerProfile.provenanceSummary, href: '/contact?topic=import', cta: 'Уточнете автомобила' },
  { index: '03', icon: 'leasing', title: 'Финансиране', description: dealerProfile.financingSummary, href: '/contact?topic=leasing', cta: 'Уточнете условията' },
  { index: '04', icon: 'trade-in', title: 'Разговор с дилъра', description: 'За замяна, изкупуване или други условия попитайте за конкретния автомобил. Демо сайтът не обещава приемане или оценка.', href: '/contact?topic=trade-in', cta: 'Свържете се' },
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с дилъра', description: `Уточнете наличност, цена и следващи стъпки с ${brand.name}.` },
  { id: 'inspection', label: 'Оглед', title: `Оглед в ${brand.city}`, description: dealerProfile.inspectionSummary },
  { id: 'import', label: 'Произход', title: 'Въпрос за автомобил', description: dealerProfile.provenanceSummary, mobileDescription: 'Добавете обява или опишете автомобила.' },
  { id: 'leasing', label: 'Финансиране', title: 'Условия за финансиране', description: `${dealerProfile.financingSummary} Този демо сайт не приема кредитни заявления и не обещава одобрение.` },
  { id: 'trade-in', label: 'Замяна', title: 'Обсъдете замяна', description: 'Представете автомобила си и попитайте за индивидуална възможност. Няма автоматична оферта или гарантирано приемане.' },
];
export const resolveContactTopic = (value: string | null) => contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = dealerProfile.coordinates;
