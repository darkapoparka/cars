import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string; };
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string; };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  trade-in: { title: 'Подгответе за разговора', items: ['Марка, модел и година', 'Пробег и състояние', 'Снимки или линк към обява'] },
  import: { title: 'Какъв автомобил търсите?', items: ['Марка и модел', 'Бюджет', 'Линк към обява, ако имате'] },
  leasing: { title: 'Обсъдете условията', items: ['Избран автомобил', 'Желана първоначална вноска', 'Предпочитан срок'] },
  inspection: { title: 'Уговорете оглед', items: ['Избран автомобил', 'Удобен ден и час', 'Потвърждение по телефона'] }
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
  { index: '01', icon: 'inspection', title: `Оглед в ${brand.city}`, description: 'Точният адрес и часът се потвърждават по телефона.', href: '/contact?topic=inspection', cta: 'Уговорете оглед' },
  { index: '02', icon: 'import', title: 'Въпрос за внос', description: 'Попитайте за конкретен автомобил и възможни следващи стъпки.', href: '/contact?topic=import', cta: 'Попитайте' },
  { index: '03', icon: 'leasing', title: 'Финансиране', description: 'Условията се уточняват индивидуално; демото не обещава одобрение.', href: '/contact?topic=leasing', cta: 'Обсъдете условия' },
  { index: '04', icon: 'trade-in', title: 'Бартер и оценка', description: 'Изпратете данни за автомобила си за разговор с екипа.', href: '/contact?topic=trade-in', cta: 'Поискайте оценка' }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: 'Разговор с екипа', description: `За наличност или друг въпрос за ${brand.name}.` },
  { id: 'inspection', label: 'Оглед', title: 'Уговорете оглед', description: 'Потвърдете автомобила, точния адрес и часа по телефона.' },
  { id: 'import', label: 'Внос', title: 'Въпрос за внос', description: 'Опишете автомобила, който търсите, и попитайте за възможностите.' },
  { id: 'leasing', label: 'Финансиране', title: 'Финансиране по запитване', description: 'Конкретните условия зависят от автомобила и партньора; няма обещание за одобрение.' },
  { id: 'trade-in', label: 'Бартер', title: 'Бартер и оценка', description: 'Опишете автомобила, който искате да предложите.' }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
