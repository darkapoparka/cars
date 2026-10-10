/** Dealer-facing home content. Keep claims and destinations specific to the client.
 * This is the first configuration boundary; inventory and legacy journeys are still fixtures.
 */
import {dealer} from './dealer-config';
import {bannerArtwork, type BannerTheme} from './showroom-art';
import type {ShowroomIconName} from '@/components/ShowroomIcon';

type MenuItem = {href: string; label: string; icon: ShowroomIconName; location?: boolean; primary?: boolean};
type MenuGroup = {label: string; items: readonly MenuItem[]; contacts?: boolean};

// Change this setting per dealer; artwork and campaign colors switch together.
const branding: {bannerTheme: BannerTheme} = {bannerTheme: 'black'};
const artwork = bannerArtwork[branding.bannerTheme];

export const showroom = {
  bannerTheme: branding.bannerTheme,
  artwork,
  desktopHeroArtwork: '/showroom/desktop/graphite-coupe-v1.webp',
  name: dealer.name,
  locationLabel: 'Visit showroom',
  locationHref: '/stores',
  locationImage: '/showroom/studio-car-v2.png',
  highlights: [
    {title: 'Choose a car.', copy: 'Compare our cars.', action: 'View cars', href: '/cars', image: artwork.highlights.collection},
    {title: 'Car finance.', copy: 'Deposit and term.', action: 'Explore finance', href: '/finance', image: artwork.highlights.finance},
    {title: 'Sell your car.', copy: 'Sell or part-exchange.', action: 'Valuation', href: '/sell', image: artwork.highlights.exchange},
    {title: 'See it in person', copy: 'Visit the showroom.', action: 'Visit us', href: '/stores', image: artwork.highlights.visit},
  ],
  searchPlaceholder: 'Search make or model',
  mobileSearchPlaceholder: 'Make or model',
  promotion: {
    title: 'Find your next car.',
    mobileTitle: 'Your next car.',
    description: 'Browse online. See it in person.',
    mobileDescription: 'Explore the cars. See them in person.',
    action: 'Explore cars',
    mobileAction: 'View cars',
    href: '/cars',
    image: artwork.heroes.buy,
  },
  inventoryPromotion: {
    title: 'See it up close.',
    description: 'Take a closer look at your next car.',
    mobileDescription: 'See the car in person.',
    action: 'Plan your visit',
    mobileAction: 'Visit showroom',
  },
  services: [
    {key: 'buy', label: 'Buy', href: '/', image: '/cutouts/buy-sedan-v1.png', mobileImage: '/cutouts/buy-sedan-v1.png', mobileTabImage: '/showroom/navigation/buy-front-v1.png'},
    {key: 'sell', label: 'Sell', href: '/sell', image: '/cutouts/sedan.png', mobileImage: '/showroom/navigation/sell-v2.webp', mobileTabImage: '/showroom/navigation/sell-v2.webp'},
    {key: 'finance', label: 'Finance', href: '/finance', image: '/showroom/navigation/finance-v4.webp', mobileImage: '/showroom/navigation/finance-v5.webp', mobileTabImage: '/showroom/navigation/finance-front-v1.png'},
    {key: 'service', label: 'Services', href: '/service', image: '/showroom/navigation/service-v3.webp', mobileImage: '/showroom/navigation/service-v4.webp', mobileTabImage: '/showroom/navigation/service-side-v1.png'},
  ],
  // Countries used by the import listing filters and enquiry form.
  importCountries: [
    {code: 'DE', name: 'Germany', flagSrc: '/flags/de.svg'},
    {code: 'CA', name: 'Canada', flagSrc: '/flags/ca.svg'},
    {code: 'US', name: 'USA', flagSrc: '/flags/us.svg'},
    {code: 'IT', name: 'Italy', flagSrc: '/flags/it.svg'},
    {code: 'NL', name: 'Netherlands', flagSrc: '/flags/nl.svg'},
  ],
  navigation: [
    {href: '/', label: 'Home', icon: 'home'},
    {href: '/cars', label: 'Cars', icon: 'cars'},
    {href: '/service', label: 'Services', icon: 'service'},
    {href: '/more', label: 'Menu', icon: 'more'},
  ],
  menu: [
    {label: 'Cars', items: [
      {href: '/cars', label: 'View cars', icon: 'cars', primary: true},
      {href: '/saved', label: 'Saved cars', icon: 'saved'},
    ]},
    {label: 'Services', items: [
      {href: '/sell', label: 'Sell or part-exchange', icon: 'sell'},
      {href: '/finance', label: 'Finance navigation', icon: 'finance'},
      {href: '/service', label: 'Vehicle services', icon: 'service'},
    ]},
    {label: 'Your showroom', contacts: true, items: [
      {href: '/stores', label: 'About us', icon: 'location'},
    ]},
  ] as readonly MenuGroup[],
} as const;
