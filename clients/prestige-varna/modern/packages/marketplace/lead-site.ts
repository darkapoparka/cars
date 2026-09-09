import dealer from '../marketplace-domain/dealer-stock.json';
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
  readonly socialLinks?: Partial<
    Record<"youtube" | "instagram" | "facebook" | "tiktok", string>
  >;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

// LEAD_SITE_CONFIG_START

export const leadSite: LeadSiteConfig = {
  accent: dealer.accent, address: `${dealer.address}, ${dealer.city}`, city: dealer.city,
  contactUrl: `tel:${dealer.phoneE164}`, country: 'България', countryCode: 'BG', currency: 'EUR',
  email: dealer.email, heroPath: '/dealer/media-pending.svg', locale: 'bg-BG', logoPath: '/dealer/logo-pending.svg',
  mapsEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(`${dealer.address}, ${dealer.city}`)}&z=15&hl=bg&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${dealer.address}, ${dealer.city}`)}`,
  name: dealer.name, phoneDisplay: dealer.phone, phoneHref: `tel:${dealer.phoneE164}`,
  shortName: dealer.shortName, slug: "prestige-varna", socialLinks: dealer.socialLinks,
  staticDemoMode: true, tagline: `Автомобилни обяви от ${dealer.name} в ${dealer.city}. Потвърдете статуса преди оглед.`
};
