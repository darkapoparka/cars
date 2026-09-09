import dealer from '../marketplace-domain/testing/dealer-records.json';
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
export const leadSite: LeadSiteConfig = {accent:dealer.accent,address:dealer.address,city:dealer.city,contactUrl:dealer.phoneHref,country:'България',countryCode:'BG',currency:'EUR',email:dealer.email,heroPath:dealer.vehicles[0].images[0],locale:'bg-BG',logoPath:'/dealer/logo-light.png',mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(dealer.mapQuery)}&z=13&output=embed`,mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.mapQuery)}`,name:dealer.name,phoneDisplay:dealer.phone,phoneHref:dealer.phoneHref,shortName:dealer.shortName,slug:dealer.slug,socialLinks:dealer.socialLinks,staticDemoMode:true,tagline:dealer.tagline};
// LEAD_SITE_CONFIG_END
