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
    "description": "Contact the showroom before travelling and confirm availability. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=inspection",
    "cta": "Ask the dealer"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Dealer service",
    "description": "Contact the showroom before travelling and confirm availability. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=import",
    "cta": "Ask the dealer"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Dealer service",
    "description": "Contact the showroom before travelling and confirm availability. Proposal refresh and concept stock artwork for unpublished owner review; not represented as official source artwork.",
    "href": "/contact?topic=leasing",
    "cta": "Ask the dealer"
  }
];
export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "General question",
    "title": "Contact the dealer",
    "description": "Contact Dealers Point to confirm availability, details, and the next step."
  },
  {
    "id": "inspection",
    "label": "Viewing",
    "title": "Viewing in Dubai",
    "description": "Contact Dealers Point to confirm availability, details, and the next step."
  },
  {
    "id": "import",
    "label": "Import",
    "title": "Import enquiry",
    "description": "Contact Dealers Point to confirm availability, details, and the next step."
  },
  {
    "id": "leasing",
    "label": "Financing",
    "title": "Financing enquiry",
    "description": "Contact Dealers Point to confirm availability, details, and the next step."
  },
  {
    "id": "trade-in",
    "label": "Trade-in",
    "title": "Trade-in enquiry",
    "description": "Contact Dealers Point to confirm availability, details, and the next step."
  }
];
export const resolveContactTopic = (value: string | null) =>
  contactTopics.find((topic) => topic.id === value) ?? contactTopics[0];
export const showroomCoordinates = {"latitude":0,"longitude":0} as const;
export const dealerAddress = brand.address;
