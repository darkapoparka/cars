import { brand } from '$config/brand';
import type { Vehicle } from '$data/vehicle-artwork';
import { editorialArtwork, featureArtwork, type FeatureArtwork } from '$data/feature-artwork';

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
  tone?: 'red' | 'ink';
  media?: 'photo';
  href: InternalNavigationHref;
} & ({ vehicle: Vehicle; artwork?: never } | { artwork: FeatureArtwork; vehicle?: never });

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
      description: 'Browse available stock by condition, body type or make.',
      features: [
        { id: 'vehicles-suv', vehicle: 'gclass', title: 'SUV', detail: 'Space and comfort', href: '/listing-grid?body=SUV' },
        { id: 'vehicles-wagon', vehicle: 'graphite', title: 'Estate', detail: 'Room for everyday life', href: '/listing-grid?body=Wagon' },
        { id: 'vehicles-coupe', vehicle: 'porsche', title: 'Coupe', detail: 'Sporting character', href: '/listing-grid?body=Coupe' }
      ],
      groups: [
        {
          id: 'vehicles-browse',
          title: 'Browse',
          links: [
            { id: 'vehicles-all', label: 'All vehicles', href: '/listing-grid' },
            { id: 'vehicles-new', label: 'Latest listings', href: '/listing-grid?sort=newest' },
            { id: 'vehicles-used', label: 'Used', href: '/listing-grid?condition=used' }
          ]
        },
        {
          id: 'vehicles-body',
          title: 'By body type',
          links: [
            { id: 'vehicles-body-suv', label: 'SUV', href: '/listing-grid?body=SUV' },
            { id: 'vehicles-body-sedan', label: 'Estate', href: '/listing-grid?body=Wagon' },
            { id: 'vehicles-body-coupe', label: 'Coupe', href: '/listing-grid?body=Coupe' }
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
      description: 'Learn more about the team, how we work and buying options.',
      features: [
        { id: 'about-showroom', tone: 'ink', artwork: featureArtwork.showroom, title: 'Showroom and selection', detail: `Selected vehicles in ${brand.city}.`, href: '/about-us' },
        { id: 'about-import', artwork: featureArtwork.import, tone: 'red', title: 'Vehicle enquiry', detail: 'Discuss the specific vehicle and your requirements.', href: '/contact?topic=import' },
        { id: 'about-leasing', tone: 'ink', artwork: featureArtwork.finance, title: 'Buying options', detail: 'Discuss the terms directly with the team.', href: '/contact?topic=leasing' }
      ],
      groups: [
        {
          id: 'about-company',
          title: 'Company',
          links: [
            { id: 'about-company-overview', label: `About ${brand.shortName}`, href: '/about-us' },
            { id: 'about-company-process', label: 'How we work', href: '/about-us#process' },
            { id: 'about-company-contact', label: 'Contact', href: '/contact' }
          ]
        },
        {
          id: 'about-contact',
          title: 'Get in touch',
          links: [
            { id: 'about-contact-inspection', label: 'Book a vehicle viewing', href: '/contact?topic=inspection' },
            { id: 'about-contact-address', label: 'Address and visits', href: '/contact' },
            { id: 'about-contact-phone', label: brand.phone, href: brand.phoneHref }
          ]
        }
      ],
      cta: { id: 'about-cta', label: 'Contact the team', href: '/contact', detail: 'Availability, vehicle viewing, vehicle enquiry and buying options.' }
    }
  },
  {
    id: 'guides',
    label: 'Advice',
    href: '/blog',
    menu: {
      title: 'Articles and advice',
      description: 'Practical information on choosing, checking and financing a vehicle.',
      features: [
        { id: 'guides-inspection', media: 'photo', artwork: editorialArtwork.inspection, title: 'What should you check before buying?', detail: 'History, documents and condition.', href: '/blog-detail/1' },
        { id: 'guides-import', media: 'photo', artwork: editorialArtwork.import, tone: 'red', title: 'Which vehicle documents should you check?', detail: 'The main steps before registration.', href: '/blog-detail/2' },
        { id: 'guides-leasing', media: 'photo', tone: 'ink', artwork: editorialArtwork.finance, title: 'How do you compare buying options?', detail: 'What to clarify before financing.', href: '/blog-detail/3' }
      ],
      groups: [
        {
          id: 'guides-library',
          title: 'Articles',
          links: [
            { id: 'guides-all', label: 'All articles', href: '/blog' },
            { id: 'guides-choice', label: 'Choosing a vehicle', href: '/blog?q=choosing' },
            { id: 'guides-finance', label: 'Buying options and terms', href: '/blog?category=Buying' }
          ]
        },
        {
          id: 'guides-help',
          title: 'Help',
          links: [
            { id: 'guides-import-help', label: 'Vehicle documents', href: '/blog?category=Documents' },
            { id: 'guides-contact', label: 'Contact', href: '/contact' },
            { id: 'guides-ask', label: 'Ask the team', href: '/contact' }
          ]
        }
      ],
      cta: { id: 'guides-cta', label: 'View all articles', href: '/blog', detail: 'Guidance on choosing, purchasing, buying options and importing.' }
    }
  },
  { id: 'contact', label: 'Contact', href: '/contact' }
];
