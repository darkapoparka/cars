const categoryOptions = [
  { value: 'services', label: 'All' },
  { value: 'import', label: 'Import' },
  { value: 'sell', label: 'Sell your car' },
] as const;

export type ServiceTab = (typeof categoryOptions)[number]['value'];
export type ServiceCategory = ServiceTab | 'financing' | 'parts';
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
    copy: 'Tell us the make, model and budget you have in mind.',
    action: 'Start an import enquiry',
    keywords: ['imports', 'overseas', 'sourcing', 'delivery'],
  },
  {
    id: 'sell',
    category: 'sell',
    title: 'Sell your car',
    copy: 'Ask about a direct purchase or a valuation for part exchange.',
    action: 'Start a sale enquiry',
    keywords: ['buyout', 'buy out', 'sell my car', 'valuation', 'purchase'],
  },
  {
    id: 'viewing',
    category: 'services',
    title: 'Viewings & test drives',
    copy: 'Arrange a time to see a car or take a test drive.',
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
    copy: 'Ask about maintenance and repair options.',
    action: 'Ask about servicing',
  },
  {
    id: 'financing',
    category: 'financing',
    title: 'Financing',
    copy: 'Discuss payment options for your next car with the showroom.',
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
    copy: 'Ask about replacement parts and accessories for your vehicle.',
    action: 'Ask about parts',
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

// Removing an unavailable offering also removes its category tab.
export const serviceCategories = serviceCategoriesFor(showroomServices);

export function showroomService(id?: string) {
  return showroomServices.find((service) => service.id === id);
}

export function serviceCategoryHref(category: ServiceCategory) {
  return category === 'services' ? '/services' : '/services?tab=' + category;
}

export function serviceSearchHref(query: string) {
  const params = new URLSearchParams();
  if (query.trim()) params.set('q', query);
  return '/services' + (params.size ? '?' + params.toString() : '');
}

export function searchShowroomServices(services: readonly ShowroomService[], query: string) {
  const fold = (value: string) =>
    value
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLocaleLowerCase();
  const words = fold(query).trim().split(/\s+/).filter(Boolean);
  return services.filter((service) => {
    const text = fold([service.title, service.copy, ...(service.keywords || [])].join(' '));
    return words.every((word) => text.includes(word));
  });
}
