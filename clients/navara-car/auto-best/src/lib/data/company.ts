import { brand } from '$config/brand';
import source from './navara-data.json';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = {
  index: string; icon: CompanyServiceIcon; title: string;
  description: string; href: string; cta: string;
};
type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = {
  id: ContactTopicId; label: string; title: string;
  description: string; mobileDescription?: string;
};

/** Retained query IDs keep existing routes usable; no unverified service is promised. */
export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  'trade-in': {
    title: 'Първо попитайте за възможността',
    items: ['Продажба и бартер не са потвърдени услуги в този преглед', 'Посочете марка, модел и година', 'Не изпращайте лични документи през демонстрацията']
  },
  import: {
    title: 'Регистрация и документи',
    items: ['Посочете избраната обява', 'Попитайте за регистрация в КАТ Варна или транзитни номера', 'Уточнете документите, разходите и срока с продавача']
  },
  leasing: {
    title: 'Попитайте за условията',
    items: ['Посочете избраната обява', 'Потвърдете дали за нея се предлага лизинг', 'Поискайте писмени условия от действителния доставчик']
  },
  inspection: {
    title: 'Уточнете посещението',
    items: ['Автомобилът, който искате да видите', 'Потвърждение за наличност и цена', 'Удобен ден, час и точен вход на автокъщата']
  }
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
  { index: '01', icon: 'inspection', title: `Оглед във ${brand.city}`, description: 'Потвърдете наличността и удобен час по публикувания телефон.', href: '/contact?topic=inspection', cta: 'Уточнете оглед' },
  { index: '02', icon: 'import', title: source.business.services[1].title, description: source.business.services[1].description, href: '/contact?topic=import', cta: 'Попитайте за регистрация' },
  { index: '03', icon: 'leasing', title: source.business.services[2].title, description: 'Част от обявите са означени с „Лизинг“. Условията се уточняват, а не се обещават от тази демонстрация.', href: '/contact?topic=leasing', cta: 'Попитайте за условията' },
  { index: '04', icon: 'trade-in', title: 'Избор от каталога', description: 'Сравнете публикуваните данни за градски автомобили, SUV, комби и електромобили.', href: '/listing-grid', cta: 'Вижте автомобилите' }
];

export const contactTopics: ContactTopic[] = [
  { id: 'general', label: 'Общ въпрос', title: `Контакт с ${brand.name}`, description: 'Потвърдете данните от обявата директно с продавача.' },
  { id: 'inspection', label: 'Оглед', title: `Оглед във ${brand.city}`, description: 'Работно време не е публикувано. Обадете се предварително за наличност, час и точен вход.' },
  { id: 'import', label: 'Регистрация', title: 'Регистрация и документи', description: source.business.services[1].description, mobileDescription: 'Попитайте за регистрация или транзитни номера.' },
  { id: 'leasing', label: 'Лизинг', title: 'Лизинг по запитване', description: source.business.services[2].description },
  { id: 'trade-in', label: 'Друг автомобил', title: 'Въпрос за друг автомобил', description: 'Продажба, бартер или внос по поръчка не са потвърдени услуги в този преглед. Първо попитайте продавача дали може да съдейства.', mobileDescription: 'Първо потвърдете дали услугата се предлага.' }
];

export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];

// No independently verified map pin was published. Maps use an address search instead.
export const showroomCoordinates = { latitude: null, longitude: null } as const;
