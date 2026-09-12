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
  "accent": "#6a5038",
  "address": "Цариградско шосе, Индустриална зона — Тракия",
  "city": "Пловдив",
  "contactUrl": "tel:+359877333433",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/11788284441880300-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=%D0%A6%D0%B0%D1%80%D0%B8%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%20%D1%88%D0%BE%D1%81%D0%B5%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A2%D1%80%D0%B0%D0%BA%D0%B8%D1%8F%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Success%20Automobile%20%D0%A6%D0%B0%D1%80%D0%B8%D0%B3%D1%80%D0%B0%D0%B4%D1%81%D0%BA%D0%BE%20%D1%88%D0%BE%D1%81%D0%B5%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%94%20%D0%A2%D1%80%D0%B0%D0%BA%D0%B8%D1%8F%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2",
  "name": "Success Automobile",
  "phoneDisplay": "0877 333 433",
  "phoneHref": "tel:+359877333433",
  "shortName": "Success",
  "slug": "success-automobile",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили в Пловдив. Разгледайте детайлите и уговорете оглед."
};
// LEAD_SITE_CONFIG_END
