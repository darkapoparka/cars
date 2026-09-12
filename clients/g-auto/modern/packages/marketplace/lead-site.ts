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
  "accent": "#1557ed",
  "address": "Струмско",
  "city": "Благоевград",
  "contactUrl": "tel:+359896645757",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/11788689271506791-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/brand/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=G%20Auto%2C%20%D0%A1%D1%82%D1%80%D1%83%D0%BC%D1%81%D0%BA%D0%BE%2C%20%D0%91%D0%BB%D0%B0%D0%B3%D0%BE%D0%B5%D0%B2%D0%B3%D1%80%D0%B0%D0%B4&output=embed",
  "mapsUrl": "https://maps.app.goo.gl/gBXD96zNkDfLdaTi7",
  "name": "G Auto",
  "phoneDisplay": "0896 645 757",
  "phoneHref": "tel:+359896645757",
  "shortName": "G Auto",
  "slug": "g-auto",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили в Благоевград · Обяви, снимки и разговор за оглед."
};
// LEAD_SITE_CONFIG_END
