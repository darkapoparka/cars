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
  "accent": "#222222",
  "address": "бул. „Цар Освободител“ 256",
  "city": "Варна",
  "contactUrl": "tel:+359878720035",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/assets/ivo-auto/vehicle-01-1.webp",
  "locale": "bg-BG",
  "logoPath": "/assets/ivo-auto/wordmark.svg",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=%D0%98%D0%B2%D0%BE%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20256%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=%D0%98%D0%B2%D0%BE%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20256%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0",
  "name": "Иво Ауто",
  "phoneDisplay": "0878 720 035",
  "phoneHref": "tel:+359878720035",
  "shortName": "Иво Ауто",
  "slug": "ivo-auto",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили във Варна. Наличност и условия по телефона."
};
// LEAD_SITE_CONFIG_END
