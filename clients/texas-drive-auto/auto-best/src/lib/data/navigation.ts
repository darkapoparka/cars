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
  { id: 'home', label: 'Home', href: '/' },
  {
    id: 'vehicles',
    label: 'Vehicles',
    href: '/listing-grid',
    menu: {
      title: 'Vehicles',
      description: 'Browse inventory by condition, body style or make.',
      features: [
        { id: 'vehicles-suv', title: 'SUV', detail: 'Space and comfort', image: '/assets/images/section/car-slide1.png', href: '/listing-grid?body=SUV' },
        { id: 'vehicles-crossover', title: 'Wagon', detail: 'Room for everyday life', image: '/assets/images/section/car-slide2.png', href: '/listing-grid?body=Wagon' },
        { id: 'vehicles-premium-suv', title: 'Premium SUV', detail: 'Premium trim', image: '/assets/images/section/car-slide3.png', href: '/listing-grid?body=SUV' }
      ],
      groups: [
        {
          id: 'vehicles-browse',
          title: 'Explore',
          links: [
            { id: 'vehicles-all', label: 'All vehicles', href: '/listing-grid' },
            { id: 'vehicles-new', label: 'Latest listings', href: '/listing-grid?sort=newest' },
            { id: 'vehicles-used', label: 'Used', href: '/listing-grid?condition=used' }
          ]
        },
        {
          id: 'vehicles-body',
          title: 'By body style',
          links: [
            { id: 'vehicles-body-suv', label: 'SUV', href: '/listing-grid?body=SUV' },
            { id: 'vehicles-body-sedan', label: 'Wagon', href: '/listing-grid?body=Wagon' },
            { id: 'vehicles-body-coupe', label: 'Body style', href: '/listing-grid?body=Coupe' }
          ]
        }
      ],
      cta: { id: 'vehicles-cta', label: 'View all vehicles', href: '/listing-grid', detail: 'Filter by type, fuel and condition.' }
    }
  },
  {
    id: 'about',
    label: 'About us',
    href: '/about-us',
    menu: {
      title: brand.name,
      description: 'Learn about the dealership, the buying process and payment options. No dealer financing or payment plans are offered.',
      features: [
        { id: 'about-showroom', title: 'Showroom and selection', detail: `Selected vehicles in ${brand.city}.`, image: '/office.webp', href: '/about-us' },
        { id: 'about-import', title: 'Import questions', detail: 'Import services are not verified in this preview.', image: '/stock/127361925-1.webp', href: '/contact?topic=import' },
        { id: 'about-leasing', title: 'Buyer-arranged funding', detail: 'No dealer financing or payment plans.', image: '/stock/127361904-1.webp', href: '/contact?topic=leasing' }
      ],
      groups: [
        {
          id: 'about-company',
          title: 'Company',
          links: [
            { id: 'about-company-overview', label: `About ${brand.shortName}`, href: '/about-us' },
            { id: 'about-company-process', label: 'How it works', href: '/about-us#process' },
            { id: 'about-company-contact', label: 'Contact', href: '/contact' }
          ]
        },
        {
          id: 'about-contact',
          title: 'Contact us',
          links: [
            { id: 'about-contact-inspection', label: 'Request a viewing', href: '/contact?topic=inspection' },
            { id: 'about-contact-address', label: 'Address and visits', href: '/contact' },
            { id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }
          ]
        }
      ],
      cta: { id: 'about-cta', label: 'Contact the team', href: '/contact', detail: 'Ask about availability and viewing. Import services are unconfirmed; no dealer financing or payment plans.' }
    }
  },
  {
    id: 'guides',
    label: 'Resources',
    href: '/blog',
    menu: {
      title: 'Resources',
      description: 'Practical information on choosing and inspecting a vehicle and arranging your own funding.',
      features: [
        { id: 'guides-inspection', title: 'Pre-purchase inspection', detail: 'History, documents, and condition.', image: '/assets/images/lead/day-night-guide-inspection.webp', href: '/blog-detail/1' },
        { id: 'guides-import', title: 'Imports and documents', detail: 'Key steps before registration.', image: '/assets/images/lead/day-night-guide-import.webp', href: '/blog-detail/2' },
        { id: 'guides-leasing', title: 'Payment and outside funding', detail: 'What to clarify when arranging your own funding. No dealer financing or payment plans.', image: '/assets/images/lead/day-night-guide-leasing.webp', href: '/blog-detail/3' }
      ],
      groups: [
        {
          id: 'guides-library',
          title: 'Guides',
          links: [
            { id: 'guides-all', label: 'All articles', href: '/blog' },
            { id: 'guides-choice', label: 'Choosing a vehicle', href: '/blog?q=selection' },
            { id: 'guides-finance', label: 'Payment and outside funding', href: '/blog?category=Funding' }
          ]
        },
        {
          id: 'guides-help',
          title: 'Help',
          links: [
            { id: 'guides-import-help', label: 'Import questions', href: '/blog?category=Imports' },
            { id: 'guides-contact', label: 'Contact', href: '/contact' },
            { id: 'guides-ask', label: 'Ask the team', href: '/contact' }
          ]
        }
      ],
      cta: { id: 'guides-cta', label: 'View all articles', href: '/blog', detail: 'Guidance on choosing and buying a vehicle, buyer-arranged funding, and import questions.' }
    }
  },
  { id: 'contact', label: 'Contact', href: '/contact' }
];
