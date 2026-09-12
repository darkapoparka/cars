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
  "accent": "#d62220",
  "address": "Цариградско шосе, до бензиностанция Алпи",
  "city": "Пловдив",
  "contactUrl": "tel:+359885232858",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/stock/11788863173361582-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/brand/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=42.1485358,24.8280636&z=16&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=42.1485358%2C24.8280636",
  "name": "Крис Кар",
  "phoneDisplay": "0885 232 858",
  "phoneHref": "tel:+359885232858",
  "shortName": "Крис Кар",
  "slug": "kris-car-plovdiv",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Демонстрационен каталог с 8 обяви към 09.09.2026 г. Наличността и условията се потвърждават с автокъщата."
};
// LEAD_SITE_CONFIG_END
