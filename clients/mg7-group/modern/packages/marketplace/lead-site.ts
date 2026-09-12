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
  "accent": "#22252b",
  "address": "Северна промишлена зона, ул. Атанас Буров 7",
  "city": "Бургас",
  "contactUrl": "tel:+359876277777",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/21785564544332885-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%88%D0%BB%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%91%D1%83%D1%80%D0%BE%D0%B2%207%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=MG7%20Group%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D0%B0%20%D0%BF%D1%80%D0%BE%D0%BC%D0%B8%D1%88%D0%BB%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%2C%20%D1%83%D0%BB.%20%D0%90%D1%82%D0%B0%D0%BD%D0%B0%D1%81%20%D0%91%D1%83%D1%80%D0%BE%D0%B2%207%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81",
  "name": "MG7 Group",
  "phoneDisplay": "0876 277 777",
  "phoneHref": "tel:+359876277777",
  "shortName": "MG7 Group",
  "slug": "mg7-group",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Подбрани автомобилни обяви в Бургас. Детайли, сравнение и оглед по уговорка."
};
// LEAD_SITE_CONFIG_END
