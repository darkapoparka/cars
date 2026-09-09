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
  "accent": "#46771d",
  "address": "с. Шереметя, обл. Велико Търново",
  "city": "Шереметя",
  "contactUrl": "tel:+359879975969",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/21785176725815752-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/brand/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=FRESH%20MOTORS%20%D0%A8%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%82%D1%8F&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=FRESH%20MOTORS%20%D0%A8%D0%B5%D1%80%D0%B5%D0%BC%D0%B5%D1%82%D1%8F",
  "name": "FRESH MOTORS",
  "phoneDisplay": "0879 975 969",
  "phoneHref": "tel:+359879975969",
  "shortName": "FRESH MOTORS",
  "slug": "fresh-motors-sheremetya",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Демо селекция от обяви на FRESH MOTORS към 09.09.2026 г. Шоурумът е в с. Шереметя. Наличността и условията се потвърждават; това не е жив каталог."
};
// LEAD_SITE_CONFIG_END
