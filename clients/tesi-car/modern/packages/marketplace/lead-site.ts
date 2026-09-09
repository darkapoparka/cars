import facts from './dealer-facts.json';

export type LeadSiteCurrency = 'AED' | 'BGN' | 'EUR' | 'USD';
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
  readonly socialLinks?: Partial<Record<'youtube' | 'instagram' | 'facebook' | 'tiktok', string>>;
  readonly staticDemoMode: boolean;
  readonly tagline: string;
}

// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: facts.accent,
  address: facts.addressLine,
  city: facts.city,
  contactUrl: `tel:${facts.primaryPhone}`,
  country: facts.country,
  countryCode: facts.countryCode,
  currency: 'EUR',
  email: facts.email ?? '',
  heroPath: facts.vehicles[0].photos[0].sourceUrl,
  locale: facts.locale,
  logoPath: facts.logoPath,
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(facts.mapQuery)}&z=14&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facts.mapQuery)}`,
  name: facts.name,
  phoneDisplay: facts.primaryPhoneDisplay,
  phoneHref: `tel:${facts.primaryPhone}`,
  shortName: facts.shortName,
  slug: facts.slug,
  socialLinks: {},
  staticDemoMode: true,
  tagline: facts.tagline
};
// LEAD_SITE_CONFIG_END
