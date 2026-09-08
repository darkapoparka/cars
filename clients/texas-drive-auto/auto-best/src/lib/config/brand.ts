export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: string;
  youtubeUrl: string; instagramUrl: string; facebookUrl: string;
  website: string; currency: 'USD'; mileageUnit: 'mi'; dealerFinance: boolean;
};

/** Public contact facts: texasdriveauto.com home/contact, retrieved 2026-09-09.
 * The published raster logo was visually cross-matched to the dealer sign.
 * Its local export/integration is still pending; this remote reference is NOT a completed asset pack.
 */
export const brand = {
  name: 'Texas Drive Auto',
  shortName: 'Texas Drive Auto',
  city: 'Dallas, TX',
  addressLine: '10511 Olympic Drive',
  address: '10511 Olympic Drive, Dallas, TX 75220',
  phone: '(214) 972-3233',
  phoneHref: 'tel:+12149723233',
  appointment: 'Monday–Saturday 10:00 AM–6:00 PM; Sunday closed. Call before travelling.',
  website: 'https://www.texasdriveauto.com/',
  logo: '/brand/logo-on-light.png',
  youtubeUrl: '',
  instagramUrl: '',
  facebookUrl: '',
  currency: 'USD',
  mileageUnit: 'mi',
  dealerFinance: false
} as const satisfies BrandConfig;
