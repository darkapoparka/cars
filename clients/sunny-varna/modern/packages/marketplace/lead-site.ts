import { dealer, mapsEmbedUrl, mapsUrl } from './dealer-profile';

type LeadSiteCurrency = 'AED' | 'BGN' | 'EUR' | 'USD';
export interface LeadSiteConfig {
  readonly accent:string; readonly address:string; readonly city:string;
  readonly contactUrl:string; readonly country:string; readonly countryCode:string;
  readonly currency:LeadSiteCurrency; readonly email:string; readonly heroPath:string;
  readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string;
  readonly mapsUrl:string; readonly name:string; readonly phoneDisplay:string;
  readonly phoneHref:string; readonly shortName:string; readonly slug:string;
  readonly socialLinks?:Partial<Record<'youtube'|'instagram'|'facebook'|'tiktok',string>>;
  readonly staticDemoMode:boolean; readonly tagline:string;
}

export const leadSite:LeadSiteConfig = {
  accent:dealer.accent, address:dealer.address, city:dealer.city,
  contactUrl:dealer.phoneHref, country:dealer.country, countryCode:'BG',
  currency:'EUR', email:'', heroPath:dealer.hero, locale:'bg-BG',
  logoPath:dealer.logo, mapsEmbedUrl, mapsUrl, name:dealer.name,
  phoneDisplay:dealer.phone, phoneHref:dealer.phoneHref, shortName:dealer.shortName,
  slug:dealer.slug, socialLinks:{}, staticDemoMode:true, tagline:dealer.tagline
};
