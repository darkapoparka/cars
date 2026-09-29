/** Dealer-facing home content. Keep claims and destinations specific to the client.
 * This is the first configuration boundary; inventory and legacy journeys are still fixtures.
 */
import {dealer} from './dealer-config';
import {bannerArtwork, type BannerTheme} from './showroom-art';
import type {ShowroomIconName} from '@/components/ShowroomIcon';

type MenuItem = {href: string; label: string; icon: ShowroomIconName; location?: boolean; primary?: boolean};
type MenuGroup = {label: string; items: readonly MenuItem[]};

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
    {title: 'Find your next car.', copy: 'Explore our showroom collection.', action: 'Browse cars', href: '/cars', image: artwork.highlights.collection},
    {title: 'Make it yours.', copy: 'Explore finance with our team.', action: 'Explore finance', href: '/finance', image: artwork.highlights.finance},
    {title: 'Time for a change?', copy: 'Sell or part-exchange your car.', action: 'Value your car', href: '/sell', image: artwork.highlights.exchange},
    {title: 'See it in person.', copy: 'Find your favourite. Visit us.', action: 'Plan your visit', href: '/stores', image: artwork.highlights.visit},
  ],
  searchPlaceholder: 'Find your next car',
  mobileSearchPlaceholder: 'Make or model',
  promotion: {
    title: 'Find your next car.',
    description: 'Browse online. See it in person.',
    mobileDescription: 'Browse cars in person.',
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
    {key: 'buy', label: 'Buy', href: '/', image: '/cutouts/buy-sedan-v1.png'},
    {key: 'sell', label: 'Sell', href: '/sell', image: '/cutouts/sedan.png'},
    {key: 'finance', label: 'Finance', href: '/finance', image: '/showroom/finance-v2.png'},
    {key: 'service', label: 'Services', href: '/service', image: '/showroom/service-v2.png'},
  ],
  navigation: [
    {href: '/', label: 'Home', icon: 'home'},
    {href: '/cars', label: 'Cars', icon: 'cars'},
    {href: '/saved', label: 'Saved', icon: 'saved'},
    {href: '/more', label: 'More', icon: 'more'},
  ],
  menu: [
    {label: 'Your showroom', items: [
      {href: '/cars', label: 'Browse cars', icon: 'cars', primary: true},
      {href: '/stores', label: 'Visit showroom', icon: 'location', location: true},
    ]},
    {label: 'More', items: [
      {href: '/saved', label: 'Saved cars', icon: 'saved'},
      {href: '/sell', label: 'Sell or part-exchange', icon: 'sell'},
      {href: '/finance', label: 'Payment options', icon: 'finance'},
      {href: '/service', label: 'Vehicle services', icon: 'service'},
    ]},
  ] as readonly MenuGroup[],
} as const;
