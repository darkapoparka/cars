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
  "accent": "#079b75",
  "address": "ул. Напредък 1, Индустриална зона — Север",
  "city": "Пловдив",
  "contactUrl": "tel:+359885595555",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/11760378435449508-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=%D1%83%D0%BB.%20%D0%9D%D0%B0%D0%BF%D1%80%D0%B5%D0%B4%D1%8A%D0%BA%201%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=icars%20%D1%83%D0%BB.%20%D0%9D%D0%B0%D0%BF%D1%80%D0%B5%D0%B4%D1%8A%D0%BA%201%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2",
  "name": "icars",
  "phoneDisplay": "0885 595 555",
  "phoneHref": "tel:+359885595555",
  "shortName": "icars",
  "slug": "icars-plovdiv",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобилни обяви в Пловдив. Сравнете детайлите и уговорете оглед."
};
// LEAD_SITE_CONFIG_END
