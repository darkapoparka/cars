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
  "accent": "#527b21",
  "address": "бул. „Ян Хунияди“, ъгъла с бул. „Цар Освободител“",
  "city": "Варна",
  "contactUrl": "tel:+359895996559",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/assets/excellent/vehicle-01-1.webp",
  "locale": "bg-BG",
  "logoPath": "/assets/excellent/logo-header.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=Excellent%20Cars%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%20%D0%A5%D1%83%D0%BD%D0%B8%D1%8F%D0%B4%D0%B8%20%D0%B8%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Excellent%20Cars%2C%20%D0%B1%D1%83%D0%BB.%20%D0%AF%D0%BD%20%D0%A5%D1%83%D0%BD%D0%B8%D1%8F%D0%B4%D0%B8%20%D0%B8%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0",
  "name": "Excellent Cars",
  "phoneDisplay": "0895 996 559",
  "phoneHref": "tel:+359895996559",
  "shortName": "Excellent Cars",
  "slug": "excellent-cars",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили, бартер и лизинг по договаряне във Варна."
};
// LEAD_SITE_CONFIG_END
