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

type ContactTopicId = 'general' | 'inspection' | 'import' | 'leasing' | 'trade-in';

export type ContactTopic = {
  id: ContactTopicId;
  label: string;
  title: string;
  description: string;
  mobileDescription?: string;
};

export const contactPreparation: Partial<Record<ContactTopicId, { title: string; items: string[] }>> = {
  "trade-in": {
    "title": "Prepare for a conversation",
    "items": [
      "Make, model and year",
      "Mileage and condition",
      "Photographs and vehicle documents"
    ]
  },
  "import": {
    "title": "Your vehicle requirements",
    "items": [
      "Preferred make, model and specification",
      "Your purchase budget",
      "A listing link, when available"
    ]
  },
  "leasing": {
    "title": "Questions about purchase terms",
    "items": [
      "The selected vehicle and advertised price",
      "Any additional charges",
      "Written terms before making a commitment"
    ]
  },
  "inspection": {
    "title": "Before travelling",
    "items": [
      "Confirm the selected car is still available",
      "Confirm its actual viewing location",
      "Arrange a convenient viewing time"
    ]
  }
};
/** Validate a user-provided listing link without fetching or inspecting its destination. */
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
    "index": "01",
    "icon": "inspection",
    "title": "Arrange a viewing",
    "description": "Confirm availability and the viewing location directly before travelling.",
    "href": "/contact?topic=inspection",
    "cta": "Prepare a viewing enquiry"
  },
  {
    "index": "02",
    "icon": "import",
    "title": "Find your next car",
    "description": "Compare the dated listing samples and choose the specification that suits you.",
    "href": "/listing-grid",
    "cta": "Browse the samples"
  },
  {
    "index": "03",
    "icon": "leasing",
    "title": "Price and purchase terms",
    "description": "Ask what is included in the price. No finance offer or approval is provided by this preview.",
    "href": "/contact?topic=leasing",
    "cta": "Prepare your questions"
  },
  {
    "index": "04",
    "icon": "trade-in",
    "title": "Ask about trade-in",
    "description": "The source profile advertises trade-in enquiries. Acceptance and valuation must be confirmed directly.",
    "href": "/contact?topic=trade-in",
    "cta": "Prepare vehicle details"
  }
];
export const contactTopics: ContactTopic[] = [
  {
    "id": "general",
    "label": "General enquiry",
    "title": "Talk to the dealership",
    "description": "Confirm current availability, viewing locations and purchase details directly."
  },
  {
    "id": "inspection",
    "label": "Viewing",
    "title": "Arrange a viewing",
    "description": "The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted."
  },
  {
    "id": "import",
    "label": "Vehicle search",
    "title": "Describe the car you need",
    "description": "Prepare your requirements locally. Sourcing or import arrangements are not promised by this preview.",
    "mobileDescription": "Add a listing or describe your requirements."
  },
  {
    "id": "leasing",
    "label": "Purchase terms",
    "title": "Price and purchase terms",
    "description": "Ask for written terms for your selected car. This preview offers no finance product or approval."
  },
  {
    "id": "trade-in",
    "label": "Trade-in enquiry",
    "title": "Ask about your current car",
    "description": "Prepare vehicle details for a conversation. This is not a valuation, acceptance or sent request.",
    "mobileDescription": "Prepare details locally; no request is sent."
  }
];
export const resolveContactTopic = (value: string | null) => contactTopics.find(topic => topic.id === value) ?? contactTopics[0];
