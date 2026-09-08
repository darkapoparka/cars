import source from './navara-data.json';

export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {
  readonly accent: string;
  readonly address: string;
  readonly city: string;
  readonly contactUrl: string;
  readonly country: string;
  readonly countryCode: string;
  readonly currency: LeadSiteCurrency;
  readonly email: string;
  readonly heroPath: string;
  readonly locale: string;
  readonly logoPath: string;
  readonly mapsEmbedUrl: string;
  readonly mapsUrl: string;
  readonly name: string;
  readonly phoneDisplay: string;
  readonly phoneHref: string;
  readonly shortName: string;
  readonly slug: string;
  readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

const business = source.business;
const mapQuery = encodeURIComponent(`${business.name}, ${business.address}`);
// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: '#b42136',
  address: business.addressLine,
  city: business.city,
  contactUrl: `tel:${business.phoneE164}`,
  country: business.country,
  countryCode: business.countryCode,
  currency: 'EUR',
  email: '',
  heroPath: source.vehicles[4].images[1],
  locale: 'bg-BG',
  logoPath: '/navara/wordmark.svg',
  mapsEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&z=14&hl=bg&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
  name: business.name,
  phoneDisplay: business.phoneDisplay,
  phoneHref: `tel:${business.phoneE164}`,
  shortName: business.name,
  slug: business.slug,
  socialLinks: {},
  staticDemoMode: true,
  tagline: 'Автомобили във Варна · Селекция от обяви към 08.09.2026 г.',
};
// LEAD_SITE_CONFIG_END

export const leadData = source;
export const leadPreviewNotice = source.previewNotice;
export const leadInventoryNotice = source.inventoryNotice;
export const leadHoursLabel = 'Работно време не е публикувано. Уточнете посещението по телефона.';
export const getLeadListingSource = (slugOrId: string) => source.vehicles.find(
  vehicle => vehicle.slug === slugOrId || `navara-${vehicle.id}` === slugOrId || vehicle.sourceId === slugOrId
);
