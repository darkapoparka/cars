import dealerPack from '$data/dealer-pack.json';

const dealer = dealerPack.dealer;

export const brand = {
  ...dealer,
  phoneHref: "tel:+359884525249",
  logo: dealer.logo,
  logoLight: dealer.logoLight,
  logoDark: dealer.logoDark,
  youtubeUrl: null,
  instagramUrl: null,
  facebookUrl: null,
  hoursLabel: 'Пон–Пет 07:00–19:00 · Съб 07:00–17:00 · Неделя: почивен ден'
} as const;

export type BrandConfig = typeof brand;
