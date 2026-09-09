import facts from '$data/dealer-facts.json';

export type BrandConfig = {
  name: string;
  shortName: string;
  city: string;
  addressLine: string;
  address: string;
  phone: string;
  phoneHref: `tel:${string}`;
  appointment: string;
  logo: `/${string}`;
  youtubeUrl: `https://${string}` | undefined;
  instagramUrl: `https://${string}` | undefined;
  facebookUrl: `https://${string}` | undefined;
};

export const brand = {
  name: facts.name,
  shortName: facts.shortName,
  city: facts.city,
  addressLine: facts.addressLine,
  address: `${facts.addressLine}, ${facts.city}`,
  phone: facts.primaryPhoneDisplay,
  phoneHref: `tel:${facts.primaryPhone}`,
  appointment: facts.appointment,
  logo: facts.logoPath as `/${string}`,
  youtubeUrl: undefined,
  instagramUrl: undefined,
  facebookUrl: undefined,
  secondaryPhone: facts.secondaryPhoneDisplay,
  secondaryPhoneHref: `tel:${facts.secondaryPhone}`,
  sourceInventory: facts.inventoryUrl,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facts.mapQuery)}`,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(facts.mapQuery)}&z=14&output=embed`,
  hours: facts.hours.label,
  demoNotice: facts.demoNotice,
  availabilityNotice: facts.availabilityNotice
} as const satisfies BrandConfig & Record<string, unknown>;
