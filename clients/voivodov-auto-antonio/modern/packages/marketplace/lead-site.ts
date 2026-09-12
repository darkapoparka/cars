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
  "accent": "#156052",
  "address": "кв. Въстанически — точният адрес се уточнява по телефона",
  "city": "Пловдив",
  "contactUrl": "tel:+359899813628",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/21787584817368418-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=%D0%92%D1%8A%D1%81%D1%82%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=%D0%92%D1%8A%D1%81%D1%82%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2",
  "name": "VOIVODOV AUTO & ANTONIO",
  "phoneDisplay": "0899 813 628",
  "phoneHref": "tel:+359899813628",
  "shortName": "Voivodov",
  "slug": "voivodov-auto-antonio",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобилни обяви в Пловдив. Сравнете детайлите и уговорете оглед."
};
// LEAD_SITE_CONFIG_END
