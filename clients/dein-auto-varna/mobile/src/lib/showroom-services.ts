import { translate } from './locale';
const categoryOptions = [
  { value: 'services', label: 'All' },
  { value: 'import', label: 'Import' },
  { value: 'sell', label: 'Sell' },
] as const;

export type ServiceTab = (typeof categoryOptions)[number]['value'];
export type ServiceCategory = ServiceTab | 'financing' | 'parts';
export const serviceQuickFilters = [
  { value: 'all', label: 'All services' },
  { value: 'viewing', label: 'Viewings' },
  { value: 'financing', label: 'Financing' },
  { value: 'parts', label: 'Parts' },
  { value: 'servicing', label: 'Maintenance' },
  { value: 'trade-in', label: 'Part exchange' },
] as const;
export type ServiceQuickFilter = (typeof serviceQuickFilters)[number]['value'];
export const importCountries = [
  { value: 'all', label: 'All countries' },
  { value: 'germany', label: 'Germany' },
  { value: 'canada', label: 'Canada' },
  { value: 'usa', label: 'USA' },
] as const;
export type ImportCountry = (typeof importCountries)[number]['value'];
export const saleEnquiryTypes = [
  { value: 'buyout', label: 'Direct sale' },
  { value: 'part-exchange', label: 'Part exchange' },
] as const;
export type SaleEnquiryType = (typeof saleEnquiryTypes)[number]['value'];

// Sample origins illustrate the template; they are not completed dealer imports.
const importExamples = [
  { vehicleId: 'bmw-540', country: 'germany' },
  { vehicleId: 'bmw-x3', country: 'canada' },
  { vehicleId: 'bmw-x6', country: 'usa' },
  { vehicleId: 'bmw-120', country: 'germany' },
] as const;

export function importCountry(value?: string | null): ImportCountry {
  return importCountries.find((country) => country.value === value)?.value || 'all';
}

export function importCountryLabel(value: string) {
  return importCountries.find((country) => country.value === value)?.label || 'Any country';
}

export function importExamplesFor(country: ImportCountry) {
  return importExamples.filter((example) => country === 'all' || example.country === country);
}

export function importCountryHref(country: ImportCountry) {
  return '/services?tab=import' + (country === 'all' ? '' : '&country=' + country);
}

export function saleEnquiryType(value?: string | null): SaleEnquiryType {
  return saleEnquiryTypes.find((type) => type.value === value)?.value || 'buyout';
}

export function saleEnquiryHref(type: SaleEnquiryType) {
  return '/services?tab=sell' + (type === 'buyout' ? '' : '&saleType=' + type);
}
export type ShowroomService = {
  id: string;
  image?: string;
  mobileImage?: string;
  icon?: 'globe' | 'car' | 'calendar' | 'reset' | 'search' | 'wrench' | 'calculator' | 'settings';
  category: ServiceCategory;
  title: string;
  mobileTitle?: string;
  copy: string;
  summary?: string;
  mobileSummary?: string;
  action: string;
  keywords?: readonly string[];
  details?: readonly { label: string; copy: string }[];
};

