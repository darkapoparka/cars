import { dealerProfile } from './dealer-profile';

export type LeadSiteCurrency = 'AED' | 'BGN' | 'EUR' | 'USD';
export interface LeadSiteConfig {
  readonly accent: string; readonly address: string; readonly city: string; readonly contactUrl: string;
  readonly country: string; readonly countryCode: string; readonly currency: LeadSiteCurrency; readonly email: string;
  readonly heroPath: string; readonly locale: string; readonly logoPath: string; readonly mapsEmbedUrl: string;
  readonly mapsUrl: string; readonly name: string; readonly phoneDisplay: string; readonly phoneHref: string;
  readonly shortName: string; readonly slug: string; readonly socialLinks?: Partial<Record<'youtube'|'instagram'|'facebook'|'tiktok', string>>;
  readonly staticDemoMode: boolean; readonly tagline: string;
}
export const leadSite: LeadSiteConfig = {
  accent: dealerProfile.accent,
  address: dealerProfile.address,
  city: dealerProfile.city,
  contactUrl: dealerProfile.phoneHref,
  country: 'България',
  countryCode: 'BG',
  currency: 'EUR',
  email: '',
  heroPath: '/assets/images/lead/inventory-photo-pending.svg',
  locale: 'bg-BG',
  logoPath: dealerProfile.logo,
  mapsEmbedUrl: dealerProfile.mapsEmbedUrl,
  mapsUrl: dealerProfile.mapsUrl,
  name: dealerProfile.name,
  phoneDisplay: dealerProfile.phoneDisplay,
  phoneHref: dealerProfile.phoneHref,
  shortName: dealerProfile.shortName,
  slug: dealerProfile.slug,
  socialLinks: dealerProfile.socialLinks,
  staticDemoMode: true,
  tagline: dealerProfile.tagline,
};
