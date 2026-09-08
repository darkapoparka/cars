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
  "accent": "#df1e2a",
  "address": "Индустриална зона – Юг, Околовръстен път срещу хотел Чиирите",
  "city": "Пловдив",
  "contactUrl": "tel:+359877346262",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "",
  "heroPath": "/dealer/21785829117309786-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/logo.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=K-G%20Team%20Auto%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%93%20%D0%AE%D0%B3%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%20%D0%A7%D0%B8%D0%B8%D1%80%D0%B8%D1%82%D0%B5%2C%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=K-G%20Team%20Auto%2C%20%D0%98%D0%BD%D0%B4%D1%83%D1%81%D1%82%D1%80%D0%B8%D0%B0%D0%BB%D0%BD%D0%B0%20%D0%B7%D0%BE%D0%BD%D0%B0%20%E2%80%93%20%D0%AE%D0%B3%2C%20%D0%9E%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D1%80%D1%8A%D1%81%D1%82%D0%B5%D0%BD%20%D0%BF%D1%8A%D1%82%20%D1%81%D1%80%D0%B5%D1%89%D1%83%20%D1%85%D0%BE%D1%82%D0%B5%D0%BB%20%D0%A7%D0%B8%D0%B8%D1%80%D0%B8%D1%82%D0%B5%2C%20%D0%9F%D0%BB%D0%BE%D0%B2%D0%B4%D0%B8%D0%B2",
  "name": "K-G Team Auto",
  "phoneDisplay": "0877 34 62 62",
  "phoneHref": "tel:+359877346262",
  "shortName": "TEAM AUTO",
  "slug": "kg-team-auto",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Автомобили в Пловдив · датирани обяви · контакт с продавача"
};
// LEAD_SITE_CONFIG_END
