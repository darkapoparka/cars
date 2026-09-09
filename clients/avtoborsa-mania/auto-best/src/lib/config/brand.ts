import dealer from '$data/dealer-stock.json';
export type BrandConfig = { name: string; shortName: string; city: string; addressLine: string; address: string; phone: string; phoneHref: `tel:${string}`; appointment: string; logo: `/${string}`; youtubeUrl: string; instagramUrl: string; facebookUrl: string; marketplaceUrl: string; hours: string; };
const socials = dealer.socialLinks as Partial<Record<'youtube' | 'instagram' | 'facebook', string>>;
export const brand: BrandConfig = {
  name: dealer.name, shortName: dealer.shortName, city: dealer.city,
  addressLine: dealer.address, address: `${dealer.address}, ${dealer.city}`,
  phone: dealer.phone, phoneHref: `tel:${dealer.phoneE164}`,
  appointment: 'Потвърдете огледа по телефона', hours: dealer.hours,
  logo: '/dealer/logo-pending.svg', marketplaceUrl: dealer.profile,
  youtubeUrl: socials.youtube ?? '', instagramUrl: socials.instagram ?? '', facebookUrl: socials.facebook ?? ''
};
