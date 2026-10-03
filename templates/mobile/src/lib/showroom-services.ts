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
  category: ServiceCategory;
  title: string;
  copy: string;
  action: string;
  keywords?: readonly string[];
  details?: readonly { label: string; copy: string }[];
};

// Example offerings; confirm availability when personalizing the dealer template.
export const showroomServices: readonly ShowroomService[] = [
  {
    id: 'import',
    category: 'import',
    title: 'Import a car',
    copy: 'Source a car abroad to match your budget.',
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
    category: 'sell',
    title: 'Sell your car',
    copy: 'Ask for a buyout or part exchange valuation.',
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
    category: 'services',
    title: 'Viewings & test drives',
    copy: 'Arrange a car viewing or test drive.',
    action: 'Arrange a viewing',
  },
  {
    id: 'trade-in',
    category: 'services',
    title: 'Part exchange',
    copy: 'Get a valuation towards your next car.',
    action: 'Ask about part exchange',
  },
  {
    id: 'sourcing',
    category: 'services',
    title: 'Find a car',
    copy: 'Share your preferred make, model and budget.',
    action: 'Ask us to find a car',
  },
  {
    id: 'servicing',
    category: 'services',
    title: 'Servicing & repairs',
    copy: 'Ask about maintenance and repairs.',
    action: 'Ask about servicing',
  },
  {
    id: 'financing',
    category: 'financing',
    title: 'Financing',
    copy: 'Discuss payment options for your next car.',
    action: 'Ask about financing',
    details: [
      { label: 'Budget', copy: 'The car or price range you have in mind.' },
      { label: 'Deposit', copy: 'Your preferred upfront amount or part exchange.' },
      { label: 'Monthly payment', copy: 'Your preferred monthly budget.' },
    ],
  },
  {
    id: 'parts',
    category: 'parts',
    title: 'Parts & accessories',
    copy: 'Ask about replacement parts and accessories.',
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
    const phrases = [service.title, service.copy, ...(service.keywords || [])];
    const text = fold([...phrases, ...phrases.map((phrase) => translate(phrase, 'bg'))].join(' '));
    return words.every((word) => text.includes(word));
  });
}
