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
  name: dealer.name,
  locationLabel: 'Visit showroom',
  locationHref: '/stores',
  locationImage: '/showroom/studio-car-v2.png',
  highlights: [
    {title: 'Explore our cars.', mobileTitle: 'Choose a car.', copy: 'Compare the cars. Find your favourite.', mobileCopy: 'Compare our cars. Find your favourite.', action: 'Browse cars', mobileAction: 'View cars', href: '/cars', image: artwork.highlights.collection},
    {title: 'Make it yours.', mobileTitle: 'Car finance.', copy: 'Explore finance with our team.', mobileCopy: 'Choose deposit and term. Explore monthly payments.', action: 'Explore finance', mobileAction: 'Ask us', href: '/finance', image: artwork.highlights.finance},
    {title: 'Time for a change?', mobileTitle: 'Sell your car.', copy: 'Sell or part-exchange your car.', mobileCopy: 'Sell or part-exchange. Share your car details.', action: 'Value your car', mobileAction: 'Valuation', href: '/sell', image: artwork.highlights.exchange},
    {title: 'See it in person.', mobileTitle: 'See it in person.', copy: 'Find your favourite. Visit us.', mobileCopy: 'See the cars in person. Plan your showroom visit.', action: 'Plan your visit', mobileAction: 'Visit us', href: '/stores', image: artwork.highlights.visit},
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
    {key: 'buy', label: 'Buy', href: '/', image: '/cutouts/buy-sedan-v1.png', mobileImage: '/cutouts/buy-sedan-v1.png'},
    {key: 'sell', label: 'Sell', href: '/sell', image: '/cutouts/sedan.png', mobileImage: '/showroom/navigation/sell-v2.webp'},
    {key: 'finance', label: 'Finance', href: '/finance', image: '/showroom/navigation/finance-v4.webp', mobileImage: '/showroom/navigation/finance-v5.webp'},
    {key: 'service', label: 'Services', href: '/service', image: '/showroom/navigation/service-v3.webp', mobileImage: '/showroom/navigation/service-v4.webp'},
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
    {href: '/saved', label: 'Saved', icon: 'saved'},
    {href: '/more', label: 'More', icon: 'more'},
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
      {href: '/stores', label: 'Visit showroom', icon: 'location'},
    ]},
  ] as readonly MenuGroup[],
} as const;
