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
  "accent": "#a50f15",
  "address": "бул. Цар Освободител 110, кв. Победа",
  "city": "Варна",
  "contactUrl": "tel:+359888802226",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/variant-2/assets/perfect-auto/vehicle-02-1.webp",
  "locale": "bg-BG",
  "logoPath": "/variant-2/assets/perfect-auto/cover.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=%D0%9F%D0%B5%D1%80%D1%84%D0%B5%D0%BA%D1%82%20%D0%90%D1%83%D1%82%D0%BE%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20%D0%94%D0%BE%D0%BC%20%D0%BD%D0%B0%20%D0%9A%D0%B0%D0%BC%D0%B8%D0%BE%D0%BD%D0%B0&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=%D0%9F%D0%B5%D1%80%D1%84%D0%B5%D0%BA%D1%82%20%D0%90%D1%83%D1%82%D0%BE%2C%20%D0%B1%D1%83%D0%BB.%20%D0%A6%D0%B0%D1%80%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%B8%D1%82%D0%B5%D0%BB%20110%2C%20%D0%BA%D0%B2.%20%D0%9F%D0%BE%D0%B1%D0%B5%D0%B4%D0%B0",
  "name": "Перфект Ауто",
  "phoneDisplay": "0888 802 226",
  "phoneHref": "tel:+359888802226",
  "shortName": "Перфект Ауто",
  "slug": "perfect-auto-varna",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили от ЕС, внос по поръчка и бартер във Варна."
};
// LEAD_SITE_CONFIG_END
