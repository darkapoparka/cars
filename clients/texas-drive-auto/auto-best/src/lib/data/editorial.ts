import { brand } from '$config/brand';

export type BlogCategory = 'Vehicle viewing' | 'Import questions' | 'Buyer-arranged funding' | 'Guidance' | 'Trade-in inquiry';

export type BlogPost = {
  id: number;
  title: string;
  text: string;
  category: BlogCategory;
  tag: string;
  image: string;
  sections: Array<{
    title: string;
    paragraphs: string[];
  }>;
};

export type BlogFilters = {
  q: string;
  category: BlogCategory | '';
};

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Pre-purchase inspection',
    text: 'Confirm vehicle history, documents and condition directly with the dealership.',
    category: 'Vehicle viewing',
    tag: 'Vehicle viewing',
    image: '/assets/images/blog/blog-1.jpg',
    sections: [
      {
        title: 'Start with the history and documents',
        paragraphs: [
          'Before your visit, ask for basic vehicle details and available service records. Compare vehicle identifiers in the documents with those on the vehicle, and note anything that needs clarification in person.'
        ]
      },
      {
        title: 'Inspect the vehicle step by step',
        paragraphs: [
          'Check the body, tires, interior and main systems, then take a test drive. If you are unsure about the vehicle’s condition, consult an independent mechanic before deciding to buy.'
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Imports and documents',
    text: 'Import services are not confirmed in this preview. Ask about availability, transportation and US registration requirements.',
    category: 'Import questions',
    tag: 'Documents',
    image: '/assets/images/blog/blog-2.jpg',
    sections: [
      {
        title: 'Set clear search criteria',
        paragraphs: [
          'Make and model are only the start. Specify the year, engine, features, acceptable mileage and total budget, including transportation and registration costs.'
        ]
      },
      {
        title: 'Ask for clear documentation at every step',
        paragraphs: [
          'Before committing, confirm the specific vehicle, its known condition, the documents included and any transportation arrangements. Verify final registration requirements against current official rules.'
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Payment and outside funding',
    text: 'Texas Drive Auto offers no dealer financing or payment plans. Any buyer-arranged funding is separate.',
    category: 'Buyer-arranged funding',
    tag: 'Buyer-arranged funding',
    image: '/assets/images/blog/blog-3.jpg',
    sections: [
      {
        title: 'Compare the full cost',
        paragraphs: [
          'If you arrange funding independently, compare the term, down payment, total amount due, fees, insurance requirements and ownership terms—not just the monthly payment.'
        ]
      },
      {
        title: 'Build a realistic budget',
        paragraphs: [
          'Allow for registration, maintenance and ongoing expenses. Ask for a written price breakdown for the specific vehicle before comparing options.'
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'How to choose a vehicle',
    text: 'Discuss your preferred make, body style and budget with the dealership.',
    category: 'Guidance',
    tag: 'Selection',
    image: '/assets/images/blog/blog-4.jpg',
    sections: [
      {
        title: 'Start with everyday use',
        paragraphs: [
          'Consider where you will drive, how many passengers and how much cargo you usually carry, and which features matter most. This helps narrow your list to suitable models.'
        ]
      },
      {
        title: 'Compare more than the purchase price',
        paragraphs: [
          'Fuel use, maintenance, tires, insurance and expected mileage all affect ownership costs. Choose the best fit for your needs, rather than simply the longest feature list.'
        ]
      }
    ]
  },
  {
    id: 5,
    title: `Viewing at ${brand.city}`,
    text: `Arrange a visit to ${brand.addressLine}.`,
    category: 'Vehicle viewing',
    tag: brand.city,
    image: '/assets/images/blog/blog-5.jpg',
    sections: [
      {
        title: 'Request a convenient time in advance',
        paragraphs: [
          'Contact the dealership to confirm visiting arrangements. Mention the vehicle you want to see and your main questions to make the visit useful.'
        ]
      },
      {
        title: 'Allow time for a thorough inspection',
        paragraphs: [
          'View the vehicle in daylight, try every seat, check practical details and write down your questions. Take time to clarify its condition and documents before deciding.'
        ]
      }
    ]
  },
  {
    id: 6,
    title: 'Trade-in and appraisal questions',
    text: 'Ask whether trade-ins are accepted and whether an individual appraisal is available.',
    category: 'Trade-in inquiry',
    tag: 'Trade-in inquiry',
    image: '/assets/images/blog/blog-6.jpg',
    sections: [
      {
        title: 'Prepare accurate vehicle details',
        paragraphs: [
          'Provide the model, year, mileage, features, service history and known issues. Photos help start the conversation but do not replace an in-person inspection.'
        ]
      },
      {
        title: 'Consider the appraisal as part of the whole deal',
        paragraphs: [
          'If a trade-in is accepted, its value depends on condition, documents and current market demand. Compare both the trade-in offer and the terms for the vehicle you want to buy.'
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'Registration after import',
    text: 'Import and registration assistance are not confirmed in this preview. Ask what support is available.',
    category: 'Import questions',
    tag: 'Documents',
    image: '/assets/images/blog/blog-7.jpg',
    sections: [
      {
        title: 'Organize the available documents',
        paragraphs: [
          'Gather documents showing the vehicle’s origin and purchase, along with any transportation paperwork. Check names, vehicle identifiers and dates for discrepancies before starting registration.'
        ]
      },
      {
        title: 'Check the current process',
        paragraphs: [
          'Requirements depend on the vehicle and its origin. Confirm current steps and required original documents with the relevant authorities or your chosen provider instead of relying on an outdated online checklist.'
        ]
      }
    ]
  },
  {
    id: 8,
    title: 'What to ask during an inspection',
    text: 'Confirm mileage, history, features and availability directly with the dealership.',
    category: 'Vehicle viewing',
    tag: 'Vehicle viewing',
    image: '/assets/images/blog/blog-8.jpg',
    sections: [
      {
        title: 'Ask about history and current condition',
        paragraphs: [
          'Ask which service records are available, whether there are known repairs or issues, and which maintenance items were recently replaced. Request specific answers about the vehicle.'
        ]
      },
      {
        title: 'Check features and upcoming costs',
        paragraphs: [
          'Test the features that matter to you and ask what the listed price includes. Account for registration, initial maintenance, tires and insurance.'
        ]
      }
    ]
  },
  {
    id: 9,
    title: 'After your purchase',
    text: 'Ask about documents, maintenance needs and next steps after the sale.',
    category: 'Guidance',
    tag: 'Maintenance',
    image: '/assets/images/blog/blog-9.jpg',
    sections: [
      {
        title: 'Keep your documents and track deadlines',
        paragraphs: [
          'Organize the purchase agreement, payment records, service information and everything provided with the vehicle. Check official sources for current registration and insurance deadlines.'
        ]
      },
      {
        title: 'Establish a maintenance baseline',
        paragraphs: [
          'Record the current mileage and plan an initial mechanical inspection based on available history. This gives future maintenance a clear starting point.'
        ]
      }
    ]
  }
];

export const blogCategories: BlogCategory[] = ['Vehicle viewing', 'Import questions', 'Buyer-arranged funding', 'Guidance', 'Trade-in inquiry'];

const isBlogCategory = (value: string | null): value is BlogCategory =>
  Boolean(value && blogCategories.includes(value as BlogCategory));

export const parseBlogFilters = (params: URLSearchParams): BlogFilters => ({
  q: params.get('q')?.trim() ?? '',
  category: isBlogCategory(params.get('category')) ? params.get('category') as BlogCategory : ''
});

const normalize = (value: string) => value.trim().toLocaleLowerCase('en-US');

export const filterBlogPosts = (posts: BlogPost[], filters: BlogFilters) => {
  const query = normalize(filters.q);
  return posts.filter((post) => {
    if (filters.category && post.category !== filters.category) return false;
    if (!query) return true;
    return normalize(`${post.title} ${post.text} ${post.category} ${post.tag}`).includes(query);
  });
};

export const blogFilterHref = (filters: BlogFilters, category: BlogCategory | '') => {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (category) params.set('category', category);
  const query = params.toString();
  return query ? `/blog?${query}` : '/blog';
};
