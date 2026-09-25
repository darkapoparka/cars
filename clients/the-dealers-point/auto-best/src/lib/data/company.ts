import { brand } from '$config/brand';

export type CompanyServiceIcon = 'inspection' | 'import' | 'leasing' | 'trade-in';
type CompanyService = { index: string; icon: CompanyServiceIcon; title: string; description: string; href: string; cta: string; };
export type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';
export type ContactTopic = { id: ContactTopicId; label: string; title: string; description: string; mobileDescription?: string; };

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {};
export function resolveImportUrl(value: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate || candidate.length > 2048) return null;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export const companyServices: CompanyService[] = [
  {
    "index": "01",
    "icon": "inspection",
    "title": "Dealer service",
    "description": "Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=inspection",
    "cta": "Ask the dealer"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Dealer service",
    "description": "Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=import",
    "cta": "Ask the dealer"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Dealer service",
    "description": "Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=leasing",
    "cta": "Ask the dealer"
  }
];
export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "Общ въпрос",
    "title": "Разговор с екипа",
    "description": "For availability, next steps or any other question about {dealerName}."
  },
  {
    "id": "inspection",
    "label": "Оглед",
    "title": "Viewing in {dealerCity}",
    "description": "Уговорете посещение предварително, за да подготвим конкретния автомобил и да отделим нужното време."
  },
  {
    "id": "import",
    "label": "Внос",
    "title": "Внос по заявка",
    "description": "Изпратете обява или задайте марка, модел, година и бюджет. След това уточняваме следващите стъпки с вас.",
    "mobileDescription": "Изпратете обява или задайте модел и бюджет."
  },
  {
    "id": "leasing",
    "label": "Лизинг",
    "title": "Собствен лизинг",
    "description": "Получете актуални условия според избрания автомобил и конкретната сделка."
  },
  {
    "id": "trade-in",
    "label": "Бартер",
    "title": "Бартер и оценка",
    "description": "Разкажете ни за автомобила, който искате да предложите, и поискайте индивидуална оценка.",
    "mobileDescription": "Поискайте оценка за продажба или бартер."
  }
];
export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = {"latitude":0,"longitude":0} as const;
export const dealerAddress = brand.address;
