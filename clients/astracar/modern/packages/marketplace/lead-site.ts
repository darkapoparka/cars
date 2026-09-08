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
  "accent": "#30343b",
  "address": "бул. „Цар Освободител“ 282",
  "city": "Варна",
  "contactUrl": "tel:+359899908040",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "astracar_2006@abv.bg",
  "heroPath": "/assets/astracar/vehicle-10-1.webp",
  "locale": "bg-BG",
  "logoPath": "/assets/astracar/astracar-logo.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=%D0%90%D1%81%D1%82%D1%80%D0%B0%D0%BA%D0%B0%D1%80%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20282%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=%D0%90%D1%81%D1%82%D1%80%D0%B0%D0%BA%D0%B0%D1%80%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20282%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
  "name": "Астракар",
  "phoneDisplay": "0899 908 040",
  "phoneHref": "tel:+359899908040",
  "shortName": "Астракар",
  "slug": "astracar",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили, бартер и сервизно обслужване във Варна."
};
// LEAD_SITE_CONFIG_END
