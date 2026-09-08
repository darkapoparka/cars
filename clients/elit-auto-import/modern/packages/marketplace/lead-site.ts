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
  "address": "ул. „Прилеп“ 74А, м-т Пчелина",
  "city": "Варна",
  "contactUrl": "tel:+359887777887",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/assets/elit/cover.png",
  "locale": "bg-BG",
  "logoPath": "/assets/elit/logo.png",
  "mapsEmbedUrl": "https://maps.google.com/maps?q=ELIT%20AUTO%20IMPORT%20EXPORT%2C%20%D0%9F%D1%80%D0%B8%D0%BB%D0%B5%D0%BF%2074%D0%90%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=ELIT%20AUTO%20IMPORT%20EXPORT%2C%20%D0%9F%D1%80%D0%B8%D0%BB%D0%B5%D0%BF%2074%D0%90%2C%20%D0%92%D0%B0%D1%80%D0%BD%D0%B0%2C%20%D0%91%D1%8A%D0%BB%D0%B3%D0%B0%D1%80%D0%B8%D1%8F",
  "name": "ELIT AUTO IMPORT EXPORT",
  "phoneDisplay": "0887 777 887",
  "phoneHref": "tel:+359887777887",
  "shortName": "ELIT AUTO",
  "slug": "elit-auto-import",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Внос от Европа, САЩ и Япония. Автомобили във Варна."
};
// LEAD_SITE_CONFIG_END
