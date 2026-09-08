export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {
  readonly accent: string; readonly address: string; readonly city: string;
  readonly contactUrl: string; readonly country: string; readonly countryCode: string;
  readonly currency: LeadSiteCurrency; readonly email: string; readonly heroPath: string;
  readonly locale: string; readonly logoPath: string; readonly mapsEmbedUrl: string;
  readonly mapsUrl: string; readonly name: string; readonly phoneDisplay: string;
  readonly phoneHref: string; readonly shortName: string; readonly slug: string;
  readonly socialLinks?: Partial<Record<"youtube" | "instagram" | "facebook" | "tiktok", string>>;
  readonly staticDemoMode: boolean; readonly tagline: string;
}
const address = "ул. Свобода, на гърба на Гробищен парк, Пазарджик";
// LEAD_SITE_CONFIG_START
export const leadSite: LeadSiteConfig = {
  accent: "#c40101", address, city: "Пазарджик", contactUrl: "tel:+359896781662",
  country: "България", countryCode: "BG", currency: "EUR", email: "",
  heroPath: "/assets/eliqauto/cars/11780254722465322/img-01.webp", locale: "bg-BG",
  logoPath: "/assets/eliqauto/brand/eliq-auto-wordmark-header.png",
  mapsEmbedUrl: `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`,
  mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
  name: "ELIQ AUTO", shortName: "ELIQ AUTO", slug: "eliqauto",
  phoneDisplay: "0896 781 662", phoneHref: "tel:+359896781662",
  socialLinks: { youtube: "https://www.youtube.com/channel/UCGXhr1QYqALiBBQpBYZtpmw" },
  staticDemoMode: true,
  tagline: "ELIQ AUTO · Пазарджик · Демонстрационна селекция по архивни обяви."
};
// LEAD_SITE_CONFIG_END
