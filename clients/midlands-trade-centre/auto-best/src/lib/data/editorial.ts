export type BlogCategory='Viewing'|'Documents'|'Buying'|'Guides'|'Trade-in';
export type BlogPost={id:number;title:string;text:string;category:BlogCategory;tag:string;image:string;sections:Array<{title:string;paragraphs:string[]}>};
export type BlogFilters={q:string;category:BlogCategory|''};
export const blogPosts:BlogPost[]=[
  {
    "id": 1,
    "title": "Before your viewing",
    "text": "Prepare a short list of the condition, history and equipment details you need to confirm.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/inventory/202601169196000-1.webp",
    "sections": [
      {
        "title": "Before your viewing",
        "paragraphs": [
          "Prepare a short list of the condition, history and equipment details you need to confirm."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "Ask for the selected vehicle by its listing reference. Photographs and descriptions do not replace an inspection."
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "Documents and vehicle details",
    "text": "Check the vehicle identity and the documents available for the specific car.",
    "category": "Documents",
    "tag": "Documents",
    "image": "/dealer/inventory/202607073982268-1.webp",
    "sections": [
      {
        "title": "Documents and vehicle details",
        "paragraphs": [
          "Check the vehicle identity and the documents available for the specific car."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "Ask which service records and ownership documents can be inspected. Resolve conflicting information before a decision."
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "Advertised price and total cost",
    "text": "Ask for the agreed total price and what is included before committing to the vehicle.",
    "category": "Buying",
    "tag": "Buying",
    "image": "/dealer/inventory/202607254508952-1.webp",
    "sections": [
      {
        "title": "Advertised price and total cost",
        "paragraphs": [
          "Ask for the agreed total price and what is included before committing to the vehicle."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "This preview is not a finance offer or approval. Any purchase or finance terms must come from the dealership and relevant provider."
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "Choosing a suitable vehicle",
    "text": "Consider everyday journeys, passengers, luggage and a realistic budget.",
    "category": "Guides",
    "tag": "Guides",
    "image": "/dealer/inventory/202609075805069-1.webp",
    "sections": [
      {
        "title": "Choosing a suitable vehicle",
        "paragraphs": [
          "Consider everyday journeys, passengers, luggage and a realistic budget."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "Compare the actual specifications of the selected vehicles rather than assuming every trim has the same equipment."
        ]
      }
    ]
  },
  {
    "id": 5,
    "title": "Visiting Birmingham",
    "text": "All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/inventory/202608275484997-1.webp",
    "sections": [
      {
        "title": "Visiting Birmingham",
        "paragraphs": [
          "All viewings are by prior appointment. Call or text to confirm the selected vehicle and the time of arrival before travelling."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "1198 Coventry Road, Yardley, Birmingham, B25 8DA. Monday–Friday 09:00–19:00; Saturday 10:00–18:00; Sunday by appointment. All viewings require a prior appointment."
        ]
      }
    ]
  },
  {
    "id": 6,
    "title": "Preparing a trade-in enquiry",
    "text": "Make a clear note of your current vehicle, mileage, condition and service history.",
    "category": "Trade-in",
    "tag": "Trade-in",
    "image": "/dealer/inventory/202609055756720-1.webp",
    "sections": [
      {
        "title": "Preparing a trade-in enquiry",
        "paragraphs": [
          "Make a clear note of your current vehicle, mileage, condition and service history."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "The enquiry tools create a local draft only. They do not send information or provide a valuation."
        ]
      }
    ]
  },
  {
    "id": 7,
    "title": "Reading the photo gallery",
    "text": "The photographs belong to the dated source listing shown beside each sample.",
    "category": "Guides",
    "tag": "Guides",
    "image": "/dealer/inventory/202608255427907-1.webp",
    "sections": [
      {
        "title": "Reading the photo gallery",
        "paragraphs": [
          "The photographs belong to the dated source listing shown beside each sample."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "A small gallery is not a full condition report. Request additional views and an inspection before relying on its appearance."
        ]
      }
    ]
  },
  {
    "id": 8,
    "title": "Questions before travelling",
    "text": "Confirm whether the vehicle is still advertised, its location and the time for a visit.",
    "category": "Viewing",
    "tag": "Viewing",
    "image": "/dealer/inventory/202604141546870-1.webp",
    "sections": [
      {
        "title": "Questions before travelling",
        "paragraphs": [
          "Confirm whether the vehicle is still advertised, its location and the time for a visit."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "Ask about known condition, important equipment and any price conditions for that exact vehicle."
        ]
      }
    ]
  },
  {
    "id": 9,
    "title": "Keeping your vehicle records",
    "text": "Keep the documents supplied during a purchase and record future maintenance.",
    "category": "Documents",
    "tag": "Documents",
    "image": "/dealer/inventory/202601169196000-1.webp",
    "sections": [
      {
        "title": "Keeping your vehicle records",
        "paragraphs": [
          "Keep the documents supplied during a purchase and record future maintenance."
        ]
      },
      {
        "title": "Points to confirm",
        "paragraphs": [
          "Check any registration or other formal requirements through the appropriate current official guidance. This preview does not provide legal advice."
        ]
      }
    ]
  }
];
export const blogCategories: BlogCategory[] = ['Viewing','Documents','Buying','Guides','Trade-in'];

const isBlogCategory = (value: string | null): value is BlogCategory =>
  Boolean(value && blogCategories.includes(value as BlogCategory));

export const parseBlogFilters = (params: URLSearchParams): BlogFilters => ({
  q: params.get('q')?.trim() ?? '',
  category: isBlogCategory(params.get('category')) ? params.get('category') as BlogCategory : ''
});

const normalize = (value: string) => value.trim().toLocaleLowerCase('en-GB');

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
