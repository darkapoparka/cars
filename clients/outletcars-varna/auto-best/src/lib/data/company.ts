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
    "title": "Оглед в Варна",
    "description": "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
    "href": "/contact?topic=inspection",
    "cta": "Уговорете оглед"
  }
];
export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "Общ въпрос",
    "title": "Разговор с екипа",
    "description": "Свържете се с OUTLETCARS.BG, за да потвърдите наличност, данни и следваща стъпка."
  },
  {
    "id": "inspection",
    "label": "Оглед",
    "title": "Оглед в Варна",
    "description": "Свържете се с OUTLETCARS.BG, за да потвърдите наличност, данни и следваща стъпка."
  },
  {
    "id": "import",
    "label": "Внос",
    "title": "Запитване за внос",
    "description": "Свържете се с OUTLETCARS.BG, за да потвърдите наличност, данни и следваща стъпка."
  },
  {
    "id": "leasing",
    "label": "Лизинг",
    "title": "Запитване за лизинг",
    "description": "Свържете се с OUTLETCARS.BG, за да потвърдите наличност, данни и следваща стъпка."
  },
  {
    "id": "trade-in",
    "label": "Бартер",
    "title": "Запитване за бартер",
    "description": "Свържете се с OUTLETCARS.BG, за да потвърдите наличност, данни и следваща стъпка."
  }
];
export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = {"latitude":0,"longitude":0} as const;
export const dealerAddress = brand.address;
