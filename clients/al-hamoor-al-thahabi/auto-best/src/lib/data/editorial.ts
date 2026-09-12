import { brand } from '$config/brand';

export type BlogCategory = 'Viewing' | 'Documents' | 'Buying' | 'Guides' | 'Trade-in';

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
    "id": 1,
    "title": "Plan your viewing",
    "text": "Confirm the car and the viewing location before travelling.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/showroom.webp",
    "sections": [
      {
        "title": "Start with the selected listing",
        "paragraphs": [
          "Keep the listing reference and the details that matter to you. Ask the dealership to confirm that the car can still be viewed."
        ]
      },
      {
        "title": "Confirm the address",
        "paragraphs": [
          "The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted."
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "Understand the advertised specification",
    "text": "Check the regional specification and the documents for the actual car.",
    "category": "Documents",
    "tag": "Documents",
    "image": "/dealer/inventory/965722-2.webp",
    "sections": [
      {
        "title": "Read the listing carefully",
        "paragraphs": [
          "The sample records include the regional specification stated in the advertisement. It is not a guarantee of condition, service history or registration eligibility."
        ]
      },
      {
        "title": "Ask vehicle-specific questions",
        "paragraphs": [
          "Discuss the available documents, recorded mileage, service information and any known damage. Do not assume that a model-level feature list proves the equipment on a particular car."
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "Price and purchase questions",
    "text": "Ask what is included in the current advertised price.",
    "category": "Buying",
    "tag": "Buying",
    "image": "/dealer/inventory/965722-3.webp",
    "sections": [
      {
        "title": "Request current written terms",
        "paragraphs": [
          "Prices in this preview are dated listing samples, not a binding offer or a finance quotation. Confirm the amount and any additional charges directly."
        ]
      },
      {
        "title": "Separate price from finance",
        "paragraphs": [
          "A monthly figure or down payment is not the full purchase price. This preview does not provide a dealer finance product, interest rate or approval."
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Choose a car for everyday use",
    "text": "Compare the body style, mileage and features you actually need.",
    "category": "Guides",
    "tag": "Guides",
    "image": "/dealer/inventory/1005647-1.webp",
    "sections": [
      {
        "title": "Start with your use case",
        "paragraphs": [
          "Think about passenger space, luggage and the journeys you make. Use the filters to compare relevant samples instead of relying on a single photograph."
        ]
      },
      {
        "title": "Check the actual car",
        "paragraphs": [
          "A listing is a starting point. Inspect the vehicle and confirm its condition and equipment before making a decision."
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "Visit the Sharjah showroom",
    "text": "The published dealer address is showroom 353, Souk Al Haraj, Sharjah.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/showroom.webp",
    "sections": [
      {
        "title": "Arrange a convenient time",
        "paragraphs": [
          "Opening hours are not verified in this preview. Contact the dealership to arrange a time and confirm the selected vehicle is at the location you intend to visit."
        ]
      },
      {
        "title": "Keep the listing reference",
        "paragraphs": [
          "The YallaMotor dealer profile publishes showroom 353 in Sharjah; DubiCars vehicle cards are labelled Dubai. Confirm the selected vehicle's viewing location before travelling. No exact coordinate is asserted."
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "Prepare a trade-in enquiry",
    "text": "Prepare details for a conversation, not an automatic valuation.",
    "category": "Trade-in",
    "tag": "Trade-in",
    "image": "/dealer/inventory/1010924-1.webp",
    "sections": [
      {
        "title": "Describe your current vehicle",
        "paragraphs": [
          "Make, model, year, mileage and condition help frame a conversation. Include known faults and the documents available."
        ]
      },
      {
        "title": "Confirm the next step",
        "paragraphs": [
          "The source profile advertises trade-in enquiries. This preview does not value a vehicle, accept an exchange or submit a request; confirm arrangements directly."
        ]
      }
    ]
  },
  {
    "id": 7,
    "title": "Questions about vehicle documents",
    "text": "Ask what documentation is available for the specific listing.",
    "category": "Documents",
    "tag": "Documents",
    "image": "/dealer/inventory/1018774-1.webp",
    "sections": [
      {
        "title": "Match the vehicle to its records",
        "paragraphs": [
          "Compare the advertised vehicle identity with the records shown at the viewing. Ask the dealership to explain missing or conflicting information."
        ]
      },
      {
        "title": "Use current official guidance",
        "paragraphs": [
          "Registration or import requirements depend on the vehicle and destination. Consult the relevant authority for current requirements; this preview does not provide legal or registration advice."
        ]
      }
    ]
  },
  {
    "id": 8,
    "title": "Use the photo gallery",
    "text": "Compare the original listing photographs before arranging a visit.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/inventory/965722-1.webp",
    "sections": [
      {
        "title": "Look beyond the first image",
        "paragraphs": [
          "Open the gallery and inspect the views supplied with the advertisement. Photographs can help you prepare questions but do not replace inspection."
        ]
      },
      {
        "title": "Treat image quality honestly",
        "paragraphs": [
          "These are recovered source photographs. Some originals are thumbnail-resolution; this preview does not invent detail through upscaling or generated vehicle images."
        ]
      }
    ]
  },
  {
    "id": 9,
    "title": "What a dated sample means",
    "text": "This is a design preview, not a live stock feed.",
    "category": "Guides",
    "tag": "Guides",
    "image": "/dealer/inventory/916417-1.webp",
    "sections": [
      {
        "title": "Check the observation date",
        "paragraphs": [
          "The cars, prices and specifications were recorded from the linked advertisements on 9 September 2026. They can change or become unavailable."
        ]
      },
      {
        "title": "Confirm before committing",
        "paragraphs": [
          "Ask the dealership for current availability, the actual viewing location, condition and purchase terms. No reservation, payment or enquiry delivery is made by this preview."
        ]
      }
    ]
  }
];
export const blogCategories: BlogCategory[] = ['Viewing', 'Documents', 'Buying', 'Guides', 'Trade-in'];

const isBlogCategory = (value: string | null): value is BlogCategory =>
  Boolean(value && blogCategories.includes(value as BlogCategory));

export const parseBlogFilters = (params: URLSearchParams): BlogFilters => ({
  q: params.get('q')?.trim() ?? '',
  category: isBlogCategory(params.get('category')) ? params.get('category') as BlogCategory : ''
});

const normalize = (value: string) => value.trim().toLocaleLowerCase('en-AE');

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
