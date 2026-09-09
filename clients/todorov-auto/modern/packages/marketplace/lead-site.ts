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
  "accent": "#133ab9",
  "address": "Изгрев, ул. Транспортна, 5-ти километър",
  "city": "Бургас",
  "contactUrl": "tel:+359888417282",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/11763371717307272-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=%D0%98%D0%B7%D0%B3%D1%80%D0%B5%D0%B2%2C%20%D1%83%D0%BB.%20%D0%A2%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BD%D0%B0%2C%205-%D1%82%D0%B8%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%BC%D0%B5%D1%82%D1%8A%D1%80%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=%D0%90%D0%B2%D1%82%D0%BE%D1%81%D0%B0%D0%BB%D0%BE%D0%BD%20%D0%A2%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%20%D0%98%D0%B7%D0%B3%D1%80%D0%B5%D0%B2%2C%20%D1%83%D0%BB.%20%D0%A2%D1%80%D0%B0%D0%BD%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%BD%D0%B0%2C%205-%D1%82%D0%B8%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%BC%D0%B5%D1%82%D1%8A%D1%80%20%D0%91%D1%83%D1%80%D0%B3%D0%B0%D1%81",
  "name": "Автосалон Тодоров",
  "phoneDisplay": "0888 417 282",
  "phoneHref": "tel:+359888417282",
  "shortName": "Тодоров",
  "slug": "todorov-auto",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили в Бургас. Изберете, сравнете и уговорете оглед."
};
// LEAD_SITE_CONFIG_END
