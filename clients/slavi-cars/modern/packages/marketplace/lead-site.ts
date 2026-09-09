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
  "accent": "#df001b",
  "address": "път E79, след отбивката за Блатино, Дупница",
  "city": "Дупница",
  "contactUrl": "tel:+359895714484",
  "country": "България",
  "countryCode": "BG",
  "currency": "EUR",
  "email": "slavicars@abv.bg",
  "heroPath": "/dealer/stock/21784972577846700-1.webp",
  "locale": "bg-BG",
  "logoPath": "/dealer/brand/logo-light.png",
  "mapsEmbedUrl": "https://www.google.com/maps?q=Slavi%20Cars%20%D0%94%D1%83%D0%BF%D0%BD%D0%B8%D1%86%D0%B0%20E79&output=embed",
  "mapsUrl": "https://www.google.com/maps/search/?api=1&query=Slavi%20Cars%20%D0%94%D1%83%D0%BF%D0%BD%D0%B8%D1%86%D0%B0%20E79",
  "name": "Slavi Cars",
  "phoneDisplay": "0895 714 484",
  "phoneHref": "tel:+359895714484",
  "shortName": "Slavi Cars",
  "slug": "slavi-cars",
  "socialLinks": {},
  "staticDemoMode": true,
  "tagline": "Демо селекция от обяви на Slavi Cars към 09.09.2026 г. Наличността и условията се потвърждават с продавача. Не е жив каталог.",
  "district": "път E79",
  "phone": "0895 714 484",
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=Slavi%20Cars%20%D0%94%D1%83%D0%BF%D0%BD%D0%B8%D1%86%D0%B0%20E79",
  "mapEmbedUrl": "https://www.google.com/maps?q=Slavi%20Cars%20%D0%94%D1%83%D0%BF%D0%BD%D0%B8%D1%86%D0%B0%20E79&output=embed",
  "sourceInventory": "https://slavicars.mobile.bg/",
  "observedAt": "2026-09-09",
  "disclosure": "Демо селекция от обяви на Slavi Cars към 09.09.2026 г. Наличността и условията се потвърждават с продавача. Не е жив каталог.",
  "phoneE164": "+359895714484",
  "phoneDigits": "0895714484",
  "website": "https://slavicars.bg/",
  "accentHover": "#a90015",
  "hours": "Пон.–Съб. 09:00–18:00; неделя след уточнение",
  "hoursNote": "Сайтът и Mobile.bg публикуват различни часове; преди посещение уточнете по телефона.",
  "financeNote": "Сайтът описва съдействие за финансиране, не собствен лизинг. Условията се уточняват с доставчика."
};
// LEAD_SITE_CONFIG_END
