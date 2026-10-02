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
    {title: 'Explore our cars.', mobileTitle: 'Explore our cars.', copy: 'Compare the cars. Find your favourite.', mobileCopy: 'Compare the cars. Find your favourite.', action: 'Browse cars', mobileAction: 'View cars', href: '/cars', image: artwork.highlights.collection},
    {title: 'Make it yours.', mobileTitle: 'Make it yours.', copy: 'Explore finance with our team.', mobileCopy: 'Compare your options. Plan your purchase.', action: 'Explore finance', mobileAction: 'Payment options', href: '/finance', image: artwork.highlights.finance},
    {title: 'Time for a change?', mobileTitle: 'Time for a change?', copy: 'Sell or part-exchange your car.', mobileCopy: 'Value your car. Discuss a part-exchange.', action: 'Value your car', mobileAction: 'Value my car', href: '/sell', image: artwork.highlights.exchange},
    {title: 'See it in person.', mobileTitle: 'See it in person.', copy: 'Find your favourite. Visit us.', mobileCopy: 'Choose a time. Take a closer look.', action: 'Plan your visit', mobileAction: 'Visit us', href: '/stores', image: artwork.highlights.visit},
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
    {key: 'buy', label: 'Buy', href: '/', image: '/cutouts/buy-sedan-v1.png'},
    {key: 'sell', label: 'Sell', href: '/sell', image: '/cutouts/sedan.png'},
    {key: 'finance', label: 'Finance', href: '/finance', image: '/showroom/navigation/finance-v4.webp'},
    {key: 'service', label: 'Services', href: '/service', image: '/showroom/navigation/service-v3.webp'},
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