// Example offerings; confirm availability when personalizing the dealer template.
export const showroomServices: readonly ShowroomService[] = [
  {
    id: 'import',
    image: '/images/services/import-20261006.webp',
    mobileImage: '/images/service-cutouts/import-20261006.webp',
    icon: 'globe',
    category: 'import',
    title: 'Import a car',
    copy: 'Source a car abroad to match your budget.',
    summary: 'Import within your budget.',
    mobileSummary: 'Within your budget',
    action: 'Start an import enquiry',
    keywords: [
      'imports',
      'overseas',
      'sourcing',
      'delivery',
      'VIN',
      'make',
      'model',
      ...importCountries
        .filter((country) => country.value !== 'all')
        .map((country) => country.label),
    ],
  },
  {
    id: 'sell',
    image: '/images/services/sell-20261006.webp',
    mobileImage: '/images/service-cutouts/sell-20261006.webp',
    icon: 'car',
    category: 'sell',
    title: 'Sell your car',
    copy: 'Ask for a buyout or part exchange valuation.',
    summary: 'Get a sale or trade-in valuation.',
    mobileSummary: 'Sale or part exchange',
    action: 'Start a sale enquiry',
    keywords: [
      'buyout',
      'buy out',
      'direct sale',
      'sell my car',
      'valuation',
      'purchase',
      'VIN',
      'part exchange',
    ],
  },
  {
    id: 'viewing',
    image: '/images/services/viewing-20261006.webp',
    mobileImage: '/images/service-cutouts/viewing-20261006.webp',
    icon: 'calendar',
    category: 'services',
    title: 'Viewings & test drives',
    mobileTitle: 'Viewing & test drive',
    copy: 'Arrange a car viewing or test drive.',
    summary: 'Arrange a viewing or test drive.',
    mobileSummary: 'Arrange a viewing',
    action: 'Arrange a viewing',
  },
  {
    id: 'trade-in',
    image: '/images/services/trade-in-20261006.webp',
    mobileImage: '/images/service-cutouts/trade-in-20261006.webp',
    icon: 'reset',
    category: 'services',
    title: 'Part exchange',
    copy: 'Get a valuation towards your next car.',
    summary: 'Value your car towards an upgrade.',
    mobileSummary: 'Value your current car',
    action: 'Ask about part exchange',
  },
  {
    id: 'sourcing',
    image: '/images/services/sourcing-20261006.webp',
    mobileImage: '/images/service-cutouts/sourcing-20261006.webp',
    icon: 'search',
    category: 'services',
    title: 'Find a car',
    mobileTitle: 'Car search',
    copy: 'Share your preferred make, model and budget.',
    summary: 'Tell us your make, model and budget.',
    mobileSummary: 'Make, model and budget',
    action: 'Ask us to find a car',
  },
  {
    id: 'servicing',
    image: '/images/services/servicing-20261006.webp',
    mobileImage: '/images/service-cutouts/servicing-20261006.webp',
    icon: 'wrench',
    category: 'services',
    title: 'Servicing & repairs',
    copy: 'Ask about maintenance and repairs.',
    summary: 'Ask about servicing and repairs.',
    mobileSummary: 'Maintenance and repairs',
    action: 'Ask about servicing',
  },
  {
    id: 'financing',
    image: '/images/services/financing-20261006.webp',
    mobileImage: '/images/service-cutouts/financing-20261006.webp',
    icon: 'calculator',
    category: 'financing',
    title: 'Financing',
    copy: 'Discuss payment options for your next car.',
    summary: 'Explore payment options.',
    mobileSummary: 'Payment options',
    action: 'Ask about financing',
    details: [
      { label: 'Budget', copy: 'The car or price range you have in mind.' },
      { label: 'Deposit', copy: 'Your preferred upfront amount or part exchange.' },
      { label: 'Monthly payment', copy: 'Your preferred monthly budget.' },
    ],
  },
  {
    id: 'parts',
    image: '/images/services/parts-20261006.webp',
    mobileImage: '/images/service-cutouts/parts-20261006.webp',
    icon: 'settings',
    category: 'parts',
    title: 'Parts & accessories',
    copy: 'Ask about replacement parts and accessories.',
    summary: 'Ask about parts and accessories.',
    mobileSummary: 'For your vehicle',
    action: 'Ask about parts',
    keywords: ['vehicle'],
    details: [
      { label: 'Your vehicle', copy: 'Make, model and year.' },
      { label: 'What you need', copy: 'The part name or accessory you are looking for.' },
      { label: 'Availability', copy: 'Ask about supply and fitting options.' },
    ],
  },
];

export function serviceCategoriesFor(services: readonly ShowroomService[]) {
  return categoryOptions.filter(
    ({ value }) => value === 'services' || services.some((service) => service.category === value),
  );
}

export function serviceQuickFiltersFor(services: readonly ShowroomService[]) {
  return serviceQuickFilters.filter(
    ({ value }) => value === 'all' || services.some((service) => service.id === value),
  );
}

// Removing an unavailable offering also removes its category tab.
export const serviceCategories = serviceCategoriesFor(showroomServices);

export function showroomService(id?: string) {
  return showroomServices.find((service) => service.id === id);
}

export function serviceCategoryHref(category: ServiceCategory) {
  return category === 'services' ? '/services' : '/services?tab=' + category;
}

export function serviceSearchHref(query: string, topic: ServiceQuickFilter = 'all') {
  const params = new URLSearchParams();
  if (topic !== 'all' && topic !== 'financing' && topic !== 'parts') params.set('topic', topic);
  if (query.trim()) params.set('q', query);
  return '/services' + (params.size ? '?' + params.toString() : '');
}

export function serviceQuickFilter(value?: string | null): ServiceQuickFilter {
  return serviceQuickFilters.find((filter) => filter.value === value)?.value || 'all';
}

export function serviceQuickFilterHref(topic: ServiceQuickFilter, query = '') {
  return topic === 'financing' || topic === 'parts'
    ? serviceCategoryHref(topic)
    : serviceSearchHref(query, topic);
}

export function searchShowroomServices(services: readonly ShowroomService[], query: string) {
  const fold = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  const words = fold(query).trim().split(/\s+/).filter(Boolean);
  return services.filter((service) => {
    const phrases = [
      service.title,
      service.copy,
      service.summary || '',
      service.mobileTitle || '',
      service.mobileSummary || '',
      ...(service.keywords || []),
    ];
    const text = fold([...phrases, ...phrases.map((phrase) => translate(phrase, 'bg'))].join(' '));
    return words.every((word) => text.includes(word));
  });
}
