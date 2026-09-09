import { dealer } from '../data/dealer';

export type BrandConfig = {
  name:string; shortName:string; city:string; addressLine:string; address:string;
  phone:string; phoneHref:`tel:${string}`; appointment:string; logo:`/${string}`;
  youtubeUrl:string; instagramUrl:string; facebookUrl:string;
};

// Unknown social accounts are deliberately empty, not another business's accounts.
export const brand = {
  name:dealer.name, shortName:dealer.shortName, city:dealer.city,
  addressLine:dealer.addressLine, address:dealer.address,
  phone:dealer.phone, phoneHref:dealer.phoneHref, appointment:dealer.hours,
  logo:dealer.logo, youtubeUrl:'', instagramUrl:'', facebookUrl:''
} as const satisfies BrandConfig;
