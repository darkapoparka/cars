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
  "accent": "#bf111d",
  "address": "10511 Olympic Drive, Dallas, TX 75220",
  "city": "Dallas",
  "contactUrl": "tel:+12149723233",
  "country": "United States",
  "countryCode": "US",
  "currency": "USD",
  "email": "",
  "heroPath": "/office.webp",
  "locale": "en-US",
  "logoPath": "/brand/logo-on-light.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=10511%20Olympic%20Drive%2C%20Dallas%2C%20TX%2075220&hl=en&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=10511%20Olympic%20Drive%2C%20Dallas%2C%20TX%2075220",
  "name": "Texas Drive Auto",
  "phoneDisplay": "(214) 972-3233",
  "phoneHref": "tel:+12149723233",
  "shortName": "Texas Drive Auto",
  "slug": "texas-drive-auto",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Used-vehicle listing samples in Dallas. USD prices and miles. No dealer financing or payment plans."
};
// LEAD_SITE_CONFIG_END
