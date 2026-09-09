import { dealerProfile } from '$lib/data/dealer-profile';

export type BrandConfig = {
  name: string; shortName: string; city: string; addressLine: string; address: string;
  phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`;
  youtubeUrl: string; instagramUrl: string; facebookUrl: string;
};

export const brand = {
  name: dealerProfile.name,
  shortName: dealerProfile.shortName,
  city: dealerProfile.city,
  youtubeUrl: dealerProfile.socialLinks.youtube ?? '',
  instagramUrl: dealerProfile.socialLinks.instagram ?? '',
  facebookUrl: dealerProfile.socialLinks.facebook ?? '',
  phone: dealerProfile.phoneDisplay,
  phoneHref: dealerProfile.phoneHref,
  addressLine: dealerProfile.address,
  address: `${dealerProfile.address}, ${dealerProfile.city}`,
  appointment: dealerProfile.hoursLabel,
  logo: dealerProfile.logo,
} as const satisfies BrandConfig;
