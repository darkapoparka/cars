/** Dealer-facing home content. Keep claims and destinations specific to the client.
 * This is the first configuration boundary; inventory and legacy journeys are still fixtures.
 */
import {dealer} from './dealer-config';
import {bannerArtwork, type BannerTheme} from './showroom-art';

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
  promotion: {
    title: 'Find your next car.',
    description: 'Browse online. See it in person.',
    action: 'Explore cars',
    href: '/cars',
    image: artwork.heroes.buy,
  },
  services: [
    {key: 'buy', label: 'Buy', href: '/', image: '/cutouts/buy-sedan-v1.png'},
    {key: 'sell', label: 'Sell', href: '/sell', image: '/cutouts/sedan.png'},
    {key: 'finance', label: 'Finance', href: '/finance', image: '/showroom/finance-v2.png'},
    {key: 'service', label: 'Services', href: '/service', image: '/showroom/service-v2.png'},
  ],
  navigation: [
    {href: '/', label: 'Home'},
    {href: '/cars', label: 'Cars'},
    {href: '/saved', label: 'Saved'},
    {href: '/more', label: 'More'},
  ],
} as const;
