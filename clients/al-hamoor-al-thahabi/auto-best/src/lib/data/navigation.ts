import { brand } from '$config/brand';

export type NavigationHref =
  | '/'
  | '/about-us'
  | `/about-us#${string}`
  | `/blog-detail/${number}`
  | '/blog'
  | `/blog?${string}`
  | '/contact'
  | `/contact?${string}`
  | '/listing-grid'
  | `/listing-grid?${string}`
  | `tel:${string}`;

export type InternalNavigationHref = Exclude<NavigationHref, `tel:${string}`>;

export type NavigationLink = {
  id: string;
  label: string;
  href: NavigationHref;
};

export type NavigationGroup = {
  id: string;
  title: string;
  links: NavigationLink[];
};

export type NavigationFeature = {
  id: string;
  title: string;
  detail: string;
  image: string;
  href: InternalNavigationHref;
};

export type MegaMenu = {
  title: string;
  description: string;
  features: NavigationFeature[];
  groups: NavigationGroup[];
  cta: Omit<NavigationLink, 'href'> & { href: InternalNavigationHref; detail: string };
};

export type NavigationItem = Omit<NavigationLink, 'href'> & {
  href: InternalNavigationHref;
  menu?: MegaMenu;
};

export const navigation: NavigationItem[] = [
  {
    "id": "home",
    "label": "Home",
    "href": "/"
  },
  {
    "id": "vehicles",
    "label": "Cars",
    "href": "/listing-grid",
    "menu": {
      "title": "Explore the listings",
      "description": "Dated samples. Confirm current availability directly.",
      "features": [
        {
          "id": "vehicle-sedan",
          "title": "Sedans",
          "detail": "Compare the advertised details.",
          "image": "/dealer/inventory/965722-1.webp",
          "href": "/listing-grid?body=Sedan"
        },
        {
          "id": "vehicle-suv",
          "title": "SUVs",
          "detail": "Compare the advertised details.",
          "image": "/dealer/inventory/1005647-1.webp",
          "href": "/listing-grid?body=SUV"
        },
        {
          "id": "vehicle-all",
          "title": "All listing samples",
          "detail": "Eight source-backed examples.",
          "image": "/dealer/inventory/1010924-1.webp",
          "href": "/listing-grid"
        }
      ],
      "groups": [
        {
          "id": "browse",
          "title": "Browse",
          "links": [
            {
              "id": "all",
              "label": "All samples",
              "href": "/listing-grid"
            },
            {
              "id": "newest",
              "label": "Newest model year",
              "href": "/listing-grid?sort=newest"
            },
            {
              "id": "used",
              "label": "Used cars",
              "href": "/listing-grid?condition=used"
            }
          ]
        },
        {
          "id": "body",
          "title": "Body style",
          "links": [
            {
              "id": "sedan",
              "label": "Sedans",
              "href": "/listing-grid?body=Sedan"
            },
            {
              "id": "suv",
              "label": "SUVs",
              "href": "/listing-grid?body=SUV"
            },
            {
              "id": "low-mileage",
              "label": "Lowest mileage",
              "href": "/listing-grid?sort=mileage-asc"
            }
          ]
        }
      ],
      "cta": {
        "id": "stock-cta",
        "label": "Browse the cars",
        "href": "/listing-grid",
        "detail": "Filter by model, specification and advertised price."
      }
    }
  },
  {
    "id": "about",
    "label": "Dealership",
    "href": "/about-us",
    "menu": {
      "title": "Al Hamoor Al Thahabi Used Cars",
      "description": "Published showroom details and direct contact.",
      "features": [
        {
          "id": "showroom",
          "title": "Sharjah showroom",
          "detail": "Souk Al Haraj, showroom 353, Sharjah",
          "image": "/dealer/showroom.webp",
          "href": "/about-us"
        },
        {
          "id": "viewing",
          "title": "Arrange a viewing",
          "detail": "Confirm the car and location first.",
          "image": "/dealer/inventory/965722-1.webp",
          "href": "/contact?topic=inspection"
        },
        {
          "id": "purchase",
          "title": "Purchase questions",
          "detail": "Ask about current price and terms.",
          "image": "/dealer/inventory/1018774-1.webp",
          "href": "/contact?topic=leasing"
        }
      ],
      "groups": [
        {
          "id": "company",
          "title": "Dealership",
          "links": [
            {
              "id": "about",
              "label": "About the dealership",
              "href": "/about-us"
            },
            {
              "id": "process",
              "label": "Your next steps",
              "href": "/about-us#process"
            },
            {
              "id": "contact",
              "label": "Contact details",
              "href": "/contact"
            }
          ]
        },
        {
          "id": "talk",
          "title": "Before visiting",
          "links": [
            {
              "id": "arrange",
              "label": "Viewing enquiry",
              "href": "/contact?topic=inspection"
            },
            {
              "id": "address",
              "label": "Address and directions",
              "href": "/contact"
            },
            {
              "id": "phone",
              "label": "+971 54 555 5204",
              "href": "tel:+971545555204"
            }
          ]
        }
      ],
      "cta": {
        "id": "contact-cta",
        "label": "Contact details",
        "href": "/contact",
        "detail": "Availability and the actual viewing location need confirmation."
      }
    }
  },
  {
    "id": "guides",
    "label": "Guides",
    "href": "/blog",
    "menu": {
      "title": "Before you buy",
      "description": "Questions to prepare for a conversation about the actual car.",
      "features": [
        {
          "id": "guide-1",
          "title": "Plan your viewing",
          "detail": "Confirm the car and the viewing location before travelling.",
          "image": "/dealer/showroom.webp",
          "href": "/blog-detail/1"
        },
        {
          "id": "guide-2",
          "title": "Understand the advertised specification",
          "detail": "Check the regional specification and the documents for the actual car.",
          "image": "/dealer/inventory/965722-2.webp",
          "href": "/blog-detail/2"
        },
        {
          "id": "guide-3",
          "title": "Price and purchase questions",
          "detail": "Ask what is included in the current advertised price.",
          "image": "/dealer/inventory/965722-3.webp",
          "href": "/blog-detail/3"
        }
      ],
      "groups": [
        {
          "id": "read",
          "title": "Read the guides",
          "links": [
            {
              "id": "all",
              "label": "All guides",
              "href": "/blog"
            },
            {
              "id": "viewing",
              "label": "Viewing",
              "href": "/blog?category=Viewing"
            },
            {
              "id": "buying",
              "label": "Purchase questions",
              "href": "/blog?category=Buying"
            }
          ]
        },
        {
          "id": "help",
          "title": "Prepare",
          "links": [
            {
              "id": "docs",
              "label": "Vehicle documents",
              "href": "/blog?category=Documents"
            },
            {
              "id": "contact",
              "label": "Contact details",
              "href": "/contact"
            },
            {
              "id": "questions",
              "label": "Prepare a question",
              "href": "/contact?topic=general"
            }
          ]
        }
      ],
      "cta": {
        "id": "guides-cta",
        "label": "Read the guides",
        "href": "/blog",
        "detail": "Independent preview information, not a dealer guarantee."
      }
    }
  },
  {
    "id": "contact",
    "label": "Contact",
    "href": "/contact"
  }
];
