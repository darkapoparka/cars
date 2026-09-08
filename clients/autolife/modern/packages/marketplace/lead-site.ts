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
  "accent": "#a46d24",
  "address": "ГП4, разклон за с. Тополи",
  "city": "Варна",
  "contactUrl": "tel:+359895766736",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/assets/autolife/cover.jpg",
  "locale": "bg-BG",
  "logoPath": "/assets/autolife/wordmark.svg",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=43.22861,27.8253778&z=15&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=43.22861,27.8253778",
  "name": "Аутолайф",
  "phoneDisplay": "0895 766 736",
  "phoneHref": "tel:+359895766736",
  "shortName": "Аутолайф",
  "slug": "autolife",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили във Варна. ГП4, разклон за Тополи."
};
// LEAD_SITE_CONFIG_END
